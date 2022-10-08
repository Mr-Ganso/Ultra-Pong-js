const express = require("express"),
app = express(),
onlineRouter = require("./routes/online"),
path = require("path"),
server = require("http").createServer(app),
{Server} = require("socket.io"),
io = new Server(server)

app.set('views', path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(express.static(path.join(__dirname, 'public')))

app.get("/local", (req, res) => {res.render("Local Game")})

app.get("/online", (req, res) => {res.render("Online Game")})

io.on('connection', (socket) => {
    console.log('a user connected')
})

server.listen(7777)