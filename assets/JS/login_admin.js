// Constantes de configuración
const API_URL = 'http://localhost:8000'; // Ajusta según tu entorno

// Elementos del DOM
const elements = {
    loginForm: document.getElementById('loginForm'),
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    loginAlert: document.getElementById('loginAlert'),
    alertMessage: document.getElementById('alertMessage'),
    btnLogin: document.getElementById('btnLogin'),
    loginText: document.getElementById('loginText'),
    loginSpinner: document.getElementById('loginSpinner'),
    togglePassword: document.getElementById('togglePassword')
};

/**
 * Muestra un mensaje de error en el formulario
 * @param {string} message - Mensaje de error a mostrar
 */
function showError(message) {
    elements.alertMessage.textContent = message;
    elements.loginAlert.classList.remove('d-none');
    elements.loginAlert.classList.add('show');

    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
        elements.loginAlert.classList.remove('show');
        setTimeout(() => elements.loginAlert.classList.add('d-none'), 300);
    }, 5000);
}

/**
 * Maneja el envío del formulario de login
 * @param {Event} event - Evento de submit
 */
async function handleLogin(event) {
    event.preventDefault();
    localStorage.clear()
    try {
        // Validar formulario
        if (!elements.loginForm.checkValidity()) {
            event.stopPropagation();
            elements.loginForm.classList.add('was-validated');
            return;
        }

        // Mostrar estado de carga
        elements.btnLogin.disabled = true;
        elements.loginText.textContent = 'Verificando...';
        elements.loginSpinner.classList.remove('d-none');
        elements.loginAlert.classList.add('d-none');

        // Crear objeto con los datos del formulario
        const formData = {
            email: elements.email.value.trim(),
            password: elements.password.value
        };

        // Validación adicional de email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            throw new Error('Por favor ingrese un correo electrónico válido');
        }

        // Enviar datos al servidor
        const response = await fetch(`${API_URL}/login/usuario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        // Manejar respuesta del servidor
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Credenciales incorrectas. Por favor intente nuevamente.');
        }

        const data = await response.json();

        // Guardar token en localStorage
        localStorage.setItem('authToken', data.access_token);
        localStorage.setItem('userEmail', formData.email); // Guardar email para mostrar en admin

        // Redirigir a admin_salud.html después de login exitoso
        window.location.href = 'admin.html';

    } catch (error) {
        console.error('Error en login:', error);
        showError(error.message);

        // Restaurar estado del botón
        elements.btnLogin.disabled = false;
        elements.loginText.textContent = 'Ingresar';
        elements.loginSpinner.classList.add('d-none');
    }
}

/**
 * Alternar visibilidad de la contraseña
 */
function togglePasswordVisibility() {
    const isPassword = elements.password.type === 'password';
    elements.password.type = isPassword ? 'text' : 'password';
    elements.togglePassword.classList.toggle('bi-eye', !isPassword);
    elements.togglePassword.classList.toggle('bi-eye-slash', isPassword);
}

/**
 * Verificar si hay credenciales guardadas
 */
function checkRememberedUser() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        elements.email.value = rememberedEmail;
        document.getElementById('rememberMe').checked = true;
    }
}

/**
 * Inicializar eventos del formulario
 */
function initLoginEvents() {
    if (elements.loginForm) {
        elements.loginForm.addEventListener('submit', handleLogin);
    }

    if (elements.togglePassword) {
        elements.togglePassword.addEventListener('click', togglePasswordVisibility);
    }

    // Recordar usuario si está marcado
    document.getElementById('rememberMe')?.addEventListener('change', function () {
        if (this.checked) {
            localStorage.setItem('rememberedEmail', elements.email.value.trim());
        } else {
            localStorage.removeItem('rememberedEmail');
        }
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    initLoginEvents();
    checkRememberedUser();

    // Verificar si viene de logout
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('logout')) {
        showError('Ha cerrado sesión correctamente');
        history.replaceState(null, '', window.location.pathname);
    }
});