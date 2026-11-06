import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const baseUrl = process.env.PAYPAL_BASE_URL;

  if (!clientId || !clientSecret || !baseUrl) {
    return NextResponse.json(
      {
        success: false,
        message: "PayPal environment variables are missing.",
      },
      { status: 500 }
    );
  }

  try {
    const credentials = Buffer.from(
      `${clientId}:${clientSecret}`
    ).toString("base64");

    const response = await fetch(
      `${baseUrl}/v1/oauth2/token`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "PayPal authentication failed.",
          paypalStatus: response.status,
        },
        { status: 502 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: "Successfully connected to PayPal Sandbox!",
      tokenType: data.token_type,
      expiresIn: data.expires_in,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to PayPal Sandbox.",
      },
      { status: 500 }
    );
  }
}