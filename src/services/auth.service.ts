import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/auth.repository";
import { comparePassword, hashPassword } from "../utils/password";
import { generateRandomId } from "../utils";

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async signup(userData: Record<string, any>): Promise<void> {
    const body = Object.entries(userData) as [string, string][];

    const { password } = userData;
    const id = generateRandomId();
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    const hashedPassword = await hashPassword(password);

    return this.userRepository.createUser({
      body,
      id,
      hashedPassword,
      createdAt,
      updatedAt,
    });
  }

  async login(credentials: { email: string; password: string }) {
    const { email, password } = credentials;

    const findUser = await this.userRepository.findUserByEmail(email);
    if (!findUser) {
      throw new Error("Invalid user");
    }

    const compare = await comparePassword(password, findUser.password);
    if (!compare) {
      throw new Error("Invalid user");
    }

    const token = jwt.sign({ id: findUser.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    delete findUser.password;

    return { token, user: findUser };
  }

  async getUsers() {
    return this.userRepository.getAllUsers();
  }
}
