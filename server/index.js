const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

require("dotenv").config();
const userRoutes = require("./routes/userRoutes");

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);

//connection to mongodb
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log(err.message);
  });

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
