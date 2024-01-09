import { Router } from "express";
import { AuthRoutes } from "./auth/auth.routes";
import { CategoryRoutes } from "./category/category.routes";
import { ProductsRoutes } from "./products/products.routes";
import { FileUploadRoutes } from "./fileUpload/fileUpload.routes";
import { ImageRoutes } from "./images/images.routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use("/api/auth", AuthRoutes.routes);
    router.use("/api/categories", CategoryRoutes.routes);
    router.use("/api/products", ProductsRoutes.routes);
    router.use("/api/upload", FileUploadRoutes.routes);
    router.use("/api/images", ImageRoutes.routes);

    return router;
  }
}
