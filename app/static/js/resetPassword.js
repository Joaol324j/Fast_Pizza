document.addEventListener("DOMContentLoaded", function () {
    const token = document.getElementById("reset-token").getAttribute("data-token"); 
    const form = document.getElementById("reset-password-form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const newPassword = document.getElementById("password").value;

        if (!newPassword) {
            alert("Por favor, insira uma nova senha.");
            return;
        }

        try {
            
            const response = await fetch(`/reset/resetar-senha/${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nova_senha: newPassword })
            });

            if (!response.ok) {
                throw new Error("Erro ao resetar a senha.");
            }

            alert("Senha resetada com sucesso.");
            window.location.href = "/login"; 
        } catch (error) {
            alert(error.message);
        }
    });
});
