// Rutas de imágenes locales
const imagenes = {
    piedra: ["./img/PiedraP1.png", "./img/piedraCpu.png"],
    papel: ["./img/papelP1.png", "./img/papelCpu.png"],
    tijeras: ["./img/tijeraP1.png", "./img/tijeraCpu.png"],
    puño: ["./img/PiedraP1.png", "./img/piedraCpu.png"]
};

// Marcadores (se cargan desde localStorage si existen)
let victorias = parseInt(localStorage.getItem("victorias")) || 0;
let empates   = parseInt(localStorage.getItem("empates")) || 0;
let derrotas  = parseInt(localStorage.getItem("derrotas")) || 0;

// Mostrar marcadores al iniciar
document.getElementById("victorias").textContent = victorias;
document.getElementById("empates").textContent = empates;
document.getElementById("derrotas").textContent = derrotas;

function jugar(eleccionJugador) {
    const opciones = ["piedra", "papel", "tijeras"];
    const eleccionCPU = opciones[Math.floor(Math.random() * 3)];

    const manoJugador = document.getElementById("mano-jugador");
    const manoCPU = document.getElementById("mano-cpu");
    const resultadoTexto = document.getElementById("resultado");

    // Reset estilos
    manoJugador.classList.remove("ganador", "perdedor");
    manoCPU.classList.remove("ganador", "perdedor");

    // Mostrar manos cerradas y empezar animación
    manoJugador.src = imagenes.puño[0];
    manoCPU.src = imagenes.puño[1];
    manoJugador.classList.add("shake");
    manoCPU.classList.add("shake");

    resultadoTexto.textContent = "¡1, 2, 3...!";
    resultadoTexto.classList.remove("show");

    // Después de 1.5 segundos, mostrar las elecciones
    setTimeout(() => {
        manoJugador.classList.remove("shake");
        manoCPU.classList.remove("shake");

        manoJugador.src = imagenes[eleccionJugador][0];
        manoCPU.src = imagenes[eleccionCPU][1];

        const resultado = determinarGanador(eleccionJugador, eleccionCPU);

        if (resultado === "ganaste") {
            victorias++;
            resultadoTexto.textContent = "¡Ganaste! 🎉";
            manoJugador.classList.add("ganador");
            manoCPU.classList.add("perdedor");
            reproducirSonido("win");
        } else if (resultado === "empate") {
            empates++;
            resultadoTexto.textContent = "Empate 😐";
            reproducirSonido("draw");
        } else {
            derrotas++;
            resultadoTexto.textContent = "Perdiste 😢";
            manoJugador.classList.add("perdedor");
            manoCPU.classList.add("ganador");
            reproducirSonido("lose");
        }

        // Guardar en localStorage
        localStorage.setItem("victorias", victorias);
        localStorage.setItem("empates", empates);
        localStorage.setItem("derrotas", derrotas);

        // Actualizar marcadores en pantalla
        document.getElementById("victorias").textContent = victorias;
        document.getElementById("empates").textContent = empates;
        document.getElementById("derrotas").textContent = derrotas;

        // Mostrar animación resultado
        setTimeout(() => resultadoTexto.classList.add("show"), 50);

        // Agregar al historial
        agregarHistorial(eleccionJugador, eleccionCPU, resultado);

    }, 1500);
}

// Lógica del juego
function determinarGanador(jugador, cpu) {
    if (jugador === cpu) return "empate";
    if (
        (jugador === "piedra" && cpu === "tijeras") ||
        (jugador === "papel" && cpu === "piedra") ||
        (jugador === "tijeras" && cpu === "papel")
    ) {
        return "ganaste";
    }
    return "perdiste";
}

// Historial
const historial = document.getElementById("historial");
function agregarHistorial(jugador, cpu, resultado) {
    const item = document.createElement("p");
    item.textContent = `👨 ${jugador} vs 🤖 ${cpu} → ${resultado}`;
    historial.prepend(item);
}

// Reiniciar marcador
document.getElementById("reset").addEventListener("click", () => {
    victorias = empates = derrotas = 0;
    localStorage.clear();
    document.getElementById("victorias").textContent = victorias;
    document.getElementById("empates").textContent = empates;
    document.getElementById("derrotas").textContent = derrotas;
    document.getElementById("resultado").textContent = "Marcadores reiniciados 🙌";
    historial.innerHTML = "";
});

// Cambiar tema
document.getElementById("toggle-theme").addEventListener("click", () => {
    document.body.classList.toggle("light");
});

// Sonidos (URL genérica)
function reproducirSonido(tipo) {
    let url = "";
    if (tipo === "win") url = "https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3";
    if (tipo === "lose") url = "https://assets.mixkit.co/sfx/preview/mixkit-losing-marimba-2022.mp3";
    if (tipo === "draw") url = "https://assets.mixkit.co/sfx/preview/mixkit-arcade-retro-game-over-213.wav";

    if (url) {
        const audio = new Audio(url);
        audio.play();
    }
}