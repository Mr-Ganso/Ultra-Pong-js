const router = require("express").Router()/*,
tick = require("../../modules/server")*/

var room;

function socketRouter(io) {
    router.get("/:room", (req, res) => {
        res.render("Online Game")
        room = req.params.room.toString()
        io.on('connection', socket => {
            if (socket.rooms.size !== 1) return
            const rooms = io.sockets.adapter.rooms
            socket.join(room)
            console.table(rooms)
            socket.number = rooms.get(room).size - 1

            console.log(`${socket.id} connected to room ${room} as player ${socket.number}`)

            if(socket.number > 1) return

            socket.on("keydown", move)
            socket.on("keyup", move)

            gameLoop(room)

            function move(code, type) {
                if (!jogadores[socket.number]) return
            
                const bool = type === "keydown"
            
                if (code === 'KeyA' || code === 'ArrowLeft') 
                    jogadores[socket.number].movimento.e = bool
            
                if (code  === 'KeyD' || code === 'ArrowRight')
                    jogadores[socket.number].movimento.d = bool 
            
                if (code  === 'KeyW' || code === 'ArrowUp')
                    jogadores[socket.number].movimento.c = bool 
            
                if (code  === 'KeyS' || code === 'ArrowDown')
                    jogadores[socket.number].movimento.b = bool 
            
                if (code  === 'KeyV' || code === 'ShiftRight')
                    jogadores[socket.number].movimento.super = bool 
            }  
        })
    })

    var previousTick = performance.now()
    function gameLoop(room){
        let now = performance.now()
        const tickLengthMs = 16.6

        if (previousTick + tickLengthMs <= now) {
            previousTick = now
            io.to(room).emit("server-info", tick())
        }

        if (performance.now() - previousTick < tickLengthMs - 16)
            return setTimeout(function(){gameLoop(room)})
        
        process.nextTick(function(){gameLoop(room)})
    }
    
    return router
}

const [Raquete, Bola] = require("../../../client/public/classes")

//Constantes gerais
const cH = 735, 
cW = 1540, 
PONTOS_VITORIA = 11

var overtime = false

const j1 = new Raquete({x: 20, y: 150}, 5, {e: 0, d: cW/2 - cW/16}, "#0000FF", "P1"),
j2 = new Raquete({x: 20, y: 150}, cW - 5, {e: cW/2 + cW/16, d: cW}, "#FF0000", "P2"),
bola = new Bola({x: 30, y: 30}, 120, "#EEEEEE"),
jogadores = [j1, j2]

//Atualizar tela
function tick() {
    if ((bola.posicao.y + bola.altura >= cH && bola.velocidade.y > 0) || (bola.posicao.y <= 0 && bola.velocidade.y < 0))
        bola.velocidade.y *= -1

    //Mover Objetos
    j1.mover()
    j2.mover()
    bola.mover()

    if(!j1.checarColisao(bola, j1, j2))
        j2.checarColisao(bola, j1, j2)

    //Gols
    if (bola.posicao.x > cW)
        j1.gol(j2, bola)

    else if (bola.posicao.x < -bola.largura)
        j2.gol(j1, bola, cW - bola.posicaoInicial.x - bola.largura)

    overtime = false

    //Vitória
    if (j1.pontos >= PONTOS_VITORIA && j1.pontos >= j2.pontos + 2)
        j1.vitoria = true

    else if (j2.pontos >= PONTOS_VITORIA && j2.pontos >= j1.pontos + 2)
        j2.vitoria = true

    //Overtime
    else if (j1.pontos  === PONTOS_VITORIA - 1 && j2.pontos  === PONTOS_VITORIA - 1 && j1.altura > 111){
        overtime = true
        j1.overtime()
        j2.overtime()
    }

    Objetos = [j1, j2, bola]

    return [overtime, JSON.stringify(Objetos)]
}

var overtime, Objetos

module.exports = socketRouter