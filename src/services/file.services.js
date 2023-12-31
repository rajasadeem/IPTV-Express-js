import fileModel from "../models/file.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const fileServices = {
  add: async (req) => {
    try {
      req.file.path = req.file.path.replace(`\\`, `/`);
      const uploadedFile = await cloudinary.uploader.upload(
        req.file.path,
        async (error, result) => {
          if (error) {
            console.log(error);
            throw new Error(error);
          }
          fs.unlink(req.file.path, (error) => {
            if (error) throw new Error(error);
          });
          return result;
        }
      );
      console.log("uploaded file=", uploadedFile);
      const file = {
        original_name: req.file.originalname,
        current_name: req.file.filename,
        type: req.file.mimetype,
        path: uploadedFile.secure_url,
        size: req.file.size,
        cloudinary_id: uploadedFile.public_id,
      };
      return await fileModel.create(file);
    } catch (error) {
      throw new Error(error);
    }
  },

  get: async (pageNumber, limit) => {
    const skip = limit * pageNumber - limit;
    return fileModel.find().limit(limit).skip(skip);
  },

  getById: async (id) => {
    return fileModel.findById(id);
  },

  updateOne: async (id, req) => {
    req.file.path = req.file.path.replace(`\\`, `/`);
    const file = {
      original_name: req.file.originalname,
      current_name: req.file.filename,
      type: req.file.mimetype,
      path: `${req.protocol}://${req.get("host")}/${req.file.path}`,
      size: req.file.size,
    };
    return fileModel.findByIdAndUpdate(id, file);
  },

  deleteOne: async (id) => {
    return fileModel.deleteOne({ _id: id });
  },
};

export default fileServices;
