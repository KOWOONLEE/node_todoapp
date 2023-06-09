const express = require("express");
const app = express();
// const bodyParser = require("body-parser");
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
// "mongodb+srv://admin:rhdns3901@cluster0.dambb0b.mongodb.net/?retryWrites=true&w=majority"
app.set("view engine", "ejs");

const MongoClient = require("mongodb").MongoClient;
let db;
MongoClient.connect(
  "mongodb+srv://admin:rhdns3901@cluster0.dambb0b.mongodb.net/?retryWrites=true&w=majority",
  { useUnifiedTopology: true },
  function (에러, client) {
    if (에러) return console.log(에러);
    db = client.db("todoapp");
    //서버띄우는 코드 여기로 옮기기
    app.listen("8080", function () {
      console.log("listening on 8080");
    });
  }
);

app.get("/beauty", function (req, res) {
  res.send("뷰티 용품 쇼핑할 수 있는 페이지입니다.");
});
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.get("/write", function (req, res) {
  res.sendFile(__dirname + "/write.html");
});

//글 생성하기
app.post("/add", function (req, res) {
  res.send("전송완료");
  db.collection("counter").findOne(
    { name: "게시물갯수" },
    function (error, result) {
      let totalPostCount = result.totalPost;
      db.collection("post").insertOne(
        {
          _id: totalPostCount + 1,
          title: req.body.title,
          contents: req.body.contents,
        },
        function (error, result) {
          //update operator $set 바꿀값, $inc 증가값
          db.collection("counter").updateOne(
            { name: "게시물갯수" },
            { $inc: { totalPost: 1 } },
            function (error, result) {
              if (error) {
                return console.log(error);
              }
            }
          );
        }
      );
    }
  );
});
//글 보여주기
app.get("/list", function (req, res) {
  db.collection("post")
    .find()
    .toArray(function (error, result) {
      res.render("list.ejs", { posts: result });
    });
});
//글 삭제하기
app.delete("/delete", function (req, res) {
  req.body._id = parseInt(req.body._id);
  db.collection("post").deleteOne(req.body, function (error, result) {
    console.log("삭제완료");
    res.status(200).send({ message: "성공함." });
  });
});
//req.body에 담겨온 게시물 번호를 가진 글을 db에서 삭제해줘라

//detail/[i]로 접속하면 detail[i].ejs 내용 보여주기 <parameter>
// app.get("/detail/:id", function (req, res) {
//   db.collection("post").findOne(
//     { _id: parseInt(req.params.id) },
//     function (error, result) {
//       //findOne찾고 싶은 데이터 찾기
//       res.render("detail.ejs", { idNum: result });
//     }
//   );
// });

//없는 게시물이 있으면 어떻게 처리할지.
app.get("/detail/:id", function (req, res) {
  db.collection("post").findOne(
    { _id: parseInt(req.params.id) },
    function (error, result) {
      if (result === null) {
        res.status(404).send("해당경로는 존재하지 않습니다.");
      } else {
        res.render("detail.ejs", { idNum: result });
      }
      //findOne찾고 싶은 데이터 찾기
    }
  );
});
