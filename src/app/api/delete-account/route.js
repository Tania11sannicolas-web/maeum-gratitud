import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

    return NextResponse.json({ success: true, message: "Cuenta eliminada correctamente" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}