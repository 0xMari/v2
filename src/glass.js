import * as THREE from 'three';
// import gsap from 'gsap';

import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';


import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';

import { addPass, useCamera, useGui, useRenderSize, useRenderer, useScene, useTick } from './init.js'

import HelvetikerFont from "three/examples/fonts/helvetiker_regular.typeface.json";


const startApp = () => {

    const params = {
            
        transmission: 1,
        opacity: 1,
        metalness: 0,
        roughness: 0,
        ior: 0.00001,
        thickness: 0.5,
        specularIntensity: 1,
        specularColor: 0xffffff,
        lightIntensity: 1,
        exposure: 1
    };

    let time = 0;
    const numBlobs = 15;
    const numSphere = 1;
    const clock = new THREE.Clock();

    const scene = useScene();
    const container = document.getElementById('sfera');
    const camera = useCamera();
    camera.position.z = 6;
    const renderer = useRenderer();
    

    const { width, height } = useRenderSize()

    const sphere = createSphere();
    sphere.position.set(0,0,2.2);

    const balls = createMetaBalls(7);
    balls.position.set(0,0,2.2);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const v2 = new THREE.Vector2();
    
    //container.addEventListener('click', onClick);
    container.addEventListener('mousemove', onHover)
    
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
    };


    function animate() {
        requestAnimationFrame(() => animate());
        const delta = clock.getDelta();

		time += delta * 0.3;
        updateCubes( balls, time, numBlobs);

                
    };



    function createSphere(){


        const sphereGeometry = new THREE.IcosahedronGeometry(0.5, 15);
        
        
        const material = new THREE.MeshPhysicalMaterial( {
            roughness: params.roughness,
            transmission: params.transmission,
            thickness: params.thickness,
            clearcoat: 0.5,
        } );


        const sphere = new THREE.Mesh(sphereGeometry, material);

        return sphere;

    };

    function createMetaBalls(scale){
        const resolution = 35;

        const material = new THREE.MeshPhysicalMaterial( {
            roughness: params.roughness,
            transmission: params.transmission,
            thickness: params.thickness,
            clearcoat: 0.5,
        } );


		const effect = new MarchingCubes( resolution, material, true, true, 100000 );
        effect.scale.set( scale, scale, scale );

        effect.enableUvs = false;
        effect.enableColors = false;

        return effect;
    };

    function updateCubes( object, time, numblobs) {

        object.reset();

        // fill the field with some metaballs

        const subtract = 12;
        const strength = 1.2 / ( ( Math.sqrt( numblobs ) - 1 ) / 4 + 1 );

        for ( let i = 0; i < numblobs; i ++ ) {

            const ballx = Math.sin( i + 1.26 * time * ( 1.03 + 0.5 * Math.cos( 0.21 * i ) ) ) * 0.27 + 0.5;
            //const ballz = Math.abs( Math.cos( i + 1.12 * time * Math.cos( 1.22 + 0.1424 * i ) ) ) * 0.77; // dip into the floor
            const bally = Math.sin( i + 1.32 * time * 0.1 * Math.abs( ( 0.92 + 0.53 * i ) ) ) * 0.27 + 0.5;
            const ballz= 0;
            

            object.addBall( ballx, bally, ballz, strength, subtract );

        }

        object.update();

    }

    
    

    // useTick(({ timestamp, timeDiff }) => {
    //     const time = timestamp / 5000
    //     //sphere.material.userData.shader.uniforms.uTime.value = time
    // })

    

    function onHover(event) {
        // Calculate mouse position in normalized device coordinates
        v2.x = ((event.clientX / window.innerWidth) -0.5)* 2;
        v2.y = - ((event.clientY / window.innerHeight) -0.5 ) * 2;

        // Raycast from camera to intersect objects
        raycaster.setFromCamera(v2, camera);
        const intersects = raycaster.intersectObject(sphere);

        sphere.position.x = v2.x ;
        sphere.position.y = v2.y ;

        // If there's an intersection with the sphere, change cursor

        if (intersects.length > 0){
            //container.classList.add('hover-pointer');
            // let first = intersects[0];
            // mouse.x = first.point.x;
            // mouse.y = first.point.z;

            
        }
        
    }



    function init(){
        setupLights();

        scene.add(testPlane);
        scene.add(balls);



        animate();
        
    }

    init();

    container.appendChild(renderer.domElement);

    }

export default startApp;