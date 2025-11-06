let ataqueJugador
let ataqueEnemigo
let vidasJugador = 3
let vidasEnemigo = 3

function corazones(n) { return "❤".repeat(Math.max(0, n)); }
function renderVidas() {
    const vj = document.getElementById('vidas-jugador')
    const ve = document.getElementById('vidas-enemigo')
    if (!vj || !ve) return
    vj.innerHTML = `<span class="hearts">${corazones(vidasJugador)}</span>`
    ve.innerHTML = `<span class="hearts">${corazones(vidasEnemigo)}</span>`
}

function iniciarJuego() {
    const sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque')
    sectionSeleccionarAtaque.style.display = 'none'

    const botonPersonajeJugador = document.getElementById('boton-personaje');
    botonPersonajeJugador.addEventListener('click', seleccionarPersonajeJugador);

    const sectionReiniciar = document.getElementById('reiniciar')
    sectionReiniciar.style.display = "none"

    document.getElementById("reglas-del-juego").style.display = "none";
    document.getElementById('boton-reglas').addEventListener('click', mostrarReglas);

    document.getElementById('boton-jugar').style.display = 'none';
    document.getElementById('seleccionar-personaje').style.display = 'block';

    const botonPunio = document.getElementById('boton-punio')
    botonPunio.addEventListener('click', ataquePunio)
    const botonPatada = document.getElementById('boton-patada')
    botonPatada.addEventListener('click', ataquePatada)
    const botonBarrida = document.getElementById('boton-barrida')
    botonBarrida.addEventListener('click', ataqueBarrida)

    const botonReiniciar = document.getElementById('boton-reiniciar')
    botonReiniciar.addEventListener('click', reiniciarJuego)

    renderVidas()
}

function mostrarReglas() {
    document.getElementById("reglas-del-juego").style.display = "block";
    document.getElementById('boton-jugar').style.display = 'block';
    document.getElementById('boton-reglas').style.display = 'none';
    document.getElementById('seleccionar-personaje').style.display = 'none';
    document.getElementById('boton-jugar').addEventListener('click', seleccionarPersonajeJugador);
}

function seleccionarPersonajeJugador() {
    const sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque')
    sectionSeleccionarAtaque.style.display = 'block';
    document.getElementById('boton-reglas').style.display = 'none';
    const sectionSeleccionarPersonaje = document.getElementById('seleccionar-personaje')
    sectionSeleccionarPersonaje.style.display = 'none'

    const inputZuko = document.getElementById('zuko')
    const inputKatara = document.getElementById('katara')
    const inputAang = document.getElementById('aang')
    const inputToph = document.getElementById('toph')
    const spanPersonajeJugador = document.getElementById('personaje-jugador')

    document.getElementById("reglas-del-juego").style.display = "none";
    document.getElementById('boton-reglas').style.display = 'none';

    let elegido = ''
    if (inputZuko.checked) elegido = 'Zuko'
    else if (inputKatara.checked) elegido = 'Katara'
    else if (inputAang.checked) elegido = 'Aang'
    else if (inputToph.checked) elegido = 'Toph'

    if (!elegido) {
        const mensajeError = document.createElement("p")
        mensajeError.textContent = 'Selecciona un personaje'
        mensajeError.style.color = "red"
        sectionSeleccionarPersonaje.appendChild(mensajeError)
        setTimeout(() => {
            if (sectionSeleccionarPersonaje.contains(mensajeError)) {
                sectionSeleccionarPersonaje.removeChild(mensajeError)
            }
        }, 2000)
        reiniciarJuego()
        return
    }

    spanPersonajeJugador.textContent = elegido
    // Tema visual superior según personaje (detalle lindo)
    if (elegido === 'Zuko') document.body.style.boxShadow = "inset 0 6px 0 var(--fire)"
    else if (elegido === 'Katara') document.body.style.boxShadow = "inset 0 6px 0 var(--water)"
    else if (elegido === 'Aang') document.body.style.boxShadow = "inset 0 6px 0 var(--air)"
    else if (elegido === 'Toph') document.body.style.boxShadow = "inset 0 6px 0 var(--earth)"

    seleccinarPersonajeEnemigo()
    renderVidas()
}

function seleccinarPersonajeEnemigo() {
    const personajeAleatorio = aleatorio(1, 4)
    const spanPersonajeEnemigo = document.getElementById('personaje-enemigo')

    if (personajeAleatorio == 1) {
        spanPersonajeEnemigo.innerHTML = 'Zuko'
    } else if (personajeAleatorio == 2) {
        spanPersonajeEnemigo.innerHTML = 'Katara'
    } else if (personajeAleatorio == 3) {
        spanPersonajeEnemigo.innerHTML = 'Aang'
    } else {
        spanPersonajeEnemigo.innerHTML = 'Toph'
    }
}

function ataquePunio() {
    ataqueJugador = 'Punio'
    ataqueAleatorioEnemigo()
}
function ataquePatada() {
    ataqueJugador = 'Patada'
    ataqueAleatorioEnemigo()
}
function ataqueBarrida() {
    ataqueJugador = 'Barrida'
    ataqueAleatorioEnemigo()
}

function ataqueAleatorioEnemigo() {
    const ataqueAleatorio = aleatorio(1, 3)
    if (ataqueAleatorio == 1) {
        ataqueEnemigo = 'Punio'
    } else if (ataqueAleatorio == 2) {
        ataqueEnemigo = 'Patada'
    } else {
        ataqueEnemigo = 'Barrida'
    }
    combate()
}

function combate() {
    if (ataqueEnemigo == ataqueJugador) {
        crearMensaje("EMPATE")
    } else if (ataqueJugador == 'Punio' && ataqueEnemigo == 'Barrida') {
        crearMensaje("GANASTE")
        vidasEnemigo--
    } else if (ataqueJugador == 'Patada' && ataqueEnemigo == 'Punio') {
        crearMensaje("GANASTE")
        vidasEnemigo--
    } else if (ataqueJugador == 'Barrida' && ataqueEnemigo == 'Patada') {
        crearMensaje("GANASTE")
        vidasEnemigo--
    } else {
        crearMensaje("PERDISTE")
        vidasJugador--
    }

    renderVidas()
    revisarVidas()
}

function revisarVidas() {
    if (vidasEnemigo == 0) {
        crearMensajeFinal("FELICITACIONES!!! HAS GANADO 🤩🥳🎉")
    } else if (vidasJugador == 0) {
        crearMensajeFinal("QUE PENA, HAS PERDIDO 😢😭😭😭")
    }
}

function crearMensajeFinal(resultado) {
    const sectionReiniciar = document.getElementById('reiniciar')
    sectionReiniciar.style.display = "block"

    const sectionMensaje = document.getElementById('mensajes')
    const parrafo = document.createElement('p')

    parrafo.classList.add('final')
    parrafo.innerHTML = resultado
    sectionMensaje.appendChild(parrafo)

    document.getElementById('boton-punio').disabled = true
    document.getElementById('boton-patada').disabled = true
    document.getElementById('boton-barrida').disabled = true
}

function crearMensaje(resultado) {
    const sectionMensaje = document.getElementById('mensajes')
    const parrafo = document.createElement('p')
    parrafo.innerHTML = 'Tu personaje atacó con ' + ataqueJugador + ', el personaje del enemigo atacó con ' + ataqueEnemigo + ' — ' + resultado
    sectionMensaje.appendChild(parrafo)
}

function reiniciarJuego() {
    location.reload()
}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

window.addEventListener('load', iniciarJuego)
