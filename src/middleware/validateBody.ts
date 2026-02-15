import type { RequestHandler } from "express";
import { z, type ZodObject } from "zod/v4";
const validateBody = (zodSchema: ZodObject): RequestHandler => {
  return (req, res, next) => {
    if (!req.body) throw new Error("Body is required", { cause: { status: 400 } });
    const { data, success, error } = zodSchema.safeParse(req.body);
    if (!success) {
      next(new Error(z.prettifyError(error), { cause: { status: 400 } }));
    } else {
      req.body = data;
      next();
    }
  };
};

export default validateBody;
