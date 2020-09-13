const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("5f471befd2222385b1caf4cd")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

const mongoConfigs = {
  username: "pranav_bhatia",
  password: "eHurOLied8nZunkh",
  dbname: "bookstoreDB",
};
const uri = `mongodb+srv://${mongoConfigs.username}:${mongoConfigs.password}@cluster0.smq1g.mongodb.net/${mongoConfigs.dbname}?retryWrites=true&w=majority`;
mongoose
  .connect(uri)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
