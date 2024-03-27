import * as THREE from 'three';
// import gsap from 'gsap';

import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';


import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';

import { addPass, useCamera, useGui, useRenderSize, useRenderer, useScene, useTick } from './init.js'



const startApp = () => {

    const params = {
            
        transmission: 1,
        opacity: 1,
        metalness: 0.5,
        roughness: 0,
        ior: 1,
        thickness: 0.5,
        specularIntensity: 1,
        specularColor: 0xffffff,
        lightIntensity: 1,
        exposure: 1
    };

    

    const scene = useScene();
    const container = document.getElementById('contacts');
    const camera = useCamera();
    camera.position.z = 6;
    const renderer = useRenderer();
    

    const { width, height } = useRenderSize()

    const material = new THREE.MeshPhysicalMaterial( {
        roughness: params.roughness,
        opacity: params.opacity,
        metalness: params.metalness,
        ior: params.ior,
        transmission: params.transmission,
        clearcoat: 0.5,
        color: 0x0000ff,
        specularColor: params.specularColor,
        specularIntensity: params.specularIntensity,
    } );

    const material2 = new THREE.MeshBasicMaterial({color: 0xff00ff});


    

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    //container.addEventListener('click', onClick);
    container.addEventListener('mousemove', onHover);
    // container.addEventListener('touchmove', onHover);
    
    // TEXTURE ON PLANE
    
    // Convert the field of view to radians 
    const vFOV = THREE.MathUtils.degToRad( camera.fov );
    //camera.fov * Math.PI / 180;

    // Get the visible height 
    const visHeight = 2 * Math.tan( vFOV / 2 ) * 11;

    // If we want a width that follows the aspect ratio of the camera, then get the aspect ratio and multiply by the height.
    const aspect = window.innerWidth / window.innerHeight;
    const visWidth = visHeight * aspect;

    const test = new THREE.PlaneGeometry(visWidth, visHeight);
    const testMat = new THREE.MeshBasicMaterial({color: 0xff00ff});
    const texture = new THREE.TextureLoader().load('../assets/imgs/Vector.png' ); 
    texture.colorSpace = THREE.SRGBColorSpace;


    // immediately use the texture for material creation 

    const testMaterial = new THREE.MeshBasicMaterial( { map:texture } );

    const testPlane = new THREE.Mesh(test, testMaterial);

    testPlane.position.z = -5;

    // END TEXTURE ON PLANE
    


    function setupLights(){
        // Add light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 50);
        directionalLight.position.set(0.5, 0.5, 3);
        scene.add(directionalLight);
        const directionalLight2 = new THREE.DirectionalLight(0xff00ff, 50);
        directionalLight2.position.set(-0.5, -0.5, 3);
        scene.add(directionalLight2);
    };


    function animate() {
        requestAnimationFrame(() => animate());       
                
    };    

    
    
    const loader = new GLTFLoader();
    console.log("hello");
    loader.load("textbubble.gltf", (gltf) => {
        
        const bubble = gltf.scene.children.find((mesh) => mesh.name === "Plane");
        
        bubble.position.set(0,1.5,0);

        //const mesh = new THREE.Mesh(bubble, material2);
        bubble.traverse( ( child ) => {
            if ( child instanceof THREE.Mesh ) {
                child.material = material
                //console.log(child.material)
                child.castShadow = true;
                child.receiveShadow = true
            }
        })
    
        // Just copy the geometry from the loaded model
        

        scene.add(bubble);
    },
    function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    //called when loading has errors
    function ( error ) {

        console.log( 'An error happened' );

    });
    loader.load("textbubble.gltf", (gltf) => {
        
        const bubble = gltf.scene.children.find((mesh) => mesh.name === "Plane");
        
        bubble.position.set(0,-1.5,0);
        bubble.rotation.y = Math.PI;
        

        //const mesh = new THREE.Mesh(bubble, material2);
        bubble.traverse( ( child ) => {
            if ( child instanceof THREE.Mesh ) {
                child.material = material
                //console.log(child.material)
                child.castShadow = true;
                child.receiveShadow = true
            }
        })
    
        // Just copy the geometry from the loaded model
        

        scene.add(bubble);
    },
    function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    //called when loading has errors
    function ( error ) {

        console.log( 'An error happened' );

    });
    

    var pIntersect = new THREE.Vector3(); // point of intersection with an object (plane's point)
    var plane = new THREE.Plane();
    var pNormal = new THREE.Vector3(0, 0, 1); 
    var shift = new THREE.Vector3(); // distance between position of an object and points of intersection with the object
    var planeIntersect = new THREE.Vector3(); // point of intersection with the plane

    function onHover(event) {
        event.preventDefault();
        // Calculate mouse position in normalized device coordinates
        // mouse.x = ((event.clientX / window.innerWidth) -0.5)* 2;
        // mouse.y = - ((event.clientY / window.innerHeight) -0.5 ) * 2;

        // // Make the sphere follow the mouse
        // var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        // vector.unproject( camera );
        // var dir = vector.sub( camera.position ).normalize();
        // var distance = (sphere.position.z - camera.position.z ) / dir.z;
        // var pos = camera.position.clone().add( dir.multiplyScalar( distance )     );
        // sphere.position.copy(pos);

        // sphere.position.z = -2;

        // // Make the sphere follow the mouse
        // //sphere.position.set(event.clientX, event.clientY, 0);

        // // Raycast from camera to intersect objects
        // raycaster.setFromCamera(mouse, camera);
        // const intersects = raycaster.intersectObject([sphere]);
        
        // if(intersects.length > 0) {
            
        //     // pIntersect.copy(intersects[0].point);
        //     // plane.setFromNormalAndCoplanarPoint(pNormal, pIntersect);
        //     // shift.subVectors(intersects[0].object.position, intersects[0].point)
        //     // isDragging = true;
        //     // var dragObject = intersects[0].object;
        //     // raycaster.ray.intersectPlane(plane, planeIntersect);
        //     // dragObject.position.addVectors(planeIntersect, shift);
        //     //sphere.position.copy(point.setY(0));
        // }
        

    
    }



    function init(){
        setupLights();

        // scene.add(testPlane);
        // scene.add(balls);
        // scene.add(sphere);

        animate();
        
    }

    init();

    container.appendChild(renderer.domElement);

    }

export default startApp;