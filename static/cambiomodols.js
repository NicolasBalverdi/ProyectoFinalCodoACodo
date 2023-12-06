// JavaScript para cambiar entre modo claro y oscuro

// Verifica la preferencia del usuario en localStorage
const modoActual = localStorage.getItem('modo');

// Aplica el modo guardado o predeterminado
if (modoActual === 'oscuro') {
    aplicarModoOscuro();
} else {
    aplicarModoClaro();
}

// Función para cambiar a modo claro
function aplicarModoClaro() {
    document.getElementById('modo-estilo').setAttribute('href', '/static/estiloslsClaros.css');
    localStorage.setItem('modo', 'claro');
}

// Función para cambiar a modo oscuro
function aplicarModoOscuro() {
    document.getElementById('modo-estilo').setAttribute('href', '/static/estiloslsOscuros.css');
    localStorage.setItem('modo', 'oscuro');
}

// Función para cambiar entre modos al hacer clic en un botón (puedes ajustar según tu necesidad)
function cambiarModo() {
    const modoActual = localStorage.getItem('modo');
    if (modoActual === 'oscuro') {
        aplicarModoClaro();
    } else {
        aplicarModoOscuro();
    }
}

// Puedes agregar un evento de clic a un botón u otro elemento para cambiar entre modos
document.getElementById('boton-cambiar-modo').addEventListener('click', cambiarModo);

  // Llamar a la función para cargar la preferencia al cargar la página
  window.onload = loadDarkModePreference;
  