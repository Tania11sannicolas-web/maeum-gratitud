import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const getEmailTemplate = (lang, type) => {
  const l = ['es', 'ko', 'fr'].includes(lang) ? lang : 'en';

  const content = {
    es: {
      successSub: 'Bienvenido a tu Refugio Premium — Maeum',
      successTitle: 'Refugio Profundo Activado',
      successText: 'Tu pago se ha procesado con éxito. Ya disfrutas de tu espacio profundo y pausas extendidas en Maeum.',
      failSub: 'Actualización sobre tu suscripción — Maeum',
      failTitle: 'Aviso de Renovación',
      failText: 'Hubo un problema con el cobro de tu renovación y tu cuenta ha regresado al plan Free.',
      delSub: 'Tu suscripción ha finalizado — Maeum',
      delTitle: 'Periodo Concluido',
      delText: 'Tu periodo Premium ha concluido y tu cuenta ha regresado al plan Free.',
      footer: 'Este es un mensaje automático.'
    },
    ko: {
      successSub: '프리미엄 피난처에 오신 것을 환영합니다 — 마음 (Maeum)',
      successTitle: '깊은 피난처 활성화됨',
      successText: '결제가 성공적으로 처리되었습니다.',
      failSub: '구독 업데이트 알림 — 마음 (Maeum)',
      failTitle: '결제 갱신 알림',
      failText: '갱신 결제에 문제가 발생했습니다.',
      delSub: '구독이 종료되었습니다 — 마음 (Maeum)',
      delTitle: '이용 기간 종료',
      delText: '이용 기간이 종료되었습니다.',
      footer: '발신 전용입니다.'
    },
    fr: {
      successSub: 'Bienvenue dans votre Refuge Premium — Maeum',
      successTitle: 'Refuge Profond Activé',
      successText: 'Votre paiement a été traité avec succès.',
      failSub: 'Mise à jour concernant votre abonnement — Maeum',
      failTitle: 'Avis de Renouvellement',
      failText: 'Un problème est survenu.',
      delSub: 'Votre abonnement est terminé — Maeum',
      delTitle: 'Période Terminée',
      delText: 'Votre période est terminée.',
      footer: 'Message automatique.'
    },
    en: {
      successSub: 'Welcome to your Premium Refuge — Maeum',
      successTitle: 'Deep Refuge Activated',
      successText: 'Your payment has been successfully processed.',
      failSub: 'Subscription Update — Maeum',
      failTitle: 'Renewal Notice',
      failText: 'There was an issue processing your renewal.',
      delSub: 'Your subscription has ended — Maeum',
      delTitle: 'Period Concluded',
      delText: 'Your Premium period has concluded.',
      footer: 'Automated message.'
    }
  };

  const t = content[l];
  let title = type === 'success' ? t.successTitle : type === 'fail' ? t.failTitle : t.delTitle;
  let text = type === 'success' ? t.successText : type === 'fail' ? t.failText : t.delText;
  let subject = type === 'success' ? t.successSub : type === 'fail' ? t.failSub : t.delSub;

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: sans-serif; text-align: center; padding: 40px;">
      <h2>${title}</h2>
      <p>${text}</p>
      <br><small>${t.footer}</small>
    </body>
    </html>
  `;

  return { subject, html };
};

export async function POST(req) {
  console.log("=== INICIO WEBHOOK STRIPE ===");
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Error firma webhook:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log("Evento procesado:", event.type);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const customerId = session.customer;
    console.log("Checkout completado para User ID:", userId);

    if (userId) {
      await supabaseAdmin.from('profiles').update({ plan: 'premium', stripe_customer_id: customerId }).eq('id', userId);
      const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(userId);
      
      if (user?.email) {
        const lang = user?.user_metadata?.lang || 'es';
        const { subject, html } = getEmailTemplate(lang, 'success');
        try {
          const res = await resend.emails.send({
            from: 'Maeum <hola@maeumgratitud.com>',
            to: user.email,
            subject,
            html
          });
          console.log("Resend OK (Success):", res);
        } catch (e) {
          console.error("Resend Error (Success):", e);
        }
      }
    }
  } else if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    const customerId = subscription.customer;
    console.log("Suscripción actualizada/eliminada para Customer ID:", customerId);

    if (event.type === 'customer.subscription.deleted') {
      await supabaseAdmin.from('profiles').update({ plan: 'free' }).eq('stripe_customer_id', customerId);
    }

    const { data: profile } = await supabaseAdmin.from('profiles').select('id').eq('stripe_customer_id', customerId).single();

    if (profile?.id) {
      const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(profile.id);
      if (user?.email) {
        const lang = user?.user_metadata?.lang || 'es';
        const { subject, html } = getEmailTemplate(lang, 'delete');
        try {
          const res = await resend.emails.send({
            from: 'Maeum <hola@maeumgratitud.com>',
            to: user.email,
            subject,
            html
          });
          console.log("Resend OK (Delete):", res);
        } catch (e) {
          console.error("Resend Error (Delete):", e);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}