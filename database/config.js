const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("DB connect");
  } catch (e) {
    console.log(e);
    throw new Error("Erro en la conexión a base de datos");
  }
};

module.exports = {
  dbConnection,
};
