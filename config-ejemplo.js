// config.js - Configuración Centralizada EPSA-Llallagua
// Copia este archivo en la raíz de tu proyecto y personalízalo según tus necesidades

export const siteConfig = {
    // Información Básica de la Empresa
    companyName: "EPSA BUSTILLO M.S",
    companyFullName: "Entidad Prestadora de Servicio de Agua potable y alcantarillado Sanitario",
    slogan: "Agua y Saneamiento para el desarrollo de Bustillo",
    foundationYear: 2002,
    
    // Información de Contacto
    contact: {
        phone: "5821669",
        email: "epsallallagua@gmail.com",
        address: "Calle 25 de Mayo, Calle Cochabamba, casita de piedra",
        whatsapp: "59160466476"
    },
    
    // Horarios de Atención
    businessHours: {
        weekdays: "08:00 - 12:00, 14:00 - 18:00",
        weekends: "Cerrado",
        note: "Lunes a Viernes: 08:00 - 12:00, 14:00 - 18:00"
    },
    
    // Ubicación y Cobertura
    location: {
        mainCity: "Llallagua",
        coverageAreas: ["Llallagua", "Catavi", "Siglo XX"],
        municipality: "Llallagua"
    },
    
    // Misión y Visión
    mission: "Proporcionar servicios de agua potable y alcantarillado sanitario a la población del Commonwealth de Bustillo, con equidad, calidad, continuidad, solidaridad y eficiencia, buscando la autosostenibilidad.",
    vision: "Ser una entidad institucionalmente consolidada, identificada con la población mediante una gestión eficiente y transparente en la prestación de servicios de agua potable y alcantarillado sanitario.",
    
    // Valores
    values: [
        "Equidad",
        "Calidad", 
        "Continuidad",
        "Solidaridad",
        "Eficiencia"
    ],
    
    // Servicios Principales
    services: [
        {
            id: "agua-potable",
            name: "Agua Potable",
            icon: "💧",
            description: "Servicio público que comprende la captación, conducción, tratamiento y almacenamiento de recursos hídricos para su potabilización, entregado a los usuarios a través de redes de distribución.",
            features: [
                "Captación y tratamiento",
                "Red de distribución",
                "Control de calidad",
                "Servicio continuo"
            ]
        },
        {
            id: "alcantarillado",
            name: "Alcantarillado Sanitario",
            icon: "🏗️",
            description: "Servicio público que comprende la recolección, tratamiento y disposición de aguas residuales en cuerpos receptores, protegiendo la salud pública y el medio ambiente.",
            features: [
                "Recolección de aguas residuales",
                "Tratamiento y disposición",
                "Mantenimiento de redes",
                "Protección ambiental"
            ]
        },
        {
            id: "facturacion-digital",
            name: "Facturación Digital",
            icon: "📱",
            description: "Servicios digitales para mayor comodidad de nuestros usuarios, incluyendo entrega digital de pré-facturas y descarga de facturas en línea.",
            features: [
                "Entrega digital por WhatsApp",
                "Descarga de facturas en línea",
                "Consulta de deudas",
                "Comunicación directa"
            ]
        }
    ],
    
    // Historia Timeline
    history: [
        {
            year: 2002,
            title: "Fundación de EPSA",
            description: "Se funda la Entidad Prestadora de Servicio de Agua potable y alcantarillado Sanitario \"EPSA BUSTILLO M.S\" como una empresa mancomunitaria social."
        },
        {
            year: 2005,
            title: "Expansión de Servicios",
            description: "Se amplía la cobertura de servicios a las tres regiones principales: Llallagua, Catavi y Siglo XX, estableciendo las bases para el crecimiento sostenible."
        },
        {
            year: 2010,
            title: "Modernización Tecnológica",
            description: "Implementación de nuevas tecnologías para el tratamiento y distribución de agua, mejorando la calidad y eficiencia del servicio."
        },
        {
            year: 2018,
            title: "Digitalización",
            description: "Lanzamiento de servicios digitales incluyendo facturación electrónica y comunicación directa con usuarios a través de WhatsApp."
        },
        {
            year: 2024,
            title: "Consolidación y Futuro",
            description: "Continuamos consolidándonos como una entidad institucionalmente sólida, comprometida con la eficiencia y transparencia en el servicio."
        }
    ],
    
    // Galería de Imágenes
    gallery: [
        {
            src: "images/represa.jpg",
            title: "Represa Principal",
            description: "Fuente de captación de agua"
        },
        {
            src: "images/planta-tratamiento.jpg",
            title: "Planta de Tratamiento",
            description: "Procesamiento de agua potable"
        },
        {
            src: "images/red-distribucion.jpg",
            title: "Red de Distribución",
            description: "Sistema de tuberías principales"
        },
        {
            src: "images/laboratorio.jpg",
            title: "Laboratorio de Calidad",
            description: "Control de calidad del agua"
        },
        {
            src: "images/oficina-principal.jpg",
            title: "Oficina Principal",
            description: "Atención al usuario"
        },
        {
            src: "images/proyecto-nuevo.jpg",
            title: "Proyectos en Desarrollo",
            description: "Expansión de servicios"
        }
    ],
    
    // Noticias
    news: [
        {
            date: "20 Feb 2024",
            title: "Ruptura en Red de Agua en Hospital Madre Obrera",
            excerpt: "Se registraron trabajos de reparación urgentes en la red de distribución de agua potable debido a una ruptura causada por maquinaria agrícola en la zona del Hospital Madre Obrera en Llallagua.",
            image: "images/WhatsApp.jpg",
            link: "#"
        },
        {
            date: "15 Feb 2024",
            title: "Visita Educativa de Estudiantes",
            excerpt: "Estudiantes de Comunicación Social de UNS XX realizaron una visita guiada a nuestras instalaciones para conocer los procesos de captación y tratamiento del agua potable.",
            image: "images/visita-estudiantes.jpg",
            link: "#"
        },
        {
            date: "10 Feb 2024",
            title: "Mantenimiento Programado en Red Principal",
            excerpt: "Se llevarán a cabo trabajos de mantenimiento preventivo en la red principal de distribución durante el fin de semana. Se apologa por las molestias ocasionadas.",
            image: "images/mantenimiento-programado.jpg",
            link: "#"
        }
    ],
    
    // Redes Sociales
    socialMedia: {
        facebook: "",
        whatsapp: "https://wa.me/59160466476",
        website: ""
    },
    
    // Enlaces Útiles
    usefulLinks: {
        downloadInvoice: "#", // Cambiar por URL real
        checkDebt: "#",
        reportIssue: "#",
        publicTenders: "#",
        clientArea: "#"
    },
    
    // Información de Desarrollador
    developer: {
        name: "Victor Ibañez Gareca",
        contact: "https://wa.me/59160466476",
        lastUpdated: "2024-11-19"
    },
    
    // Configuración del Sitio
    siteConfig: {
        title: "EPSA-Llallagua | Agua Potable y Alcantarillado",
        description: "Entidad Prestadora de Servicio de Agua potable y alcantarillado Sanitario desde 2002. Servicios de calidad en Llallagua, Catavi y Siglo XX.",
        keywords: "agua potable, alcantarillado, EPSA, Llallagua, servicios públicos, agua, saneamiento",
        language: "es",
        author: "Victor Ibañez Gareca"
    }
};

// Funciones de utilidad
export const utils = {
    // Formatear teléfono para enlaces
    formatPhone: (phone) => {
        return `tel:${phone}`;
    },
    
    // Formatear email para enlaces
    formatEmail: (email) => {
        return `mailto:${email}`;
    },
    
    // Formatear WhatsApp
    formatWhatsApp: (phone, message = "") => {
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${cleanPhone}${message ? `?text=${encodedMessage}` : ''}`;
    },
    
    // Calcular años de experiencia
    calculateExperience: (foundationYear) => {
        const currentYear = new Date().getFullYear();
        return currentYear - foundationYear;
    },
    
    // Obtener áreas de cobertura como texto
    getCoverageText: (areas) => {
        if (areas.length === 1) return areas[0];
        if (areas.length === 2) return `${areas[0]} y ${areas[1]}`;
        return `${areas.slice(0, -1).join(', ')} y ${areas[areas.length - 1]}`;
    }
};

// Configuración por defecto para fácil importación
export default siteConfig;

// Ejemplo de uso en el sitio web:
// import { siteConfig, utils } from './config.js';
// 
// // Usar en el HTML
// document.getElementById('companyName').textContent = siteConfig.companyName;
// document.getElementById('phone').textContent = siteConfig.contact.phone;
// 
// // Enlaces dinámicos
// const phoneLink = utils.formatPhone(siteConfig.contact.phone);
// const emailLink = utils.formatEmail(siteConfig.contact.email);
// const whatsappLink = utils.formatWhatsApp(siteConfig.contact.whatsapp, 'Hola, me gustaría consultar sobre sus servicios');
//
// console.log('Años de experiencia:', utils.calculateExperience(siteConfig.foundationYear));
// console.log('Áreas de cobertura:', utils.getCoverageText(siteConfig.location.coverageAreas));