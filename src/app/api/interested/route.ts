import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Interested from "../../../models/Intrested";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const interested = await Interested.create(body);

    return NextResponse.json({
      success: true,
      interested,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
