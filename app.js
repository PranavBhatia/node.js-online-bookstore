const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const errorController = require("./controllers/error");
const User = require("./models/user");

const mongoConfigs = {
  username: "pranav_bhatia",
  password: "eHurOLied8nZunkh",
  dbname: "bookstoreDB",
};
const MONGODB_URI = `mongodb+srv://${mongoConfigs.username}:${mongoConfigs.password}@cluster0.smq1g.mongodb.net/${mongoConfigs.dbname}?retryWrites=true&w=majority`;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "a secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);
mongoose
  .connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then((result) => {
    // User.findOne().then((user) => {
    //   if (!user) {
    //     const user = new User({
    //       name: "PB",
    //       email: "bhatiapranav1996@gmail.com",
    //       cart: { items: [] },
    //     });
    //     user.save();
    //   }
    // });
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
