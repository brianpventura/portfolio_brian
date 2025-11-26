// Refatorado: modular, com debounce/throttle para melhor performance
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const navMenu = document.querySelector('.nav-links');
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const navLinks = navMenu ? Array.from(navMenu.querySelectorAll('a')) : Array.from(document.querySelectorAll('.nav-links a'));
    const sections = Array.from(document.querySelectorAll('main .seccao[id]'));

    if (!header) return; // nada a fazer sem header

    // Utilitários
    const debounce = (fn, wait = 100) => {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(null, args), wait);
        };
    };

    // throttle removed (we'll use IntersectionObserver for scrollspy)

    // Atualiza a variável CSS com a altura atual do header
    function updateHeaderHeightVar() {
        const height = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', height + 'px');
    }
    // On resize, update CSS var and recreate the observer (so rootMargin accounts for new header height)
    const debouncedUpdateHeader = debounce(() => {
        updateHeaderHeightVar();
        recreateObserver();
        updateActiveFromViewport();
    }, 120);
    updateHeaderHeightVar();
    window.addEventListener('resize', debouncedUpdateHeader);

    // Menu mobile: alterna e fecha
    function closeMenu() {
        if (navMenu && navMenu.classList.contains('nav-ativo')) {
            navMenu.classList.remove('nav-ativo');
            if (hamburgerBtn) {
                hamburgerBtn.classList.remove('ativo');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        }
    }

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('nav-ativo');
            hamburgerBtn.classList.toggle('ativo');
            const isExpanded = navMenu.classList.contains('nav-ativo');
            hamburgerBtn.setAttribute('aria-expanded', String(isExpanded));
        });
    }

    // Clique nos links: ativa classe e fecha o menu mobile (se aberto)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('link-ativo'));
            link.classList.add('link-ativo');
            closeMenu();
        });
    });

    // Scrollspy usando IntersectionObserver (mais eficiente)
    let observer = null;

    function setActiveLinkById(id) {
        navLinks.forEach(link => {
            const href = link.getAttribute('href') || '';
            if (id && href.includes('#' + id)) link.classList.add('link-ativo');
            else link.classList.remove('link-ativo');
        });
    }

    function updateActiveFromViewport() {
        // Fallback calculation (sync) — usa mesma lógica do scrollspy para estado inicial
        const headerHeight = header.offsetHeight;
        const scrollY = window.pageYOffset + headerHeight + 50;
        let activeSectionId = null;

        sections.forEach(sec => {
            const top = sec.offsetTop;
            const h = sec.offsetHeight;
            if (scrollY > top && scrollY <= top + h) activeSectionId = sec.id;
        });

        if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2) {
            activeSectionId = sections[sections.length - 1]?.id || activeSectionId;
        }

        setActiveLinkById(activeSectionId);
    }

    function handleIntersections(entries) {
        // Escolhe a entry mais visível
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length === 0) return;
        let best = visible[0];
        visible.forEach(e => {
            if (e.intersectionRatio > best.intersectionRatio) best = e;
        });
        const id = best.target.id;
        setActiveLinkById(id);
    }

    function recreateObserver() {
        if (observer) observer.disconnect();
        const headerHeight = header.offsetHeight;
        // rootMargin moves the threshold down by header height so the section enters
        // the viewport considering the fixed header; bottom margin is negative to
        // trigger earlier when section occupies central area.
        const rootMargin = `-${headerHeight}px 0px -40% 0px`;
        observer = new IntersectionObserver(handleIntersections, {
            root: null,
            rootMargin: rootMargin,
            threshold: [0.25, 0.5, 0.75]
        });
        sections.forEach(s => observer.observe(s));
    }

    // Inicializa
    recreateObserver();
    // Estado inicial
    updateActiveFromViewport();
});