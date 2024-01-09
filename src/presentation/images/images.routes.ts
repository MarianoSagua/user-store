import { Router } from "express";
import { ImageController } from "./images.controller";

export class ImageRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new ImageController();

    router.get("/:type/:img", controller.getImage);
    
    return router;
  }
}
