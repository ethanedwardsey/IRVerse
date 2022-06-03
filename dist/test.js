//Hi
//import '/style.css'
import * as THREE from 'three';
import { Color, Euler, Vector2, Vector3 } from 'three';
import { GLTFLoader } from './GLTFLoader.js';
import { DRACOLoader } from './DRACOLoader.js';
import { PointerLockControls } from './PointerLockControls.js';


console.log("here")

let camera, scene, dummyscene, renderer, controls;
let pcamera, ocamera;
const objects = [];
var slideMode = false;

var back_mesh;
var next_mesh;
var x_mesh;

let camMoveX = 0;
let camMoveY = 0;
var clickmovepoint;
var clickmoving = false;

var slideMesh;

let raycaster;
let loaded = false;
let modelsloaded = false;
let spun = false;

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


var monitorsangles = {'TZ_wall_monitors_03': -Math.PI, 'TZ_wall_monitors_08': 0, 'TZ_wall_monitors_01': -Math.PI/2};
var monitorangles = [-Math.PI, 0, -Math.PI/2]


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
const slides = []
let currentSlide = 0;
slides[0] = '/exports/slides/slide1.png'
slides[1] = '/exports/slides/slide2.png'
slides[2] = '/exports/slides/slide3.png'



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
loadFullModels();
addLights();
loadBSlides();
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
        }
    } else{
        camSpin();
    }

    if(loaded){
        //videotexture.needsUpdate = true;
    //videomaterial.needsUpdate = true;
        intObjects = mapButtons;
        //glow();
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
            
            

            //intersects[ i ].object.material.color.set( 0xff0000 );

        }
        console.log(TZmaps);
        const bintersects = clickraycaster.intersectObjects( TZmaps );
        //console.log([collision])
        //console.log(scene.children)
        //console.log(mapButtons);

        for ( let i = 0; i < bintersects.length; i ++ ) {
            console.log("logging object")
            console.log(bintersects[i]);
            console.log(bintersects[i].object.position);
            console.log(bintersects[i].object.rotation);
            console.log(bintersects[i].object.name);
            displaySlides(bintersects[i].object.position, monitorsangles[bintersects[i].object.name]);
            slideMesh = bintersects[i].object;
            console.log(slideMesh);
            console.log(bintersects[i]);
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

            /*
            const pointmarker = new THREE.BoxGeometry(1, 1, 1);
            var pcolor = new THREE.Color( 0xffffff );
            const pointmaterial = new THREE.MeshBasicMaterial({ color:  0x00ff00 })
            var pointmesh = new THREE.Mesh(pointmarker, pointmaterial)
            scene.add(pointmesh);
            pointmesh.position.x=clickmovepoint.x;
            pointmesh.position.y = 0.75;
            pointmesh.position.z=clickmovepoint.z;
            */
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

                //console.log("playerpos is " + curPos.x + "," + curPos.y + "," +curPos.z + ", dest is "  + clickmovepoint.x + "," + clickmovepoint.y + "," + clickmovepoint.z + ", rotation is " + eulerangle.y)
                //console.log("zvec is " + zvec + ", xvec is " + xvec)
                //console.log("fmove is " + fmove + "from " + zvec*Math.cos(angle) + " and " + xvec*Math.sin(angle))
                //console.log("rmove is " + rmove + "from " + zvec*Math.sin(angle) + " and " + xvec*Math.cos(angle))
                /*
                if(Math.abs(fmove)<1){
                    velocity.z = 0;
                }
                else{
                    velocity.z = fmove;
                }
                if(Math.abs(rmove)<1){
                    velocity.x = 0;
                }
                else{
                    velocity.x = -rmove;
                }
                */
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
        /*
        if(xpos>-200 && ypos>-200){
            camMoveX = -xpos;
            camMoveY = -ypos;
            console.log(xpos + " " + ypos);
        }
        */
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
    loadTextureModel('exports/CR_2035_BAKED_FINAL/CR_2035_BAKED_FINAL/CR_2035_BAKED_opaque.glb', crList, 'exports/CR_2035_BAKED_FINAL/CR_2035_BAKED_FINAL/CR_2035_textures/CR_2035_textures_opaque/', false)
    var crListT = ['CR_2035_truss.png']
    loadTextureModel('exports/CR_2035_BAKED_FINAL/CR_2035_BAKED_FINAL/CR_2035_BAKED_transparent.glb', crListT, 'exports/CR_2035_BAKED_FINAL/CR_2035_BAKED_FINAL/CR_2035_textures/CR_2035_textures_transparent/', true)
    
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
    loadTextureModel('exports/Market_BAKED_FINAL/Market_BAKED_FINAL/Market_BAKED_FINAL_Opaque2.glb', mtextureListO, 'exports/Market_BAKED_FINAL/Market_BAKED_FINAL/Market_BAKED_FINAL_textures_opaque/')
    var mtextureListT = ['Market_baklava_1.png', 'Market_baklava_2.png', 'Market_desserts_1.png', 'Market_desserts_2.png', 'Market_desserts_3.png', 'Market_desserts_4.png', 'Market_foliage_bakery_wall.png', 'Market_foliage_hanging.png', 'Market_foliage_video_wall_1.png', 'Market_foliage_video_wall_2.png', 'Market_foliage_video_wall_3.png', 'Market_foliage_video_wall_4.png', 'Market_overhead_screen_1.png', 'Market_overhead_screen_2.png', 'Market_overhead_screen_3.png', 'Market_overhead_screen_4.png', 'Market_pink_treats.png', 'Market_trellis.png']
    loadTextureModel('exports/Market_BAKED_FINAL/Market_BAKED_FINAL/Market_BAKED_FINAL_Transparent2.glb', mtextureListT, 'exports/Market_BAKED_FINAL/Market_BAKED_FINAL/Market_BAKED_FINAL_textures_transparent/', true)

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
    
    //Walls
    loadTextureModel('exports/IR_Outer_Walls_and_Ceiling/IR_Outer_Walls_and_Ceiling/outer_walls.glb', [], '')
    loadTextureModel('exports/IR_Outer_Walls_and_Ceiling/IR_Outer_Walls_and_Ceiling/ceiling.glb', [], '')
    
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
                var video = document.getElementById( 'video' );
                videotexture = new THREE.VideoTexture( video );
                //videotexture.needsUpdate = true;
                videomaterial = new THREE.MeshBasicMaterial( { map: videotexture } );
                videomaterial.flipY = true;
                videomaterial.needsUpdate = true;
                bakedMesh.material = videomaterial;
                //addSound(bakedMesh);
                console.log("video")
                
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

function loadBSlides(){
    var bslides = ['/exports/slides/blockchain/blockchain_01.jpg', '/exports/slides/blockchain/blockchain_02.jpg', '/exports/slides/blockchain/blockchain_03.jpg', '/exports/slides/blockchain/blockchain_04.jpg', '/exports/slides/blockchain/blockchain_05.jpg', '/exports/slides/blockchain/blockchain_06.jpg', '/exports/slides/blockchain/blockchain_07.jpg', '/exports/slides/blockchain/blockchain_08.jpg', '/exports/slides/blockchain/blockchain_09.jpg', '/exports/slides/blockchain/blockchain_10.jpg', '/exports/slides/blockchain/blockchain_11.jpg', '/exports/slides/blockchain/blockchain_12.jpg', '/exports/slides/blockchain/blockchain_13.jpg', '/exports/slides/blockchain/blockchain_14.jpg', '/exports/slides/blockchain/blockchain_15.jpg', '/exports/slides/blockchain/blockchain_16.jpg', '/exports/slides/blockchain/blockchain_17.jpg', '/exports/slides/blockchain/blockchain_18.jpg', '/exports/slides/blockchain/blockchain_19.jpg', '/exports/slides/blockchain/blockchain_20.jpg']
    for(var i = 0; i < bslides.length; i++){
        slides[i] = makeTexture(bslides[i]);
    }
    //slides[0] = textureLoader.load('/exports/slides/slide1.png')
    //slides[1] = textureLoader.load('/exports/slides/slide2.png')
    //slides[2] = textureLoader.load('/exports/slides/slide3.png')
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

function displaySlides(p, a, dist){

    dist = 3;
    
    //Set pcamera, should probably change
    pcamera = camera;
    console.log(p)
    console.log(p.x)
    console.log(ocamera)
    ocamera.position.x = p.x-Math.sin(a)*dist;
    ocamera.position.y = p.y;
    ocamera.position.z = p.z-Math.cos(a)*dist;
    ocamera.quaternion.setFromEuler( new Euler( 0, a+Math.PI, 0, 'YXZ' ));
    //ocamera.quaternion
    back_mesh.position.set(p.x+0.5*Math.cos(a), p.y, p.z-0.5*Math.sin(a));
    back_mesh.rotation.set(0, a, 0);
    next_mesh.position.set(p.x-0.5*Math.cos(a), p.y, p.z+0.5*Math.sin(a));
    next_mesh.rotation.set(0, a, 0);

    x_mesh.position.set(p.x+0.5*Math.cos(a), p.y+0.4, p.z-0.5*Math.sin(a));
    x_mesh.rotation.set(0, a, 0);
    back_mesh.visible = true;
    next_mesh.visible = true;
    x_mesh.visible = true;
    
    console.log("backmesh" + back_mesh.position.x+","+back_mesh.position.y+","+back_mesh.position.z);

    slideMode = true;


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
            //controller.style.display = "inline"
            //console.log(_euler);
    }
}

function addLights(){
    const light = new THREE.AmbientLight( 0x404040 ); // soft white light
    light.intensity = 6;
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
    if(intcolor>0.35){
        colorchanger = -0.0025
    }
    else if(intcolor<0.1){
        colorchanger = 0.0025
    }
    intcolor = intcolor + colorchanger;
    //console.log(intcolor);
    
}
