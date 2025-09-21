import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AuthService } from "../services/auth.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { verifyRefreshToken } from "../config/jwt";

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

export class AuthController {
  public static SignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = registerSchema.parse(req.body as UserModel);
      const user = await authService.register(name, email, password);
      res.json({ message: "User registered", user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public static Login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = loginSchema.parse(req.body as UserModel);
      const { accessToken, refreshToken, user } = await authService.login(email, password);
      res.json({ message: "User logged in", accessToken, refreshToken, user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public static refresh = async (req: Request, res: Response) => {
    const { token } = req.body;

    try {
      const decoded: any = verifyRefreshToken(token);
      const accessToken = await authService.refresh(decoded.id, token);

      res.json({ message: "Token refreshed", accessToken });
    } catch (error: any) {
      console.error("Error in refresh auth controller", error);
      res.status(500).json({ error: error.message });
    }
  }

  public static logout = async (req: AuthRequest, res: Response) => {
    try {
      await authService.logoutSession(req.user?.id as string);
      res.json({ message: "Logged out successfully" });
    } catch (error: any) {
      console.error("Error in logout auth controller", error);
      res.status(500).json({ error: error.message });
    }
  }

  public static profile = async (req: AuthRequest, res: Response) => {
    try {
      const userProfile = await authService.getProfile(req.user!.id);
      res.json({ message: "User Profile retrieved", profile: userProfile });
    } catch (error: any) {
      console.error("Error in profile auth controller", error);
      res.status(500).json({ error: error.message });
    }
  }
}
