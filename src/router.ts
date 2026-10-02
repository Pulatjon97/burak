import express  from "express";
const router = express.Router();
// OLD: import membercontroller from './controllers/member.controller';
import memberController from "./controllers/member.controller";

router.post('/login', memberController.login);

router.post("/signup", memberController.signup);

export default router;