//Hi
//import '/style.css'
import * as THREE from 'three';
import { Color, Euler, Object3D, Vector2, Vector3 } from 'three';
import { GLTFLoader } from './GLTFLoader.js';
import { DRACOLoader } from './DRACOLoader.js';
import { PointerLockControls } from './PointerLockControls.js';


console.log("here")

let camera, scene, dummyscene, renderer, controls;
let pcamera, ocamera;
var slideMode = false;

var back_mesh;
var next_mesh;
var x_mesh;

let camMoveX = 0;
let camMoveY = 0;
var clickmovepoint;
var clickmoving = false;

var slideMesh;

let loaded = false;
let modelsloaded = false;
let spun = false;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

var tooltipshowing = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const camVelocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

//Raycasting
const clickraycaster = new THREE.Raycaster();
let fraycaster = new THREE.Raycaster();
let braycaster = new THREE.Raycaster();;

//Sound
const listener = new THREE.AudioListener();

var videotexture;
var videomaterial;

const pointer = new THREE.Vector2();
var click = false;
var dblclick = false;

var collision;
var intObjects = [];
var mapButtons = [];
var TZmaps = [];

var intcolor=0;
var colorchanger = 0.05;
let whiteColor = new THREE.Color( 0xffffff );
let yellowColor = new THREE.Color( 0xffe600 );


var monitorsangles = { 'TZ_wall_monitors_01': -Math.PI/2,  'TZ_wall_monitors_02': -Math.PI/2, 'TZ_wall_monitors_03': -Math.PI, 'TZ_wall_monitors_04': -Math.PI, 'TZ_wall_monitors_08': 0, 'TZ_blockchain_02': Math.PI/2, 'TZ_blockchain_19': Math.PI/2, 'TZ_blockchain_20': -Math.PI, 'TZ_wall_monitors_05': -Math.PI, 'TZ_wall_monitors_06': 0, 'TZ_wall_monitors_07': 0, 'TZ_pillar_monitors_01': -Math.PI*1/4, 'TZ_pillar_monitors_02': Math.PI*1/4, 'TZ_pillar_monitors_03': Math.PI*4/4, 'TZ_pillar_monitors_04': -Math.PI*3/4};
//var monitorangles = [-Math.PI, 0, -Math.PI/2]
var slideDecks = [];
var slideIndices = {'TZ_wall_monitors_01': 0,  'TZ_wall_monitors_02': 1, 'TZ_wall_monitors_03': 2, 'TZ_wall_monitors_04': 0, 'TZ_wall_monitors_08': 0, 'TZ_blockchain_02': 0, 'TZ_blockchain_19': 1, 'TZ_blockchain_20': 2, 'TZ_wall_monitors_05': 3, 'TZ_wall_monitors_06': 4, 'TZ_wall_monitors_07': 5, 'TZ_pillar_monitors_01': 2, 'TZ_pillar_monitors_02': 3, 'TZ_pillar_monitors_03': 5, 'TZ_pillar_monitors_04': 4};
var mouseoverText = {'IZ_map_button_01': 'See the new EY Metaverse',
'IZ_map_button_02': 'Summary of the Chicago regneration event',
'IZ_map_button_03': 'Back to the entrance',
'IZ_map_button_04': 'See the intersection of art, technology, and business',
'IZ_map_button_05': 'Highlights from the market space',
'IZ_map_button_06': 'See the main stage events',
'IZ_map_button_07': 'Music made by an AI',
'IZ_map_button_08': 'Check out Web 3.0 and the Metaverse',
'IZ_map_button_09': 'EY\'s activity in future industries',
'IZ_map_button_010': 'Explore our thinking on emerging tech',
'IZ_map_button_011': 'Virtual reality area',

}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene

//Loading Manager
const manager = new THREE.LoadingManager();
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {

	console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

};

manager.onLoad = function ( ) {

	console.log( 'Loading complete!');
    modelsloaded = true;
    beginScene();

};


manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

    //TO DO: update hardcoding
	//console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    var progressBar = document.getElementById("loadingBar")
    progressBar.style.width = (itemsLoaded / 365 * 100) + '%';

};

manager.onError = function ( url ) {

	console.log( 'There was an error loading ' + url );

};

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader(manager)

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader(manager)
gltfLoader.setDRACOLoader(dracoLoader)



//Slides
var slides;
var currentSlide = 0;


function init() {

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.y = 1.5;
    

    scene = new THREE.Scene();
    //#000000
    //scene.background = new THREE.Color( 0xffffff );
    //scene.fog = new THREE.Fog( 0xffffff, 0, 750 );
    scene.background = new THREE.Color( 0x00000 );
    scene.fog = new THREE.Fog( 0x00000, 0, 750 );


    loadSlideButtons();

/**
 * Materials
 */
//loadFullModels();
loadBSlides();
loadAllModels();
addLights();

//loadSlides();
//ocamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100 )
ocamera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 1000 );
    ocamera.position.z = 1;
    scene.add(ocamera);





collision = new THREE.Object3D();
/*
gltfLoader.load(
    'exports/Collision_Boundary_wall.glb',
    (gltf) =>
    {
        collision = gltf.scene;
        const bakedTexture = textureLoader.load('exports/CR_2035_BAKED_FINAL/CR_2035_BAKED_FINAL/CR_2035_textures/CR_2035_textures_opaque/CR_2035_blanket.jpg')
            bakedTexture.flipY = false
            bakedTexture.encoding = THREE.sRGBEncoding
            const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })
        var tempMaterial = new THREE.MeshStandardMaterial({color: 0xffffff});
        collision.traverse((o) => {
            if(o.isMesh){
            console.log("traversing")
            console.log(o)
            o.material = bakedMaterial;
            }
          });
        collision.name = 'collision'
        scene.add(collision)
    }
)
*/


    controls = new PointerLockControls( camera, document.body );

    //Add sound
    camera.add( listener );

    //const blocker = document.getElementById( 'blocker' );
    //const instructions = document.getElementById( 'instructions' );

    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);
    window.addEventListener('mousemove', (e) =>
{
    pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
    //console.log(pointer.x)
})

    document.addEventListener( 'click', interact );
    document.addEventListener( 'dblclick', clickmove)

    controls.addEventListener( 'lock', function () {

        //instructions.style.display = 'none';
        //blocker.style.display = 'none';

    } );

    controls.addEventListener( 'unlock', function () {

        //blocker.style.display = 'block';
        //instructions.style.display = '';

    } );

    scene.add( controls.getObject() );

    const onKeyDown = function ( event ) {

        switch ( event.code ) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = true;
                break;

            case 'Space':
                if ( canJump === true ) velocity.y += 350;
                canJump = false;
                break;

            case 'Escape':
                exitSlideMode();
                
                break;

        }

    };

    const onKeyUp = function ( event ) {

        switch ( event.code ) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = false;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = false;
                break;

        }

    };

    document.addEventListener( 'keydown', onKeyDown );
    document.addEventListener( 'keyup', onKeyUp );

    fraycaster.far = 2;
    braycaster.far = 2;

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    //

    window.addEventListener( 'resize', onWindowResize );

    //var verse = Object3D.getObjectByName('ey_verse_screen');
    //verse.scale = new Vector3(-1,1,1);

}

function animate() {

    requestAnimationFrame( animate );

    const time = performance.now();

    //select buttons
    // Cast a ray

    if(loaded){
        if(slideMode){
            SlideInteract();
        } else{
            handleMove(time);
            toolTipper();
            intObjects = mapButtons;
            glow();
        }
    } else{
        camSpin();
    }

    if(loaded){
        //videotexture.needsUpdate = true;
    //videomaterial.needsUpdate = true;
        
    }
    
    prevTime = time;

    renderer.render( scene, camera );

}

function onWindowResize(){
    var three = document.getElementById( 'three' );
    //three.canvas.innerWidth = window.innerWidth;
    //three.canvas.innerHeight = window.innerHeight;
    // Update camera
    let width = window.innerWidth;
    let height = window.innerHeight;

    if(slideMode){
        pcamera.aspect = width / height;
        pcamera.updateProjectionMatrix();
    }
    else{
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    // Update renderer
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    console.log("resize!");
}








init();
animate();

console.log("huh")




function handleMove(time){
    if(click){
        //switchCamera(false);
            //Set to false so that held down click doesn't cast multiple rays
            console.log("current position: " + controls.getObject().position.x + "," + controls.getObject().position.y + "," + controls.getObject().position.z );
            const beuler = new Euler( 0, 0, 0, 'YXZ' );
            beuler.setFromQuaternion( camera.quaternion );
            console.log("current rot: " + beuler.y);
            click = false;
            //console.log("pointer: " + pointer.x + " " + pointer.y)
        clickraycaster.setFromCamera( pointer, camera );

        // calculate objects intersecting the picking ray
        const intersects = clickraycaster.intersectObjects( mapButtons );
        //console.log([collision])
        //console.log(scene.children)
        //console.log(mapButtons);

        for ( let i = 0; i < intersects.length; i ++ ) {
            console.log("yaaaay");
            console.log(intersects[i])
            console.log(intersects[i].object.name)
            if(intersects[i].object.name.includes('IZ_map_button')){
                var newPos = new Vector3(0, 0, 0);
                var newRot = 0;

                if(intersects[i].object.name.includes('01')){
                    newPos = new Vector3(-4.913926124799983,1.5,3.1473119049575);
                    newRot = -Math.PI;
                }
                else if(intersects[i].object.name.includes('02')){
                    newPos = new Vector3(-14.763254846552549,1.5,3.381983248102806);
                    newRot = -Math.PI;
                }
                else if(intersects[i].object.name.includes('03')){
                    newPos = new Vector3(-6.131198084298851,1.5,-4.94005691805949);
                    newRot = -Math.PI/2;
                }
                
                else if(intersects[i].object.name.includes('04')){
                    newPos = new Vector3(2.0107367878510556,1.5,-27.518229810088066);
                    newRot = -Math.PI/2;
                }
                else if(intersects[i].object.name.includes('05')){
                    newPos = new Vector3(36.357200959384286,1.5,-27.780869919116576);
                    newRot = Math.PI/2;
                }
                else if(intersects[i].object.name.includes('06')){
                    newPos = new Vector3(45.32320284406064,1.5,-4.000316721102775);
                    newRot = -Math.PI/2;
                }
                else if(intersects[i].object.name.includes('07')){
                    newPos = new Vector3(44.73183653949032,1.5,4.082937851489276);
                    newRot = -Math.PI/2;
                }
                else if(intersects[i].object.name.includes('08')){
                    newPos = new Vector3(27.86055241837079,1.5,-5.924285762145197);
                    newRot = 0;
                }
                else if(intersects[i].object.name.includes('09')){
                    newPos = new Vector3(14.228396830902655,1.5,-5.924025345405676);
                    newRot = 0;
                }
                


                //No y because height shouldn't be changed
                camera.position.x = newPos.x;
                camera.position.z = newPos.z;
                const neuler = new Euler( 0, newRot, 0, 'YXZ' );
                camera.quaternion.setFromEuler(neuler)
            }
            

        }
        console.log(TZmaps);
        const bintersects = clickraycaster.intersectObjects( TZmaps );
        if(bintersects.length>0){
        //for ( let i = 0; i < bintersects.length; i ++ ) {
            //console.log("logging object")
            //console.log(bintersects[i]);
            //console.log(bintersects[i].object.position);
            //console.log(bintersects[i].object.rotation);
            console.log("object name " + bintersects[0].object.name);
            currentSlide = 0;
            slides = slideDecks[slideIndices[bintersects[0].object.name]];
            displaySlides(bintersects[0].object.position, monitorsangles[bintersects[0].object.name]);
            slideMesh = bintersects[0].object;
            //console.log(slideMesh);
            //console.log(bintersects[i]);
            switchCamera(false);
            //console.log("hi blockchain")
        //}
    }
    }



    if(dblclick){
        dblclick = false;
        clickraycaster.setFromCamera( pointer, camera );
        const intersects = clickraycaster.intersectObjects( scene.children );

        for ( let i = 0; i < intersects.length; i ++ ) {
            clickmoving = true;
            clickmovepoint = intersects[i].point;
            break;
        }
    }
    

    //Collision
    fraycaster.setFromCamera(new Vector2(0, 0), camera);
    const coll = fraycaster.intersectObjects( [collision]);
    //console.log(coll);
    if(coll.length>0){
        //console.log("collide!!!")
        moveForward = false;
    }

    braycaster.setFromCamera(new Vector2(0, 0), camera);
    braycaster.direction = -braycaster.direction;
    const bcoll = braycaster.intersectObjects( [collision] );
    if(bcoll.length>0){
        moveBackward = false;
    }


        //Controls stuff




        //Keyboard controls

        const delta = ( time - prevTime ) / 2000;



        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        camVelocity.x -= camVelocity.x * 10.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize(); // this ensures consistent movements in all directions

        if ( moveForward || moveBackward ) velocity.z -= direction.z * 70.0 * delta;
        
        
        //disable strafing, just cameramovement
        if ( moveLeft || moveRight ) camVelocity.x -= direction.x * 100.0 * delta;

        


        //Camera move
        const _euler = new Euler( 0, 0, 0, 'YXZ' );
        _euler.setFromQuaternion( camera.quaternion );

        //Add camera and mouse (ideally one should be 0)
        _euler.y += camVelocity.x * 0.002 + camMoveX * 0.0002;
        //Just from mouse
        _euler.x += camMoveY * 0.0002;
		camera.quaternion.setFromEuler( _euler );
        //console.log(_euler);
        //console.log("Euler : " + _euler.x + ", " + _euler.y + ", " + _euler.z)


        //intercept with dblclick move
        if(clickmoving){
            var curPos = controls.getObject().position;
            if(curPos.distanceTo(clickmovepoint)<2){
                clickmoving = false;
            }
            
            else{
                var zvec = clickmovepoint.z - curPos.z;
                var xvec = clickmovepoint.x - curPos.x;
                //console.log("zvec " + zvec + " xvec " + xvec);
                var moveVec = new Vector2(xvec, zvec);
                moveVec = moveVec.normalize();
                xvec = moveVec.x;
                zvec = moveVec.y;
                var moveVecAngle = -Math.atan2(-zvec, -xvec)+Math.PI/2;
                if (moveVecAngle>Math.PI){
                    //moveVecAngle = -Math.PI + (moveVecAngle - Math.PI)
                }
                const eulerangle = new Euler( 0, 0, 0, 'YXZ' );
                eulerangle.setFromQuaternion( camera.quaternion );
                console.log("vector angle " + moveVecAngle + " and rotation " + eulerangle.y);
                var angle = moveVecAngle-eulerangle.y;
                console.log("combined angle " + angle + " sin " + Math.sin(angle))
                var fmove = zvec*Math.cos(angle) + xvec*Math.sin(angle);
                var rmove = xvec*Math.cos(angle) - zvec*Math.sin(angle);
                var speed = 7;
                velocity.z = -moveVec.length()*Math.cos(angle)*speed;
                velocity.x = moveVec.length()*Math.sin(angle)*speed;
            }
            console.log(clickmovepoint.z - curPos.z);
        }



        controls.moveForward( - velocity.z * delta );
        controls.moveRight( - velocity.x * delta );

        controls.getObject().position.y += ( velocity.y * delta ); // new behavior
        if ( controls.getObject().position.y < 1.5 ) {

            velocity.y = 0;
            controls.getObject().position.y = 1.5;

        }
}

function SlideInteract(){
    var currentIntersect;
    if(slideMode){
    const objectsForRayCast = [back_mesh, next_mesh, x_mesh]
    clickraycaster.setFromCamera( pointer, camera );
    const intersecto = clickraycaster.intersectObjects(objectsForRayCast)
    
    for(const object of objectsForRayCast){
        object.material.color.set('#ffffff')
    }

    for(const intersect of intersecto){
        //console.log("setting color")
        intersect.object.material.color.set('#ffff00')
    }
    currentIntersect = intersecto[0];
    }


        //Handle raycasting
    if(click){


        //Just for testing slides
    if(slideMode){

        
        if(currentIntersect){
            if (currentIntersect.object === back_mesh){
                if(currentSlide > 0){
                    currentSlide--;
                } else {
                    console.log('at the beginning of the deck, no more slides for back')                
                }
            } 
            else if (currentIntersect.object === next_mesh){
                if(currentSlide < slides.length-1){
                    currentSlide++;
                } else {
                    console.log('at the end of the deck, no more slides next')  
                }
                
            }
            else if (currentIntersect.object === x_mesh){
                exitSlideMode();
                
            }
            console.log(currentSlide);
            console.log("slide change")
            console.log(slideMesh)

            slideMesh.material = slides[currentSlide];
            //slideMesh.visible = false;
        }

        
        
        }

        click = false;

        

    }
}

function toolTipper(){
    
    clickraycaster.setFromCamera( pointer, camera );
    const intersecto = clickraycaster.intersectObjects(mapButtons)
    if(intersecto.length>0){
        var tooltip = document.getElementById( 'tooltip' );
        tooltip.innerText = mouseoverText[intersecto[0].object.name];
        //pointer reverse map
        var mouseX = ((pointer.x+1)/2)*window.innerWidth;
        var mouseY = ((pointer.y-1)/-2)*window.innerHeight;

        tooltip.style.visibility = "visible";
        tooltip.style.left = mouseX + "px";
        tooltip.style.top = mouseY + "px";
        //tooltip.style.display = "none"
        //console.log("Hi!")
        tooltipshowing = true
    }
    else if(tooltipshowing){
        var tooltip = document.getElementById('tooltip');
        tooltip.style.visibility = "hidden";
        //console.log("turn off!")
        tooltipshowing = false
    }   
}


function interact(e){
    //TO DO: If it's on the div, it should do nothing
    if(!controllerclickcheck(window.innerWidth-e.pageX, window.innerHeight-e.pageY)){
        pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
        click = true;
        console.log("interacting");
    }
}

function clickmove(e){
    if(!controllerclickcheck(window.innerWidth-e.pageX, window.innerHeight-e.pageY)){
        pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
        dblclick = true;
        click = false;
    }
}

function mouseUp()
    {
        window.removeEventListener('mousemove', divMove, true);
        //firstClick = true;
        camMoveX = 0;
        camMoveY = 0;
        click = false;
    }

    function mouseDown(e){
        window.addEventListener('mousemove', divMove, true);
        var xpos = e.pageX;
        var ypos = e.pageY;
        console.log(window.innerWidth-ypos)
        xpos = (window.innerWidth-xpos);
        ypos = (window.innerHeight-ypos);
        
        if(controllerclickcheck(xpos, ypos)){
            xpos = (50+175/2)-xpos;
            ypos = (50+175/2)-ypos;
            camMoveX = -xpos;
            camMoveY = -ypos;
            console.log(xpos + " " + ypos);
        }
        
        //click = true;
    }

    function divMove(e){
        
    }

function makeTexture(filename){
    const forumTexture = textureLoader.load(filename)
    forumTexture.flipY = false
    forumTexture.encoding = THREE.sRGBEncoding

    const forumMaterial = new THREE.MeshLambertMaterial({ map: forumTexture});
    return forumMaterial;
}

function loadAllModels(){
    var models = ['ceiling.glb', 'CR_2035_BAKED_opaque.glb', 'CR_2035_BAKED_transparent.glb', 'EY_VERSE_BAKED.glb', 'Floor_GOBO_spots.glb', 'Forum_BAKED_opaque.glb', 'Forum_BAKED_transparent.glb', 'IR_Map_screen.glb', 'IR_Map_screen_frame.glb', 'IZ_BAKED_MAP_screens.glb', 'IZ_BAKED_MAP_screen_frame.glb', 'IZ_BAKED_opaque.glb', 'IZ_map_button_01.glb', 'IZ_map_button_010.glb', 'IZ_map_button_011.glb', 'IZ_map_button_02.glb', 'IZ_map_button_03.glb', 'IZ_map_button_04.glb', 'IZ_map_button_05.glb', 'IZ_map_button_06.glb', 'IZ_map_button_07.glb', 'IZ_map_button_08.glb', 'IZ_map_button_09.glb', 'IZ_nav_cube_1.glb', 'IZ_nav_cube_10.glb', 'IZ_nav_cube_11.glb', 'IZ_nav_cube_2.glb', 'IZ_nav_cube_3.glb', 'IZ_nav_cube_4.glb', 'IZ_nav_cube_5.glb', 'IZ_nav_cube_6.glb', 'IZ_nav_cube_7.glb', 'IZ_nav_cube_8.glb', 'IZ_nav_cube_9.glb', 'Market_BAKED_FINAL_opaque.glb', 'Market_BAKED_FINAL_transparent.glb', 'outer_walls.glb', 'Purple_Pod_BAKED_opaque.glb', 'Space_Pod_BAKED_opaque.glb', 'Space_Pod_BAKED_transparent.glb', 'SpeakEasy_BAKED_opaque.glb', 'SpeakEasy_BAKED_transparent.glb', 'TZ_BAKED_opaque.glb', 'TZ_blockchain_02.glb', 'TZ_blockchain_19.glb', 'TZ_blockchain_20.glb', 'TZ_Curved_screens_01.glb', 'TZ_Curved_screens_02.glb', 'TZ_Curved_screens_03.glb', 'TZ_Curved_screens_04.glb', 'TZ_Curved_screens_05.glb', 'TZ_Curved_screens_06.glb', 'TZ_pillar_monitors_01.glb', 'TZ_pillar_monitors_02.glb', 'TZ_pillar_monitors_03.glb', 'TZ_pillar_monitors_04.glb', 'TZ_wall_monitors_01.glb', 'TZ_wall_monitors_02.glb', 'TZ_wall_monitors_03.glb', 'TZ_wall_monitors_04.glb', 'TZ_wall_monitors_05.glb', 'TZ_wall_monitors_06.glb', 'TZ_wall_monitors_07.glb', 'TZ_wall_monitors_08.glb', 'VR_Bar_BAKED_opaque.glb', 'VR_Bar_BAKED_transparent.glb']
    var fulltext = ['CR_2035_blanket.jpg', 'CR_2035_ceiling.jpg', 'CR_2035_floor.jpg', 'CR_2035_furniture.jpg', 'CR_2035_screen.jpg', 'CR_2035_signage.jpg', 'CR_2035_video_wall.jpg', 'CR_2035_wall.jpg', 'ey_verse_curtains.jpg', 'ey_verse_floor.jpg', 'ey_verse_inner_walls.jpg', 'ey_verse_outer_walls.jpg', 'ey_verse_rafters.jpg', 'ey_verse_rug.jpg', 'ey_verse_screen.jpg', 'ey_verse_side_rails.jpg', 'ey_verse_speakers_1.jpg', 'ey_verse_speakers_2.jpg', 'ey_verse_stools.jpg', 'ey_verse_tables_and_chairs.jpg', 'Forum_Chairs.jpg', 'Forum_Floor.jpg', 'Forum_Light_gels.jpg', 'Forum_light_truss.png', 'Forum_Lower_Benches.jpg', 'Forum_Main_Stage.jpg', 'Forum_Rafters.jpg', 'Forum_Rear_wall.jpg', 'Forum_Screens.jpg', 'Forum_stage.jpg', 'Forum_Stage_and_Walls.jpg', 'Forum_Tables.jpg', 'Forum_Upper_Benches.jpg', 'Forum_wall_panels.jpg', 'IR_Welcome_Map_2.jpg', 'IZ_arches.jpg', 'IZ_cafe_counter.jpg', 'IZ_chairs.jpg', 'IZ_desk.jpg', 'IZ_directions_1.jpg', 'IZ_directions_2.jpg', 'IZ_floor.jpg', 'IZ_furniture.jpg', 'IZ_map_button_01.jpg', 'IZ_map_button_02.jpg', 'IZ_map_button_03.jpg', 'IZ_map_button_04.jpg', 'IZ_map_button_05.jpg', 'IZ_map_button_06.jpg', 'IZ_map_button_07.jpg', 'IZ_map_button_08.jpg', 'IZ_map_button_09.jpg', 'IZ_map_button_010.jpg', 'IZ_map_button_011.jpg', 'IZ_rafters.jpg', 'IZ_seat_boxes.jpg', 'IZ_signage_1.jpg', 'IZ_signage_2.jpg', 'IZ_signage_3.jpg', 'IZ_sofa.jpg', 'IZ_stage.jpg', 'IZ_Startup_zone_screen.jpg', 'IZ_tables.jpg', 'IZ_walls.jpg', 'IZ_Wall_fix.jpg', 'IZ_welcome_corridor_screen_02.jpg', 'IZ_welcome_corridor_screen_03.jpg', 'Market_baklava_1.png', 'Market_baklava_2.png', 'Market_buffet_1.jpg', 'Market_buffet_2.jpg', 'Market_buffet_3.jpg', 'Market_buffet_4.jpg', 'Market_counters.jpg', 'Market_desserts_1.png', 'Market_desserts_2.png', 'Market_desserts_3.png', 'Market_desserts_4.png', 'Market_directional_signage_1.jpg', 'Market_directional_signage_2.jpg', 'Market_Floor.jpg', 'Market_foliage_bakery_wall.png', 'Market_foliage_hanging.png', 'Market_foliage_video_wall_1.png', 'Market_foliage_video_wall_2.png', 'Market_foliage_video_wall_3.png', 'Market_foliage_video_wall_4.png', 'Market_Forum_signage.jpg', 'Market_furniture.jpg', 'Market_green_panels.jpg', 'Market_innovation_text_1.jpg', 'Market_Light_gels.jpg', 'market_mound.jpg', 'Market_overhead_screen_1.png', 'Market_overhead_screen_2.png', 'Market_overhead_screen_3.png', 'Market_overhead_screen_4.png', 'Market_overhead_screen_5.jpg', 'Market_pink_treats.png', 'Market_Rafters.jpg', 'Market_Scaffold.jpg', 'Market_screens_01.jpg', 'Market_screens_02.jpg', 'Market_Signage_1.jpg', 'Market_Signage_2.jpg', 'Market_signage_stands.jpg', 'Market_sign_islands.jpg', 'Market_trellis.png', 'Market_walls.jpg', 'Market_waterfall_screen.jpg', 'Purple_Pod_chairs.jpg', 'Purple_pod_floor_ceiling.jpg', 'Purple_pod_screen.jpg', 'Purple_Pod_walls.jpg', 'Space_Pod_chairs.jpg', 'Space_Pod_floor_ceiling.jpg', 'Space_Pod_Inner_wall.jpg', 'Space_Pod_screen.jpg', 'Space_Pod_truss.png', 'Space_Pod_wood_pillars.jpg', 'SpeakEasy_barstools.jpg', 'SpeakEasy_Bar_Back_Bottles.jpg', 'SpeakEasy_Bar_Back_Lighting.jpg', 'SpeakEasy_bar_shelves.jpg', 'SpeakEasy_Bar_top.jpg', 'SpeakEasy_brick_wall.jpg', 'SpeakEasy_edison_lamps.png', 'SpeakEasy_floor.jpg', 'SpeakEasy_liquor_bottles.png', 'SpeakEasy_paneled_wall.jpg', 'SpeakEasy_rafters.jpg', 'SpeakEasy_screen.jpg', 'SpeakEasy_Table_and_Chairs.jpg', 'SpeakEasy_walls.jpg', 'TZ_blockchain_01.jpg', 'TZ_blockchain_02.jpg', 'TZ_blockchain_19.jpg', 'TZ_blockchain_20.jpg', 'TZ_Curved_screens_01.jpg', 'TZ_Curved_screens_02.jpg', 'TZ_Curved_screens_03.jpg', 'TZ_Curved_screens_04.jpg', 'TZ_Curved_screens_05.jpg', 'TZ_Curved_screens_06.jpg', 'TZ_Floor.jpg', 'TZ_mirror_wall.jpg', 'TZ_murals_01.jpg', 'TZ_outer_walls.jpg', 'TZ_pillar_monitors_01.jpg', 'TZ_pillar_monitors_02.jpg', 'TZ_pillar_monitors_03.jpg', 'TZ_pillar_monitors_04.jpg', 'TZ_Projectors.jpg', 'TZ_rafters.jpg', 'TZ_signage.jpg', 'TZ_wall_monitors_01.jpg', 'TZ_wall_monitors_02.jpg', 'TZ_wall_monitors_03.jpg', 'TZ_wall_monitors_04.jpg', 'TZ_wall_monitors_05.jpg', 'TZ_wall_monitors_06.jpg', 'TZ_wall_monitors_07.jpg', 'TZ_wall_monitors_08.jpg', 'VR_Bar_back_wall_fix.jpg', 'VR_Bar_Direction_Graphic.jpg', 'VR_Bar_display01.jpg', 'VR_Bar_Floor.jpg', 'VR_Bar_floor_lights.jpg', 'VR_Bar_furniture.jpg', 'VR_Bar_Inner_walls.jpg', 'VR_Bar_Outer_walls.jpg', 'VR_Bar_screens01.jpg', 'VR_Bar_screens02.jpg', 'VR_Bar_screens03.jpg', 'VR_Bar_screens04.jpg', 'VR_Bar_shooters.png', 'VR_Bar_Wall_fix.jpg', 'VR_Bar_yellow_Arches.jpg']
    for(var i = 0; i < models.length; i++){
        var modelname = 'exports/models/' + models[i];
        var trans = modelname.includes('transparent');
        loadModel(modelname, fulltext, 'exports/textures/', trans)
    }
}

function loadFullModels(){
    
    //CR
    //var crList = ['CR_2035_blanket.jpg', 'CR_2035_ceiling.jpg', 'CR_2035_floor.jpg', 'CR_2035_furniture.jpg', 'CR_2035_screen.jpg', 'CR_2035_video_wall.jpg', 'CR_2035_wall.jpg']
    //loadTextureModel('exports/CR_2035_BAKED_FINAL/CR_2035_BAKED_FINAL/CR_2035_BAKED_opaque.glb', crList, 'exports/CR_2035_BAKED_FINAL/CR_2035_BAKED_FINAL/CR_2035_textures/CR_2035_textures_opaque/', false)
    //var crListT = ['CR_2035_truss.png']
    //loadTextureModel('exports/CR_2035_BAKED_FINAL/CR_2035_BAKED_FINAL/CR_2035_BAKED_transparent.glb', crListT, 'exports/CR_2035_BAKED_FINAL/CR_2035_BAKED_FINAL/CR_2035_textures/CR_2035_textures_transparent/', true)
    
    var crLists = ['CR_2035_blanket.jpg', 'CR_2035_ceiling.jpg', 'CR_2035_floor.jpg', 'CR_2035_furniture.jpg', 'CR_2035_screen.jpg', 'CR_2035_video_wall.jpg', 'CR_2035_wall.jpg', 'CR_2035_truss.png']
    loadModel('exports/CR_2035_BAKED_FINAL/CR_2035_BAKED_FINAL/CR_2035_BAKED_opaque.glb', crLists, 'exports/textures/')
    loadModel('exports/CR_2035_BAKED_FINAL/CR_2035_BAKED_FINAL/CR_2035_BAKED_transparent.glb', crLists, 'exports/textures/')

    //EYVerse
    var EYVerseList = ['ey_verse_curtains.jpg', 'ey_verse_floor.jpg', 'ey_verse_inner_walls.jpg', 'ey_verse_outer_walls.jpg', 'ey_verse_rafters.jpg', 'ey_verse_rug.jpg', 'ey_verse_screen.jpg', 'ey_verse_side_rails.jpg', 'ey_verse_speakers_1.jpg', 'ey_verse_speakers_2.jpg', 'ey_verse_stools.jpg', 'ey_verse_tables_and_chairs.jpg']
    loadTextureModel('exports/EY_VERSE_BAKED_GLB/EY_VERSE_BAKED_GLB/EY_VERSE_BAKED_.glb', EYVerseList, 'exports/EY_VERSE_BAKED_GLB/EY_VERSE_BAKED_GLB/EY_VERSE_BAKED_GLB_TEXTURES/')

    //Forum
    var forumListO = ['Forum_Chairs.jpg', 'Forum_Floor.jpg', 'Forum_Light_gels.jpg', 'Forum_Lower_Benches.jpg', 'Forum_Main_Stage.jpg', 'Forum_Rafters.jpg', 'Forum_Rear_wall.jpg', 'Forum_Screens_1.jpg', 'Forum_Screens_2.jpg', 'Forum_Screens_3.jpg', 'Forum_stage.jpg', 'Forum_Stage_and_Walls.jpg', 'Forum_Tables.jpg', 'Forum_Upper_Benches.jpg', 'Forum_wall_panels.jpg']
    loadTextureModel('exports/Forum_BAKED_FINAL/Forum_BAKED_FINAL/Forum_BAKED_opaque.glb', forumListO, 'exports/Forum_BAKED_FINAL/Forum_BAKED_FINAL/Forum_BAKED_textures/Forum_BAKED_textures_opaque/')
    var forumListT = ['Forum_light_truss.png']
    loadTextureModel('exports/Forum_BAKED_FINAL/Forum_BAKED_FINAL/Forum_BAKED_transparent.glb', forumListT, 'exports/Forum_BAKED_FINAL/Forum_BAKED_FINAL/Forum_BAKED_textures/Forum_BAKED_textures_transparent/', true)

    //IZ
    var IZListO = ['IZ_arches.jpg', 'IZ_cafe_counter.jpg', 'IZ_chairs.jpg', 'IZ_desk.jpg', 'IZ_directions_1.jpg', 'IZ_directions_2.jpg', 'IZ_floor.jpg', 'IZ_furniture.jpg', 'IZ_rafters.jpg', 'IZ_seat_boxes.jpg', 'IZ_signage_1.jpg', 'IZ_signage_2.jpg', 'IZ_signage_3.jpg', 'IZ_sofa.jpg', 'IZ_stage.jpg', 'IZ_Startup_zone_screen.jpg', 'IZ_tables.jpg', 'IZ_walls.jpg', 'IZ_Wall_fix.jpg', 'IZ_welcome_corridor_screen_02.jpg', 'IZ_welcome_corridor_screen_03.jpg']
    loadTextureModelInteractive('exports/IZ_BAKED_FINAL/IZ_BAKED_FINAL/IZ_BAKED_opaque.glb', IZListO, 'exports/IZ_BAKED_FINAL/IZ_BAKED_FINAL/IZ_BAKED_textures/IZ_BAKED_textures_opaque/', 'IZ_map_button', mapButtons)
    //var IZListT = ['IZ_directions.png']
    //loadTextureModel('exports/IZ_BAKED_FINAL/IZ_BAKED_FINAL/IZ_BAKED_transparent.glb', IZListT, 'exports/IZ_BAKED_FINAL/IZ_BAKED_FINAL/IZ_Textures/IZ_Transparent/')
    var IZListScreens = ['IR_Map_screen.jpg', 'IZ_map_button_01.jpg', 'IZ_map_button_010.jpg', 'IZ_map_button_011.jpg', 'IZ_map_button_02.jpg', 'IZ_map_button_03.jpg', 'IZ_map_button_04.jpg', 'IZ_map_button_05.jpg', 'IZ_map_button_06.jpg', 'IZ_map_button_07.jpg', 'IZ_map_button_08.jpg', 'IZ_map_button_09.jpg']
    loadScreens(IZListScreens, 'exports/IZ_BAKED_FINAL/IZ_BAKED_FINAL/IZ_NAV_MAP/', 'exports/IZ_BAKED_FINAL/IZ_BAKED_FINAL/IZ_BAKED_textures/IZ_BAKED_textures_opaque/')

    //Market
    var mtextureListO = ['Market_buffet_1.jpg', 'Market_buffet_2.jpg', 'Market_buffet_3.jpg', 'Market_buffet_4.jpg', 'Market_counters.jpg', 'Market_directional_signage_1.jpg', 'Market_directional_signage_2.jpg', 'Market_Floor.jpg', 'Market_Forum_signage.jpg', 'Market_furniture.jpg', 'Market_green_panels.jpg', 'Market_innovation_text_1.jpg', 'Market_Light_gels.jpg', 'Market_mound.jpg', 'Market_overhead_screen_5.jpg', 'Market_Rafters.jpg', 'Market_Scaffold.jpg', 'Market_screens_01.jpg', 'Market_screens_02.jpg', 'Market_Signage_1.jpg', 'Market_Signage_2.jpg', 'Market_signage_stands.jpg', 'Market_sign_islands.jpg', 'Market_walls.jpg', 'Market_waterfall_screen.jpg']
    //loadTextureModel('exports/Market_BAKED_FINAL/Market_BAKED_FINAL/Market_BAKED_FINAL_Opaque2.glb', mtextureListO, 'exports/Market_BAKED_FINAL/Market_BAKED_FINAL/Market_BAKED_FINAL_textures_opaque/')
    var mtextureListT = ['Market_baklava_1.png', 'Market_baklava_2.png', 'Market_desserts_1.png', 'Market_desserts_2.png', 'Market_desserts_3.png', 'Market_desserts_4.png', 'Market_foliage_bakery_wall.png', 'Market_foliage_hanging.png', 'Market_foliage_video_wall_1.png', 'Market_foliage_video_wall_2.png', 'Market_foliage_video_wall_3.png', 'Market_foliage_video_wall_4.png', 'Market_overhead_screen_1.png', 'Market_overhead_screen_2.png', 'Market_overhead_screen_3.png', 'Market_overhead_screen_4.png', 'Market_pink_treats.png', 'Market_trellis.png']
    //loadTextureModel('exports/Market_BAKED_FINAL/Market_BAKED_FINAL/Market_BAKED_FINAL_Transparent2.glb', mtextureListT, 'exports/Market_BAKED_FINAL/Market_BAKED_FINAL/Market_BAKED_FINAL_textures_transparent/', true)

    var fulltexturelist = ['Market_baklava_1.png', 'Market_baklava_2.png', 'Market_desserts_1.png', 'Market_desserts_2.png', 'Market_desserts_3.png', 'Market_desserts_4.png', 'Market_foliage_bakery_wall.png', 'Market_foliage_hanging.png', 'Market_foliage_video_wall_1.png', 'Market_foliage_video_wall_2.png', 'Market_foliage_video_wall_3.png', 'Market_foliage_video_wall_4.png', 'Market_overhead_screen_1.png', 'Market_overhead_screen_2.png', 'Market_overhead_screen_3.png', 'Market_overhead_screen_4.png', 'Market_pink_treats.png', 'Market_trellis.png', 'Market_buffet_1.jpg', 'Market_buffet_2.jpg', 'Market_buffet_3.jpg', 'Market_buffet_4.jpg', 'Market_counters.jpg', 'Market_directional_signage_1.jpg', 'Market_directional_signage_2.jpg', 'Market_Floor.jpg', 'Market_Forum_signage.jpg', 'Market_furniture.jpg', 'Market_green_panels.jpg', 'Market_innovation_text_1.jpg', 'Market_Light_gels.jpg', 'Market_mound.jpg', 'Market_overhead_screen_5.jpg', 'Market_Rafters.jpg', 'Market_Scaffold.jpg', 'Market_screens_01.jpg', 'Market_screens_02.jpg', 'Market_Signage_1.jpg', 'Market_Signage_2.jpg', 'Market_signage_stands.jpg', 'Market_sign_islands.jpg', 'Market_walls.jpg', 'Market_waterfall_screen.jpg']
    loadModel('exports/Market_BAKED_FINAL/Market_BAKED_FINAL/Market_BAKED_FINAL_Opaque2.glb', fulltexturelist, 'exports/textures/')
    loadModel('exports/Market_BAKED_FINAL/Market_BAKED_FINAL/Market_BAKED_FINAL_Transparent2.glb', fulltexturelist, 'exports/textures/', true);
    //PurplePod
    var PurpList = ['Purple_Pod_chairs.jpg', 'Purple_pod_floor_ceiling.jpg', 'Purple_pod_screen.jpg', 'Purple_Pod_walls.jpg']
    loadTextureModel('exports/Purple_Pod_BAKED_FINAL/Purple_Pod_BAKED_FINAL/Purple_Pod_BAKED_opaque.glb', PurpList, 'exports/Purple_Pod_BAKED_FINAL/Purple_Pod_BAKED_FINAL/Purple_Pod_textures/Purple_Pod_textures_opaque/')

    //SpacePod
    var SpaceListO = ['Space_Pod_chairs.jpg', 'Space_Pod_floor_ceiling.jpg', 'Space_Pod_Inner_wall.jpg', 'Space_Pod_screen.jpg', 'Space_Pod_wood_pillars.jpg']
    loadTextureModel('exports/Space_Pod_BAKED_FINAL/Space_Pod_BAKED_FINAL/Space_Pod_BAKED_opaque.glb', SpaceListO, 'exports/Space_Pod_BAKED_FINAL/Space_Pod_BAKED_FINAL/Space_Pod_textures/Space_Pod_textures_opaque/')
    var SpaceListT = ['Space_Pod_truss.png']
    loadTextureModel('exports/Space_Pod_BAKED_FINAL/Space_Pod_BAKED_FINAL/Space_Pod_BAKED_transparent.glb', SpaceListT, 'exports/Space_Pod_BAKED_FINAL/Space_Pod_BAKED_FINAL/Space_Pod_textures/Space_Pod_textures_transparent/', true)

    //Speakeasy
    var SpeakEasyListO = ['SpeakEasy_barstools.jpg', 'SpeakEasy_Bar_Back_Bottles.jpg', 'SpeakEasy_Bar_Back_Lighting.jpg', 'SpeakEasy_bar_shelves.jpg', 'SpeakEasy_Bar_top.jpg', 'SpeakEasy_brick_wall.jpg', 'SpeakEasy_floor.jpg', 'SpeakEasy_paneled_wall.jpg', 'SpeakEasy_rafters.jpg', 'SpeakEasy_screen.jpg', 'SpeakEasy_Table_and_Chairs.jpg', 'SpeakEasy_walls.jpg']
    loadTextureModel('exports/SpeakEasy_BAKED_FINAL/SpeakEasy_BAKED_FINAL/SpeakEasy_BAKED_opaque.glb', SpeakEasyListO, 'exports/SpeakEasy_BAKED_FINAL/SpeakEasy_BAKED_FINAL/SpeakEasy_BAKED_textures/SpeakEasy_BAKED_textures_opaque/')
    var SpeakEasyListT = ['SpeakEasy_edison_lamps.png', 'SpeakEasy_liquor_bottles.png']
    loadTextureModel('exports/SpeakEasy_BAKED_FINAL/SpeakEasy_BAKED_FINAL/SpeakEasy_BAKED_transparent.glb', SpeakEasyListT, 'exports/SpeakEasy_BAKED_FINAL/SpeakEasy_BAKED_FINAL/SpeakEasy_BAKED_textures/SpeakEasy_BAKED_textures_transparent/', true)
 
    //TZ
    //
    var TZListO = ['TZ_blockchain.jpg', 'TZ_Curved_screens_01.jpg', 'TZ_Curved_screens_02.jpg', 'TZ_Curved_screens_06.jpg', 'TZ_Curved_screens_06.png', 'TZ_Floor.jpg', 'TZ_mirror_wall.jpg', 'TZ_murals_01.jpg', 'TZ_outer_walls.jpg', 'TZ_pillar_monitors.jpg', 'TZ_Projectors.jpg', 'TZ_rafters.jpg', 'TZ_wall_monitors.jpg']
    loadTextureModelInteractive('exports/TZ_BAKED_FINAL/TZ_BAKED_FINAL/TZ_Experiment2.glb', TZListO, 'exports/TZ_BAKED_FINAL/TZ_BAKED_FINAL/TZ_BAKED_Textures/TZ_BAKED_opaque/', 'blockchain', TZmaps)
    var TZListScreens = ['TZ_blockchain_02.jpg', 'TZ_blockchain_19.jpg', 'TZ_blockchain_20.jpg', 'TZ_Curved_screens_01.jpg', 'TZ_Curved_screens_02.jpg', 'TZ_Curved_screens_03.jpg', 'TZ_Curved_screens_04.jpg', 'TZ_Curved_screens_05.jpg', 'TZ_Curved_screens_06.jpg', 'TZ_pillar_monitors_01.jpg', 'TZ_pillar_monitors_02.jpg', 'TZ_pillar_monitors_03.jpg', 'TZ_pillar_monitors_04.jpg', 'TZ_wall_monitors_01.jpg', 'TZ_wall_monitors_02.jpg', 'TZ_wall_monitors_03.jpg', 'TZ_wall_monitors_04.jpg', 'TZ_wall_monitors_05.jpg', 'TZ_wall_monitors_06.jpg', 'TZ_wall_monitors_07.jpg', 'TZ_wall_monitors_08.jpg']
    loadScreens(TZListScreens, 'exports/TZ_BAKED_FINAL/TZ_BAKED_FINAL/TZ_Screens_Geometry/TZ_Screens_Geometry/', 'dist/exports/TZ_BAKED_FINAL/TZ_BAKED_FINAL/TZ_Screens_Textures/TZ_Screens_Textures/')
    

    //VRBar
    var VRBarListO = ['VR_Bar_back_wall_fix.jpg', 'VR_Bar_Direction_Graphic.jpg', 'VR_Bar_display01.jpg', 'VR_Bar_Floor.jpg', 'VR_Bar_floor_lights.jpg', 'VR_Bar_furniture.jpg', 'VR_Bar_Inner_walls.jpg', 'VR_Bar_Outer_walls.jpg', 'VR_Bar_screens01.jpg', 'VR_Bar_screens02.jpg', 'VR_Bar_screens03.jpg', 'VR_Bar_screens04.jpg', 'VR_Bar_Wall_fix.jpg', 'VR_Bar_yellow_Arches.jpg']
    loadTextureModel('exports/VR_Bar_BAKED_FINAL/VR_Bar_BAKED_FINAL/VR_Bar_BAKED_opaque.glb', VRBarListO, 'exports/VR_Bar_BAKED_FINAL/VR_Bar_BAKED_FINAL/VR_Bar_BAKED_textures/VR_Bar_BAKED_opaque/')
    var VRBarListT = ['VR_Bar_shooters.png']
    loadTextureModel('exports/VR_Bar_BAKED_FINAL/VR_Bar_BAKED_FINAL/VR_Bar_BAKED_transparent.glb', VRBarListT, 'exports/VR_Bar_BAKED_FINAL/VR_Bar_BAKED_FINAL/VR_Bar_BAKED_textures/VR_Bar_BAKED_transparent/', true)
    
    //Misc
    loadTextureModel('exports/Miscmodels/Miscmodels/outer_walls.glb', [], '')
    loadTextureModel('exports/Miscmodels/Miscmodels/ceiling.glb', [], '')
    loadTextureModel('exports/Miscmodels/Miscmodels/VR_BAR_carpet_dots.glb', [], '')
    loadTextureModel('exports/Miscmodels/Miscmodels/Innovation_cafe_carpet_dots.glb', [], '')
    
}



function loadBSlides(){
    var slidesslides = []
    slidesslides.push(['/exports/slides/blockchain/blockchain_01.jpg', '/exports/slides/blockchain/blockchain_02.jpg', '/exports/slides/blockchain/blockchain_03.jpg', '/exports/slides/blockchain/blockchain_04.jpg', '/exports/slides/blockchain/blockchain_05.jpg', '/exports/slides/blockchain/blockchain_06.jpg', '/exports/slides/blockchain/blockchain_07.jpg', '/exports/slides/blockchain/blockchain_08.jpg', '/exports/slides/blockchain/blockchain_09.jpg', '/exports/slides/blockchain/blockchain_10.jpg', '/exports/slides/blockchain/blockchain_11.jpg', '/exports/slides/blockchain/blockchain_12.jpg', '/exports/slides/blockchain/blockchain_13.jpg', '/exports/slides/blockchain/blockchain_14.jpg', '/exports/slides/blockchain/blockchain_15.jpg', '/exports/slides/blockchain/blockchain_16.jpg', '/exports/slides/blockchain/blockchain_17.jpg', '/exports/slides/blockchain/blockchain_18.jpg', '/exports/slides/blockchain/blockchain_19.jpg', '/exports/slides/blockchain/blockchain_20.jpg'])
    slidesslides.push(['/exports/slides/ai/ai_01.jpg', '/exports/slides/ai/ai_02.jpg', '/exports/slides/ai/ai_03.jpg', '/exports/slides/ai/ai_04.jpg', '/exports/slides/ai/ai_05.jpg', '/exports/slides/ai/ai_06.jpg', '/exports/slides/ai/ai_07.jpg', '/exports/slides/ai/ai_08.jpg', '/exports/slides/ai/ai_09.jpg', '/exports/slides/ai/ai_10.jpg', '/exports/slides/ai/ai_11.jpg', '/exports/slides/ai/ai_12.jpg', '/exports/slides/ai/ai_13.jpg'])
    slidesslides.push(['/exports/slides/cyber/cyber_1.jpg', '/exports/slides/cyber/cyber_2.jpg', '/exports/slides/cyber/cyber_3.jpg', '/exports/slides/cyber/cyber_4.jpg', '/exports/slides/cyber/cyber_5.jpg', '/exports/slides/cyber/cyber_6.jpg'])
    slidesslides.push(['/exports/slides/innovation/innovation_01.jpg', '/exports/slides/innovation/innovation_02.jpg', '/exports/slides/innovation/innovation_03.jpg', '/exports/slides/innovation/innovation_04.jpg', '/exports/slides/innovation/innovation_05.jpg', '/exports/slides/innovation/innovation_06.jpg', '/exports/slides/innovation/innovation_07.jpg', '/exports/slides/innovation/innovation_08.jpg', '/exports/slides/innovation/innovation_09.jpg', '/exports/slides/innovation/innovation_10.jpg', '/exports/slides/innovation/innovation_11.jpg', '/exports/slides/innovation/innovation_12.jpg', '/exports/slides/innovation/innovation_13.jpg'])
    slidesslides.push(['/exports/slides/iot/iot_01.jpg', '/exports/slides/iot/iot_02.jpg', '/exports/slides/iot/iot_03.jpg', '/exports/slides/iot/iot_04.jpg', '/exports/slides/iot/iot_05.jpg', '/exports/slides/iot/iot_06.jpg', '/exports/slides/iot/iot_07.jpg', '/exports/slides/iot/iot_08.jpg', '/exports/slides/iot/iot_09.jpg', '/exports/slides/iot/iot_10.jpg', '/exports/slides/iot/iot_11.jpg', '/exports/slides/iot/iot_12.jpg'])
    slidesslides.push(['/exports/slides/transform/transform_01.jpg', '/exports/slides/transform/transform_02.jpg', '/exports/slides/transform/transform_03.jpg', '/exports/slides/transform/transform_04.jpg', '/exports/slides/transform/transform_05.jpg', '/exports/slides/transform/transform_06.jpg', '/exports/slides/transform/transform_07.jpg', '/exports/slides/transform/transform_08.jpg', '/exports/slides/transform/transform_09.jpg', '/exports/slides/transform/transform_10.jpg', '/exports/slides/transform/transform_11.jpg'])
    //slidesslides.push()
    //slidesslides.push()
    //slidesslides.push()
    for(var i = 0; i < slidesslides.length; i++){
        var newDeck = []

        for(var j = 0; j < slidesslides[i].length; j++){
           
            //console.log(slidesslides[i][j])
            newDeck.push(makeTexture(slidesslides[i][j]));
        }
        slideDecks.push(newDeck);
        //console.log("deck pushed" + newDeck.length)
    }
    //slides[0] = textureLoader.load('/exports/slides/slide1.png')
    //slides[1] = textureLoader.load('/exports/slides/slide2.png')
    //slides[2] = textureLoader.load('/exports/slides/slide3.png')
}



function makeColor(){
    var color = new THREE.Color( 0xffffff );
    color.setHex( Math.random() * 0xffffff );
    const portalLightMaterial = new THREE.MeshBasicMaterial({ color: color })
    return portalLightMaterial;
}

function switchCamera(p){
    if(p){
        camera = pcamera;
        
    }
    else{
        pcamera = camera;
        camera = ocamera;
    }
}

function displaySlides(p, a, dist){

    dist = 3;
    
    //Set pcamera, should probably change
    pcamera = camera;
    //console.log(p)
    //console.log(p.x)
    //console.log(ocamera)
    ocamera.position.x = p.x-Math.sin(a)*dist;
    ocamera.position.y = p.y;
    ocamera.position.z = p.z-Math.cos(a)*dist;
    ocamera.quaternion.setFromEuler( new Euler( 0, a+Math.PI, 0, 'YXZ' ));
    //ocamera.quaternion
    back_mesh.position.set(p.x+0.65*Math.cos(a)-0.1*Math.sin(a), p.y, p.z-0.65*Math.sin(a)-0.1*Math.cos(a));
    back_mesh.rotation.set(0, a, 0);
    next_mesh.position.set(p.x-0.65*Math.cos(a)-0.1*Math.sin(a), p.y, p.z+0.65*Math.sin(a)-0.1*Math.cos(a));
    next_mesh.rotation.set(0, a, 0);

    x_mesh.position.set(p.x+0.5*Math.cos(a)-0.1*Math.sin(a), p.y+0.4, p.z-0.5*Math.sin(a)-0.1*Math.cos(a));
    x_mesh.rotation.set(0, a, 0);
    back_mesh.visible = true;
    next_mesh.visible = true;
    x_mesh.visible = true;
    
    //console.log("backmesh" + back_mesh.position.x+","+back_mesh.position.y+","+back_mesh.position.z);

    slideMode = true;


}



function loadSlideButtons(){
    //Add buttons
    const backTexture = textureLoader.load('./exports/buttons/backb.png')
    const nextTexture = textureLoader.load('./exports/buttons/nextb.png')
    const xTexture = textureLoader.load('./exports/buttons/xbutton.png')
        //const back_plane = new THREE.PlaneGeometry( 0.1, 0.1)
        const back_plane = new THREE.BoxGeometry(0.1, 0.1, 0.01);
        //back_plane.translate(-0.55, 0, 0)
        const back_plane_material = new THREE.MeshBasicMaterial({ map: backTexture })
        back_mesh = new THREE.Mesh(back_plane, back_plane_material)
        
        //const next_plane = new THREE.PlaneGeometry( 0.1, 0.1)
        const next_plane = new THREE.BoxGeometry(0.1, 0.1, 0.01);
        //next_plane.translate(0.55, 0, 0)
        const next_plane_material = new THREE.MeshBasicMaterial({ map: nextTexture })
        next_mesh = new THREE.Mesh(next_plane, next_plane_material)

        const x_plane = new THREE.BoxGeometry(0.1, 0.1, 0.01);
        //next_plane.translate(0.55, 0, 0)
        const x_plane_material = new THREE.MeshBasicMaterial({ map: xTexture })
        x_mesh = new THREE.Mesh(x_plane, x_plane_material)
    
        scene.add(back_mesh)
        scene.add(next_mesh)
        scene.add(x_mesh)
        back_mesh.visible = false;
        next_mesh.visible = false;
        x_mesh.visible = false;
       

}

function exitSlideMode(){
    switchCamera(true);
    next_mesh.visible = false;
    back_mesh.visible = false;
    x_mesh.visible = false;
    slideMode = false;

}

function camSpin(){
    const _euler = new Euler( 0, 0, 0, 'YXZ' );
        _euler.setFromQuaternion( camera.quaternion );

        //Add camera and mouse (ideally one should be 0)
        _euler.y += 0.1;
        //Just from mouse
		camera.quaternion.setFromEuler( _euler );
        //console.log(_euler);
        if(_euler.y>-0.2&&_euler.y<0){
            spun = true;
            beginScene();
        }
}

function beginScene(){
    if(spun&&modelsloaded){
        loaded = true;
        const _euler = new Euler( 0, -Math.PI/2, 0, 'YXZ' );
            camera.quaternion.setFromEuler( _euler );
        camera.position.set(-26.5, 1.5, -1.35);
            var load = document.getElementById("loadingScreen");
            load.style.display = "none";
            var threecanvas = document.getElementById("three");
            //threecanvas.style.display = "inline"
            var controller = document.getElementById("controller");
            controller.style.display = "inline"
            //console.log(_euler);
    }
}

function addLights(){
    const light = new THREE.AmbientLight( 0x404040 ); // soft white light
    //const light = new THREE.AmbientLight( 0xffa90a);
    light.intensity = 8;
    scene.add( light );
    light.position.set(7, 2, -30);
}

function addSound(mesh){
    const sound = new THREE.PositionalAudio( listener );

    // load a sound and set it as the PositionalAudio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( './exports/sounds/fullnarration.wav', function( buffer ) {
	sound.setBuffer( buffer );
	
    sound.setDistanceModel("exponential");
    sound.setRefDistance( 5 );
    sound.setRolloffFactor( 4 );
	sound.play();

    
});

mesh.add(sound)
}

function glow(){
    //intcolor = 1;
    for(var i = 0; i < intObjects.length; i++){
        let curCol = new THREE.Color();
        curCol.lerpColors(whiteColor, new THREE.Color(0x00000), intcolor)
        intObjects[i].material.emissive = curCol;
    }
    for(var i = 0; i < TZmaps.length; i++){
        let curCol = new THREE.Color();
        curCol.lerpColors(whiteColor, new THREE.Color(0x00000), intcolor)
        TZmaps[i].material.emissive = curCol;
    }
    if(intcolor>0.95){
        colorchanger = -0.0025
    }
    else if(intcolor<0.55){
        colorchanger = 0.0025
    }
    intcolor = intcolor + colorchanger;
    //console.log(intcolor);
    
}

function controllerclickcheck(xpos, ypos){
    if(xpos>50 && ypos>50 && xpos<225 && ypos<225){
        return true;
    }
    else{
        return false;
    }
}

function loadModel(model, textureList=[], texturepath = '', transparent=false){
    gltfLoader.load(
        model,
        (gltf) =>
        {
            for(var i = 0; i < gltf.scene.children.length; i++){
                const bakedMesh = gltf.scene.children[i];
                //console.log(textureList)
                //console.log(bakedMesh.name);

                addInteract(bakedMesh);
                checkMaterial(bakedMesh);
                //const bakedMaterial = makeMaterial(bakedMesh, textureList, texturepath, transparent);
                //if(bakedMaterial!=null){
                //    //bakedMesh.material = bakedMaterial;
                //}
                

            }       
        scene.add(gltf.scene)
        }
    )
}

function makeMaterial(bakedMesh, textureList, texturepath, transparent){
    var texturename = textureList.find(file => file.includes(bakedMesh.name));
    console.log(texturename);
    
    if(bakedMesh.name.includes('ey_verse_screen'))
        {
            var video = document.getElementById( 'video' );
            video.play();
            videotexture = new THREE.VideoTexture( video );
            //videotexture.needsUpdate = true;
            videotexture.flipY = true;
            videomaterial = new THREE.MeshBasicMaterial( { map: videotexture } );
            
            //videomaterial.flipY = true;
            //videomaterial.needsUpdate = true;
            //bakedMesh.scale.set(new Vector3(-1, 1, 1));
            return videomaterial;
        }
        else if(bakedMesh.name.includes('Forum_Screens_1')){
            console.log("Forum videos")
            var forumvideo = document.getElementById( 'forumvideo' );
            forumvideo.play();
            var svideotexture = new THREE.VideoTexture( forumvideo );
            svideotexture.flipY = true;
            //videotexture.needsUpdate = true;
            var svideomaterial = new THREE.MeshBasicMaterial( { map: svideotexture } );
            videomaterial.flipY = true;
            //bakedMesh.scale.set(new Vector3(-1, 1, 1));
            //videomaterial.needsUpdate = true;
            
            return svideomaterial;
        }
        else if(bakedMesh.name.includes('IR_Welcome_Map')){
            var forumvideo = document.getElementById( 'forumvideo' );
            forumvideo.play();
            var svideotexture = new THREE.VideoTexture( forumvideo );
            svideotexture.flipY = true;
            //videotexture.needsUpdate = true;
            var svideomaterial = new THREE.MeshBasicMaterial( { map: svideotexture } );
            videomaterial.flipY = true;
            
            console.log("Welcome map")
            return svideomaterial;
            
        }
        
    if(texturename!=undefined){
        
        
            texturename = texturepath + texturename;
            const bakedTexture = textureLoader.load(texturename)
            bakedTexture.flipY = false
            bakedTexture.encoding = THREE.sRGBEncoding
            //const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })
            const bakedMaterial = new THREE.MeshLambertMaterial({ map: bakedTexture })
            bakedMaterial.transparent = transparent;
            bakedMaterial.side = THREE.DoubleSide;
            return bakedMaterial;
        
    } else{
        const bakedMaterial = new THREE.MeshStandardMaterial();
        bakedMaterial.transparent = transparent;
        bakedMaterial.side = THREE.DoubleSide;
        bakedMaterial.reflectivity = 0;
        return null;
        //return bakedMaterial;
    }
}

function checkMaterial(mesh){
    var name = mesh.name;
    var newMat = makeSpecialMaterial(name);
    if(name.includes)
    if(newMat!=null){
        mesh.material = newMat;
    }
    
}

function makeSpecialMaterial(name){
    var textures = ['CR_2035_blanket.jpg', 'CR_2035_ceiling.jpg', 'CR_2035_floor.jpg', 'CR_2035_furniture.jpg', 'CR_2035_screen.jpg', 'CR_2035_signage.jpg', 'CR_2035_video_wall.jpg', 'CR_2035_wall.jpg', 'ey_verse_curtains.jpg', 'ey_verse_floor.jpg', 'ey_verse_inner_walls.jpg', 'ey_verse_outer_walls.jpg', 'ey_verse_rafters.jpg', 'ey_verse_rug.jpg', 'ey_verse_screen.jpg', 'ey_verse_side_rails.jpg', 'ey_verse_speakers_1.jpg', 'ey_verse_speakers_2.jpg', 'ey_verse_stools.jpg', 'ey_verse_tables_and_chairs.jpg', 'Forum_Chairs.jpg', 'Forum_Floor.jpg', 'Forum_Light_gels.jpg', 'Forum_light_truss.png', 'Forum_Lower_Benches.jpg', 'Forum_Main_Stage.jpg', 'Forum_Rafters.jpg', 'Forum_Rear_wall.jpg', 'Forum_Screens.jpg', 'Forum_stage.jpg', 'Forum_Stage_and_Walls.jpg', 'Forum_Tables.jpg', 'Forum_Upper_Benches.jpg', 'Forum_wall_panels.jpg', 'IR_Welcome_Map_2.jpg', 'IZ_arches.jpg', 'IZ_cafe_counter.jpg', 'IZ_chairs.jpg', 'IZ_desk.jpg', 'IZ_directions_1.jpg', 'IZ_directions_2.jpg', 'IZ_floor.jpg', 'IZ_furniture.jpg', 'IZ_map_button_01.jpg', 'IZ_map_button_02.jpg', 'IZ_map_button_03.jpg', 'IZ_map_button_04.jpg', 'IZ_map_button_05.jpg', 'IZ_map_button_06.jpg', 'IZ_map_button_07.jpg', 'IZ_map_button_08.jpg', 'IZ_map_button_09.jpg', 'IZ_map_button_010.jpg', 'IZ_map_button_011.jpg', 'IZ_rafters.jpg', 'IZ_seat_boxes.jpg', 'IZ_signage_1.jpg', 'IZ_signage_2.jpg', 'IZ_signage_3.jpg', 'IZ_sofa.jpg', 'IZ_stage.jpg', 'IZ_Startup_zone_screen.jpg', 'IZ_tables.jpg', 'IZ_walls.jpg', 'IZ_Wall_fix.jpg', 'IZ_welcome_corridor_screen_02.jpg', 'IZ_welcome_corridor_screen_03.jpg', 'Market_baklava_1.png', 'Market_baklava_2.png', 'Market_buffet_1.jpg', 'Market_buffet_2.jpg', 'Market_buffet_3.jpg', 'Market_buffet_4.jpg', 'Market_counters.jpg', 'Market_desserts_1.png', 'Market_desserts_2.png', 'Market_desserts_3.png', 'Market_desserts_4.png', 'Market_directional_signage_1.jpg', 'Market_directional_signage_2.jpg', 'Market_Floor.jpg', 'Market_foliage_bakery_wall.png', 'Market_foliage_hanging.png', 'Market_foliage_video_wall_1.png', 'Market_foliage_video_wall_2.png', 'Market_foliage_video_wall_3.png', 'Market_foliage_video_wall_4.png', 'Market_Forum_signage.jpg', 'Market_furniture.jpg', 'Market_green_panels.jpg', 'Market_innovation_text_1.jpg', 'Market_Light_gels.jpg', 'market_mound.jpg', 'Market_overhead_screen_1.png', 'Market_overhead_screen_2.png', 'Market_overhead_screen_3.png', 'Market_overhead_screen_4.png', 'Market_overhead_screen_5.jpg', 'Market_pink_treats.png', 'Market_Rafters.jpg', 'Market_Scaffold.jpg', 'Market_screens_01.jpg', 'Market_screens_02.jpg', 'Market_Signage_1.jpg', 'Market_Signage_2.jpg', 'Market_signage_stands.jpg', 'Market_sign_islands.jpg', 'Market_trellis.png', 'Market_walls.jpg', 'Market_waterfall_screen.jpg', 'Purple_Pod_chairs.jpg', 'Purple_pod_floor_ceiling.jpg', 'Purple_pod_screen.jpg', 'Purple_Pod_walls.jpg', 'Space_Pod_chairs.jpg', 'Space_Pod_floor_ceiling.jpg', 'Space_Pod_Inner_wall.jpg', 'Space_Pod_screen.jpg', 'Space_Pod_truss.png', 'Space_Pod_wood_pillars.jpg', 'SpeakEasy_barstools.jpg', 'SpeakEasy_Bar_Back_Bottles.jpg', 'SpeakEasy_Bar_Back_Lighting.jpg', 'SpeakEasy_bar_shelves.jpg', 'SpeakEasy_Bar_top.jpg', 'SpeakEasy_brick_wall.jpg', 'SpeakEasy_edison_lamps.png', 'SpeakEasy_floor.jpg', 'SpeakEasy_liquor_bottles.png', 'SpeakEasy_paneled_wall.jpg', 'SpeakEasy_rafters.jpg', 'SpeakEasy_screen.jpg', 'SpeakEasy_Table_and_Chairs.jpg', 'SpeakEasy_walls.jpg', 'TZ_blockchain_01.jpg', 'TZ_blockchain_02.jpg', 'TZ_blockchain_19.jpg', 'TZ_blockchain_20.jpg', 'TZ_Curved_screens_01.jpg', 'TZ_Curved_screens_02.jpg', 'TZ_Curved_screens_03.jpg', 'TZ_Curved_screens_04.jpg', 'TZ_Curved_screens_05.jpg', 'TZ_Curved_screens_06.jpg', 'TZ_Floor.jpg', 'TZ_mirror_wall.jpg', 'TZ_murals_01.jpg', 'TZ_outer_walls.jpg', 'TZ_pillar_monitors_01.jpg', 'TZ_pillar_monitors_02.jpg', 'TZ_pillar_monitors_03.jpg', 'TZ_pillar_monitors_04.jpg', 'TZ_Projectors.jpg', 'TZ_rafters.jpg', 'TZ_signage.jpg', 'TZ_wall_monitors_01.jpg', 'TZ_wall_monitors_02.jpg', 'TZ_wall_monitors_03.jpg', 'TZ_wall_monitors_04.jpg', 'TZ_wall_monitors_05.jpg', 'TZ_wall_monitors_06.jpg', 'TZ_wall_monitors_07.jpg', 'TZ_wall_monitors_08.jpg', 'VR_Bar_back_wall_fix.jpg', 'VR_Bar_Direction_Graphic.jpg', 'VR_Bar_display01.jpg', 'VR_Bar_Floor.jpg', 'VR_Bar_floor_lights.jpg', 'VR_Bar_furniture.jpg', 'VR_Bar_Inner_walls.jpg', 'VR_Bar_Outer_walls.jpg', 'VR_Bar_screens01.jpg', 'VR_Bar_screens02.jpg', 'VR_Bar_screens03.jpg', 'VR_Bar_screens04.jpg', 'VR_Bar_shooters.png', 'VR_Bar_Wall_fix.jpg', 'VR_Bar_yellow_Arches.jpg']
    var texturename = textures.find(file => file.includes(name));
    //console.log(name)
    var texturepath = 'exports/textures/'
    if(name.includes('IZ_map_button_')){
        texturename = texturepath + texturename;
            const bakedTexture = textureLoader.load(texturename)
            bakedTexture.flipY = false;
            bakedTexture.encoding = THREE.sRGBEncoding
            const bakedMaterial = new THREE.MeshLambertMaterial({ map: bakedTexture })
            bakedMaterial.side = THREE.DoubleSide;
            //console.log("found texturename" + texturename);
            return bakedMaterial;

    }
    else if(name.includes("TZ_wall_monitors_")||name.includes("TZ_pillar_monitors_")||name.includes("TZ_blockchain_")){
        /*
        const bakedTexture = slideDecks[slideIndices[name]]
        bakedTexture.flipY = false;
        bakedTexture.encoding = THREE.sRGBEncoding
        const bakedMaterial = new THREE.MeshLambertMaterial({ map: bakedTexture })
        bakedMaterial.side = THREE.DoubleSide;
        */
        //console.log("found texturename" + texturename);
        //return bakedMaterial;
        var deck = slideDecks[slideIndices[name]];
        //console.log(name)
        //console.log(deck)
        //console.log(deck[0])
        return (deck[0]);
    }
    else if(name.includes('Forum_Screens_1')){
        
        var forumvideo = document.getElementById( 'forumvideo' );
            forumvideo.play();
            var svideotexture = new THREE.VideoTexture( forumvideo );
            var svideomaterial = new THREE.MeshBasicMaterial( { map: svideotexture } );
            
            return svideomaterial;
            
    }
    else if(name.includes('ey_verse_screen')){
        
        var video = document.getElementById( 'video' );
            video.play();
            videotexture = new THREE.VideoTexture( video );
            videomaterial = new THREE.MeshBasicMaterial( { map: videotexture } );
            return videomaterial;
            
    }

    return null;
    console.log("didn't find" + name)
}

function addInteract(bakedMesh){
    var name = bakedMesh.name;
    if(name.includes("TZ_wall_monitors_")||name.includes("TZ_pillar_monitors_")||name.includes("TZ_blockchain_")){
        TZmaps.push(bakedMesh);
    }
    else if(name.includes('IZ_map_button_')){
        //bakedMesh.material = makeSpecialMaterial(bakedMesh.name);
        mapButtons.push(bakedMesh)
        //console.log("map button")
    }

}

function loadTextureModel(model, textureList, texturepath, transparent=false){
    gltfLoader.load(
        model,
        (gltf) =>
        {
        
                   //var textureList = ['Market_baklava_1.png', 'Market_baklava_2.png', 'Market_buffet_1.jpg', 'Market_buffet_2.jpg', 'Market_buffet_3.jpg', 'Market_buffet_4.jpg', 'Market_counters.jpg', 'Market_Floor.jpg', 'Market_Forum_signage.jpg', 'Market_furniture.jpg', 'Market_green_panels.jpg', 'Market_innovation_text 1.jpg', 'market_innovation_text 2.jpg', 'Market_overhead_screen_1.jpg', 'Market_pink_treats.png', 'Market_Rafters.jpg', 'Market_Scaffold.jpg', 'Market_screens_01.jpg', 'Market_screens_02.jpg', 'Market_Signage_1.jpg', 'Market_Signage_2.jpg', 'Market_signage_stands.jpg', 'Market_sign_islands.jpg', 'Market_walls.jpg', 'Market_waterfall_screen.jpg']       
        for (var i = 0; i < textureList.length; i++){
            var texturename = textureList[i];
            var basename = texturename.slice(0, -4);
            //console.log(basename)
            texturename = texturepath + texturename;
            const bakedMesh = gltf.scene.children.find(child => child.name === basename)
            //console.log(gltf.scene.children);
            const bakedTexture = textureLoader.load(texturename)
            bakedTexture.flipY = false
            bakedTexture.encoding = THREE.sRGBEncoding
            //const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })
            const bakedMaterial = new THREE.MeshLambertMaterial({ map: bakedTexture })
            //console.log(basename)
           
            if(transparent){
                bakedMaterial.transparent = true;
            }
            try{
                if(!texturename.includes('ey_verse_screen')){
            bakedMesh.material = bakedMaterial
                }
            }
            catch(error){
                console.log("error!" + basename)
            }

             //TO DO: make this less silly
            if(texturename.includes('ey_verse_screen')||texturename.includes("Map_screen")){
                //https://discourse.threejs.org/t/how-to-fit-the-texture-to-the-plane/12017

                /*
                var video = document.getElementById( 'video' );
                videotexture = new THREE.VideoTexture( video );
                //videotexture.needsUpdate = true;
                videomaterial = new THREE.MeshBasicMaterial( { map: videotexture } );
                videomaterial.flipY = true;
                videomaterial.needsUpdate = true;
                bakedMesh.material = videomaterial;
                //addSound(bakedMesh);
                console.log("video")
                */
            }
                
            
        }
        
        scene.add(gltf.scene)
        }
    )
}

function loadTextureModelInteractive(model, textureList, texturepath, intstr, intobjs){
    gltfLoader.load(
        model,
        (gltf) =>
        {
        
                   //var textureList = ['Market_baklava_1.png', 'Market_baklava_2.png', 'Market_buffet_1.jpg', 'Market_buffet_2.jpg', 'Market_buffet_3.jpg', 'Market_buffet_4.jpg', 'Market_counters.jpg', 'Market_Floor.jpg', 'Market_Forum_signage.jpg', 'Market_furniture.jpg', 'Market_green_panels.jpg', 'Market_innovation_text 1.jpg', 'market_innovation_text 2.jpg', 'Market_overhead_screen_1.jpg', 'Market_pink_treats.png', 'Market_Rafters.jpg', 'Market_Scaffold.jpg', 'Market_screens_01.jpg', 'Market_screens_02.jpg', 'Market_Signage_1.jpg', 'Market_Signage_2.jpg', 'Market_signage_stands.jpg', 'Market_sign_islands.jpg', 'Market_walls.jpg', 'Market_waterfall_screen.jpg']       
        for (var i = 0; i < textureList.length; i++){
            var texturename = textureList[i];
            var basename = texturename.slice(0, -4);
            //console.log(basename)
            texturename = texturepath + texturename;
            const bakedMesh = gltf.scene.children.find(child => child.name === basename)
            const bakedTexture = textureLoader.load(texturename)
            bakedTexture.flipY = false
            bakedTexture.encoding = THREE.sRGBEncoding
            //const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })
            const bakedMaterial = new THREE.MeshLambertMaterial({ map: bakedTexture })
            //console.log(basename)
            try{
            bakedMesh.material = bakedMaterial
            }
            catch(error){
                console.log("error!" + basename)
            }
            if(texturename.includes(intstr)){
                //console.log("adding the " + bakedMesh.position.x)
                intobjs.push(bakedMesh);
            }
            
        }
        
        scene.add(gltf.scene)
        }
    )
}

function loadScreens(textureList, modelPath, texturepath){
    for (var i = 0; i < textureList.length; i++){
        var texturename = textureList[i];
        var basename = texturename.slice(0, -4);
        //console.log(basename)
        texturename = texturepath + texturename;
        var modelname = modelPath + basename + '.glb'
    gltfLoader.load(
        modelname,
        (gltf) =>
        {
            console.log("Hi")
            console.log(gltf.scene.children);
        
                   //var textureList = ['Market_baklava_1.png', 'Market_baklava_2.png', 'Market_buffet_1.jpg', 'Market_buffet_2.jpg', 'Market_buffet_3.jpg', 'Market_buffet_4.jpg', 'Market_counters.jpg', 'Market_Floor.jpg', 'Market_Forum_signage.jpg', 'Market_furniture.jpg', 'Market_green_panels.jpg', 'Market_innovation_text 1.jpg', 'market_innovation_text 2.jpg', 'Market_overhead_screen_1.jpg', 'Market_pink_treats.png', 'Market_Rafters.jpg', 'Market_Scaffold.jpg', 'Market_screens_01.jpg', 'Market_screens_02.jpg', 'Market_Signage_1.jpg', 'Market_Signage_2.jpg', 'Market_signage_stands.jpg', 'Market_sign_islands.jpg', 'Market_walls.jpg', 'Market_waterfall_screen.jpg']       
            const bakedMesh = gltf.scene;
            const bakedTexture = textureLoader.load(texturename)
            bakedTexture.flipY = false
            bakedTexture.encoding = THREE.sRGBEncoding
            const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })
            //console.log(basename)
            try{
            bakedMesh.material = bakedMaterial
            }
            catch(error){
                console.log("error!" + basename)
                console.log(texturename);
            }
            TZmaps.push(gltf.scene.children[0]);
            
        
        
        scene.add(gltf.scene);


        }
        
        
    )
}
}



//Not Used Anymore
function JSONloader(){
    const loader = new THREE.ObjectLoader();

loader.load(
	// resource URL
	"IR_full_Lighting_TEST.json",

	// onLoad callback
	// Here the loaded data is assumed to be an object
	function ( obj ) {
		// Add the loaded object to the scene
		scene.add( obj );
	},

	// onProgress callback
	function ( xhr ) {
		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
	},

	// onError callback
	function ( err ) {
		console.error( 'An error happened' );
	}
);

}


function loadSlides(){

    ocamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100 )
    ocamera.position.z = 1;
    scene.add(ocamera);
    
    slides[0] = textureLoader.load('/exports/slides/slide1.png')
    slides[1] = textureLoader.load('/exports/slides/slide2.png')
    slides[2] = textureLoader.load('/exports/slides/slide3.png')

    const slides_plane = new THREE.PlaneGeometry( 1, 1)
    const slides_plane_material = new THREE.MeshBasicMaterial({ map: slides[currentSlide] })
    const slides_mesh = new THREE.Mesh(slides_plane, slides_plane_material)

    const back_plane = new THREE.PlaneGeometry( 0.1, 0.1)
    back_plane.translate(-0.55, 0, 0)
    const back_plane_material = new THREE.MeshBasicMaterial({ map: backTexture })
    back_mesh = new THREE.Mesh(back_plane, back_plane_material)

    const next_plane = new THREE.PlaneGeometry( 0.1, 0.1)
    next_plane.translate(0.55, 0, 0)
    const next_plane_material = new THREE.MeshBasicMaterial({ map: nextTexture })
    next_mesh = new THREE.Mesh(next_plane, next_plane_material)

    scene.add(slides_mesh)
    scene.add(back_mesh)
    scene.add(next_mesh)



}