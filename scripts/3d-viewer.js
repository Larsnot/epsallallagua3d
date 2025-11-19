// 3D Viewer for EPSA-Llallagua Infrastructure
// Three.js-based 3D model viewer with file upload support

class EPSA3DViewer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.currentModel = null;
        this.lights = {};
        this.isWireframe = false;
        
        // File handling
        this.supportedFormats = ['.glb', '.gltf', '.obj', '.fbx', '.dae'];
        // Límite en MB
this.maxFileSize = 100 * 1024 * 1024; // 100 MB

document.getElementById("fileInput").addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (!file) return;

    // Verificar peso real
    if (file.size > this.maxFileSize) {
        alert(
            `El archivo es demasiado grande.\nTamaño máximo permitido: ${(this.maxFileSize / 1024 / 1024).toFixed(0)} MB`
        );
        return;
    }

    // Crear URL temporal para el modelo
    const url = URL.createObjectURL(file);
    console.log("Cargando modelo:", file.name, "Peso:", file.size / 1024 / 1024, "MB");

    // Aquí cargas el modelo con tu loader
    loadModel(url);
});

        this.init();
    }
    
    init() {
        this.setupScene();
        this.setupLighting();
        this.setupControls();
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.animate();
        
        console.log('EPSA 3D Viewer initialized successfully');
    }
    
    setupScene() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1e293b);
        
        // Camera
        const container = document.getElementById('viewer3D');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.set(5, 5, 5);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: container,
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(width, height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        
        // Grid for reference
        const gridHelper = new THREE.GridHelper(20, 20, 0x4a5568, 0x2d3748);
        gridHelper.material.opacity = 0.3;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);
        
        // Axes helper (optional)
        const axesHelper = new THREE.AxesHelper(5);
        axesHelper.material.opacity = 0.5;
        axesHelper.material.transparent = true;
        this.scene.add(axesHelper);
    }
    
    setupLighting() {
        // Ambient light
        this.lights.ambient = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(this.lights.ambient);
        
        // Directional light
        this.lights.directional = new THREE.DirectionalLight(0xffffff, 1);
        this.lights.directional.position.set(10, 10, 5);
        this.lights.directional.castShadow = true;
        this.lights.directional.shadow.mapSize.width = 2048;
        this.lights.directional.shadow.mapSize.height = 2048;
        this.lights.directional.shadow.camera.near = 0.5;
        this.lights.directional.shadow.camera.far = 50;
        this.lights.directional.shadow.camera.left = -10;
        this.lights.directional.shadow.camera.right = 10;
        this.lights.directional.shadow.camera.top = 10;
        this.lights.directional.shadow.camera.bottom = -10;
        this.scene.add(this.lights.directional);
        
        // Additional fill lights
        this.lights.fill = new THREE.DirectionalLight(0xffffff, 0.3);
        this.lights.fill.position.set(-5, 5, -5);
        this.scene.add(this.lights.fill);
        
        // Point light for accent
        this.lights.point = new THREE.PointLight(0x4a90e2, 0.5, 100);
        this.lights.point.position.set(0, 10, 0);
        this.scene.add(this.lights.point);
    }
    
    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.enablePan = true;
        this.controls.enableRotate = true;
        this.controls.target.set(0, 0, 0);
        
        // Control constraints
        this.controls.maxDistance = 100;
        this.controls.minDistance = 1;
        this.controls.maxPolarAngle = Math.PI;
    }
    
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);
        
        // File input
        const fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Control events
        document.getElementById('ambientLight').addEventListener('input', (e) => {
            this.lights.ambient.intensity = parseFloat(e.target.value);
        });
        
        document.getElementById('directionalLight').addEventListener('input', (e) => {
            this.lights.directional.intensity = parseFloat(e.target.value);
        });
        
        document.getElementById('resetView').addEventListener('click', () => this.resetView());
        document.getElementById('wireframe').addEventListener('click', () => this.toggleWireframe());
    }
    
    setupDragAndDrop() {
        const uploadZone = document.getElementById('uploadZone');
        
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        
        uploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
        });
        
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.loadFile(files[0]);
            }
        });
    }
    
    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.loadFile(file);
        }
    }
    
    loadFile(file) {
        // Validate file
        if (!this.isValidFile(file)) {
            alert('Formato de archivo no válido. Formatos soportados: ' + this.supportedFormats.join(', '));
            return;
        }
        
        if (file.size > this.maxFileSize) {
            alert('El archivo es demasiado grande. Tamaño máximo: 80MB');
            return;
        }
        
        // Show loading
        this.showLoading(true);
        
        // Clear previous model
        if (this.currentModel) {
            this.scene.remove(this.currentModel);
            this.currentModel.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(mat => mat.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        }
        
        const fileExtension = this.getFileExtension(file.name).toLowerCase();
        
        // Load based on file type
        switch (fileExtension) {
            case '.glb':
            case '.gltf':
                this.loadGLTF(file);
                break;
            case '.obj':
                this.loadOBJ(file);
                break;
            case '.fbx':
                this.loadFBX(file);
                break;
            case '.dae':
                this.loadDAE(file);
                break;
            default:
                this.showLoading(false);
                alert('Formato no soportado: ' + fileExtension);
        }
    }
    
    loadGLTF(file) {
        const loader = new THREE.GLTFLoader();
        const url = URL.createObjectURL(file);
        
        loader.load(url, (gltf) => {
            this.currentModel = gltf.scene;
            this.setupModel();
            this.fitCameraToObject(this.currentModel);
            this.updateModelInfo(gltf);
            URL.revokeObjectURL(url);
            this.showLoading(false);
        }, (progress) => {
            console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
        }, (error) => {
            console.error('Error loading GLTF:', error);
            this.showLoading(false);
            alert('Error al cargar el modelo GLTF');
        });
    }
    
    loadOBJ(file) {
        const loader = new THREE.OBJLoader();
        const url = URL.createObjectURL(file);
        
        loader.load(url, (object) => {
            this.currentModel = object;
            this.setupModel();
            this.fitCameraToObject(this.currentModel);
            this.updateModelInfo({ scene: object });
            URL.revokeObjectURL(url);
            this.showLoading(false);
        }, (progress) => {
            console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
        }, (error) => {
            console.error('Error loading OBJ:', error);
            this.showLoading(false);
            alert('Error al cargar el modelo OBJ');
        });
    }
    
    loadFBX(file) {
        const loader = new THREE.FBXLoader();
        const url = URL.createObjectURL(file);
        
        loader.load(url, (object) => {
            this.currentModel = object;
            this.setupModel();
            this.fitCameraToObject(this.currentModel);
            this.updateModelInfo({ scene: object });
            URL.revokeObjectURL(url);
            this.showLoading(false);
        }, (progress) => {
            console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
        }, (error) => {
            console.error('Error loading FBX:', error);
            this.showLoading(false);
            alert('Error al cargar el modelo FBX');
        });
    }
    
    loadDAE(file) {
        const loader = new THREE.ColladaLoader();
        const url = URL.createObjectURL(file);
        
        loader.load(url, (collada) => {
            this.currentModel = collada.scene;
            this.setupModel();
            this.fitCameraToObject(this.currentModel);
            this.updateModelInfo({ scene: collada.scene });
            URL.revokeObjectURL(url);
            this.showLoading(false);
        }, (progress) => {
            console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
        }, (error) => {
            console.error('Error loading DAE:', error);
            this.showLoading(false);
            alert('Error al cargar el modelo DAE');
        });
    }
    
    setupModel() {
        if (!this.currentModel) return;
        
        // Enable shadows for all meshes
        this.currentModel.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                // Ensure material has proper properties
                if (child.material) {
                    child.material.needsUpdate = true;
                }
            }
        });
        
        // Add to scene
        this.scene.add(this.currentModel);
        
        // Enable wireframe toggle
        this.isWireframe = false;
    }
    
    fitCameraToObject(object) {
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        // Reset camera position
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = this.camera.fov * (Math.PI / 180);
        const cameraZ = Math.abs(maxDim / 2 * Math.tan(fov * 2));
        
        this.camera.position.z = cameraZ * 1.5;
        this.camera.position.y = cameraZ * 0.5;
        this.camera.lookAt(center);
        
        // Update controls target
        this.controls.target.copy(center);
        this.controls.update();
    }
    
    updateModelInfo(gltf) {
        const modelInfo = document.getElementById('modelInfo');
        const object = gltf.scene || gltf;
        
        // Count geometries and materials
        let geometryCount = 0;
        let materialCount = 0;
        
        object.traverse((child) => {
            if (child.isMesh) {
                geometryCount++;
                if (child.material) {
                    materialCount++;
                }
            }
        });
        
        // Calculate bounding box
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        
        modelInfo.innerHTML = `
            <p><strong>Polígonos:</strong> ${geometryCount.toLocaleString()}</p>
            <p><strong>Dimensiones:</strong> ${size.x.toFixed(2)} × ${size.y.toFixed(2)} × ${size.z.toFixed(2)}</p>
            <p><strong>Centro:</strong> (${box.getCenter(new THREE.Vector3()).x.toFixed(2)}, ${box.getCenter(new THREE.Vector3()).y.toFixed(2)}, ${box.getCenter(new THREE.Vector3()).z.toFixed(2)})</p>
        `;
    }
    
    toggleWireframe() {
        if (!this.currentModel) return;
        
        this.isWireframe = !this.isWireframe;
        
        this.currentModel.traverse((child) => {
            if (child.isMesh && child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => {
                        mat.wireframe = this.isWireframe;
                    });
                } else {
                    child.material.wireframe = this.isWireframe;
                }
            }
        });
        
        // Update button text
        const wireframeBtn = document.getElementById('wireframe');
        wireframeBtn.textContent = this.isWireframe ? 'Ver Sólido' : 'Ver Wireframe';
    }
    
    resetView() {
        if (this.currentModel) {
            this.fitCameraToObject(this.currentModel);
        } else {
            // Reset to default position
            this.camera.position.set(5, 5, 5);
            this.controls.target.set(0, 0, 0);
            this.controls.update();
        }
        
        // Reset lighting
        document.getElementById('ambientLight').value = 0.5;
        document.getElementById('directionalLight').value = 1;
        this.lights.ambient.intensity = 0.5;
        this.lights.directional.intensity = 1;
        
        // Reset wireframe
        if (this.isWireframe) {
            this.toggleWireframe();
        }
    }
    
    showLoading(show) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (show) {
            loadingOverlay.classList.add('active');
        } else {
            loadingOverlay.classList.remove('active');
        }
    }
    
    isValidFile(file) {
        const extension = this.getFileExtension(file.name);
        return this.supportedFormats.includes(extension.toLowerCase());
    }
    
    getFileExtension(filename) {
        return filename.substring(filename.lastIndexOf('.'));
    }
    
    onWindowResize() {
        const container = document.getElementById('viewer3D');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update controls
        if (this.controls) {
            this.controls.update();
        }
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize 3D viewer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.epsaViewer = new EPSA3DViewer();
});

// Export for global access
window.EPSA3DViewer = EPSA3DViewer;