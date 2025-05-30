// modal.js - Versión corregida

// Verificar autenticación al inicio
function verificarAutenticacion() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        Swal.fire({
            icon: 'error',
            title: 'Sesión no válida',
            text: 'Debe iniciar sesión para acceder a esta página',
            allowOutsideClick: false,
            confirmButtonText: 'Ir a login'
        }).then(() => {
            window.location.href = 'login.html';
        });
        return false;
    }
    return true;
}

// Función para validar campos
function validateInput(input, fieldName) {
    if (!input || !input.value.trim()) {
        Swal.fire({
            icon: 'error',
            title: 'Campo requerido',
            text: `Por favor complete el campo: ${fieldName}`,
        });
        if (input) input.focus();
        return false;
    }
    return true;
}

// Función para validar fechas
function validateDate(input, fieldName) {
    if (!input || !input.value) {
        Swal.fire({
            icon: 'error',
            title: 'Fecha requerida',
            text: `Por favor ingrese una fecha válida para: ${fieldName}`,
        });
        if (input) input.focus();
        return false;
    }
    
    // Validar formato de fecha (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(input.value)) {
        Swal.fire({
            icon: 'error',
            title: 'Formato inválido',
            text: `El formato de fecha para ${fieldName} debe ser YYYY-MM-DD`,
        });
        input.focus();
        return false;
    }
    
    return true;
}

// Función para formatear datos antes de enviar
function formatFormData(data) {
    // Convertir campos vacíos a null
    for (const key in data) {
        if (data[key] === '') {
            data[key] = null;
        }
    }
    return data;
}

// Función para obtener token de autenticación
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Función para manejo de errores de autenticación
function handleAuthError(error) {
    if (error.message.includes('401') || error.message.includes('token')) {
        Swal.fire({
            icon: 'error',
            title: 'Sesión expirada',
            text: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
            allowOutsideClick: false,
            confirmButtonText: 'Ir a login'
        }).then(() => {
            localStorage.clear();
            window.location.href = 'login.html';
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
        });
    }
}

// Formulario de Personas
document.getElementById('btnGuardarPersona')?.addEventListener('click', function() {
    if (!verificarAutenticacion()) return;
    
    let inputNombres = document.querySelector('#formAgregarPersona input[name="nombres"]');
    let inputApellidos = document.querySelector('#formAgregarPersona input[name="apellidos"]');
    let selectTipoDoc = document.querySelector('#formAgregarPersona select[name="tipo_documento"]');
    let inputDni = document.querySelector('#formAgregarPersona input[name="dni"]');
    let inputFechaNac = document.querySelector('#formAgregarPersona input[name="fecha_nacimiento"]');
    let selectVacuna = document.querySelector('#formAgregarPersona select[name="id_vacuna"]');
    let selectDosis = document.querySelector('#formAgregarPersona select[name="dosis"]');
    let inputFechaAplicacion = document.querySelector('#formAgregarPersona input[name="fecha_aplicacion"]');
    let inputFabricante = document.querySelector('#formAgregarPersona input[name="fabricante_vacuna"]');
    let inputLote = document.querySelector('#formAgregarPersona input[name="lote_vacuna"]');
    
    if (
        validateInput(inputNombres, "Nombres") &&
        validateInput(inputApellidos, "Apellidos") &&
        validateInput(selectTipoDoc, "Tipo de documento") &&
        validateInput(inputDni, "Número de documento") &&
        validateDate(inputFechaNac, "Fecha de nacimiento") &&
        validateInput(selectVacuna, "Vacuna") &&
        validateInput(selectDosis, "Dosis") &&
        validateDate(inputFechaAplicacion, "Fecha de aplicación") &&
        validateInput(inputFabricante, "Fabricante de la vacuna") &&
        validateInput(inputLote, "Número de lote")
    ) {
        const formData = new FormData(document.getElementById('formAgregarPersona'));
        const data = Object.fromEntries(formData.entries());
        
        // Formatear datos antes de enviar
        const formattedData = formatFormData(data);
        
        guardarPersona(formattedData);
    }
});

// Función para guardar persona
async function guardarPersona(data) {
    if (!verificarAutenticacion()) return;
    
    try {
        const response = await fetch('http://127.0.0.1:8000/personas/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Error al registrar persona');
        }
        
        const result = await response.json();
        
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Persona registrada correctamente',
        });
        
        bootstrap.Modal.getInstance(document.getElementById('registroModal')).hide();
        cargarPersonas();
    } catch (error) {
        handleAuthError(error);
    }
}

// Formulario de Vacunas
document.getElementById('btnGuardarVacuna')?.addEventListener('click', function() {
    if (!verificarAutenticacion()) return;
    
    let inputNombre = document.querySelector('#formAgregarVacuna input[name="nombre"]');
    let inputFabricante = document.querySelector('#formAgregarVacuna input[name="fabricante"]');
    let selectTipo = document.querySelector('#formAgregarVacuna select[name="tipo"]');
    let inputDosisTotales = document.querySelector('#formAgregarVacuna input[name="dosis_totales"]');
    let selectViaAdmin = document.querySelector('#formAgregarVacuna select[name="via_administracion"]');
    let selectTempAlmacen = document.querySelector('#formAgregarVacuna select[name="temperatura_almacenamiento"]');
    
    if (
        validateInput(inputNombre, "Nombre de la vacuna") &&
        validateInput(inputFabricante, "Fabricante") &&
        validateInput(selectTipo, "Tipo de vacuna") &&
        validateInput(inputDosisTotales, "Dosis totales") &&
        validateInput(selectViaAdmin, "Vía de administración") &&
        validateInput(selectTempAlmacen, "Temperatura de almacenamiento")
    ) {
        const formData = new FormData(document.getElementById('formAgregarVacuna'));
        const data = Object.fromEntries(formData.entries());
        
        // Convertir dosis_totales a número
        data.dosis_totales = parseInt(data.dosis_totales);
        
        guardarVacuna(data);
    }
});

// Función para guardar vacuna
async function guardarVacuna(data) {
    if (!verificarAutenticacion()) return;
    
    try {
        const response = await fetch('http://127.0.0.1:8000/vacunas/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Error al registrar vacuna');
        }
        
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Vacuna registrada correctamente',
        });
        
        bootstrap.Modal.getInstance(document.getElementById('vacunaModal')).hide();
        cargarVacunas();
    } catch (error) {
        handleAuthError(error);
    }
}

// Formulario de Niños
document.getElementById('btnGuardarNino')?.addEventListener('click', function() {
    if (!verificarAutenticacion()) return;
    
    let inputNombres = document.querySelector('#formRegistroNino input[name="nombres"]');
    let inputApellidos = document.querySelector('#formRegistroNino input[name="apellidos"]');
    let selectTipoDoc = document.querySelector('#formRegistroNino select[name="tipo_de_documento"]');
    let inputDni = document.querySelector('#formRegistroNino input[name="dni"]');
    let inputFechaNac = document.querySelector('#formRegistroNino input[name="fecha_nacimiento"]');
    let inputNombreCuidador = document.querySelector('#formRegistroNino input[name="nombre_cuidador"]');
    let inputTelefono = document.querySelector('#formRegistroNino input[name="telefono"]');
    let selectVacuna = document.querySelector('#formRegistroNino select[name="me_protege_de"]');
    let selectDosis = document.querySelector('#formRegistroNino select[name="dosis"]');
    let inputFechaAplicacion = document.querySelector('#formRegistroNino input[name="fecha_aplicacion"]');
    let inputLote = document.querySelector('#formRegistroNino input[name="numero_lote"]');
    let selectPrestador = document.querySelector('#formRegistroNino select[name="id_prestador_vacunador"]');
    
    if (
        validateInput(inputNombres, "Nombres del niño") &&
        validateInput(inputApellidos, "Apellidos del niño") &&
        validateInput(selectTipoDoc, "Tipo de documento") &&
        validateInput(inputDni, "Número de documento") &&
        validateDate(inputFechaNac, "Fecha de nacimiento") &&
        validateInput(inputNombreCuidador, "Nombre del cuidador") &&
        validateInput(inputTelefono, "Teléfono de contacto") &&
        validateInput(selectVacuna, "Vacuna aplicada") &&
        validateInput(selectDosis, "Dosis") &&
        validateDate(inputFechaAplicacion, "Fecha de aplicación") &&
        validateInput(inputLote, "Número de lote") &&
        validateInput(selectPrestador, "Prestador de salud")
    ) {
        const formData = new FormData(document.getElementById('formRegistroNino'));
        const data = Object.fromEntries(formData.entries());
        
        // Convertir lactancia_materna a booleano
        if (data.lactancia_materna) {
            data.lactancia_materna = data.lactancia_materna === 'true';
        }
        
        // Convertir id_prestador_vacunador a número
        data.id_prestador_vacunador = parseInt(data.id_prestador_vacunador);
        
        guardarNino(data);
    }
});

// Función para guardar niño
async function guardarNino(data) {
    if (!verificarAutenticacion()) return;
    
    try {
        const response = await fetch('http://127.0.0.1:8000/ninos/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Error al registrar niño');
        }
        
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Niño registrado correctamente',
        });
        
        bootstrap.Modal.getInstance(document.getElementById('niñosModal')).hide();
        cargarNinos();
    } catch (error) {
        handleAuthError(error);
    }
}

// Funciones para cargar datos (personas, vacunas, niños)
async function cargarPersonas() {
    if (!verificarAutenticacion()) return;
    
    try {
        const response = await fetch('http://127.0.0.1:8000/personas/', {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al cargar personas');
        }
        
        const personas = await response.json();
        const tbody = document.querySelector('#personasTable tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        personas.forEach(persona => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${persona.tipo_documento}</td>
                <td>${persona.dni}</td>
                <td>${persona.nombres}</td>
                <td>${persona.apellidos}</td>
                <td>${persona.genero || 'No especificado'}</td>
                <td>${persona.id_vacuna}</td>
                <td>${persona.fecha_aplicacion ? new Date(persona.fecha_aplicacion).toLocaleDateString() : '-'}</td>
                <td>${persona.lote_vacuna}</td>
                <td>${persona.telefono || '-'}</td>
                <td><i class="bi bi-trash text-danger" style="cursor: pointer;" onclick="eliminarPersona(${persona.id_persona})"></i></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        handleAuthError(error);
    }
}

async function cargarVacunas() {
    if (!verificarAutenticacion()) return;
    
    try {
        const response = await fetch('http://127.0.0.1:8000/vacunas/', {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al cargar vacunas');
        }
        
        const vacunas = await response.json();
        const tbody = document.querySelector('#vacunasTable tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        vacunas.forEach(vacuna => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${vacuna.id_vacuna}</td>
                <td>${vacuna.nombre}</td>
                <td>${vacuna.fabricante}</td>
                <td>${vacuna.dosis_totales}</td>
                <td>${vacuna.fecha_registro ? new Date(vacuna.fecha_registro).toLocaleDateString() : '-'}</td>
                <td>${vacuna.edad_minima_meses === 0 ? 'Sí' : 'No'}</td>
                <td>${vacuna.estado ? 'Activa' : 'Inactiva'}</td>
                <td><i class="bi bi-trash text-danger" style="cursor: pointer;" onclick="eliminarVacuna(${vacuna.id_vacuna})"></i></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        handleAuthError(error);
    }
}

async function cargarNinos() {
    if (!verificarAutenticacion()) return;
    
    try {
        const response = await fetch('http://127.0.0.1:8000/ninos/', {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al cargar niños');
        }
        
        const ninos = await response.json();
        const tbody = document.querySelector('#ninosTable tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        ninos.forEach(nino => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${nino.nombres}</td>
                <td>${nino.apellidos}</td>
                <td>${nino.genero || 'No especificado'}</td>
                <td>${nino.edad || '-'}</td>
                <td>${nino.dosis}</td>
                <td>${nino.fecha_aplicacion ? new Date(nino.fecha_aplicacion).toLocaleDateString() : '-'}</td>
                <td>${nino.fecha_proxima_cita ? new Date(nino.fecha_proxima_cita).toLocaleDateString() : '-'}</td>
                <td>${nino.fecha_nacimiento ? new Date(nino.fecha_nacimiento).toLocaleDateString() : '-'}</td>
                <td>${nino.lactancia_materna ? 'Sí' : 'No'}</td>
                <td><i class="bi bi-trash text-danger" style="cursor: pointer;" onclick="eliminarNino(${nino.id_nino})"></i></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        handleAuthError(error);
    }
}

// Funciones para eliminar registros
async function eliminarPersona(id) {
    if (!verificarAutenticacion()) return;
    
    try {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        
        if (result.isConfirmed) {
            const response = await fetch(`http://127.0.0.1:8000/personas/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al eliminar persona');
            }
            
            Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'La persona ha sido eliminada',
            });
            
            cargarPersonas();
        }
    } catch (error) {
        handleAuthError(error);
    }
}

async function eliminarVacuna(id) {
    if (!verificarAutenticacion()) return;
    
    try {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        
        if (result.isConfirmed) {
            const response = await fetch(`http://127.0.0.1:8000/vacunas/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al eliminar vacuna');
            }
            
            Swal.fire({
                icon: 'success',
                title: 'Eliminada',
                text: 'La vacuna ha sido eliminada',
            });
            
            cargarVacunas();
        }
    } catch (error) {
        handleAuthError(error);
    }
}

async function eliminarNino(id) {
    if (!verificarAutenticacion()) return;
    
    try {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        
        if (result.isConfirmed) {
            const response = await fetch(`http://127.0.0.1:8000/ninos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al eliminar niño');
            }
            
            Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'El niño ha sido eliminado',
            });
            
            cargarNinos();
        }
    } catch (error) {
        handleAuthError(error);
    }
}

// Cargar datos al iniciar la página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación antes de cargar datos
    if (verificarAutenticacion()) {
        cargarPersonas();
        cargarVacunas();
        cargarNinos();
        cargarSelects();
        
        // Mostrar email del usuario actual
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
            const userDisplay = document.getElementById('userDisplay');
            if (userDisplay) {
                userDisplay.textContent = userEmail;
            }
        }
    }
});

// Función para cargar selects dinámicos
async function cargarSelects() {
    if (!verificarAutenticacion()) return;
    
    try {
        // Cargar prestadores de salud
        const responsePrestadores = await fetch('http://127.0.0.1:8000/prestadores/', {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        
        if (responsePrestadores.ok) {
            const prestadores = await responsePrestadores.json();
            const selectPrestador = document.querySelector('#formAgregarPersona select[name="id_prestador"]');
            const selectPrestadorVacunador = document.querySelector('#formAgregarPersona select[name="id_prestador_vacunador"]');
            const selectPrestadorNino = document.querySelector('#formRegistroNino select[name="id_prestador_vacunador"]');
            
            prestadores.forEach(prestador => {
                const option = document.createElement('option');
                option.value = prestador.id_prestador;
                option.textContent = prestador.nombre;
                
                if (selectPrestador) selectPrestador.appendChild(option.cloneNode(true));
                if (selectPrestadorVacunador) selectPrestadorVacunador.appendChild(option.cloneNode(true));
                if (selectPrestadorNino) selectPrestadorNino.appendChild(option.cloneNode(true));
            });
        }
        
        // Cargar vacunas
        const responseVacunas = await fetch('http://127.0.0.1:8000/vacunas/', {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        
        if (responseVacunas.ok) {
            const vacunas = await responseVacunas.json();
            const selectVacuna = document.querySelector('#formAgregarPersona select[name="id_vacuna"]');
            const selectVacunaNino = document.querySelector('#formRegistroNino select[name="me_protege_de"]');
            
            vacunas.forEach(vacuna => {
                const option = document.createElement('option');
                option.value = vacuna.id_vacuna;
                option.textContent = vacuna.nombre;
                
                if (selectVacuna) selectVacuna.appendChild(option.cloneNode(true));
                
                if (selectVacunaNino) {
                    const optionNino = document.createElement('option');
                    optionNino.value = vacuna.nombre;
                    optionNino.textContent = vacuna.nombre;
                    selectVacunaNino.appendChild(optionNino);
                }
            });
        }
    } catch (error) {
        handleAuthError(error);
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    Swal.fire({
        title: '¿Cerrar sesión?',
        text: "¿Está seguro que desea cerrar su sesión?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userEmail');
            window.location.href = 'login.html?logout=true';
        }
    });
}

// Agregar evento al botón de logout si existe
document.getElementById('btnLogout')?.addEventListener('click', cerrarSesion);