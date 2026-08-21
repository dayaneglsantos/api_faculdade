import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import routes from "./routes/index.js";
import { corsConfiguration } from "./config/cors.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const swaggerDocument = YAML.load("./openapi.yml");

export const app = express();

app.use(cors(corsConfiguration));
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(routes);

// Deve ser registrado depois de todas as rotas
app.use(errorMiddleware);
