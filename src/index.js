import express from "express";
import routes from "./routes/index.js";

const port = process.env.PORT;

export const app = express();

app.use(express.json());

app.use(routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
