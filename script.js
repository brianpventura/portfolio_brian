document.addEventListener('DOMContentLoaded', function () {
    const navbarlinks = document.querySelectorAll('.nav-links a');

    navbarlinks.forEach(function (link) {
        link.addEventListener('click', function (e) {

            navbarlinks.forEach(function (LinkInterno) {
                LinkInterno.classList.remove('link-ativo');
            });
            this.classList.add('link-ativo');
        });
    });

    // --- Ajustar padding-top do body dinamicamente para evitar que o conteúdo
    // fique por baixo do header fixo quando a altura do header muda (ex.: em
    // ecrãs pequenos, quando a navbar quebra em 2 linhas).
    function updateHeaderHeightVar() {
        const header = document.querySelector('header');
        if (!header) return;
        const height = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', height + 'px');
    }

    // Atualiza no load e quando a janela é redimensionada.
    updateHeaderHeightVar();
    window.addEventListener('resize', updateHeaderHeightVar);

    // --- LÓGICA DE SCROLLSPY ---

    // 1. Apanha todas as secções que têm um ID
    const sections = document.querySelectorAll('main .seccao[id]');

    // 2. Cria a função que será executada a cada evento de scroll
    function updateActiveLinkOnScroll() {
        // 3. Pega a altura do header
        const headerHeight = document.querySelector('header').offsetHeight;
        // 4. Posição de scroll atual + altura do header + uma folga de 50px
        let scrollY = window.pageYOffset + headerHeight + 50;

        // 5. Itera todas as secções
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop;
            let sectionId = current.getAttribute('id');

            // 6. Verifica se a posição de scroll do utilizador está *dentro* desta secção
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                // Remove o 'link-ativo' de todos os links da navbar
                navbarlinks.forEach(link => link.classList.remove('link-ativo'));

                // Encontra o link da navbar correspondente e adiciona o 'link-ativo'
                // (Ex: encontra <a href="#sobre"> quando a secção "sobre" está ativa)
                const activeLink = document.querySelector('.nav-links a[href*=' + sectionId + ']');
                if (activeLink) {
                    activeLink.classList.add('link-ativo');
                }
            }
        });
        // 7. CASO ESPECIAL: Fim da página
        // Se o utilizador rolar até ao fim (e a secção de contacto for curta),
        // força o último link a ficar ativo.
        if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2) { // 2px de tolerância
            navbarlinks.forEach(link => link.classList.remove('link-ativo'));
            const lastLink = navbarlinks[navbarlinks.length - 1]; // O último link da lista
            if (lastLink) {
                lastLink.classList.add('link-ativo');
            }
        }
    }

    // 8. "Ouve" o evento de scroll da janela e executa a função
    window.addEventListener('scroll', updateActiveLinkOnScroll);


    // --- LÓGICA DA ALTURA DO HEADER (O seu código original - está ótimo) ---
    // (Isto garante que o padding-top do body se ajusta ao header)
    function updateHeaderHeightVar() {
        const header = document.querySelector('header');
        if (!header) return;
        const height = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', height + 'px');
    }

    updateHeaderHeightVar();
    window.addEventListener('resize', updateHeaderHeightVar);
});