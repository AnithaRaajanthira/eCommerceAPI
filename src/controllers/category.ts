import { type RequestHandler } from "express";
import { z } from "zod/v4";
import { Category } from "#models";
import { categorySchema, categoryInputSchema } from "#schemas";

type categoryDTO = z.infer<typeof categorySchema>;
type categoryInputDTO = z.infer<typeof categoryInputSchema>;
type Idparams = { id: string };

const getCategories: RequestHandler<{}, categoryDTO[]> = async (req, res) => {
  const categories = await Category.find().lean();
  res.json(categories);
};

const createCategory: RequestHandler<{}, categoryDTO, categoryInputDTO> = async (req, res) => {
  const { name } = req.body;
  const found = await Category.findOne({ name });
  if (found) throw new Error("Category already Exists", { cause: { status: 409 } });
  const category = await Category.create({ name });
  res.status(201).json(category);
};

const getCategoryById: RequestHandler<Idparams, categoryDTO> = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) throw new Error("Category not found", { cause: { status: 404 } });
  res.json(category);
};

const updateCategory: RequestHandler<Idparams, categoryDTO, categoryInputDTO> = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await Category.findByIdAndUpdate(id);
  if (!category) throw new Error("User not found", { cause: { status: 404 } });
  category.name = name;
  await category.save();
  res.json(category);
};

const deleteCategory: RequestHandler<Idparams, { message: string }> = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new Error("Category not found", { cause: { status: 404 } });
  res.json({ message: "Deletion done" });
};

export { getCategories, createCategory, getCategoryById, updateCategory, deleteCategory };
