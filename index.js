const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");
const { config } = require("./config");
app.use("/emoji_plugin", express.static(path.join(__dirname, "emoji_plugins")));
// app.set("views", "./views");
app.get("/", (req, res) => {
  console.log("her content", res.get("content-type"));
  // res.sendStatus(200);    //  it by default sets the status code of the response and sends the response equivalent to the particular status code to the client.
  res.set("Content-Type", "text/html");
  console.log("her content2", res.get("content-type"));

  res.send(
    '<h1>Hello world</h1><br> <a href = "http://' +
      config.appHost +
      ":" +
      config.appPort +
      '/home"><b><font color="red">Click here to go to our application.<font></b></a>'
  ); // it by default set the content type field if it has not been set previosly
});

app.get("/home", (req, res) => {
  console.log("here dir",__dirname);
  // res.end();    // it is used for ending the response in any case.
  res.sendFile(__dirname + "/index.html");
});

app.get("/views/pug", (req, res) => {
  app.set("view engine", "pug");
  res.render("index", { title: "Hey", message: "Hello there!" });
});
app.get("/views/ejs", (req, res,next) => {
  app.set("view engine", "ejs");

  var data = {
    name: "naman",
    hobbies: ["playing football", "playing chess", "cycling"],
  };

  // res.render( path.join(__dirname, 'index'), { data: data },(err,result)=>{ // with absolute paths
  //   if(err){
  //   console.log("here error and result",err,result);
  //   next(err);
  //   }else{
  //   res.send(result);
  //   }
  // });
  res.render( 'index', { data: data },(err,result)=>{
    if(err){
    console.log("here error and result",err,result);
    next(err);
    }else{
    res.send(result);
    }
  });
});
app.get("/docs/get", (req, res,next) => { 
  console.log("here")
  try{
  // res.redirect("/home");
  res.redirect('back')
  // res.redirect("home"); differnt behaviour can be seen as like file system of the OS.

    //  res.redirect(200,"https://socket.io/");

  } catch (err){
    console.log("here err",err,err.message);
    next(err);
  }
    // An example of res.redirect.
  // console.log("here")

});


app.get("/file/:name", (req, res, next) => {
  console.log("here name", path.join(__dirname, req.params.name));
  var options = {
    root: path.join(__dirname),
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };
  // res.end();    // it is used for ending the response in any case.
  // res.sendFile(__dirname + '/config.js');
  var fileName = req.params.name;
  res.sendFile(fileName,options, function (err,result) {
    console.log("callback called",err,result);
    // this sets the content type of response on the basis of file name extention unless it is not previously defined.
    if (err) {
      console.log("here error ", err,err.message);
      next(err);
    } else {
      console.log("Sent:", fileName);
    }
  });
});

io.on("connection", (socket) => {
  socket.broadcast.emit(
    "entry",
    "-------------one more user connected ----------------"
  );
  socket.on("connect", () => {
    console.log("socketid -->", socket.id);
    console.log(socket.id);
  });
  console.log("one more connected");
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message server backend", { content: msg });
    socket.emit("details", socket.id);
  });
  socket.on("disconnect", (msg) => {
    console.log("This user disconnects",msg);
  });
});

http.listen(config.appPort, () => {
  console.log("listening on *:3000");
});
