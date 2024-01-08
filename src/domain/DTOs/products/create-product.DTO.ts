import { Validators } from "../../../config";

export class CreateProductDTO {
  private constructor(
    public readonly name: string,
    public readonly available: boolean,
    public readonly price: number,
    public readonly description: string,
    public readonly user: string,
    public readonly category: string
  ) {}

  static create(props: { [Key: string]: any }): [string?, CreateProductDTO?] {
    const { name, available, price, description, user, category } = props;

    if (!name) return ["Missing name !!"];
    if (!user) return ["Mising user !!"];
    if (!Validators.isMongoID(user)) return ["User ID Invalid !!"];
    if (!category) return ["Mising Category !!"];
    if (!Validators.isMongoID(category)) return ["User ID Invalid !!"];

    return [
      undefined,
      new CreateProductDTO(
        name,
        !!available,
        price,
        description,
        user,
        category
      ),
    ];
  }
}
