const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const loginMessage = document.getElementById("loginMessage");


// =========================
// SHOW / HIDE PASSWORD
// =========================

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        togglePassword.textContent = "Hide";

    } else {

        passwordInput.type = "password";
        togglePassword.textContent = "Show";

    }

});


// =========================
// LOGIN
// =========================

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value;

    loginMessage.textContent = "Logging in...";

    try {

        const response = await fetch("/api/auth/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })

        });


        const data = await response.json();


        if (!response.ok) {

            loginMessage.textContent =
                data.message || "Login failed.";

            return;
        }


        // Save logged-in user information
        localStorage.setItem(
            "matchaholicUser",
            JSON.stringify(data.user)
        );


        loginMessage.textContent = "Login successful!";


        // Redirect after login
        setTimeout(() => {

            window.location.href = "index.html";

        }, 800);


    } catch (error) {

        console.error(error);

        loginMessage.textContent =
            "Unable to connect to the server.";

    }

});