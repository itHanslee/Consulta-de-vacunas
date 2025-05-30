document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registroEPSForm');
    
    form.addEventListener('submit', function(event) {

        event.preventDefault();
        

        removeAllErrors();
        

        const nombreEPS = form.querySelector('input[placeholder="Nombre de la EPS"]');
        const nit = form.querySelector('input[placeholder="NIT"]');
        const direccion = form.querySelector('input[placeholder="Dirección"]');
        const telefono = form.querySelector('input[placeholder="Teléfono"]');
        const email = form.querySelector('input[placeholder="Email"]');
        const codigoEPS = form.querySelector('input[placeholder="Código EPS"]');
        

        let isValid = true;
        

        if (!nombreEPS.value.trim()) {
            showError(nombreEPS, 'El nombre de la EPS es obligatorio');
            isValid = false;
        }
        
        if (!nit.value.trim()) {
            showError(nit, 'El NIT es obligatorio');
            isValid = false;
        } else if (!validateNIT(nit.value)) {
            showError(nit, 'El NIT debe tener 9 dígitos seguidos de un dígito de verificación (Ejemplo: 123456789-1)');
            isValid = false;
        }
        
        if (!direccion.value.trim()) {
            showError(direccion, 'La dirección es obligatoria');
            isValid = false;
        }
        
        if (!telefono.value.trim()) {
            showError(telefono, 'El teléfono es obligatorio');
            isValid = false;
        } else if (!validatePhone(telefono.value)) {
            showError(telefono, 'El teléfono debe tener 10 dígitos');
            isValid = false;
        }
        
        if (!email.value.trim()) {
            showError(email, 'El email es obligatorio');
            isValid = false;
        } else if (!validateEmail(email.value)) {
            showError(email, 'El formato del email es inválido');
            isValid = false;
        }
        
        if (!codigoEPS.value.trim()) {
            showError(codigoEPS, 'El código EPS es obligatorio');
            isValid = false;
        } else if (!validateCodigoEPS(codigoEPS.value)) {
            showError(codigoEPS, 'El código EPS debe tener formato EPSXXX (donde X son dígitos)');
            isValid = false;
        }
        
        if (isValid) {
        
            alert('Formulario enviado correctamente');
            form.reset();
        }
    });
    

    function validateNIT(nit) {
        const nitRegex = /^\d{9}-\d{1}$/;
        return nitRegex.test(nit);
    }
    

    function validatePhone(phone) {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    }
    

    function validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    }
    

    function validateCodigoEPS(codigo) {
        const codigoRegex = /^EPS\d{3}$/;
        return codigoRegex.test(codigo);
    }
    

    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorMessage = document.createElement('div');
        errorMessage.className = 'text-danger small error-message';
        errorMessage.innerText = message;
        formGroup.appendChild(errorMessage);
        input.classList.add('is-invalid');
    }
    

    function removeAllErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
        
        const invalidInputs = form.querySelectorAll('.is-invalid');
        invalidInputs.forEach(input => input.classList.remove('is-invalid'));
    }
    
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                const errorMessage = this.parentElement.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
                this.classList.remove('is-invalid');
            }
        });
    });
});