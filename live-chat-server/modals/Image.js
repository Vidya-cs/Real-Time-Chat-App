// models/Image.js

const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  imageName: {
    type: String,
    required: true,
  },
  imagePath: {
    type: String,
    required: true,
  },
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
