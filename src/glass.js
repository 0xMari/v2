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
    const numSphere = 3;
    const clock = new THREE.Clock();

    const scene = useScene();
    const container = document.getElementById('sfera');
    const camera = useCamera();
    camera.position.z = 6;
    const renderer = useRenderer();
    

    const { width, height } = useRenderSize()

    const sphere = createMetaBalls(2);
    sphere.position.set(0,0,2.2);

    const balls = createMetaBalls(7.5);
    balls.position.set(0,0,2.2);

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
    };


    function animate() {
        requestAnimationFrame(() => animate());
        const delta = clock.getDelta();

		time += delta * 0.3;
        updateCubes( balls, time, numBlobs);
        updateSphere(sphere, numSphere);

        
                
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
        const resolution = 40;

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

            const bally = Math.sin( i + 1.26 * time * ( 1.03 + 0.5 * Math.cos( 0.21 * i ) ) ) * 0.17 + 0.55;
            //const ballz = Math.abs( Math.cos( i + 1.12 * time * Math.cos( 1.22 + 0.1424 * i ) ) ) * 0.77; // dip into the floor
            const ballx = Math.sin( i + 1.32 * time * 0.1 * Math.abs( ( 0.92 + 0.53 * i ) ) ) * 0.4 + 0.5;
            const ballz= 0;
            

            object.addBall( ballx, bally, ballz, strength, subtract );

        }

        object.update();

    }

    function updateSphere( object, numblobs) {

        object.reset();

        // fill the field with some metaballs

        const subtract = 12;
        const strength = 1.2 / ( ( Math.sqrt( numblobs ) - 1 ) / 4 + 1 );

        for ( let i = 0; i < numblobs; i ++ ) {

            const ballx = Math.sin( i + 1.26 * time * ( 1.03 + 0.5 * Math.cos( 0.21 * i ) ) ) * 0.27 + 0.5;
            //const ballz = Math.abs( Math.cos( i + 1.12 * time * Math.cos( 1.22 + 0.1424 * i ) ) ) * 0.77; // dip into the floor
            const bally = Math.sin( i + 1.32 * time * 0.1 * Math.abs( ( 0.92 + 0.53 * i ) ) ) * 0.27 + 0.5;
            const ballz= 0;
            //const ballx = 0.5;
            //const bally = 0.5;

            object.addBall(ballx, bally, ballz, strength, subtract);

        }

        object.update();

    }
    

    // useTick(({ timestamp, timeDiff }) => {
    //     const time = timestamp / 5000
    //     //sphere.material.userData.shader.uniforms.uTime.value = time
    // })

    var pIntersect = new THREE.Vector3(); // point of intersection with an object (plane's point)
    var plane = new THREE.Plane();
    var pNormal = new THREE.Vector3(0, 0, 1); 
    var shift = new THREE.Vector3(); // distance between position of an object and points of intersection with the object
    var planeIntersect = new THREE.Vector3(); // point of intersection with the plane

    function onHover(event) {
        event.preventDefault();
        // Calculate mouse position in normalized device coordinates
        mouse.x = ((event.clientX / window.innerWidth) -0.5)* 2;
        mouse.y = - ((event.clientY / window.innerHeight) -0.5 ) * 2;

        // Make the sphere follow the mouse
        var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        vector.unproject( camera );
        var dir = vector.sub( camera.position ).normalize();
        var distance = (sphere.position.z - camera.position.z ) / dir.z;
        var pos = camera.position.clone().add( dir.multiplyScalar( distance )     );
        sphere.position.copy(pos);

        sphere.position.z = -2;

        // Make the sphere follow the mouse
        //sphere.position.set(event.clientX, event.clientY, 0);

        // Raycast from camera to intersect objects
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject([sphere]);
        
        if(intersects.length > 0) {
            
            pIntersect.copy(intersects[0].point);
            plane.setFromNormalAndCoplanarPoint(pNormal, pIntersect);
            shift.subVectors(intersects[0].object.position, intersects[0].point)
            isDragging = true;
            var dragObject = intersects[0].object;
            raycaster.ray.intersectPlane(plane, planeIntersect);
            dragObject.position.addVectors(planeIntersect, shift);
            //sphere.position.copy(point.setY(0));
        }
        

    
    }



    function init(){
        setupLights();

        scene.add(testPlane);
        scene.add(balls);
        scene.add(sphere);

        console.log(balls);
        console.log(sphere);



        animate();
        
    }

    init();

    container.appendChild(renderer.domElement);

    }

export default startApp;