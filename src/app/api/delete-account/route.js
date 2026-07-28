import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // 0. Obtenemos el usuario y sus metadatos (para detectar su idioma) antes de borrarlo
    const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(userId);
    const userEmail = user?.email;
    const userLang = user?.user_metadata?.lang || 'es';

    // 1. Buscamos si el usuario tiene un stripe_customer_id registrado en Supabase
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    // 2. Si tiene ID de cliente en Stripe, cancelamos sus suscripciones activas
    if (profile?.stripe_customer_id) {
      try {
        const subscriptions = await stripe.subscriptions.list({
          customer: profile.stripe_customer_id,
          status: 'active',
        });

        for (const sub of subscriptions.data) {
          await stripe.subscriptions.cancel(sub.id);
        }
      } catch (stripeErr) {
        console.error("Error al cancelar suscripción en Stripe:", stripeErr.message);
      }
    }

    // 3. Borramos los registros de la galería (user_likes) del usuario
    await supabaseAdmin
      .from('user_likes')
      .delete()
      .eq('user_id', userId);

    // 4. Borramos el perfil de la tabla profiles
    await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    // 5. Borramos al usuario por completo de Supabase Auth
    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteAuthError) {
      return NextResponse.json({ error: deleteAuthError.message }, { status: 400 });
    }

    // 6. Generamos el HTML del correo multilenguaje basado en tu diseño
    let emailHtml = '';
    let emailSubject = 'Cuenta eliminada — Maeum';

    if (userLang === 'es') {
      emailSubject = 'Cuenta eliminada — Maeum Gratitud';
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><style>body{background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#262626;margin:0;padding:0}.container{max-width:480px;margin:40px auto;padding:40px 20px;text-align:center}.logo{font-size:16px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:32px;color:#171717;font-weight:300}.title{font-size:14px;letter-spacing:0.1em;text-transform:uppercase;color:#737373;margin-bottom:16px;font-weight:300}.text{font-size:14px;line-height:1.6;color:#525252;margin-bottom:32px;font-weight:300}.footer{margin-top:48px;font-size:11px;color:#a3a3a3;letter-spacing:0.05em}</style></head>
        <body><div class="container">
          <div class="logo">Maeum Gratitud</div>
          <div class="title">Cuenta eliminada</div>
          <p class="text">Te confirmamos que tu cuenta, galería y datos personales han sido eliminados por completo de Maeum. Lamentamos verte partir.</p>
          <div class="footer">Este es un mensaje automático, por favor no respondas a este correo.</div>
        </div></body></html>
      `;
    } else if (userLang === 'ko') {
      emailSubject = '계정이 삭제되었습니다 — 마음 (Maeum)';
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><style>body{background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#262626;margin:0;padding:0}.container{max-width:480px;margin:40px auto;padding:40px 20px;text-align:center}.logo{font-size:16px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:32px;color:#171717;font-weight:300}.title{font-size:14px;letter-spacing:0.1em;text-transform:uppercase;color:#737373;margin-bottom:16px;font-weight:300}.text{font-size:14px;line-height:1.6;color:#525252;margin-bottom:32px;font-weight:300}.footer{margin-top:48px;font-size:11px;color:#a3a3a3;letter-spacing:0.05em}</style></head>
        <body><div class="container">
          <div class="logo">마음 (Maeum)</div>
          <div class="title">계정 삭제 완료</div>
          <p class="text">회원님의 계정, 갤러리 및 모든 개인 데이터가 마음(Maeum)에서 완전히 삭제되었음을 확인해 드립니다. 함께해주셔서 감사했습니다.</p>
          <div class="footer">본 메일은 발신 전용입니다.</div>
        </div></body></html>
      `;
    } else if (userLang === 'fr') {
      emailSubject = 'Compte supprimé — Maeum Gratitude';
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><style>body{background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#262626;margin:0;padding:0}.container{max-width:480px;margin:40px auto;padding:40px 20px;text-align:center}.logo{font-size:16px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:32px;color:#171717;font-weight:300}.title{font-size:14px;letter-spacing:0.1em;text-transform:uppercase;color:#737373;margin-bottom:16px;font-weight:300}.text{font-size:14px;line-height:1.6;color:#525252;margin-bottom:32px;font-weight:300}.footer{margin-top:48px;font-size:11px;color:#a3a3a3;letter-spacing:0.05em}</style></head>
        <body><div class="container">
          <div class="logo">Maeum Gratitude</div>
          <div class="title">Compte supprimé</div>
          <p class="text">Nous vous confirmons que votre compte, votre galerie et vos données personnelles ont été entièrement supprimés de Maeum. Nous regrettons de vous voir partir.</p>
          <div class="footer">Ceci est un message automatique, merci de ne pas y répondre.</div>
        </div></body></html>
      `;
    } else {
      // English (Default)
      emailSubject = 'Account deleted — Maeum Gratitude';
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><style>body{background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#262626;margin:0;padding:0}.container{max-width:480px;margin:40px auto;padding:40px 20px;text-align:center}.logo{font-size:16px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:32px;color:#171717;font-weight:300}.title{font-size:14px;letter-spacing:0.1em;text-transform:uppercase;color:#737373;margin-bottom:16px;font-weight:300}.text{font-size:14px;line-height:1.6;color:#525252;margin-bottom:32px;font-weight:300}.footer{margin-top:48px;font-size:11px;color:#a3a3a3;letter-spacing:0.05em}</style></head>
        <body><div class="container">
          <div class="logo">Maeum Gratitude</div>
          <div class="title">Account deleted</div>
          <p class="text">We confirm that your account, gallery, and personal data have been completely deleted from Maeum. We are sorry to see you go.</p>
          <div class="footer">This is an automated message, please do not reply.</div>
        </div></body></html>
      `;
    }

    // 7. Enviamos el correo de confirmación de eliminación con Resend
    if (userEmail) {
      try {
        await resend.emails.send({
          from: 'Maeum <onboarding@resend.dev>',
          to: userEmail,
          subject: emailSubject,
          html: emailHtml
        });
      } catch (emailErr) {
        console.error("Error al enviar correo de eliminación:", emailErr.message);
      }
    }

    return NextResponse.json({ success: true, message: "Cuenta eliminada correctamente" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}