//modules
const express = require("express"),
app = express(),
server = require("http").createServer(app),
{Server} = require("socket.io"),
io = new Server(server),
onlineRouter = require("./routes/online")(io)

//actual code
app.set('views', "./client/views")
app.set("view engine", "ejs")
app.use(express.static("./client/public"))



app.get("/local", (req, res) => {res.render("Local Game")})

app.use("/online", onlineRouter)



server.listen(7777)