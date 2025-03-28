document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    const loginItem = document.querySelector("li a[href='/login']").parentElement;
    const registerItem = document.querySelector("li a[href='/register']").parentElement;
    const logoutItem = document.querySelector("li a[href='/logout']").parentElement;
    const cardapioItem = document.querySelector("li a[href='#']").parentElement;
    const pedidosItem = document.querySelectorAll("li a[href='#']")[1].parentElement;
    const promocoesItem = document.querySelectorAll("li a[href='#']")[2].parentElement;

    if (token) {
        loginItem.style.display = "none";
        registerItem.style.display = "none";
        logoutItem.style.display = "block"; 
        cardapioItem.style.display = "block";
        pedidosItem.style.display = "block";
        promocoesItem.style.display = "block";
    } else {
        loginItem.style.display = "block";
        registerItem.style.display = "block";
        logoutItem.style.display = "none"; 
        cardapioItem.style.display = "none";
        pedidosItem.style.display = "none";
        promocoesItem.style.display = "none";
    }

    logoutItem.addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.removeItem("token");
        window.location.reload(); 
    });
});
