import { Request, Response } from "express";
// import Errors, { HttpCode, Message } from "../libs/Errors";
import Errors, { HttpCode, Message } from "../libs/utils/Errors";
import { T } from "../libs/types/common";
import ProductService from "../models/Product.service";
import { ProductInput } from "../libs/types/product";
import { AdminRequest } from "../libs/types/member";

const productService = new ProductService();

const productController: T = {};
/* SPA */

/* BSSR */

productController.getAllProducts = async (req: Request, res: Response) => {
  try {
    console.log("getAllProducts");
    res.render("products");
  } catch (err) {
    console.log("Error, getAllProducts:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    // else res.status(Errors.standart.code).json(Errors.standart);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

productController.createNewProduct = async (
  req: AdminRequest,
  res: Response,
) => {
  try {
    console.log("createNewProduct");
    console.log("req.files:", req.files);

    // If multer received no files, stop here. The throw jumps to the catch
    // block below, which sends the "Create is failed!" alert.
    if (!req.files?.length)
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);

    const data: ProductInput = req.body;
    data.productImages = req.files?.map((ele) => {
      // return ele.path;
      return ele.path.replace(/\\/g, "/");
    });

    await productService.createNewProduct(data);

    // The success response. A request may be answered ONLY ONCE, so this must
    // be the only res.send() that runs in the try block.
    res.send(
      `<script> alert("Successful creation!"); window.location.replace('admin/product/all') </script>`
    );

    // OLD (caused the crash): a second res.send() on the same request.
    // res.send("Done!");
  } catch (err) {
    console.log("Error, createNewProduct:", err);
    const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
   res.send(
      `<script> alert("${message}"); window.location.replace('admin/product/all') </script>`
    );
  }
};

productController.updateChosenProduct = async (req: Request, res: Response) => {
  try {
    console.log("updateChosenProduct");
    // NEW: read the product id from the URL (/admin/product/:id) and update it
    // with the values sent in the request body.
    const id = req.params.id;
    const result = await productService.updateChosenProduct(id, req.body);

    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error, updateChosenProduct:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    // else res.status(Errors.standart.code).json(Errors.standart);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default productController;