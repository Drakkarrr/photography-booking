const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
// MULTER UPLOAD
const multer = require("multer");
const {
  updateDocument,
  findDocument,
  deleteDocument,
} = require("../helper/MongoDBHelper");

const { Customer, photographyPackage } = require("../models/index");

const UPLOAD_DIRECTORY = "./public/uploads";
// var type = upload.single("recfile");

var upload = multer({
  storage: multer.diskStorage({
    contentType: multer.AUTO_CONTENT_TYPE,
    destination: function (req, file, callback) {
      console.log("!!!!!!!!!!!!!!!!!");
      const { id, collectionName } = req.params;

      const PATH = `${UPLOAD_DIRECTORY}/${collectionName}/${id}`;
      // console.log('PATH', PATH);
      if (!fs.existsSync(PATH)) {
        // Create a directory
        fs.mkdirSync(PATH, { recursive: true });
      }
      callback(null, PATH); //cái này tương tự như hàm next() dùng để tiếp tục công việc tiếp theo
    },
    filename: function (req, file, callback) {
      const safeFileName = toSafeFileName(file.originalname);
      callback(null, safeFileName);
    },
  }),
}).single("file");

var uploadListImg = multer({
  storage: multer.diskStorage({
    contentType: multer.AUTO_CONTENT_TYPE,
    destination: function (req, file, callback) {
      console.log("!!!!!!!!!!!!!!!!!");
      const { id, collectionName } = req.params;

      const PATH = `${UPLOAD_DIRECTORY}/${collectionName}/listPhoto/${id}`;
      // console.log('PATH', PATH);
      if (!fs.existsSync(PATH)) {
        // Create a directory
        fs.mkdirSync(PATH, { recursive: true });
      }
      callback(null, PATH); //cái này tương tự như hàm next() dùng để tiếp tục công việc tiếp theo
    },
    filename: function (req, file, callback) {
      const safeFileName = toSafeFileName(file.originalname);
      callback(null, safeFileName);
    },
  }),
}).single("file");

// http://127.0.0.1:9000/upload/categories/63293fea50d2f78624e0c6f3/image
router.post("/:collectionName/:id/image", async (req, res, next) => {
  const { collectionName, id } = req.params;

  const found = await findDocument(id, collectionName);
  if (!found) {
    return res
      .status(410)
      .json({ message: `${collectionName} with id ${id} not found` });
  }
  // console.log("here!!!!!!!!!!!!!!!!!");
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      res.status(500).json({ type: "MulterError", err: err });
    } else if (err) {
      res.status(500).json({ type: "UnknownError", err: err });
    } else {
      // UPDATE MONGODB
      updateDocument(
        id,
        { imageUrl: `/uploads/${collectionName}/${id}/${req.file.filename}` },
        collectionName
      );
      //
      // console.log('host', req.get('host'));
      const publicUrl = `${req.protocol}://${req.get(
        "host"
      )}/uploads/${collectionName}/${id}/${req.file.filename}`;
      res.status(200).json({ ok: true, publicUrl: publicUrl });
    }
  });
});

// http://127.0.0.1:9000/upload/categories/63293fea50d2f78624e0c6f3/images
router.post("/:collectionName/:id/images", async (req, res, next) => {
  const { collectionName, id } = req.params;
  const found = await findDocument(id, collectionName);
  if (!found) {
    return res
      .status(410)
      .json({ message: `${collectionName} with id ${id} not found` });
  }

  uploadListImg(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      res.status(500).json({ type: "MulterError", err: err });
    } else if (err) {
      res.status(500).json({ type: "UnknownError", err: err });
    } else {
      // UPDATE MONGODB
      const newImageUrl = `/uploads/${collectionName}listPhoto/${id}/${req.file.filename}`;

      let images = found.listImg;
      console.log("list img: ", req.file.filename);
      if (!images) {
        images = [];
      }

      images.push(newImageUrl);
      // console.log()
      await updateDocument(id, { listImg: images }, collectionName);

      // console.log('host', req.get('host'));
      const publicUrl = `${req.protocol}://${req.get(
        "host"
      )}/uploads/${collectionName}/${id}/${req.file.filename}`;
      res.status(200).json({ ok: true, publicUrl: publicUrl });
    }
  });
});

// router.post("/:collectionName/:id/listImg", async (req, res, next) => {
//   try {
//     const { id, collectionName } = req.params;
//     const found = await findDocument(id, collectionName);
//     console.log("found: ", found.listImg);
//     if (!found) {
//       return res
//         .status(410)
//         .json({ message: `${collectionName} with id ${id} not found` });
//     }

//     uploadListImg.array("file_multiple", 12)(req, res, async (err) => {
//       console.log("come here!!!");
//       if (err instanceof multer.MulterError) {
//         console.log("Error here!!");
//         res.status(500).json({ type: "MulterError", err: err });
//       } else if (err) {
//         res.status(500).json({ type: "UnknownError", err: err });
//       } else {
//         console.log("here!!!!!!!!!!!!!!!!!");
//         console.log("hjdkk: ", req.files);
//         let list = req.files;
//         if (!list) {
//           list = [];
//         }
//         // list.push(newImageUrl);
//         var listPath = list.reduce((prev, nextFileName) => {
//           prev.push(
//             `/uploads/${collectionName}/listPhoto/${id}/${nextFileName?.filename}`
//           );
//           return prev;
//         }, []);

//         // UPDATE MONGODB
//         await updateDocument(id, { listImg: listPath }, collectionName);
//         //
//         // console.log('host', req.get('host'));
//         const listPublicUrl = list.reduce((prev, nextPath) => {
//           prev.push(
//             `${req.protocol}://${req.get(
//               "host"
//             )}/uploads/${collectionName}/listPhoto/${id}/${nextPath.filename}`
//           );
//           return prev;
//         }, []);
//         // console.log("abc:", listPublicUrl);
//         res.status(200).json({ ok: true, publicUrl: listPublicUrl });
//       }
//     });
//   } catch {}
// });

function toSafeFileName(fileName) {
  const fileInfo = path.parse(fileName);
  const safeFileName =
    fileInfo.name.replace(/[^a-z0-9]/gi, "-").toLowerCase() + fileInfo.ext;
  return safeFileName;
}

module.exports = router;
