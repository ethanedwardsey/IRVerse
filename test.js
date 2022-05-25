//Hi
//import '/style.css'
import * as THREE from 'three';
import { Euler, Vector2, Vector3 } from 'three';
import { GLTFLoader } from './GLTFLoader.js';
import { DRACOLoader } from './DRACOLoader.js';
import { PointerLockControls } from './PointerLockControls.js';


console.log("here")

let camera, scene, dummyscene, renderer, controls;
let pcamera, ocamera;
const objects = [];
var displaying = false;

var back_mesh;
var next_mesh;

let camMoveX = 0;
let camMoveY = 0;
var clickmovepoint;
var clickmoving = false;

let raycaster;


let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const camVelocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();
//var fs = require('fs');



//Raycasting
const clickraycaster = new THREE.Raycaster();
let fraycaster = new THREE.Raycaster();
let braycaster = new THREE.Raycaster();;


const pointer = new THREE.Vector2();
var click = false;
var dblclick = false;

var collision;
var mapButtons = [];
var TZmaps = [];






/**
 * Base
 */
// Debug
/*
const gui = new dat.GUI({
    width: 400
})
*/

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
    var load = document.getElementById("loadingScreen");
    load.style.display = "none";
    var threecanvas = document.getElementById("three");
    //threecanvas.style.display = "inline"
    var controller = document.getElementById("controller");
    controller.style.display = "inline"

};


manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

    //TO DO: update hardcoding
	console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
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
const slides = []
let currentSlide = 0;
slides[0] = '/exports/slides/slide1.png'
slides[1] = '/exports/slides/slide2.png'
slides[2] = '/exports/slides/slide3.png'

const backTexture = textureLoader.load('/exports/buttons/back.png')
const nextTexture = textureLoader.load('/exports/buttons/next.png')

/**
 * Textures
 */


/**
 * Sizes
 */


/**
 * Camera
 */
// Base camera

function init() {

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.y = 1.5;
    

    scene = new THREE.Scene();
    //#000000
    //scene.background = new THREE.Color( 0xffffff );
    //scene.fog = new THREE.Fog( 0xffffff, 0, 750 );
    scene.background = new THREE.Color( 0x5c5c5c );
    scene.fog = new THREE.Fog( 0x5c5c5c, 0, 750 );


/**
 * Materials
 */
loadFullModels();
//loadSlides();
ocamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100 )
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

    //const blocker = document.getElementById( 'blocker' );
    //const instructions = document.getElementById( 'instructions' );

    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);
    window.addEventListener('mousemove', (e) =>
{
    pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
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
                switchCamera(true);
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

    


    //raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
    fraycaster.far = 2;
    braycaster.far = 2;
    //fraycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, 0, 0 ), 0, 10 );
    //braycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, 0, 0 ), 0, 10 );
    // floor



 

    //

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    //

    //window.addEventListener( 'resize', onWindowResize );

}

function animate() {

    requestAnimationFrame( animate );

    const time = performance.now();

    //select buttons
    // Cast a ray
    var currentIntersect;
    if(displaying){
    const objectsForRayCast = [back_mesh, next_mesh]
    clickraycaster.setFromCamera( pointer, camera );
    const intersecto = clickraycaster.intersectObjects(objectsForRayCast)
    
    for(const object of objectsForRayCast){
        object.material.color.set('#ffffff')
    }

    for(const intersect of intersecto){
        console.log("setting color")
        intersect.object.material.color.set('#ffff00')
    }
    currentIntersect = intersecto[0];
    }


        //Handle raycasting
    if(click){


        //Just for testing slides
        if(displaying){
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
            console.log(TZmaps[0]);

            TZmaps[0].material = makeTexture(slides[currentSlide]);
        }
        }



        //switchCamera(false);
            //Set to false so that held down click doesn't cast multiple rays
            console.log("current position: " + controls.getObject().position.x + "," + controls.getObject().position.y + "," + controls.getObject().position.z );
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

                if(intersects[i].object.name.includes('01')){
                    newPos = new Vector3(-4.913926124799983,1.5,3.1473119049575);
                }
                else if(intersects[i].object.name.includes('02')){
                    newPos = new Vector3(-14.763254846552549,1.5,3.381983248102806);
                }
                else if(intersects[i].object.name.includes('03')){
                    newPos = new Vector3(-6.131198084298851,1.5,-4.94005691805949);
                }
                
                else if(intersects[i].object.name.includes('04')){
                    newPos = new Vector3(2.0107367878510556,1.5,-27.518229810088066);
                }
                else if(intersects[i].object.name.includes('05')){
                    newPos = new Vector3(36.357200959384286,1.5,-27.780869919116576);
                }
                else if(intersects[i].object.name.includes('06')){
                    newPos = new Vector3(45.32320284406064,1.5,-4.000316721102775);
                }
                else if(intersects[i].object.name.includes('07')){
                    newPos = new Vector3(44.73183653949032,1.5,4.082937851489276);
                }
                else if(intersects[i].object.name.includes('08')){
                    newPos = new Vector3(27.86055241837079,1.5,-5.924285762145197);
                }
                else if(intersects[i].object.name.includes('09')){
                    newPos = new Vector3(14.228396830902655,1.5,-5.924025345405676);
                }
                


                //No y because height shouldn't be changed
                camera.position.x = newPos.x;
                camera.position.z = newPos.z;
            }
            
            

            //intersects[ i ].object.material.color.set( 0xff0000 );

        }

        const bintersects = clickraycaster.intersectObjects( TZmaps );
        //console.log([collision])
        //console.log(scene.children)
        //console.log(mapButtons);

        for ( let i = 0; i < bintersects.length; i ++ ) {
            console.log(bintersects[i].object.position)
            displaySlides(bintersects[i].object.position);
            switchCamera(false);
            console.log("hi blockchain")
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

        if ( moveForward || moveBackward ) velocity.z -= direction.z * 100.0 * delta;
        
        
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
                if(Math.abs(clickmovepoint.z - curPos.z)<1){
                    velocity.z = 0;
                }
                else{
                    velocity.z = clickmovepoint.z - curPos.z;
                }
                if(Math.abs(clickmovepoint.x - curPos.x)<1){
                    velocity.x = 0;
                }
                else{
                    velocity.x = clickmovepoint.x - curPos.x;
                }
            }
            console.log(clickmovepoint.z - curPos.z);
        }
        //var bob = new Vector3(0, 0, 0);
        //camera.getWorldDirection(bob)
        //console.log(bob)



        controls.moveForward( - velocity.z * delta );
        controls.moveRight( - velocity.x * delta );

        controls.getObject().position.y += ( velocity.y * delta ); // new behavior
        if ( controls.getObject().position.y < 1.5 ) {

            velocity.y = 0;
            controls.getObject().position.y = 1.5;

        }



    







    prevTime = time;

    renderer.render( scene, camera );

}








init();
animate();

console.log("huh")













function interact(e){
    //TO DO: If it's on the div, it should do nothing

    pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
    click = true;
    console.log("interacting");
}

function clickmove(e){
    pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
    dblclick = true;
    click = false;
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
        xpos = 100-(window.innerWidth-xpos);
        ypos = 100-(window.innerHeight-ypos);
        if(xpos>-200 && ypos>-200){
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

    const forumMaterial = new THREE.MeshBasicMaterial({ map: forumTexture});
    return forumMaterial;
}

function loadFullModels(){
    //CR
    var crList = ['CR_2035_blanket.jpg', 'CR_2035_ceiling.jpg', 'CR_2035_floor.jpg', 'CR_2035_furniture.jpg', 'CR_2035_screen.jpg', 'CR_2035_video_wall.jpg', 'CR_2035_wall.jpg']
    loadTextureModel('exports/CR_2035_BAKED_FINAL/CR_2035_BAKED_FINAL/CR_2035_BAKED_opaque.glb', crList, 'exports/CR_2035_BAKED_FINAL/CR_2035_BAKED_FINAL/CR_2035_textures/CR_2035_textures_opaque/')
    var crListT = ['CR_2035_truss.png']
    loadTextureModel('exports/CR_2035_BAKED_FINAL/CR_2035_BAKED_FINAL/CR_2035_BAKED_transparent.glb', crListT, 'exports/CR_2035_BAKED_FINAL/CR_2035_BAKED_FINAL/CR_2035_textures/CR_2035_textures_transparent/')
    
    //EYVerse
    var EYVerseList = ['ey_verse_curtains.jpg', 'ey_verse_floor.jpg', 'ey_verse_inner_walls.jpg', 'ey_verse_outer_walls.jpg', 'ey_verse_rafters.jpg', 'ey_verse_rug.jpg', 'ey_verse_screen.jpg', 'ey_verse_side_rails.jpg', 'ey_verse_speakers_1.jpg', 'ey_verse_speakers_2.jpg', 'ey_verse_stools.jpg', 'ey_verse_tables_and_chairs.jpg']
    loadTextureModel('exports/EY_VERSE_BAKED_GLB/EY_VERSE_BAKED_GLB/EY_VERSE_BAKED_.glb', EYVerseList, 'exports/EY_VERSE_BAKED_GLB/EY_VERSE_BAKED_GLB/EY_VERSE_BAKED_GLB_TEXTURES/')

    //Forum
    var forumListO = ['Forum_Chairs.jpg', 'Forum_Floor.jpg', 'Forum_Light_gels.jpg', 'Forum_Lower_Benches.jpg', 'Forum_Main_Stage.jpg', 'Forum_Rafters.jpg', 'Forum_Rear_wall.jpg', 'Forum_Screens_1.jpg', 'Forum_Screens_2.jpg', 'Forum_Screens_3.jpg', 'Forum_stage.jpg', 'Forum_Stage_and_Walls.jpg', 'Forum_Tables.jpg', 'Forum_Upper_Benches.jpg', 'Forum_wall_panels.jpg']
    loadTextureModel('exports/Forum_BAKED_FINAL/Forum_BAKED_FINAL/Forum_BAKED_opaque.glb', forumListO, 'exports/Forum_BAKED_FINAL/Forum_BAKED_FINAL/Forum_BAKED_textures/Forum_BAKED_textures_opaque/')
    var forumListT = ['Forum_light_truss.png']
    loadTextureModel('exports/Forum_BAKED_FINAL/Forum_BAKED_FINAL/Forum_BAKED_transparent.glb', forumListT, 'exports/Forum_BAKED_FINAL/Forum_BAKED_FINAL/Forum_BAKED_textures/Forum_BAKED_textures_transparent/')

    //IZ
    var IZListO = ['IR_Map_screen.jpg', 'IZ_arches.jpg', 'IZ_cafe_counter.jpg', 'IZ_chairs.jpg', 'IZ_desk.jpg', 'IZ_directions_1.jpg', 'IZ_directions_2.jpg', 'IZ_floor.jpg', 'IZ_furniture.jpg', 'IZ_map_button_01.jpg', 'IZ_map_button_02.jpg', 'IZ_map_button_03.jpg', 'IZ_map_button_04.jpg', 'IZ_map_button_05.jpg', 'IZ_map_button_06.jpg', 'IZ_map_button_07.jpg', 'IZ_map_button_08.jpg', 'IZ_map_button_09.jpg', 'IZ_rafters.jpg', 'IZ_seat_boxes.jpg', 'IZ_signage_1.jpg', 'IZ_signage_2.jpg', 'IZ_signage_3.jpg', 'IZ_sofa.jpg', 'IZ_stage.jpg', 'IZ_Startup_zone_screen.jpg', 'IZ_tables.jpg', 'IZ_walls.jpg', 'IZ_Wall_fix.jpg', 'IZ_welcome_corridor_screen_02.jpg', 'IZ_welcome_corridor_screen_03.jpg']
    loadTextureModelInteractive('exports/IZ_BAKED_FINAL/IZ_BAKED_FINAL/IZ_BAKED_opaque.glb', IZListO, 'exports/IZ_BAKED_FINAL/IZ_BAKED_FINAL/IZ_BAKED_textures/IZ_BAKED_textures_opaque/', 'IZ_map_button', mapButtons)
    //var IZListT = ['IZ_directions.png']
    //loadTextureModel('exports/IZ_BAKED_FINAL/IZ_BAKED_FINAL/IZ_BAKED_transparent.glb', IZListT, 'exports/IZ_BAKED_FINAL/IZ_BAKED_FINAL/IZ_Textures/IZ_Transparent/')

    //Market
    var mtextureListO = ['Market_buffet_1.jpg', 'Market_buffet_2.jpg', 'Market_buffet_3.jpg', 'Market_buffet_4.jpg', 'Market_counters.jpg', 'Market_directional_signage_1.jpg', 'Market_directional_signage_2.jpg', 'Market_Floor.jpg', 'Market_Forum_signage.jpg', 'Market_furniture.jpg', 'Market_green_panels.jpg', 'Market_innovation_text_1.jpg', 'Market_Light_gels.jpg', 'Market_mound.jpg', 'Market_overhead_screen_5.jpg', 'Market_Rafters.jpg', 'Market_Scaffold.jpg', 'Market_screens_01.jpg', 'Market_screens_02.jpg', 'Market_Signage_1.jpg', 'Market_Signage_2.jpg', 'Market_signage_stands.jpg', 'Market_sign_islands.jpg', 'Market_walls.jpg', 'Market_waterfall_screen.jpg']
    loadTextureModel('exports/MARKET_BAKED_FINAL/MARKET_BAKED_FINAL/Market_BAKED_FINAL_opaque.glb', mtextureListO, 'exports/Market_BAKED_FINAL/Market_BAKED_FINAL/Market_BAKED_FINAL_textures_opaque/')
    var mtextureListT = ['Market_baklava_1.png', 'Market_baklava_2.png', 'Market_desserts_1.png', 'Market_desserts_2.png', 'Market_desserts_3.png', 'Market_desserts_4.png', 'Market_foliage_bakery_wall.png', 'Market_foliage_hanging.png', 'Market_foliage_video_wall_1.png', 'Market_foliage_video_wall_2.png', 'Market_foliage_video_wall_3.png', 'Market_foliage_video_wall_4.png', 'Market_overhead_screen_1.png', 'Market_overhead_screen_2.png', 'Market_overhead_screen_3.png', 'Market_overhead_screen_4.png', 'Market_pink_treats.png', 'Market_trellis.png']
    loadTextureModel('exports/MARKET_BAKED_FINAL/MARKET_BAKED_FINAL/Market_BAKED_FINAL_transparent.glb', mtextureListT, 'exports/Market_BAKED_FINAL/Market_BAKED_FINAL/Market_BAKED_FINAL_textures_transparent/')

    //PurplePod
    var PurpList = ['Purple_Pod_chairs.jpg', 'Purple_pod_floor_ceiling.jpg', 'Purple_pod_screen.jpg', 'Purple_Pod_walls.jpg']
    loadTextureModel('exports/Purple_Pod_BAKED_FINAL/Purple_Pod_BAKED_FINAL/Purple_Pod_BAKED_opaque.glb', PurpList, 'exports/Purple_Pod_BAKED_FINAL/Purple_Pod_BAKED_FINAL/Purple_Pod_textures/Purple_Pod_textures_opaque/')

    //SpacePod
    var SpaceListO = ['Space_Pod_chairs.jpg', 'Space_Pod_floor_ceiling.jpg', 'Space_Pod_Inner_wall.jpg', 'Space_Pod_screen.jpg', 'Space_Pod_wood_pillars.jpg']
    loadTextureModel('exports/Space_Pod_BAKED_FINAL/Space_Pod_BAKED_FINAL/Space_Pod_BAKED_opaque.glb', SpaceListO, 'exports/Space_Pod_BAKED_FINAL/Space_Pod_BAKED_FINAL/Space_Pod_textures/Space_Pod_textures_opaque/')
    var SpaceListT = ['Space_Pod_truss.png']
    loadTextureModel('exports/Space_Pod_BAKED_FINAL/Space_Pod_BAKED_FINAL/Space_Pod_BAKED_transparent.glb', SpaceListT, 'exports/Space_Pod_BAKED_FINAL/Space_Pod_BAKED_FINAL/Space_Pod_textures/Space_Pod_textures_transparent/')

    //Speakeasy
    var SpeakEasyListO = ['SpeakEasy_barstools.jpg', 'SpeakEasy_Bar_Back_Bottles.jpg', 'SpeakEasy_Bar_Back_Lighting.jpg', 'SpeakEasy_bar_shelves.jpg', 'SpeakEasy_Bar_top.jpg', 'SpeakEasy_brick_wall.jpg', 'SpeakEasy_floor.jpg', 'SpeakEasy_paneled_wall.jpg', 'SpeakEasy_rafters.jpg', 'SpeakEasy_screen.jpg', 'SpeakEasy_Table_and_Chairs.jpg', 'SpeakEasy_walls.jpg']
    loadTextureModel('exports/SpeakEasy_BAKED_FINAL/SpeakEasy_BAKED_FINAL/SpeakEasy_BAKED_opaque.glb', SpeakEasyListO, 'exports/SpeakEasy_BAKED_FINAL/SpeakEasy_BAKED_FINAL/SpeakEasy_BAKED_textures/SpeakEasy_BAKED_textures_opaque/')
    var SpeakEasyListT = ['SpeakEasy_edison_lamps.png', 'SpeakEasy_liquor_bottles.png']
    loadTextureModel('exports/SpeakEasy_BAKED_FINAL/SpeakEasy_BAKED_FINAL/SpeakEasy_BAKED_transparent.glb', SpeakEasyListT, 'exports/SpeakEasy_BAKED_FINAL/SpeakEasy_BAKED_FINAL/SpeakEasy_BAKED_textures/SpeakEasy_BAKED_textures_transparent/')
 
    //TZ
    //
    var TZListO = ['TZ_blockchain.jpg', 'TZ_Curved_screens_01.jpg', 'TZ_Curved_screens_02.jpg', 'TZ_Curved_screens_06.jpg', 'TZ_Curved_screens_06.png', 'TZ_Floor.jpg', 'TZ_mirror_wall.jpg', 'TZ_murals_01.jpg', 'TZ_outer_walls.jpg', 'TZ_pillar_monitors.jpg', 'TZ_Projectors.jpg', 'TZ_rafters.jpg', 'TZ_wall_monitors.jpg']
    loadTextureModelInteractive('exports/TZ_BAKED_FINAL/TZ_BAKED_FINAL/TZ_Experiment2.glb', TZListO, 'exports/TZ_BAKED_FINAL/TZ_BAKED_FINAL/TZ_BAKED_Textures/TZ_BAKED_opaque/', 'blockchain', TZmaps)

    //VRBar
    var VRBarListO = ['VR_Bar_back_wall_fix.jpg', 'VR_Bar_Direction_Graphic.jpg', 'VR_Bar_display01.jpg', 'VR_Bar_Floor.jpg', 'VR_Bar_floor_lights.jpg', 'VR_Bar_furniture.jpg', 'VR_Bar_Inner_walls.jpg', 'VR_Bar_Outer_walls.jpg', 'VR_Bar_screens01.jpg', 'VR_Bar_screens02.jpg', 'VR_Bar_screens03.jpg', 'VR_Bar_screens04.jpg', 'VR_Bar_Wall_fix.jpg', 'VR_Bar_yellow_Arches.jpg']
    loadTextureModel('exports/VR_Bar_BAKED_FINAL/VR_Bar_BAKED_FINAL/VR_Bar_BAKED_opaque.glb', VRBarListO, 'exports/VR_Bar_BAKED_FINAL/VR_Bar_BAKED_FINAL/VR_Bar_BAKED_textures/VR_Bar_BAKED_opaque/')
    var VRBarListT = ['VR_Bar_shooters.png']
    loadTextureModel('exports/VR_Bar_BAKED_FINAL/VR_Bar_BAKED_FINAL/VR_Bar_BAKED_transparent.glb', VRBarListT, 'exports/VR_Bar_BAKED_FINAL/VR_Bar_BAKED_FINAL/VR_Bar_BAKED_textures/VR_Bar_BAKED_transparent/')

    
}

function loadTextureModel(model, textureList, texturepath){
    gltfLoader.load(
        model,
        (gltf) =>
        {
        
                   //var textureList = ['Market_baklava_1.png', 'Market_baklava_2.png', 'Market_buffet_1.jpg', 'Market_buffet_2.jpg', 'Market_buffet_3.jpg', 'Market_buffet_4.jpg', 'Market_counters.jpg', 'Market_Floor.jpg', 'Market_Forum_signage.jpg', 'Market_furniture.jpg', 'Market_green_panels.jpg', 'Market_innovation_text 1.jpg', 'market_innovation_text 2.jpg', 'Market_overhead_screen_1.jpg', 'Market_pink_treats.png', 'Market_Rafters.jpg', 'Market_Scaffold.jpg', 'Market_screens_01.jpg', 'Market_screens_02.jpg', 'Market_Signage_1.jpg', 'Market_Signage_2.jpg', 'Market_signage_stands.jpg', 'Market_sign_islands.jpg', 'Market_walls.jpg', 'Market_waterfall_screen.jpg']       
        for (var i = 0; i < textureList.length; i++){
            var texturename = textureList[i];
            var basename = texturename.slice(0, -4);
            console.log(basename)
            texturename = texturepath + texturename;
            const bakedMesh = gltf.scene.children.find(child => child.name === basename)
            const bakedTexture = textureLoader.load(texturename)
            bakedTexture.flipY = false
            bakedTexture.encoding = THREE.sRGBEncoding
            const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })
            console.log(basename)
           
            

            try{
            bakedMesh.material = bakedMaterial
            }
            catch(error){
                console.log("error!" + basename)
            }

             //TO DO: make this less silly
            if(texturename.includes('ey_verse_screen')){
                /*
                var video = document.getElementById( 'video' );
                var videotexture = new THREE.VideoTexture( video );
                const videomaterial = new THREE.MeshBasicMaterial( { map: videotexture } );
                videomaterial.flipY = true;
                bakedMesh.material = videomaterial;
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
            console.log(basename)
            texturename = texturepath + texturename;
            const bakedMesh = gltf.scene.children.find(child => child.name === basename)
            const bakedTexture = textureLoader.load(texturename)
            bakedTexture.flipY = false
            bakedTexture.encoding = THREE.sRGBEncoding
            const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })
            console.log(basename)
            try{
            bakedMesh.material = bakedMaterial
            }
            catch(error){
                console.log("error!" + basename)
            }
            if(texturename.includes(intstr)){
                console.log("adding the " + bakedMesh.position.x)
                intobjs.push(bakedMesh);
            }
            
        }
        
        scene.add(gltf.scene)
        }
    )
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

function displaySlides(p){

    
    
    //Set pcamera, should probably change
    pcamera = camera;
    console.log(p)
    console.log(p.x)
    console.log(ocamera)
    ocamera.position.x = p.x;
    ocamera.position.y = p.y;
    ocamera.position.z = p.z-3;
    ocamera.quaternion.setFromEuler( new Euler( 0, -Math.PI/4, 0, 'YXZ' ));
    //ocamera.quaternion


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

    scene.add(back_mesh)
    scene.add(next_mesh)
    back_mesh.position.set(37-1.2, p.y, -9.4)
    next_mesh.position.set(37, p.y, -9.4)
    console.log("back mesh " + back_mesh);

    displaying = true;


}

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

