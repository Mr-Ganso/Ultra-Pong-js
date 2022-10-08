class Objeto {
    constructor (tamanho, posicao, cor) {
        console.log(this)

        this.largura = tamanho.x
        this.altura = tamanho.y
        this.posicaoInicial = {x: posicao - this.largura, y: cH/2 - this.altura/2}
        this.posicao = {x: posicao - this.largura, y: cH/2 - this.altura/2}
        this.cor = cor
    }

    desenhar() {
        contexto.fillStyle = this.cor
        if (this.movimento?.super)
            contexto.fillStyle = "#FFFF00" 
        contexto.fillRect(this.posicao.x, this.posicao.y, this.largura, this.altura) 
    }

    resetar() {
        this.velocidade = {x:0, y:0}
        this.posicao.x = this.posicaoInicial.x
        this.posicao.y = this.posicaoInicial.y
    }
}

class Bola extends Objeto {
    constructor (tamanho, posicao, cor, aceleracao = ACELERACAO_INICIAL) {
        super(tamanho, posicao, cor)

        this.velocidade = {x: 0, y: 0}
        this.aceleracao = aceleracao
        if (Math.random() < 0.5)
            this.posicao.x = cW - this.posicao.x
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
        this.velocidade = {x: VELOCIDADE_INICIAL, y: VELOCIDADE_INICIAL}
        this.aceleracao = ACELERACAO_INICIAL
        this.movimento = {
            e: false, d: false,
            c: false, b: false,
            super: false
        }
        this.nome = nome
        this.pontos = 0
    }

    mover() {
        if (this.movimento.super) {
            this.velocidade.x *= 3
            this.velocidade.y *= 3.5
        }  

        if (this.movimento.e)
            this.posicao.x > this.limites.e ? this.posicao.x -= this.velocidade.x : this.posicao.x = this.limites.e
        if (this.movimento.d)
            this.posicao.x < this.limites.d ? this.posicao.x += this.velocidade.x : this.posicao.x = this.limites.d
        if (this.movimento.c)
            this.posicao.y > 0 ? this.posicao.y -= this.velocidade.y : this.posicao.y = 0
        if (this.movimento.b)
            this.posicao.y < cH - this.altura ? this.posicao.y += this.velocidade.y : this.posicao.y = cH - this.altura

        this.velocidade = {x: VELOCIDADE_INICIAL, y: VELOCIDADE_INICIAL}
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

    gol() {
        j1.resetar()
        j2.resetar()
        bola.resetar()
        this.pontos++
    }

    overtime() {
        this.altura -= 0.26
        this.posicao.y += 0.26
        this.velocidade.x = 0
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