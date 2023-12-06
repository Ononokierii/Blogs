import { Router } from "express";
import { BlogDB } from "../db/mongoDB";
import { v4 as uuid } from "uuid";

const router = Router();

router.get("/detail", async (req, res) => {
  console.log("---------get_blogs_detail---------");
  const { id } = req.query;
  try {
    const result = await BlogDB.collection("blogs").findOne({ id });
    if (result) {
      res.status(200).send({
        msg: "get blog detail success",
        status: 1,
        data: {
          result,
        },
      });
      console.log("---------get_blogs_detail_success---------");
    } else {
      res.status(401).send({
        msg: "get blogs detail failed",
        status: 0,
      });
      console.log("---------get_blogs_detail_failed---------");
    }
  } catch (e) {
    console.log(e);
    console.log("---------get_blogs_detail_failed---------");
  }
});

router.get("/list", async (req, res) => {
  console.log("---------get_blogs_list---------");

  const { page, pageSize, keyword, category_id } = req.query;
  const skipNum = (Number(page || 1) - 1) * Number(pageSize);

  const query = {
    //@ts-ignore
    ...(keyword ? { title: new RegExp(keyword) } : {}),
    ...(category_id ? { category_id } : {}),
  };

  const formatBlogContent = (content: any) => {
    if (typeof content === "string") return content;
    let newContent: string[] = [];
    content.blocks.forEach((block: any) => {
      if (block?.data?.text) {
        newContent.push(block?.data?.text);
      }
    });
    content = newContent.join("");
    return content.length > 100 ? content.slice(0, 100) + "..." : content;
  };

  try {
    const result = await BlogDB.collection("blogs")
      .find(query)
      .sort({ create_time: -1 })
      .skip(skipNum)
      .limit(Number(pageSize || 10))
      .toArray();
    const total = await BlogDB.collection("blogs").countDocuments(query);
    if (result) {
      const blogs = result.map((blog) => ({
        ...blog,
        content: formatBlogContent(blog.content),
      }));
      res.status(200).send({
        msg: "get blogs list success",
        status: 1,
        data: {
          result: [...blogs],
          total,
        },
      });
      console.log("---------get_blogs_list_success---------");
    } else {
      res.status(401).send({
        msg: "get blogs list failed",
        status: 0,
      });
      console.log("---------get_blogs_list_failed---------");
    }
  } catch (e) {
    console.log(e);
    console.log("---------get_blogs_list_failed---------");
  }
});

router.post("/add", async (req, res) => {
  console.log("---------add_blog---------");
  const { title, content, category_id } = req.body;
  try {
    const result = await BlogDB.collection("blogs").insertOne({
      id: uuid(),
      title,
      content,
      category_id,
      create_time: Date.now(),
    });
    if (result) {
      res.status(200).send({
        msg: "add blogs success",
        status: 1,
      });
      console.log("---------add_blog_success---------");
    } else {
      res.status(401).send({
        msg: "add blog failed",
        status: 0,
      });
      console.log("---------add_blog_failed---------");
    }
  } catch (e) {
    console.log(e);
    console.log("---------add_blog_failed---------");
  }
});

router.put("/update", async (req, res) => {
  console.log("---------update_blogs---------");
  const { id, title, content, category_id } = req.body;
  try {
    const result = await BlogDB.collection("blogs").updateOne(
      { id },
      { $set: { title, content, category_id, update_time: new Date() } }
    );
    if (result) {
      res.status(200).send({
        msg: "update blogs success",
        status: 1,
      });
      console.log("---------update_blogs_success---------");
    } else {
      res.status(401).send({
        msg: "update blogs failed",
        status: 0,
      });
      console.log("---------update_blogs_failed---------");
    }
  } catch (e) {
    console.log(e);
    console.log("---------update_blogs_failed---------");
  }
});

router.delete("/delete", async (req, res) => {
  console.log("---------delete_blogs---------");
  const { id } = req.query;
  try {
    const result = await BlogDB.collection("blogs").deleteOne({ id });
    if (result) {
      res.status(200).send({
        msg: "delete blogs success",
        status: 1,
      });
      console.log("---------delete_blogs_success---------");
    } else {
      res.status(401).send({
        msg: "delete blogs failed",
        status: 0,
      });
      console.log("---------delete_blogs_failed---------");
    }
  } catch (e) {
    console.log(e);
    console.log("---------delete_blogs_failed---------");
  }
});

export default router;
