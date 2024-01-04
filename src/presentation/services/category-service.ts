import { CategoryModel } from "../../data";
import {
  CreateCategoryDTO,
  CustomError,
  PaginationDTO,
  UserEntity,
} from "../../domain";

export class CategoryService {
  constructor() {}

  async createCategory(createCategoryDTO: CreateCategoryDTO, user: UserEntity) {
    const categoryExist = await CategoryModel.findOne({
      name: createCategoryDTO.name,
    });
    if (categoryExist) throw CustomError.badRequest("Category Already Exist");

    try {
      const category = new CategoryModel({
        ...createCategoryDTO,
        user: user.id,
      });

      await category.save();

      return {
        id: category.id,
        name: category.name,
        available: category.available,
      };
    } catch (error) {
      throw CustomError.internalServer(`Internal Server Error: ${error}`);
    }
  }

  async getCategories(paginationDTO: PaginationDTO) {
    const { page, limit } = paginationDTO;

    try {
      const [totalDocuments, categories] = await Promise.all([
        CategoryModel.countDocuments(),
        CategoryModel.find()
          .skip((page - 1) * limit)
          .limit(limit),
      ]);

      const formattedCategories = categories.map((category) => ({
        id: category.id,
        name: category.name,
        available: category.available,
      }));

      return {
        page,
        limit,
        totalDocuments,
        next: `/api/categories?page=${page + 1}&limit=${limit}`,
        prev:
          page - 1 > 0
            ? `/api/categories?page=${page - 1}&limit=${limit}`
            : null,
        categories: formattedCategories,
      };
    } catch (error) {
      throw CustomError.internalServer(`Internal Server Error: ${error}`);
    }
  }
}
