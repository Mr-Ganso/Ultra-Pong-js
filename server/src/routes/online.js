const router = require("express").Router(),
roomsRouter = require("./rooms"),
server = require("http").createServer(router),
{Server} = require("socket.io"),
io = new Server(server)

router.use("/rooms", roomsRouter)

router.get("/online", (req, res) => {
    res.render("Online Game")
})

io.on('connection', (socket) => {
    console.log('a user connected')
})

module.exports = router