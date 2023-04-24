const express = require("express");
const app = express();
// const bodyParser = require("body-parser");
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
// app.listen(8080, function () {
//   console.log("listening on 8080");
// });
// "mongodb+srv://admin:rhdns3901@cluster0.dambb0b.mongodb.net/?retryWrites=true&w=majority"

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://admin:rhdns3901@cluster0.dambb0b.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    db = client.db("todoapp");
    // collection = await db.collection("post");
    await db
      .collection("post")
      .insertOne({ 이름: "kowoon", 나이: 20 }, function (error, result) {
        console.log("저장완료");
      });
    app.listen(8080, function () {
      console.log("listening on 8080");
    });
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

app.get("/beauty", function (req, res) {
  res.send("뷰티 용품 쇼핑할 수 있는 페이지입니다.");
});
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.get("/write", function (req, res) {
  res.sendFile(__dirname + "/write.html");
});

app.post("/add", function (req, res) {
  res.send("전송완료");
  console.log(req.body.title);
  console.log(req.body.contents);
  console.log(req.body);
});
