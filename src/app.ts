import "#db";
import express from "express";
import { userRouter, productRouter, categoryRouter, orderRouter } from "#routers";
import { errorHandler } from "#middleware";

const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());
app.use("/users", userRouter);
app.use("/orders", orderRouter);
app.use("/categories", categoryRouter);
app.use("/products", productRouter);

app.use("*splat", (req, res) => {
  throw new Error("Not found", { cause: { status: 404 } });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`\x1b[34mMain app listening at http://localhost:${port}\x1b[0m`);
});
