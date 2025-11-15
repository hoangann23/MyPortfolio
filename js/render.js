import * as THREE from '../three.js-master/build/three.module.js'
import {GLTFLoader} from '../three.js-master/examples/jsm/loaders/GLTFLoader.js'
import {OrbitControls} from '../three.js-master/examples/jsm/controls/OrbitControls.js'

const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()
// Boiler Plate Code
const sizes = {
    width: 400,
    height: 400
}

const loader = new GLTFLoader()
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
const controls = new OrbitControls(camera, renderer.domElement)

let model
let modelPosition
let currentModelPath = ''

let light

function createScene(modelPath) {
    if (modelPath === currentModelPath) {
        return; // No change needed
    }
    currentModelPath = modelPath;
    scene.clear()
    placeLights()
    setUpCamera()
    setUpControls()
    changeModel(modelPath)
}

window.createScene = createScene;

// Function to change the model path based on the clicked image
function changeModel(modelPath) {
    // Optionally, you can reload the model here
    loader.load(modelPath, function(glb) {
        model = glb.scene
        model.scale.set(50, 50, 50)
        modelPosition = model.position
        console.log(glb)
        scene.add(model)
    }, function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded')
    }, function(error) {
        console.error(error)
    });
}

function placeLights() {
    //Add lights to the scene, so we can actually see the 3D model
    // to do: add menu options to adjust light intensity, color, and position
    light = new THREE.DirectionalLight(0xffffff, 15); // (color, intensity)
    light.position.set(500, 500, 500) //top-left-ish
    scene.add(light);
}

function setUpCamera() {
    camera.position.set(0, 1, 2);
    scene.add(camera)
}

function setUpControls() {
    // OrbitControls
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.screenSpacePanning = false
    controls.target = new THREE.Vector3(0,0,0); // set the center
    controls.maxPolarAngle =  Math.PI/2; // prevent the camera from going under the ground
    controls.zoomSpeed = 0.3; // control the zoomIn and zoomOut speed
    controls.rotateSpeed = 0.3; // control the rotate speed
}

// Expose changeModel so inline handlers can call it from the global scope.
// Using the same name as the inline handler keeps the HTML unchanged.
window.changeModel = changeModel;

function animate() {
    requestAnimationFrame(animate)
    controls.update()
    if (frame % 100 === 0) {
        console.log('camera position: ', camera.position)
        console.log('model position: ', modelPosition)
    }

    renderer.render(scene, camera)
}

// Expose a safe global starter so inline handlers can start the module animation.
// We use a different name (`startAnimation`) to avoid colliding with the
// Element.prototype.animate method available on DOM elements.
window.startAnimation = animate;

function updateModelPosition(x, y, z) {
    if (model) {
        model.position.set(x, y, z);
    }
}
window.updateModelPosition = updateModelPosition;

function updateLightIntensity(intensity) {
    if (light) {
        light.intensity = intensity;
    }
}
window.updateLightIntensity = updateLightIntensity;

function updateLightPosition(x, y, z) {
    if (light) {
        light.position.set(x, y, z);
    }
}
window.updateLightPosition = updateLightPosition;