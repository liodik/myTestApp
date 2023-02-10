const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
const compression = require("compression");

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const telegramRoutes = require("./routes/telegram");


const app = express();
app.use(helmet());
app.use(compression());


// app.use(bodyParser.urlencoded());  // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/users", usersRoutes);

app.use("/api/v1/telegram/", telegramRoutes);


app.use((error, req, res, next) => {
  console.log(error);
  const status = error.status || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose.set("strictQuery", true);
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.nxloz2t.mongodb.net/${process.env.MONGO_DB}`
  )
  .then((res) => app.listen(process.env.PORT || 8080))
  .catch((err) => console.log(err));
