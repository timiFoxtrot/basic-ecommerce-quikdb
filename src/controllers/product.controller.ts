import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service";

export class ProductCOntroller {
  constructor(private productService: ProductService) {}

  createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const userId = res.locals.user.id;
      const data = this.productService.createProduct({ ...req.body, userId });
      res.status(201).json({
        status: "success",
        message: "Product inserted successfully",
        data,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        error: error.message || error,
      });
    }
  };

  getOwnProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const userId = res.locals.user.id;
      const data = await this.productService.getOwnProducts(userId);
      return res.status(200).json({
        status: "success",
        message: "Products fetched successfully",
        data,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        error: error.message || error,
      });
    }
  };

  getApprovedProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const data = await this.productService.getApprovedProducts();
      return res.status(200).json({
        status: "success",
        message: "Products fetched successfully",
        data,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        error: error.message || error,
      });
    }
  };

  approveProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const productId = req.params.id;
      const data = await this.productService.approveProduct(productId);
      return res.status(200).json({
        status: "success",
        message: "Product approved.",
        data,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        error: error.message || error,
      });
    }
  };

  getAllProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const data = await this.productService.getAllProducts();
      return res
        .status(200)
        .json({ status: "success", message: "successful", data });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        error: error.message || error,
      });
    }
  };

  updateOwnProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const userId = res.locals.user.id;
      const productId = req.params.id;
      const data = await this.productService.updateOwnProduct(
        userId,
        productId,
        req.body
      );
      return res.status(200).json({
        status: "success",
        message: "Product updated successfully.",
        data,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        error: error.message || error,
      });
    }
  };

  deleteOwnProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const userId = res.locals.user.id;
      const productId = req.params.id;
      const data = await this.productService.deleteOwnProduct(
        userId,
        productId
      );
      return res.status(200).json({
        status: "success",
        message: "Product deleted successfully.",
        data,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        error: error.message || error,
      });
    }
  };
}
