const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const Image = require('./modals/Image');
const dotenv = require("dotenv");
const cors = require("cors");
//  const Image = require('./modals/imageModel');
const app = express();
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// CORS Setup
app.use(
  cors({
    origin: "*",
  })
);

// Load Environment Variables
dotenv.config();

// Body parsing Middleware
app.use(express.json());

// Connect to MongoDB


// Multer storage configuration
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Upload image endpoint
app.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    const { path } = req.file;
    const { originalname } = req.file;

    const newImage = new Image({
      imageName: originalname,
      imagePath: path,
    });

    const savedImage = await newImage.save();

    res.json(savedImage);
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ error: 'Error uploading image' });
  }
});

// Get images endpoint
app.get('/get-images', async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images.map((image) => image.imagePath));
  } catch (err) {
    console.error('Error fetching images:', err);
    res.status(500).json({ error: 'Error fetching images' });
  }
});

// Importing routes
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");

// Database Connection
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Server is Connected to the Database");
  } catch (err) {
    console.log("Server is NOT connected to the Database", err.message);
  }
};

connectDb();

// API running message
app.get("/", (req, res) => {
  res.send("API is running");
});

// Using routes
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

// Server setup
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Socket.io setup
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
  pingTimeout: 60000,
});

// Socket.io connection handling
io.on("connection", (socket) => {
  socket.on("setup", (user) => {
    socket.join(user.data._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
  });
  socket.on("new message", (newMessageStatus) => {
    var chat = newMessageStatus.chat;
    if (!chat.users) {
      return console.log("chat.users not defined");
    }

    chat.users.forEach((user) => {
      if (user._id == newMessageStatus.sender._id) return;
      socket.in(user._id).emit("newmessage", newMessageStatus.message);
    });
  });
});








