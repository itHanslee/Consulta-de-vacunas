document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos iniciales
    cargarPersonas();
    cargarNinos();
    cargarVacunas();
    
    // Configurar eventos de selección
    configurarSeleccionMultiple();
    
    // Configurar botones de enviar correo
    document.getElementById('boton-enviar-correo-personas').addEventListener('click', mostrarModalCorreo);
    document.getElementById('boton-enviar-correo-ninos').addEventListener('click', mostrarModalCorreo);
    
    // Configurar botón de enviar en el modal
    document.getElementById('boton-enviar-correo').addEventListener('click', enviarCorreo);
});

// Función para configurar la selección múltiple
function configurarSeleccionMultiple() {
    // Para la tabla de personas
    const checkTodosPersonas = document.getElementById('seleccionar-todos-personas');
    const checksPersonas = document.querySelectorAll('#tabla-personas input[type="checkbox"]');
    const botonCorreoPersonas = document.getElementById('boton-enviar-correo-personas');
    
    checkTodosPersonas.addEventListener('change', function() {
        checksPersonas.forEach(check => {
            check.checked = this.checked;
        });
        actualizarEstadoBotonCorreo(botonCorreoPersonas, checksPersonas);
    });
    
    checksPersonas.forEach(check => {
        check.addEventListener('change', function() {
            actualizarEstadoBotonCorreo(botonCorreoPersonas, checksPersonas);
            checkTodosPersonas.checked = [...checksPersonas].every(c => c.checked);
        });
    });
    
    // Para la tabla de niños (similar al de personas)
    const checkTodosNinos = document.getElementById('seleccionar-todos-ninos');
    const checksNinos = document.querySelectorAll('#tabla-ninos input[type="checkbox"]');
    const botonCorreoNinos = document.getElementById('boton-enviar-correo-ninos');
    
    checkTodosNinos.addEventListener('change', function() {
        checksNinos.forEach(check => {
            check.checked = this.checked;
        });
        actualizarEstadoBotonCorreo(botonCorreoNinos, checksNinos);
    });
    
    checksNinos.forEach(check => {
        check.addEventListener('change', function() {
            actualizarEstadoBotonCorreo(botonCorreoNinos, checksNinos);
            checkTodosNinos.checked = [...checksNinos].every(c => c.checked);
        });
    });
}

function actualizarEstadoBotonCorreo(boton, checks) {
    const algunoSeleccionado = [...checks].some(check => check.checked);
    boton.disabled = !algunoSeleccionado;
}

// Función para mostrar el modal de correo
function mostrarModalCorreo() {
    const modal = new bootstrap.Modal(document.getElementById('modal-correo'));
    const esPersonas = this.id === 'boton-enviar-correo-personas';
    
    // Obtener correos seleccionados
    const checks = esPersonas 
        ? document.querySelectorAll('#tabla-personas input[type="checkbox"]:checked') 
        : document.querySelectorAll('#tabla-ninos input[type="checkbox"]:checked');
    
    const filas = Array.from(checks).map(check => check.closest('tr'));
    const correos = filas.map(fila => {
        const celdas = fila.querySelectorAll('td');
        return esPersonas ? celdas[7].textContent : celdas[20].textContent; // Índice del email en la tabla
    }).filter(email => email.trim() !== '');
    
    if (correos.length === 0) {
        Swal.fire('Advertencia', 'No hay correos electrónicos válidos seleccionados', 'warning');
        return;
    }
    
    document.getElementById('destinatario-correo').value = correos.join(', ');
    modal.show();
}

// Función para enviar correo (simulada)
async function enviarCorreo() {
    const destinatario = document.getElementById('destinatario-correo').value;
    const asunto = document.getElementById('asunto-correo').value;
    const mensaje = document.getElementById('mensaje-correo').value;
    
    // Verificar token
    const token = localStorage.getItem('authToken');
    if (!token) {
        Swal.fire('Error', 'No hay sesión activa. Por favor inicie sesión.', 'error');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/enviar-correo/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                destinatarios: destinatario.split(',').map(e => e.trim()),
                asunto: asunto,
                mensaje: mensaje
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            Swal.fire('Éxito', result.message || 'El correo ha sido enviado correctamente', 'success');
            bootstrap.Modal.getInstance(document.getElementById('modal-correo')).hide();
            document.getElementById('formulario-correo').reset();
        } else {
            throw new Error(result.detail || 'Error al enviar el correo');
        }
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
}

// Función para cargar personas en la tabla
async function cargarPersonas() {
    try {
        const response = await fetch('http://127.0.0.1:8000/personas/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            const personas = await response.json();
            const tbody = document.getElementById('tabla-personas');
            tbody.innerHTML = '';
            
            personas.forEach(persona => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><input type="checkbox" class="form-check-input"></td>
                    <td>${persona.nombres || ''}</td>
                    <td>${persona.apellidos || ''}</td>
                    <td>${persona.tipo_documento || ''}</td>
                    <td>${persona.dni || ''}</td>
                    <td>${persona.genero || ''}</td>
                    <td>${persona.telefono || ''}</td>
                    <td>${persona.email || ''}</td>
                    <td>${persona.direccion || ''}</td>
                    <td>${persona.fecha_nacimiento ? new Date(persona.fecha_nacimiento).toLocaleDateString() : ''}</td>
                    <td>${persona.vacuna || ''}</td>
                    <td>${persona.dosis || ''}</td>
                    <td>${persona.fecha_aplicacion ? new Date(persona.fecha_aplicacion).toLocaleDateString() : ''}</td>
                    <td>${persona.fabricante_vacuna || ''}</td>
                    <td>${persona.lote_vacuna || ''}</td>
                    <td>${persona.prestador_salud || ''}</td>
                    <td><span class="badge bg-success badge-estado">${persona.estado || 'Activo'}</span></td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            throw new Error('Error al cargar personas');
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'No se pudieron cargar las personas', 'error');
    }
}

// Función para cargar niños en la tabla
async function cargarNinos() {
    try {
        const response = await fetch('http://127.0.0.1:8000/ninos/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            const ninos = await response.json();
            const tbody = document.getElementById('tabla-ninos');
            tbody.innerHTML = '';
            
            ninos.forEach(nino => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><input type="checkbox" class="form-check-input"></td>
                    <td>${nino.nombres || ''}</td>
                    <td>${nino.apellidos || ''}</td>
                    <td>${nino.tipo_documento || ''}</td>
                    <td>${nino.dni || ''}</td>
                    <td>${nino.genero || ''}</td>
                    <td>${nino.edad || ''}</td>
                    <td>${nino.nombre_madre || ''}</td>
                    <td>${nino.nombre_padre || ''}</td>
                    <td>${nino.nombre_cuidador || ''}</td>
                    <td>${nino.lactancia_materna ? 'Sí' : 'No'}</td>
                    <td>${nino.observaciones || ''}</td>
                    <td>${nino.vacuna || ''}</td>
                    <td>${nino.dosis || ''}</td>
                    <td>${nino.fecha_aplicacion ? new Date(nino.fecha_aplicacion).toLocaleDateString() : ''}</td>
                    <td>${nino.lote || ''}</td>
                    <td>${nino.prestador || ''}</td>
                    <td>${nino.fecha_proxima_cita ? new Date(nino.fecha_proxima_cita).toLocaleDateString() : ''}</td>
                    <td>${nino.vacunador || ''}</td>
                    <td>${nino.telefono || ''}</td>
                    <td>${nino.email || ''}</td>
                    <td><span class="badge bg-success badge-estado">${nino.estado || 'Activo'}</span></td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            throw new Error('Error al cargar niños');
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'No se pudieron cargar los niños', 'error');
    }
}

// Función para cargar vacunas en la tabla
async function cargarVacunas() {
    try {
        const response = await fetch('http://127.0.0.1:8000/vacunas/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            const vacunas = await response.json();
            const tbody = document.getElementById('tabla-vacunas');
            tbody.innerHTML = '';
            
            vacunas.forEach(vacuna => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${vacuna.codigo || ''}</td>
                    <td>${vacuna.nombre || ''}</td>
                    <td>${vacuna.nombre_alternativo || ''}</td>
                    <td>${vacuna.fabricante || ''}</td>
                    <td>${vacuna.tipo || ''}</td>
                    <td>${vacuna.descripcion || ''}</td>
                    <td>${vacuna.indicaciones || ''}</td>
                    <td>${vacuna.dosis_totales || ''}</td>
                    <td>${vacuna.intervalo_minimo_dias || ''}</td>
                    <td>${vacuna.edad_minima_meses || ''}</td>
                    <td>${vacuna.edad_maxima_meses || ''}</td>
                    <td>${vacuna.via_administracion || ''}</td>
                    <td>${vacuna.contraindicaciones || ''}</td>
                    <td>${vacuna.temperatura_almacenamiento || ''}</td>
                    <td>${vacuna.lote_actual || ''}</td>
                    <td>${vacuna.fecha_registro ? new Date(vacuna.fecha_registro).toLocaleDateString() : ''}</td>
                    <td>${vacuna.registrado_por || ''}</td>
                    <td><span class="badge bg-success badge-estado">${vacuna.estado || 'Activo'}</span></td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            throw new Error('Error al cargar vacunas');
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'No se pudieron cargar las vacunas', 'error');
    }
}

// Funciones para eliminar registros (similar a las originales pero actualizadas)
async function eliminarPersona(id) {
    // Implementación similar a la original
}

async function eliminarVacuna(id) {
    // Implementación similar a la original
}

async function eliminarNino(id) {
    // Implementación similar a la original
}