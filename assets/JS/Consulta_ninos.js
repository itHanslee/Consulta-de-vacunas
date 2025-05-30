document.addEventListener('DOMContentLoaded', function() {
    const ninoInfo = document.getElementById('ninoInfo');
    console.log(ninoInfo);
    
    const volverBtn = document.getElementById('volverBtn');
    
    // Obtener datos del niño del localStorage
    const ninoData = JSON.parse(localStorage.getItem('ninoData'));
    const token = localStorage.getItem('token');

    function formatDate(dateString) {
        if (!dateString) return 'No especificada';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Verificar si hay datos del niño
    if (!ninoData || !token) {
        Swal.fire({
            title: 'Sesión no válida',
            text: 'No se encontraron datos del niño. Por favor inicie sesión nuevamente.',
            icon: 'error'
        }).then(() => {
            window.location.href = 'ninos.html';
        });
        return;
    }

    // Mostrar información del niño
    ninoInfo.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <p><span class="info-label">Nombre completo:</span> ${ninoData.nombres} ${ninoData.apellidos}</p>
                <p><span class="info-label">Tipo documento:</span> ${ninoData.tipo_de_documento}</p>
                <p><span class="info-label">Número documento:</span> ${ninoData.dni}</p>
                <p><span class="info-label">Género:</span> ${ninoData.genero}</p>
                <p><span class="info-label">Edad:</span> ${ninoData.edad}</p>
            </div>
            <div class="col-md-6">
                <p><span class="info-label">Vacuna aplicada:</span> ${ninoData.me_protege_de}</p>
                <p><span class="info-label">Dosis:</span> ${ninoData.dosis}</p>
                <p><span class="info-label">Fecha aplicación:</span> ${formatDate(ninoData.fecha_aplicacion)}</p>
                <p><span class="info-label">Número de lote:</span> ${ninoData.numero_lote}</p>
                <p><span class="info-label">Próxima cita:</span> ${formatDate(ninoData.fecha_proxima_cita)}</p>
            </div>
        </div>
        <hr>
        <div class="row mt-3">
            <div class="col-md-6">
                <p><span class="info-label">Nombre madre:</span> ${ninoData.nombre_madre || 'No registrado'}</p>
                <p><span class="info-label">Nombre padre:</span> ${ninoData.nombre_padre || 'No registrado'}</p>
                <p><span class="info-label">Nombre cuidador:</span> ${ninoData.nombre_cuidador}</p>
                <p><span class="info-label">Lactancia materna:</span> ${ninoData.lactancia_materna ? 'Sí' : 'No'}</p>
            </div>
            <div class="col-md-6">
                <p><span class="info-label">Teléfono:</span> ${ninoData.telefono || 'No registrado'}</p>
                <p><span class="info-label">Email:</span> ${ninoData.email || 'No registrado'}</p>
                <p><span class="info-label">Observaciones:</span> ${ninoData.observaciones || 'Ninguna'}</p>
                <p><span class="info-label">Prestador de salud:</span> ${ninoData.id_prestador_vacunador || 'No registrado'}</p>
            </div>
        </div>
    `;

    // Evento para el botón volver
    volverBtn.addEventListener('click', function() {
        localStorage.removeItem('ninoToken');
        localStorage.removeItem('ninoData');
        window.location.href = 'ninos.html';
    });
});