import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    // const verificationCheck = await client.verify.v2
    //   .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
    //   .verificationChecks.create({
    //     to: `+91${phone}`,
    //     code: otp,
    //   });

    console.log("phone and otp : ", phone + " " + otp);

    return NextResponse.json({
      //   verified: verificationCheck.status === "approved",
      verified: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        verified: false,
      },
      { status: 500 }
    );
  }
}
