const bodyParser = require("body-parser");
const { check } = require("express-validator");

let dataValidationRules = [
check("firstName")
    .notEmpty().withMessage("First Name field cannot be set blank")
    .isAlpha().withMessage("Only alphabet characters are allowed")
    .isLength({max : 10}).withMessage("Should be less than 10 characters"),
check("lastName")
    .notEmpty().withMessage("Last Name field cannot be set blank")
    .isAlpha().withMessage("Only alphabet characters are allowed")
    .isLength({max : 10}).withMessage("Should be less than 10 characters"),
check("dob")
    .notEmpty().withMessage("Date of birth field cannot be set blank")
    .isDate({format: 'YYYY-MM-DD'}).withMessage("Please enter a valid date in YYYY-MM-DD"),
check("zipCode")
    .notEmpty().withMessage("Zip Code field cannot be set blank")
    .isLength({ min: 6, max:6 }).withMessage("Zip Code should be 6 digits long"),
check("state")
    .notEmpty().withMessage("State field cannot be set blank")
    .isAlpha().withMessage("Only alphabet characters are allowed")
    .isLength({max : 10}).withMessage("Should be less than 10 characters"),
check("country")
    .notEmpty().withMessage("Country field cannot be set blank")
    .isAlpha().withMessage("Only alphabet characters are allowed")
    .isLength({max : 10}).withMessage("Should be less than 10 characters"),
check("password")
    .notEmpty().withMessage("Password field cannot be set blank")
    .isLength({max : 10}).withMessage("Should be less than 10 characters")
];

let editDataValidationRules = [
    check("firstName")
        .notEmpty().withMessage("First Name field cannot be set blank")
        .isAlpha().withMessage("Only alphabet characters are allowed")
        .isLength({max : 10}).withMessage("Should be less than 10 characters"),
    check("lastName")
        .notEmpty().withMessage("Last Name field cannot be set blank")
        .isAlpha().withMessage("Only alphabet characters are allowed")
        .isLength({max : 10}).withMessage("Should be less than 10 characters"),
    check("dob")
        .notEmpty().withMessage("Date of birth field cannot be set blank")
        .isDate({format: 'YYYY-MM-DD'}).withMessage("Please enter a valid date in YYYY-MM-DD"),
    check("zipCode")
        .notEmpty().withMessage("Zip Code field cannot be set blank")
        .isLength({ min: 6, max:6 }).withMessage("Zip Code should be 6 digits long"),
    check("state")
        .notEmpty().withMessage("State field cannot be set blank")
        .isAlpha().withMessage("Only alphabet characters are allowed")
        .isLength({max : 10}).withMessage("Should be less than 10 characters"),
    check("country")
        .notEmpty().withMessage("Country field cannot be set blank")
        .isAlpha().withMessage("Only alphabet characters are allowed")
        .isLength({max : 10}).withMessage("Should be less than 10 characters")
    ];

let credentialValidationRules = [
check("firstName")
    .notEmpty().withMessage("firstName field cannot be set blank")
    .isLength({max : 10}).withMessage("Should be less than 10 characters"),
check("password")
    .notEmpty().withMessage("Password field cannot be set blank")
    .isLength({max : 10}).withMessage("Should be less than 10 characters"),
];

module.exports = {dataValidationRules,editDataValidationRules,credentialValidationRules};