import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import {
  ExtendedRequest,
  LoginInput,
  Member,
  MemberInput,
  MemberUpdateInput,
} from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/utils/Errors";
import AuthService from "../models/Auth.service";
import { AUTH_TIMER } from "../libs/utils/config";
// REACT
const memberService = new MemberService();
const authService = new AuthService();

const memberController: T = {};
memberController.signup = async (req: Request, res: Response) => {
  try {
    const body = req.body ?? {};
    const input: MemberInput = {
      memberNick:
        typeof body.memberNick === "string" ? body.memberNick.trim() : "",
      memberPhone:
        typeof body.memberPhone === "string" ? body.memberPhone.trim() : "",
      memberPassword:
        typeof body.memberPassword === "string" ? body.memberPassword : "",
      memberAddress:
        typeof body.memberAddress === "string"
          ? body.memberAddress.trim()
          : undefined,
      memberDesc:
        typeof body.memberDesc === "string"
          ? body.memberDesc.trim()
          : undefined,
    };
    const missingFields = Object.entries({
      memberNick: input.memberNick,
      memberPhone: input.memberPhone,
      memberPassword: input.memberPassword,
    })
      .filter(([, value]) => typeof value !== "string" || !value.trim())
      .map(([field]) => field);
    if (missingFields.length > 0) {
      return res.status(HttpCode.BAD_REQUEST).json({
        error: `Required fields: ${missingFields.join(", ")}`,
      });
    }

    const member: Member = await memberService.signup(input);
    const token = await authService.createToken(member);
    res.cookie("accessToken", token, {
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
      path: "/",
      sameSite: "lax",
    });

    return res.status(HttpCode.CREATED).json({ member, accessToken: token });
  } catch (err) {
    if (err instanceof Errors)
      return res.status(err.code).json({ error: err.message });
    console.error(
      "Signup failed:",
      err instanceof Error ? err.name : "Unknown error",
    );
    return res
      .status(Errors.standard.code)
      .json({ error: Message.SOMETHING_WENT_WRONG });
  }
};

memberController.login = async (req: Request, res: Response) => {
  try {
    console.log("login");
    const input: LoginInput = {
      memberNick: String(req.body.memberNick ?? "").trim(),
      memberPassword: String(req.body.memberPassword ?? ""),
    };
    const member = await memberService.login(input);
    const token = await authService.createToken(member);

    res.cookie("accessToken", token, {
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
      path: "/",
      sameSite: "lax",
    });

    return res.status(HttpCode.OK).json({ member, accessToken: token });
  } catch (err) {
    console.log("Error, login:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json({ error: Errors.standard });

    //  res.json({ error: err });
  }
};

memberController.logout = (req: ExtendedRequest, res: Response) => {
  try {
    console.log("logout");
    res.clearCookie("accessToken", { path: "/", sameSite: "lax" });
    return res.status(HttpCode.OK).json({ logout: true });
  } catch (err) {
    console.log("Error, logout:", err);
    if (err instanceof Errors) return res.status(err.code).json(err);
    return res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.getMemberDetail = async (
  req: ExtendedRequest,
  res: Response,
) => {
  try {
    console.log("getMemberDetail");
    const result = await memberService.getMemberDetail(req.member);
    return res.status(HttpCode.OK).json({ member: result });
  } catch (err) {
    console.log("Error, getMemberDetail:", err);
    if (err instanceof Errors) return res.status(err.code).json(err);
    return res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.updateMember = async (req: ExtendedRequest, res: Response) => {
 try {
    console.log("updateMember");
   const input: MemberUpdateInput = req.body;
   if(req.file) input.memberImage = req.file.path.replace(/\\/, "/");
   const result = await memberService.updateMember(req.member, input);
   res.status(HttpCode.OK).json(result);


  } catch (err) {
    console.log("Error, updateMember:", err);
    if (err instanceof Errors) return res.status(err.code).json(err);
    return res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.getTopUsers = async (req: Request, res: Response) => {
try {
    console.log("getTopUsers");
    const result = await memberService.getTopUsers();

    res.status(HttpCode.OK).json(result)
  } catch (err) {
    console.log("Error, getTopUsers:", err);
    if (err instanceof Errors) return res.status(err.code).json(err);
    return res.status(Errors.standard.code).json(Errors.standard);
  }
}

memberController.verifyAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies["accessToken"];
    if (token) req.member = await authService.checkAuth(token);
    if (!req.member) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
    }

    next();
  } catch (err) {
    console.log("Error, verifyAuth:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.retrieveAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies["accessToken"];
    if (token) req.member = await authService.checkAuth(token);
    if (!req.member) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
    }
    next();
  } catch (err) {
    console.log("Error, retrieveAuth:", err);
    next();
  }
};

/** PRODUCT */

/** ORDER */
export default memberController;
