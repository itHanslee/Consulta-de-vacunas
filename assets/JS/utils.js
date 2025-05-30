function validateInput(input, name) {
    let text = input.value;
    console.log(text)
    if (text.trim().length <= 0) {
        showAlertError("Por favor validar el campo", name);
        return false;
    }
    return true;
}

function checkToken() {

}

function showAlertError(title, message) {
    Swal.fire({
        icon: "error",
        title: title,
        text: message
    });
}

