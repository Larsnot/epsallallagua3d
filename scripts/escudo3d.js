/**
 * ESCUDO 3D - Visualizador de modelos 3D para página principal
 * Carga modelos 3D por URL/ruta directa
 * Versión corregida - 2025-11-19
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
        
        console.log('🏗️ Escudo3D inicializado correctamente');
    }

    setupScene() {
        const container = document.getElementById('escudo-3d-container');
        if (!container) {
            console.error('❌ Contenedor #escudo-3d-container no encontrado');
            return;
        }

        // Configurar scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf8f9fa);

        // Configurar cámara
        const rect = container.getBoundingClientRect();
        this.camera = new THREE.PerspectiveCamera(
            75, 
            rect.width / rect.height, 
            0.1, 
            1000
        );
        this.camera.position.set(5, 5, 5);

        // Configurar renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(rect.width, rect.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        container.appendChild(this.renderer.domElement);

        // Configurar clock
        this.clock = new THREE.Clock();
        
        // Auto-rotación
        this.autoRotate = true;
        this.rotationSpeed = 0.005;
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
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);

        // Luz de acento
        const accentLight = new THREE.DirectionalLight(0x0066cc, 0.2);
        accentLight.position.set(0, 10, 5);
        this.scene.add(accentLight);
    }

    setupControls() {
        if (typeof THREE.OrbitControls === 'undefined') {
            console.warn('⚠️ OrbitControls no disponible');
            return;
        }

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.enablePan = true;
        this.controls.enableRotate = true;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 20;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;
    }

    addHelpers() {
        // Grid helper
        const gridHelper = new THREE.GridHelper(20, 20, 0xcccccc, 0xeeeeee);
        gridHelper.position.y = -2;
        gridHelper.visible = false; // Oculto por defecto
        this.scene.add(gridHelper);
        this.gridHelper = gridHelper;

        // Stats
        if (typeof Stats === 'undefined') {
            console.warn('⚠️ Stats.js no disponible');
        } else {
            this.stats = new Stats();
            this.stats.dom.style.position = 'absolute';
            this.stats.dom.style.top = '0px';
            this.stats.dom.style.left = '0px';
            this.stats.dom.style.display = 'none'; // Oculto por defecto
            
            const container = document.getElementById('escudo-3d-container');
            if (container) {
                container.appendChild(this.stats.dom);
            }
        }
    }

    async loadModel(url) {
        if (!url) {
            this.showError('URL del modelo no especificada');
            return;
        }

        if (this.isLoading) {
            console.log('⏳ Ya hay una carga en proceso...');
            return;
        }

        this.isLoading = true;
        this.isLoaded = false;
        this.error = null;
        
        this.showLoading();

        try {
            // Validar URL
            if (!this.isValidUrl(url)) {
                throw new Error('URL inválida');
            }

            console.log(`🔄 Cargando modelo desde: ${url}`);

            // Determinar el tipo de archivo y usar el loader apropiado
            const fileExtension = this.getFileExtension(url);
            
            if (!this.supportedFormats.includes(fileExtension)) {
                throw new Error(`Formato no soportado: ${fileExtension}`);
            }

            // Verificar que los loaders estén disponibles
            if (!this.areLoadersReady()) {
                throw new Error('Los loaders de Three.js no están cargados correctamente');
            }

            switch (fileExtension) {
                case '.glb':
                case '.gltf':
                    await this.loadGLTF(url);
                    break;
                case '.obj':
                    await this.loadOBJ(url);
                    break;
                case '.fbx':
                    await this.loadFBX(url);
                    break;
                case '.dae':
                    await this.loadDAE(url);
                    break;
                default:
                    throw new Error(`Formato no implementado: ${fileExtension}`);
            }

            this.isLoaded = true;
            this.hideLoading();
            this.showSuccess();
            
            console.log('✅ Modelo cargado exitosamente');
            
        } catch (error) {
            console.error('❌ Error cargando modelo:', error);
            this.error = error.message;
            this.hideLoading();
            this.showError(error.message);
        } finally {
            this.isLoading = false;
        }
    }

    areLoadersReady() {
        // Verificar que los loaders necesarios estén disponibles
        const required = ['GLTFLoader', 'OBJLoader', 'FBXLoader', 'ColladaLoader'];
        
        for (const loader of required) {
            if (typeof THREE[loader] === 'undefined') {
                console.error(`Loader ${loader} no disponible`);
                return false;
            }
        }
        
        return true;
    }

    async loadGLTF(url) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.GLTFLoader();
            
            loader.load(
                url,
                (gltf) => {
                    this.model = gltf.scene;
                    this.setupModel(this.model);
                    resolve();
                },
                (progress) => {
                    const percent = (progress.loaded / progress.total * 100).toFixed(1);
                    this.updateProgress(percent);
                },
                (error) => {
                    reject(new Error(`Error GLTF: ${error.message}`));
                }
            );
        });
    }

    async loadOBJ(url) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.OBJLoader();
            
            loader.load(
                url,
                (object) => {
                    this.model = object;
                    this.setupModel(this.model);
                    resolve();
                },
                (progress) => {
                    if (progress.total > 0) {
                        const percent = (progress.loaded / progress.total * 100).toFixed(1);
                        this.updateProgress(percent);
                    }
                },
                (error) => {
                    reject(new Error(`Error OBJ: ${error.message}`));
                }
            );
        });
    }

    async loadFBX(url) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.FBXLoader();
            
            loader.load(
                url,
                (object) => {
                    this.model = object;
                    this.setupModel(this.model);
                    resolve();
                },
                (progress) => {
                    if (progress.total > 0) {
                        const percent = (progress.loaded / progress.total * 100).toFixed(1);
                        this.updateProgress(percent);
                    }
                },
                (error) => {
                    reject(new Error(`Error FBX: ${error.message}`));
                }
            );
        });
    }

    async loadDAE(url) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.ColladaLoader();
            
            loader.load(
                url,
                (collada) => {
                    this.model = collada.scene;
                    this.setupModel(this.model);
                    resolve();
                },
                (progress) => {
                    if (progress.total > 0) {
                        const percent = (progress.loaded / progress.total * 100).toFixed(1);
                        this.updateProgress(percent);
                    }
                },
                (error) => {
                    reject(new Error(`Error DAE: ${error.message}`));
                }
            );
        });
    }

    setupModel(model) {
        // Limpiar modelo anterior
        if (this.model && this.model !== model) {
            this.scene.remove(this.model);
        }

        // Centrar y escalar el modelo
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Centrar modelo
        model.position.sub(center);
        
        // Escalar si es necesario (mantener proporción)
        const maxDimension = Math.max(size.x, size.y, size.z);
        const scaleFactor = 5 / maxDimension;
        model.scale.setScalar(scaleFactor);
        
        // Configurar sombras
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                // Mejorar material si es básico
                if (child.material && child.material.isMeshBasicMaterial) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: child.material.color,
                        map: child.material.map,
                        normalMap: child.material.normalMap,
                        roughness: 0.5,
                        metalness: 0.2
                    });
                }
            }
        });

        // Añadir a la escena
        this.scene.add(model);
        
        // Ajustar cámara
        this.adjustCameraToModel();
        
        // Auto-rotar
        this.startAutoRotation();
    }

    adjustCameraToModel() {
        if (!this.model) return;

        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const radius = Math.max(size.x, size.y, size.z) / 2;

        this.camera.position.set(center.x + radius * 2, center.y + radius, center.z + radius * 2);
        this.camera.lookAt(center);
        
        if (this.controls) {
            this.controls.target.copy(center);
            this.controls.update();
        }
    }

    startAutoRotation() {
        this.autoRotate = true;
    }

    startRenderLoop() {
        const animate = () => {
            requestAnimationFrame(animate);

            const delta = this.clock.getDelta();

            // Auto-rotación del modelo
            if (this.model && this.autoRotate) {
                this.model.rotation.y += this.rotationSpeed;
            }

            // Actualizar controles
            if (this.controls) {
                this.controls.update();
            }

            // Renderizar
            if (this.renderer && this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }

            // Actualizar stats
            if (this.stats) {
                this.stats.update();
            }
        };

        animate();
    }

    setupEventListeners() {
        // Redimensionar ventana
        window.addEventListener('resize', () => this.onWindowResize());

        // Controles de interfaz
        this.setupUIEvents();
    }

    setupUIEvents() {
        // Botón de estadísticas
        const statsToggle = document.getElementById('stats-toggle');
        if (statsToggle) {
            statsToggle.addEventListener('click', () => this.toggleStats());
        }

        // Botón de grid
        const gridToggle = document.getElementById('grid-toggle');
        if (gridToggle) {
            gridToggle.addEventListener('click', () => this.toggleGrid());
        }

        // Control de auto-rotación
        const autoRotateToggle = document.getElementById('auto-rotate-toggle');
        if (autoRotateToggle) {
            autoRotateToggle.addEventListener('change', (e) => {
                this.autoRotate = e.target.checked;
                if (this.controls) {
                    this.controls.autoRotate = this.autoRotate;
                }
            });
        }

        // Control de velocidad de rotación
        const speedSlider = document.getElementById('rotation-speed');
        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                this.rotationSpeed = parseFloat(e.target.value) / 100;
            });
        }

        // Botón resetear vista
        const resetView = document.getElementById('reset-view');
        if (resetView) {
            resetView.addEventListener('click', () => this.resetView());
        }
    }

    onWindowResize() {
        const container = document.getElementById('escudo-3d-container');
        if (!container || !this.camera || !this.renderer) return;

        const rect = container.getBoundingClientRect();
        
        this.camera.aspect = rect.width / rect.height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(rect.width, rect.height);
    }

    toggleStats() {
        if (this.stats && this.stats.dom) {
            this.stats.dom.style.display = 
                this.stats.dom.style.display === 'none' ? 'block' : 'none';
        }
    }

    toggleGrid() {
        if (this.gridHelper) {
            this.gridHelper.visible = !this.gridHelper.visible;
        }
    }

    resetView() {
        this.adjustCameraToModel();
        if (this.controls) {
            this.controls.reset();
        }
    }

    showLoading() {
        const container = document.getElementById('escudo-3d-container');
        if (container) {
            container.classList.add('loading');
        }
    }

    hideLoading() {
        const container = document.getElementById('escudo-3d-container');
        if (container) {
            container.classList.remove('loading');
        }
    }

    showError(message) {
        const container = document.getElementById('escudo-3d-container');
        if (container) {
            container.innerHTML = `
                <div class="model-error">
                    <div class="error-icon">⚠️</div>
                    <h3>Error al cargar modelo</h3>
                    <p>${message}</p>
                    <div class="error-actions">
                        <button onclick="escudo3dInstance.loadModel('${this.modelUrl}')" class="btn-retry">
                            🔄 Reintentar
                        </button>
                    </div>
                </div>
            `;
        }
    }

    showSuccess() {
        const container = document.getElementById('escudo-3d-container');
        if (container) {
            container.classList.add('loaded');
        }
    }

    updateProgress(percent) {
        // Si hay un indicador de progreso, actualizarlo
        const progressBar = document.querySelector('.loading-progress');
        if (progressBar) {
            progressBar.style.width = percent + '%';
        }
    }

    getFileExtension(url) {
        const match = url.toLowerCase().match(/\.[^.]+$/);
        return match ? match[0] : '';
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            // Si no es una URL absoluta, verificar si es una ruta relativa válida
            return /^[.\w\-/]+\.[a-zA-Z]{2,}$/.test(string) || 
                   string.startsWith('./') || 
                   string.startsWith('../') ||
                   string.startsWith('/');
        }
    }

    // Método público para cargar un nuevo modelo
    loadNewModel(url) {
        if (url && url !== this.modelUrl) {
            this.modelUrl = url;
            this.loadModel(url);
        }
    }
}

// Variables globales
let escudo3dInstance = null;

// Cargar dependencias de Three.js y inicializar
async function initializeEscudo3D() {
    try {
        // Verificar si Three.js ya está cargado
        if (typeof THREE !== 'undefined' && typeof THREE.GLTFLoader !== 'undefined') {
            console.log('✅ Three.js ya está cargado');
            await createEscudo3DInstance();
            return;
        }

        console.log('🔄 Cargando Three.js...');
        
        // Script principal de Three.js
        const threeScript = document.createElement('script');
        threeScript.src = 'https://unpkg.com/three@0.158.0/build/three.min.js';
        
        // Script de OrbitControls
        const controlsScript = document.createElement('script');
        controlsScript.src = 'https://unpkg.com/three@0.158.0/examples/js/controls/OrbitControls.js';
        
        // Script de GLTFLoader
        const gltfScript = document.createElement('script');
        gltfScript.src = 'https://unpkg.com/three@0.158.0/examples/js/loaders/GLTFLoader.js';
        
        // Script de OBJLoader
        const objScript = document.createElement('script');
        objScript.src = 'https://unpkg.com/three@0.158.0/examples/js/loaders/OBJLoader.js';
        
        // Script de FBXLoader
        const fbxScript = document.createElement('script');
        fbxScript.src = 'https://unpkg.com/three@0.158.0/examples/js/loaders/FBXLoader.js';
        
        // Script de ColladaLoader
        const daeScript = document.createElement('script');
        daeScript.src = 'https://unpkg.com/three@0.158.0/examples/js/loaders/ColladaLoader.js';
        
        // Script de Stats
        const statsScript = document.createElement('script');
        statsScript.src = 'https://unpkg.com/stats.js@0.17.0/build/stats.min.js';
        
        // Cargar scripts en orden
        const scripts = [threeScript, controlsScript, gltfScript, objScript, fbxScript, daeScript, statsScript];
        
        for (let i = 0; i < scripts.length; i++) {
            await new Promise((resolve, reject) => {
                const script = scripts[i];
                script.onload = resolve;
                script.onerror = () => {
                    console.error(`Error cargando: ${script.src}`);
                    resolve(); // Continuar aunque algunos fallen
                };
                document.head.appendChild(script);
            });
            console.log(`✅ Cargado: ${script.src}`);
        }
        
        await createEscudo3DInstance();
        
    } catch (error) {
        console.error('❌ Error inicializando Escudo3D:', error);
        showInitError(error.message);
    }
}

async function createEscudo3DInstance() {
    try {
        // Configurar URL del modelo - CAMBIAR AQUÍ
        const MODEL_URL = 'models3d/escudo.glb'; // ← CAMBIAR AQUÍ TU MODELO
        
        escudo3dInstance = new Escudo3D();
        escudo3dInstance.modelUrl = MODEL_URL;
        
        // Cargar el modelo automáticamente
        setTimeout(() => {
            escudo3dInstance.loadModel(MODEL_URL);
        }, 500);
        
    } catch (error) {
        console.error('❌ Error creando instancia:', error);
        showInitError(error.message);
    }
}

function showInitError(message) {
    const container = document.getElementById('escudo-3d-container');
    if (container) {
        container.innerHTML = `
            <div class="model-error">
                <div class="error-icon">❌</div>
                <h3>Error de inicialización</h3>
                <p>${message}</p>
                <p><strong>Verifica tu conexión a internet</strong></p>
            </div>
        `;
    }
}

// Inicializar cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', initializeEscudo3D);

// También intentar inicializar si el DOM ya está listo
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initializeEscudo3D();
}

// Exportar para uso global
window.Escudo3D = Escudo3D;
window.escudo3dInstance = () => escudo3dInstance;