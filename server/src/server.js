const express = require("express"),
app = express(),
onlineRouter = require("./routes/online"),
server = require("http").createServer(app),
{Server} = require("socket.io"),
io = new Server(server),
onlineServer = require("../modules/online server")

app.set('views', "./client/views")
app.set("view engine", "ejs")

app.use(express.static("./client/public"))

app.get("/local", (req, res) => {res.render("Local Game")})

app.get("/online", (req, res) => {res.render("Online Game")})

io.on('connection', (socket) => {
    console.log(socket.id + ' connected')
    socket.on("keydown", (evento) => {
        if (evento  === 'KeyA') 
            j1.movimento.e = true
        if (evento  === 'KeyD')
            j1.movimento.d = true 
        if (evento  === 'KeyW')
            j1.movimento.c = true 
        if (evento  === 'KeyS')
            j1.movimento.b = true 
        if (evento  === 'KeyV')
            j1.movimento.super = true 
    
        if (evento  === 'ArrowLeft')
            j2.movimento.e = true 
        if (evento  === 'ArrowRight')
            j2.movimento.d = true 
        if (evento  === 'ArrowUp')
            j2.movimento.c = true 
        if (evento  === 'ArrowDown')
            j2.movimento.b = true 
        if (evento  === 'ShiftRight')
            j2.movimento.super = true 
        })
    
        socket.on("keyup", function(evento) {
        if (evento  === 'KeyA')
            j1.movimento.e = false 
        if (evento  === 'KeyD')
            j1.movimento.d = false
        if (evento  === 'KeyV')
            j1.movimento.super = false
        if (evento  === 'KeyW')
            j1.movimento.c = false 
        if (evento  === 'KeyS')
            j1.movimento.b = false 
    
        if (evento  === 'ArrowLeft')
            j2.movimento.e = false 
        if (evento  === 'ArrowRight')
            j2.movimento.d = false 
        if (evento  === 'ShiftRight')
            j2.movimento.super = false 
        if (evento  === 'ArrowUp')
            j2.movimento.c = false 
        if (evento  === 'ArrowDown')
            j2.movimento.b = false  
    })
})

class Objeto {
    constructor (tamanho, posicao, cor) {
        console.log(this)
        
        this.largura = tamanho.x
        this.altura = tamanho.y
        this.posicaoInicial = {x: posicao, y: cH/2 - this.altura/2}

        if (this.posicaoInicial.x > cH/2)
            this.posicaoInicial.x -= this.largura
        Object.freeze(this.posicaoInicial)

        this.posicao = {x: this.posicaoInicial.x, y: this.posicaoInicial.y}
        this.cor = cor
    }    
}

class Bola extends Objeto {
    constructor (tamanho, posicao, cor, aceleracao = ACELERACAO_INICIAL) {
        super(tamanho, posicao, cor)

        this.velocidade = {x: 0, y: 0}
        this.aceleracao = aceleracao
        if (Math.random() < 0.5)
            this.posicao.x = cW - this.posicao.x - this.largura
    }

    mover() {
        this.posicao.x += this.velocidade.x
        this.posicao.y += this.velocidade.y
    }

    static getAceleracao(posicao) {
        return VELOCIDADE_INICIAL/2 * (posicao * 6/2615 - 4171/1046)
    }
}

class Raquete extends Objeto {
    constructor (tamanho, posicao, limites, cor, nome) {
        super(tamanho, posicao, cor)

        this.limites = limites
        this.limites.d = limites.d - this.largura
        this.aceleracao = {x: ACELERACAO_INICIAL, y: ACELERACAO_INICIAL}
        this.movimento = {
            e: false, d: false,
            c: false, b: false,
            super: false
        }
        this.nome = nome
        this.pontos = 0
        this.vitoria = false
    }

    get velocidade() {
        return {
            x: VELOCIDADE_INICIAL * this.aceleracao.x,
            y: VELOCIDADE_INICIAL * this.aceleracao.y
        }
    }

    mover() {
        if (this.movimento.super) {
            this.aceleracao.x *= 3
            this.aceleracao.y *= 3.5
        }  

        if (this.movimento.e)
            this.posicao.x > this.limites.e ? this.posicao.x -= this.velocidade.x : this.posicao.x = this.limites.e
        if (this.movimento.d)
            this.posicao.x < this.limites.d ? this.posicao.x += this.velocidade.x : this.posicao.x = this.limites.d
        if (this.movimento.c)
            this.posicao.y > 0 ? this.posicao.y -= this.velocidade.y : this.posicao.y = 0
        if (this.movimento.b)
            this.posicao.y < cH - this.altura ? this.posicao.y += this.velocidade.y : this.posicao.y = cH - this.altura

        this.aceleracao = {x: ACELERACAO_INICIAL, y: ACELERACAO_INICIAL}
    }

    checarColisao(excecao = this.movimento.super) {
        const THIS_BORDA = this.posicao.x + this.largura,
        BORDA_COLISOR = bola.posicao.x + bola.largura,
        THIS_FUNDO = this.posicao.y + this.altura,
        FUNDO_COLISOR = bola.posicao.y + bola.altura
        
        if (bola.posicao.y > THIS_FUNDO || FUNDO_COLISOR < this.posicao.y || excecao) 
            return

        if (BORDA_COLISOR >= this.posicao.x && BORDA_COLISOR <= this.posicao.x + bola.velocidade.x + this.velocidade.x)
            return this === j2 ? this.colidirFrente(j2.posicao.x, cW - j1.posicao.x - j1.largura, j2.posicao.x - bola.largura) : bola.velocidade.x = -VELOCIDADE_INICIAL * 3

        if (bola.posicao.x <= THIS_BORDA && bola.posicao.x >= THIS_BORDA + bola.velocidade.x - this.velocidade.x) 
            return this === j1 ? this.colidirFrente(cW - j1.posicao.x - j1.largura, j2.posicao.x, j1.posicao.x + j1.largura) : bola.velocidade.x = VELOCIDADE_INICIAL * 3
    
        return
    }

    colidirFrente(THIS_DISTANCIA, DISTANCIA_OUTRO, BORDA) {
        const DIRECAO_BOLA = bola.velocidade.x/Math.abs(bola.velocidade.x) || 1

        bola.velocidade.x = DIRECAO_BOLA * (THIS_DISTANCIA * 8/2615 - 2955/523) * VELOCIDADE_INICIAL
        bola.posicao.x = BORDA

        console.log("Velocidade da bola: ", bola.velocidade.x)

        if (this.movimento.c) {
            bola.velocidade.y = Bola.getAceleracao(DISTANCIA_OUTRO)
            return true
        }

        if (this.movimento.b) {
            bola.velocidade.y = -Bola.getAceleracao(DISTANCIA_OUTRO)
            return true
        }

        bola.velocidade.y = bola.velocidade.y/4 * (DISTANCIA_OUTRO * 6/2615 + 475/1046)
        return true
    }

    gol(outro, posicaoBola = bola.posicaoInicial.x) {
        this.posicao.x = this.posicaoInicial.x
        this.posicao.y = this.posicaoInicial.y

        outro.posicao.x = outro.posicaoInicial.x
        outro.posicao.y = outro.posicaoInicial.y

        bola.posicao.x = posicaoBola
        bola.posicao.y = bola.posicaoInicial.y
        bola.velocidade = {x:0, y:0}

        this.pontos++
    }

    overtime() {
        this.altura -= 0.26
        this.posicao.y += 0.26
        this.aceleracao.x = 0
    }

    vencer() {
        contexto.font = "300px Impact" 
        contexto.fillStyle = this.cor 
        contexto.fillText (this.nome, cW/6, cH/2 + 130) 
        contexto.fillStyle = "#EEEEEE" 
        contexto.fillText ("WINS", cW/2.75 + 20, cH/2 + 130) 
        bola.posicao.y = cH * 2 
        bola.posicao.x = cW/2 
    }
}

//Constantes gerais
const cH = 735, 
cW = 1540, 
VELOCIDADE_INICIAL = 10,
ACELERACAO_INICIAL = 1,
PONTOS_VITORIA = 11

var overtime = false

const j1 = new Raquete({x: 20, y: 150}, 5, {e: 0, d: cW/2 - cW/16}, "#0000FF", "P1"),
j2 = new Raquete({x: 20, y: 150}, cW - 5, {e: cW/2 + cW/16, d: cW}, "#FF0000", "P2"),
bola = new Bola({x: 30, y: 30}, 120, "#EEEEEE")

//Atualizar tela
function tick() {
    inicio = performance.now()
    //Mover Objetos
    j1.mover()
    j2.mover()
    bola.mover()

    //Colisões
    if ((bola.posicao.y + bola.altura >= cH && bola.velocidade.y > 0) || (bola.posicao.y <= 0 && bola.velocidade.y < 0))
        bola.velocidade.y *= -1

    if(!j1.checarColisao())
        j2.checarColisao()

    //Gols
    if (bola.posicao.x > cW)
        j1.gol(j2)

    else if (bola.posicao.x < -bola.largura)
        j2.gol(j1, cW - bola.posicaoInicial.x - bola.largura)

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

    io.emit("server-info", overtime, Objetos)
    console.log(performance.now() - inicio)
}

var overtime, Objetos

setInterval(tick, 1000/60)

server.listen(7777)