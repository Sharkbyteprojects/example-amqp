function bail(err) {
    console.error(err);
    process.exit(1);
}
const expr = require("express");
const app=expr();
var events = require('events');
var eventEmitter = new events.EventEmitter();
const server=require("http").createServer(app);
app.get("/api/events", (req, res) => {
    res.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    });
    eventEmitter.on('send',(data)=>{
        let id = new Date().toLocaleTimeString().toString();
        res.write("id: " + id + "\n");
        res.write("data: " + data.toString() + "\n\n");
    });
});
require('amqplib/callback_api')
  .connect('amqp://broker', function(err, conn) {
    if (err != null) bail(err);
    var ok = conn.createChannel(on_open);
    function on_open(err, ch) {
         if (err != null) bail(err);
             ch.assertQueue("messages");
             ch.consume("messages", function(msg) {
              if (msg !== null) {
                   eventEmitter.emit("send",msg.content);
              }
             });
    }
  });
function listen(){
    console.log("Listening");
}
server.listen(8080,listen);