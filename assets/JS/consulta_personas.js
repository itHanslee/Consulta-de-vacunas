document.addEventListener('DOMContentLoaded', function() {
    const personaInfo = document.getElementById('personaInfo');
    const volverBtn = document.getElementById('volverBtn');
    
    const personaData = JSON.parse(localStorage.getItem('personaData'));
    const token = localStorage.getItem('personaToken');

    function formatDate(dateString) {
        if (!dateString) return 'No especificada';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Verificar si hay datos de persona
    if (!personaData || !token) {
        Swal.fire({
            title: 'Sesión no válida',
            text: 'No se encontraron datos de persona. Por favor inicie sesión nuevamente.',
            icon: 'error'
        }).then(() => {
            window.location.href = 'login_personas.html';
        });
        return;
    }

    // Mostrar información de la persona
    personaInfo.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <p><span class="info-label">Nombre completo:</span> ${personaData.nombres} ${personaData.apellidos}</p>
                <p><span class="info-label">Tipo documento:</span> ${personaData.tipo_documento}</p>
                <p><span class="info-label">Número documento:</span> ${personaData.dni}</p>
                <p><span class="info-label">Fecha nacimiento:</span> ${formatDate(personaData.fecha_nacimiento)}</p>
            </div>
            <div class="col-md-6">
                <p><span class="info-label">Vacuna aplicada:</span> ${personaData.id_vacuna}</p>
                <p><span class="info-label">Dosis:</span> ${personaData.dosis}</p>
                <p><span class="info-label">Fecha aplicación:</span> ${formatDate(personaData.fecha_aplicacion)}</p>
                <p><span class="info-label">Fabricante:</span> ${personaData.fabricante_vacuna}</p>
            </div>
        </div>
        <hr>
        <div class="row mt-3">
            <div class="col-md-6">
                <p><span class="info-label">Teléfono:</span> ${personaData.telefono || 'No registrado'}</p>
                <p><span class="info-label">Email:</span> ${personaData.email || 'No registrado'}</p>
            </div>
            <div class="col-md-6">
                <p><span class="info-label">Prestador de salud:</span> ${personaData.id_prestador || 'No registrado'}</p>
                <p><span class="info-label">Lote vacuna:</span> ${personaData.lote_vacuna}</p>
            </div>
        </div>
    `;

    // Evento para el botón volver
    volverBtn.addEventListener('click', function() {
        localStorage.removeItem('personaToken');
        localStorage.removeItem('personaData');
        window.location.href = 'login_personas.html';
    });
});