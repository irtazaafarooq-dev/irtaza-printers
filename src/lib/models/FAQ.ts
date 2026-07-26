import mongoose, { Schema, models } from "mongoose";

const FAQSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 }, // controls display order on homepage
  },
  { timestamps: true }
);

const FAQ = models.FAQ || mongoose.model("FAQ", FAQSchema);
export default FAQ;