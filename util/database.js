const MongoClient = require("mongodb").MongoClient;
const username = "pranav_bhatia";
const password = "eHurOLied8nZunkh";
const dbname = "bookstoreDB";
const uri = `mongodb+srv://${username}:${password}@cluster0.smq1g.mongodb.net/${dbname}?retryWrites=true&w=majority`;

const MongoConnect = (callback) => {
  MongoClient.connect(uri, { useUnifiedTopology: true })
    .then((result) => {
      console.log("Connected");
      callback(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = MongoConnect;
