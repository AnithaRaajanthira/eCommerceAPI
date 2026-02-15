import { z } from "zod/v4";
import { dbEntrySchema } from "./shared.ts";

const categoryInputSchema = z.strictObject({
  name: z.string().trim().min(1, "Please enter a valid category name"),
});

const categorySchema = z.strictObject({
  ...dbEntrySchema.shape,
  ...categoryInputSchema.shape,
});

export { categoryInputSchema, categorySchema };
