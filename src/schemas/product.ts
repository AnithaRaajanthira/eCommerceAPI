import { z } from "zod/v4";
import { dbEntrySchema } from "./shared.ts";
import { isValidObjectId } from "mongoose";

const productInputSchema = z.strictObject({
  name: z.string().trim().min(1, "Please enter valid name for the product"),
  price: z.number().min(1),
  description: z.string().trim().max(255, "Maximum 255 characters long"),
  categoryId: z.string().refine((val) => isValidObjectId(val), "Invalid Category ID"),
});

const productSchema = z.strictObject({
  ...productInputSchema.shape,
  ...dbEntrySchema.shape,
});

export { productInputSchema, productSchema };
