import { Router } from "express";
import { AuthRoutes } from "./auth/auth.routes";
import { CategoryRoutes } from "./category/category.routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use("/api/auth", AuthRoutes.routes);
    router.use("/api/categories", CategoryRoutes.routes);

    return router;
  }
}
