const { response } = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt");

const signUpUser = async (req, res = response) => {
  try {
    const { email, password } = req.body;
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(400).json({
        ok: false,
        msg: "Este correo ya está registrado.",
      });
    }
    const user = new User(req.body);
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);
    await user.save();
    const token = await generateJWT(user._id);
    res.json({ ok: true, user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Algo falló, inténtelo más tarde.",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDB = await User.findOne({ email });
    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: "Correo o contraseña incorrecta",
      });
    }
    const validPassword = bcrypt.compareSync(password, userDB.password);
    if (!validPassword) {
      return res.status(404).json({
        ok: false,
        msg: "Correo o contraseña incorrecta",
      });
    }
    const token = await generateJWT(userDB.id);
    res.json({
      ok: true,
      user: userDB,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Algo falló, inténtelo más tarde.",
    });
  }
};

const revalidateToken = async (req, res) => {
  const uid = req.uid;

  const token = await generateJWT(uid);
  const user = await User.findById(uid);
  res.json({
    ok: true,
    user,
    token,
  });
};
module.exports = {
  signUpUser,
  loginUser,
  revalidateToken,
};
