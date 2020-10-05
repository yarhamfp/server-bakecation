const router = require('express').Router();
// controller
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryController');
const bankController = require('../controllers/bankController');
const itemController = require('../controllers/itemController');
const featureController = require('../controllers/featureController');
const activityController = require('../controllers/activityController');
const bookingController = require('../controllers/bookingController');
// end controller
const { uploadSingle, uploadMultiple } = require('../middlewares/multer');
const auth = require('../middlewares/auth');

router.get('/signin', adminController.viewSignin);
router.post('/signin', adminController.actionSignin);
router.use(auth);
router.get('/logout', adminController.actionLogout);
router.get('/dashboard', adminController.viewDashborad);
// endpoint user
router.get('/user/:id', userController.viewUser);
router.put('/user/update/:id', uploadSingle, userController.editUser);
router.put('/user/foto/:id', userController.deleteFotoUser);
// endpoint category
router.get('/category', categoryController.viewCategory);
router.post('/category/add', categoryController.addCategory);
router.put('/category/update', categoryController.editCategory);
router.delete('/category/:id', categoryController.deleteCategory);
// endpoint bank
router.get('/bank', bankController.viewBank);
router.post('/bank/add', uploadSingle, bankController.addBank);
router.put('/bank/update', uploadSingle, bankController.editBank);
router.delete('/bank/:id', bankController.deleteBank);
// endpoint item
router.get('/item', itemController.viewItem);
router.post('/item/add', uploadMultiple, itemController.addItem);
router.get('/item/show-image/:id', itemController.showImageItem);
router.get('/item/:id', itemController.showEditItem);
router.put('/item/update/:id', uploadMultiple, itemController.editItem);
router.delete('/item/:id/delete', itemController.deleteItem);
router.put('/update/image/item', uploadSingle, itemController.editImageItem);
router.post('/item/add/image', uploadMultiple, itemController.addImageItem);
router.delete('/item/:itemId/image/:id', itemController.deleteImageItem);
// item detail with feature and activity
router.get('/item/show-detail-item/:itemId', itemController.viewItemDetail);
// endpoint detail item (feature and activity)
router.post('/item/add/feature', uploadSingle, featureController.addFeature);
router.put('/update/feature', uploadSingle, featureController.editFeature);
router.delete('/item/:itemId/feature/:id', featureController.deleteFeature);
// endpoint detail item activity
router.post('/item/add/activity', uploadSingle, activityController.addActivity);
router.put('/update/activity', uploadSingle, activityController.editActivity);
router.delete('/item/:itemId/activity/:id', activityController.deleteActivity);

router.get('/booking', bookingController.viewBooking);
router.get('/booking/:id', bookingController.detailBooking);
router.put('/booking/:id/confirmation', bookingController.actionConfirmation);
router.put('/booking/:id/reject', bookingController.actionReject);

module.exports = router;