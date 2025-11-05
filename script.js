// Inicia UM ÚNICO "ouvinte" que espera o HTML carregar
document.addEventListener('DOMContentLoaded', function () {

    // --- 1. DEFINIÇÕES PRINCIPAIS ---
    // (Definidas uma vez no topo)
    const navbarlinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('main .seccao[id]');
    const header = document.querySelector('header');
    if (!header) return;

    // --- 2. LÓGICA DE CLIQUE ---
    // (O seu código original, está perfeito)
    navbarlinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            navbarlinks.forEach(function (LinkInterno) {
                LinkInterno.classList.remove('link-ativo');
            });
            this.classList.add('link-ativo');
        });
    });

    // --- 3. LÓGICA DA ALTURA DO HEADER ---
    // (Definida APENAS UMA VEZ)
    function updateHeaderHeightVar() {
        const height = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', height + 'px');
    }
    updateHeaderHeightVar();
    window.addEventListener('resize', updateHeaderHeightVar);

    // --- 4. LÓGICA DE SCROLLSPY (OTIMIZADA) ---
    function updateActiveLinkOnScroll() {
        const headerHeight = header.offsetHeight;
        let scrollY = window.pageYOffset + headerHeight + 50;
        let activeSectionId = null;

        // 4a. Primeiro, apenas DESCOBRE qual secção está ativa
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop;

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                activeSectionId = current.getAttribute('id');
            }
        });
        
        // 4b. Caso especial do fim da página
        if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2) {
            activeSectionId = sections[sections.length - 1].getAttribute('id');
        }

        // 4c. Agora, fazemos UM loop (eficiente) pela lista de links
        // (que já temos na variável 'navbarlinks') para atualizar as classes.
        navbarlinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            
            // Usamos 'includes()' para verificar se o href (ex: "#sobre")
            // contém o ID ativo (ex: "sobre")
            if (activeSectionId && linkHref.includes(activeSectionId)) {
                link.classList.add('link-ativo');
            } else {
                link.classList.remove('link-ativo');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLinkOnScroll);

});