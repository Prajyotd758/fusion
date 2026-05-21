import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Order from "../../../models/Order";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    console.log("this is body : ", body);

    const order = await Order.create(body);

    return NextResponse.json({
      success: true,
      order,
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
