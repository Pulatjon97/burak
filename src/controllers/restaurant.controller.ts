import { Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Errors"; // NEW
import { escape } from "node:querystring";
const memberService = new MemberService();

const restaurantController: T = {};
// NEW: sends a real HTTP status and a readable JSON error
const sendError = (res: Response, err: unknown) => {
  if (err instanceof Errors) {
    res.status(err.code).json({ code: err.code, message: err.message });
  } else {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
      code: HttpCode.INTERNAL_SERVER_ERROR,
      message: Message.SOMETHING_WENT_WRONG,
    });
  }
};

restaurantController.goHome = (req: Request, res: Response) => {
  try {
    console.log("goHome");
    res.render("home"); //send | render | redirect | json
  } catch (err) {
    console.log("Error, goHome", err);
    res.redirect("/admin")  
  }
};
restaurantController.getSignup = (req: Request, res: Response) => {
  try {
    // OLD: console.log('goHome');
    console.log("getSignup");
    res.render("signup");
    ;
  } catch (err) {
    console.log("Error, getSignup", err);
    res.redirect("/admin")  
}
};

restaurantController.getLogin = (req: Request, res: Response) => {
  try {
    // OLD: console.log('goHome');
    console.log("getLogin");
    res.render("login");
  } catch (err) {
    console.log("Error, getLogin", err);
    res.redirect("/admin")  
  }
};

restaurantController.processSignup = async (
  req: AdminRequest,
  res: Response,
) => {
  try {
    console.log("processSignup");
    const newMember: MemberInput = req.body;
    newMember.memberType = MemberType.RESTAURANT;
    const result = await (memberService as any).processSignup(newMember);
    //TODO: SESSIONS AUTHENTICATION

    req.session.member = result;
    req.session.save(function () {
      res.send(result);
    });
  } catch (err) {
    console.log("Error, processSignup", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(`<script> alert("${message}"); window.location.replace('admin/signup) </script>`);
  }
};

restaurantController.processLogin = async (
  req: AdminRequest,
  res: Response,
) => {
  try {
    console.log("processLogin");
    console.log("body:", req.body);
    const input: LoginInput = req.body;

    const result = await (memberService as any).processLogin(input);
    //TODO: SESSIONS AUTHENTICATION

    req.session.member = result;
    req.session.save(function () {
      res.send(result);
    });

    // OLD: res.send(result);
    // OLD: res.json(result);  (second response, sent before the session saved, caused ERR_HTTP_HEADERS_SENT)
  } catch (err) {
    console.log("Error, processLogin", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(`<script> alert("${message}"); window.location.replace('admin/login) </script>`);
  }
};

restaurantController.logout = async (req: AdminRequest, res: Response) => {
  try {
    console.log("logout");
    req.session.destroy(function () {
      res.redirect("/admin");
    });
  } catch (err) {
    console.log("Error, logout", err);
    res.redirect("/admin");
  }
};

restaurantController.checkAuthSession = async (
  req: AdminRequest,
  res: Response,
) => {
  try {
    console.log("checkAuthSession");
    if (req.session?.member)
      res.send(`<script> alert("${req.session.member.memberNick}")</script>`);
    else res.send(`<script> alert("${Message.NOT_AUTHENTICATED}")</script>`);
  } catch (err) {
    console.log("Error, checkAuthSession", err);
    sendError(res, err); // NEW: without this, Postman hangs on a failed login
  }
};

export default restaurantController;
