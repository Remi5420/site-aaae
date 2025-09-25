window.onload = () => {
    const pageSections = document.querySelectorAll('.page-section');
    const projectItems = document.querySelectorAll('.project-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const navMain = document.getElementById('nav-main');
    const navHome = document.getElementById('nav-home');

    // Fonction pour afficher une page spécifique
    const showPage = (pageId) => {
        pageSections.forEach(section => {
            if (section.id === pageId) {
                section.classList.remove('hidden');
                section.classList.add('flex', 'flex-col');
            } else {
                section.classList.add('hidden');
                section.classList.remove('flex', 'flex-col');
            }
        });
        
        // Gère l'affichage des menus de navigation
        if (pageId === 'home') {
            navMain.classList.add('hidden');
            if (navHome) navHome.classList.remove('hidden');
        } else {
            navMain.classList.remove('hidden');
            if (navHome) navHome.classList.add('hidden');
        }
    };

    // Fonction pour mettre en évidence le lien de navigation actif
    const setActiveLink = (pageId) => {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.dataset.page === pageId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    // Fonction pour filtrer les projets
    const filterProjects = (category) => {
        projectItems.forEach(item => {
            const projectCategory = item.dataset.category;
            if (category === 'all' || projectCategory === category) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    };

    // Écouteur de clics pour les boutons de filtre
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false'); // Met à jour l'attribut ARIA
            });
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true'); // Met à jour l'attribut ARIA

            const filter = button.dataset.filter;
            filterProjects(filter);
        });
    });

    // Écouteur de clics pour la navigation des pages
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('[data-page]');
        if (link) {
            e.preventDefault();
            const targetPage = link.dataset.page;
            window.location.hash = targetPage;
            showPage(targetPage);
            setActiveLink(targetPage);
        }
    });

    // Fonction pour initialiser tous les carrousels de la page
    const initCarousels = () => {
        document.querySelectorAll('.carousel-container').forEach(container => {
            const wrapper = container.querySelector('.carousel-wrapper');
            const prevBtn = container.querySelector('[data-direction="prev"]');
            const nextBtn = container.querySelector('[data-direction="next"]');
            
            // Correction pour s'assurer que itemWidth est calculé correctement après que la page soit visible
            const updateItemWidth = () => wrapper.offsetWidth;

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    const itemWidth = updateItemWidth();
                    wrapper.scrollBy({ left: itemWidth, behavior: 'smooth' });
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    const itemWidth = updateItemWidth();
                    wrapper.scrollBy({ left: -itemWidth, behavior: 'smooth' });
                });
            }
            
            // Logique pour le balayage tactile et le glisser-déposer à la souris
            let isDragging = false;
            let startX = 0;
            let scrollLeft = 0;

            wrapper.addEventListener('mousedown', (e) => {
                isDragging = true;
                startX = e.pageX - wrapper.offsetLeft;
                scrollLeft = wrapper.scrollLeft;
            });
            wrapper.addEventListener('mouseleave', () => { isDragging = false; });
            wrapper.addEventListener('mouseup', () => { isDragging = false; });
            wrapper.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                const x = e.pageX - wrapper.offsetLeft;
                const walk = (x - startX) * 1.5;
                wrapper.scrollLeft = scrollLeft - walk;
            });

            wrapper.addEventListener('touchstart', (e) => {
                isDragging = true;
                startX = e.touches[0].pageX - wrapper.offsetLeft;
                scrollLeft = wrapper.scrollLeft;
            });
            wrapper.addEventListener('touchend', () => { isDragging = false; });
            wrapper.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                const x = e.touches[0].pageX - wrapper.offsetLeft;
                const walk = (x - startX) * 1.5;
                wrapper.scrollLeft = scrollLeft - walk;
            });
        });
    };

    // Gère les boutons retour/avance du navigateur
    window.addEventListener('popstate', () => {
        const currentPage = window.location.hash.substring(1) || 'home';
        showPage(currentPage);
        setActiveLink(currentPage);
        initCarousels();
    });

    // Affiche la page par défaut au chargement
    const initialPage = window.location.hash.substring(1) || 'home';
    showPage(initialPage);
    setActiveLink(initialPage);
    initCarousels();
    filterProjects('all');
};
