import Errors, { HttpCode, Message } from "../libs/Errors";
import { Product, ProductInput } from "../libs/types/product";
import ProductModel from "../schema/Product.model";

class ProductService {
  private readonly productModel;

  constructor() {
    this.productModel = ProductModel;
  }

  /* SPA */

  /* BSSR */

  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      const createdProduct = await this.productModel.create(input);
      return createdProduct.toObject() as Product;
    } catch (err) {
      console.error("ERROR, model:createNewProduct", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
}

export default ProductService;
