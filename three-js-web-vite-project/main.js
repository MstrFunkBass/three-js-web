import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Curves } from 'three/examples/jsm/curves/CurveExtras';

//Set up scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

/*====SOME VARIABLES====*/
//Set camera start and minimum value
const cameraMin = 25
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
const objLoader = new OBJLoader()
const controls = new OrbitControls(camera, renderer.domElement);
var lastScroll = 0;

//Set up Renderer and render the scene/camera
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(cameraMin);

renderer.render(scene, camera);

/*LIGHTS*/
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(lightHelper, gridHelper);

/*====LOAD MODELS====*/

//Hello World Object
objLoader.load(
    'models/hello_world.obj',
    function( obj ){
      obj.traverse( function( child ) {
          if ( child instanceof THREE.Mesh ) {
              child.material = material;
          }
      } );
      obj.scale.set(2,2,2);
      obj.name = 'hello';
      scene.add( obj );
  },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

//Torus
const geometry = new THREE.TorusGeometry(12,3,16,100);
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

//Random Peacocks
Array(200).fill().forEach(addPeacock);

//Granny Knot
const grannyCurve = new Curves.GrannyKnot();
const grannyGeo = new THREE.TubeBufferGeometry(grannyCurve, 100, 2, 8, true)
const grannyMaterial = new THREE.MeshBasicMaterial({color : 0xf9f9f9, wireframe : true, side : THREE.DoubleSide});

const tube = new THREE.Mesh(grannyGeo, grannyMaterial);
tube.scale.set(7,7,7)
scene.add(tube)

//Background
const spaceTexture = new THREE.TextureLoader().load('static/space.jpg');
scene.background = spaceTexture;

/*====FUNCTIONS====*/

document.body.onscroll = moveCamera

function addPeacock() {
  
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(400));

  const gltfLoader = new GLTFLoader();
  const peacockModels = ['models/peacock.glb', 'models/peacock2.glb'];
  gltfLoader.load(
  	// resource URL
  	peacockModels[Math.floor(Math.random()*peacockModels.length)],
  	// called when the resource is loaded
  	function ( gltf ) {
      const model = gltf.scene;
      model.position.set(x,y,z)
      model.rotation.set(x,y,z)
      model.name = 'peacock'
  		scene.add( model );

  		gltf.animations; // Array<THREE.AnimationClip>
  		gltf.scene; // THREE.Group
  		gltf.scenes; // Array<THREE.Group>
  		gltf.cameras; // Array<THREE.Camera>
  		gltf.asset; // Object
      gltf.position
      

  	},
  	// called while loading is progressing
  	function ( xhr ) {

  		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

  	},
  	// called when loading has errors
  	function ( error ) {

  		console.log( 'An error happened' );

  	}
  );
  
}

function moveCamera() {

  const t = document.body.getBoundingClientRect().top;

  if (t > -0.1){
    scene.getObjectByName('hello', true).rotation.y = 0;
    scene.getObjectByName('hello', true).rotation.x = 0;
  }else if (lastScroll > t){
    scene.getObjectByName('hello', true).rotation.y += 0.02;
    scene.getObjectByName('hello', true).rotation.x += 0.01;
  }else {
    scene.getObjectByName('hello', true).rotation.y -= 0.02;
    scene.getObjectByName('hello', true).rotation.x -= 0.01;
  }
  


  camera.position.z = cameraMin + (t * -0.1);
  camera.position.x = (t * -0.02);

  lastScroll = t;
  
}

function animate(){
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.02;
  torus.rotation.z += 0.02;

  controls.update();

  renderer.render(scene, camera);
}

animate();
