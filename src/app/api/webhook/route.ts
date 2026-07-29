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

// Función auxiliar para generar el HTML con diseño corporativo y multiidioma
const getEmailTemplate = (lang, type) => {
  const l = ['es', 'ko', 'fr'].includes(lang) ? lang : 'en';

  const content = {
    es: {
      successSub: 'Bienvenido a tu Refugio Premium — Maeum',
      successTitle: 'Refugio Profundo Activado',
      successText: 'Tu pago se ha procesado con éxito. Ya disfrutas de tu espacio profundo y pausas extendidas en Maeum.',
      failSub: 'Actualización sobre tu suscripción — Maeum',
      failTitle: 'Aviso de Renovación',
      failText: 'Hubo un problema con el cobro de tu renovación y tu cuenta ha regresado al plan Free. Puedes actualizar tu método de pago en cualquier momento desde tu perfil.',
      delSub: 'Tu suscripción ha finalizado — Maeum',
      delTitle: 'Periodo Concluido',
      delText: 'Tu periodo Premium ha concluido y tu cuenta ha regresado al plan Free. Esperamos que hayas disfrutado de tu refugio y verte pronto de nuevo.',
      footer: 'Este es un mensaje automático, por favor no respondas a este correo.'
    },
    ko: {
      successSub: '프리미엄 피난처에 오신 것을 환영합니다 — 마음 (Maeum)',
      successTitle: '깊은 피난처 활성화됨',
      successText: '결제가 성공적으로 처리되었습니다. 이제 마음(Maeum)에서 깊은 공간과 연장된 휴식을 즐기실 수 있습니다.',
      failSub: '구독 업데이트 알림 — 마음 (Maeum)',
      failTitle: '결제 갱신 알림',
      failText: '갱신 결제에 문제가 발생하여 계정이 무료(Free) 플랜으로 전환되었습니다. 프로필에서 언제든지 결제 수단을 업데이트하실 수 있습니다.',
      delSub: '구독이 종료되었습니다 — 마음 (Maeum)',
      delTitle: '이용 기간 종료',
      delText: '프리미엄 이용 기간이 종료되어 계정이 무료(Free) 플랜으로 전환되었습니다. 그동안 피난처를 즐겨주셨길 바라며 곧 다시 뵙기를 바랍니다.',
      footer: '본 메일은 발신 전용입니다.'
    },
    fr: {
      successSub: 'Bienvenue dans votre Refuge Premium — Maeum',
      successTitle: 'Refuge Profond Activé',
      successText: 'Votre paiement a été traité avec succès. Vous profitez désormais de votre espace profond et de pauses prolongées sur Maeum.',
      failSub: 'Mise à jour concernant votre abonnement — Maeum',
      failTitle: 'Avis de Renouvellement',
      failText: "Un problème est survenu lors du prélèvement de votre renouvellement et votre compte est repassé au plan Free. Vous pouvez mettre à jour votre moyen de paiement à tout moment depuis votre profil.",
      delSub: 'Votre abonnement est terminé — Maeum',
      delTitle: 'Période Terminée',
      delText: 'Votre période Premium est terminée et votre compte est repassé au plan Free. Nous espérons que vous avez apprécié votre refuge et espérons vous revoir bientôt.',
      footer: 'Ceci est un message automatique, merci de ne pas y répondre.'
    },
    en: {
      successSub: 'Welcome to your Premium Refuge — Maeum',
      successTitle: 'Deep Refuge Activated',
      successText: 'Your payment has been successfully processed. You now enjoy your deep space and extended pauses on Maeum.',
      failSub: 'Subscription Update — Maeum',
      failTitle: 'Renewal Notice',
      failText: 'There was an issue processing your renewal payment and your account has returned to the Free plan. You can update your payment method anytime from your profile.',
      delSub: 'Your subscription has ended — Maeum',
      delTitle: 'Period Concluded',
      delText: 'Your Premium period has concluded and your account has returned to the Free plan. We hope you enjoyed your refuge and look forward to seeing you again soon.',
      footer: 'This is an automated message, please do not reply.'
    }
  };

  const t = content[l];
  let title = '';
  let text = '';
  let subject = '';

  if (type === 'success') {
    title = t.successTitle;
    text = t.successText;
    subject = t.successSub;
  } else if (type === 'fail') {
    title = t.failTitle;
    text = t.failText;
    subject = t.failSub;
  } else {
    title = t.delTitle;
    text = t.delText;
    subject = t.delSub;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          background-color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #262626;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 480px;
          margin: 40px auto;
          padding: 40px 20px;
          text-align: center;
        }
        .logo {
          font-size: 16px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 32px;
          color: #171717;
          font-weight: 300;
        }
        .title {
          font-size: 14px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #737373;
          margin-bottom: 16px;
          font-weight: 300;
        }
        .text {
          font-size: 14px;
          line-height: 1.6;
          color: #525252;
          margin-bottom: 32px;
          font-weight: 300;
        }
        .footer {
          margin-top: 48px;
          font-size: 11px;
          color: #a3a3a3;
          letter-spacing: 0.05em;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">${l === 'ko' ? '마음 (Maeum)' : 'Maeum Gratitude'}</div>
        <div class="title">${title}</div>
        <p class="text">${text}</p>
        <div class="footer">${t.footer}</div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
};

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata.userId;
      const customerId = session.customer;

      await supabaseAdmin
        .from('profiles')
        .update({ plan: 'premium', stripe_customer_id: customerId })
        .eq('id', userId);

      let userEmail = null;
      let userLang = 'es';
      if (userId) {
        const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(userId);
        if (user?.email) userEmail = user.email;
        if (user?.user_metadata?.lang) userLang = user.user_metadata.lang;
      }

      if (userEmail) {
        try {
          const { subject, html } = getEmailTemplate(userLang, 'success');
          await resend.emails.send({
            from: 'Maeum <hola@maeumgratitud.com>',
            to: userEmail,
            subject: subject,
            html: html
          });
        } catch (emailErr) {
          console.error("Error al enviar correo de éxito:", emailErr.message);
        }
      }
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      const customerId = invoice.customer;

      await supabaseAdmin
        .from('profiles')
        .update({ plan: 'free' })
        .eq('stripe_customer_id', customerId);

      let userEmail = null;
      let userLang = 'es';
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

      if (profile?.id) {
        const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(profile.id);
        if (user?.email) userEmail = user.email;
        if (user?.user_metadata?.lang) userLang = user.user_metadata.lang;
      }

      if (userEmail) {
        try {
          const { subject, html } = getEmailTemplate(userLang, 'fail');
          await resend.emails.send({
            from: 'Maeum <hola@maeumgratitud.com>',
            to: userEmail,
            subject: subject,
            html: html
          });
        } catch (emailErr) {
          console.error("Error al enviar correo de fallo:", emailErr.message);
        }
      }
      break;
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      const customerId = subscription.customer;

      // Si se actualizó la suscripción desde el portal (por ejemplo, solicitando cancelación)
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

      if (profile?.id) {
        const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(profile.id);
        if (user?.email) {
          const userEmail = user.email;
          const userLang = user?.user_metadata?.lang || 'es';
          try {
            const { subject, html } = getEmailTemplate(userLang, 'delete');
            await resend.emails.send({
              from: 'Maeum <hola@maeumgratitud.com>',
              to: userEmail,
              subject: subject,
              html: html
            });
          } catch (emailErr) {
            console.error("Error al enviar correo de cancelación:", emailErr.message);
          }
        }
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const customerId = subscription.customer;

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

      await supabaseAdmin
        .from('profiles')
        .update({ plan: 'free' })
        .eq('stripe_customer_id', customerId);

      if (profile?.id) {
        const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(profile.id);
        if (user?.email) {
          const userEmail = user.email;
          const userLang = user?.user_metadata?.lang || 'es';
          try {
            const { subject, html } = getEmailTemplate(userLang, 'delete');
            await resend.emails.send({
              from: 'Maeum <hola@maeumgratitud.com>',
              to: userEmail,
              subject: subject,
              html: html
            });
          } catch (emailErr) {
            console.error("Error al enviar correo de cancelación:", emailErr.message);
          }
        }
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}