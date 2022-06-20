const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv"); // permet de .env
const helmet = require("helmet"); // aide a secu l'app en def des entete http
const morgan = require("morgan"); // permet d'enregistrer des demandes http
const multer = require("multer"); // pour les photos
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const router = express.Router();
const path = require("path");
const cors = require('cors'); // permet d'autoriser certaine chose comment method get etc 


dotenv.config();
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  'allowedHeaders': ['sessionId', 'Content-Type', 'Authorization'],
  'exposedHeaders': ['sessionId'],
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}
app.use(cors(corsOptions));



mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);
app.use("/images", express.static(path.join(__dirname, "images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images/");
  },
  filename: (req, file, callback) => {
    callback(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.listen(4200, () => {
  console.log("Backend server is running!");
});
