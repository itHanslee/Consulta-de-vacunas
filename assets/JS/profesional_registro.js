const API_URL = 'http://localhost:8000'; // Asegúrate que coincide con tu servidor FastAPI
const ROLE_TYPE = 'vacunador'; // Rol por defecto para nuevos usuarios

// Elementos del DOM (se mantienen igual)
const elements = {
  form: document.getElementById('formRegistroPersonal'),
  dni: document.getElementById('dni'),
  tipoDocumento: document.getElementById('tipo_documento'),
  nombres: document.getElementById('nombres'),
  apellidos: document.getElementById('apellidos'),
  telefono: document.getElementById('telefono'),
  email: document.getElementById('email'),
  credencialFile: document.getElementById('formFile1'),
  certificacionesFile: document.getElementById('formFile2'),
  credencialesOutput: document.getElementById('credencialesOutput'),
  usuarioGenerado: document.getElementById('usuarioGenerado'),
  passwordGenerada: document.getElementById('passwordGenerada'),
  btnCopiarCredenciales: document.getElementById('btnCopiarCredenciales')
};

// Inicialización de eventos (se mantiene igual)
function initEvents() {
  if (elements.form && elements.btnCopiarCredenciales) {
    elements.form.addEventListener('submit', handleSubmit);
    elements.btnCopiarCredenciales.addEventListener('click', copiarCredenciales);
  } else {
    console.error('Algunos elementos del DOM no fueron encontrados');
  }
}

// Generación de credenciales (adaptado a tu modelo)
function generatePassword(length = 12) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

function generateUsername(email) {
  if (!email || typeof email !== 'string') {
    return 'user' + Math.floor(Math.random() * 1000);
  }
  return email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') + Math.floor(Math.random() * 100);
}

// Validación mejorada según tu esquema
function validateForm() {
  if (!elements.tipoDocumento.value) {
    throw new Error('Por favor, selecciona un tipo de documento');
  }
  
  if (!elements.dni.value || !/^\d{8,15}$/.test(elements.dni.value)) {
    throw new Error('Por favor, ingresa un número de documento válido (8-15 dígitos)');
  }
  
  if (!elements.nombres.value || elements.nombres.value.length < 2) {
    throw new Error('Por favor, ingresa tus nombres completos');
  }
  
  if (!elements.apellidos.value || elements.apellidos.value.length < 2) {
    throw new Error('Por favor, ingresa tus apellidos completos');
  }
  
  if (!elements.email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(elements.email.value)) {
    throw new Error('Por favor, ingresa un correo electrónico válido');
  }
  
  if (elements.credencialFile.files.length === 0) {
    throw new Error('Por favor, sube tu credencial profesional');
  }
}

// Manejo del submit adaptado a tu API
async function handleSubmit(event) {
  event.preventDefault();
  
  try {
    validateForm();
    
    const password = generatePassword();
    const username = generateUsername(elements.email.value);
    
    // Estructura de datos según UsuarioCreate en tu schema
    const userData = {
      dni: elements.dni.value,
      nombres: elements.nombres.value,
      apellidos: elements.apellidos.value,
      email: elements.email.value,
      telefono: elements.telefono.value || null,
      password: password,
      rol: ROLE_TYPE,
      estado: true
    };
    
    showLoading(true);
    
    // Registro del usuario
    const response = await registerUser(userData);
    
    showLoading(false);
    
    if (response && response.id_usuario) {
      showCredentials(username, password);
      
      // Aquí podrías agregar la subida de archivos si lo necesitas
      // await uploadFiles(response.id_usuario);
    } else {
      throw new Error('Error al registrar usuario: Respuesta incompleta del servidor');
    }
    
  } catch (error) {
    showLoading(false);
    handleError(error);
  }
}

// Función para registrar usuario adaptada a tu endpoint
async function registerUser(userData) {
  try {
    const response = await fetch(`${API_URL}/usuarios/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        
        // Manejo específico para errores 422 (Unprocessable Entity)
        if (response.status === 422 && Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map(err => {
            return `${err.loc ? err.loc.join('.') + ': ' : ''}${err.msg}`;
          }).join('\n');
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch (e) {
        console.error('Error al parsear respuesta de error:', e);
      }
      
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    if (error.name === 'TypeError') {
      throw new Error('Error de conexión: Verifica que el servidor esté disponible');
    }
    throw error;
  }
}

/**
 * Muestra u oculta un indicador de carga
 * @param {boolean} show - Indica si se debe mostrar el indicador
 */
function showLoading(show) {
  // Implementar lógica para mostrar/ocultar un indicador de carga
  // Por ejemplo, agregar/quitar una clase con un spinner
  const submitButton = elements.form.querySelector('button[type="submit"]');
  if (submitButton) {
    if (show) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';
    } else {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Registrar';
    }
  }
}

/**
 * Registra el usuario en la API
 * @param {Object} userData - Datos del usuario a registrar
 * @returns {Object} - Respuesta de la API
 */
async function registerUser(userData) {
  try {
    const response = await fetch(`${API_URL}/usuarios/`, {
    
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Error de servidor' }));
      throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error.name === 'TypeError') {
      throw new Error('Error de conexión: Verifica que el servidor esté disponible');
    }
    throw error;
  }
}

/**
 * Muestra las credenciales generadas al usuario
 * @param {string} username - Nombre de usuario generado
 * @param {string} password - Contraseña generada
 */
function showCredentials(username, password) {
  if (elements.usuarioGenerado && elements.passwordGenerada && elements.credencialesOutput) {
    elements.usuarioGenerado.textContent = username;
    elements.passwordGenerada.textContent = password;
    elements.credencialesOutput.classList.remove('d-none');
    
    // Crear alerta de éxito
    const alertElement = document.createElement('div');
    alertElement.className = 'alert alert-success mt-3';
    alertElement.role = 'alert';
    alertElement.textContent = 'Registro exitoso. Guarda tus credenciales.';
    
    elements.form.parentNode.insertBefore(alertElement, elements.credencialesOutput);
    
    setTimeout(() => {
      alertElement.remove();
    }, 5000);
    
    // Limpiar el formulario
    elements.form.reset();
  }
}

/**
 * Copia las credenciales al portapapeles
 */
function copiarCredenciales() {
  if (!elements.usuarioGenerado || !elements.passwordGenerada) return;
  
  const credencialesTexto = `Usuario: ${elements.usuarioGenerado.textContent}\nContraseña: ${elements.passwordGenerada.textContent}`;
  
  navigator.clipboard.writeText(credencialesTexto)
    .then(() => {
      // Cambiar temporalmente el texto del botón para indicar que se copió
      const textoOriginal = elements.btnCopiarCredenciales.innerHTML;
      elements.btnCopiarCredenciales.innerHTML = '<i class="bi bi-check-circle"></i> Copiado';
      
      setTimeout(() => {
        elements.btnCopiarCredenciales.innerHTML = textoOriginal;
      }, 2000);
    })
    .catch(err => {
      console.error('Error al copiar al portapapeles:', err);
      // Mostrar mensaje alternativo si falla el copiado
      alert('No se pudo copiar al portapapeles. Por favor, copia manualmente las credenciales.');
    });
}

/**
 * Maneja errores durante el proceso de registro
 * @param {Error} error - Error ocurrido
 */
function handleError(error) {
  console.error('Error en el registro:', error);
  
  // Crear alerta de error
  const alertElement = document.createElement('div');
  alertElement.className = 'alert alert-danger mt-3';
  alertElement.role = 'alert';
  alertElement.textContent = error.message || 'Ocurrió un error durante el registro. Por favor, intenta nuevamente.';
  
  // Agregar la alerta antes del formulario
  if (elements.form && elements.form.parentNode) {
    elements.form.parentNode.insertBefore(alertElement, elements.form);
    
    // Eliminar la alerta después de 5 segundos
    setTimeout(() => {
      alertElement.remove();
    }, 5000);
  }
}

// Inicializar el módulo cuando se carga el documento
document.addEventListener('DOMContentLoaded', initEvents);