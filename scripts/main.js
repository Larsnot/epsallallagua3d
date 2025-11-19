// Configuración global y utilidades
const App = {
    // Configuración
    config: {
        animationDuration: 300,
        scrollOffset: 80,
        galleryImages: [
            {
                src: 'images/represa.jpg',
                title: 'Represa Principal',
                description: 'Fuente de captación de agua'
            },
            {
                src: 'images/planta-tratamiento.jpg',
                title: 'Planta de Tratamiento',
                description: 'Procesamiento de agua potable'
            },
            {
                src: 'images/red-distribucion.jpg',
                title: 'Red de Distribución',
                description: 'Sistema de tuberías principales'
            },
            {
                src: 'images/laboratorio.jpg',
                title: 'Laboratorio de Calidad',
                description: 'Control de calidad del agua'
            },
            {
                src: 'images/oficina-principal.jpg',
                title: 'Oficina Principal',
                description: 'Atención al usuario'
            },
            {
                src: 'images/proyecto-nuevo.jpg',
                title: 'Proyectos en Desarrollo',
                description: 'Expansión de servicios'
            }
        ]
    },
    
    // Estado de la aplicación
    state: {
        isMenuOpen: false,
        currentImageIndex: 0,
        isModalOpen: false
    },
    
    // Elementos DOM cacheados
    elements: {},
    
    // Inicialización de la aplicación
    init() {
        this.cacheElements();
        this.bindEvents();
        this.initNavigation();
        this.initGallery();
        this.initForms();
        this.initScrollEffects();
        this.initQuickActions();
        console.log('EPSA Llallagua website initialized successfully');
    },
    
    // Cache de elementos DOM
    cacheElements() {
        this.elements = {
            // Navigation
            mobileMenuToggle: document.getElementById('mobileMenuToggle'),
            navbarNav: document.getElementById('navbarNav'),
            navLinks: document.querySelectorAll('.nav-link'),
            
            // Gallery
            galleryItems: document.querySelectorAll('.gallery-item'),
            imageModal: document.getElementById('imageModal'),
            modalImage: document.getElementById('modalImage'),
            modalCaption: document.getElementById('modalCaption'),
            modalClose: document.getElementById('modalClose'),
            modalPrev: document.getElementById('modalPrev'),
            modalNext: document.getElementById('modalNext'),
            viewAllPhotos: document.getElementById('viewAllPhotos'),
            
            // Forms
            contactForm: document.getElementById('contactForm'),
            
            // Quick Actions
            downloadInvoice: document.getElementById('downloadInvoice'),
            
            // Sections
            header: document.querySelector('.header'),
            hero: document.querySelector('.hero')
        };
    },
    
    // Bind de eventos
    bindEvents() {
        // Navigation events
        if (this.elements.mobileMenuToggle) {
            this.elements.mobileMenuToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }
        
        // Smooth scroll for navigation links
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });
        
        // Gallery events
        this.elements.galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => this.openImageModal(index));
        });
        
        // Modal events
        if (this.elements.modalClose) {
            this.elements.modalClose.addEventListener('click', this.closeImageModal.bind(this));
        }
        
        if (this.elements.modalPrev) {
            this.elements.modalPrev.addEventListener('click', this.showPrevImage.bind(this));
        }
        
        if (this.elements.modalNext) {
            this.elements.modalNext.addEventListener('click', this.showNextImage.bind(this));
        }
        
        // Close modal on background click
        if (this.elements.imageModal) {
            this.elements.imageModal.addEventListener('click', (e) => {
                if (e.target === this.elements.imageModal) {
                    this.closeImageModal();
                }
            });
        }
        
        // View all photos button
        if (this.elements.viewAllPhotos) {
            this.elements.viewAllPhotos.addEventListener('click', this.openFullGallery.bind(this));
        }
        
        // Form events
        if (this.elements.contactForm) {
            this.elements.contactForm.addEventListener('submit', this.handleContactForm.bind(this));
        }
        
        // Quick action events
        if (this.elements.downloadInvoice) {
            this.elements.downloadInvoice.addEventListener('click', this.handleDownloadInvoice.bind(this));
        }
        
        // Keyboard events
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Scroll events
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Window resize events
        window.addEventListener('resize', this.handleResize.bind(this));
    },
    
    // Inicialización de navegación
    initNavigation() {
        // Highlight current section in navigation
        this.updateActiveNavLink();
        
        // Smooth scroll behavior
        document.documentElement.style.scrollBehavior = 'smooth';
    },
    
    // Manejo de clic en navegación
    handleNavClick(e) {
        const href = e.target.getAttribute('href');
        
        // Solo manejar navegación interna (ancoras)
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - this.config.scrollOffset;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (this.state.isMenuOpen) {
                    this.closeMobileMenu();
                }
            }
        }
        // Para navegación entre páginas, permitir el comportamiento normal
        // (sin preventDefault, permitirá que el navegador navegue normalmente)
    },
    
    // Toggle menú móvil
    toggleMobileMenu() {
        if (this.state.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    },
    
    // Abrir menú móvil
    openMobileMenu() {
        this.state.isMenuOpen = true;
        this.elements.navbarNav.style.display = 'flex';
        this.elements.navbarNav.style.flexDirection = 'column';
        this.elements.navbarNav.style.position = 'absolute';
        this.elements.navbarNav.style.top = '100%';
        this.elements.navbarNav.style.left = '0';
        this.elements.navbarNav.style.right = '0';
        this.elements.navbarNav.style.backgroundColor = '#ffffff';
        this.elements.navbarNav.style.boxShadow = '0 4px 12px rgba(0, 92, 185, 0.08)';
        this.elements.navbarNav.style.padding = '16px';
        this.elements.navbarNav.style.zIndex = '1000';
        
        // Animate hamburger to X
        const spans = this.elements.mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    },
    
    // Cerrar menú móvil
    closeMobileMenu() {
        this.state.isMenuOpen = false;
        this.elements.navbarNav.style.display = '';
        this.elements.navbarNav.style.flexDirection = '';
        this.elements.navbarNav.style.position = '';
        this.elements.navbarNav.style.top = '';
        this.elements.navbarNav.style.left = '';
        this.elements.navbarNav.style.right = '';
        this.elements.navbarNav.style.backgroundColor = '';
        this.elements.navbarNav.style.boxShadow = '';
        this.elements.navbarNav.style.padding = '';
        this.elements.navbarNav.style.zIndex = '';
        
        // Reset hamburger animation
        const spans = this.elements.mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    },
    
    // Actualizar enlace activo de navegación
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + this.config.scrollOffset + 50;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.elements.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    },
    
    // Inicialización de galería
    initGallery() {
        // Agregar clases para animaciones
        this.elements.galleryItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('gallery-item-animated');
        });
    },
    
    // Abrir modal de imagen
    openImageModal(index) {
        this.state.currentImageIndex = index;
        this.state.isModalOpen = true;
        
        const image = this.config.galleryImages[index];
        if (image) {
            this.elements.modalImage.src = image.src;
            this.elements.modalImage.alt = image.title;
            this.elements.modalCaption.innerHTML = `<h4>${image.title}</h4><p>${image.description}</p>`;
        }
        
        this.elements.imageModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        this.elements.modalClose.focus();
    },
    
    // Cerrar modal de imagen
    closeImageModal() {
        this.state.isModalOpen = false;
        this.elements.imageModal.style.display = 'none';
        document.body.style.overflow = '';
    },
    
    // Imagen anterior en modal
    showPrevImage() {
        this.state.currentImageIndex = (this.state.currentImageIndex - 1 + this.config.galleryImages.length) % this.config.galleryImages.length;
        const image = this.config.galleryImages[this.state.currentImageIndex];
        
        this.elements.modalImage.src = image.src;
        this.elements.modalImage.alt = image.title;
        this.elements.modalCaption.innerHTML = `<h4>${image.title}</h4><p>${image.description}</p>`;
    },
    
    // Imagen siguiente en modal
    showNextImage() {
        this.state.currentImageIndex = (this.state.currentImageIndex + 1) % this.config.galleryImages.length;
        const image = this.config.galleryImages[this.state.currentImageIndex];
        
        this.elements.modalImage.src = image.src;
        this.elements.modalImage.alt = image.title;
        this.elements.modalCaption.innerHTML = `<h4>${image.title}</h4><p>${image.description}</p>`;
    },
    
    // Abrir galería completa
    openFullGallery() {
        if (this.config.galleryImages.length > 0) {
            this.openImageModal(0);
        }
    },
    
    // Manejo de eventos de teclado
    handleKeyDown(e) {
        if (this.state.isModalOpen) {
            switch (e.key) {
                case 'Escape':
                    this.closeImageModal();
                    break;
                case 'ArrowLeft':
                    this.showPrevImage();
                    break;
                case 'ArrowRight':
                    this.showNextImage();
                    break;
            }
        }
        
        // Handle mobile menu with Escape key
        if (e.key === 'Escape' && this.state.isMenuOpen) {
            this.closeMobileMenu();
        }
    },
    
    // Manejo de scroll
    handleScroll() {
        // Update active navigation link
        this.updateActiveNavLink();
        
        // Header background opacity based on scroll
        if (this.elements.header) {
            const scrollY = window.scrollY;
            const opacity = Math.min(scrollY / 100, 1);
            this.elements.header.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
            this.elements.header.style.backdropFilter = `blur(${scrollY / 10}px)`;
        }
        
        // Parallax effect for hero section
        if (this.elements.hero) {
            const scrolled = window.pageYOffset;
            const parallax = this.elements.hero.querySelector('.hero-background');
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        }
    },
    
    // Manejo de resize de ventana
    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth > 768 && this.state.isMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Update modal positioning if open
        if (this.state.isModalOpen) {
            // Modal positioning logic if needed
        }
    },
    
    // Inicialización de formularios
    initForms() {
        // Add form validation styles
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', this.validateField.bind(this));
            input.addEventListener('input', this.clearFieldError.bind(this));
        });
    },
    
    // Validación de campo individual
    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Remove existing error styling
        field.classList.remove('error');
        
        // Check for required fields
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'Este campo es requerido');
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Por favor ingresa un email válido');
                return false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value)) {
                this.showFieldError(field, 'Por favor ingresa un teléfono válido');
                return false;
            }
        }
        
        return true;
    },
    
    // Mostrar error en campo
    showFieldError(field, message) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = 'var(--error)';
        errorDiv.style.fontSize = '14px';
        errorDiv.style.marginTop = '4px';
        
        field.parentNode.appendChild(errorDiv);
    },
    
    // Limpiar error de campo
    clearFieldError(e) {
        const field = e.target;
        field.classList.remove('error');
        
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    },
    
    // Manejo de formulario de contacto
    handleContactForm(e) {
        e.preventDefault();
        
        const formData = new FormData(this.elements.contactForm);
        const data = Object.fromEntries(formData);
        
        // Validate all fields
        const fields = this.elements.contactForm.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        fields.forEach(field => {
            const event = { target: field };
            if (!this.validateField(event)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showNotification('Por favor corrige los errores en el formulario', 'error');
            return;
        }
        
        // Simulate form submission
        this.showNotification('Enviando mensaje...', 'info');
        
        setTimeout(() => {
            this.elements.contactForm.reset();
            this.showNotification('¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.', 'success');
        }, 2000);
    },
    
    // Mostrar notificación
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 3000;
            padding: 16px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            ${type === 'success' ? 'background-color: var(--success);' : ''}
            ${type === 'error' ? 'background-color: var(--error);' : ''}
            ${type === 'info' ? 'background-color: var(--primary-500);' : ''}
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.closeNotification(notification);
        });
        
        // Auto close after 5 seconds
        setTimeout(() => {
            this.closeNotification(notification);
        }, 5000);
    },
    
    // Cerrar notificación
    closeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    },
    
    // Inicialización de efectos de scroll
    initScrollEffects() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.service-card, .news-card, .tender-card, .timeline-item');
        animatedElements.forEach(el => observer.observe(el));
    },
    
    // Inicialización de acciones rápidas
    initQuickActions() {
        // Add ripple effect to buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', this.createRippleEffect.bind(this));
        });
    },
    
    // Crear efecto ripple
    createRippleEffect(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        // Add ripple animation keyframes if not already added
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
                .btn {
                    position: relative;
                    overflow: hidden;
                }
            `;
            document.head.appendChild(style);
        }
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    },
    
    // Manejo de descarga de factura
    handleDownloadInvoice(e) {
        e.preventDefault();
        
        // Simulate invoice download
        this.showNotification('Redirigiendo a la página de descarga de facturas...', 'info');
        
        // In a real implementation, this would redirect to an invoice download page
        setTimeout(() => {
            // window.location.href = '/area-cliente';
            this.showNotification('Funcionalidad de descarga de facturas próximamente disponible', 'info');
        }, 2000);
    },
    
    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Funciones adicionales para navegación entre páginas
document.addEventListener('click', (e) => {
    // Si es un enlace interno
    if (e.target.tagName === 'A' && e.target.href) {
        const link = e.target.href;
        const currentDomain = window.location.origin;
        const currentPage = window.location.pathname;
        
        // Si es un enlace interno pero diferente página
        if (link.includes(currentDomain) && link !== window.location.href) {
            // Permitir la navegación normalmente
            return;
        }
    }
});

// Funciones de utilidad para navegación
window.navigateTo = function(page) {
    window.location.href = page;
};

// Funciones de utilidad para formularios multipágina
window.validateFormMultiPage = function(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = 'var(--error)';
            isValid = false;
        } else {
            field.style.borderColor = '';
        }
    });
    
    return isValid;
};

// Export for testing purposes (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}