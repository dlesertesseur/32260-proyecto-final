import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
  status: { type: String, require: true, default: "created" },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
      quantity: { type: Number, require: true, default: 0 },
    },
  ],
});

export default cartSchema;
