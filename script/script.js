function calcularYGuardar() {
    // Obtener los datos del formulario
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const categoria = document.getElementById('categoria').value;
    const basico = parseFloat(document.getElementById('basico').value);
    const fecha = document.getElementById('fecha').value;
    const horaInicio = parseInt(document.getElementById('hora-inicio').value);
    const horaFin = parseInt(document.getElementById('hora-fin').value);
    const fechaIngresada = new Date(fecha);
    // Calcular el "Valor Hora" dividiendo el "Sueldo Básico" entre 240
    const valorHora = basico / 240;


    const horasEnRangos=calcularHorasEnRangos(horaInicio,horaFin);

    let horasNormales=0;
    let extrasCincuenta=0;
    let extrasCien=0;
    let nocturnas=0;

    const esFinDeSemana = fechaIngresada.getDay() === 5 || fechaIngresada.getDay() === 6;
    const esFeriado=esFeriado(fecha);
    // Calcular las horas normales, extras al 50%, extras al 100% y nocturnas
    if (esFinDeSemana || esFeriado) {
        extrasCien = horaFin-horaInicio;    
    }else{
        horasNormales = horasEnRangos['13-22'];
        extrasCincuenta = horasEnRangos['6-13'];
    }
 
    nocturnas = horasEnRangos['0-6']+horasEnRangos['22-24'];

    // Calcular el sueldo total
    const sueldoTotal = valorHora * (horasNormales * 1 + extrasCincuenta * 1.5 + extrasCien * 2 + nocturnas * (17 / 15));

    // Mostrar el "Valor Hora" en el campo correspondiente
    document.getElementById('valor-hora').value = valorHora.toFixed(2);

    // Mostrar el resultado en la página
    const resultado = `Nombre: ${nombre} ${apellido}, Categoría: ${categoria},Horas Normales:${horasNormales}, Extras al 50%:${extrasCincuenta}, 
    Extras al 100%:${extrasCien}, Nocturnas:${nocturnas} Sueldo Total: ${sueldoTotal.toFixed(2)}, Fecha: ${fecha}`;
    document.getElementById('resultado').innerText = resultado;

    // Opcional: Guardar los datos en un archivo y proporcionar un enlace para descargarlo
    const blob = new Blob([resultado], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'datos.txt';
    a.textContent = 'Descargar Datos';
    document.getElementById('resultado').appendChild(a);
}

function esFeriado(fecha) {
    const feriados = [
        new Date(2023, 0, 1),  // Año Nuevo
        new Date(2023, 2, 24), // Carnaval
        new Date(2023, 2, 25), // Carnaval
        new Date(2023, 3, 2),  // Día del Veterano y de los Caídos en la Guerra de Malvinas
        new Date(2023, 3, 24), // Viernes Santo
        new Date(2023, 4, 2),  // Día del Trabajador
        new Date(2023, 5, 25), // Día de la Revolución de Mayo
        new Date(2023, 6, 9),  // Día de la Independencia
        new Date(2023, 7, 21), // Día del Paso a la Inmortalidad del Gral. José de San Martín
        new Date(2023, 9, 16), // Día del Respeto a la Diversidad Cultural
        new Date(2023, 12, 25),// Navidad
    ];

    for (const feriado of feriados) {
        if (fecha.getFullYear() === feriado.getFullYear() &&
            fecha.getMonth() === feriado.getMonth() &&
            fecha.getDate() === feriado.getDate()) {
            return true; // La fecha actual coincide con un feriado.
        }
    }

    return false; // La fecha actual no es un feriado.
}

function calcularHorasEnRangos(horaInicio, horaFin) {
    const rangos = {
        '0-6': 0,
        '6-13': 0,
        '13-22': 0,
        '22-24': 0,
    };

    for (let hora = horaInicio; hora < horaFin; hora++) {
        if (hora >= 0 && hora < 6) {
            rangos['0-6'] += 1;
        } else if (hora >= 6 && hora < 13) {
            rangos['6-13'] += 1;
        } else if (hora >= 13 && hora < 22) {
            rangos['13-22'] += 1;
        } else if (hora >= 22 && hora < 24) {
            rangos['22-24'] += 1;
        }
    }

    return rangos;
}

function calcularValorHora() {
    const basico = parseFloat(document.getElementById('basico').value);
    const valorHora = basico / 240;
    document.getElementById('valor-hora').value = valorHora.toFixed(2);
}

