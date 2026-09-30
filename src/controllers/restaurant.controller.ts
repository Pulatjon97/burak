import {Request, Response} from "express";
import {T} from "../libs/types/common";
import MemberService from "../models/Member.service";
import {LoginInput, MemberInput} from "../libs/types/member"
import { MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Errors"; // NEW

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
        // LOGIC
        // SERVICE MODEL
        // ...
        res.send('Home Page');
        // send | json | redirect | end | render
    } catch (err) {
        console.log('Error, goHome', err);
        sendError(res, err); // NEW
    }
};

restaurantController.getLogin = (req: Request, res: Response) => {
    try {
      // OLD: console.log('goHome');
      console.log('getLogin');
      res.send('Login Page');
    } catch (err) {
        console.log('Error, getLogin', err);
        sendError(res, err); // NEW
    }
};

restaurantController.getSignup = (req: Request, res: Response) => {
    try {
      // OLD: console.log('goHome');
      console.log('getSignup');
      res.send('Signup Page');
    } catch (err) {
        console.log('Error, getSignup', err);
        sendError(res, err); // NEW
    }
};

restaurantController.processLogin = async (req: Request, res: Response) => {
    try {
      console.log("processLogin");
      console.log("body:", req.body);
      const input: LoginInput = req.body;

     const memberService = new MemberService();
     const result = await memberService.processLogin(input);

      // OLD: res.send(result);
      res.json(result);
    } catch (err) {
        console.log("Error, processLogin", err);
        // NEW: without this, Postman hangs on a failed login
        sendError(res, err);
    }
};

restaurantController.processSignup = async (req: Request, res: Response) => {
    try {
      console.log('processSignup');
const newMember: MemberInput = req.body;
newMember.memberType = MemberType.RESTAURANT;

    const memberService = new MemberService();
    const result =  await memberService.processSignup(newMember);
      // OLD: res.send(result);
      res.json(result);
    } catch (err) {
        console.log("Error, processSignup", err);
        // OLD: res.send(err);   (this returned status 200 even on errors)
        sendError(res, err); // NEW: returns 400/500 with a JSON message
    }
};

export default restaurantController