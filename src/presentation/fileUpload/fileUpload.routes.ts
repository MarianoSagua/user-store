import { Router } from "express";
import { FileUploadController } from "./fileUpload.controller";
import { FileUploadService } from "../services/fileUpload-service";
import { FileUploadMiddleware } from "../middlewares/fileUpload.middleware";
import { TypeMiddleware } from "../middlewares/type.middleware";

export class FileUploadRoutes {
  static get routes(): Router {
    const router = Router();
    const fileUploadService = new FileUploadService();
    const controller = new FileUploadController(fileUploadService);

    router.use(FileUploadMiddleware.containFiles);
    // router.use(TypeMiddleware.validTypes(["users", "products", "categories"]));
    router.post("/single/:type", controller.uploadFile);
    router.post(
      "/multiple/:type",
      [TypeMiddleware.validTypes(["users", "products", "categories"])],
      controller.uploadMultipleFiles
    );

    return router;
  }
}
