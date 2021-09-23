const Message = require("../models/message");

const getChat = async (req, res) => {
  try {
    const myUid = req.uid;
    const messageFrom = req.params.from;
    const last30Messages = await Message.find({
      $or: [
        { from: myUid, to: messageFrom },
        { from: messageFrom, to: myUid },
      ],
    })
      .sort({ createdAt: "asc" })
      .limit(30);
    res.json({
      ok: true,
      messages: last30Messages,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      ok: false,
      msg: "Algo falló al obtener los mensajes, intente más tarde.",
    });
  }
};

module.exports = { getChat };
