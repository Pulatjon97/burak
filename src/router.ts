import express  from "express";
const router = express.Router();
import membercontroller from './controllers/member.controller';
import memberController from "./controllers/member.controller";

router.get('/', memberController.goHome);

router.get('/login', memberController.getLogin);

router.get('/signup', memberController.getSignup);

export default router;