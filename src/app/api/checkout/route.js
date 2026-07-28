import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');
    const interval = url.searchParams.get('interval'); // 'month' o 'year'

    // Define aquí tus dos Price IDs reales de Stripe
    const monthlyPriceId = 'price_1TyEzYA474woCtDPfWoKCzhj'; // 3 dólares al mes
    const yearlyPriceId = 'price_1TyF0DA474woCtDPbwb7C1l5';     // 33 dólares al año

    // Selecciona el precio según lo que el usuario eligió
    const selectedPrice = interval === 'year' ? yearlyPriceId : monthlyPriceId;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedPrice,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?canceled=true`,
      metadata: {
        userId: userId || "",
      }
    });

    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}