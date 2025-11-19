/**
 * ESCUDO 3D - Versión ULTRA ROBUSTA para GitHub
 * Sin errores de carga, funciona en cualquier situación
 * 
 * CAMBIO DE MODELO:
 * En la línea 11, cambia: this.modelUrl = 'models/epsal-escudo.glb';
 * Por: this.modelUrl = 'models/TU-MODELO-3D.glb';
 */

class Escudo3D {
    constructor() {
        console.log('🎯 Escudo3D: Constructor iniciado');
        this.modelUrl = 'models3d/escudo.glb'; // ← CAMBIAR AQUÍ TU MODELO
        this.maxFileSize = 90 * 1024 * 1024; // 90 MB
        
        // Three.js variables
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        this.clock = null;
        
        // Estado
        this.isLoaded = false;
        this.isLoading = false;
        
        this.init();
    }

    init() {
        console.log('🎯 Escudo3D: Iniciando...');
        
        // Verificar que el contenedor existe
        const container = document.getElementById('escudo-3d-container');
        if (!container) {
            console.error('❌ Contenedor #escudo-3d-container no encontrado');
            return;
        }
        
        console.log('✅ Contenedor encontrado');
        
        // Esperar a que Three.js esté disponible
        this.waitForThreeJS(() => {
            console.log('✅ Three.js disponible, configurando escena...');
            this.setup();
        });
    }

    waitForThreeJS(callback) {
        let attempts = 0;
        const maxAttempts = 100;
        
        const checkThreeJS = () => {
            attempts++;
            
            console.log(`🔄 Verificando Three.js (intento ${attempts})...`);
            console.log(`THREE disponible: ${typeof THREE !== 'undefined'}`);
            console.log(`GLTFLoader disponible: ${typeof THREE !== 'undefined' && typeof THREE.GLTFLoader !== 'undefined'}`);
            
            if (typeof THREE !== 'undefined' && typeof THREE.GLTFLoader !== 'undefined') {
                console.log('✅ Three.js y GLTFLoader disponibles');
                callback();
            } else if (attempts >= maxAttempts) {
                console.error('❌ Three.js no se cargó después de muchos intentos');
                this.showError('Three.js no se cargó. Verifica tu conexión a internet e intenta recargar.');
                
                // Mostrar mensaje de error en la página
                const container = document.getElementById('escudo-3d-container');
                if (container) {
                    container.innerHTML = `
                        <div style="
                            display: flex; 
                            flex-direction: column; 
                            align-items: center; 
                            justify-content: center; 
                            height: 100%; 
                            text-align: center; 
                            padding: 40px;
                            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                            color: white;
                            font-family: Arial, sans-serif;
                        ">
                            <h2 style="margin: 0 0 20px 0;">❌ Error de Conexión</h2>
                            <p style="margin: 0 0 20px 0; font-size: 1.1em;">Three.js no se pudo cargar correctamente.</p>
                            <div style="margin: 20px 0;">
                                <button onclick="location.reload()" style="
                                    background: white; 
                                    color: #333; 
                                    border: none; 
                                    padding: 12px 24px; 
                                    border-radius: 25px; 
                                    font-size: 16px; 
                                    cursor: pointer; 
                                    font-weight: bold;
                                    margin: 0 10px;
                                ">🔄 Recargar Página</button>
                                <button onclick="testInternet()" style="
                                    background: rgba(255,255,255,0.2); 
                                    color: white; 
                                    border: 2px solid white; 
                                    padding: 12px 24px; 
                                    border-radius: 25px; 
                                    font-size: 16px; 
                                    cursor: pointer; 
                                    font-weight: bold;
                                    margin: 0 10px;
                                ">🌐 Probar Conexión</button>
                            </div>
                            <div style="font-size: 0.9em; opacity: 0.8; margin-top: 20px;">
                                Si el problema persiste, verifica tu conexión a internet
                            </div>
                        </div>
                    `;
                }
            } else {
                setTimeout(checkThreeJS, 100);
            }
        };
        
        checkThreeJS();
    }

    setup() {
        try {
            this.setupScene();
            this.setupLighting();
            this.setupControls();
            this.startRenderLoop();
            this.setupUI();
            this.loadModel(this.modelUrl);
            console.log('✅ Configuración completa');
        } catch (error) {
            console.error('❌ Error en setup:', error);
            this.showError('Error configurando la vista 3D: ' + error.message);
        }
    }

    setupScene() {
        const container = document.getElementById('escudo-3d-container');
        if (!container) {
            throw new Error('Contenedor no encontrado');
        }

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf5f5f5);

        this.camera = new THREE.PerspectiveCamera(
            75, 
            container.clientWidth / container.clientHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 0, 5);

        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        container.appendChild(this.renderer.domElement);
        this.clock = new THREE.Clock();
        
        console.log('✅ Escena configurada');
    }

    setupLighting() {
        // Luz ambiental
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Luz direccional
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        this.scene.add(directionalLight);
        
        console.log('✅ Iluminación configurada');
    }

    setupControls() {
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.minDistance = 1;
            this.controls.maxDistance = 20;
            this.controls.autoRotate = false;
            console.log('✅ Controles configurados');
        } else {
            console.warn('⚠️ OrbitControls no disponible');
        }
    }

    startRenderLoop() {
        const animate = () => {
            requestAnimationFrame(animate);

            const delta = this.clock.getDelta();

            if (this.controls) {
                this.controls.update();
            }

            this.renderer.render(this.scene, this.camera);
        };

        animate();
        console.log('✅ Bucle de render iniciado');
    }

    setupUI() {
        // Reset button
        const resetBtn = document.getElementById('resetCamera');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetCamera());
        }

        // Auto-rotate checkbox
        const autoRotateCheckbox = document.getElementById('autoRotate');
        if (autoRotateCheckbox && this.controls) {
            autoRotateCheckbox.addEventListener('change', (e) => {
                this.controls.autoRotate = e.target.checked;
            });
        }
        
        console.log('✅ UI configurada');
    }

    async loadModel(url) {
        if (!url) {
            console.error('❌ URL del modelo no proporcionada');
            return;
        }

        if (this.isLoading) {
            console.log('⚠️ Modelo ya cargándose...');
            return;
        }

        this.isLoading = true;
        this.showLoading();

        try {
            console.log(`🔄 Cargando modelo: ${url}`);
            
            // Verificar extensión
            const extension = url.split('.').pop().toLowerCase();
            console.log(`📁 Extensión detectada: ${extension}`);
            
            const loader = this.getLoader(extension);
            if (!loader) {
                throw new Error(`Formato no soportado: ${extension}. Formatos disponibles: .glb, .gltf, .obj, .fbx, .dae`);
            }

            console.log(`🔄 Loader creado para: ${extension}`);

            const model = await new Promise((resolve, reject) => {
                loader.load(
                    url,
                    (object) => {
                        console.log('✅ Modelo cargado exitosamente');
                        resolve(object);
                    },
                    (progress) => {
                        const percent = Math.round((progress.loaded / progress.total) * 100);
                        this.updateProgress(percent);
                        console.log(`📊 Progreso: ${percent}%`);
                    },
                    (error) => {
                        console.error('❌ Error en callback de carga:', error);
                        reject(error);
                    }
                );
            });

            // Limpiar modelo anterior
            if (this.model) {
                this.scene.remove(this.model);
                console.log('🗑️ Modelo anterior removido');
            }

            // Configurar nuevo modelo
            this.model = model;
            this.scene.add(this.model);
            console.log('🎯 Modelo agregado a la escena');

            this.centerModel();
            this.fitCameraToObject();
            this.enableShadows();

            this.isLoaded = true;
            this.isLoading = false;
            this.hideLoading();
            
            console.log('✅ Modelo completamente configurado');
            this.showSuccess('¡Modelo cargado correctamente!');

        } catch (error) {
            console.error('❌ Error cargando modelo:', error);
            this.isLoading = false;
            this.hideLoading();
            
            let errorMessage = 'Error cargando modelo: ';
            
            if (error.message.includes('404')) {
                errorMessage = 'Modelo no encontrado. Verifica que el archivo existe en la carpeta models/';
            } else if (error.message.includes('format')) {
                errorMessage = 'Formato de archivo no soportado.';
            } else if (error.message.includes('CORS')) {
                errorMessage = 'Error de CORS. Verifica la configuración del servidor.';
            } else {
                errorMessage = error.message;
            }
            
            console.error('💬 Mostrando error:', errorMessage);
            this.showError(errorMessage);
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

        const loader = loaders[extension];
        if (loader) {
            console.log(`📦 Loader encontrado para: ${extension}`);
            return loader();
        } else {
            console.error(`❌ No hay loader para: ${extension}`);
            return null;
        }
    }

    centerModel() {
        if (!this.model) return;

        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        
        this.model.position.sub(center);
        
        const size = box.getSize(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);
        if (maxDimension > 10) {
            const scale = 10 / maxDimension;
            this.model.scale.setScalar(scale);
            console.log(`🔄 Modelo escalado a: ${scale}`);
        }
    }

    fitCameraToObject() {
        if (!this.model) return;

        const box = new THREE.Box3().setFromObject(this.model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxSize = Math.max(size.x, size.y, size.z);
        const distance = maxSize * 2;

        this.camera.position.copy(center);
        this.camera.position.z += distance;
        this.camera.position.y += distance * 0.5;
        this.camera.lookAt(center);

        if (this.controls) {
            this.controls.target.copy(center);
            this.controls.update();
        }
        
        console.log('🎯 Cámara ajustada al modelo');
    }

    enableShadows() {
        if (!this.model) return;

        this.model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        
        console.log('🌟 Sombras habilitadas');
    }

    resetCamera() {
        if (!this.model) return;

        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxSize = Math.max(size.x, size.y, size.z);
        const distance = maxSize * 2;

        this.camera.position.set(center.x + distance, center.y + distance * 0.5, center.z + distance);
        this.camera.lookAt(center);

        if (this.controls) {
            this.controls.target.copy(center);
            this.controls.update();
        }
        
        console.log('🔄 Cámara restaurada');
    }

    // UI Helper Methods
    showLoading() {
        const container = document.getElementById('escudo-3d-container');
        if (!container) return;

        let loadingDiv = container.querySelector('.loading');
        if (!loadingDiv) {
            loadingDiv = document.createElement('div');
            loadingDiv.className = 'loading';
            loadingDiv.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: rgba(0,0,0,0.8);
                color: white;
                z-index: 1000;
                font-family: Arial, sans-serif;
            `;
            loadingDiv.innerHTML = `
                <div style="
                    width: 50px;
                    height: 50px;
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #3498db;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 20px;
                "></div>
                <div style="font-size: 18px; margin-bottom: 10px;">Cargando modelo 3D...</div>
                <div id="loadingProgress" style="font-size: 16px; color: #3498db;">0%</div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            `;
            container.appendChild(loadingDiv);
        }
    }

    hideLoading() {
        const container = document.getElementById('escudo-3d-container');
        if (!container) return;

        const loadingDiv = container.querySelector('.loading');
        if (loadingDiv) {
            loadingDiv.remove();
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

        const existingNotification = container.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
            z-index: 1001;
            max-width: 350px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.4;
            animation: slideInRight 0.3s ease-out;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            float: right;
            margin-left: 10px;
            padding: 0;
            width: 24px;
            height: 24px;
            line-height: 20px;
            text-align: center;
        `;

        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        const messageSpan = document.createElement('span');
        messageSpan.textContent = message;
        
        notification.appendChild(closeBtn);
        notification.appendChild(messageSpan);

        // Añadir estilos de animación
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        container.appendChild(notification);

        // Auto-remove después de 6 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 6000);
    }
}

// Función para probar internet
function testInternet() {
    fetch('https://unpkg.com/three@0.160.0/build/three.min.js')
        .then(response => {
            if (response.ok) {
                alert('✅ Conexión OK. Recargando página...');
                location.reload();
            } else {
                alert('❌ Problema de conexión. Intenta más tarde.');
            }
        })
        .catch(() => {
            alert('❌ Sin conexión a internet. Verifica tu conexión.');
        });
}

// Variables globales
let escudo3dInstance = null;

// Inicialización principal
function initializeEscudo3D() {
    console.log('🚀 Inicializando Escudo3D...');
    
    try {
        // Verificar que el contenedor existe
        const container = document.getElementById('escudo-3d-container');
        if (!container) {
            console.error('❌ Contenedor #escudo-3d-container no encontrado');
            return;
        }
        
        console.log('✅ Contenedor encontrado, creando instancia...');
        
        // Crear instancia
        escudo3dInstance = new Escudo3D();
        
        console.log('✅ Escudo3D inicializado correctamente');
        
    } catch (error) {
        console.error('❌ Error fatal:', error);
        
        const container = document.getElementById('escudo-3d-container');
        if (container) {
            container.innerHTML = `
                <div style="
                    padding: 40px; 
                    text-align: center; 
                    color: #e74c3c;
                    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                    color: white;
                    font-family: Arial, sans-serif;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                ">
                    <h2 style="margin: 0 0 20px 0;">❌ Error Fatal</h2>
                    <p style="margin: 0 0 20px 0; font-size: 1.1em;"><strong>${error.message}</strong></p>
                    <div>
                        <button onclick="location.reload()" style="
                            background: white; 
                            color: #333; 
                            border: none; 
                            padding: 12px 24px; 
                            border-radius: 25px; 
                            font-size: 16px; 
                            cursor: pointer; 
                            font-weight: bold;
                            margin: 0 10px;
                        ">🔄 Recargar</button>
                        <button onclick="testInternet()" style="
                            background: rgba(255,255,255,0.2); 
                            color: white; 
                            border: 2px solid white; 
                            padding: 12px 24px; 
                            border-radius: 25px; 
                            font-size: 16px; 
                            cursor: pointer; 
                            font-weight: bold;
                            margin: 0 10px;
                        ">🌐 Probar Internet</button>
                    </div>
                </div>
            `;
        }
    }
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM cargado, inicializando...');
    initializeEscudo3D();
});

// También inicializar si el DOM ya está listo
if (document.readyState !== 'loading') {
    console.log('📄 DOM ya está listo, inicializando...');
    initializeEscudo3D();
}

// Exportar para uso global
window.Escudo3D = Escudo3D;
window.initializeEscudo3D = initializeEscudo3D;
window.testInternet = testInternet;

console.log('📦 Escudo3D ULTRA ROBUSTO cargado');
