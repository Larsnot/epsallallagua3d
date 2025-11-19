import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.116.1/build/three.module.js";
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';

// Variables globales
let scene, camera, renderer, glbModel, pointLight1, pointLight2;
let rotationDirection = 1; // 1 = derecha, -1 = izquierda
let maxRotationY = Math.PI / 4; // 45 grados en radianes
let minRotationY = -Math.PI / 9; // -45 grados
let rotationSpeed = 0.009;

// Función principal para inicializar la escena
function init() {
    createScene();
    createCamera();
    createRenderer();
    addLights();

    // TU MODELO LOCAL - CAMBIADO AQUÍ
    loadGLBModel({
        url: 'models3d/escudo.glb',  // ← TU ARCHIVO LOCAL
        scale: 3.2,
        offsetX: 0.3,
        offsetY: 1.2,
        rotationX: 2.5,
        rotationY: 2.5,
        rotationZ: 2.5,
        positionX: 0,
        positionY: 0,
        positionZ: 0
    });

    setupEventListeners();
    animate();
}

function createScene() {
    scene = new THREE.Scene();
}

function createCamera() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
}

function createRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(0x000000, 0);
    document.getElementById('glb-model').appendChild(renderer.domElement);
}

function addLights() {
    // Primera luz
    pointLight1 = new THREE.PointLight(0xffffff, 1, 100);
    pointLight1.position.set(0, 0, 7);
    pointLight1.castShadow = true;
    scene.add(pointLight1);

    // Segunda luz para el cursor
    pointLight2 = new THREE.PointLight(0xffffff, 30, 100);
    pointLight2.castShadow = true;
    scene.add(pointLight2);
}

// Función para cargar el archivo GLB
function loadGLBModel(config) {
    const loader = new GLTFLoader();
    
    console.log('🔄 Cargando modelo:', config.url);
    
    loader.load(
        config.url,
        function (gltf) {
            console.log('✅ Modelo cargado exitosamente:', config.url);
            
            glbModel = gltf.scene;
            glbModel.scale.set(config.scale || 1, config.scale || 1, config.scale || 1);
            glbModel.rotation.set(config.rotationX || 0, config.rotationY || 0, config.rotationZ || 0);
            glbModel.position.set(config.positionX || 0, config.positionY || 0, config.positionZ || 0);

            glbModel.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    // Asegurar que el material es transparente y no tiene fondo
                    node.material.transparent = false;
                    node.material.opacity = 1; // Asegura que el objeto en sí sea completamente visible
                    node.material.depthWrite = true; // Evita problemas con el orden de dibujado
                }
            });
            scene.add(glbModel);
            
            console.log('🎯 Modelo configurado y agregado a la escena');
        },
        function (progress) {
            if (progress.total > 0) {
                const percentage = Math.round((progress.loaded / progress.total) * 100);
                console.log(`📦 Cargando modelo... ${percentage}%`);
            }
        },
        function (error) {
            console.error('❌ Error al cargar el archivo GLB:', error);
            console.error('❌ Ruta intentada:', config.url);
            
            // Mostrar error en pantalla
            const container = document.getElementById('glb-model');
            if (container) {
                container.innerHTML = `
                    <div style="padding: 20px; text-align: center; background: #ffebee; border: 1px solid #ffcdd2; color: #c62828; border-radius: 10px;">
                        <h3>⚠️ Error cargando modelo 3D</h3>
                        <p><strong>Archivo:</strong> ${config.url}</p>
                        <p><small>Verifica que el archivo existe y la ruta es correcta</small></p>
                        <p><small>Formatos soportados: .glb, .gltf</small></p>
                    </div>
                `;
            }
        }
    );
}

// Función de animación
function animate() {
    requestAnimationFrame(animate);

    if (glbModel) {
        glbModel.rotation.y += rotationSpeed * rotationDirection;

        if (glbModel.rotation.y >= maxRotationY) {
            rotationDirection = -1; // Cambia dirección a la izquierda
        } else if (glbModel.rotation.y <= minRotationY) {
            rotationDirection = 1; // Cambia dirección a la derecha
        }
    }

    renderer.render(scene, camera);
}

// Actualizar el renderizador al cambiar el tamaño de la ventana
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Actualizar la posición de la luz al mover el ratón
function onMouseMove(event) {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    const vector = new THREE.Vector3(mouseX, mouseY, 0.5);
    vector.unproject(camera);

    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));

    pointLight2.position.copy(pos);
}

// Configurar los eventos
function setupEventListeners() {
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, false);
}

// Inicializar la aplicación
console.log('🚀 Iniciando visor 3D...');
console.log('📁 Buscando archivo: models3d/escudo.glb');
init();
