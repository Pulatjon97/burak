import {Request, Response} from "express";
import {T} from "../libs/types/common";
import MemberService from "../models/Member.service";
import {LoginInput, MemberInput} from "../libs/types/member"
import { MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Errors"; // NEW

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
        console.log('goHome');
        res.render("home");
    } catch (err) {
        console.log('Error, goHome', err);
        sendError(res, err); // NEW
    }
}; 
restaurantController.getSignup = (req: Request, res: Response) => {
    try {
      // OLD: console.log('goHome');
      console.log('getSignup');
      res.render("signup");
    } catch (err) {
        console.log('Error, getSignup', err);
        sendError(res, err); // NEW
    }
};

restaurantController.getLogin = (req: Request, res: Response) => {
    try {
      // OLD: console.log('goHome');
      console.log('getLogin');
      res.render("login");
    } catch (err) {
        console.log('Error, getLogin', err);
        sendError(res, err); // NEW
    }
};



restaurantController.processSignup = async (req: Request, res: Response) => {
    try {
      console.log('processSignup');
      const newMember: MemberInput = req.body;
      newMember.memberType = MemberType.RESTAURANT;
      const result = await (memberService as any).processSignup(newMember);
//TODO: SESSIONS AUTHENTICATION

      // OLD: res.send(result);
      res.json(result);
    } catch (err) {
        console.log("Error, processSignup", err);
        // OLD: res.send(err);  (this returned status 200 even on errors)
        sendError(res, err); // NEW
    }
};

restaurantController.processLogin = async (req: Request, res: Response) => {
    try {
      console.log("processLogin");
      console.log("body:", req.body);
      const input: LoginInput = req.body;

      const result = await (memberService as any).processLogin(input);
//TODO: SESSIONS AUTHENTICATION

      // OLD: res.send(result);
      res.json(result);
    } catch (err) {
        console.log("Error, processLogin", err);
        sendError(res, err); // NEW: without this, Postman hangs on a failed login
    }
};



export default restaurantController