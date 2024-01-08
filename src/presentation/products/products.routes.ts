import { Router } from "express";
import { ProductsController } from "./products.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { ProductService } from "../services/product-service";

export class ProductsRoutes {
  static get routes(): Router {
    const router = Router();
    const productService = new ProductService();
    const controller = new ProductsController(productService);

    router.get("/", controller.getProducts);
    router.post("/", [AuthMiddleware.validateJWT], controller.createProduct);

    return router;
  }
}
