const express = require("express"),
app = express(),
onlineRouter = require("./routes/online"),
server = require("http").createServer(app),
{Server} = require("socket.io"),
io = new Server(server)

app.set('views', "./client/views")
app.set("view engine", "ejs")

app.use(express.static("./client/public"))

app.get("/local", (req, res) => {res.render("Local Game")})

app.get("/online", (req, res) => {res.render("Online Game")})

io.on('connection', (socket) => {
    console.log('a user connected')
})

server.listen(7777)