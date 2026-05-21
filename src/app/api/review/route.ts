import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Rating from "@/src/models/Rating";
import Order from "../../../models/Order";

export async function POST(req: Request) {
  try {
    const { orderID, rating, comment, uploadedUrls } = await req.json();

    // Validation
    if (!rating || !orderID) {
      return NextResponse.json(
        {
          success: false,
          message: "Rating & orderId is required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    await Order.findByIdAndUpdate(orderID, {
      $set: {
        reviewAdded: true,
      },
    });

    const newRating = await Rating.create({
      rating,
      comment,
      uploadedUrls,
    });

    // Check if document was created
    if (!newRating || !newRating._id) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create rating",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Rating created successfully",
        rating: newRating,
      },
      { status: 201 }
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
