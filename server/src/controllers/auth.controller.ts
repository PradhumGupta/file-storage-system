import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AuthService } from "../services/auth.service";

interface UserModel {
    name?: String,
    email: String,
    password: String
}

const registerSchema = z.object({
    name: z.string().trim(),
    email: z.string().email(),
    password: z.string().min(6)
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

const authService = new AuthService();

class AuthController {
  public SignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = registerSchema.parse(req.body as UserModel);
      const user = await authService.register(name, email, password);
      res.json({ message: "User registered", user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public Login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = loginSchema.parse(req.body as UserModel);
      const { accessToken, refreshToken, user } = await authService.login(email, password);
      res.json({ message: "User logged in", accessToken, refreshToken, user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
