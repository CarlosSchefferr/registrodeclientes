document.addEventListener('DOMContentLoaded', () => {
    
    document.getElementById('redirecionar-para-inicio').addEventListener('click', () => {
        window.location.href = 'index.html'; // Substitua pelo URL da página desejada
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('redirecionar-para-login').addEventListener('click', () => {
        window.location.href = 'login.html'; // Substitua pelo URL da página de login
    });

    document.getElementById('redirecionar-para-registrar').addEventListener('click', () => {
        window.location.href = 'registrar.html'; // Substitua pelo URL da página de registro
    });

    
});


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('enderecoPrincipalBotao').addEventListener('click', function() {
        this.classList.toggle('ativo');
    });
});

