const Category = require("../models/Category");

module.exports = {
  viewCategory: async (req, res) => {
    try {
      const category = await Category.find().populate({
        path: "itemId",
        select: "_id",
      });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/category/view_category", {
        pageHeading: "Category !",
        category,
        alert,
        user: req.session.user,
        title: "Bakecation | Category",
      });
    } catch (error) {
      res.redirect("/admin/category");
    }
  },

  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      // console.log(name);
      await Category.create({ name });
      req.flash("alertMessage", "Success add category!");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },

  editCategory: async (req, res) => {
    try {
      const { id, name } = req.body;
      const category = await Category.findOne({ _id: id });
      category.name = name;
      await category.save();
      req.flash("alertMessage", "Success Update category!");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id }).populate({
        path: "itemId",
        select: "_id",
      });
      if (category.itemId.length) {
        req.flash("alertMessage", "Kategori ini tidak bisa dihapus karena sudah berelasi!");
        req.flash("alertStatus", "danger");
        res.redirect("/admin/category");
      } else {
        await category.remove();
        req.flash("alertMessage", "Success delete category!");
        req.flash("alertStatus", "success");
        res.redirect("/admin/category");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
};
