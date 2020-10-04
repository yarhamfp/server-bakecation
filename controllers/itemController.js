const Category = require("../models/Category");
const Item = require("../models/Item");
const Image = require("../models/Image");
const Feature = require("../models/Feature");
const Activity = require("../models/Activity");
const fs = require("fs-extra");
const path = require("path");


module.exports = {
  viewItem: async (req, res) => {
    try {
      const item = await Item.find()
        .populate({ path: "imageId", select: "id imageUrl" })
        .populate({ path: "categoryId", select: "id name" });
      // console.log(item);
      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/view_item", {
        title: "Bakecation | Item",
        pageHeading: "Items !",
        category,
        alert,
        item,
        action: "view",
        user: req.session.user
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  addItem: async (req, res) => {
    try {
      const { categoryId, title, price, city, country, about } = req.body;
      if (req.files.length > 0) {
        const category = await Category.findOne({ _id: categoryId });
        const newItem = {
          categoryId,
          title,
          description: about,
          price,
          country,
          city,
        };
        const item = await Item.create(newItem);
        category.itemId.push({ _id: item._id });
        await category.save();
        for (let i = 0; i < req.files.length; i++) {
          const imageSave = await Image.create({
            imageUrl: `images/${req.files[i].filename}`,
          });
          item.imageId.push({ _id: imageSave._id });
          await item.save();
        }
        req.flash("alertMessage", "Success!! Item has been added.");
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  showImageItem: async (req, res) => {

    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate({
        path: "imageId",
        select: "id imageUrl",
      });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/view_item", {
        title: "Bakecation | Show Image Item",
        pageHeading: `Item Gambar ${item.title}`,
        alert,
        item,
        action: "show image",
        user: req.session.user
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  showEditItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({ path: "imageId", select: "id imageUrl" })
        .populate({ path: "categoryId", select: "id name" });
      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/view_item", {
        title: "Bakecation | Edit Item",
        pageHeading: `Edit Item ${item.title}`,
        alert,
        item,
        category,
        action: "edit item",
        user: req.session.user
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  editItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { categoryId, title, price, city, about } = req.body;
      const item = await Item.findOne({ _id: id })
        .populate({ path: "imageId", select: "id imageUrl" })
        .populate({ path: "categoryId", select: "id name" });

      if (req.files.length > 0) {
        for (let i = 0; i < item.imageId.length; i++) {
          const imageUpdate = await Image.findOne({ _id: item.imageId[i]._id });
          await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
          imageUpdate.imageUrl = `images/${req.files[i].filename}`;
          await imageUpdate.save();
        }
        item.title = title;
        item.price = price;
        item.city = city;
        item.description = about;
        item.categoryId = categoryId;
        await item.save();
        req.flash("alertMessage", "Success item has been updated.");
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      } else {
        item.title = title;
        item.price = price;
        item.city = city;
        item.description = about;
        item.categoryId = categoryId;
        await item.save();
        req.flash("alertMessage", "Success item has been updated.");
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  deleteItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate("imageId");
      for (let i = 0; i < item.imageId.length; i++) {
        Image.findOne({ _id: item.imageId[i]._id })
          .then((image) => {
            fs.unlink(path.join(`public/${image.imageUrl}`));
            image.remove();
          })
          .catch((error) => {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/admin/item");
          });
      }
      await item.remove();
      req.flash("alertMessage", "Success item has been deleted.");
      req.flash("alertStatus", "success");
      res.redirect("/admin/item");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  viewItemDetail: async (req, res) => {
    const { itemId } = req.params;
    const item = await Item.findOne({ _id: itemId });
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      const feature = await Feature.find({ itemId: itemId });
      const activity = await Activity.find({ itemId: itemId });
      res.render("admin/item/detail_item/view_detail_item", {
        title: "Bakecation | Detail Item",
        pageHeading: `Detail Item ${item.title}`,
        alert,
        itemId,
        feature,
        user: req.session.user,
        activity
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  addImageItem: async (req, res) => {
    const { itemId } = req.body;
    try {
      // if (!req.file) {
      //   req.flash("alertMessage", "Image not found");
      //   req.flash("alertStatus", "danger");
      //   res.redirect(`/admin/item/show-image/${itemId}`);
      // }
      for (let i = 0; i < req.files.length; i++) {
        const imageSave = await Image.create({
          imageUrl: `images/${req.files[i].filename}`,
        });
        const item = await Item.findOne({ _id: itemId });
        item.imageId.push({ _id: imageSave._id });
        await item.save();
      }
      req.flash("alertMessage", "Success! Image has been added.");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-image/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-image/${itemId}`);
    }
  },

  editImageItem: async (req, res) => {
    const { id, itemId } = req.body;
    try {
      const image = await Image.findOne({ _id: id });
      await fs.unlink(path.join(`public/${image.imageUrl}`));
      image.imageUrl = `images/${req.file.filename}`
      await image.save();
      req.flash('alertMessage', 'Success! Image has been updated.');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-image/${itemId}`);

    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-image/${itemId}`);
    }
  },

  deleteImageItem: async (req, res) => {
    const { id, itemId } = req.params;
    try {
      const image = await Image.findOne({ _id: id });
      const item = await Item.findOne({ _id: itemId }).populate('imageId');
      for (let i = 0; i < item.imageId.length; i++) {
        if (item.imageId[i]._id.toString() === image._id.toString()) {
          item.imageId.pull({ _id: image._id });
          await item.save();
        }
      }
      await fs.unlink(path.join(`public/${image.imageUrl}`));
      await image.remove();
      req.flash("alertMessage", "Success! Image has been removed.");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-image/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-image/${itemId}`);
    }
  },
}