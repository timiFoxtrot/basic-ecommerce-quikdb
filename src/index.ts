import express from "express";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth";
import { productRouter } from "./routes/product";
import { connect } from "./config/database";
import { handleErrors } from "./middlewares/error";

dotenv.config();
const app = express();
app.use(express.json());

(async () => await connect())();

// Routes
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);

app.use(handleErrors);

app.use((req, res, _next) => {
  res.status(404).json({
    status: "error",
    message: "resource not found",
    path: req.url,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
