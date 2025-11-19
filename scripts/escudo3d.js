/**
 * ESCUDO 3D - Versión CDN para GitHub (CORREGIDA)
 * Funciona perfectamente en GitHub Pages y sitios web
 * 
 * INSTRUCCIONES:
 * 1. Reemplaza 'models/epsal-escudo.glb' en la línea ~667 con tu modelo
 * 2. Sube este archivo como 'scripts/escudo3d.js' en GitHub
 * 3. El modelo debe estar en la carpeta 'models/' de tu repositorio
 */

class Escudo3D {
    constructor() {
        // Configuración
        this.modelUrl = null; // URL del modelo 3D - CAMBIAR AQUÍ
        this.maxFileSize = 90 * 1024 * 1024; // 90 MB
        this.supportedFormats = ['.glb', '.gltf', '.obj', '.fbx', '.dae'];
        
        // Three.js variables
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        this.clock = null;
        this.stats = null;
        
        // Estado
        this.isLoaded = false;
        this.isLoading = false;
        this.error = null;
        
        this.init();
    }

    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.setupScene();
        this.setupLighting();
        this.setupControls();
        this.addHelpers();
        this.startRenderLoop();
        this.setupEventListeners();
        this.showLoading();
    }

    setupScene() {
        const container = document.getElementById('escudo-3d-container');
        if (!container) {
            console.error('❌ No se encontró el contenedor #escudo-3d-container');
            this.showError('Contenedor 3D no encontrado');
            return;
        }

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf5f5f5);

        // Configurar cámara
        this.camera = new THREE.PerspectiveCamera(
            75, 
            container.clientWidth / container.clientHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 0, 5);

        // Configurar renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        
        container.appendChild(this.renderer.domElement);

        // Configurar clock para animaciones
        this.clock = new THREE.Clock();
    }

    setupLighting() {
        // Luz ambiental
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Luz direccional principal
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        this.scene.add(directionalLight);

        // Luz de relleno
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-10, 0, -5);
        this.scene.add(fillLight);

        // Luz puntual para destacar
        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.set(0, 10, 10);
        this.scene.add(pointLight);
    }

    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 20;
        this.controls.maxPolarAngle = Math.PI;
        this.controls.autoRotate = false;
        this.controls.autoRotateSpeed = 2.0;
    }

    addHelpers() {
        // Stats (FPS counter)
        if (typeof Stats !== 'undefined') {
            this.stats = new Stats();
            this.stats.dom.style.position = 'absolute';
            this.stats.dom.style.top = '10px';
            this.stats.dom.style.left = '10px';
            document.getElementById('escudo-3d-container').appendChild(this.stats.dom);
        }

        // Grid helper (opcional)
        const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0xdddddd);
        gridHelper.position.y = -2;
        this.scene.add(gridHelper);
    }

    setupEventListeners() {
        // Responsive design
        window.addEventListener('resize', () => this.onWindowResize(), false);
        
        // Controles de UI
        this.setupUI();
    }

    setupUI() {
        // Botón Reset
        const resetBtn = document.getElementById('resetCamera');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetCamera());
        }

        // Checkbox Auto-rotate
        const autoRotateCheckbox = document.getElementById('autoRotate');
        if (autoRotateCheckbox) {
            autoRotateCheckbox.addEventListener('change', (e) => {
                this.controls.autoRotate = e.target.checked;
            });
        }

        // Checkbox Grid
        const gridCheckbox = document.getElementById('showGrid');
        if (gridCheckbox) {
            gridCheckbox.addEventListener('change', (e) => {
                const grid = this.scene.children.find(child => child.isGridHelper);
                if (grid) {
                    grid.visible = e.target.checked;
                }
            });
        }

        // Checkbox Stats
        const statsCheckbox = document.getElementById('showStats');
        if (statsCheckbox) {
            statsCheckbox.addEventListener('change', (e) => {
                if (this.stats) {
                    this.stats.dom.style.display = e.target.checked ? 'block' : 'none';
                }
            });
        }

        // Speed slider
        const speedSlider = document.getElementById('rotationSpeed');
        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                this.controls.autoRotateSpeed = parseFloat(e.target.value);
            });
        }
    }

    async loadModel(url) {
        if (!url) {
            this.showError('URL del modelo no proporcionada');
            return;
        }

        if (this.isLoading) {
            console.log('⚠️ Modelo ya cargándose...');
            return;
        }

        this.isLoading = true;
        this.showLoading();

        try {
            const extension = url.split('.').pop().toLowerCase();
            const loader = this.getLoader(extension);
            
            if (!loader) {
                throw new Error(`Formato no soportado: ${extension}. Formatos disponibles: ${this.supportedFormats.join(', ')}`);
            }

            console.log(`🔄 Cargando modelo: ${url} (${extension})`);

            const model = await new Promise((resolve, reject) => {
                loader.load(
                    url,
                    (object) => resolve(object),
                    (progress) => {
                        const percent = Math.round((progress.loaded / progress.total) * 100);
                        this.updateProgress(percent);
                    },
                    (error) => reject(error)
                );
            });

            // Limpiar modelo anterior si existe
            if (this.model) {
                this.scene.remove(this.model);
            }

            // Configurar el nuevo modelo
            this.model = model;
            this.scene.add(this.model);

            // Ajustar modelo al centro
            this.centerModel();
            this.fitCameraToObject();
            this.enableShadows();

            this.isLoaded = true;
            this.isLoading = false;
            this.hideLoading();
            
            console.log('✅ Modelo cargado exitosamente');
            this.showSuccess('Modelo cargado correctamente');

        } catch (error) {
            console.error('❌ Error cargando modelo:', error);
            this.isLoading = false;
            this.hideLoading();
            
            let errorMessage = 'Error cargando modelo';
            
            if (error.message.includes('404')) {
                errorMessage = 'Modelo no encontrado. Verifica la ruta del archivo.';
            } else if (error.message.includes('format')) {
                errorMessage = 'Formato de archivo no soportado.';
            } else if (error.name === 'SecurityError') {
                errorMessage = 'Error de seguridad. Verifica la configuración CORS.';
            }
            
            this.showError(errorMessage + '\n\nDetalles: ' + error.message);
        }
    }

    getLoader(extension) {
        const loaders = {
            'gltf': () => new THREE.GLTFLoader(),
            'glb': () => new THREE.GLTFLoader(),
            'obj': () => new THREE.OBJLoader(),
            'fbx': () => new THREE.FBXLoader(),
            'dae': () => new THREE.ColladaLoader()
        };

        const loaderCreator = loaders[extension];
        if (loaderCreator) {
            return loaderCreator();
        }
        
        return null;
    }

    centerModel() {
        if (!this.model) return;

        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Mover el modelo al centro
        this.model.position.sub(center);

        // Ajustar la escala si es necesario
        const maxDimension = Math.max(size.x, size.y, size.z);
        if (maxDimension > 10) {
            const scale = 10 / maxDimension;
            this.model.scale.setScalar(scale);
        }
    }

    fitCameraToObject() {
        if (!this.model) return;

        const box = new THREE.Box3().setFromObject(this.model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxSize = Math.max(size.x, size.y, size.z);
        const fitHeightDistance = maxSize / (2 * Math.atan(Math.PI * this.camera.fov / 360));
        const fitWidthDistance = fitHeightDistance / this.camera.aspect;
        const distance = Math.max(fitHeightDistance, fitWidthDistance);

        this.camera.position.copy(center);
        this.camera.position.z += distance;
        this.camera.position.y += distance * 0.5;
        this.camera.lookAt(center);

        this.controls.target.copy(center);
        this.controls.update();
    }

    enableShadows() {
        if (!this.model) return;

        this.model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }

    startRenderLoop() {
        const animate = () => {
            requestAnimationFrame(animate);

            const delta = this.clock.getDelta();

            if (this.controls) {
                this.controls.update();
            }

            if (this.stats) {
                this.stats.begin();
            }

            // Auto-rotación si está habilitada
            if (this.controls && this.controls.autoRotate && this.model) {
                this.model.rotation.y += delta * this.controls.autoRotateSpeed;
            }

            this.renderer.render(this.scene, this.camera);

            if (this.stats) {
                this.stats.end();
            }
        };

        animate();
    }

    onWindowResize() {
        const container = document.getElementById('escudo-3d-container');
        if (!container || !this.camera || !this.renderer) return;

        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }

    resetCamera() {
        if (!this.model) return;

        const box = new THREE.Box3().setFromObject(this.model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxSize = Math.max(size.x, size.y, size.z);
        const distance = maxSize * 2;

        this.camera.position.set(center.x + distance, center.y + distance * 0.5, center.z + distance);
        this.camera.lookAt(center);
        this.controls.target.copy(center);
        this.controls.update();
    }

    // UI Helper Methods
    showLoading() {
        const container = document.getElementById('escudo-3d-container');
        if (!container) return;

        let loadingDiv = container.querySelector('.loading');
        if (!loadingDiv) {
            loadingDiv = document.createElement('div');
            loadingDiv.className = 'loading';
            loadingDiv.innerHTML = `
                <div class="loading-spinner"></div>
                <div class="loading-text">Cargando modelo 3D...</div>
                <div class="loading-progress" id="loadingProgress">0%</div>
            `;
            container.appendChild(loadingDiv);
        }

        loadingDiv.style.display = 'block';
    }

    hideLoading() {
        const container = document.getElementById('escudo-3d-container');
        if (!container) return;

        const loadingDiv = container.querySelector('.loading');
        if (loadingDiv) {
            loadingDiv.style.display = 'none';
        }
    }

    updateProgress(percent) {
        const progressElement = document.getElementById('loadingProgress');
        if (progressElement) {
            progressElement.textContent = percent + '%';
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        console.error('❌ Error:', message);
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('escudo-3d-container');
        if (!container) return;

        // Remover notificación anterior
        const existingNotification = container.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Estilos
        notification.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ff4757' : type === 'success' ? '#2ed573' : '#3742fa'};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;

        // Evento para cerrar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        });

        container.appendChild(notification);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    showInitError(message) {
        const container = document.getElementById('escudo-3d-container');
        if (!container) return;

        container.innerHTML = `
            <div class="init-error">
                <h3>❌ Error de inicialización</h3>
                <p>${message}</p>
                <button onclick="location.reload()">🔄 Reintentar</button>
            </div>
        `;
    }
}

// Variables globales
let escudo3dInstance = null;

// Inicialización
function initializeEscudo3D() {
    try {
        // Configurar URL del modelo - CAMBIAR AQUÍ
        const MODEL_URL = 'models3d/escudo.glb'; // ← CAMBIAR AQUÍ TU MODELO
        console.log('🎯 URL del modelo:', MODEL_URL);
        
        // Verificar que Three.js esté disponible
        if (typeof THREE === 'undefined') {
            throw new Error('Three.js no está cargado. Verifica tu conexión a INTERNETTTTT.');
        }

        // Crear instancia del visualizador 3D
        escudo3dInstance = new Escudo3D();
        
        // Cargar modelo
        if (MODEL_URL) {
            escudo3dInstance.loadModel(MODEL_URL);
        } else {
            console.warn('⚠️ No se configuró URL del modelo');
        }
        
    } catch (error) {
        console.error('❌ Error inicializando Escudo3D:', error);
        
        // Mostrar error en el contenedor 3D
        const container = document.getElementById('escudo-3d-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h3>⚠️ Error de inicialización</h3>
                    <p><strong>${error.message}</strong></p>
                    <div class="error-actions">
                        <button onclick="location.reload()">🔄 Reintentar</button>
                        <button onclick="toggleControlPanel()">ℹ️ Ayuda</button>
                    </div>
                </div>
            `;
        }
    }
}

// Función auxiliar para mostrar/ocultar panel de ayuda
function toggleControlPanel() {
    const helpPanel = document.getElementById('control-help');
    if (helpPanel) {
        helpPanel.style.display = helpPanel.style.display === 'none' ? 'block' : 'none';
    }
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeEscudo3D);

// Exportar para uso global
window.Escudo3D = Escudo3D;
window.initializeEscudo3D = initializeEscudo3D;
