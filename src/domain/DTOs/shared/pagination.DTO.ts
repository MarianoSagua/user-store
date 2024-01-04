export class PaginationDTO {
  private constructor(
    public readonly page: number,
    public readonly limit: number
  ) {}

  static create(
    page: number = 1,
    limit: number = 10
  ): [string?, PaginationDTO?] {
    if (isNaN(page) || isNaN(limit))
      return ["Page and limits must be a numbers !!"];

    if (page <= 0) return ["There must be at least one page !!"];
    if (limit <= 0) return ["There must be at least one limit !!"];

    return [undefined, new PaginationDTO(page, limit)];
  }
}
