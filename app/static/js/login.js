document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("login-form");
    if (!form) {
        console.error("Erro: Formulário de login não encontrado");
        return;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const usernameOrEmail = document.getElementById("username")?.value;
        const password = document.getElementById("password")?.value;
        const errorMsg = document.getElementById("errorMsg");

        if (!usernameOrEmail || !password) {
            console.error("Erro: Campos de login não encontrados!");
            return;
        }

        try {
            const formData = new URLSearchParams();
            formData.append("username_or_email", usernameOrEmail);
            formData.append("password", password);

            const response = await fetch(`/user/login/?${formData.toString()}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });

            if (!response.ok) {
                throw new Error("Credenciais inválidas. Verifique seu usuário e senha.");
            }

            const data = await response.json();

            localStorage.setItem("token", data.access_token);
            console.log("Token salvo com sucesso:", localStorage.getItem("token"));

            window.location.href = "/";
        } catch (error) {
            errorMsg.textContent = error.message;
            errorMsg.style.display = "block";
        }
    });
});