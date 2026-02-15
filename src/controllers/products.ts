import { type RequestHandler } from "express";
import { z } from "zod/v4";
import { Product } from "#models";
import { productInputSchema, productSchema } from "#schemas";

type productInputDTO = z.infer<typeof productInputSchema>;
type Idparams = { id: string };
type productQuery = { categoryId?: string };
type productDTO = z.infer<typeof productSchema>;

const getProduct: RequestHandler<{}, any[], {}, productQuery> = async (req, res) => {
  const { categoryId } = req.query;
  // console.log(req.query);
  const filter = categoryId ? { categoryId: categoryId } : {}; //we r assigning the categoryId to categoryId field in Product schema//
  const products = await Product.find(filter).lean();
  res.json(products);
};

const createProduct: RequestHandler<{}, productInputDTO> = async (req, res) => {
  const { name, price, description, categoryId } = req.body;
  const found = await Product.findOne({ name });
  if (found) throw new Error("Product already Exists", { cause: { status: 409 } });
  const product = await Product.create({ name, price, description, categoryId } satisfies productInputDTO);
  res.status(201).json(product);
};

const getProductById: RequestHandler<Idparams, productDTO> = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found", { cause: { status: 404 } });
  res.json(product);
};

const updateProduct: RequestHandler<Idparams, productDTO, productInputDTO> = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, categoryId } = req.body;
  const product = await Product.findByIdAndUpdate(id);
  if (!product) throw new Error("Product not found", { cause: { status: 404 } });
  product.name = name;
  product.price = price;
  product.description = description;
  product.categoryId = categoryId;
  await product.save();
  res.json(product);
};

const deleteProduct: RequestHandler<Idparams, { message: string }> = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new Error("product not found", { cause: { status: 404 } });
  res.json({ message: "Deletion done" });
};

export { getProduct, createProduct, getProductById, updateProduct, deleteProduct };
