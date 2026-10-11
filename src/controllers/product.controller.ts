import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Errors";
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
    const data = await productService.getAllProducts();
    res.render("products", {products: data});
  } catch (err) {
    console.log("Error, getAllProducts:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
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
      // OLD: return ele.path;
      // NEW: replace Windows backslashes with "/" so the saved path always
      // looks like uploads/products/<uuid>.jpeg (no effect on Mac/Linux).
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
    // Express threw ERR_HTTP_HEADERS_SENT here (line 46), the catch block
    // below tried to send again (line 50), threw again, and the app crashed.
    // res.send("Done!");
  } catch (err) {
    console.log("Error, createNewProduct:", err);
    const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    // This only runs when something above failed BEFORE a response was sent,
    // so it is the only response in that case.
   res.send(
      `<script> alert("${message}"); window.location.replace('admin/product/all') </script>`
    );
  }
};

productController.updateChosenProduct = async (req: Request, res: Response) => {
  try {
    console.log("updateChosenProduct");
    const id = req.params.id;
    const result = await productService.updateChosenProduct(id, req.body);
    res.status(HttpCode.OK).json({data: result });
  } catch (err) {
    console.log("Error, updateChosenProduct:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

export default productController;