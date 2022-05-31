import logger from "morgan";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";

const FRONT_BASE_URL = "localhost";
const SESSION_SECRET = "1234";

const basicLoader = (app: any): any => {
  app.use(
    cors({
      origin: [FRONT_BASE_URL],
      credentials: true,
    })
  );
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    session({
      secret: SESSION_SECRET,
      resave: true,
      saveUninitialized: false,
    })
  );
  app.use(cookieParser());

  return app;
};

export default basicLoader;
