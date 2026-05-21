import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: null,
    },
    uploadedUrls: {
      type: [String],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Rating = mongoose.models.Rating || mongoose.model("Rating", ratingSchema);

export default Rating;
