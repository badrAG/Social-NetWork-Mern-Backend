const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const StoriesShema = new mongoose.Schema(
  {
    StoryBy: {
      type: ObjectId,
      ref: "User",
    },
    Image: [
      {
        picture: String,
        views: [
          {
            type: ObjectId,
            ref: "User",
          },
        ],
        created:{type:Date,default:Date.now},
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Stories", StoriesShema);
