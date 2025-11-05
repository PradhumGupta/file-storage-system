import { NextFunction, Request, Response } from "express";
import { string, z } from "zod";
import { AuthService } from "../services/auth.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { verifyRefreshToken } from "../utils/jwt";
import { setCookies } from "../utils/set-token-cookies";

interface UserModel {
  name?: String;
  email: String;
  password: String;
}

const registerSchema = z.object({
  name: z.string().trim(),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const authService = new AuthService();
export class AuthController {
  public static SignUp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { name, email, password } = registerSchema.parse(
        req.body as UserModel
      );
      const user = await authService.register(name, email, password);
      res.json({ message: "User registered", user });
    } catch (error: any) {
      console.log("Error occured in signup controller", error.message)
      throw error
    }
  };

  public static Login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = loginSchema.parse(req.body as UserModel);
      const { accessToken, refreshToken, user } = await authService.login(
        email,
        password
      );
      setCookies(res, accessToken, refreshToken);
      res.json({ message: "User logged in", accessToken, refreshToken, user });
    } catch (error: any) {
      console.log("Error occured in login controller", error.message)
      throw error    
    }
  };

  public static refresh = async (req: Request, res: Response) => {
    const token = req.cookies.refresh_token || req.body.token;

    try {
      const decoded: any = verifyRefreshToken(token as string);
      const accessToken = await authService.refresh(decoded.id, token as string);
      setCookies(res, accessToken, token);
      res.status(201).json({ message: "Token refreshed", accessToken });
    } catch (error: any) {
      console.log("Error in refresh auth controller", error.message);
      throw error    
    }
  };

  public static logout = async (req: AuthRequest, res: Response) => {
    try {
      await authService.logoutSession(req.user?.id as string);
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      res.json({ message: "Logged out successfully" });
    } catch (error: any) {
      console.log("Error in logout auth controller", error.message);
      throw error    
    }
  };

  public static isUserExists = async (req: Request, res: Response) => {
    try {
      const found = await authService.checkUser(req.body?.email);
      res.status(200).json({ found });
    } catch (err: any) {
      console.log("Error in checking user status", err.message);
      throw err
    }
  };

  public static profile = async (req: AuthRequest, res: Response) => {
    try {
      const userProfile = await authService.getProfile(req.user!.id);
      res.json({ message: "User Profile retrieved", user: userProfile });
    } catch (error: any) {
      console.log("Error in profile auth controller", error.message);
      throw error    
    }
  };

}
