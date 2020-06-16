const express = require("express");

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const bodyParser = require("body-parser");

const app = express();

app.use(adminRoutes);
app.use(shopRoutes);

app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000);
