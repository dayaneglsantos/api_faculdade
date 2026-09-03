const allowedOrigins = [
  process.env.API_URL,
  process.env.FRONTEND_PROD_URL,
  process.env.FRONTEND_DEV_URL,
].filter(Boolean);

export const corsConfiguration = {
  origin: (origin, callback) => {
    // Permite requisições sem origem (como Postman) e as origens permitidas
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS: Bloqueada origem não permitida: ${origin}`);
      callback(new Error("A origem não está autorizada pela política CORS"));
    }
  },
  methods: "GET,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};
