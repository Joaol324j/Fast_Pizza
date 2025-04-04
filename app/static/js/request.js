document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    console.log("Token encontrado:", token ? "Sim" : "Não");


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
            window.location.reload();
        });
    }
});
