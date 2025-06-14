require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const blogRoutes = require("./routes/blog");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => console.log(`Server on ${process.env.PORT}`));
  })
  .catch(err => console.error(err));
