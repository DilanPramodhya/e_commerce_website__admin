import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { cartItems, customer } = await req.json();

    if (!cartItems || !customer) {
      return new NextResponse("Not enough data to checkout", { status: 400 });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["SL", "AU", "NZ", "UA", "RS"],
      },
      shipping_options: [
        { shipping_rate: "shr_1Pfc4XAVVMSp6Huqnd6RVVbh" },
        { shipping_rate: "shr_1Pfc0WAVVMSp6Huqlm4gQFNW" },
        { shipping_rate: "shr_1Pfc5qAVVMSp6HuqAusBHCdr" },
        { shipping_rate: "shr_1Pfc5BAVVMSp6HuqPqt6XSIk" },
      ],
      line_items: cartItems.map((cartItem: any) => ({
        price_data: {
          currency: "lkr",
          product_data: {
            name: cartItem.item.title,
            metadata: {
              productId: cartItem.item._id,
              ...(cartItem.size && { size: cartItem.size }),
              ...(cartItem.color && { color: cartItem.color }),
            },
          },
          unit_amount: cartItem.item.price * 100,
        },
        quantity: cartItem.quantity,
      })),
      client_reference_id: customer.clerkId,
      success_url: `${process.env.ECOMMERCE_STORE_URL}/payment_success`,
      cancel_url: `${process.env.ECOMMERCE_STORE_URL}/payment_cancel`,
    });

    return NextResponse.json(session, { headers: corsHeaders });
  } catch (error) {
    console.log("checkout_POST", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
