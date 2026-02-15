import { model, Schema } from "mongoose";

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, "Category Name is required"],
    trim: true,
  },
});

export default model("Category", categorySchema);
