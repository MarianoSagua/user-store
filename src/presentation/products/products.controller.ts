import { Request, Response } from "express";
import {
  CreateCategoryDTO,
  CreateProductDTO,
  CustomError,
  PaginationDTO,
} from "../../domain";
import { ProductService } from "../services/product-service";

export class ProductsController {
  constructor(private readonly productsService: ProductService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "Internal server error !!" });
    }
  };

  createProduct = async (req: Request, res: Response) => {
    const [error, createProductDTO] = CreateProductDTO.create({
      ...req.body,
      user: req.body.user.id,
    });
    if (error) return res.status(400).json({ error });

    this.productsService
      .createProduct(createProductDTO!)
      .then((newProduct) => res.status(201).json(newProduct))
      .catch((error) => this.handleError(error, res));
  };

  getProducts = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDTO] = PaginationDTO.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    try {
      const products = await this.productsService.getProducts(paginationDTO!);
      res.status(200).json(products);
    } catch (error) {
      this.handleError(error, res);
    }
  };
}
