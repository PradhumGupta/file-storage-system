import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AuthService } from "../services/auth.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { verifyRefreshToken } from "../utils/jwt";
import { setCookies } from "../utils/set-token-cookies";

interface UserModel {
  name?: string;
  email: string;
  password: string;
}

const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const tokenSchema = z.object({
  token: z.string().min(1, "Token is required")
});

const emailSchema = z.object({
  email: z.string().email("Invalid email format")
});

const googleAuthSchema = z.object({
  idToken: z.string().min(1, "idToken is required")
});

const authService = new AuthService();

export class AuthController {
  public static SignUp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, password } = registerSchema.parse(req.body);
    const user = await authService.register(name, email, password);
    res.status(201).json({ message: "User registered", user });
  };

  public static Login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { email, password } = loginSchema.parse(req.body);
    const { accessToken, refreshToken, user } = await authService.login(
      email,
      password
    );
    setCookies(res, accessToken, refreshToken);
    res.json({ message: "User logged in", accessToken, refreshToken, user });
  };

  public static refresh = async (req: Request, res: Response) => {
    const rawToken = req.cookies?.refresh_token || req.body?.token;
    const { token } = tokenSchema.parse({ token: rawToken });

    const decoded: any = verifyRefreshToken(token);
    const accessToken = await authService.refresh(decoded.id, token);
    setCookies(res, accessToken, token);
    res.status(201).json({ message: "Token refreshed", accessToken });
  };

  public static logout = async (req: AuthRequest, res: Response) => {
    await authService.logoutSession(req.user?.id as string);
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.json({ message: "Logged out successfully" });
  };

  public static isUserExists = async (req: Request, res: Response) => {
    const { email } = emailSchema.parse(req.body);
    const found = await authService.checkUser(email);
    res.status(200).json({ found });
  };

  public static profile = async (req: AuthRequest, res: Response) => {
    const userProfile = await authService.getProfile(req.user!.id);
    res.json({ message: "User Profile retrieved", user: userProfile });
  };

  public static GoogleAuth = async (req: Request, res: Response) => {
    const { idToken } = googleAuthSchema.parse(req.body);
    const { accessToken, refreshToken, user } = await authService.verifyGoogleSubID(idToken);
    setCookies(res, accessToken, refreshToken);
    res.json({ message: "User Profile retrieved", accessToken, refreshToken, user });
  };
}
