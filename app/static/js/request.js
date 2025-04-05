document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    console.log("Token encontrado:", token ? "Sim" : "Não");
    if (token) {
        console.log("Primeiros 10 caracteres do token:", token.substring(0, 10) + "...");
    }

    const loginItem = document.querySelector("li a[href='/login']")?.parentElement;
    const registerItem = document.querySelector("li a[href='/register']")?.parentElement;
    const logoutItem = document.querySelector("li a[href='/logout']")?.parentElement;
    const cardapioItem = document.querySelector("li a[href='/menu']")?.parentElement;
    const pedidosItem = document.querySelector("li a[href='/pedidos']")?.parentElement;
    const promocoesItem = document.querySelector("li a[href='/promocoes']")?.parentElement;

    console.log("Elementos encontrados:", {
        login: !!loginItem,
        register: !!registerItem,
        logout: !!logoutItem,
        cardapio: !!cardapioItem,
        pedidos: !!pedidosItem,
        promocoes: !!promocoesItem
    });

    function updateMenuVisibility(isLoggedIn) {
        if (loginItem) loginItem.style.display = isLoggedIn ? "none" : "block";
        if (registerItem) registerItem.style.display = isLoggedIn ? "none" : "block";
        if (logoutItem) logoutItem.style.display = isLoggedIn ? "block" : "none";
        if (cardapioItem) cardapioItem.style.display = isLoggedIn ? "block" : "none";
        if (pedidosItem) pedidosItem.style.display = isLoggedIn ? "block" : "none";
        if (promocoesItem) promocoesItem.style.display = isLoggedIn ? "block" : "none";
    }

    updateMenuVisibility(!!token);

    if (logoutItem) {
        logoutItem.addEventListener("click", function (event) {
            event.preventDefault();
            localStorage.removeItem("token");
            console.log("Logout realizado");
            window.location.href = "/login";
        });
    }
    
    const originalFetch = window.fetch;
    window.fetch = async function(resource, options = {}) {
        if (token && (resource.toString().includes('/api/') || resource.toString().startsWith('/api/'))) {
            const newOptions = { ...options };
            newOptions.headers = newOptions.headers || {};
            
            if (!newOptions.headers['Authorization']) {
                newOptions.headers['Authorization'] = `Bearer ${token}`;
                console.log(`Adicionando token ao request para: ${resource}`);
            }
            
            return originalFetch(resource, newOptions)
                .then(response => {
                    if (response.status === 401) {
                        console.error(`Erro de autenticação (401) em: ${resource}`);
                        if (window.location.pathname !== '/login') {
                            window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
                        }
                    }
                    return response;
                })
                .catch(error => {
                    console.error(`Erro na requisição para ${resource}:`, error);
                    throw error;
                });
        }
        
        return originalFetch(resource, options);
    };
});
