const Booking = require("../models/Booking");

module.exports = {
  viewBooking: async (req, res) => {
    try {
      const booking = await Booking.find()
        .populate('memberId')
        .populate('bankId');
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/booking/view_booking", {
        title: "Bakecation | Booking",
        pageHeading: "Booking !",
        user: req.session.user,
        booking,
        alert
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect('/admin/booking');
    }
  },

  detailBooking: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findOne({ _id: id })
        .populate('memberId')
        .populate('bankId');
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/booking/view_detail_booking", {
        title: "Bakecation | Detail Booking",
        pageHeading: `Detail Booking ${booking.memberId.firstName} ${booking.memberId.lastName}`,
        user: req.session.user,
        booking,
        alert
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect('/admin/booking');
    }
  },

  actionConfirmation: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findOne({ _id: id });
      booking.payments.status = 'Accept';
      await booking.save();
      req.flash("alertMessage", 'Success! Booking telah dikonfirmasi.');
      req.flash("alertStatus", "success");
      res.redirect('/admin/booking');
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect('/admin/booking');
    }
  },

  actionReject: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findOne({ _id: id });
      booking.payments.status = 'Rejected';
      await booking.save();
      req.flash("alertMessage", 'Booking telah direject.');
      req.flash("alertStatus", "success");
      res.redirect('/admin/booking');
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect('/admin/booking');
    }
  },
}