import { type RequestHandler } from "express";
import { z } from "zod/v4";
import { User } from "#models";
import { userInputSchema, userSchema } from "#schemas";

type userInputDTO = z.infer<typeof userInputSchema>;
type userDTO = z.infer<typeof userSchema>;
type Idparams = { id: string };

const getUsers: RequestHandler<{}, userDTO[]> = async (req, res) => {
  const users = await User.find().lean();
  res.json(users);
};

const createUser: RequestHandler<{}, userDTO, userInputDTO> = async (req, res) => {
  const { name, email, password } = req.body;

  const found = await User.findOne({ email });
  if (found) throw new Error("User already Exists", { cause: { status: 409 } });
  const user = await User.create({ name, email, password } satisfies userInputDTO);
  res.status(201).json(user);
};

const getUserById: RequestHandler<Idparams, userDTO> = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) throw new Error("User not found", { cause: { status: 404 } });
  res.json(user);
};

const updateUser: RequestHandler<Idparams, userDTO, userInputDTO> = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const user = await User.findByIdAndUpdate(id);
  if (!user) throw new Error("User not found", { cause: { status: 404 } });
  user.name = name;
  user.email = email;
  user.password = password;
  await user.save();
  res.json(user);
};

const deleteUser: RequestHandler<Idparams, { message: string }> = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error("User not found", { cause: { status: 404 } });
  res.json({ message: "Deletion done" });
};

export { getUsers, createUser, getUserById, updateUser, deleteUser };
