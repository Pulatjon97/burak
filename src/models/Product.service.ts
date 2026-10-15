// import { shapeIntoMongooseObjectId } from "../libs/config";
import { shapeIntoMongooseObjectId } from "../libs/utils/config";
// import Errors, { HttpCode, Message } from "../libs/Errors";
import Errors, { HttpCode, Message } from "../libs/utils/Errors";
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
    // string => ObjectId
    // OLD: id = shapeIntoMongooseObjectId(id);
    // NEW: trim() removes stray spaces/newlines (e.g. the "%0A" copied with the
    // id from Compass), which otherwise made new ObjectId(...) throw BSONTypeError.
    // id = shapeIntoMongooseObjectId(id);
    id = shapeIntoMongooseObjectId(String(id).trim());
    const result = await this.productModel
      .findOneAndUpdate({ _id: id }, input, { new: true })
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    // NEW: print the updated document in the terminal. The course output shows
    // "result: { ... }" because it has this line; the old version had no log,
    // so nothing was printed even though the update worked ([200]).
    console.log("result:", result);

    return result.toObject() as Product;
  }
}

export default ProductService;