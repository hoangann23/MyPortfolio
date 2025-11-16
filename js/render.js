import * as THREE from '../three.js-master/build/three.module.js'
import {GLTFLoader} from '../three.js-master/examples/jsm/loaders/GLTFLoader.js'
import {OrbitControls} from '../three.js-master/examples/jsm/controls/OrbitControls.js'

const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()
// Boiler Plate Code
const sizes = {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT
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
let currentModelName = ''

let light
let isLightAttachedToCamera = true

function getCurrentModel() {
    return currentModelName;
}
window.getCurrentModel = getCurrentModel;

function updateCurrentModel(modelName) {
    currentModelName = modelName;
}
window.updateCurrentModel = updateCurrentModel;

function createScene(modelPath, modelData, useDefaults) {
    scene.clear()
    placeLights(modelData, useDefaults)
    setUpCamera(modelData, useDefaults)
    setUpControls()
    changeModel(modelPath, modelData, useDefaults)
}

window.createScene = createScene;

// Function to change the model path based on the clicked image
function changeModel(modelPath, modelData, useDefaults) {
    // Optionally, you can reload the model here
    loader.load(modelPath, function(glb) {
        let model_position = (useDefaults) ? DEFAULT_MODEL_POSITION : modelData[currentModelName]['default_position'];
        let model_scale = (useDefaults) ? DEFAULT_SCALE : modelData[currentModelName]["default_scale"];
        model = glb.scene
        model.scale.set(model_scale, model_scale, model_scale);
        // set up initial model.position
        model.position.set(model_position.x, model_position.y, model_position.z);
        console.log(glb)
        scene.add(model)
    }, function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded')
    }, function(error) {
        console.error(error)
    });
}

function placeLights(modeldata, useDefaults) {
    //Add lights to the scene, so we can actually see the 3D model
    // to do: add menu options to adjust light intensity, color, and position
    let light_position = (useDefaults === true) ? DEFAULT_LIGHT_POSITION : modeldata[currentModelName]['default_camera'];
    light = new THREE.DirectionalLight(0xffffff, 5); // (color, intensity)
    light.position.set(light_position.x, light_position.y, light_position.z) //top-left-ish
    scene.add(light);
    isLightAttachedToCamera = true;
}

function setUpCamera(modelData, useDefaults) {
    const camera_position = (useDefaults) ? DEFAULT_CAMERA_POSITION : modelData[currentModelName]["default_camera"]; // update this to check for model conditions
    camera.position.set(camera_position.x, camera_position.y, camera_position.z);
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
    if (isLightAttachedToCamera) light.position.copy(camera.position)
    renderer.render(scene, camera)
}

// Expose a safe global starter so inline handlers can start the module animation.
// We use a different name (`startAnimation`) to avoid colliding with the
// Element.prototype.animate method available on DOM elements.
window.startAnimation = animate;

function updateModelX(x) {
    if (model) {
        model.position.x = x;
    }
}
window.updateModelX = updateModelX;

function updateModelY(y) {
    if (model) {
        model.position.y = y;
    }
}
window.updateModelY = updateModelY;

function updateModelZ(z) {
    if (model) {
        model.position.z = z;
    }
}
window.updateModelZ = updateModelZ;

function updateModelScale(scale) {
    if (model) {
        model.scale.set(scale, scale, scale);
    }
}
window.updateModelScale = updateModelScale;


function updateRotationX(degrees) {
    let radians = degrees * Math.PI / 180;
    if (model) {
        model.rotation.x = radians;
    }
}
window.updateRotationX = updateRotationX;

function updateRotationY(degrees) {
    let radians = degrees * Math.PI / 180;
    if (model) {
        model.rotation.y = radians;
    }
}
window.updateRotationY = updateRotationY;

function updateRotationZ(degrees) {
    let radians = degrees * Math.PI / 180;
    if (model) {
        model.rotation.z = radians;
    }
}
window.updateRotationZ = updateRotationZ;

function updateLightPositionX(x) {
    if (light) {
        light.position.x = x;
        isLightAttachedToCamera = false;
        let checkbox = document.getElementById('lightCameraCheckbox');
        checkbox.checked = false;
    }
}
window.updateLightPositionX = updateLightPositionX;

function updateLightPositionY(y) {
    if (light) {
        light.position.y = y;
        isLightAttachedToCamera = false;
        let checkbox = document.getElementById('lightCameraCheckbox');
        checkbox.checked = false;
    }
}
window.updateLightPositionY = updateLightPositionY;

function updateLightPositionZ(z) {
    if (light) {
        light.position.z = z;
        isLightAttachedToCamera = false;
        let checkbox = document.getElementById('lightCameraCheckbox');
        checkbox.checked = false;
    }
}
window.updateLightPositionZ = updateLightPositionZ;

function updateLightIntensity(intensity) {
    if (light) {
        light.intensity = intensity;
    }
}
window.updateLightIntensity = updateLightIntensity;

function fixLightToCamera() {
    isLightAttachedToCamera = !isLightAttachedToCamera;
    console.log("isLightAttachedToCamera: ", isLightAttachedToCamera);
    if (isLightAttachedToCamera) light.position.copy(camera.position);
}
window.fixLightToCamera = fixLightToCamera;

function updateCameraX(x) {
    if (camera) {
        camera.position.x = x;
    }
}
window.updateCameraX = updateCameraX;

function updateCameraY(y) {
    if (camera) {
        camera.position.y = y;
    }
}
window.updateCameraY = updateCameraY;

function updateCameraZ(z) {
    if (camera) {
        camera.position.z = z;
    }
}
window.updateCameraZ = updateCameraZ;