import Errors, { HttpCode, Message } from "../libs/utils/Errors";
import {
  Product,
  ProductInput,
  ProductInquiry,
  ProductUpdateInput,
} from "../libs/types/product";
import ProductModel from "../schema/Product.model";
import { shapeIntoMongooseObjectId } from "../libs/utils/config";
import { Member } from "../libs/types/member";
import { ProductStatus } from "../libs/enums/product.enum";
import { T } from "../libs/types/common";
import {ObjectId} from "mongoose";

class ProductService {
  private readonly productModel;

  constructor() {
    this.productModel = ProductModel;
  }
  /* SPA */
  public async getProducts(inquiry: ProductInquiry): Promise<Product[]> {
    console.log("inquiry: ", inquiry);
    const match: T = { productStatus: ProductStatus.PROCESS };
    if (inquiry.productCollection)
      match.productCollection = inquiry.productCollection;
    if(inquiry.search) {
match.productName =  {$regex: new RegExp(inquiry.search, "i")};
    }
    const sort: T =
      inquiry.order === "ProductPrice"
        ? { [inquiry.order]: 1 }
        : { [inquiry.order]: -1 };

    const result = await this.productModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        { $skip: (inquiry.page * 1 - 1) * inquiry.limit },  // 0
        { $limit: inquiry.limit * 1 }, // 3
      ])
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  public async getProduct (memberId: ObjectId | null, id: string): Promise<Product> {
const productId = shapeIntoMongooseObjectId(id);
let result = await this.productModel.findOne({_id: productId, productStatus: ProductStatus.PROCESS,}).exec();
if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
return result;
// TODO: if authenticated users => first => view log creation
  }

  /* SSR */

  public async getAllProducts(): Promise<Product[]> {
    const result = await this.productModel.find().exec();

    if (!result) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }

    return result;
  }

  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      return await this.productModel.create(input);
    } catch (error) {
      console.error("Error, model:createNewProduct", error);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async updateChosenProduct(
    id: string,
    input: ProductUpdateInput,
  ): Promise<Product> {
    id = shapeIntoMongooseObjectId(id);

    const result = await this.productModel
      .findOneAndUpdate({ _id: id }, input, { new: true })
      .exec();

    if (!result) {
      throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    }

    return result;
  }
}

export default ProductService;
