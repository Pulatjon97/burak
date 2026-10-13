import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan";
import { T } from "./libs/types/common";

import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";

const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({
  uri: process.env.MONGODB_URL as string,
  collection: "sessions",
});

const MORGAN_FORMAT = "dev";

/** 1- ENTERANSE  **/
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan(MORGAN_FORMAT));

/** 2- SESSIONS **/
app.use(
  session({
    secret: String(process.env.SESSION_SECRET),
    cookie: { maxAge: 1000 * 3600 * 6 }, // 6 hours
    store: store,
    resave: true,
    saveUninitialized: true,
  }),
);
app.use(function (req, res, next) {
  const sessionInstance = req.session as T;
  res.locals.member = sessionInstance.member;
  next();
});

/** 3- VIEWS **/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/** 4- ROUTES **/
app.use("/admin", routerAdmin); // // SSR: EJS
app.use("/", router); // SPA: REACT

export default app;
