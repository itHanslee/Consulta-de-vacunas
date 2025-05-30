document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const documentoInput = document.getElementById('documento');
    const tipoDocumentoSelect = document.getElementById('tipoDocumento');
    const buttonText = document.getElementById('buttonText');
    const buttonSpinner = document.getElementById('buttonSpinner');

    function mostrarAlerta(title, text, icon) {
        return Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonText: 'Aceptar'
        });
    }

    async function realizarLogin() {
        localStorage.clear()
        const documento = documentoInput.value.trim();
        const tipoDocumento = tipoDocumentoSelect.value;

        // Validación básica
        if (!documento || !tipoDocumento) {
            await mostrarAlerta('Error', 'Por favor complete todos los campos', 'error');
            return;
        }

        try {
            // Mostrar estado de carga
            loginBtn.disabled = true;
            buttonText.textContent = 'Verificando...';
            buttonSpinner.classList.remove('d-none');

            // Realizar petición al backend
            const response = await fetch('http://127.0.0.1:8000/login/persona', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dni: documento
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error en la autenticación');
            }

            const data = await response.json();
            
            // Guardar datos en localStorage
            localStorage.setItem('personaToken', data.access_token);
            localStorage.setItem('personaData', JSON.stringify(data.persona));
            
            // Redirigir a dashboard de personas
            window.location.href = 'consulta-personas.html';

        } catch (error) {
            console.error('Error en login:', error);
            let mensajeError = error.message || 'Error al conectar con el servidor';
            
            if (error.message.includes('Failed to fetch')) {
                mensajeError = 'No se pudo conectar al servidor. Verifique su conexión.';
            }
            
            await mostrarAlerta('Error', mensajeError, 'error');
        } finally {
            // Restaurar estado del botón
            loginBtn.disabled = false;
            buttonText.textContent = 'Ingresar';
            buttonSpinner.classList.add('d-none');
        }
    }

    // Event listeners
    loginBtn.addEventListener('click', realizarLogin);
    
    // Permitir submit con Enter
    documentoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            realizarLogin();
        }
    });
    
    tipoDocumentoSelect.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            realizarLogin();
        }
    });
});