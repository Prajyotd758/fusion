import mongoose from "mongoose";

const interestedSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Interested =
  mongoose.models.Interested || mongoose.model("Interested", interestedSchema);

export default Interested;