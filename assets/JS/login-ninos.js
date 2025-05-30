document.addEventListener('DOMContentLoaded', function() {
    const consultarBtn = document.getElementById('consultarBtn');
    const documentoNino = document.getElementById('documentoNino');
    const tipoDocumento = document.getElementById('tipoDocumento');

    function mostrarAlerta(title, text, icon) {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonText: 'Aceptar'
        });
    }

    consultarBtn.addEventListener('click', async function() {
        localStorage.clear()
        if (!documentoNino.value || !tipoDocumento.value || tipoDocumento.value === "Tipo de documento") {
            mostrarAlerta('Error', 'Por favor complete todos los campos', 'error');
            return;
        }

        try {
            consultarBtn.disabled = true;
            consultarBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Consultando...';

            const apiUrl = 'http://localhost:8000/login/nino';
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    dni: documentoNino.value
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(data);
            
            // Guardar datos y redirigir
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('ninoData', JSON.stringify(data.nino));
            window.location.href = 'consulta-ninos.html';

        } catch (error) {
            console.error('Error en la consulta:', error);
            
            let errorMessage = error.message;
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión o intente más tarde.';
            }
            
            mostrarAlerta('Error', errorMessage, 'error');
        } finally {
            consultarBtn.disabled = false;
            consultarBtn.innerHTML = 'Consultar';
        }
    });

    // Permitir enviar con Enter
    documentoNino.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            consultarBtn.click();
        }
    });

    tipoDocumento.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            consultarBtn.click();
        }
    });
});