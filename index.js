import * as THREE from './three.js-master/build/three.module.js'
import {GLTFLoader} from './three.js-master/examples/jsm/loaders/GLTFLoader.js'
import {OrbitControls} from './three.js-master/examples/jsm/controls/OrbitControls.js'

const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()

const loader = new GLTFLoader()
let modelPosition
loader.load('./models/rookLP.glb', function(glb) {
    const model = glb.scene
    model.scale.set(200, 200, 200)
    modelPosition = model.position
    console.log(glb)
    scene.add(model)
}, function(xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded')
}, function(error) {
    console.error(error)
})

//Add lights to the scene, so we can actually see the 3D model
// to do: add menu options to adjust light intensity, color, and position
const topLight = new THREE.DirectionalLight(0xffffff, 15); // (color, intensity)
topLight.position.set(500, 500, 500) //top-left-ish
scene.add(topLight);

// Boiler Plate Code
const sizes = {
    width: 400,
    height: 400
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 1, 2);
// camera.position.set(-0.23139242651711647, 0.06048540283592574, 0.15627298939409598);
// Vector3 {x: 0.9120905838162786, y: 0.005700899820202813, z: 0.5962807437755624}
scene.add(camera)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.screenSpacePanning = false
controls.target = new THREE.Vector3(0,0,0); // set the center
controls.maxPolarAngle =  Math.PI/2; // prevent the camera from going under the ground
controls.zoomSpeed = 0.3; // control the zoomIn and zoomOut speed
controls.rotateSpeed = 0.3; // control the rotate speed


let frame = 1
function animate() {
    requestAnimationFrame(animate)
    controls.update()
    if (frame % 100 === 0) {
        console.log('camera position: ', camera.position)
        console.log('model position: ', modelPosition)
    }

    renderer.render(scene, camera)
    frame++
    if (frame > 100) {
        frame = 1
    }
}

animate()