import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";

// 换成你的mongoDB路径
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@blogdb.ug5s2az.mongodb.net/?retryWrites=true&w=majority`;

export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const BlogDB = client.db("blog");
