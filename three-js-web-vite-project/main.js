import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Curves } from 'three/examples/jsm/curves/CurveExtras';
import { TubeBufferGeometry } from 'three';

//Set up scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})
const gltfLoader = new GLTFLoader();
const objLoader = new OBJLoader()

/*====SOME VARIABLES====*/
//Set camera start and minimum value
const cameraMin = 25
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});

const controls = new OrbitControls(camera, renderer.domElement);
var lastScroll = 0;
var clock = new THREE.Clock();
const cameraSpeed = 0.00008;

//Set up Renderer and render the scene/camera
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);



renderer.render(scene, camera);

/*LIGHTS*/
const pointLight = new THREE.PointLight(0xeeeeee);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xe0e0e0);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
const axisHelper = new THREE.AxisHelper(5);
//scene.add(lightHelper, gridHelper, axisHelper);

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
const grannyGeo = new THREE.TubeBufferGeometry(grannyCurve, 150, 2, 8, true);
const grannyMaterial = new THREE.MeshBasicMaterial({color : 0xf9f9f9, wireframe : true, side : THREE.DoubleSide});

const tube = new THREE.Mesh(grannyGeo, grannyMaterial);
// tube.scale.set(7,7,7)
//scene.add(tube)

camera.position.copy(tube.geometry.parameters.path.getPointAt(0));
camera.lookAt(tube.geometry.parameters.path.getPointAt(0.01));

//Known Collagen Sachet
  gltfLoader.load(
  	// resource URL
  	'models/known-collagen.glb',
  	// called when the resource is loaded
  	function ( gltf ) {
      const model = gltf.scene;
      model.position.set(-30,-4.5,-10)
      //model.position.set(0,0,0)
      model.rotation.set(-(0.2*3.1415),-(2.1*3.1415),0)
      model.scale.set(4,4,4)
      model.name = 'known-collagen'
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



//Background
const spaceTexture = new THREE.TextureLoader().load('static/space.jpg');
scene.background = spaceTexture;

/*====FUNCTIONS====*/

document.body.onscroll = moveCamera

function addPeacock() {
  
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(400));

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
var cameraSpeedMod;

function updateCamera(){



  const t = document.body.getBoundingClientRect().top;

  // const time = clock.getElapsedTime();
  // const looptime = 200;
  // const t = (time % looptime)/looptime;
  // const t2 = ((time + 0.1) % looptime)/looptime;

  const cameraPoint = (((t*-1)*(cameraSpeed)))

  const pos = tube.geometry.parameters.path.getPointAt(cameraPoint+0.001);
  const pos2 = tube.geometry.parameters.path.getPointAt(cameraPoint+0.01);

  camera.position.copy(pos);
  camera.lookAt(pos2);

}

function getDistance(mesh1, mesh2) { 
  var dx = mesh1.position.x - mesh2.position.x; 
  var dy = mesh1.position.y - mesh2.position.y; 
  var dz = mesh1.position.z - mesh2.position.z; 
  return Math.sqrt(dx*dx+dy*dy+dz*dz); 
}

function moveCamera() {

  // const known = scene.getObjectByName('known-collagen');

  // console.log(getDistance(known, camera));

  // //const t = document.body.getBoundingClientRect().top;

  // if (getDistance(known, camera) < 10){
   
  // } else {
    
  // }
  updateCamera();

  // camera.position.z = cameraMin + (t * -0.1);
  // camera.position.x = (t * -0.02);
  
}

function animate(){
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.02;
  torus.rotation.z += 0.02;
  
  // controls.update();

  renderer.render(scene, camera);
}

animate();
