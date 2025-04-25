document.addEventListener("DOMContentLoaded", () => {
    const signUpButton = document.getElementById("signUp")
    const signInButton = document.getElementById("signIn")
    const container = document.getElementById("container")

    // Cambiar de formulario
    signUpButton.addEventListener("click", () => {
        container.classList.add("right-panel-active")
        clearErrors()
    })

    signInButton.addEventListener("click", () => {
        container.classList.remove("right-panel-active")
        clearErrors()
    })

    // Función para limpiar errores
    function clearErrors() {
        const errorElements = document.querySelectorAll(".error-message")
        const inputElements = document.querySelectorAll("input")

        errorElements.forEach((element) => {
            element.textContent = ""
        })

        inputElements.forEach((input) => {
            input.classList.remove("error")
        })
    }

    // Función para mostrar errores
    function showError(inputId, errorId, message) {
        const input = document.getElementById(inputId)
        const errorElement = document.getElementById(errorId)

        input.classList.add("error")
        errorElement.textContent = message
        errorElement.classList.add("shake")

        // Quitar la animación después de que termine
        setTimeout(() => {
            errorElement.classList.remove("shake")
        }, 600)

        return false
    }

    // Función para mostrar error general (sin input asociado)
    function showGeneralError(errorId, message) {
        const errorElement = document.getElementById(errorId)
        errorElement.textContent = message
        errorElement.classList.add("shake")

        setTimeout(() => {
            errorElement.classList.remove("shake")
        }, 600)
    }

    // Función para mostrar mensaje de éxito
    function showSuccess(formId, message) {
        const form = document.getElementById(formId)
        const successDiv = document.createElement("div")
        successDiv.className = "success-message"
        successDiv.textContent = message

        // Eliminar mensaje de éxito anterior si existe
        const existingSuccess = form.querySelector(".success-message")
        if (existingSuccess) {
            form.removeChild(existingSuccess)
        }

        // Insertar antes del botón
        const button = form.querySelector("button")
        form.insertBefore(successDiv, button)

        // Eliminar después de 3 segundos
        setTimeout(() => {
            if (form.contains(successDiv)) {
                form.removeChild(successDiv)
            }
        }, 3000)
    }

    // Validación de email
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
    }

    // Registro de usuario
    const registerForm = document.getElementById("registerForm")
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault()
        clearErrors()

        let isValid = true
        const name = document.getElementById("registerName").value.trim()
        const email = document.getElementById("registerEmail").value.trim()
        const password = document.getElementById("registerPassword").value

        if (!name) {
            isValid = showError("registerName", "registerNameError", "El nombre es obligatorio.")
        }

        if (!email) {
            isValid = showError("registerEmail", "registerEmailError", "El correo electrónico es obligatorio.")
        } else if (!isValidEmail(email)) {
            isValid = showError("registerEmail", "registerEmailError", "Ingrese un correo electrónico válido.")
        }

        if (!password) {
            isValid = showError("registerPassword", "registerPasswordError", "La contraseña es obligatoria.")
        } else if (password.length < 6) {
            isValid = showError(
                "registerPassword",
                "registerPasswordError",
                "La contraseña debe tener al menos 6 caracteres.",
            )
        }

        if (!isValid) return

        try {
            const response = await fetch("http://backendcoreback.runasp.net/api/Access/Register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, languaje: "es-es" }),
            })

            if (response.ok) {
                showSuccess("registerForm", "Registro exitoso. Ahora puedes iniciar sesión.")
                setTimeout(() => {
                    container.classList.remove("right-panel-active")
                    registerForm.reset()
                }, 2000)
            } else {
                const error = await response.json()
                showGeneralError("registerGeneralError", "Error al registrar: " + (error.message || "Datos inválidos."))
            }
        } catch (err) {
            showGeneralError("registerGeneralError", "Error de red o servidor.")
            console.error(err)
        }
    })

    // Inicio de sesión
    const loginForm = document.getElementById("loginForm")
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault()
        clearErrors()

        let isValid = true
        const email = document.getElementById("loginEmail").value.trim()
        const password = document.getElementById("loginPassword").value

        if (!email) {
            isValid = showError("loginEmail", "loginEmailError", "El correo electrónico es obligatorio.")
        } else if (!isValidEmail(email)) {
            isValid = showError("loginEmail", "loginEmailError", "Correo electrónico inválido.")
        }

        if (!password) {
            isValid = showError("loginPassword", "loginPasswordError", "La contraseña es obligatoria.")
        }

        if (!isValid) return

        try {
            const response = await fetch("http://backendcoreback.runasp.net/api/Access/Login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (response.ok && data.issuccess) {
                localStorage.setItem("token", data.token)
                showSuccess("loginForm", "Inicio de sesión exitoso")
                setTimeout(() => {
                    window.location.href = "chat.html"
                }, 1000)
            } else {
                showGeneralError("loginGeneralError", "Credenciales incorrectas o usuario no registrado.")
            }
        } catch (err) {
            showGeneralError("loginGeneralError", "Error de red o servidor.")
            console.error(err)
        }
    })
})
