const User = require("../models/user");
const Message = require("../models/message");

const userConnect = async (uid) => {
  const user = await User.findById(uid);
  user.online = true;
  await user.save();
  return user;
};
const userDisconnect = async (uid) => {
  const user = await User.findById(uid);
  user.online = false;
  await user.save();
  return user;
};
const getUsers = async () => {
  const user = await User.find().sort("-online");
  return user;
};
const saveMessage = async (payload) => {
  try {
    const message = new Message(payload);
    await message.save();
    return message;
  } catch (error) {
    console.log(error);
    return false;
  }
};
module.exports = { userConnect, userDisconnect, getUsers, saveMessage };
