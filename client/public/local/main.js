const canvas = document.getElementById("Ultra Pong"),
contexto = canvas.getContext("2d") 

//Constantes gerais
const cH = 735, 
cW = 1540, 
VELOCIDADE_INICIAL = 10,
ACELERACAO_INICIAL = 1,
PONTOS_VITORIA = 11

canvas.height = window.innerHeight * 0.9
canvas.width = cW * canvas.height/cH
contexto.scale(canvas.width/cW, canvas.height/cH)

const j1 = new Raquete({x: 20, y: 150}, 5, {e: 0, d: cW/2 - cW/16}, "#0000FF", "P1"),
j2 = new Raquete({x: 20, y: 150}, cW - 5, {e: cW/2 + cW/16, d: cW}, "#FF0000", "P2"),
bola = new Bola({x: 30, y: 30}, 120, "#EEEEEE")

//Atualizar tela
function box() {
    requestAnimationFrame(box)

    //Desenhar Fundo
    contexto.fillStyle = "#000000" 
    contexto.fillRect(0,0, cW, cH) 

    contexto.fillStyle = "#999999"
    contexto.fillRect(cW/2 - 10, 0, 20, cH) 
    contexto.fillRect(cW/2 - cW/16 + 5, cH/2 - 10, cW/8 - 10, 20)
    contexto.fillRect(cW/2 - cW/16, cH/2 - 75, 10, 150)
    contexto.fillRect(cW/2 + cW/16, cH/2 - 75, -10, 150)
    contexto.fillStyle = "#EEEEEE"

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

    //Desenhar objetos
    j1.desenhar()
    j2.desenhar()
    bola.desenhar()

    //Desenhar Placar
    contexto.font = "100px Impact"
    contexto.fillText(j1.pontos, cW/3, cH/8)
    contexto.fillText(j2.pontos, cW/1.5, cH/8)

    //Vitória
    if (j1.pontos >= PONTOS_VITORIA && j1.pontos >= j2.pontos + 2)
        j1.vencer()

    else if (j2.pontos >= PONTOS_VITORIA && j2.pontos >= j1.pontos + 2)
        j2.vencer()

    //Overtime
    else if (j1.pontos  === PONTOS_VITORIA - 1 && j2.pontos  === PONTOS_VITORIA - 1 && j1.altura > 111) {
        contexto.font = "200px Impact" 
        contexto.fillText ("OVERTIME", 400, cH/2 + 80) 
        j1.overtime()
        j2.overtime()
    }
}
requestAnimationFrame(box)