import { type RequestHandler } from "express";
import { z } from "zod/v4";
import { Order } from "#models";
import { orderInputSchema, orderSchema } from "#schemas";

type orderDTO = z.infer<typeof orderSchema>;
type orderInputDTO = z.infer<typeof orderInputSchema>;
type Idparams = { id: string };

const getOrders: RequestHandler<{}, orderDTO[]> = async (req, res) => {
  const orders = await Order.find()
    .populate({
      path: "products.productId",
      select: "name price",
    })
    .lean();
  res.json(orders);
};

const createOrder: RequestHandler<{}, orderDTO, orderInputDTO> = async (req, res) => {
  //   const { userId, products, total } = req.body;
  const validatedData = orderInputSchema.parse(req.body);
  const order = await Order.create(validatedData);
  //   const order = await Order.create({ userId, products, total } satisfies orderInputDTO);
  res.status(201).json(order);
};

const getOrderById: RequestHandler<Idparams, orderDTO> = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) throw new Error("Category not found", { cause: { status: 404 } });
  res.json(order);
};

const updateOrder: RequestHandler<Idparams, orderDTO, orderInputDTO> = async (req, res) => {
  const { id } = req.params;
  const { userId, products, total } = req.body;
  const order = await Order.findByIdAndUpdate(id);
  if (!order) throw new Error("User not found", { cause: { status: 404 } });
  order.userId = userId;
  order.products = products;
  order.total = total;
  await order.save();
  res.json(order);
};

const deleteOrder: RequestHandler<Idparams, { message: string }> = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findByIdAndDelete(id);
  if (!order) throw new Error("Order not found", { cause: { status: 404 } });
  res.json({ message: "Deletion done" });
};

export { getOrders, createOrder, getOrderById, updateOrder, deleteOrder };
