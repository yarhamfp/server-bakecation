const Category = require("../models/Category");
const Bank = require("../models/Bank");
const Item = require("../models/Item");
const Image = require("../models/Image");
const Feature = require("../models/Feature");
const Activity = require("../models/Activity");
const Users = require("../models/Users");
const Booking = require("../models/Booking");
const Member = require("../models/Member");
const fs = require("fs-extra");
const path = require("path");
const bcrypt = require('bcryptjs');

module.exports = {

  viewSignin: async (req, res) => {
    try {
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = { message: alertMessage, status: alertStatus };
      if (req.session.user == null || req.session.user == undefined) {
        res.render('index', {
          alert,
          title: "Staycation | Login"
        });
      } else {
        res.redirect('/admin/dashboard');
      }
    } catch (error) {
      res.redirect('/admin/signin');
    }
  },

  actionSignin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await Users.findOne({ username: username });
      if (!user) {
        req.flash('alertMessage', 'User yang anda masukan tidak ada!!');
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/signin');
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        req.flash('alertMessage', 'Password yang anda masukan tidak cocok!!');
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/signin');
      }

      req.session.user = {
        id: user.id,
        username: user.username
      }

      res.redirect('/admin/dashboard');

    } catch (error) {
      res.redirect('/admin/signin');
    }
  },

  actionLogout: (req, res) => {
    req.session.destroy();
    res.redirect('/admin/signin');
  },

  viewDashborad: async (req, res) => {
    try {
      const member = await Member.find();
      const booking = await Booking.find();
      const item = await Item.find();
      res.render("admin/dashboard/view_dashboard", {
        title: "Bakecation | Dashboard",
        pageHeading: "Dashboard !",
        user: req.session.user,
        member,
        booking,
        item,
      });
    } catch (error) {
      res.redirect('/admin/dashboard');
    }
  },

  // category

  // bank

  // item

  // feature

  // activity

  // booking

};
