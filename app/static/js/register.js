document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    if (!form) {
        console.error("Erro: Formulário de cadastro não encontrado");
        return;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!username || !email || !password) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        try {
            const userData = {
                username: username,
                email: email,
                password: password
            };

            const response = await fetch("/api/users/cadastro/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify(userData) 
            });

            if (!response.ok) {
                throw new Error("Erro ao cadastrar usuário. Tente novamente.");
            }

            const data = await response.json();
            alert(data.msg || "Cadastro realizado com sucesso!");

            window.location.href = "/login";
        } catch (error) {
            alert("Erro: " + error.message);
        }
    });
});
