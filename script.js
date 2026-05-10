// Conversion rates to grams (base unit)
const conversionRates = {
    'kg': 1000,
    'hg': 100,
    'dag': 10,
    'g': 1,
    'dg': 0.1,
    'cg': 0.01,
    'mg': 0.001
};

// Main conversion function
function convertir() {
    const valor = document.getElementById('valor-origen').value.trim();
    const unidadOrigen = document.getElementById('unidad-origen').value;
    const unidadDestino = document.getElementById('unidad-destino').value;
    const resultadoDiv = document.getElementById('resultado');

    // Validation
    if (!valor || valor === '') {
        mostrarError(resultadoDiv, '⚠️ Por favor, ingresa un valor');
        return;
    }

    const numero = parseFloat(valor);
    
    if (isNaN(numero)) {
        mostrarError(resultadoDiv, '❌ El valor debe ser un número válido');
        return;
    }

    if (numero < 0) {
        mostrarError(resultadoDiv, '❌ No se permiten valores negativos');
        return;
    }

    // Perform conversion
    try {
        // Convert to grams first
        const gramos = numero * conversionRates[unidadOrigen];
        
        // Convert to destination unit
        const resultado = gramos / conversionRates[unidadDestino];
        
        // Format and display result
        mostrarResultado(resultadoDiv, numero, unidadOrigen, resultado, unidadDestino);
    } catch (error) {
        mostrarError(resultadoDiv, '❌ Error en la conversión. Intenta de nuevo.');
        console.error('Error:', error);
    }
}

// Display successful result
function mostrarResultado(div, valorOrigen, unidadOrigen, valorDestino, unidadDestino) {
    const valorFormateado = formatearNumero(valorDestino);
    const unidadOrigenTexto = getUnidadTexto(unidadOrigen);
    const unidadDestinoTexto = getUnidadTexto(unidadDestino);
    
    div.innerHTML = `
        <strong>✅ ${valorOrigen} ${unidadOrigenTexto}</strong> 
        = 
        <strong>${valorFormateado} ${unidadDestinoTexto}</strong>
    `;
    div.classList.remove('error');
    div.classList.add('success');
}

// Display error message
function mostrarError(div, mensaje) {
    div.innerHTML = mensaje;
    div.classList.remove('success');
    div.classList.add('error');
}

// Get full unit text
function getUnidadTexto(unidad) {
    const unidades = {
        'kg': 'Kilogramos (kg)',
        'hg': 'Hectogramos (hg)',
        'dag': 'Decagramos (dag)',
        'g': 'Gramos (g)',
        'dg': 'Decigramos (dg)',
        'cg': 'Centigramos (cg)',
        'mg': 'Miligramos (mg)'
    };
    return unidades[unidad] || unidad;
}

// Format number with locale separators
function formatearNumero(numero) {
    // Limit to 6 decimal places
    const redondeado = parseFloat(numero.toFixed(6));
    
    // Use locale-specific formatting
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 6
    }).format(redondeado);
}

// Quick conversion function
function conversionRapida(unidadOrigen, unidadDestino) {
    // Set dropdown values
    document.getElementById('unidad-origen').value = unidadOrigen;
    document.getElementById('unidad-destino').value = unidadDestino;
    
    // Set input value if empty, or use predefined value
    let valorInput = document.getElementById('valor-origen');
    if (!valorInput.value) {
        valorInput.value = '1';
    }
    
    // Focus on input
    valorInput.focus();
    
    // Perform conversion
    convertir();
}

// Support Enter key to convert
document.addEventListener('DOMContentLoaded', function() {
    const inputValor = document.getElementById('valor-origen');
    
    if (inputValor) {
        inputValor.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                convertir();
            }
        });
    }
    
    // Set default result message
    const resultadoDiv = document.getElementById('resultado');
    if (resultadoDiv && !resultadoDiv.innerHTML) {
        resultadoDiv.innerHTML = '📊 Ingresa un valor y haz clic en Convertir';
        resultadoDiv.style.color = '#999';
    }
});

// Clear result on input change
document.addEventListener('DOMContentLoaded', function() {
    const inputValor = document.getElementById('valor-origen');
    const resultadoDiv = document.getElementById('resultado');
    
    if (inputValor) {
        inputValor.addEventListener('input', function() {
            if (resultadoDiv && resultadoDiv.classList.contains('error')) {
                resultadoDiv.classList.remove('error');
                resultadoDiv.innerHTML = '📊 Ingresa un valor y haz clic en Convertir';
                resultadoDiv.style.color = '#999';
            }
        });
    }
});

// Prevent negative input
document.addEventListener('DOMContentLoaded', function() {
    const inputValor = document.getElementById('valor-origen');
    
    if (inputValor) {
        inputValor.addEventListener('blur', function() {
            if (this.value && parseFloat(this.value) < 0) {
                this.value = '';
                mostrarError(
                    document.getElementById('resultado'),
                    '❌ Los valores negativos no son permitidos'
                );
            }
        });
    }
});

// Conversion history (optional future feature)
const conversionHistory = [];

function agregarAlHistorial(valorOrigen, unidadOrigen, valorDestino, unidadDestino) {
    conversionHistory.push({
        fecha: new Date(),
        origen: {valor: valorOrigen, unidad: unidadOrigen},
        destino: {valor: valorDestino, unidad: unidadDestino}
    });
}

function obtenerHistorial() {
    return conversionHistory;
}

// Validation for special cases
function validarEntrada(valor) {
    // Check if value is a valid number
    if (isNaN(parseFloat(valor))) {
        return {valido: false, mensaje: 'El valor debe ser un número'};
    }
    
    // Check if value is negative
    if (parseFloat(valor) < 0) {
        return {valido: false, mensaje: 'No se permiten valores negativos'};
    }
    
    // Check if value is too large (prevent overflow)
    if (parseFloat(valor) > 1e15) {
        return {valido: false, mensaje: 'El valor es demasiado grande'};
    }
    
    return {valido: true};
}
