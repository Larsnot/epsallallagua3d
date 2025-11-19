// Configuración de Navegación - EPSA-Llallagua
// Archivo de configuración para navegación entre páginas

const Navigation = {
    // Páginas disponibles
    pages: {
        'index.html': {
            title: 'Inicio',
            icon: '🏠',
            description: 'Página principal'
        },
        'institucion.html': {
            title: 'Institución', 
            icon: '🏢',
            description: 'Misión, visión y valores'
        },
        'servicios.html': {
            title: 'Servicios',
            icon: '⚙️',
            description: 'Servicios completos'
        },
        'historia.html': {
            title: 'Historia',
            icon: '📚',
            description: 'Timeline de eventos'
        },
        'galeria.html': {
            title: 'Galería',
            icon: '🖼️',
            description: 'Instalaciones y fotos'
        },
        'noticias.html': {
            title: 'Noticias',
            icon: '📰',
            description: 'Noticias y comunicados'
        },
        'explorar.html': {
            title: 'Explorar',
            icon: '🔍',
            description: 'Visualización 3D interactiva'
        },
        'contacto.html': {
            title: 'Contacto',
            icon: '📞',
            description: 'Formularios y contacto'
        },
        'convocatorias.html': {
            title: 'Convocatorias',
            icon: '📋',
            description: 'Licitaciones públicas'
        }
    },
    
    // Obtener página actual
    getCurrentPage() {
        const path = window.location.pathname;
        const pageName = path.split('/').pop() || 'index.html';
        return this.pages[pageName] || this.pages['index.html'];
    },
    
    // Obtener página anterior y siguiente
    getPageNeighbors() {
        const currentPageName = window.location.pathname.split('/').pop() || 'index.html';
        const pageNames = Object.keys(this.pages);
        const currentIndex = pageNames.indexOf(currentPageName);
        
        return {
            prev: currentIndex > 0 ? pageNames[currentIndex - 1] : null,
            next: currentIndex < pageNames.length - 1 ? pageNames[currentIndex + 1] : null,
            current: currentPageName
        };
    },
    
    // Crear breadcrumbs
    createBreadcrumbs() {
        const currentPage = this.getCurrentPage();
        const breadcrumbs = document.querySelector('.breadcrumb-nav');
        
        if (breadcrumbs) {
            breadcrumbs.innerHTML = `
                <a href="index.html">Inicio</a> / 
                <span>${currentPage.title}</span>
            `;
        }
    },
    
    // Actualizar página activa en navegación
    updateActiveNav() {
        const currentPageName = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPageName) {
                link.classList.add('active');
            }
        });
    },
    
    // Inicializar navegación
    init() {
        this.updateActiveNav();
        this.createBreadcrumbs();
        
        // Agregar indicadores de página en el título
        const currentPage = this.getCurrentPage();
        if (document.title.includes('EPSA-Llallagua')) {
            document.title = `${currentPage.title} | ${document.title}`;
        }
    }
};

// Inicializar navegación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();
});

// Exportar para uso global
window.Navigation = Navigation;