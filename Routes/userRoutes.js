const router = require("express").Router();
const userController = require("../controller/userController");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const validator = require("../Middleware/validator");
const checkAuth = require("../Middleware/Authentication");

router.get("/getAll",checkAuth , userController.getAll);
router.get("/getAccountInfo",  checkAuth , userController.getAccountInfo);
router.delete("/deleteAccount", checkAuth , userController.deleteAccount);
router.put(
  "/editAccount",
  checkAuth ,
  urlencodedParser,
  validator.editDataValidationRules,
  userController.editUser
);
router.post(
  '/uploadImage',
  // userController.saveImage,
  userController.uploadImage
);
router.post(
  "/signUp",
  urlencodedParser,
  validator.dataValidationRules,
  userController.signUp
);
router.post(
  "/signIn",
  urlencodedParser,
  validator.credentialValidationRules,
  userController.signIn
);

router.use("*", userController.notfound).use(userController.internalServer);

module.exports = router;
