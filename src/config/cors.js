const allowedOrigins = [
  process.env.FRONTEND_PROD_URL,
  process.env.FRONTEND_DEV_URL,
];

export const corsConfiguration = {
  origin: (origin, callback) => {
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
