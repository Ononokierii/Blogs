import { Router } from "express";
import { BlogDB } from "../db/mongoDB";
import { v4 as uuid } from "uuid";

const router = Router();

router.post("/login", async (req, res) => {
  console.log("---------login---------");
  const { username, password } = req.body;

  try {
    const result = await BlogDB.collection("users").findOne({
      username,
      password,
    });
    if (result) {
      const token = uuid();
      await BlogDB.collection("users").updateOne(
        { username, password },
        { $set: { token } }
      );
      res.status(200).send({
        msg: "Login success",
        status: 1,
        data: {
          username,
          token,
        },
      });
      console.log("---------login_success---------");
    } else {
      res.status(401).send({
        msg: "Login failed",
        status: 0,
      });
      console.log("---------login_failed---------");
    }
  } catch (e) {
    console.log(e);
    console.log("---------login_failed---------");
  }
});

export default router;
