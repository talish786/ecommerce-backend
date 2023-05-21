const {body} = require("express-validator");
module.exports = [body('categoryname').not().isEmpty().trim().escape().withMessage('category is required')];