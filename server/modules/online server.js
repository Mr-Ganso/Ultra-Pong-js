const [Raquete, Bola] = require("../../client/public/classes")

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
    //Mover Objetos
    j1.mover()
    j2.mover()
    bola.mover()

    //Colisões
    if ((bola.posicao.y + bola.altura >= cH && bola.velocidade.y > 0) || (bola.posicao.y <= 0 && bola.velocidade.y < 0))
        bola.velocidade.y *= -1

    if(!j1.checarColisao(bola))
        j2.checarColisao(bola)

    //Gols
    if (bola.posicao.x > cW)
        j1.gol(j2)

    else if (bola.posicao.x < -bola.largura)
        j2.gol(j1, cW - bola.posicaoInicial.x - bola.largura)

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

    return [overtime, Objetos]
}

var overtime, Objetos

function move(evento) {
    const bool = evento.type === "keydown"

    if (evento.code === 'KeyA') 
        j1.movimento.e = bool
    if (evento.code  === 'KeyD')
        j1.movimento.d = bool 
    if (evento.code  === 'KeyW')
        j1.movimento.c = bool 
    if (evento.code  === 'KeyS')
        j1.movimento.b = bool 
    if (evento.code  === 'KeyV')
        j1.movimento.super = bool 

    if (evento.code  === 'ArrowLeft')
        j2.movimento.e = bool 
    if (evento.code  === 'ArrowRight')
        j2.movimento.d = bool 
    if (evento.code  === 'ArrowUp')
        j2.movimento.c = bool 
    if (evento.code  === 'ArrowDown')
        j2.movimento.b = bool 
    if (evento.code  === 'ShiftRight')
        j2.movimento.super = bool

    console.log(evento.type)
}

module.exports = [tick, move]