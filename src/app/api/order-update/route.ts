import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Order from "../../../models/Order";

export async function POST(req: Request) {
  try {
    const { orderID, action, reason, comment, uploadedUrls, uploadedVideoUrl } =
      await req.json();

    // Basic validation
    if (!orderID) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID is required",
        },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        {
          success: false,
          message: "Action is required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const status =
      action === "return" ? "return_initiated" : "replacement_initiated";

    const updatedOrder = await Order.findByIdAndUpdate(
      orderID,
      {
        $set: {
          status,
          reason,
          comment,
          uploadedUrls,
          uploadedVideoUrl,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    // Check if document exists / updated
    if (!updatedOrder) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found or update failed",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order updated successfully",
        order: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
