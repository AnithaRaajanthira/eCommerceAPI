import { getUsers, createUser, getUserById, updateUser, deleteUser } from "../controllers/users.ts";
import { validateBody } from "#middleware";
import { userInputSchema } from "#schemas";
import { Router } from "express";

const userRouter = Router();
userRouter.route("/").get(getUsers).post(validateBody(userInputSchema), createUser);
userRouter.route("/:id").get(getUserById).put(validateBody(userInputSchema), updateUser).delete(deleteUser);

export default userRouter;
