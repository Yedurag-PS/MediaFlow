const mongoose = require("mongoose");

const messageShema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },
    deliveryStatus: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: {
          type: String,
          enum: ["sent", "delivered", "seen"],
          default: "sent",
        },
        deliveredAt: { type: Date },
        seenAt: { type: Date },
      },
    ],
  },
  { timestamps: true },
);

const Message = mongoose.model("Message", messageShema);

module.exports = Message;
