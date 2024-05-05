const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    productName: { type: String, required: true },
    images: [{ type: String }], // Array of image URLs
    description: { type: String },
    minimumPrice: { type: Number },
    biddingStartDate: { type: Date, required: true },
    biddingDuration: { type: Number, required: true }, // Duration of bidding in minutes
    biddingType: {
      type: String,
      enum: ["Type 1", "Type 2", "Type 3", "Type 4", "Type 5"],
      required: true,
    }, // Type of bidding
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  },
  {
    timestamps: true,
  }
);


productSchema.pre("save", function (next) {
  // Calculate bidding end date based on bidding start date and duration
  if (this.isNew) {
    // Only calculate if the product is being newly created
    const durationInMillis = this.biddingDuration * 60 * 1000; // Convert minutes to milliseconds
    this.biddingEndDate = new Date(
      this.biddingStartDate.getTime() + durationInMillis
    );
  }
  next();
});
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
