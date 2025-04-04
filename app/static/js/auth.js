const protectedRoutes = ['/menu', '/pedidos', '/promocoes'];

function isProtectedRoute() {
    const currentPath = window.location.pathname;
    return protectedRoutes.includes(currentPath);
}

function isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
}

function redirectToLogin() {
    const currentPath = window.location.pathname;
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Verificando autenticação...');
    
    if (isProtectedRoute() && !isAuthenticated()) {
        console.log('Rota protegida detectada e usuário não autenticado');
        redirectToLogin();
    }
});
