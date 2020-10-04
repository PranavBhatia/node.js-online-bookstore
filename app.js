const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({ secret: "a secret", resave: false, saveUninitialized: false })
);

app.use((req, res, next) => {
  User.findById("5f5d97769b95076542f26cad")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

const mongoConfigs = {
  username: "pranav_bhatia",
  password: "eHurOLied8nZunkh",
  dbname: "bookstoreDB",
};
const uri = `mongodb+srv://${mongoConfigs.username}:${mongoConfigs.password}@cluster0.smq1g.mongodb.net/${mongoConfigs.dbname}?retryWrites=true&w=majority`;
mongoose
  .connect(uri, { useUnifiedTopology: true, useNewUrlParser: true })
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "PB",
          email: "bhatiapranav1996@gmail.com",
          cart: { items: [] },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
