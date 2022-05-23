import './style.css'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { Euler } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { CSS3DObject } from 'three-css3drenderer';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// /**
//  * Spector JS
//  */
// const SPECTOR = require('spectorjs')
// const spector = new SPECTOR.Spector()
// spector.displayUI()

let camera, scene, dummyscene, renderer, controls;

const objects = [];

let collision;
let camMoveX = 0;
let camMoveY = 0;

let raycaster;
let fraycaster;
let braycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();
//var fs = require('fs');

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
    width: 400
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

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
function createCSS3DObject(content) 
    {
      // convert the string to dome elements
      var wrapper = document.createElement('div');
      wrapper.innerHTML = content;
      var div = wrapper.firstChild;

      // set some values on the div to style it.
      // normally you do this directly in HTML and 
      // CSS files.
      div.style.width = '370px';
      div.style.height = '370px';
      div.style.opacity = 0.7;
      div.style.background = new THREE.Color(Math.random() * 0xffffff).getStyle();

      // create a CSS3Dobject and return it.
      var object = new CSS3DObject(div);
      return object;
    }

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
collision = new THREE.Object3D();
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
            o.material = tempMaterial;
            }
          });
        collision.name = 'collision'
        scene.add(collision)
    }
)


    controls = new PointerLockControls( camera, document.body );

    //const blocker = document.getElementById( 'blocker' );
    //const instructions = document.getElementById( 'instructions' );

    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);

    document.addEventListener( 'click', function () {

        //controls.lock();

    } );

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

    


    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
    fraycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, 0, 0 ), 0, 10 );
    braycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, 0, 0 ), 0, 10 );
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


    /*
    if ( controls.isLocked === true ) {

        raycaster.ray.origin.copy( controls.getObject().position );
        raycaster.ray.origin.y -= 1.5;

        fraycaster.ray.origin.copy( controls.getObject().position );
        let d = new THREE.Vector3();
        fraycaster.ray.direction.copy( camera.getWorldDirection(d));
        fraycaster.ray.direction.y = 0;

        braycaster.ray.origin.copy( controls.getObject().position );
        braycaster.ray.direction = -fraycaster.ray.direction;
        let collisions = [collision]
        const intersections = raycaster.intersectObjects( objects, false );
        const fintersections = raycaster.intersectObjects( collisions, false);
        const bintersections = raycaster.intersectObjects( collisions, false);

        const onObject = intersections.length > 0;
        const fonObject = fintersections.length > 0;
        const bonObject = bintersections.length > 0;
        console.log(fonObject);

        const delta = ( time - prevTime ) / 2000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize(); // this ensures consistent movements in all directions

        if ( moveForward || moveBackward ) velocity.z -= direction.z * 100.0 * delta;
        if ( moveLeft || moveRight ) velocity.x -= direction.x * 100.0 * delta;

        if ( onObject === true ) {

            velocity.y = Math.max( 0, velocity.y );
            canJump = true;
            console.log("bo!")

        }

        if( fonObject === true ){
            console.log("ba!");
        }

        //controls.moveRight( - velocity.x * delta );
        //Camera move
        const _euler = new Euler( 0, 0, 0, 'YXZ' );
        _euler.setFromQuaternion( camera.quaternion );

		_euler.y += velocity.x * 0.002;

		//_euler.y = Math.max( Math.PI / 2 - Math.PI, Math.min(Math.PI / 2  - 0, _euler.y ) );

		camera.quaternion.setFromEuler( _euler );




        controls.moveForward( - velocity.z * delta );

        controls.getObject().position.y += ( velocity.y * delta ); // new behavior

        if ( controls.getObject().position.y < 1.5 ) {

            velocity.y = 0;
            controls.getObject().position.y = 1.5;

            canJump = true;

        }

    }
    */

    //Controls stuff

    

    const delta = ( time - prevTime ) / 2000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize(); // this ensures consistent movements in all directions

        if ( moveForward || moveBackward ) velocity.z -= direction.z * 100.0 * delta;
        if ( moveLeft || moveRight ) velocity.x -= direction.x * 100.0 * delta;

        //controls.moveRight( - velocity.x * delta );


        //Camera move
        const _euler = new Euler( 0, 0, 0, 'YXZ' );
        _euler.setFromQuaternion( camera.quaternion );

        //Add camera and mouse (ideally one should be 0)
        _euler.y += velocity.x * 0.002 + camMoveX * 0.0002;
        //Just from mouse
        _euler.x += camMoveY * 0.0002;
		camera.quaternion.setFromEuler( _euler );




        controls.moveForward( - velocity.z * delta );

        controls.getObject().position.y += ( velocity.y * delta ); // new behavior
        if ( controls.getObject().position.y < 1.5 ) {

            velocity.y = 0;
            controls.getObject().position.y = 1.5;

        }

    







    prevTime = time;

    renderer.render( scene, camera );

}

init()
animate()

function mouseUp()
    {
        window.removeEventListener('mousemove', divMove, true);
        //firstClick = true;
        camMoveX = 0;
        camMoveY = 0;
    }

    function mouseDown(e){
        window.addEventListener('mousemove', divMove, true);
        var xpos = e.pageX;
        var ypos = e.pageY;
        console.log(window.innerWidth-ypos)
        xpos = 100-(window.innerWidth-xpos);
        ypos = 100-(window.innerHeight-ypos);
        camMoveX = -xpos;
        camMoveY = -ypos;
        console.log(xpos + " " + ypos);
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
    var forumListO = ['Forum_Chairs.jpg', 'Forum_Floor.jpg', 'Forum_Lower Benches_02.jpg', 'Forum_Main Stage.jpg', 'Forum_Rafters.jpg', 'Forum_Rear wall.jpg', 'Forum_Screens.jpg', 'Forum_Stage and Walls.jpg', 'Forum_stage.jpg', 'Forum_Tables_32.jpg', 'Forum_Upper Benches_01.jpg', 'Forum_wall panels.jpg']
    loadTextureModel('exports/Forum_BAKED_FINAL/Forum_BAKED_FINAL/Forum_BAKED_opaque.glb', forumListO, 'exports/Forum_BAKED_FINAL/Forum_BAKED_FINAL/Forum_BAKED_textures/Forum_BAKED_textures_opaque/')
    var forumListT = ['Forum_light_truss.png']
    loadTextureModel('exports/Forum_BAKED_FINAL/Forum_BAKED_FINAL/Forum_BAKED_transparent.glb', forumListT, 'exports/Forum_BAKED_FINAL/Forum_BAKED_FINAL/Forum_BAKED_textures/Forum_BAKED_textures_transparent/')

    //IZ
    var IZListO = ['IR_Map_screen.jpg', 'IZ_arches.jpg', 'IZ_cafe_counter.jpg', 'IZ_chairs.jpg', 'IZ_desk.jpg', 'IZ_floor.jpg', 'IZ_furniture.jpg', 'IZ_rafters.jpg', 'IZ_seat_boxes.jpg', 'IZ_signage_1.jpg', 'IZ_signage_2.png', 'IZ_sofa.jpg', 'IZ_stage.jpg', 'IZ_Startup_zone_screen.jpg', 'IZ_tables.jpg', 'IZ_walls.jpg', 'IZ_Wall_fix.jpg']
    loadTextureModel('exports/IZ_BAKED_FINAL/IZ_BAKED_FINAL/IZ_BAKED_opaque.glb', IZListO, 'exports/IZ_BAKED_FINAL/IZ_BAKED_FINAL/IZ_Textures/IZ_Opaque/')
    var IZListT = ['IZ_directions.png']
    loadTextureModel('exports/IZ_BAKED_FINAL/IZ_BAKED_FINAL/IZ_BAKED_transparent.glb', IZListT, 'exports/IZ_BAKED_FINAL/IZ_BAKED_FINAL/IZ_Textures/IZ_Transparent/')

    //PurplePod
    var PurpList = ['Purple_Pod_chairs.jpg', 'Purple_pod_floor_ceiling.jpg', 'Purple_pod_screen.jpg', 'Purple_Pod_walls.jpg']
    loadTextureModel('exports/Purple_Pod_BAKED_FINAL/Purple_Pod_BAKED_FINAL/Purple_Pod_BAKED_opaque.glb', PurpList, 'exports/Purple_Pod_BAKED_FINAL/Purple_Pod_BAKED_FINAL/Purple_Pod_textures/Purple_Pod_textures_opaque/')

    //SpacePod
    var SpaceListO = ['Space_Pod_chairs.jpg', 'Space_Pod_floor_ceiling.jpg', 'Space_Pod_Inner_wall.jpg', 'Space_Pod_screen.jpg', 'Space_Pod_wood_pillars.jpg']
    loadTextureModel('exports/Space_Pod_BAKED_FINAL/Space_Pod_BAKED_FINAL/Space_Pod_BAKED_opaque.glb', SpaceListO, 'exports/Space_Pod_BAKED_FINAL/Space_Pod_BAKED_FINAL/Space_Pod_textures/Space_Pod_textures_opaque/')
    var SpaceListT = ['Space_Pod_truss.png']
    loadTextureModel('exports/Space_Pod_BAKED_FINAL/Space_Pod_BAKED_FINAL/Space_Pod_BAKED_transparent.glb', SpaceListT, 'exports/Space_Pod_BAKED_FINAL/Space_Pod_BAKED_FINAL/Space_Pod_textures/Space_Pod_textures_transparent/')

    //Speakeasy
    var SpeakEasyListO = ['SpeakEasy_barstools.jpg', 'SpeakEasy_Bar_Back Bottles.jpg', 'SpeakEasy_Bar_Back Lighting.jpg', 'SpeakEasy_bar_shelves.jpg', 'SpeakEasy_Bar_top.jpg', 'SpeakEasy_brick_wall.jpg', 'SpeakEasy_floor.jpg', 'SpeakEasy_paneled_wall.jpg', 'SpeakEasy_rafters.jpg', 'SpeakEasy_screen.jpg', 'SpeakEasy_Table and Chairs.jpg', 'SpeakEasy_walls.jpg']
    loadTextureModel('exports/SpeakEasy_BAKED_FINAL/SpeakEasy_BAKED_FINAL/SpeakEasy_BAKED_opaque.glb', SpeakEasyListO, 'exports/SpeakEasy_BAKED_FINAL/SpeakEasy_BAKED_FINAL/SpeakEasy_BAKED_textures/SpeakEasy_BAKED_textures_opaque/')
    var SpeakEasyListT = ['SpeakEasy_edison_lamps.png', 'SpeakEasy_liquor_bottles.png']
    loadTextureModel('exports/SpeakEasy_BAKED_FINAL/SpeakEasy_BAKED_FINAL/SpeakEasy_BAKED_transparent.glb', SpeakEasyListT, 'exports/SpeakEasy_BAKED_FINAL/SpeakEasy_BAKED_FINAL/SpeakEasy_BAKED_textures/SpeakEasy_BAKED_textures_transparent/')
 
    //TZ
    var TZListO = ['TZ_Curved_screens_01.jpg', 'TZ_Curved_screens_02.jpg', 'TZ_Curved_screens_06.jpg', 'TZ_Curved_screens_06.png', 'TZ_Floor.jpg', 'TZ_mirror_wall.jpg', 'TZ_murals_01.jpg', 'TZ_outer_walls.jpg', 'TZ_pillar_monitors.jpg', 'TZ_Projectors.jpg', 'TZ_rafters.jpg', 'TZ_wall_monitors.jpg']
    loadTextureModel('exports/TZ_BAKED_FINAL/TZ_BAKED_FINAL/TZ_BAKED_opaque.glb', TZListO, 'exports/TZ_BAKED_FINAL/TZ_BAKED_FINAL/TZ_BAKED_Textures/TZ_BAKED_opaque/')

    //VRBar
    var VRBarListO = ['VR_Bar_back_wall_fix.jpg', 'VR_Bar_display01.jpg', 'VR_Bar_Floor.jpg', 'VR_Bar_floor_lights.jpg', 'VR_Bar_furniture.jpg', 'VR_Bar_Inner_walls.jpg', 'VR_Bar_Outer_walls.jpg', 'VR_Bar_screens01.jpg', 'VR_Bar_screens02.jpg', 'VR_Bar_screens03.jpg', 'VR_Bar_screens04.jpg', 'VR_Bar_Wall_fix.jpg', 'VR_Bar_yellow_Arches.jpg']
    loadTextureModel('exports/VR_Bar_BAKED_FINAL/VR_Bar_BAKED_FINAL/VR_Bar_BAKED_opaque.glb', VRBarListO, 'exports/VR_Bar_BAKED_FINAL/VR_Bar_BAKED_FINAL/VR_Bar_BAKED_textures/VR_Bar_BAKED_opaque/')
    var VRBarListT = ['VR_Bar_Direction Graphic.png', 'VR_Bar_shooters.png']
    loadTextureModel('exports/VR_Bar_BAKED_FINAL/VR_Bar_BAKED_FINAL/VR_Bar_BAKED_transparent.glb', VRBarListT, 'exports/VR_Bar_BAKED_FINAL/VR_Bar_BAKED_FINAL/VR_Bar_BAKED_textures/VR_Bar_BAKED_transparent/')

    //Market
    var mtextureListO = ['Market_baklava_1.png', 'Market_baklava_2.png', 'Market_buffet_1.jpg', 'Market_buffet_2.jpg', 'Market_buffet_3.jpg', 'Market_buffet_4.jpg', 'Market_counters.jpg', 'Market_directional_signage.jpg', 'Market_Floor.jpg', 'Market_Forum_signage.jpg', 'Market_furniture.jpg', 'Market_green_panels.jpg', 'Market_innovation_text_1.jpg', 'Market_innovation_text_2.jpg', 'Market_pink_treats.png', 'Market_Rafters.jpg', 'Market_Scaffold.jpg', 'Market_screens_01.jpg', 'Market_screens_02.jpg', 'Market_Signage_1.jpg', 'Market_Signage_2.jpg', 'Market_signage_stands.jpg', 'Market_sign_islands.jpg', 'Market_walls.jpg', 'Market_waterfall_screen.jpg']       
    loadTextureModel('exports/MARKET_BAKED_FINAL/MARKET_BAKED_FINAL/Market_GEO_BAKED_opaque.glb', mtextureListO, 'exports/MARKET_BAKED_FINAL/MARKET_BAKED_FINAL/')
    //var mtextureListT = ['Market_desserts_1.png', 'Market_desserts_2.png', 'Market_desserts_3.png', 'Market_desserts_4.png', 'Market_foliage_bakery_wall.png', 'Market_foliage_hanging.png', 'Market_foliage_video_wall_1.png', 'Market_foliage_video_wall_2.png', 'Market_foliage_video_wall_3.png', 'Market_foliage_video_wall_4.png', 'Market_overhead_screen_2.png', 'Market_overhead_screen_3.png']
    var mtextureListT = ['Market_desserts_1.png', 'Market_desserts_2.png', 'Market_desserts_3.png', 'Market_desserts_4.png', 'Market_foliage_bakery_wall.png', 'Market_foliage_hanging.png', 'Market_foliage_video_wall.png', 'Market_overhead_screen.png']
    loadTextureModel('exports/MARKET_BAKED_FINAL/MARKET_BAKED_FINAL/Market_GEO_BAKED_transparent.glb', mtextureListT, 'exports/MARKET_BAKED_FINAL/MARKET_BAKED_FINAL/')
    var mtextureListM = ['Market_mound.jpg']
    loadTextureModel('exports/MARKET_BAKED_FINAL/MARKET_BAKED_FINAL/Market_GEO_BAKED_materials_only.glb', mtextureListM, 'exports/MARKET_BAKED_FINAL/MARKET_BAKED_FINAL/')

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
            
        }
        
        scene.add(gltf.scene)
        }
    )
}

function makeColor(){
    var color = new THREE.Color( 0xffffff );
    color.setHex( Math.random() * 0xffffff );
    const portalLightMaterial = new THREE.MeshBasicMaterial({ color: color })
    return portalLightMaterial;
}