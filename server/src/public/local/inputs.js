document.addEventListener("keydown", function(evento) {
    if (evento.code  === 'KeyA') 
        j1.movimento.e = true
    if (evento.code  === 'KeyD')
        j1.movimento.d = true 
    if (evento.code  === 'KeyW')
        j1.movimento.c = true 
    if (evento.code  === 'KeyS')
        j1.movimento.b = true 
    if (evento.code  === 'KeyV')
        j1.movimento.super = true 

    if (evento.code  === 'ArrowLeft')
        j2.movimento.e = true 
    if (evento.code  === 'ArrowRight')
        j2.movimento.d = true 
    if (evento.code  === 'ArrowUp')
        j2.movimento.c = true 
    if (evento.code  === 'ArrowDown')
        j2.movimento.b = true 
    if (evento.code  === 'ShiftRight')
        j2.movimento.super = true 
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