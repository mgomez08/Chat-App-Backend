/*
    path: api/auth
*/
const { Router } = require("express");
const { check } = require("express-validator");
const {
  signUpUser,
  loginUser,
  revalidateToken,
} = require("../controllers/auth");
const { validateJWT } = require("../helpers/validate-jwt");
const { validateFields } = require("../middlewares/validateFields");

const router = Router();

//Create new User
router.post(
  "/signUp",
  [
    check("name", "El password es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
    validateFields,
  ],
  signUpUser
);
//Login user
router.post(
  "/",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
    validateFields,
  ],
  loginUser
);
//Revalidate token
router.get("/revalidateToken", validateJWT, revalidateToken);

module.exports = router;
