import { STATUS } from "../config/constants/enum";
import { generateRandomId } from "../utils";
import { ProductRepository } from "../repositories/product.repository";

// Create Schema Result: { err: 'You can define up to 2 indexes only.' }
// Error: You can define up to 2 indexes only.

export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async createProduct(productData: Record<string, any>) {
    const body = Object.entries(productData) as [string, string][];
    const id = generateRandomId();
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    const userId = productData.userId;

    return this.productRepository.createProduct({
      body,
      id,
      createdAt,
      updatedAt,
      userId,
    });
  }

  async getOwnProducts(userId: string) {
    return this.productRepository.findByUserId(userId);
  }

  async getApprovedProducts() {
    const data = await this.productRepository.findByIndex(
      "status",
      STATUS.APPROVED
    );
    return data;
  }

  async approveProduct(productId: string) {
    return this.productRepository.updateProduct(productId, {
      status: STATUS.APPROVED,
    });
  }

  async getAllProducts() {
    return this.productRepository.getAllProducts();
  }

  async updateOwnProduct(
    userId: string,
    productId: string,
    update: Record<string, string>
  ) {
    const updatedAt = new Date().toISOString();

    const product = await this.productRepository.findById(productId);

    if (product && product.userId != userId) {
      throw new Error("You cannot update this product");
    }
    return this.productRepository.updateProduct(productId, {
      ...update,
      updatedAt: updatedAt,
    });
  }

  async deleteOwnProduct(userId: string, productId: string) {
    const product = await this.productRepository.findById(productId);
    if (product && product.userId != userId) {
      throw new Error("You cannot update this product");
    }

    return this.productRepository.deleteProduct(productId);
  }
}
