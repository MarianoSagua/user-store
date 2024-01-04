import { Router } from "express";
import { CategoryController } from "./category.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { CategoryService } from "../services/category-service";

export class CategoryRoutes {
  static get routes(): Router {
    const router = Router();
    const serviceCategory = new CategoryService();
    const controller = new CategoryController(serviceCategory);

    router.get("/", controller.getCategories);
    router.post("/", [AuthMiddleware.validateJWT], controller.createCategory);

    return router;
  }
}
