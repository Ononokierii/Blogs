import { Router } from "express";
import { v4 as uuid } from "uuid";
import fs from "fs";
import "dotenv/config";

const router = Router();

router.post("/file_upload", (req, res) => {
  console.log("---------file_upload---------");
  if (!(req as any).files) {
    console.log("---------file_upload_failed---------");
    res.status(400).send({
      success: 0,
      file: {},
    });
  }

  const files = (req as any).files;
  const temFiles = [];
  console.log(files);
  for (let file of files) {
    const ext = file.originalname.split(".").pop();
    const newFileName = `${uuid()}.${ext}`;
    fs.renameSync(
      `${process.cwd()}/public/uploads/temp/${file.filename}`,
      `${process.cwd()}/public/uploads/${newFileName}`
    );
    temFiles.push(`${process.env.API_URI}/uploads/${newFileName}`);
  }

  res.status(200).send({
    success: 1,
    file: {
      url: temFiles[0],
    },
  });
  console.log("---------file_upload_success---------");
});

export default router;
