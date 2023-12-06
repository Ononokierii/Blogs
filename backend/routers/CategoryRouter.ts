import { Router } from "express";
import { BlogDB } from "../db/mongoDB";
import { v4 as uuid } from "uuid";

const router = Router();

router.get("/list", async (_, res) => {
  console.log("---------get_category_list---------");

  try {
    const result = await BlogDB.collection("category").find().toArray();
    if (result) {
      res.status(200).send({
        msg: "get category list success",
        status: 1,
        data: {
          result,
        },
      });
      console.log("---------get_category_list_success---------");
    } else {
      res.status(401).send({
        msg: "get category list failed",
        status: 0,
      });
      console.log("---------get_category_list_failed---------");
    }
  } catch (e) {
    console.log(e);
    console.log("---------get_category_list_failed---------");
  }
});

router.post("/add", async (req, res) => {
  console.log("---------add_category---------");
  const { name } = req.body;
  try {
    const result = await BlogDB.collection("category").insertOne({
      id: uuid(),
      name,
    });
    if (result) {
      res.status(200).send({
        msg: "add category success",
        status: 1,
      });
      console.log("---------add_category_success---------");
    } else {
      res.status(401).send({
        msg: "add category failed",
        status: 0,
      });
      console.log("---------add_category_failed---------");
    }
  } catch (e) {
    console.log(e);
    console.log("---------add_category_failed---------");
  }
});

router.put("/update", async (req, res) => {
  console.log("---------update_category---------");
  const { id, name } = req.body;
  try {
    const result = await BlogDB.collection("category").updateOne(
      { id },
      { $set: { name } }
    );
    if (result) {
      res.status(200).send({
        msg: "update category success",
        status: 1,
      });
      console.log("---------update_category_success---------");
    } else {
      res.status(401).send({
        msg: "update category failed",
        status: 0,
      });
      console.log("---------update_category_failed---------");
    }
  } catch (e) {
    console.log(e);
    console.log("---------update_category_failed---------");
  }
});

router.delete("/delete", async (req, res) => {
  console.log("---------delete_category---------");
  const { id } = req.query;
  try {
    const result = await BlogDB.collection("category").deleteOne({ id });
    if (result) {
      res.status(200).send({
        msg: "delete category success",
        status: 1,
      });
      console.log("---------delete_category_success---------");
    } else {
      res.status(401).send({
        msg: "delete category failed",
        status: 0,
      });
      console.log("---------delete_category_failed---------");
    }
  } catch (e) {
    console.log(e);
    console.log("---------delete_category_failed---------");
  }
});

export default router;
