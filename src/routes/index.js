import { Router } from "express";
import user from "./users.js";

const router = Router();

router.use(user);

export default router;
