import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import {
  Product,
  ProductInput,
  ProductUpdateInput,
} from "../libs/types/product";
import ProductModel from "../schema/Product.model";

class ProductService {
  private readonly productModel;

  constructor() {
    this.productModel = ProductModel;
  }

  /* SPA */

  /* BSSR */

   public async getAllProducts(): Promise<Product[]> {
    const result = await this.productModel
      .find()
      .lean()
      .exec();

    if (!result || result.length === 0) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }

    return result as unknown as Product[];
  }


  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      const createdProduct = await this.productModel.create(input);
      return createdProduct.toObject() as Product;
    } catch (err) {
      console.error("ERROR, model:createNewProduct", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async updateChosenProduct(
    id: string,
    input: ProductUpdateInput,
  ): Promise<Product> {
  
    id = shapeIntoMongooseObjectId(String(id).trim());
    const result = await this.productModel
      .findOneAndUpdate({ _id: id }, input, { new: true })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result.toObject() as Product;
  }
}

export default ProductService;