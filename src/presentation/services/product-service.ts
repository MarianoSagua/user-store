import { ProductModel } from "../../data";
import { CreateProductDTO, CustomError, PaginationDTO } from "../../domain";

export class ProductService {
  constructor() {}

  async createProduct(createProductDTO: CreateProductDTO) {
    const productExist = await ProductModel.findOne({
      name: createProductDTO.name,
    });
    if (productExist) throw CustomError.badRequest("Product Already Exist !!");

    try {
      const product = new ProductModel(createProductDTO);
      await product.save();
      return product;
    } catch (error) {
      throw CustomError.internalServer(`Internal Server Error: ${error}`);
    }
  }

  async getProducts(paginationDTO: PaginationDTO) {
    const { page, limit } = paginationDTO;

    try {
      const [totalDocuments, products] = await Promise.all([
        ProductModel.countDocuments(),
        ProductModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate("category")
          .populate("user", "name email"),
      ]);

      return {
        page,
        limit,
        totalDocuments,
        next: `/api/products?page=${page + 1}&limit=${limit}`,
        prev:
          page - 1 > 0 ? `/api/products?page=${page - 1}&limit=${limit}` : null,
        products,
      };
    } catch (error) {
      throw CustomError.internalServer(`Internal Server Error: ${error}`);
    }
  }
}
