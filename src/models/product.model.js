import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, required: true },
  stock: { type: Number, required: true },

  //category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
  category: { type: String, required: true },

  thumbnail: { type: [String], required: true },
  //owner: { type: mongoose.Schema.Types.ObjectId, ref: "user"},
  owner: { type: String, default:"admin"},
});

export default productSchema;
