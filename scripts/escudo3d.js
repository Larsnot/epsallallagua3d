import * as THREE from 'https://esm.sh/three@0.161.0';
import { GLTFLoader } from 'https://esm.sh/three@0.161.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://esm.sh/three@0.161.0/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer, controls;
let mixer,model;
let time = 0;
const clock = new THREE.Clock();

init();
animate();

function init() {
    scene = new THREE.Scene();

    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(0, 20, 10);
    scene.add(dirLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth*0.8, window.innerHeight*0.6);
    if(window.innerWidth < 676){
        renderer.setSize(window.innerWidth*0.9, window.innerHeight*0.5);
    }
    
    // Intentar agregar al modal si existe, si no al body
    const modalContainer = document.getElementById('modelo3d-container');
    if (modalContainer) {
        modalContainer.appendChild(renderer.domElement);
    } else {
        document.body.appendChild(renderer.domElement);
    }

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,0.1,2000);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;

    const loader = new GLTFLoader();
    
    
    loader.load('./models3d/pico.glb', function (gltf) {
        model = gltf.scene;
        scene.add(model);

        if (gltf.animations && gltf.animations.length) {
            mixer = new THREE.AnimationMixer(model);
            const action = mixer.clipAction(gltf.animations[0]);
            action.play();
        }

        model.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // Auto-rotación automática (la pediste)
        model.rotation.y = 4.5;
        model.scale.set(65,25,65);
        if(window.innerWidth < 676){
            model.scale.set(35,25,35);
            model.position.set(0,-5,0);
        }

        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        camera.position.set(center.x+3, center.y + 8, center.z + 20);
        controls.target.copy(center);
        controls.update();
        
        console.log('✅ Modelo 3D cargado correctamente');
        
    }, function (progress) {
        console.log('📦 Cargando modelo... ' + Math.round((progress.loaded / progress.total * 100)) + '%');
    }, function (error) {
        console.error('❌ Error cargando el modelo 3D:', error);
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `
            <div style="padding: 20px; text-align: center; background: #ffebee; border: 1px solid #ffcdd2; margin: 20px;">
                <h3>⚠️ Error cargando modelo 3D</h3>
                <p>Verifica que el archivo existe en: <code>./models3d/escudo.glb</code></p>
                <p><small>Si tu modelo tiene otro nombre, cambia la ruta en el código</small></p>
            </div>
        `;
        const container = document.getElementById('modelo3d-container');
        if (container) {
            container.appendChild(errorDiv);
        } else {
            document.body.appendChild(errorDiv);
        }
    });

    window.addEventListener('resize', onWindowResize);
}

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    time+=delta;
    if (mixer) mixer.update(delta);
    if(model){model.rotation.y += 0.005;} // AUTO-ROTACIÓN
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth*0.8, window.innerHeight*0.6);
}

// Mostrar errores en consola para debug
window.addEventListener('error', function(e) {
    console.error('🚨 Error detectado:', e.error);
});

console.log('🎯 Script escudo3d-EPSA cargado correctamente');
console.log('📍 Modelo esperado: ./models3d/escudo.glb');
