const { validationResult } = require("express-validator");
const CatgoryModel = require("../models/Category");
class Category {
  async create(req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { parentcategory, categoryname, enabled,inmenu } = req.body;
      try {
        const exist = await CatgoryModel.findOne({ categoryname });
        if (!exist) {
          await CatgoryModel.create({
            parentcategory,
            categoryname,
            enabled,
            inmenu,
          });
          return res.status(201).json({ msg: "category has been created successfully"});
        } else {
          return res
            .status(401)
            .json({ errors: [{ msg: `${categoryname} is already exist` }] });
        }
      } catch (error) {
        console.log(error.message);
        return res.status(500).json("Internal Server Error");
      }
    } else {
      //validation Failed
      return res.status(401).json({ errors: errors.array() });
    }
  }
  async categories(req, res) {
    const page = req.params.page;
    const perPage = 3;
    const skip = (page - 1) * perPage;
    try {
      const count = await CatgoryModel.find({}).countDocuments();
      const response = await CatgoryModel.find({})
        .skip(skip)
        .limit(perPage)
        .sort({ updatedAt: -1 });
      console.log(response);
      return res.status(200).json({ categories: response, perPage, count });
    } catch (error) {
      console.log(error.message);
    }
  }
  async fetchCategory(req, res) {
    const { id } = req.params;
    try {
      const response = await CatgoryModel.findOne({ _id: id });
      return res.status(200).json({ category: response });
    } catch (error) {
      console.log(error.message);
    }
  }
  async updateCategory(req, res) {
    const { id } = req.params;
    const { parentcategory, categoryname, enabled,inmenu } = req.body;
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const exist = await CatgoryModel.findOne({ categoryname });
      if (!exist) {
        const response = await CatgoryModel.updateOne(
          { _id: id },
          { $set: { categoryname } }
        );
        return res
          .status(200)
          .json({ message: "Your category has updated successfully!" });
      } else {
        return res
          .status(400)
          .json({ errors: [{ msg: `${categoryname} category is already exist` }] });
      }
    } else {
      return res.status(400).json({ errors: errors.array() });
    }
  }
  async deleteCategory(req, res) {
    const { id } = req.params;
    try {
      await CatgoryModel.deleteOne({ _id: id });
      return res
        .status(200)
        .json({ message: "Category has deleted successfully!" });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json("Server internal error!");
    }
  }
  async allCategories(req, res) {
    try {
      const categories = await CatgoryModel.find({});
      return res.status(200).json({ categories });
    } catch (error) {
      return res.status(500).json("Server internal error!");
    }
  }
  async randomCategories(req, res) {
    try {
      const categories = await CatgoryModel.aggregate([
        { $sample: { size: 3 } },
      ]);
      return res.status(200).json({ categories });
    } catch (error) {
      return res.status(500).json("Server internal error!");
    }
  }
}
module.exports = new Category();
