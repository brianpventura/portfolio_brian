// Inicia UM ÚNICO "ouvinte" que espera o HTML carregar
document.addEventListener('DOMContentLoaded', function () {

    // --- 1. DEFINIÇÕES PRINCIPAIS ---
    const navbarlinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('main .seccao[id]');
    const header = document.querySelector('header');
    
    // --- NOVO: Selecionar os elementos do Menu Mobile ---
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-links'); // O seu <ul>
    
    if (!header || !hamburgerBtn || !navMenu) {
        console.error("Erro: Elementos essenciais do header não encontrados.");
        return;
    }

    // --- 2. LÓGICA DO MENU MOBILE ---
    // Adiciona o "ouvinte" de clique ao hambúrguer
    hamburgerBtn.addEventListener('click', function() {
        // Alterna (liga/desliga) a classe 'nav-ativo' no <ul>
        navMenu.classList.toggle('nav-ativo');
        
        // Alterna a classe 'ativo' no botão para a animação do 'X'
        hamburgerBtn.classList.toggle('ativo');
        
        // Atualiza o aria-expanded para acessibilidade
        const isExpanded = navMenu.classList.contains('nav-ativo');
        hamburgerBtn.setAttribute('aria-expanded', isExpanded);
    });

    // --- 3. LÓGICA DE CLIQUE ---
    // (Modificada para fechar o menu mobile ao clicar num link)
    navbarlinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            
            // Remove 'link-ativo' de todos
            navbarlinks.forEach(function (LinkInterno) {
                LinkInterno.classList.remove('link-ativo');
            });
            // Adiciona 'link-ativo' ao clicado
            this.classList.add('link-ativo');
            
            // --- ATUALIZAÇÃO IMPORTANTE ---
            // Se o menu mobile (navMenu) estiver aberto, feche-o
            if (navMenu.classList.contains('nav-ativo')) {
                navMenu.classList.remove('nav-ativo');
                hamburgerBtn.classList.remove('ativo');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
            // --- FIM DA ATUALIZAÇÃO ---
        });
    });

    // --- 4. LÓGICA DA ALTURA DO HEADER ---
    function updateHeaderHeightVar() {
        const height = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', height + 'px');
    }
    updateHeaderHeightVar();
    window.addEventListener('resize', updateHeaderHeightVar);

    // --- 5. LÓGICA DE SCROLLSPY ---
    function updateActiveLinkOnScroll() {
        const headerHeight = header.offsetHeight;
        let scrollY = window.pageYOffset + headerHeight + 50;
        let activeSectionId = null;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop;

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                activeSectionId = current.getAttribute('id');
            }
        });
        
        if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2) {
            activeSectionId = sections[sections.length - 1].getAttribute('id');
        }

        navbarlinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            
            if (activeSectionId && linkHref.includes(activeSectionId)) {
                link.classList.add('link-ativo');
            } else {
                link.classList.remove('link-ativo');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLinkOnScroll);

});