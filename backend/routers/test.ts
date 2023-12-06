import { Router } from "express";
import { BlogDB } from "../db/mongoDB";

const router = Router();

router.get("/test", async (_, res) => {
  try {
    const result = await BlogDB.collection("users").find().toArray();
    res.send(result);
  } catch (e) {
    console.log(e);
  }
});

export default router;
