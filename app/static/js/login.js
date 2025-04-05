document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const errorMsg = document.getElementById("error-msg");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            
            try {
                const formData = new URLSearchParams();
                formData.append("username", username);
                formData.append("password", password);
                
                const response = await fetch("/api/users/login/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: formData
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.detail || "Erro ao fazer login");
                }
                
                const data = await response.json();
                console.log("Login bem sucedido:", data);
                
                localStorage.setItem("token", data.access_token);
                
                const params = new URLSearchParams(window.location.search);
                const redirectUrl = params.get("redirect");
                
                if (redirectUrl) {
                    window.location.href = redirectUrl;
                } else {
                    window.location.href = "/";
                }
                
            } catch (error) {
                console.error("Erro no login:", error);
                if (errorMsg) {
                    errorMsg.textContent = error.message;
                    errorMsg.style.display = "block";
                }
            }
        });
    }
});