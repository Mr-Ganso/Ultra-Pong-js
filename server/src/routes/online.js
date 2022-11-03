const router = require("express").Router(),
{tick, init} = require("../../modules/server"),
Loop = require("accurate-game-loop")

router.route('/')
.get((req, res) => {res.render("Rooms Page", "")})
.post((req, res) => {
    const roomName = req.body.room

    if (allRooms.get(roomName) && req.body.submit === "Create Room")
        return res.render("Rooms Page", roomName)

    if (!allRooms.get(roomName) && req.body.submit === "Join Room")
        return res.render("Rooms Page", roomName)

    res.redirect("/online/" + roomName)
})

const states = new Map(), loops = new Map()
var roomTemp;

function socketRouter(io) {
    router.get("/:room", (req, res) => {
        res.render("Online Game")
        roomTemp = req.params.room.toString()
        var allRooms = io.sockets.adapter.rooms
        io.on('connection', socket => {
            if (socket.rooms.size !== 1) return

            socket.room = roomTemp
            socket.join(socket.room)
            console.table(allRooms)
            socket.number = allRooms.get(socket.room).size - 1

            console.log(`${socket.id} connected to room ${socket.room} as player ${socket.number}`)

            if(socket.number > 1) return

            socket.on("keydown", move)
            socket.on("keyup", move)
            socket.on("disconnecting", () => {
                if (!loops.get(socket.room) || allRooms.get(socket.room).size) return

                loops.get(socket.room).stop()
                loops.delete(socket.room)
                states.delete(socket.room)
                console.log(`Game on room ${socket.room} terminated`)
            })

            if (allRooms.get(socket.room).size < 2) return

            states.set(socket.room, init())
            loops.set(socket.room , new Loop(() => {io.to(socket.room).volatile.emit("server-info", tick(states.get(socket.room)))}, 60))
            loops.get(socket.room).start()


            io.to(socket.room).emit("init")

            function move(code, type) {
                const player = states.get([...socket.rooms][1]).players[socket.number],
                bool = type === "keydown"
            
                if (code === 'KeyA' || code === 'ArrowLeft') 
                    player.movimento.e = bool
            
                if (code  === 'KeyD' || code === 'ArrowRight')
                    player.movimento.d = bool 
            
                if (code  === 'KeyW' || code === 'ArrowUp')
                    player.movimento.c = bool 
            
                if (code  === 'KeyS' || code === 'ArrowDown')
                    player.movimento.b = bool 
            
                if (code  === 'KeyV' || code === 'ShiftRight')
                    player.movimento.super = bool 
            } 
        })
    })
    return router
}

module.exports = socketRouter