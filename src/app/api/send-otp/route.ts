import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    console.log("request accepted, this is phone : ", phone);

    // await client.verify.v2
    //   .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
    //   .verifications.create({
    //     to: `+91${phone}`,
    //     channel: "sms",
    //   });

    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}
