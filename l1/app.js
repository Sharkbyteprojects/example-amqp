function bail(err) {
    console.error(err);
    process.exit(1);
}
const amq=require('amqplib/callback_api');
const q = "messages";
const expr = require("express");
const app=expr();
const bodyParser = require("body-parser");
const server=require("http").createServer(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
function publisher(conn,m) {
    conn.createChannel(on_open);
    function on_open(err, ch) {
      if (err != null) bail(err);
      ch.assertQueue(q);
      ch.sendToQueue(q, Buffer.from(m));
    }
  }


app.post("/api/upload",(req,res)=>{
  amq.connect('amqp://broker', function(err, conn) {
         if (err != null) bail(err);
          publisher(conn, req.body.msg);
        });
    res.set({
        "Content-Type": "text/plain"
    });
    res.end("Broadcast Started!");
});

function listen(){
    console.log("Listening");
}
server.listen(8080,listen);

