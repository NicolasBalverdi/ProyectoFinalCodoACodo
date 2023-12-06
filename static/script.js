const empleados = [];

function agregarNuevoEmpleado() {
    // Limpia el formulario para ingresar datos de un nuevo empleado
    document.getElementById('nombre').value = '';
    document.getElementById('apellido').value = '';
    document.getElementById('categoria').value = '';
    document.getElementById('basico').value = '';
    document.getElementById('fecha').value = '';
    document.getElementById('hora-inicio').value = '';
    document.getElementById('hora-fin').value = '';
}
function calcularYGuardar() {
    // Obtener los datos del formulario
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const categoria = document.getElementById('categoria').value;
    const basico = parseFloat(document.getElementById('basico').value);
    const fecha = document.getElementById('fecha').value;
    const horaInicioHoras = parseInt(document.getElementById('hora-inicio-horas').value);
    let horaInicioMinutos = parseInt(document.getElementById('hora-inicio-minutos').value);
    const horaFinHoras = parseInt(document.getElementById('hora-fin-horas').value);
    let horaFinMinutos = parseInt(document.getElementById('hora-fin-minutos').value);    
    horaInicioMinutos = horaInicioMinutos ? parseInt(horaInicioMinutos) : 0;
    horaFinMinutos = horaFinMinutos ? parseInt(horaFinMinutos) : 0;
    const fechaIngresada = new Date(fecha);
    // Calcular el "Valor Hora" dividiendo el "Sueldo Básico" entre 240
    const valorHora = basico / 240;
    const valorMinuto = valorHora/60;


    const horasEnRangos=calcularHorasEnRangos(horaInicioHoras,horaFinHoras,horaFinMinutos);

    let horasNormales=0;
    let extrasCincuenta=0;
    let extrasCien=0;
    let nocturnas=0;

    const esDomingo = fechaIngresada.getDay() === 6;
    const esSabado = fechaIngresada.getDay() === 5;
    const esDiaFeriado=esFeriado(fechaIngresada);
    // Calcular las horas normales, extras al 50%, extras al 100% y nocturnas
    if (esDomingo || esDiaFeriado) {
        extrasCien = horaFinHoras-horaInicioHoras;    
        if (horaInicioMinutos!=0||horaFinMinutos!=0) {
            extrasCien=extrasCien*60+horaFinMinutos+horaInicioMinutos;
        }
            
    }else if (esSabado) {
        extrasCien=horasEnRangos['13-22']+horasEnRangos['22-24'];
        extrasCincuenta = horasEnRangos['6-13']+horasEnRangos['0-6'];
        if (horaInicioMinutos!=0||horaFinMinutos!=0) {
            extrasCien=extrasCien*60;
            extrasCincuenta=extrasCincuenta*60;
            if (horaInicioHoras>13) {
                extrasCien=extrasCien+horaFinMinutos+horaInicioMinutos;
            } else if(horaFinHoras==13){
                extrasCincuenta+=horaInicioMinutos;
                extrasCien=extrasCien+horaFinMinutos;
            }else if(horaFinHoras<13){
                extrasCincuenta=extrasCincuenta+horaFinMinutos+horaInicioMinutos;
            }else{
                extrasCincuenta+=horaInicioMinutos;
                extrasCien=extrasCien+horaFinMinutos;
            }
        }
    }else{
      
        extrasCincuenta = horaFinHoras-horaInicioHoras;
        if (horaInicioMinutos!=0||horaFinMinutos!=0) {
            
            extrasCincuenta=extrasCincuenta*60+horaFinMinutos+horaInicioMinutos;
        }
    }
 
    nocturnas = horasEnRangos['0-6']+horasEnRangos['22-24'];
    if ((horaInicioMinutos!=0||horaFinMinutos!=0)&&nocturnas!=0) {
        nocturnas=nocturnas*60+horaFinMinutos+horaInicioMinutos;
    }

    // Calcular el sueldo total
    let sueldoTotal = 0;
    if (horaInicioMinutos!=0||horaFinMinutos!=0) {
        sueldoTotal= valorMinuto*(horasNormales * 1 + extrasCincuenta * 1.5 + extrasCien * 2 + nocturnas * (17 / 15));
        horasNormales=horasNormales/60;
        extrasCincuenta=extrasCincuenta/60;
        extrasCien=extrasCien/60;
        nocturnas=nocturnas/60;
    }else{
        sueldoTotal = valorHora * (horasNormales * 1 + extrasCincuenta * 1.5 + extrasCien * 2 + nocturnas * (17 / 15));
    }
    empleados.push({
        nombre: nombre,
        apellido: apellido,
        categoria: categoria,
        fecha: fecha,
        horasTrabajadas: `${horaInicioHoras}:${horaInicioMinutos} - ${horaFinHoras}:${horaFinMinutos}`,
        horasNormales: horasNormales,
        extrasCincuenta: extrasCincuenta,
        extrasCien: extrasCien,
        horasNocturnas: nocturnas,
        sueldoPagar: sueldoTotal.toFixed(2)
    });

    mostrarResultados();


}

function mostrarResultados() {
    const tabla = document.getElementById('tabla-resultados');
    const tbody = tabla.querySelector('tbody');
    // Limpiar la tabla antes de mostrar resultados para evitar duplicaciones
    tbody.innerHTML = '';

    for (const empleado of empleados) {
        const fila = document.createElement('tr');
        // Crear las celdas y asignar datos del empleado a cada celda
        // Ejemplo de cómo asignar datos:
        const celdaNombre = document.createElement('td');
        celdaNombre.textContent = empleado.nombre;
        fila.appendChild(celdaNombre);
        
        const celdaApellido = document.createElement('td');
        celdaApellido.textContent = empleado.apellido;
        fila.appendChild(celdaApellido);

        const celdaCategoria = document.createElement('td');
        celdaCategoria.textContent = empleado.categoria;
        fila.appendChild(celdaCategoria);

        const celdaFecha = document.createElement('td');
        celdaFecha.textContent = empleado.fecha;
        fila.appendChild(celdaFecha);

        const celdaHorasTrabajadas = document.createElement('td');
        celdaHorasTrabajadas.textContent = empleado.horasTrabajadas;
        fila.appendChild(celdaHorasTrabajadas);

        const celdaHorasNormales = document.createElement('td');
        celdaHorasNormales.textContent = empleado.horasNormales;
        fila.appendChild(celdaHorasNormales);

        const celdaExtrasCincuenta = document.createElement('td');
        celdaExtrasCincuenta.textContent = empleado.extrasCincuenta;
        fila.appendChild(celdaExtrasCincuenta);

        const celdaExtrasCien = document.createElement('td');
        celdaExtrasCien.textContent = empleado.extrasCien;
        fila.appendChild(celdaExtrasCien);

        const celdaHorasNocturnas = document.createElement('td');
        celdaHorasNocturnas.textContent = empleado.horasNocturnas;
        fila.appendChild(celdaHorasNocturnas);

        const celdaSueldoPagar = document.createElement('td');
        celdaSueldoPagar.textContent = empleado.sueldoPagar;
        fila.appendChild(celdaSueldoPagar);
        // Agregar más celdas para otros campos, similar a celdaNombre

        tbody.appendChild(fila);
    }
}

function esFeriado(fecha) {
    const feriados = [
        //Los (año, mes, dia) los meses estan al -1 los dias tambien(en otras palabras la fecha 1/1/2023 es (2023,00,0))
        new Date(2023, 0, 1),  // Año Nuevo
        new Date(2023, 2, 24), // Carnaval
        new Date(2023, 2, 25), // Carnaval
        new Date(2023, 3, 2),  // Día del Veterano y de los Caídos en la Guerra de Malvinas
        new Date(2023, 3, 24), // Viernes Santo
        new Date(2023, 4, 2),  // Día del Trabajador
        new Date(2023, 5, 25), // Día de la Revolución de Mayo
        new Date(2023, 6, 9),  // Día de la Independencia
        new Date(2023, 7, 21), // Día del Paso a la Inmortalidad del Gral. José de San Martín
        new Date(2023, 9, 15), // Día del Respeto a la Diversidad Cultural
        new Date(2023, 10, 19), //Soberania Nacional
        new Date(2023, 11, 25),// Navidad
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

function calcularHorasEnRangos(horaInicio, horaFin, minFin) {
    const rangos = {
        '0-6': 0,
        '6-13': 0,
        '13-22': 0,
        '22-24': 0,
    };
    if (minFin>0) {
        for (let hora = horaInicio; hora < horaFin+1; hora++) {
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
    } else {
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
    }
    
    return rangos;
}

function calcularValorHora() {
    const basico = parseFloat(document.getElementById('basico').value);
    const valorHora = basico / 240;
    document.getElementById('valor-hora').value = valorHora.toFixed(2);
}

// // Crear un elemento <script>
// const scriptElement = document.createElement('script');

// // Establecer el atributo src con la URL de la biblioteca "xlsx"
// scriptElement.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.0/dist/xlsx.full.min.js';

// // Definir una función que se ejecutará una vez que se cargue la biblioteca
// scriptElement.onload = function() {
//     // La biblioteca "xlsx" estará disponible aquí
//     console.log('La biblioteca "xlsx" se ha cargado correctamente.');
//     // Puedes usar xlsx aquí para exportar a Excel u otras tareas relacionadas con la biblioteca.
// };

// // Agregar el elemento <script> al documento (esto iniciará la descarga de la biblioteca)
// document.body.appendChild(scriptElement);

// document.getElementById('exportExcelButton').addEventListener('click', function () {
    
//     // Crear una hoja de cálculo en formato XLSX
//     const ws = XLSX.utils.json_to_sheet(empleados);

//     // Crear un libro de trabajo y adjuntar la hoja de cálculo
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Empleados");

//     // Generar un Blob (objeto binario grande) a partir del libro de trabajo
//     const blob = XLSX.write(wb, { bookType: "xlsx", type: "blob" });

//     // Crear un objeto URL para el Blob
//     const url = URL.createObjectURL(blob);

//     // Crear un enlace para descargar el archivo Excel
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "empleados.xlsx"; // Nombre del archivo
//     a.style.display = "none";

//     // Agregar el enlace al documento y hacer clic automáticamente
//     document.body.appendChild(a);
//     a.click();

//     // Limpiar el objeto URL y eliminar el enlace después de la descarga
//     window.URL.revokeObjectURL(url);
//     document.body.removeChild(a);

    
// });
function exportTableToExcel(tableID, filename = ''){
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    
    // Specify file name
    filename = filename?filename+'.xls':'excel_data.xls';
    
    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
}
