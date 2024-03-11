import * as THREE from 'three';
// import gsap from 'gsap';

import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';


import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';

import { addPass, useCamera, useGui, useRenderSize, useRenderer, useScene, useTick } from './init.js'

import HelvetikerFont from "three/examples/fonts/helvetiker_regular.typeface.json";


const startApp = () => {

    console.log('3d');

    const scene = useScene();
    const container = document.getElementById('sfera');
    const camera = useCamera();
    camera.position.z = 6;
    const renderer = useRenderer();

    const { width, height } = useRenderSize()

    const sphere = createSphere();

    sphere.position.set(0,0,2.2);
    

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    //container.addEventListener('click', onClick);
    //container.addEventListener('mousemove', onHover)
    
    

    const loader = new FontLoader();
    const font = loader.parse(HelvetikerFont);
    const textGeometry = new TextGeometry( 'HELLO WORLD BLABLA', {
        font: font,
        size: 0.5,
        height: 0.01,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
    } );

    const mat = new THREE.MeshBasicMaterial({
        color: 0x000000,
    });

    textGeometry.computeBoundingBox();


    const textMesh = new THREE.Mesh(textGeometry, mat);
    
    if (textGeometry.boundingBox) {
        textGeometry.translate(-textGeometry.boundingBox.max.x / 2, 0, 0);
    }
    
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
    const texture = new THREE.TextureLoader().load('Vector.png' ); 
    texture.colorSpace = THREE.SRGBColorSpace;


    // immediately use the texture for material creation 

    const testMaterial = new THREE.MeshBasicMaterial( { map:texture } );

    const testPlane = new THREE.Mesh(test, testMaterial);

    testPlane.position.z = -5;

    
    
    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.enabled = true;


    function setupLights(){
        // Add light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xfff, 0.5);
        scene.add(directionalLight);
    };


    function animate() {
        requestAnimationFrame(() => animate());
        //sphere rotation
        // const time = Date.now() * 0.0007;
        // sphere.rotation.y = time;
        // sphere.rotation.z = 0.5* ( 1 +  Math.sin( time ) );


                
    };


    function setupTexture(){
        const textureLoader = new THREE.TextureLoader();
        let textureEquirec;
        textureEquirec = textureLoader.load( '../imgs/holo2.jpg' );
        textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
        textureEquirec.colorSpace = THREE.SRGBColorSpace;
        
        
        const hdr = new RGBELoader().load( '../imgs/sepulchral_chapel_rotunda_2k.hdr' , function(){
            hdr.mapping = THREE.EquirectangularReflectionMapping;
        });

        return textureEquirec;
    };



    function createSphere(){


        const sphereGeometry = new THREE.IcosahedronGeometry(0.5, 15);
        
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
        
        const material = new THREE.MeshPhysicalMaterial( {
            // color: params.color,
            // metalness: params.metalness,
            roughness: params.roughness,
            //ior: params.ior,
            transmission: params.transmission,
            thickness: params.thickness,
            // specularIntensity: params.specularIntensity,
            // specularColor: params.specularColor,
            // opacity: params.opacity,
            // side: THREE.DoubleSide,
            clearcoat: 0.5,
        } );


        const sphere = new THREE.Mesh(sphereGeometry, material);

        return sphere;

    };

    

    useTick(({ timestamp, timeDiff }) => {
        const time = timestamp / 5000
        //sphere.material.userData.shader.uniforms.uTime.value = time
    })

    

    // function onHover(event) {
    //     // Calculate mouse position in normalized device coordinates
    //     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //     mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    //     // Raycast from camera to intersect objects
    //     raycaster.setFromCamera(mouse, camera);
    //     const intersects = raycaster.intersectObject(sphere);

    //     // If there's an intersection with the sphere, change cursor

    //     if (intersects.length > 0){
    //         container.classList.add('hover-pointer');
    //     }else {
    //         container.classList.remove('hover-pointer');
    //     }
        
    // }



    function init(){
        setupLights();

        scene.add(testPlane);
        scene.add(sphere);
        //scene.add(textMesh);


        console.log(scene);
        //scene.add(water);

        animate();
        
    }

    init();

    container.appendChild(renderer.domElement);

    }

export default startApp;