document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("forgot-password-form");
    const errorMsg = document.getElementById("error-msg");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;

        if (!email) {
            errorMsg.textContent = "Por favor, insira um e-mail válido.";
            errorMsg.style.display = "block";
            return;
        }

        try {
            const response = await fetch(`/reset/solicitar-recuperacao/?email=${encodeURIComponent(email)}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });

            if (!response.ok) {
                throw new Error("Erro ao solicitar recuperação. Tente novamente.");
            }

            alert("Instruções de recuperação de senha foram enviadas para seu e-mail.");
        } catch (error) {
            errorMsg.textContent = error.message;
            errorMsg.style.display = "block";
        }
    });
});
