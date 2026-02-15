import { Router } from "express";
import { getProduct, createProduct, getProductById, updateProduct, deleteProduct } from "#controllers";

const productRouter = Router();
productRouter.route("/").get(getProduct).post(createProduct);
productRouter.route("/:id").get(getProductById).put(updateProduct).delete(deleteProduct);

export default productRouter;
