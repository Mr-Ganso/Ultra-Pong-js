let canvas = document.getElementById("Ultra Pong"),
contexto = canvas.getContext("2d"),
socket = io() 

//Constantes gerais
const cH = 735, 
cW = 1540

canvas.height = window.innerHeight * 0.8
canvas.width = cW * canvas.height/cH
contexto.scale(canvas.width/cW, canvas.height/cH)

document.addEventListener("keydown", function(evento) {
    if (key  === 'KeyA')
        j1.movimento.e = true 
    if (key  === 'KeyD')
        j1.movimento.d = true
    if (key  === 'KeyV')
        j1.movimento.super = true
    if (key  === 'KeyW')
        j1.movimento.c = true 
    if (key  === 'KeyS')
        j1.movimento.b = true 

    if (key  === 'ArrowLeft')
        j2.movimento.e = true 
    if (key  === 'ArrowRight')
        j2.movimento.d = true 
    if (key  === 'ShiftRight')
        j2.movimento.super = true 
    if (key  === 'ArrowUp')
        j2.movimento.c = true 
    if (key  === 'ArrowDown')
        j2.movimento.b = true 
})

document.addEventListener("keyup", function(evento) {
    if (evento.code  === 'KeyA')
        j1.movimento.e = false 
    if (evento.code  === 'KeyD')
        j1.movimento.d = false
    if (evento.code  === 'KeyV')
        j1.movimento.super = false
    if (evento.code  === 'KeyW')
        j1.movimento.c = false 
    if (evento.code  === 'KeyS')
        j1.movimento.b = false 

    if (evento.code  === 'ArrowLeft')
        j2.movimento.e = false 
    if (evento.code  === 'ArrowRight')
        j2.movimento.d = false 
    if (evento.code  === 'ShiftRight')
        j2.movimento.super = false 
    if (evento.code  === 'ArrowUp')
        j2.movimento.c = false 
    if (evento.code  === 'ArrowDown')
        j2.movimento.b = false  
})