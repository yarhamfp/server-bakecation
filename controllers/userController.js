const User = require('../models/Users');
const fs = require("fs-extra");
const path = require("path");


module.exports = {
  viewUser: async (req, res) => {
    try {
      const { id } = req.params;
      const userP = await User.findOne({ _id: id });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/user/view_user", {
        alert,
        userP,
        title: "Bakecation | User",
        pageHeading: "Users !",
        user: req.session.user
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/dashboard");
    }
  },

  editUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, username, email, telepon, facebook, instagram, github, about, } = req.body;
      const userP = await User.findOne({ _id: id });
      console.log(req.data);
      if (req.file == undefined) {
        userP.name = name;
        userP.username = username;
        userP.email = email;
        userP.telepon = telepon;
        userP.facebook = facebook;
        userP.instagram = instagram;
        userP.github = github;
        userP.about = about;
        await userP.save();
        req.flash("alertMessage", "Success! User has been updated.");
        req.flash("alertStatus", "success");
        res.redirect(`/admin/user/${userP._id}`);
      } else {
        if (userP.imageUrl != null) {
          await fs.unlink(path.join(`public/${userP.imageUrl}`));
        }
        userP.name = name;
        userP.username = username;
        userP.email = email;
        userP.telepon = telepon;
        userP.facebook = facebook;
        userP.instagram = instagram;
        userP.github = github;
        userP.about = about;
        userP.imageUrl = `images/${req.file.filename}`;
        await userP.save();
        req.flash("alertMessage", "Success! User has been updated.");
        req.flash("alertStatus", "success");
        res.redirect(`/admin/user/${userP._id}`);
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/user/${userP._id}`);
    }
  },

  deleteFotoUser: async (req, res) => {
    try {
      const { id } = req.params;
      const userFoto = await User.findOne({ _id: id }).select('imageUrl');
      await fs.unlink(path.join(`public/${userFoto.imageUrl}`));
      userFoto.imageUrl = null;
      await userFoto.save();
      req.flash("alertMessage", "Success! Foto User has been deleted.");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/user/${userFoto._id}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/user/${userFoto._id}`);
    }
  }

}