import { z } from "zod/v4";
import { dbEntrySchema } from "./shared.ts";
import { isValidObjectId } from "mongoose";

const orderInputSchema = z.strictObject({
  userId: z.string().refine((val) => isValidObjectId(val), "Invalid User ID"),
  products: z.array(
    z.object({
      productId: z.string().refine((val) => isValidObjectId(val), "Invalid product ID"),
      quantity: z.number().min(1, "Quantity should be atleast 1"),
    }),
  ),

  total: z.number(),
});

const orderSchema = z.strictObject({
  ...orderInputSchema.shape,
  ...dbEntrySchema.shape,
});

export { orderInputSchema, orderSchema };
