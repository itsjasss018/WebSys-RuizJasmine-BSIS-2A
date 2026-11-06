const registerForm = document.getElementById("registerForm");

const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

const registerMessage = document.getElementById("registerMessage");


// SHOW PASSWORD
togglePassword.addEventListener("click", function () {
    passwordInput.type =
        passwordInput.type === "password"
            ? "text"
            : "password";

    togglePassword.textContent =
        passwordInput.type === "password"
            ? "Show"
            : "Hide";
});


// SHOW CONFIRM PASSWORD
toggleConfirmPassword.addEventListener("click", function () {
    confirmPasswordInput.type =
        confirmPasswordInput.type === "password"
            ? "text"
            : "password";

    toggleConfirmPassword.textContent =
        confirmPasswordInput.type === "password"
            ? "Show"
            : "Hide";
});


// REGISTER
registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();

    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    alert(
    "Password: [" + password + "]\n" +
    "Confirm: [" + confirmPassword + "]\n" +
    "Match: " + (password === confirmPassword)
);


    console.log("Password:", password);
    console.log("Confirm:", confirmPassword);
    console.log("Match:", password === confirmPassword);


    // CHECK PASSWORD
    if (password !== confirmPassword) {
        registerMessage.textContent = "Passwords do not match.";
        return;
    }


    // CHECK LENGTH
    if (password.length < 6) {
        registerMessage.textContent =
            "Password must be at least 6 characters.";
        return;
    }


    registerMessage.textContent =
        "Creating your account...";


    try {

        const response = await fetch("/api/auth/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })

        });


        const data = await response.json();


        if (!response.ok) {

            registerMessage.textContent =
                data.message ||
                data.error ||
                "Registration failed.";

            return;
        }


        registerMessage.textContent =
            "Account created successfully!";


        setTimeout(function () {
            window.location.href = "login.html";
        }, 1000);


    } catch (error) {

        console.error(error);

        registerMessage.textContent =
            "Unable to connect to the server.";
    }

});