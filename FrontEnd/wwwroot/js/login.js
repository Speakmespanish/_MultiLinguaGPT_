document.addEventListener("DOMContentLoaded", () => {
	const signUpButton = document.getElementById("signUp");
	const signInButton = document.getElementById("signIn");
	const container = document.getElementById("container");

	// Cambiar de formulario
	signUpButton.addEventListener("click", () => {
		container.classList.add("right-panel-active");
	});

	signInButton.addEventListener("click", () => {
		container.classList.remove("right-panel-active");
	});

	// Validación de email
	const isValidEmail = (email) => {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	};

	// Registro de usuario
	const registerForm = document.getElementById("registerForm");
	registerForm.addEventListener("submit", async (e) => {
		e.preventDefault();

		const name = document.getElementById("registerName").value.trim();
		const email = document.getElementById("registerEmail").value.trim();
		const password = document.getElementById("registerPassword").value;

		if (!name || !email || !password) {
			alert("Todos los campos son obligatorios.");
			return;
		}

		if (!isValidEmail(email)) {
			alert("Ingrese un correo electrónico válido.");
			return;
		}

		if (password.length < 6) {
			alert("La contraseña debe tener al menos 6 caracteres.");
			return;
		}

		try {
			const response = await fetch("http://backendcoreback.runasp.net/api/Access/Register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password, languaje: "es-es" }),
			});

			if (response.ok) {
				alert("Registro exitoso. Ahora inicia sesión.");
				container.classList.remove("right-panel-active");
			} else {
				const error = await response.json();
				alert("Error al registrar: " + (error.message || "Datos inválidos."));
			}
		} catch (err) {
			alert("Error de red o servidor.");
			console.error(err);
		}
	});

	// Inicio de sesión
	const loginForm = document.getElementById("loginForm");
	loginForm.addEventListener("submit", async (e) => {
		e.preventDefault();

		const email = document.getElementById("loginEmail").value.trim();
		const password = document.getElementById("loginPassword").value;

		if (!email || !password) {
			alert("Por favor, completa ambos campos.");
			return;
		}

		if (!isValidEmail(email)) {
			alert("Correo electrónico inválido.");
			return;
		}

		try {
			const response = await fetch("http://backendcoreback.runasp.net/api/Access/Login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (response.ok && data.issuccess) {
				localStorage.setItem("token", data.token);
				alert("Inicio de sesión exitoso");
				window.location.href = "buscar.html";
			} else {
				alert("Error al iniciar sesión: Credenciales incorrectas o usuario no registrado.");
			}
		} catch (err) {
			alert("Error de red o servidor.");
			console.error(err);
		}
	});
});
