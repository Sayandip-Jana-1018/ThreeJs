//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(105, window.innerWidth / window.innerHeight, 8.9, 5000);

//Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = 'dam';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `models/${objToRender}/scene.gltf`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    // Scale the dino model
    if (objToRender === "dam") {
        object.scale.set(1, 1, 1); // Increase the scale by a factor of 2
      }
  
      scene.add(object);
    },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z = objToRender === "dam" ? 5 : 50;

//Add more lights to the scene

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 3); // (color, intensity)
directionalLight.position.set(50, 50, 50); // position the light
scene.add(directionalLight);

// Point light
const pointLight = new THREE.PointLight(0xffffff, 3); // (color, intensity)
pointLight.position.set(0, 200, 0); // position the light
scene.add(pointLight);

// Spot light
const spotLight = new THREE.SpotLight(0xffffff, 4); // (color, intensity)
spotLight.position.set(0, 500, 500); // position the light
scene.add(spotLight);

// Hemisphere light
const hemisphereLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 4); // (skyColor, groundColor, intensity)
scene.add(hemisphereLight);


//This adds controls to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "dam") {
  controls = new OrbitControls(camera, renderer.domElement);
}

//Render the scene
function animate() {
  requestAnimationFrame(animate);
  //Here we could add some code to update the scene, adding some automatic movement

  //Make the eye move
  if (object && objToRender === "dam") {
    //I've played with the constants here until it looked good 
    object.rotation.y = -3 + mouseX / window.innerWidth * 3;
    object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
  }
  renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add event listener for mouse down
document.onmousedown = (e) => {
  // Start tracking mouse movement only when mouse is clicked
  document.onmousemove = handleMouseMove;
}

// Add event listener for mouse up
document.onmouseup = () => {
  // Stop tracking mouse movement when mouse is released
  document.onmousemove = null;
}

// Function to handle mouse movement while mouse is down
function handleMouseMove(e) {
  // Update mouseX and mouseY positions
  mouseX = e.clientX;
  mouseY = e.clientY;
}

//Start the 3D rendering
animate();
