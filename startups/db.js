const mongoose = require("mongoose")
const logger = require('../config/logger')


module.exports = function (){
      mongoose
        .connect(process.env.DB)
        .then(() => console.log("Mongodb connected Successfully!"))
        .catch((err) => {
          logger.error("MongoDB connecton Fail!", err);
          logger.on("Finish", () => {
            process.exit(1);
          });
          logger.end(1);
        });
  }