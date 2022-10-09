const router = require("express").Router(),
[tick, move] = require("../../modules/online server")

//router.use("/rooms", roomsRouter)

function socketRouter(io) {
    router.get("/", (req, res) => {
        res.render("Online Game")
    })

    io.on('connection', (socket) => {
        console.log(socket.id + ' connected')
        socket.on("keydown", move),
        socket.on("keyup", move)
    })

    gameLoop()

    var tickLengthMs = 16.6
    var previousTick = performance.now()

    function gameLoop(){
        var now = performance.now()

        if (previousTick + tickLengthMs <= now) {
            previousTick = now
            io.emit("server-info", tick())
        }

        if (performance.now() - previousTick < tickLengthMs - 16)
            return setTimeout(gameLoop)
        
        setImmediate(gameLoop)
    }

    return router
}

module.exports = socketRouter