import express from "express";
import routes from "./routes/index.js";
import cors from "cors";
import { corsConfiguration } from "./config/cors.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
const swaggerDocument = YAML.load("./openapi.yml");

const port = process.env.PORT;

export const app = express();

app.use(cors(corsConfiguration));

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(routes);

// Deve ser registrado depois de todas as rotas
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
