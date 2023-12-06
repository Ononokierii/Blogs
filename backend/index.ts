import express from "express";
import TestRouter from "./routers/test";
import AdminRouter from "./routers/AdminRouter";
import CategoryRouter from "./routers/CategoryRouter";
import BlogRouter from "./routers/BlogRouter";
import UploadRouter from "./routers/UploadRouter";
import { client, BlogDB } from "./db/mongoDB";
import "dotenv/config";
import multer from "multer";
import path from "path";
// @ts-ignore
import history from "connect-history-api-fallback";

const app = express();

// set history
app.use(history());

// set cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
  return;
});

// set json
app.use(express.json());

// set static
app.use(express.static(path.join(__dirname, "public")));

// set upload
const upload = multer({ dest: "./public/uploads/temp/" });
app.use(upload.any());

// connect to db
client.connect();

// token check
app.use(async (req, res, next) => {
  const { token } = req.headers;
  if (
    req.method === "GET" ||
    req.path.indexOf("/admin") > -1 ||
    req.path.indexOf("/upload") > -1
  ) {
    next();
    return;
  } else if (!token) {
    res.status(401).send({
      msg: "login first",
      status: 0,
    });
  } else {
    try {
      const result = await BlogDB.collection("users").findOne({ token });
      if (result) {
        next();
        return;
      } else {
        res.status(401).send({
          msg: "login first",
          status: 0,
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
});

app.use("/test", TestRouter);
app.use("/admin", AdminRouter);
app.use("/category", CategoryRouter);
app.use("/blogs", BlogRouter);
app.use("/upload", UploadRouter);

app.get("/test", (_, res) => {
  res.send("Hello World!");
});

app.listen("4567", () => {
  console.log("Server started at http://localhost:4567");
});
