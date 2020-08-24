const MongoClient = require("mongodb").MongoClient;
const username = "pranav_bhatia";
const password = "eHurOLied8nZunkh";
const dbname = "bookstoreDB";
const uri = `mongodb+srv://${username}:${password}@cluster0.smq1g.mongodb.net/${dbname}?retryWrites=true&w=majority`;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(uri, { useUnifiedTopology: true })
    .then((client) => {
      console.log("Connected");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found";
};

module.mongoConnect = mongoConnect;
module.getDb = getDb;
