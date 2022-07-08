//Hi
//import '/style.css'
import * as THREE from 'three';
import { Color, Euler, Object3D, Vector2, Vector3 } from 'three';
import { GLTFLoader } from './GLTFLoader.js';
import { DRACOLoader } from './DRACOLoader.js';
import { PointerLockControls } from './PointerLockControls.js';
//import { object } from 'webidl-conversions';


console.log("here")

let camera, scene, dummyscene, renderer, controls;
let pcamera, ocamera;
let slidecammode = false;
var slideMode = false;

var back_mesh;
var next_mesh;
var x_mesh;
var contact_mesh;

let camMoveX = 0;
let camMoveY = 0;
var clickmovepoint;
var clickmoving = false;

var slideMesh;
var Slide_screen;

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
var controlShowMode;

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
var buttonClicked = false;

var collision;
var intObjects = [];
var mapButtons = [];
var TZmaps = [];
var SplitScreens = [];
var IZMainScreen;
var PurpleMainScreen;
var SpaceMainScreen;
var MainScreens = [];

var VideoScreens = [];
var VideoScreensGlow = [];


var videos = [];
var sounds = [];

var soundsadded = 0;
var soundsToAdd = 1;

var slidedir = true;
var animatecount;

var actualSlideMode = false;

var intcolor=0;
var colorchanger = 0.05;
let whiteColor = new THREE.Color( 0xffffff );
let yellowColor = new THREE.Color( 0xffe600 );

//var contactSlides = {'TZ_wall_monitors_01': 3,  'TZ_wall_monitors_02': 11, 'TZ_wall_monitors_03': 5, 'TZ_wall_monitors_04': 12, 'TZ_wall_monitors_08': 32, 'TZ_blockchain_01': 5, 'TZ_blockchain_02': 0, 'TZ_blockchain_19': 1, 'TZ_blockchain_20': 4, 'TZ_wall_monitors_05': 2, 'TZ_wall_monitors_06': 21, 'TZ_wall_monitors_07': 31, 'TZ_pillar_monitors_02': 1, 'CR_2035_screen': 1, 'IZ_screen_1': 1, 'IZ_screen_2': 1, 'Purple_pod_screen_1': 1, 'Purple_pod_screen_2':2, 'Purple_pod_screen_3':2, 'Purple_pod_screen_4':1, 'infinite_possibilities_screen_1':2, 'infinite_possibilities_screen_2':2, 'infinite_possibilities_screen_3':2, 'infinite_possibilities_screen_4':1, 'infinite_possibilities_screen_005': 1, 'infinite_possibilities_screen_006': 1};

var monitorsangles = { 'TZ_wall_monitors_01': -Math.PI/2,  'TZ_wall_monitors_02': -Math.PI/2, 'TZ_wall_monitors_03': -Math.PI, 'TZ_wall_monitors_04': -Math.PI, 'TZ_wall_monitors_08': 0, 'TZ_blockchain_01': -Math.PI, 'TZ_blockchain_02': Math.PI/2, 'TZ_blockchain_19': Math.PI/2, 'TZ_blockchain_20': -Math.PI, 'TZ_wall_monitors_05': -Math.PI, 'TZ_wall_monitors_06': 0, 'TZ_wall_monitors_07': 0, 'TZ_pillar_monitors_01': Math.PI/2, 'TZ_pillar_monitors_02': 0, 'TZ_pillar_monitors_03': -Math.PI/2, 'TZ_pillar_monitors_04': -Math.PI, 'CR_2035_screen': 0, 'Forum_Screens_2': -Math.PI/2, 'Forum_Screens_3':-Math.PI/2};

var videosounds = {'ey_verse_screen': 'EYVerse.mp3', 'Forum_Screens_1': 'HighlightsAudio.mp3', 'Market_waterfall_screen_AI': 'RobotAudio.mp3', 'SpeakEasy_screen':'BeatBoxAudio.mp3'};
var playtextures = {'ey_verse_screen': 'EYVersePlayTexture.jpg', 'Forum_Screens_1': 'HighlightsPlay.jpg', 'Forum_Screens_3': 'CarminePlayButton.jpg', 'Market_waterfall_screen_AI': 'RobotPlay.jpg', 'SpeakEasy_screen':'BeatboxPlay.jpg', 'VR_Bar_screens04': 'BeatboxPlay.jpg', 'VR_Bar_screens03': 'RobotPlay.jpg'};
var videoindexes = {'ey_verse_screen': 0, 'Forum_Screens_1': 1, 'Market_waterfall_screen_AI': 3, 'SpeakEasy_screen': 2, 'Market_screens_01':4, 'Market_screens_02':5};
var videobegunstate = [false, true, false, false, false, false];
var videolinks = {'ey_verse_screen': 'EYVerse.mp3', 'Forum_Screens_1': 'HighlightsAudio.mp3', 'Market_waterfall_screen_AI': 'HighlightsAudio.mp3', 'SpeakEasy_screen':'HighlightsAudio.mp3'};
//var monitorangles = [-Math.PI, 0, -Math.PI/2]
var slideDecks = [];
var firstSlides = [];
var slideIndices = {'TZ_wall_monitors_01': 3,  'TZ_wall_monitors_02': 11, 'TZ_wall_monitors_03': 5, 'TZ_wall_monitors_04': 12, 'TZ_wall_monitors_08': 32, 'TZ_blockchain_01': 33, 'TZ_blockchain_02': 0, 'TZ_blockchain_19': 1, 'TZ_blockchain_20': 4, 'TZ_wall_monitors_05': 2, 'TZ_wall_monitors_06': 21, 'TZ_wall_monitors_07': 31, 'TZ_pillar_monitors_01': 24, 'TZ_pillar_monitors_02': 14, 'TZ_pillar_monitors_03': 23, 'TZ_pillar_monitors_04': 22, 'CR_2035_screen': 16, 'Forum_Screens_2': 7, 'Forum_Screens_3':0, 'VR_Bar_screens04':0, 'VR_Bar_screens03':0, 'Purple_pod_screen_1':10, 'Purple_pod_screen_2':17, 'Purple_pod_screen_3':15,'Purple_pod_screen_4':13, 'Purple_pod_screen_main':0, "IZ_screen_1":26, 'IZ_screen_2':6, 'IZ_screen_3':9,'IZ_screen_4':8,'IZ_screen_main':4, 'infinite_possibilities_screen_1':18, 'infinite_possibilities_screen_2':25, 'infinite_possibilities_screen_3':28, 'infinite_possibilities_screen_4':20, 'infinite_possibilities_screen_005': 19, 'infinite_possibilities_screen_006': 30, 'infinite_possibilities_screen_main':0, 'Market_waterfall_screen_Gil_1': 29, 'Market_waterfall_screen_Gil_2': 29};

var contactSlides = {'TZ_wall_monitors_01': 1,  'TZ_wall_monitors_02': 1, 'TZ_wall_monitors_03': 1, 'TZ_wall_monitors_04': 1, 'TZ_wall_monitors_08': -1, 'TZ_blockchain_01': 0, 'TZ_blockchain_02': 2, 'TZ_blockchain_19': 1, 'TZ_blockchain_20': 0, 'TZ_wall_monitors_05': 0, 'TZ_wall_monitors_06': 1, 'TZ_wall_monitors_07': 1, 'TZ_pillar_monitors_01': -1, 'TZ_pillar_monitors_02': 1, 'TZ_pillar_monitors_03': -1, 'TZ_pillar_monitors_04': -1, 'CR_2035_screen': 1, 'Forum_Screens_2': -1, 'Purple_pod_screen_1':1, 'Purple_pod_screen_2':1, 'Purple_pod_screen_3':1,'Purple_pod_screen_4':1, 'Purple_pod_screen_main':0, "IZ_screen_1":1, 'IZ_screen_2':1, 'IZ_screen_3':1,'IZ_screen_4':1,'IZ_screen_main':-1, 'infinite_possibilities_screen_1':1, 'infinite_possibilities_screen_2':1, 'infinite_possibilities_screen_3':1, 'infinite_possibilities_screen_4':1, 'infinite_possibilities_screen_005': 1, 'infinite_possibilities_screen_006': 1, 'infinite_possibilities_screen_main':-1, 'Market_waterfall_screen_Gil_1': 1, 'Market_waterfall_screen_Gil_2': 1};
var slidePos = {'TZ_wall_monitors_01': 1,  'TZ_wall_monitors_02': 0, 'TZ_wall_monitors_03': 2, 'TZ_wall_monitors_04': 0, 'TZ_wall_monitors_08': 0, 'TZ_blockchain_01': 1, 'TZ_blockchain_02': 0, 'TZ_blockchain_19': 1, 'TZ_blockchain_20': 0, 'TZ_wall_monitors_05': 0, 'TZ_wall_monitors_06': 0, 'TZ_wall_monitors_07': 0, 'TZ_pillar_monitors_01': 0, 'TZ_pillar_monitors_02': 0, 'TZ_pillar_monitors_03': 0, 'TZ_pillar_monitors_04': 0, 'CR_2035_screen': 0, 'Forum_Screens_2': 0, 'Purple_pod_screen_1':0, 'Purple_pod_screen_2':0, 'Purple_pod_screen_3':0,'Purple_pod_screen_4':0, 'Purple_pod_screen_main':0, "IZ_screen_1":0, 'IZ_screen_2':0, 'IZ_screen_3':0,'IZ_screen_4':0,'IZ_screen_main':0, 'infinite_possibilities_screen_1':0, 'infinite_possibilities_screen_2':0, 'infinite_possibilities_screen_3':0, 'infinite_possibilities_screen_4':0, 'infinite_possibilities_screen_005': 0, 'infinite_possibilities_screen_006': 0, 'infinite_possibilities_screen_main':0, 'Market_waterfall_screen_Gil_1': 0, 'Market_waterfall_screen_Gil_2': 0};
var contactEmails = {'TZ_wall_monitors_01': 'daniel.krauss@de.ey.com',  'TZ_wall_monitors_02': 'michael.kanazawa@ey.com', 'TZ_wall_monitors_03': 'steve.basili@ey.com', 'TZ_wall_monitors_04': 'tonny.dekker@nl.ey.com, brad.artigue@ey.com', 'TZ_wall_monitors_08': '', 'TZ_blockchain_01': 'edwina.fitzmaurice@ey.com', 'TZ_blockchain_02': 'paul.brody@ey.com', 'TZ_blockchain_19': 'beatriz.sanzsaiz@es.ey.com', 'TZ_blockchain_20': 'miroslaw.ryba@pl.ey.com', 'TZ_wall_monitors_05': 'richard.watson@au.ey.com', 'TZ_wall_monitors_06': 'lbuchanan@uk.ey.com', 'TZ_wall_monitors_07': 'Oliver.Jones@uk.ey.com', 'TZ_pillar_monitors_01': '', 'TZ_pillar_monitors_02': 'michael.kanazawa@ey.com', 'TZ_pillar_monitors_03': '', 'TZ_pillar_monitors_04': '', 'CR_2035_screen': 'orlan.boston@ey.com, lisa.lindstrom@doberman.ey.com', 'Forum_Screens_2': '', 'Purple_pod_screen_1':'Adrian.Slobin@ey.com', 'Purple_pod_screen_2':'Kamran.Malik@au.ey.com', 'Purple_pod_screen_3':'Rachel.Hall@ey.com, aloha.mcbride@ey.com','Purple_pod_screen_4':'Roselyn.Feinsod@ey.com', 'Purple_pod_screen_main':'', "IZ_screen_1":'Nicola.Morini.Bianzino@eyg.ey.com', 'IZ_screen_2':'abaldwin@uk.ey.com', 'IZ_screen_3':'','IZ_screen_4':'','IZ_screen_main':'', 'infinite_possibilities_screen_1':'Kristina.Rogers1@ey.com, Rob.Dongoski@parthenon.ey.com', 'infinite_possibilities_screen_2':'edwina.fitzmaurice@ey.com', 'infinite_possibilities_screen_3':'Greg.Sarafin@ey.com, Jeff.Wray@parthenon.ey.com', 'infinite_possibilities_screen_4':'Adlai.Goldberg@ey.com', 'infinite_possibilities_screen_005': 'savarley@uk.ey.com', 'infinite_possibilities_screen_006': 'Janet.Balis@ey.com', 'infinite_possibilities_screen_main':'', 'Market_waterfall_screen_Gil_1': 'gil.forer@ey.com', 'Market_waterfall_screen_Gil_2': 'gil.forer@ey.com'};
var cmpositions = [[23.516043701171875, 1.13, 19.438042068481444], [23.356043701171875, 1.13, 19.438042068481444], [23.636043701171875, 1.07, 19.438042068481444]];
var htmlpos= [[64, 72], [85, 90], [45, 87]]


var mouseoverText = {'IZ_map_button_01': 'Enter the new EY Metaverse',
'IZ_map_button_02': 'An immersive experience of regenerative future and business-as-usual future',
'IZ_map_button_03': 'Find out more on our vision for how EY will do business, connect with clients and create value in the metaverse of the near future',
'IZ_map_button_04': 'An open discussion of Metaverse is the new cloud and critical issues to consider. Know our partner sponsors of Innovation Realized 2022',
'IZ_map_button_05': 'Did you want to listen to some music and reflect on Innovation realised 2022? You are on the right place! Watch the performances of: \no Harry Yeff (Reeps 100) who is a London born artist, founder and technologist, utilizing an almost inhuman vocal rang to drive his performative digital and physical artworks. \no And Shimon an improvising robotic marimba player that uses artificial intelligence to improvise with human musicians, leading to novel musical experiences and outcomes',
'IZ_map_button_06': 'This section walks you through the workshop highlights of solving the dream to reality gap in innovation, how do you transform your operating model, so it delivers what you need?',
'IZ_map_button_07': 'Workshop highlights the key takeaways of Customer centricity, Reimagine personalized care, Right skills to meet future business requirement in the next decade, Innovation@ scale and Reimagine hybrid work',
'IZ_map_button_08': 'Workshop highlights on why settle for moon when there are new galaxies to explore?, what tech@speed means to you?, sustainability strategy and actions, and navigating your transformation in transitional times',
'IZ_map_button_09': 'A video performances of beat boxer and robot playing music',
'IZ_map_button_010': 'o	A conversation with Carmine Di Sibio, Global Chairman and CEO, EY on the CEO 360: from strategy to transformation and beyond.\no A video on Innovation Realized 2022 highlights.\no Dr. Parag Khanna, Managing Partner provides insights on the Geopolitical marketplace.',
'IZ_map_button_011': 'A walkthrough on top ten key highlights of Innovation Realized 2022\nWatch the performances of:\n	   o Harry Yeff (Reeps 100) who is a London born artist, founder and technologist, utilizing an almost inhuman vocal rang to drive his performative digital and physical artworks.\n	o And Shimon an improvising robotic marimba player that uses artificial intelligence to improvise with human musicians, leading to novel musical experiences and outcomes.'

}
var browser = "";
try{
 browser = navigator.userAgentData;
 console.log(browser.toString());
 const bstring = JSON.stringify(browser);
 console.log(bstring);
 if(bstring.includes("Edge")){
     browser = "Edge"
     console.log("It's Edge!");
 }
}
catch(e){
    console.log("Browser error " + e);
}

// Canvas
//const canvas = document.querySelector('canvas.webgl')

// Scene

//Loading Manager
const manager = new THREE.LoadingManager();
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {

	console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

};

manager.onLoad = function ( ) {

	console.log( 'Loading complete!');
    modelsloaded = true;
    showButton();

};


manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

    //TO DO: update hardcoding
	//console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    var progressBar = document.getElementById("loadingBar")
    progressBar.style.width = Math.min((itemsLoaded / 305 * 42), 42) + '%';
    //console.log(itemsLoaded);
    //console.log(Math.min((itemsLoaded / 365 * 60), 43))

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
loadVideos();
//loadBSlides();
addListeners();
loadHTMLSlides();
loadAllModels();
addLights();

//loadSlides();
//ocamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100 )
    //Ratio determined by Ethan's browser
    ocamera = new THREE.PerspectiveCamera( 25, 2.0678513731825525, 1, 1000 );
    console.log("window ratio " + window.innerWidth / window.innerHeight);
    ocamera.position.z = 1;
    scene.add(ocamera);
    //collision = new THREE.Object3D();

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
    //document.addEventListener( 'dblclick', clickmove)

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
                clickmoving = false;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true;
                clickmoving = false;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                clickmoving = false;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = true;
                clickmoving = false;
                break;

            case 'Escape':
                if(slideMode){
                    //exitSlideMode();
                    exitSlideModeHTML();
                }
                else if(controlShowMode){
                    closeControls();
                }
                
                break;
            case 'Enter':
                console.log("hit enter")
                
                if(!loaded){
                    //enterClick();
                }
                else{
                    click = true;
                    pointer.x = 0;
                    pointer.y = 0.25;
                }
                break;
            case 'KeyM':
                warpToMap();
                break;
            case 'KeyC':
                showControls();
                break;

            //teleports
            case 'Digit1':
                teleport('IZ_map_button_01');
                break;
            case 'Digit2':
                teleport('IZ_map_button_02');
                break;
            case 'Digit3':
                teleport('IZ_map_button_03');
                break;
            case 'Digit4':
                teleport('IZ_map_button_04');
                break;
            case 'Digit5':
                teleport('IZ_map_button_05');
                break;
            case 'Digit6':
                teleport('IZ_map_button_06');
                break;                            
            case 'Digit7':
                teleport('IZ_map_button_07');
                break;
            case 'Digit8':
                teleport('IZ_map_button_08');
                break;
            case 'Digit9':
                teleport('IZ_map_button_09');
                break;
            case 'Digit0':
                teleport('IZ_map_button_010');
                break;
            case 'Minus':
                teleport('IZ_map_button_011');
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
    document.getElementById("EnterButton").addEventListener('click', enterClick)
    //document.addEventListener('sumbit', enterClick)

}

function animate() {

    requestAnimationFrame( animate );

    const time = performance.now();

    //select buttons
    // Cast a ray

    if(loaded){
        
        if(slideMode){
            //SlideInteract();
        } 
        else if(controlShowMode){

        }
        else{
            handleMove(time);
            toolTipper();
            intObjects = mapButtons;
            glow();

        }
        
    } else{
        camSpin();
    }

    
    prevTime = time;

    renderer.render( scene, camera );

    buttonClicked = false;

    animatecount++;

}

function pause(){
    for(var i = 0; i < videos.length; i++){
        videos[i].pause();
    }
}

function play(){
    for(var i = 0; i < videos.length; i++){
        videos[i].play();
    }
}

function onWindowResize(){
    //var three = document.getElementById( 'three' );
    //three.canvas.innerWidth = window.innerWidth;
    //three.canvas.innerHeight = window.innerHeight;
    // Update camera
    let width = window.innerWidth;
    let height = window.innerHeight;

    if(slideMode){
        //pcamera.aspect = width / height;
        //pcamera.updateProjectionMatrix();
        //camera.aspect = 2.0678513731825525;
        //camera.updateProjectionMatrix();

    }
    else{
        //camera.aspect = width / height;
        //camera.updateProjectionMatrix();
        //ocamera.aspect = 2.0678513731825525;
        //ocamera.aspect.updateProjectionMatrix();
    }
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    // Update renderer
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    //console.log("resize!");
    //console.log(width);

    if(document.getElementById("contactbutton").style.visibility=='visible'){
        var cmpos = htmlpos[slidePos[slideMesh.name]];
        document.getElementById("contactbutton").style.top = (50+(cmpos[1]-50)*(window.innerWidth/1280)) + "%"
        console.log("top is " + (50+(cmpos[1]-50)*(window.innerWidth/1280)) + "based on " + cmpos[1])
    }

    //Reset OCamera
    //ocamera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 1000 );
}








init();
animate();

console.log("huh")




function handleMove(time){
    //console.log(camera.position.x + " " + camera.position.y);
    if(click&&!buttonClicked){
        console.log("casting!");
        //switchCamera(false);
            //Set to false so that held down click doesn't cast multiple rays
            //console.log("current position: " + controls.getObject().position.x + "," + controls.getObject().position.y + "," + controls.getObject().position.z );
            const beuler = new Euler( 0, 0, 0, 'YXZ' );
            beuler.setFromQuaternion( camera.quaternion );
            //console.log("current rot: " + beuler.y);
            click = false;
            //console.log("pointer: " + pointer.x + " " + pointer.y)
        clickraycaster.setFromCamera( pointer, camera );

        // calculate objects intersecting the picking ray
        const intersects = clickraycaster.intersectObjects( mapButtons );
        if(intersects.length>0){
            teleport(intersects[0].object.name);
        }
        //console.log(TZmaps);
        const bintersects = clickraycaster.intersectObjects( TZmaps.concat(SplitScreens) );
        if(bintersects.length>0){
            if(SplitScreens.includes(bintersects[0].object)){
                if(bintersects[0].object.name.includes('IZ_screen')){
                    enterSlideModeHTMLFour(0);
                }
                if(bintersects[0].object.name.includes('Purple_pod_')){
                    enterSlideModeHTMLFour(1);

                }
                if(bintersects[0].object.name.includes('infinite_possibilities_screen')){
                    enterSlideModeHTMLSix();
                }

                /*
                console.log(bintersects[0].object.name)
                if(bintersects[0].object.name.includes('IZ_screen')){
                    console.log(IZMainScreen);
                    var a = 3*Math.PI/4;
                    //console.log("a is " + a)
                    //displaySlides(IZMainScreen.position, a, 2.75, 2, true);
                    enterSlideModeHTMLFour(0);
                    //slideMesh = IZMainScreen;
                }
                if(bintersects[0].object.name.includes('Purple_pod_')){
                    var a = 0;
                    //console.log("Purple boy")
                    displaySlides(PurpleMainScreen.position, a, 2.75, 2, true);
                    slideMesh = PurpleMainScreen;

                }
                if(bintersects[0].object.name.includes('infinite_possibilities_screen')){
                    var a = 0;
                    //console.log("Purple boy")
                    //displaySlides(SpaceMainScreen.position, a, 3.75, 2.85, true);
                    //slideMesh = SpaceMainScreen;
                    enterSlideModeHTMLFour(1);
                }
                */

            }
            else{
                console.log("object name " + bintersects[0].object.name);
                currentSlide = 0;
                slides = slideDecks[slideIndices[bintersects[0].object.name]];
                /*
                var dist = 1.5;
                var mul = 1;
                if(bintersects[0].object.name=='TZ_wall_monitors_04'){
                    dist = 2.75;
                    mul = 2;
                }
                else if (bintersects[0].object.name.includes('Forum_Screens_')){
                    dist = 4.5;
                    mul = 3.35;
                }
                else if (bintersects[0].object.name=='CR_2035_screen'){
                    dist = 3.35;
                    mul = 2.45;
                }
                else if (bintersects[0].object.name.includes('TZ_pillar_monitors_')){
                    dist = 1.9;
                    mul = 1.35;
                }
                */
                //displaySlides(bintersects[0].object.position, monitorsangles[bintersects[0].object.name], dist, mul, false);
                slideMesh = bintersects[0].object;
                //displaySlideScreen();
                enterSlideModeHTML();
            }
                
                
                //console.log(slideMesh);
                //console.log(bintersects[i]);
                //switchCamera(false);
                //console.log("hi blockchain")
            
        //}
    }

            const sintersects = clickraycaster.intersectObjects( VideoScreens );
            if(sintersects.length>0){
                
                var oname = sintersects[0].object.name;
                //Check whether it's the carmine video
                if(oname.includes('Forum_Screens_3')){
                    window.open('https://players.brightcove.net/1066292269001/default_default/index.html?videoId=6309243972112', '_blank');
                }
                else if(oname.includes('VR_Bar_screens04')){
                    window.open('https://players.brightcove.net/1066292269001/default_default/index.html?videoId=6309252763112', '_blank');
                }
                else if(oname.includes('VR_Bar_screens03')){
                    window.open(' https://players.brightcove.net/1066292269001/default_default/index.html?videoId=6309251095112', '_blank');
                }
                //Check whether browser is Edge
                else if(browser=='Edge'){

                    if(oname=='ey_verse_screen'){
                        window.open('./videos/eyverse/index.html', '_blank');
                    }
                    else if(oname=='Forum_Screens_1'){
                        window.open('./videos/highlights/index.html', '_blank');
                    }
                    else if(oname=='Market_waterfall_screen_AI'){
                        window.open('https://players.brightcove.net/1066292269001/default_default/index.html?videoId=6309251095112', '_blank');
                    }
                    else if(oname=='SpeakEasy_screen'){
                        window.open('https://players.brightcove.net/1066292269001/default_default/index.html?videoId=6309252763112', '_blank');
                    }
                }
                //If it is not Edge, check whether a video is already playing
                else{
                    

                    if(!videobegunstate[videoindexes[oname]]){
                        beginVideo(sintersects[0].object);
                        videobegunstate[videoindexes[oname]] = true;
                    }
                    else{
                        if(videos[videoindexes[oname]].paused){
                            videos[videoindexes[oname]].play();
                            sounds[videoindexes[oname]].play();
                        }
                        else{
                            videos[videoindexes[oname]].pause();
                            sounds[videoindexes[oname]].pause();
                        }
                    }

                }
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


        //Controls stuff




        //Keyboard controls

        const delta = ( time - prevTime ) / 2000;


        if((velocity.z>0&&velocity.z<0.001)||velocity.z<0&&velocity.z>-0.001){
            velocity.z = 0;
        }
        if((velocity.x>0&&velocity.x<0.001)||velocity.x<0&&velocity.x>-0.001){
            velocity.x = 0;
        }
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

        //Prevent huge burst
        if(velocity.z>5){
            velocity.z=5;
        }
        if(velocity.z<-5){
            velocity.z=-5;
        }
        if(velocity.x>5){
            velocity.x=5;
        }
        if(velocity.x<-5){
            velocity.x=-5;
        }

        controls.moveForward( - velocity.z * delta );
        controls.moveRight( - velocity.x * delta );
        //console.log((- velocity.z * delta) + " " + ( - velocity.x * delta))

        

        controls.getObject().position.y += ( velocity.y * delta ); // new behavior
        if ( controls.getObject().position.y < 1.5 ) {

            velocity.y = 0;
            controls.getObject().position.y = 1.5;

        }
}


function teleport(name){
    if(name.includes('IZ_map_button')){
        var newPos = new Vector3(0, 0, 0);
        var newRot = 0;
        if(name.includes('010')){
            newPos = new Vector3(36.357200959384286,1.5,-27.780869919116576);
            newRot = Math.PI/2;
        }
        else if(name.includes('011')){
            newPos = new Vector3(2.0107367878510556,1.5,-27.518229810088066);
            newRot = -Math.PI/2;
        }
        else if(name.includes('01')){
            newPos = new Vector3(-24.250405077612033,1.5,-0.13968857421984837);
            newRot = -Math.PI/2;
        }
        else if(name.includes('02')){
            newPos = new Vector3(-14.763254846552549,1.5,3.381983248102806);
            newRot = -Math.PI;
        }
        else if(name.includes('03')){
            
            newPos = new Vector3(-4.913926124799983,1.5,3.1473119049575);
            newRot = -Math.PI;
        }
        
        else if(name.includes('04')){
            newPos = new Vector3(-6.131198084298851,1.5,-4.94005691805949);
            newRot = -Math.PI/2;
        }
        else if(name.includes('05')){
            newPos = new Vector3(14.228396830902655,1.5,-5.924025345405676);
            newRot = 0;
        }
        else if(name.includes('06')){
            newPos = new Vector3(27.86055241837079,1.5,-5.924285762145197);
            newRot = 0;
        }
        
        else if(name.includes('07')){
            newPos = new Vector3(44.202573509065516,1.5,3.965227914830795);
            newRot = -Math.PI; 
        }
        else if(name.includes('08')){
            
            newPos = new Vector3(56.46974644873789,1.5,3.280566032867076);
            newRot = Math.PI;
        }
        else if(name.includes('09')){
            newPos = new Vector3(45.32320284406064,1.5,-4.000316721102775);
            newRot = -Math.PI/2;
        }
        


        //No y because height shouldn't be changed
        console.log("teleport")
        camera.position.x = newPos.x;
        camera.position.z = newPos.z;
        const neuler = new Euler( 0, newRot, 0, 'YXZ' );
        camera.quaternion.setFromEuler(neuler)
    }
}

function SlideInteract(){
    var currentIntersect = highlightButtons();
    
    if(click){
        //console.log("current intersect is " + currentIntersect.object.name)
        slideClick(currentIntersect);
        click = false;     
    }
    slidesKeyboard();
}

function slidesKeyboard(){
    if(moveLeft){
        changeSlide(false);
        moveLeft = false;
    }
    if(moveRight){
        changeSlide(true);
        moveRight = false;
    }
}

function highlightButtons(){
    const objectsForRayCast = [back_mesh, next_mesh, x_mesh, contact_mesh]
    clickraycaster.setFromCamera( pointer, camera );
    const intersecto = clickraycaster.intersectObjects(objectsForRayCast.concat(SplitScreens))
    
    for(const object of objectsForRayCast.concat(SplitScreens)){
        object.material.color.set('#ffffff')
        
    }

    for(const intersect of intersecto){
        //console.log("setting color")
        //console.log(intersect.object.name)
        if(!MainScreens.includes(intersect.object)&&(!(SplitScreens.includes(intersect.object)&&actualSlideMode))){
            //console.log(intersect.object.name)
            intersect.object.material.color.set('#ffff00')
        }
    }
    //Return current intersection
    return intersecto[0];
}

function changeSlide(plus){
    var nm = true;
    var bm = true;
    var cm = false;
    if(plus){
        if(currentSlide<(slides.length-1)){
            currentSlide++;
        }
        if(currentSlide==slides.length-1){
            nm = false;
            bm = true;
            //if(contactSlides.includes(slideMesh.name)){
            //    cm = true;
            //}
        }
    }
    else{
        if(currentSlide>0){
            currentSlide--;
        }
        if(currentSlide==0){
            nm = true;
            bm = false;
            cm = false;
        }

    }

    if(currentSlide == slides.length - Math.min((1+contactSlides[slideMesh.name]), 3)||(currentSlide==2)&&slideMesh.name=='infinite_possibilities_screen_3'){
        cm = true;
        var cmpos = cmpositions[slidePos[slideMesh.name]];
        contact_mesh.position.set(cmpos[0], cmpos[1], cmpos[2]);

    }

    next_mesh.visible = nm;
    back_mesh.visible = bm;
    contact_mesh.visible = cm;
    updateSlideScreen();
    slideMesh.material = slides[currentSlide];
}

function slideClick(currentIntersect){
    if(currentIntersect){
        if (currentIntersect.object === back_mesh){
            changeSlide(false);
        } 
        else if (currentIntersect.object === next_mesh){
            changeSlide(true);
            
        }
        else if (currentIntersect.object === x_mesh){
            exitSlideMode();
            return;
            
        }
        else if (currentIntersect.object == contact_mesh){
            var maillink = 'mailto:' + contactEmails[slideMesh.name];
            if(slideMesh.name=='infinite_possibilities_screen_3'&&currentSlide==3){
                maillink = 'mailto:Juan.Uro@parthenon.ey.com, edwina.fitzmaurice@ey.com';
            }
            window.open(maillink , '_blank');
        }
        else if (SplitScreens.includes(currentIntersect.object)){
            slideMesh = currentIntersect.object;
            slides=slideDecks[slideIndices[currentIntersect.object.name]];
            currentSlide = 0;
            actualSlideMode = true;
            //displaySlideScreen();
            enterSlideModeHTML();
            switchCamera(true);


            /*
            for(var i = 0; i < SplitScreens.length; i++){
                if(MainScreens.includes(SplitScreens[i])){
                    //console.log("main screen");
                }
                else{
                    SplitScreens[i].visible = false;
                }
            }
            updateSlideScreen();
            //slideMesh.material = slides[currentSlide];
            next_mesh.visible = true;
            back_mesh.visible = false;
            contact_mesh.visible = false;
            */
        }
        

        
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
        tooltip.style.left = (mouseX+10) + "px";
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
        //console.log(pointer.y)
        click = true;
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
    //console.log(window.innerWidth-ypos)
    xpos = (window.innerWidth-xpos);
    ypos = (window.innerHeight-ypos);
    
    if(controllerclickcheck(xpos, ypos)){
        //determine where it is relation to the camera controller
        xpos = (window.innerWidth*(0.05)+window.innerWidth*(0.15)/2)-xpos;
        ypos = (window.innerHeight*(0.05)+window.innerWidth*(0.15)/2)-ypos;
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

    const forumMaterial = new THREE.MeshStandardMaterial({ map: forumTexture});
    return forumMaterial;
}

function makeLambertTexture(filename){
    const forumTexture = textureLoader.load(filename)
    forumTexture.flipY = false
    forumTexture.encoding = THREE.sRGBEncoding

    const forumMaterial = new THREE.MeshLambertMaterial({ map: forumTexture});
    return forumMaterial;
}

function loadAllModels(){
    //var models = ['ceiling.glb', 'CR_2035_BAKED_opaque.glb', 'CR_2035_BAKED_transparent.glb', 'EY_VERSE_BAKED.glb', 'Floor_GOBO_spots.glb', 'Forum_BAKED_opaque.glb', 'Forum_BAKED_transparent.glb', 'IR_Map_screen.glb', 'IR_Map_screen_frame.glb', 'IZ_BAKED_MAP_screens.glb', 'IZ_BAKED_MAP_screen_frame.glb', 'IZ_BAKED_opaque.glb', 'IZ_map_button_01.glb', 'IZ_map_button_010.glb', 'IZ_map_button_011.glb', 'IZ_map_button_02.glb', 'IZ_map_button_03.glb', 'IZ_map_button_04.glb', 'IZ_map_button_05.glb', 'IZ_map_button_06.glb', 'IZ_map_button_07.glb', 'IZ_map_button_08.glb', 'IZ_map_button_09.glb', 'IZ_nav_cube_1.glb', 'IZ_nav_cube_10.glb', 'IZ_nav_cube_11.glb', 'IZ_nav_cube_2.glb', 'IZ_nav_cube_3.glb', 'IZ_nav_cube_4.glb', 'IZ_nav_cube_5.glb', 'IZ_nav_cube_6.glb', 'IZ_nav_cube_7.glb', 'IZ_nav_cube_8.glb', 'IZ_nav_cube_9.glb', 'Market_BAKED_FINAL_opaque.glb', 'Market_BAKED_FINAL_transparent.glb', 'outer_walls.glb', 'Purple_Pod_BAKED_opaque.glb', 'Space_Pod_BAKED_opaque.glb', 'Space_Pod_BAKED_transparent.glb', 'SpeakEasy_BAKED_opaque.glb', 'SpeakEasy_BAKED_transparent.glb', 'TZ_BAKED_opaque.glb', 'TZ_blockchain_02.glb', 'TZ_blockchain_19.glb', 'TZ_blockchain_20.glb', 'TZ_Curved_screens_01.glb', 'TZ_Curved_screens_02.glb', 'TZ_Curved_screens_03.glb', 'TZ_Curved_screens_04.glb', 'TZ_Curved_screens_05.glb', 'TZ_Curved_screens_06.glb', 'TZ_pillar_monitors_01.glb', 'TZ_pillar_monitors_02.glb', 'TZ_pillar_monitors_03.glb', 'TZ_pillar_monitors_04.glb', 'TZ_wall_monitors_01.glb', 'TZ_wall_monitors_02.glb', 'TZ_wall_monitors_03.glb', 'TZ_wall_monitors_04.glb', 'TZ_wall_monitors_05.glb', 'TZ_wall_monitors_06.glb', 'TZ_wall_monitors_07.glb', 'TZ_wall_monitors_08.glb', 'VR_Bar_BAKED_opaque.glb', 'VR_Bar_BAKED_transparent.glb']
    //var models = ['ceiling.glb', 'CR_2035_BAKED_opaque.glb', 'CR_2035_BAKED_transparent.glb', 'EY_VERSE_BAKED.glb', 'Floor_GOBO_spots.glb', 'Forum_BAKED_opaque.glb', 'Forum_BAKED_transparent.glb', 'IR_Map_screen.glb', 'IR_Map_screen_frame.glb', 'IZ_BAKED_opaque_and_map.glb' , 'Market_BAKED_FINAL_opaque.glb', 'Market_BAKED_FINAL_transparent.glb', 'outer_walls.glb', 'Purple_Pod_BAKED_opaque.glb', 'Space_Pod_BAKED_opaque.glb', 'Space_Pod_BAKED_transparent.glb', 'SpeakEasy_BAKED_opaque.glb', 'SpeakEasy_BAKED_transparent.glb', 'TZ_BAKED_opaque.glb', 'TZ_blockchain_02.glb', 'TZ_blockchain_19.glb', 'TZ_blockchain_20.glb', 'TZ_Curved_screens_01.glb', 'TZ_Curved_screens_02.glb', 'TZ_Curved_screens_03.glb', 'TZ_Curved_screens_04.glb', 'TZ_Curved_screens_05.glb', 'TZ_Curved_screens_06.glb', 'TZ_pillar_monitors_01.glb', 'TZ_pillar_monitors_02.glb', 'TZ_pillar_monitors_03.glb', 'TZ_pillar_monitors_04.glb', 'TZ_wall_monitors_01.glb', 'TZ_wall_monitors_02.glb', 'TZ_wall_monitors_03.glb', 'TZ_wall_monitors_04.glb', 'TZ_wall_monitors_05.glb', 'TZ_wall_monitors_06.glb', 'TZ_wall_monitors_07.glb', 'TZ_wall_monitors_08.glb', 'VR_Bar_BAKED_opaque.glb', 'VR_Bar_BAKED_transparent.glb']
    //var models = ['ceiling.glb', 'CR_2035_BAKED_opaque.glb', 'CR_2035_BAKED_transparent.glb', 'EY_VERSE_BAKED.glb', 'Floor_GOBO_spots.glb', 'Forum_BAKED_opaque.glb', 'Forum_BAKED_transparent.glb', 'IR_Map_screen.glb', 'IR_Map_screen_frame.glb', 'IZ_BAKED_opaque_and_map.glb' , 'Market_BAKED_FINAL_opaque.glb', 'Market_BAKED_FINAL_transparent.glb', 'outer_walls.glb', 'Purple_Pod_BAKED_opaque.glb', 'Space_Pod_BAKED_opaque.glb', 'Space_Pod_BAKED_transparent.glb', 'SpeakEasy_BAKED_opaque.glb', 'SpeakEasy_BAKED_transparent.glb', 'TZ_BAKED_opaque2.glb', 'VR_Bar_BAKED_opaque.glb', 'VR_Bar_BAKED_transparent.glb']
    //var models = ['ceiling.glb', 'Collision_Boundary_wall_updated.glb', 'CR_2035_BAKED_opaque.glb', 'CR_2035_BAKED_transparent.glb', 'EY_VERSE_BAKED.glb', 'Floor_GOBO_spots.glb', 'Forum_BAKED_opaque.glb', 'Forum_BAKED_transparent.glb', 'IR_Map_screen.glb', 'IR_Map_screen_frame.glb', 'IZ_BAKED_opaque_and_map.glb' , 'Market_BAKED.glb', 'outer_walls.glb', 'Purple_Pod_BAKED_opaque.glb', 'Space_Pod_BAKED_opaque.glb', 'Space_Pod_BAKED_transparent.glb', 'SpeakEasy_BAKED_opaque.glb', 'SpeakEasy_BAKED_transparent.glb', 'TZ_BAKED_opaque.glb', 'VR_Bar_BAKED.glb']
    var models = ['ceiling.glb', 'Collision_Boundary_wall_updated.glb', 'CREthan.glb', 'CR_2035_BAKED_transparent.glb', 'EY_VERSE_BAKED.glb', 'Floor_GOBO_spots.glb', 'ForumEthan.glb', 'Forum_BAKED_transparent.glb',  'IZEthan.glb' , 'Market_BAKEDEthan.glb', 'outer_walls.glb', 'Purple_Pod_BAKED_opaque.glb', 'Slide_screen.glb', 'Space_Pod_BAKED_opaque.glb', 'Space_Pod_BAKED_transparent.glb', 'SpeakEthan.glb', 'SpeakEasy_BAKED_transparent.glb', 'TZ_BAKED_opaque.glb', 'VR_Bar_BAKEDEthan.glb']

    var fulltext = ['CR_2035_blanket.jpg', 'CR_2035_ceiling.jpg', 'CR_2035_floor.jpg', 'CR_2035_furniture.jpg', 'CR_2035_screen.jpg', 'CR_2035_signage.jpg', 'CR_2035_video_wall.jpg', 'CR_2035_wall.jpg', 'ey_verse_curtains.jpg', 'ey_verse_floor.jpg', 'ey_verse_inner_walls.jpg', 'ey_verse_outer_walls.jpg', 'ey_verse_rafters.jpg', 'ey_verse_rug.jpg', 'ey_verse_screen.jpg', 'ey_verse_side_rails.jpg', 'ey_verse_speakers_1.jpg', 'ey_verse_speakers_2.jpg', 'ey_verse_stools.jpg', 'ey_verse_tables_and_chairs.jpg', 'Forum_Chairs.jpg', 'Forum_Floor.jpg', 'Forum_Light_gels.jpg', 'Forum_light_truss.png', 'Forum_Lower_Benches.jpg', 'Forum_Main_Stage.jpg', 'Forum_Rafters.jpg', 'Forum_Rear_wall.jpg', 'Forum_Screens.jpg', 'Forum_stage.jpg', 'Forum_Stage_and_Walls.jpg', 'Forum_Tables.jpg', 'Forum_Upper_Benches.jpg', 'Forum_wall_panels.jpg', 'IR_Welcome_Map_2.jpg', 'IZ_arches.jpg', 'IZ_cafe_counter.jpg', 'IZ_chairs.jpg', 'IZ_desk.jpg', 'IZ_directions_1.jpg', 'IZ_directions_2.jpg', 'IZ_floor.jpg', 'IZ_furniture.jpg', 'IZ_map_button_01.jpg', 'IZ_map_button_02.jpg', 'IZ_map_button_03.jpg', 'IZ_map_button_04.jpg', 'IZ_map_button_05.jpg', 'IZ_map_button_06.jpg', 'IZ_map_button_07.jpg', 'IZ_map_button_08.jpg', 'IZ_map_button_09.jpg', 'IZ_map_button_010.jpg', 'IZ_map_button_011.jpg', 'IZ_rafters.jpg', 'IZ_seat_boxes.jpg', 'IZ_signage_1.jpg', 'IZ_signage_2.jpg', 'IZ_signage_3.jpg', 'IZ_sofa.jpg', 'IZ_stage.jpg', 'IZ_Startup_zone_screen.jpg', 'IZ_tables.jpg', 'IZ_walls.jpg', 'IZ_Wall_fix.jpg', 'IZ_welcome_corridor_screen_02.jpg', 'IZ_welcome_corridor_screen_03.jpg', 'Market_baklava_1.png', 'Market_baklava_2.png', 'Market_buffet_1.jpg', 'Market_buffet_2.jpg', 'Market_buffet_3.jpg', 'Market_buffet_4.jpg', 'Market_counters.jpg', 'Market_desserts_1.png', 'Market_desserts_2.png', 'Market_desserts_3.png', 'Market_desserts_4.png', 'Market_directional_signage_1.jpg', 'Market_directional_signage_2.jpg', 'Market_Floor.jpg', 'Market_foliage_bakery_wall.png', 'Market_foliage_hanging.png', 'Market_foliage_video_wall_1.png', 'Market_foliage_video_wall_2.png', 'Market_foliage_video_wall_3.png', 'Market_foliage_video_wall_4.png', 'Market_Forum_signage.jpg', 'Market_furniture.jpg', 'Market_green_panels.jpg', 'Market_innovation_text_1.jpg', 'Market_Light_gels.jpg', 'market_mound.jpg', 'Market_overhead_screen_1.png', 'Market_overhead_screen_2.png', 'Market_overhead_screen_3.png', 'Market_overhead_screen_4.png', 'Market_overhead_screen_5.jpg', 'Market_pink_treats.png', 'Market_Rafters.jpg', 'Market_Scaffold.jpg', 'Market_screens_01.jpg', 'Market_screens_02.jpg', 'Market_Signage_1.jpg', 'Market_Signage_2.jpg', 'Market_signage_stands.jpg', 'Market_sign_islands.jpg', 'Market_trellis.png', 'Market_walls.jpg', 'Market_waterfall_screen.jpg', 'Purple_Pod_chairs.jpg', 'Purple_pod_floor_ceiling.jpg', 'Purple_pod_screen.jpg', 'Purple_Pod_walls.jpg', 'Space_Pod_chairs.jpg', 'Space_Pod_floor_ceiling.jpg', 'Space_Pod_Inner_wall.jpg', 'Space_Pod_screen.jpg', 'Space_Pod_truss.png', 'Space_Pod_wood_pillars.jpg', 'SpeakEasy_barstools.jpg', 'SpeakEasy_Bar_Back_Bottles.jpg', 'SpeakEasy_Bar_Back_Lighting.jpg', 'SpeakEasy_bar_shelves.jpg', 'SpeakEasy_Bar_top.jpg', 'SpeakEasy_brick_wall.jpg', 'SpeakEasy_edison_lamps.png', 'SpeakEasy_floor.jpg', 'SpeakEasy_liquor_bottles.png', 'SpeakEasy_paneled_wall.jpg', 'SpeakEasy_rafters.jpg', 'SpeakEasy_screen.jpg', 'SpeakEasy_Table_and_Chairs.jpg', 'SpeakEasy_walls.jpg', 'TZ_blockchain_01.jpg', 'TZ_blockchain_02.jpg', 'TZ_blockchain_19.jpg', 'TZ_blockchain_20.jpg', 'TZ_Curved_screens_01.jpg', 'TZ_Curved_screens_02.jpg', 'TZ_Curved_screens_03.jpg', 'TZ_Curved_screens_04.jpg', 'TZ_Curved_screens_05.jpg', 'TZ_Curved_screens_06.jpg', 'TZ_Floor.jpg', 'TZ_mirror_wall.jpg', 'TZ_murals_01.jpg', 'TZ_outer_walls.jpg', 'TZ_pillar_monitors_01.jpg', 'TZ_pillar_monitors_02.jpg', 'TZ_pillar_monitors_03.jpg', 'TZ_pillar_monitors_04.jpg', 'TZ_Projectors.jpg', 'TZ_rafters.jpg', 'TZ_signage.jpg', 'TZ_wall_monitors_01.jpg', 'TZ_wall_monitors_02.jpg', 'TZ_wall_monitors_03.jpg', 'TZ_wall_monitors_04.jpg', 'TZ_wall_monitors_05.jpg', 'TZ_wall_monitors_06.jpg', 'TZ_wall_monitors_07.jpg', 'TZ_wall_monitors_08.jpg', 'VR_Bar_back_wall_fix.jpg', 'VR_Bar_Direction_Graphic.jpg', 'VR_Bar_display01.jpg', 'VR_Bar_Floor.jpg', 'VR_Bar_floor_lights.jpg', 'VR_Bar_furniture.jpg', 'VR_Bar_Inner_walls.jpg', 'VR_Bar_Outer_walls.jpg', 'VR_Bar_screens01.jpg', 'VR_Bar_screens02.jpg', 'VR_Bar_screens03.jpg', 'VR_Bar_screens04.jpg', 'VR_Bar_shooters.png', 'VR_Bar_Wall_fix.jpg', 'VR_Bar_yellow_Arches.jpg']
    for(var i = 0; i < models.length; i++){
        var modelname = 'exports/models/' + models[i];
        var trans = modelname.includes('transparent');
        loadModel(modelname, fulltext, 'exports/textures/', trans)
    }
}





function loadBSlides(){
    var slidesslides = []
    //0
    slidesslides.push(['./exports/slides/blockchain/blockchain_01.jpg', './exports/slides/blockchain/blockchain_02.jpg', './exports/slides/blockchain/blockchain_03.jpg', './exports/slides/blockchain/blockchain_04.jpg', './exports/slides/blockchain/blockchain_05.jpg', './exports/slides/blockchain/blockchain_06.jpg', './exports/slides/blockchain/blockchain_07.jpg', './exports/slides/blockchain/blockchain_08.jpg', './exports/slides/blockchain/blockchain_09.jpg', './exports/slides/blockchain/blockchain_10.jpg', './exports/slides/blockchain/blockchain_11.jpg', './exports/slides/blockchain/blockchain_12.jpg', './exports/slides/blockchain/blockchain_13.jpg', './exports/slides/blockchain/blockchain_14.jpg', './exports/slides/blockchain/blockchain_15.jpg', './exports/slides/blockchain/blockchain_16.jpg', './exports/slides/blockchain/blockchain_17.jpg', './exports/slides/blockchain/blockchain_18.jpg', './exports/slides/blockchain/blockchain_19.jpg', './exports/slides/blockchain/blockchain_20.jpg'])
    //1
    slidesslides.push(['./exports/slides/ai/ai_01.jpg', './exports/slides/ai/ai_02.jpg', './exports/slides/ai/ai_03.jpg', './exports/slides/ai/ai_04.jpg', './exports/slides/ai/ai_05.jpg', './exports/slides/ai/ai_06.jpg', './exports/slides/ai/ai_07.jpg', './exports/slides/ai/ai_08.jpg', './exports/slides/ai/ai_09.jpg', './exports/slides/ai/ai_10.jpg', './exports/slides/ai/ai_11.jpg', './exports/slides/ai/ai_12.jpg', './exports/slides/ai/ai_13.jpg'])
    //2
    slidesslides.push(['./exports/slides/cyber/cyber_1.jpg', './exports/slides/cyber/cyber_2.jpg', './exports/slides/cyber/cyber_3.jpg', './exports/slides/cyber/cyber_4.jpg', './exports/slides/cyber/cyber_5.jpg', './exports/slides/cyber/cyber_6.jpg'])
    //3
    slidesslides.push(['./exports/slides/innovation/innovation_01.jpg', './exports/slides/innovation/innovation_02.jpg', './exports/slides/innovation/innovation_03.jpg', './exports/slides/innovation/innovation_04.jpg', './exports/slides/innovation/innovation_05.jpg', './exports/slides/innovation/innovation_06.jpg', './exports/slides/innovation/innovation_07.jpg', './exports/slides/innovation/innovation_08.jpg', './exports/slides/innovation/innovation_09.jpg', './exports/slides/innovation/innovation_10.jpg', './exports/slides/innovation/innovation_11.jpg', './exports/slides/innovation/innovation_12.jpg', './exports/slides/innovation/innovation_13.jpg'])
    //4
    slidesslides.push(['./exports/slides/iot/iot_01.jpg', './exports/slides/iot/iot_02.jpg', './exports/slides/iot/iot_03.jpg', './exports/slides/iot/iot_04.jpg', './exports/slides/iot/iot_05.jpg', './exports/slides/iot/iot_06.jpg', './exports/slides/iot/iot_07.jpg', './exports/slides/iot/iot_08.jpg', './exports/slides/iot/iot_09.jpg', './exports/slides/iot/iot_10.jpg', './exports/slides/iot/iot_11.jpg', './exports/slides/iot/iot_12.jpg'])
    //5
    slidesslides.push(['./exports/slides/transform/transform_01.jpg', './exports/slides/transform/transform_02.jpg', './exports/slides/transform/transform_03.jpg', './exports/slides/transform/transform_04.jpg', './exports/slides/transform/transform_05.jpg', './exports/slides/transform/transform_06.jpg', './exports/slides/transform/transform_07.jpg', './exports/slides/transform/transform_08.jpg', './exports/slides/transform/transform_09.jpg', './exports/slides/transform/transform_10.jpg', './exports/slides/transform/transform_11.jpg'])
    //6
    slidesslides.push(['./exports/slides/arttech/Slide1.JPG', './exports/slides/arttech/Slide2.JPG', './exports/slides/arttech/Slide3.JPG', './exports/slides/arttech/Slide4.JPG'])
    //7
    slidesslides.push(['./exports/slides/future/future_01.jpg', './exports/slides/future/future_02.jpg', './exports/slides/future/future_03.jpg', './exports/slides/future/future_04.jpg', './exports/slides/future/future_05.jpg', './exports/slides/future/future_06.jpg', './exports/slides/future/future_07.jpg', './exports/slides/future/future_08.jpg', './exports/slides/future/future_09.jpg', './exports/slides/future/future_10.jpg', './exports/slides/future/future_11.jpg', './exports/slides/future/future_12.jpg', './exports/slides/future/future_13.jpg', './exports/slides/future/future_14.jpg', './exports/slides/future/future_15.jpg', './exports/slides/future/future_16.jpg']);
    //8
    slidesslides.push(['./exports/slides/ddmaster/dd_01.jpg', './exports/slides/ddmaster/dd_02.jpg', './exports/slides/ddmaster/dd_03.jpg', './exports/slides/ddmaster/dd_04.jpg', './exports/slides/ddmaster/dd_05.jpg', './exports/slides/ddmaster/dd_06.jpg', './exports/slides/ddmaster/dd_07.jpg', './exports/slides/ddmaster/dd_08.jpg', './exports/slides/ddmaster/dd_09.jpg', './exports/slides/ddmaster/dd_10.jpg', './exports/slides/ddmaster/dd_11.jpg', './exports/slides/ddmaster/dd_12.jpg', './exports/slides/ddmaster/dd_13.jpg', './exports/slides/ddmaster/dd_14.jpg', './exports/slides/ddmaster/dd_15.jpg', './exports/slides/ddmaster/dd_16.jpg', './exports/slides/ddmaster/dd_17.jpg', './exports/slides/ddmaster/dd_18.jpg', './exports/slides/ddmaster/dd_19.jpg', './exports/slides/ddmaster/dd_20.jpg', './exports/slides/ddmaster/dd_21.jpg', './exports/slides/ddmaster/dd_22.jpg', './exports/slides/ddmaster/dd_23.jpg', './exports/slides/ddmaster/dd_24.jpg', './exports/slides/ddmaster/dd_25.jpg', './exports/slides/ddmaster/dd_26.jpg', './exports/slides/ddmaster/dd_27.jpg', './exports/slides/ddmaster/dd_28.jpg', './exports/slides/ddmaster/dd_29.jpg', './exports/slides/ddmaster/dd_30.jpg', './exports/slides/ddmaster/dd_31.jpg', './exports/slides/ddmaster/dd_32.jpg', './exports/slides/ddmaster/dd_33.jpg', './exports/slides/ddmaster/dd_34.jpg', './exports/slides/ddmaster/dd_35.jpg', './exports/slides/ddmaster/dd_36.jpg', './exports/slides/ddmaster/dd_37.jpg', './exports/slides/ddmaster/dd_38.jpg', './exports/slides/ddmaster/dd_39.jpg', './exports/slides/ddmaster/dd_40.jpg', './exports/slides/ddmaster/dd_41.jpg', './exports/slides/ddmaster/dd_42.jpg', './exports/slides/ddmaster/dd_43.jpg', './exports/slides/ddmaster/dd_44.jpg', './exports/slides/ddmaster/dd_45.jpg', './exports/slides/ddmaster/dd_46.jpg', './exports/slides/ddmaster/dd_47.jpg', './exports/slides/ddmaster/dd_48.jpg', './exports/slides/ddmaster/dd_49.jpg', './exports/slides/ddmaster/dd_50.jpg', './exports/slides/ddmaster/dd_51.jpg', './exports/slides/ddmaster/dd_52.jpg', './exports/slides/ddmaster/dd_53.jpg', './exports/slides/ddmaster/dd_54.jpg', './exports/slides/ddmaster/dd_55.jpg', './exports/slides/ddmaster/dd_56.jpg', './exports/slides/ddmaster/dd_57.jpg', './exports/slides/ddmaster/dd_58.jpg', './exports/slides/ddmaster/dd_59.jpg', './exports/slides/ddmaster/dd_60.jpg', './exports/slides/ddmaster/dd_61.jpg', './exports/slides/ddmaster/dd_62.jpg', './exports/slides/ddmaster/dd_63.jpg', './exports/slides/ddmaster/dd_64.jpg', './exports/slides/ddmaster/dd_65.jpg', './exports/slides/ddmaster/dd_66.jpg', './exports/slides/ddmaster/dd_67.jpg', './exports/slides/ddmaster/dd_68.jpg', './exports/slides/ddmaster/dd_69.jpg', './exports/slides/ddmaster/dd_70.jpg', './exports/slides/ddmaster/dd_71.jpg', './exports/slides/ddmaster/dd_72.jpg', './exports/slides/ddmaster/dd_73.jpg', './exports/slides/ddmaster/dd_74.jpg', './exports/slides/ddmaster/dd_75.jpg', './exports/slides/ddmaster/dd_76.jpg', './exports/slides/ddmaster/dd_77.jpg', './exports/slides/ddmaster/dd_78.jpg', './exports/slides/ddmaster/dd_79.jpg', './exports/slides/ddmaster/dd_80.jpg']);
    //9
    slidesslides.push(['./exports/slides/idmaster/id_01.jpg', './exports/slides/idmaster/id_02.jpg', './exports/slides/idmaster/id_03.jpg', './exports/slides/idmaster/id_04.jpg', './exports/slides/idmaster/id_05.jpg', './exports/slides/idmaster/id_06.jpg', './exports/slides/idmaster/id_07.jpg', './exports/slides/idmaster/id_08.jpg', './exports/slides/idmaster/id_09.jpg', './exports/slides/idmaster/id_10.jpg', './exports/slides/idmaster/id_11.jpg', './exports/slides/idmaster/id_12.jpg', './exports/slides/idmaster/id_13.jpg', './exports/slides/idmaster/id_14.jpg', './exports/slides/idmaster/id_15.jpg', './exports/slides/idmaster/id_16.jpg', './exports/slides/idmaster/id_17.jpg', './exports/slides/idmaster/id_18.jpg', './exports/slides/idmaster/id_19.jpg', './exports/slides/idmaster/id_20.jpg', './exports/slides/idmaster/id_21.jpg', './exports/slides/idmaster/id_22.jpg', './exports/slides/idmaster/id_23.jpg', './exports/slides/idmaster/id_24.jpg', './exports/slides/idmaster/id_25.jpg', './exports/slides/idmaster/id_26.jpg']);
    //10
    slidesslides.push(['./exports/slides/customercentric/Slide1.JPG', './exports/slides/customercentric/Slide2.JPG', './exports/slides/customercentric/Slide3.JPG', './exports/slides/customercentric/Slide4.JPG', './exports/slides/customercentric/Slide5.JPG', './exports/slides/customercentric/Slide6.JPG']);
    //11
    slidesslides.push(['./exports/slides/dreamgap/Slide1.JPG', './exports/slides/dreamgap/Slide2.JPG', './exports/slides/dreamgap/Slide3.JPG', './exports/slides/dreamgap/Slide4.JPG']);
    //12
    slidesslides.push(['./exports/slides/dynamicrisk/Slide1.JPG', './exports/slides/dynamicrisk/Slide2.JPG', './exports/slides/dynamicrisk/Slide3.JPG', './exports/slides/dynamicrisk/Slide4.JPG', './exports/slides/dynamicrisk/Slide5.JPG']);
    //13
    slidesslides.push(['./exports/slides/hybridwork/Slide1.JPG', './exports/slides/hybridwork/Slide2.JPG', './exports/slides/hybridwork/Slide3.JPG', './exports/slides/hybridwork/Slide4.JPG', './exports/slides/hybridwork/Slide5.JPG']);
    //14
    slidesslides.push(['./exports/slides/innovationscale/Slide1.JPG', './exports/slides/innovationscale/Slide2.JPG', './exports/slides/innovationscale/Slide3.JPG', './exports/slides/innovationscale/Slide4.JPG', './exports/slides/innovationscale/Slide5.JPG', './exports/slides/innovationscale/Slide6.JPG']);
    //15
    slidesslides.push(['./exports/slides/personalizedcare/Slide1.JPG', './exports/slides/personalizedcare/Slide2.JPG', './exports/slides/personalizedcare/Slide3.JPG', './exports/slides/personalizedcare/Slide4.JPG', './exports/slides/personalizedcare/Slide5.JPG']);
    //16
    slidesslides.push(['./exports/slides/regeninnovation/Slide1.JPG', './exports/slides/regeninnovation/Slide2.JPG', './exports/slides/regeninnovation/Slide3.JPG', './exports/slides/regeninnovation/Slide4.JPG', './exports/slides/regeninnovation/Slide5.JPG']);
    //17
    slidesslides.push(['./exports/slides/skillsrequirements/Slide1.JPG', './exports/slides/skillsrequirements/Slide2.JPG', './exports/slides/skillsrequirements/Slide3.JPG', './exports/slides/skillsrequirements/Slide4.JPG']);
    //18
    slidesslides.push(['./exports/slides/sustainfood/Slide1.JPG', './exports/slides/sustainfood/Slide2.JPG', './exports/slides/sustainfood/Slide3.JPG', './exports/slides/sustainfood/Slide4.JPG', './exports/slides/sustainfood/Slide5.JPG', './exports/slides/sustainfood/Slide6.JPG']);
    //19
    slidesslides.push(['./exports/slides/sustainstrategy/Slide1.JPG', './exports/slides/sustainstrategy/Slide2.JPG', './exports/slides/sustainstrategy/Slide3.JPG', './exports/slides/sustainstrategy/Slide4.JPG', './exports/slides/sustainstrategy/Slide5.JPG']);
    //20
    slidesslides.push(['./exports/slides/techatspeed/Slide1.JPG', './exports/slides/techatspeed/Slide2.JPG', './exports/slides/techatspeed/Slide3.JPG', './exports/slides/techatspeed/Slide4.JPG']);
    //21
    slidesslides.push(['./exports/slides/transformationtransition/Slide1.JPG', './exports/slides/transformationtransition/Slide2.JPG', './exports/slides/transformationtransition/Slide3.JPG', './exports/slides/transformationtransition/Slide4.JPG', './exports/slides/transformationtransition/Slide5.JPG']);
    //22
    slidesslides.push(['./exports/slides/innovationsg/Slide1.JPG', './exports/slides/innovationsg/Slide2.JPG', './exports/slides/innovationsg/Slide3.JPG', './exports/slides/innovationsg/Slide4.JPG', './exports/slides/innovationsg/Slide5.JPG', './exports/slides/innovationsg/Slide6.JPG', './exports/slides/innovationsg/Slide7.JPG', './exports/slides/innovationsg/Slide8.JPG', './exports/slides/innovationsg/Slide9.JPG']);
    //23
    slidesslides.push(['./exports/slides/technologysg/Slide1.JPG', './exports/slides/technologysg/Slide2.JPG', './exports/slides/technologysg/Slide3.JPG', './exports/slides/technologysg/Slide4.JPG', './exports/slides/technologysg/Slide5.JPG', './exports/slides/technologysg/Slide6.JPG', './exports/slides/technologysg/Slide7.JPG', './exports/slides/technologysg/Slide8.JPG', './exports/slides/technologysg/Slide9.JPG', './exports/slides/technologysg/Slide910.JPG', './exports/slides/technologysg/Slide911.JPG', './exports/slides/technologysg/Slide912.JPG', './exports/slides/technologysg/Slide913.JPG', './exports/slides/technologysg/Slide914.JPG', './exports/slides/technologysg/Slide915.JPG'])
    //24
    slidesslides.push(['./exports/slides/transformationsg/Slide1.JPG', './exports/slides/transformationsg/Slide2.JPG', './exports/slides/transformationsg/Slide3.JPG', './exports/slides/transformationsg/Slide4.JPG', './exports/slides/transformationsg/Slide5.JPG', './exports/slides/transformationsg/Slide6.JPG', './exports/slides/transformationsg/Slide7.JPG', './exports/slides/transformationsg/Slide8.JPG', './exports/slides/transformationsg/Slide9.JPG', './exports/slides/transformationsg/Slide910.JPG', './exports/slides/transformationsg/Slide911.JPG']);
    //25
    slidesslides.push(['./exports/slides/transformbusiness/Slide1.JPG', './exports/slides/transformbusiness/Slide2.JPG', './exports/slides/transformbusiness/Slide3.JPG', './exports/slides/transformbusiness/Slide4.JPG']);
    //26
    slidesslides.push(['./exports/slides/metaversecloud/Slide1.JPG', './exports/slides/metaversecloud/Slide2.JPG', './exports/slides/metaversecloud/Slide3.JPG', './exports/slides/metaversecloud/Slide4.JPG']);
    //27
    slidesslides.push(['./exports/slides/arttechinnovation/Slide1.JPG', './exports/slides/arttechinnovation/Slide2.JPG', './exports/slides/arttechinnovation/Slide3.JPG', './exports/slides/arttechinnovation/Slide4.JPG']);
    //28
    slidesslides.push(['./exports/slides/ecosystems/Slide1.JPG', './exports/slides/ecosystems/Slide2.JPG', './exports/slides/ecosystems/Slide3.JPG', './exports/slides/ecosystems/Slide4.JPG', './exports/slides/ecosystems/Slide5.JPG', './exports/slides/ecosystems/Slide6.JPG', './exports/slides/ecosystems/Slide7.JPG', './exports/slides/ecosystems/Slide8.JPG']);
    //29
    slidesslides.push(['./exports/slides/IRHighlights/Slide1.JPG', './exports/slides/IRHighlights/Slide2.JPG', './exports/slides/IRHighlights/Slide3.JPG', './exports/slides/IRHighlights/Slide4.JPG', './exports/slides/IRHighlights/Slide5.JPG', './exports/slides/IRHighlights/Slide6.JPG']);
    //30
    slidesslides.push(['./exports/slides/DataTransformation/Slide1.JPG', './exports/slides/DataTransformation/Slide2.JPG', './exports/slides/DataTransformation/Slide3.JPG', './exports/slides/DataTransformation/Slide4.JPG']);
    //31
    slidesslides.push(['./exports/slides/pandemicendemic/Slide1.JPG', './exports/slides/pandemicendemic/Slide2.JPG', './exports/slides/pandemicendemic/Slide3.JPG', './exports/slides/pandemicendemic/Slide4.JPG']);
    //32
    slidesslides.push(['./exports/slides/McgrathCEO360/Slide1.JPG', './exports/slides/McgrathCEO360/Slide2.JPG', './exports/slides/McgrathCEO360/Slide3.JPG']);
    //33
    slidesslides.push(['./exports/slides/metaverse/Slide1.JPG', './exports/slides/metaverse/Slide10.JPG', './exports/slides/metaverse/Slide11.JPG', './exports/slides/metaverse/Slide12.JPG', './exports/slides/metaverse/Slide2.JPG', './exports/slides/metaverse/Slide3.JPG', './exports/slides/metaverse/Slide4.JPG', './exports/slides/metaverse/Slide5.JPG', './exports/slides/metaverse/Slide6.JPG', './exports/slides/metaverse/Slide7.JPG', './exports/slides/metaverse/Slide8.JPG', './exports/slides/metaverse/Slide9.JPG']);

    for(var i = 0; i < slidesslides.length; i++){
        var newDeck = []

        for(var j = 0; j < slidesslides[i].length; j++){
           
            //console.log(slidesslides[i][j])
            newDeck.push(makeTexture(slidesslides[i][j]));
        }
        slideDecks.push(newDeck);
        firstSlides.push(makeLambertTexture(slidesslides[i][0]))
        //console.log("deck pushed" + newDeck.length)
    }
    //slides[0] = textureLoader.load('/exports/slides/slide1.png')
    //slides[1] = textureLoader.load('/exports/slides/slide2.png')
    //slides[2] = textureLoader.load('/exports/slides/slide3.png')
}

function loadHTMLSlides(){
    var slidesslides = []
    //0
    slidesslides.push(['./exports/slides/blockchain/blockchain_01.jpg', './exports/slides/blockchain/blockchain_02.jpg', './exports/slides/blockchain/blockchain_03.jpg', './exports/slides/blockchain/blockchain_04.jpg', './exports/slides/blockchain/blockchain_05.jpg', './exports/slides/blockchain/blockchain_06.jpg', './exports/slides/blockchain/blockchain_07.jpg', './exports/slides/blockchain/blockchain_08.jpg', './exports/slides/blockchain/blockchain_09.jpg', './exports/slides/blockchain/blockchain_10.jpg', './exports/slides/blockchain/blockchain_11.jpg', './exports/slides/blockchain/blockchain_12.jpg', './exports/slides/blockchain/blockchain_13.jpg', './exports/slides/blockchain/blockchain_14.jpg', './exports/slides/blockchain/blockchain_15.jpg', './exports/slides/blockchain/blockchain_16.jpg', './exports/slides/blockchain/blockchain_17.jpg', './exports/slides/blockchain/blockchain_18.jpg', './exports/slides/blockchain/blockchain_19.jpg', './exports/slides/blockchain/blockchain_20.jpg'])
    //1
    slidesslides.push(['./exports/slides/ai/ai_01.jpg', './exports/slides/ai/ai_02.jpg', './exports/slides/ai/ai_03.jpg', './exports/slides/ai/ai_04.jpg', './exports/slides/ai/ai_05.jpg', './exports/slides/ai/ai_06.jpg', './exports/slides/ai/ai_07.jpg', './exports/slides/ai/ai_08.jpg', './exports/slides/ai/ai_09.jpg', './exports/slides/ai/ai_10.jpg', './exports/slides/ai/ai_11.jpg', './exports/slides/ai/ai_12.jpg', './exports/slides/ai/ai_13.jpg'])
    //2
    slidesslides.push(['./exports/slides/cyber/cyber_1.jpg', './exports/slides/cyber/cyber_2.jpg', './exports/slides/cyber/cyber_3.jpg', './exports/slides/cyber/cyber_4.jpg', './exports/slides/cyber/cyber_5.jpg', './exports/slides/cyber/cyber_6.jpg'])
    //3
    slidesslides.push(['./exports/slides/innovation/innovation_01.jpg', './exports/slides/innovation/innovation_02.jpg', './exports/slides/innovation/innovation_03.jpg', './exports/slides/innovation/innovation_04.jpg', './exports/slides/innovation/innovation_05.jpg', './exports/slides/innovation/innovation_06.jpg', './exports/slides/innovation/innovation_07.jpg', './exports/slides/innovation/innovation_08.jpg', './exports/slides/innovation/innovation_09.jpg', './exports/slides/innovation/innovation_10.jpg', './exports/slides/innovation/innovation_11.jpg', './exports/slides/innovation/innovation_12.jpg', './exports/slides/innovation/innovation_13.jpg'])
    //4
    slidesslides.push(['./exports/slides/iot/iot_01.jpg', './exports/slides/iot/iot_02.jpg', './exports/slides/iot/iot_03.jpg', './exports/slides/iot/iot_04.jpg', './exports/slides/iot/iot_05.jpg', './exports/slides/iot/iot_06.jpg', './exports/slides/iot/iot_07.jpg', './exports/slides/iot/iot_08.jpg', './exports/slides/iot/iot_09.jpg', './exports/slides/iot/iot_10.jpg', './exports/slides/iot/iot_11.jpg', './exports/slides/iot/iot_12.jpg'])
    //5
    slidesslides.push(['./exports/slides/transform/transform_01.jpg', './exports/slides/transform/transform_02.jpg', './exports/slides/transform/transform_03.jpg', './exports/slides/transform/transform_04.jpg', './exports/slides/transform/transform_05.jpg', './exports/slides/transform/transform_06.jpg', './exports/slides/transform/transform_07.jpg', './exports/slides/transform/transform_08.jpg', './exports/slides/transform/transform_09.jpg', './exports/slides/transform/transform_10.jpg', './exports/slides/transform/transform_11.jpg'])
    //6
    slidesslides.push(['./exports/slides/arttech/Slide1.JPG', './exports/slides/arttech/Slide2.JPG', './exports/slides/arttech/Slide3.JPG', './exports/slides/arttech/Slide4.JPG'])
    //7
    slidesslides.push(['./exports/slides/future/future_01.jpg', './exports/slides/future/future_02.jpg', './exports/slides/future/future_03.jpg', './exports/slides/future/future_04.jpg', './exports/slides/future/future_05.jpg', './exports/slides/future/future_06.jpg', './exports/slides/future/future_07.jpg', './exports/slides/future/future_08.jpg', './exports/slides/future/future_09.jpg', './exports/slides/future/future_10.jpg', './exports/slides/future/future_11.jpg', './exports/slides/future/future_12.jpg', './exports/slides/future/future_13.jpg', './exports/slides/future/future_14.jpg', './exports/slides/future/future_15.jpg', './exports/slides/future/future_16.jpg']);
    //8
    slidesslides.push(['./exports/slides/ddmaster/dd_01.jpg', './exports/slides/ddmaster/dd_02.jpg', './exports/slides/ddmaster/dd_03.jpg', './exports/slides/ddmaster/dd_04.jpg', './exports/slides/ddmaster/dd_05.jpg', './exports/slides/ddmaster/dd_06.jpg', './exports/slides/ddmaster/dd_07.jpg', './exports/slides/ddmaster/dd_08.jpg', './exports/slides/ddmaster/dd_09.jpg', './exports/slides/ddmaster/dd_10.jpg', './exports/slides/ddmaster/dd_11.jpg', './exports/slides/ddmaster/dd_12.jpg', './exports/slides/ddmaster/dd_13.jpg', './exports/slides/ddmaster/dd_14.jpg', './exports/slides/ddmaster/dd_15.jpg', './exports/slides/ddmaster/dd_16.jpg', './exports/slides/ddmaster/dd_17.jpg', './exports/slides/ddmaster/dd_18.jpg', './exports/slides/ddmaster/dd_19.jpg', './exports/slides/ddmaster/dd_20.jpg', './exports/slides/ddmaster/dd_21.jpg', './exports/slides/ddmaster/dd_22.jpg', './exports/slides/ddmaster/dd_23.jpg', './exports/slides/ddmaster/dd_24.jpg', './exports/slides/ddmaster/dd_25.jpg', './exports/slides/ddmaster/dd_26.jpg', './exports/slides/ddmaster/dd_27.jpg', './exports/slides/ddmaster/dd_28.jpg', './exports/slides/ddmaster/dd_29.jpg', './exports/slides/ddmaster/dd_30.jpg', './exports/slides/ddmaster/dd_31.jpg', './exports/slides/ddmaster/dd_32.jpg', './exports/slides/ddmaster/dd_33.jpg', './exports/slides/ddmaster/dd_34.jpg', './exports/slides/ddmaster/dd_35.jpg', './exports/slides/ddmaster/dd_36.jpg', './exports/slides/ddmaster/dd_37.jpg', './exports/slides/ddmaster/dd_38.jpg', './exports/slides/ddmaster/dd_39.jpg', './exports/slides/ddmaster/dd_40.jpg', './exports/slides/ddmaster/dd_41.jpg', './exports/slides/ddmaster/dd_42.jpg', './exports/slides/ddmaster/dd_43.jpg', './exports/slides/ddmaster/dd_44.jpg', './exports/slides/ddmaster/dd_45.jpg', './exports/slides/ddmaster/dd_46.jpg', './exports/slides/ddmaster/dd_47.jpg', './exports/slides/ddmaster/dd_48.jpg', './exports/slides/ddmaster/dd_49.jpg', './exports/slides/ddmaster/dd_50.jpg', './exports/slides/ddmaster/dd_51.jpg', './exports/slides/ddmaster/dd_52.jpg', './exports/slides/ddmaster/dd_53.jpg', './exports/slides/ddmaster/dd_54.jpg', './exports/slides/ddmaster/dd_55.jpg', './exports/slides/ddmaster/dd_56.jpg', './exports/slides/ddmaster/dd_57.jpg', './exports/slides/ddmaster/dd_58.jpg', './exports/slides/ddmaster/dd_59.jpg', './exports/slides/ddmaster/dd_60.jpg', './exports/slides/ddmaster/dd_61.jpg', './exports/slides/ddmaster/dd_62.jpg', './exports/slides/ddmaster/dd_63.jpg', './exports/slides/ddmaster/dd_64.jpg', './exports/slides/ddmaster/dd_65.jpg', './exports/slides/ddmaster/dd_66.jpg', './exports/slides/ddmaster/dd_67.jpg', './exports/slides/ddmaster/dd_68.jpg', './exports/slides/ddmaster/dd_69.jpg', './exports/slides/ddmaster/dd_70.jpg', './exports/slides/ddmaster/dd_71.jpg', './exports/slides/ddmaster/dd_72.jpg', './exports/slides/ddmaster/dd_73.jpg', './exports/slides/ddmaster/dd_74.jpg', './exports/slides/ddmaster/dd_75.jpg', './exports/slides/ddmaster/dd_76.jpg', './exports/slides/ddmaster/dd_77.jpg', './exports/slides/ddmaster/dd_78.jpg', './exports/slides/ddmaster/dd_79.jpg', './exports/slides/ddmaster/dd_80.jpg']);
    //9
    slidesslides.push(['./exports/slides/idmaster/id_01.jpg', './exports/slides/idmaster/id_02.jpg', './exports/slides/idmaster/id_03.jpg', './exports/slides/idmaster/id_04.jpg', './exports/slides/idmaster/id_05.jpg', './exports/slides/idmaster/id_06.jpg', './exports/slides/idmaster/id_07.jpg', './exports/slides/idmaster/id_08.jpg', './exports/slides/idmaster/id_09.jpg', './exports/slides/idmaster/id_10.jpg', './exports/slides/idmaster/id_11.jpg', './exports/slides/idmaster/id_12.jpg', './exports/slides/idmaster/id_13.jpg', './exports/slides/idmaster/id_14.jpg', './exports/slides/idmaster/id_15.jpg', './exports/slides/idmaster/id_16.jpg', './exports/slides/idmaster/id_17.jpg', './exports/slides/idmaster/id_18.jpg', './exports/slides/idmaster/id_19.jpg', './exports/slides/idmaster/id_20.jpg', './exports/slides/idmaster/id_21.jpg', './exports/slides/idmaster/id_22.jpg', './exports/slides/idmaster/id_23.jpg', './exports/slides/idmaster/id_24.jpg', './exports/slides/idmaster/id_25.jpg', './exports/slides/idmaster/id_26.jpg']);
    //10
    slidesslides.push(['./exports/slides/customercentric/Slide1.JPG', './exports/slides/customercentric/Slide2.JPG', './exports/slides/customercentric/Slide3.JPG', './exports/slides/customercentric/Slide4.JPG', './exports/slides/customercentric/Slide5.JPG', './exports/slides/customercentric/Slide6.JPG']);
    //11
    slidesslides.push(['./exports/slides/dreamgap/Slide1.JPG', './exports/slides/dreamgap/Slide2.JPG', './exports/slides/dreamgap/Slide3.JPG', './exports/slides/dreamgap/Slide4.JPG']);
    //12
    slidesslides.push(['./exports/slides/dynamicrisk/Slide1.JPG', './exports/slides/dynamicrisk/Slide2.JPG', './exports/slides/dynamicrisk/Slide3.JPG', './exports/slides/dynamicrisk/Slide4.JPG', './exports/slides/dynamicrisk/Slide5.JPG']);
    //13
    slidesslides.push(['./exports/slides/hybridwork/Slide1.JPG', './exports/slides/hybridwork/Slide2.JPG', './exports/slides/hybridwork/Slide3.JPG', './exports/slides/hybridwork/Slide4.JPG', './exports/slides/hybridwork/Slide5.JPG']);
    //14
    slidesslides.push(['./exports/slides/innovationscale/Slide1.JPG', './exports/slides/innovationscale/Slide2.JPG', './exports/slides/innovationscale/Slide3.JPG', './exports/slides/innovationscale/Slide4.JPG', './exports/slides/innovationscale/Slide5.JPG', './exports/slides/innovationscale/Slide6.JPG']);
    //15
    slidesslides.push(['./exports/slides/personalizedcare/Slide1.JPG', './exports/slides/personalizedcare/Slide2.JPG', './exports/slides/personalizedcare/Slide3.JPG', './exports/slides/personalizedcare/Slide4.JPG', './exports/slides/personalizedcare/Slide5.JPG']);
    //16
    slidesslides.push(['./exports/slides/regeninnovation/Slide1.JPG', './exports/slides/regeninnovation/Slide2.JPG', './exports/slides/regeninnovation/Slide3.JPG', './exports/slides/regeninnovation/Slide4.JPG', './exports/slides/regeninnovation/Slide5.JPG']);
    //17
    slidesslides.push(['./exports/slides/skillsrequirements/Slide1.JPG', './exports/slides/skillsrequirements/Slide2.JPG', './exports/slides/skillsrequirements/Slide3.JPG', './exports/slides/skillsrequirements/Slide4.JPG']);
    //18
    slidesslides.push(['./exports/slides/sustainfood/Slide1.JPG', './exports/slides/sustainfood/Slide2.JPG', './exports/slides/sustainfood/Slide3.JPG', './exports/slides/sustainfood/Slide4.JPG', './exports/slides/sustainfood/Slide5.JPG', './exports/slides/sustainfood/Slide6.JPG']);
    //19
    slidesslides.push(['./exports/slides/sustainstrategy/Slide1.JPG', './exports/slides/sustainstrategy/Slide2.JPG', './exports/slides/sustainstrategy/Slide3.JPG', './exports/slides/sustainstrategy/Slide4.JPG', './exports/slides/sustainstrategy/Slide5.JPG']);
    //20
    slidesslides.push(['./exports/slides/techatspeed/Slide1.JPG', './exports/slides/techatspeed/Slide2.JPG', './exports/slides/techatspeed/Slide3.JPG', './exports/slides/techatspeed/Slide4.JPG']);
    //21
    slidesslides.push(['./exports/slides/transformationtransition/Slide1.JPG', './exports/slides/transformationtransition/Slide2.JPG', './exports/slides/transformationtransition/Slide3.JPG', './exports/slides/transformationtransition/Slide4.JPG', './exports/slides/transformationtransition/Slide5.JPG']);
    //22
    slidesslides.push(['./exports/slides/innovationsg/Slide1.JPG', './exports/slides/innovationsg/Slide2.JPG', './exports/slides/innovationsg/Slide3.JPG', './exports/slides/innovationsg/Slide4.JPG', './exports/slides/innovationsg/Slide5.JPG', './exports/slides/innovationsg/Slide6.JPG', './exports/slides/innovationsg/Slide7.JPG', './exports/slides/innovationsg/Slide8.JPG', './exports/slides/innovationsg/Slide9.JPG']);
    //23
    slidesslides.push(['./exports/slides/technologysg/Slide1.JPG', './exports/slides/technologysg/Slide2.JPG', './exports/slides/technologysg/Slide3.JPG', './exports/slides/technologysg/Slide4.JPG', './exports/slides/technologysg/Slide5.JPG', './exports/slides/technologysg/Slide6.JPG', './exports/slides/technologysg/Slide7.JPG', './exports/slides/technologysg/Slide8.JPG', './exports/slides/technologysg/Slide9.JPG', './exports/slides/technologysg/Slide910.JPG', './exports/slides/technologysg/Slide911.JPG', './exports/slides/technologysg/Slide912.JPG', './exports/slides/technologysg/Slide913.JPG', './exports/slides/technologysg/Slide914.JPG', './exports/slides/technologysg/Slide915.JPG'])
    //24
    slidesslides.push(['./exports/slides/transformationsg/Slide1.JPG', './exports/slides/transformationsg/Slide2.JPG', './exports/slides/transformationsg/Slide3.JPG', './exports/slides/transformationsg/Slide4.JPG', './exports/slides/transformationsg/Slide5.JPG', './exports/slides/transformationsg/Slide6.JPG', './exports/slides/transformationsg/Slide7.JPG', './exports/slides/transformationsg/Slide8.JPG', './exports/slides/transformationsg/Slide9.JPG', './exports/slides/transformationsg/Slide910.JPG', './exports/slides/transformationsg/Slide911.JPG']);
    //25
    slidesslides.push(['./exports/slides/transformbusiness/Slide1.JPG', './exports/slides/transformbusiness/Slide2.JPG', './exports/slides/transformbusiness/Slide3.JPG', './exports/slides/transformbusiness/Slide4.JPG']);
    //26
    slidesslides.push(['./exports/slides/metaversecloud/Slide1.JPG', './exports/slides/metaversecloud/Slide2.JPG', './exports/slides/metaversecloud/Slide3.JPG', './exports/slides/metaversecloud/Slide4.JPG']);
    //27
    slidesslides.push(['./exports/slides/arttechinnovation/Slide1.JPG', './exports/slides/arttechinnovation/Slide2.JPG', './exports/slides/arttechinnovation/Slide3.JPG', './exports/slides/arttechinnovation/Slide4.JPG']);
    //28
    slidesslides.push(['./exports/slides/ecosystems/Slide1.JPG', './exports/slides/ecosystems/Slide2.JPG', './exports/slides/ecosystems/Slide3.JPG', './exports/slides/ecosystems/Slide4.JPG', './exports/slides/ecosystems/Slide5.JPG', './exports/slides/ecosystems/Slide6.JPG', './exports/slides/ecosystems/Slide7.JPG', './exports/slides/ecosystems/Slide8.JPG']);
    //29
    slidesslides.push(['./exports/slides/IRHighlights/Slide1.JPG', './exports/slides/IRHighlights/Slide2.JPG', './exports/slides/IRHighlights/Slide3.JPG', './exports/slides/IRHighlights/Slide4.JPG', './exports/slides/IRHighlights/Slide5.JPG', './exports/slides/IRHighlights/Slide6.JPG']);
    //30
    slidesslides.push(['./exports/slides/DataTransformation/Slide1.JPG', './exports/slides/DataTransformation/Slide2.JPG', './exports/slides/DataTransformation/Slide3.JPG', './exports/slides/DataTransformation/Slide4.JPG']);
    //31
    slidesslides.push(['./exports/slides/pandemicendemic/Slide1.JPG', './exports/slides/pandemicendemic/Slide2.JPG', './exports/slides/pandemicendemic/Slide3.JPG', './exports/slides/pandemicendemic/Slide4.JPG']);
    //32
    slidesslides.push(['./exports/slides/McgrathCEO360/Slide1.JPG', './exports/slides/McgrathCEO360/Slide2.JPG', './exports/slides/McgrathCEO360/Slide3.JPG']);
    //33
    slidesslides.push(['./exports/slides/metaverse/Slide1.JPG', './exports/slides/metaverse/Slide10.JPG', './exports/slides/metaverse/Slide11.JPG', './exports/slides/metaverse/Slide12.JPG', './exports/slides/metaverse/Slide2.JPG', './exports/slides/metaverse/Slide3.JPG', './exports/slides/metaverse/Slide4.JPG', './exports/slides/metaverse/Slide5.JPG', './exports/slides/metaverse/Slide6.JPG', './exports/slides/metaverse/Slide7.JPG', './exports/slides/metaverse/Slide8.JPG', './exports/slides/metaverse/Slide9.JPG']);

    for(var i = 0; i < slidesslides.length; i++){
        var newDeck = []

        for(var j = 0; j < slidesslides[i].length; j++){
           
            //console.log(slidesslides[i][j])
            newDeck.push(slidesslides[i][j]);
        }
        slideDecks.push(newDeck);
        firstSlides.push(makeLambertTexture(slidesslides[i][0]))
        //console.log("deck pushed" + newDeck.length)
    }
    //slides[0] = textureLoader.load('/exports/slides/slide1.png')
    //slides[1] = textureLoader.load('/exports/slides/slide2.png')
    //slides[2] = textureLoader.load('/exports/slides/slide3.png')
}


function switchCamera(p){
    if(p){
        camera = pcamera;
        //camera.position.set(pcamera.position);
        slidecammode = false;
        
    }
    else{
        if(!slidecammode){
            pcamera = camera;
        }
        camera = ocamera;
        //camera.position.set(ocamera.position)
        slidecammode = true;
    }
}

function displaySlides(p, a, dist=1.5, mul=1, split=false){
    
    //Set pcamera, should probably change
    //pcamera = camera;
    switchCamera(false);
    //console.log("mul " + mul)
    //console.log("dist " + dist)
    var bmul = 0.54;
    //console.log("dist is " + dist);
    //console.log("position is " + p.x + " " + p.z);
    //console.log("angle is " + a)
    ocamera.position.x = p.x-Math.sin(a)*dist;
    ocamera.position.y = p.y;
    ocamera.position.z = p.z-Math.cos(a)*dist;
    //console.log("cam pos " + ocamera.position.x + " " + ocamera.position.z)
    ocamera.quaternion.setFromEuler( new Euler( 0, a+Math.PI, 0, 'YXZ' ));
    //ocamera.quaternion
    back_mesh.position.set(p.x+mul*bmul*Math.cos(a)-0.1*Math.sin(a), p.y, p.z-mul*bmul*Math.sin(a)-0.1*Math.cos(a));
    back_mesh.rotation.set(0, a, 0);
    next_mesh.position.set(p.x-mul*bmul*Math.cos(a)-0.1*Math.sin(a), p.y, p.z+mul*bmul*Math.sin(a)-0.1*Math.cos(a));
    next_mesh.rotation.set(0, a, 0);

    x_mesh.position.set(p.x+mul*bmul*Math.cos(a)-0.1*Math.sin(a), p.y+mul*0.27, p.z-mul*bmul*Math.sin(a)-0.1*Math.cos(a));
    x_mesh.rotation.set(0, a, 0);

    contact_mesh.position.set(p.x-0.5*mul*bmul*Math.cos(a)-0.1*Math.sin(a), p.y-mul*0.14, p.z+0.5*mul*bmul*Math.sin(a)-0.1*Math.cos(a));
    console.log("contact mesh pos: x = " + (p.x-0.5*mul*bmul*Math.cos(a)-0.1*Math.sin(a)) + ", y = " + (p.y-mul*0.14) + ", z = " + (p.z+0.5*mul*bmul*Math.sin(a)-0.1*Math.cos(a)))
    contact_mesh.rotation.set(0, a, 0);

    back_mesh.visible = false;
    next_mesh.visible = !split;
    x_mesh.visible = true;
    
    //console.log("backmesh" + back_mesh.position.x+","+back_mesh.position.y+","+back_mesh.position.z);

    slideMode = true;

    document.getElementById("return").style.visibility = "hidden";
    document.getElementById("controlbutton").style.visibility = "hidden";
    document.getElementById("controller").style.visibility = "hidden";

}

function displaySlideScreen(){
    var p = Slide_screen.position;
    var a = 0;
    var dist = 1.5;
    var mul = 1;
    var split = false;


    //Set pcamera, should probably change
    //pcamera = camera;
    switchCamera(false);
    //console.log("mul " + mul)
    //console.log("dist " + dist)
    var bmul = 0.54;
    //console.log("dist is " + dist);
    //console.log("position is " + p.x + " " + p.z);
    //console.log("angle is " + a)
    ocamera.position.x = p.x-Math.sin(a)*dist;
    ocamera.position.y = p.y;
    ocamera.position.z = p.z-Math.cos(a)*dist;
    //console.log("cam pos " + ocamera.position.x + " " + ocamera.position.z)
    ocamera.quaternion.setFromEuler( new Euler( 0, a+Math.PI, 0, 'YXZ' ));
    //ocamera.quaternion
    back_mesh.position.set(p.x+mul*bmul*Math.cos(a)-0.1*Math.sin(a), p.y, p.z-mul*bmul*Math.sin(a)-0.1*Math.cos(a));
    back_mesh.rotation.set(0, a, 0);
    next_mesh.position.set(p.x-mul*bmul*Math.cos(a)-0.1*Math.sin(a), p.y, p.z+mul*bmul*Math.sin(a)-0.1*Math.cos(a));
    next_mesh.rotation.set(0, a, 0);

    x_mesh.position.set(p.x+mul*bmul*Math.cos(a)-0.1*Math.sin(a), p.y+mul*0.27, p.z-mul*bmul*Math.sin(a)-0.1*Math.cos(a));
    x_mesh.rotation.set(0, a, 0);

    contact_mesh.position.set(p.x-0.5*mul*bmul*Math.cos(a)-0.1*Math.sin(a), p.y-mul*0.14, p.z+0.5*mul*bmul*Math.sin(a)-0.1*Math.cos(a));
    console.log("contact mesh pos: x = " + (p.x-0.5*mul*bmul*Math.cos(a)-0.1*Math.sin(a)) + ", y = " + (p.y-mul*0.14) + ", z = " + (p.z+0.5*mul*bmul*Math.sin(a)-0.1*Math.cos(a)))

    contact_mesh.rotation.set(0, a, 0);

    back_mesh.visible = false;
    next_mesh.visible = !split;
    x_mesh.visible = true;
    
    //console.log("backmesh" + back_mesh.position.x+","+back_mesh.position.y+","+back_mesh.position.z);

    slideMode = true;

    document.getElementById("return").style.visibility = "hidden";
    document.getElementById("controlbutton").style.visibility = "hidden";
    document.getElementById("controller").style.visibility = "hidden";


    updateSlideScreen();

}


function exitSlideModeHTML(){
    console.log("exit")
    slideMode = false;
    actualSlideMode = false;
    document.getElementById("slideviewer").style.visibility = "hidden";
    document.getElementById("fourviewer").style.visibility = "hidden";
    document.getElementById("sixviewer").style.visibility = "hidden";
    document.getElementById("nextbutton").style.visibility = "hidden";
    document.getElementById("backbutton").style.visibility = "hidden";
    document.getElementById("contactbutton").style.visibility = "hidden";
    document.getElementById("slidexbutton").style.visibility = "hidden";
    document.getElementById("return").style.visibility = "visible";
    document.getElementById("controlbutton").style.visibility = "visible";
    document.getElementById("controller").style.visibility = "visible";
}

function enterSlideModeHTML(){
    slides = slideDecks[slideIndices[slideMesh.name]];
    updateSlideScreenHTML();
    slideMode = true;
    actualSlideMode = true;
    document.getElementById("slidexbutton").style.visibility = "visible";
    document.getElementById("slideviewer").style.visibility = "visible";
    document.getElementById("return").style.visibility = "hidden";
    document.getElementById("controlbutton").style.visibility = "hidden";
    document.getElementById("controller").style.visibility = "hidden";
}

function enterSlideModeHTMLFour(ind){
    slideMode = true;
    document.getElementById("fourviewer").style.visibility = "visible";
    if(ind==0){
        document.getElementById("slide1").src = slideDecks[slideIndices['IZ_screen_1']][0];
        document.getElementById("slide1").addEventListener('click', function( event ){
            slideMesh = scene.getObjectByName('IZ_screen_1');
            document.getElementById("fourviewer").style.visibility = "hidden";
            enterSlideModeHTML();
        })
        document.getElementById("slide2").src = slideDecks[slideIndices['IZ_screen_2']][0];
        document.getElementById("slide2").addEventListener('click', function( event ){
            slideMesh = scene.getObjectByName('IZ_screen_2');
            document.getElementById("fourviewer").style.visibility = "hidden";
            enterSlideModeHTML();
        })
        document.getElementById("slide3").src = slideDecks[slideIndices['IZ_screen_3']][0];
        document.getElementById("slide3").addEventListener('click', function( event ){
            slideMesh = scene.getObjectByName('IZ_screen_3');
            document.getElementById("fourviewer").style.visibility = "hidden";
            enterSlideModeHTML();
        })
        document.getElementById("slide4").src = slideDecks[slideIndices['IZ_screen_4']][0];
        document.getElementById("slide4").addEventListener('click', function( event ){
            slideMesh = scene.getObjectByName('IZ_screen_4');
            document.getElementById("fourviewer").style.visibility = "hidden";
            enterSlideModeHTML();
        })
    }
    else if(ind==1){
        document.getElementById("slide1").src = slideDecks[slideIndices['Purple_pod_screen_1']][0];
        document.getElementById("slide1").addEventListener('click', function( event ){
            slideMesh = scene.getObjectByName('Purple_pod_screen_1');
            document.getElementById("fourviewer").style.visibility = "hidden";
            enterSlideModeHTML();
        })
        document.getElementById("slide2").src = slideDecks[slideIndices['Purple_pod_screen_2']][0];
        document.getElementById("slide2").addEventListener('click', function( event ){
            slideMesh = scene.getObjectByName('Purple_pod_screen_2');
            document.getElementById("fourviewer").style.visibility = "hidden";
            enterSlideModeHTML();
        })
        document.getElementById("slide3").src = slideDecks[slideIndices['Purple_pod_screen_3']][0];
        document.getElementById("slide3").addEventListener('click', function( event ){
            slideMesh = scene.getObjectByName('Purple_pod_screen_3');
            document.getElementById("fourviewer").style.visibility = "hidden";
            enterSlideModeHTML();
        })
        document.getElementById("slide4").src = slideDecks[slideIndices['Purple_pod_screen_4']][0];
        document.getElementById("slide4").addEventListener('click', function( event ){
            slideMesh = scene.getObjectByName('Purple_pod_screen_4');
            document.getElementById("fourviewer").style.visibility = "hidden";
            enterSlideModeHTML();
        }) 
    }
}

function enterSlideModeHTMLSix(){
    slideMode = true;
    document.getElementById("sixviewer").style.visibility = "visible";
    document.getElementById("slide1a").src = slideDecks[slideIndices['infinite_possibilities_screen_1']][0];
    document.getElementById("slide1a").addEventListener('click', function( event ){
        slideMesh = scene.getObjectByName('infinite_possibilities_screen_1');
        document.getElementById("sixviewer").style.visibility = "hidden";
        enterSlideModeHTML();
    })
    document.getElementById("slide2a").src = slideDecks[slideIndices['infinite_possibilities_screen_2']][0];
    document.getElementById("slide2a").addEventListener('click', function( event ){
        slideMesh = scene.getObjectByName('infinite_possibilities_screen_2');
        document.getElementById("sixviewer").style.visibility = "hidden";
        enterSlideModeHTML();
    })
    document.getElementById("slide4a").src = slideDecks[slideIndices['infinite_possibilities_screen_3']][0];
    document.getElementById("slide4a").addEventListener('click', function( event ){
        slideMesh = scene.getObjectByName('infinite_possibilities_screen_3');
        document.getElementById("sixviewer").style.visibility = "hidden";
        enterSlideModeHTML();
    })
    document.getElementById("slide5a").src = slideDecks[slideIndices['infinite_possibilities_screen_4']][0];
    document.getElementById("slide5a").addEventListener('click', function( event ){
        slideMesh = scene.getObjectByName('infinite_possibilities_screen_4');
        document.getElementById("fourviewer").style.visibility = "hidden";
        enterSlideModeHTML();
    }) 
    document.getElementById("slide3a").src = slideDecks[slideIndices['infinite_possibilities_screen_005']][0];
    document.getElementById("slide3a").addEventListener('click', function( event ){
        slideMesh = scene.getObjectByName('infinite_possibilities_screen_005');
        document.getElementById("sixviewer").style.visibility = "hidden";
        enterSlideModeHTML();
    })
    document.getElementById("slide6a").src = slideDecks[slideIndices['infinite_possibilities_screen_006']][0];
    document.getElementById("slide6a").addEventListener('click', function( event ){
        slideMesh = scene.getObjectByName('infinite_possibilities_screen_006');
        document.getElementById("fourviewer").style.visibility = "hidden";
        enterSlideModeHTML();
    }) 
}

function incrementSlide(){
    changeSlideHTML(true);
}
function decreaseSlide(){
    changeSlideHTML(false);
}
function changeSlideHTML(plus){
    if(plus){
        if(currentSlide<(slides.length-1)){
            currentSlide++;
        }
    }
    else{
        if(currentSlide>0){
            currentSlide--;
        }
    }
    updateSlideScreenHTML();
}

function addListeners(){
    document.getElementById("nextbutton").addEventListener('click', incrementSlide)
    document.getElementById("nextbutton").addEventListener('mouseover',  function( event ) {
        document.getElementById("nextbutton").src = './exports/buttons/nextbblack.jpg' 
        
    })
    document.getElementById("nextbutton").addEventListener('mouseout',  function( event ) {
        document.getElementById("nextbutton").src = './exports/buttons/nextb.jpg' 
        
    })
    document.getElementById("backbutton").addEventListener('click', decreaseSlide)
    document.getElementById("backbutton").addEventListener('mouseover',  function( event ) {
        document.getElementById("backbutton").src = './exports/buttons/backbblack.jpg' 
        
    })
    document.getElementById("backbutton").addEventListener('mouseout',  function( event ) {
        document.getElementById("backbutton").src = './exports/buttons/backb.jpg' 
        
    })
    document.getElementById("contactbutton").addEventListener('click', contactPerson)
    document.getElementById("slidexbutton").addEventListener('click', exitSlideModeHTML)
    document.getElementById("fourslidexbutton").addEventListener('click', exitSlideModeHTML)
    document.getElementById("sixslidexbutton").addEventListener('click', exitSlideModeHTML)
}

function updateSlideScreenHTML(){
    console.log('slide is ' + currentSlide)
    document.getElementById("slide").src = slides[currentSlide];
    var nm = true;
    var bm = true;
    var cm = false;
    if(currentSlide==slides.length-1){
        nm = false;
        bm = true;
    }
    if(currentSlide==0){
        nm = true;
        bm = false;
        cm = false;
    }
    if(currentSlide == slides.length - Math.min((1+contactSlides[slideMesh.name]), 3)||(currentSlide==2)&&slideMesh.name=='infinite_possibilities_screen_3'){
        console.log('contact')
        cm = true;
        var cmpos = htmlpos[slidePos[slideMesh.name]];
        console.log("left is " + cmpos[0] + " top is " + (window.innerWidth/1280));
        document.getElementById("contactbutton").style.left = cmpos[0] + "%"
        document.getElementById("contactbutton").style.top = 50+(cmpos[1]-50)*(window.innerWidth/1280) + "%"
    }

    if(nm){
        document.getElementById("nextbutton").style.visibility = "visible"
    }
    else{
        document.getElementById("nextbutton").style.visibility = "hidden"
    }
    if(bm){
        document.getElementById("backbutton").style.visibility = "visible"
    }
    else{
        document.getElementById("backbutton").style.visibility = "hidden"
    }
    if(cm){
        document.getElementById("contactbutton").style.visibility = "visible"
    }
    else{
        document.getElementById("contactbutton").style.visibility = "hidden"
    }
}

function contactPerson(){
    var maillink = 'mailto:' + contactEmails[slideMesh.name];
    if(slideMesh.name=='infinite_possibilities_screen_3'&&currentSlide==3){
        maillink = 'mailto:Juan.Uro@parthenon.ey.com, edwina.fitzmaurice@ey.com';
    }
    window.open(maillink , '_blank');
}

function updateSlideScreen(){
    Slide_screen.material = slides[currentSlide];
}



function loadSlideButtons(){
    //Add buttons
    const backTexture = textureLoader.load('./exports/buttons/backb.png')
    const nextTexture = textureLoader.load('./exports/buttons/nextb.png')
    const xTexture = textureLoader.load('./exports/buttons/xbutton.png')
    const contactTexture = textureLoader.load('./exports/buttons/contactbutton.jpg')
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

        const contact_plane = new THREE.BoxGeometry(0.2, 0.1, 0.01);
        //next_plane.translate(0.55, 0, 0)
        const contact_plane_material = new THREE.MeshBasicMaterial({ map: contactTexture })
        contact_mesh = new THREE.Mesh(contact_plane, contact_plane_material)
    
        scene.add(back_mesh)
        scene.add(next_mesh)
        scene.add(x_mesh)
        scene.add(contact_mesh)
        back_mesh.visible = false;
        next_mesh.visible = false;
        x_mesh.visible = false;
        contact_mesh.visible = false;
       

}

function exitSlideMode(){
    switchCamera(true);
    for(var i = 0; i < SplitScreens.length; i++){
        SplitScreens[i].visible = true;
    }
    console.log("EXITED SLIDE MODE")
    next_mesh.visible = false;
    back_mesh.visible = false;
    x_mesh.visible = false;
    contact_mesh.visible = false;
    slideMode = false;
    actualSlideMode = false;
    document.getElementById("return").style.visibility = "visible";
    document.getElementById("controlbutton").style.visibility = "visible";
    document.getElementById("controller").style.visibility = "visible";
    ResetSlide();
    

}

function ResetSlide(){
    //updateSlideScreen();
    slideMesh.material = slides[0];
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
            showButton();
        }
}

function showButton(){
    if(spun&&modelsloaded&&soundsadded>=soundsToAdd){
        document.getElementById("EnterButton").style.visibility = "visible";
        document.getElementById("loadingBar").style.visibility = "hidden";
        document.getElementById("loadingbackground").style.visibility = "hidden";
    }
}

function beginScene(){
    if(spun&&modelsloaded){

        addGlobalSounds();
        loaded = true;
        const _euler = new Euler( 0, -Math.PI/2, 0, 'YXZ' );
            camera.quaternion.setFromEuler( _euler );
        camera.position.set(-26.5, 1.5, -1.35);
            var load = document.getElementById("loadingScreen");
            load.style.display = "none";
            var threecanvas = document.getElementById("three");
            threecanvas.style.visibility = "visible"
            var controller = document.getElementById("controller");
            controller.style.visibility = "visible";
            var mapButton = document.getElementById("return");
            mapButton.style.visibility = "visible";
            mapButton.addEventListener('click', warpToMap);
            var controlbutton = document.getElementById("controlbutton");
            controlbutton.style.visibility = "visible";
            controlbutton.addEventListener('click', showControls)
            var xbutton = document.getElementById("xbutton");
            xbutton.addEventListener('click', closeControls);

            /*
            for(var i = 0; i < videos.length; i++){
                videos[i].play();
            }
            console.log(sounds)
            console.log("length " + sounds.length)
            for(var i = 0; i < sounds.length; i++){
                console.log(sounds[i])
                sounds[i].play();
            }
            */
           //Autoplaying videos
           //Highlights
           if(browser!='Edge'){
           videos[1].play();
           sounds[1].play();

           videos[4].play();
           videos[5].play();
           }
            
            
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

function addSound(mesh, name){
    var sound = new THREE.PositionalAudio( listener );

    // load a sound and set it as the PositionalAudio object's buffer
    const audioLoader = new THREE.AudioLoader();
    console.log("video sound " + videosounds[mesh.name]);
    console.log(mesh.name)
    audioLoader.load( './exports/sounds/' + videosounds[mesh.name], function( buffer ) {
	sound.setBuffer( buffer );
	sound.setVolume(0.4)
    sound.setDistanceModel("exponential");
    sound.setRefDistance( 5 );
    sound.setRolloffFactor( 4 );
    sounds[videoindexes[mesh.name]] = sound;
    soundsadded++;
    showButton();
    

    
});

mesh.add(sound)
}

function addGlobalSounds(){
    const sound = new THREE.Audio( listener );


// load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( './exports/sounds/crowd-2.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.005 );
	sound.play();
});
    const sound2 = new THREE.Audio( listener );
    audioLoader.load( './exports/sounds/IRVerse2.mp3', function( buffer ) {
	sound2.setBuffer( buffer );
	sound2.setLoop( true );
	sound2.setVolume( 0.01 );
	sound2.play();
});

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
        //console.log("glowing " + TZmaps[i].name);
    }
    for(var i = 0; i < SplitScreens.length; i++){
        let curCol = new THREE.Color();
        curCol.lerpColors(whiteColor, new THREE.Color(0x00000), intcolor)
        SplitScreens[i].material.emissive = curCol;
        //console.log("glowing " + TZmaps[i].name);
    }
    for(var i = 0; i < VideoScreensGlow.length; i++){
        //if(browser=="Edge"){
        let curCol = new THREE.Color();
        curCol.lerpColors(whiteColor, new THREE.Color(0x00000), intcolor)
        VideoScreensGlow[i].material.emissive = curCol;
        //}
        //console.log("glowing " + TZmaps[i].name);
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
    //determine distance from center of circle
    var cx = window.innerWidth*(0.05+0.15/2)
    var cy = window.innerHeight*0.05 + window.innerWidth*(0.15/2)
    var dist = Math.sqrt(Math.pow(xpos-cx, 2) + Math.pow(ypos-cy, 2))
    if(dist<window.innerWidth*(0.15/2)){
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
    else if(name.includes("TZ_wall_monitors_")||name.includes("TZ_pillar_monitors_")||name.includes("TZ_blockchain_")||name.includes("Purple_pod_screen_")||name.includes("IZ_screen")||name.includes("infinite_possibilities_screen")||name.includes("CR_2035_screen")||name=="Forum_Screens_2"||name.includes('Market_waterfall_screen_Gil')){        
        if(name.includes('CR_2035_screen_frame')){
            return null;
        }
        //var deck = slideDecks[slideIndices[name]];
        var slide = firstSlides[slideIndices[name]];
        //return (deck[0]);
        return slide;
    }
    else if(name.includes("Slide_screen")){
        const bakedMaterial = new THREE.MeshStandardMaterial();
        return bakedMaterial;
    }
    //Videos
    else if(name.includes('Forum_Screens_1')||name.includes('Market_screens_01')||name.includes('Market_screens_02')){
        if(browser!='Edge'){
            var forumvideo = videos[videoindexes[name]];
            //forumvideo.play();
            var svideotexture = new THREE.VideoTexture( forumvideo );
            var svideomaterial = new THREE.MeshBasicMaterial( { map: svideotexture } );
            //videos.push(forumvideo);
            
            return svideomaterial;
        }
        else{
            if(name=='Market_screens_01'){
                return makeTexture('./exports/textures/Market1Still3.jpg');
            }
            else if(name=='Market_screens_02'){
                return makeTexture('./exports/textures/Market2Still3.jpg');
            }
            else if(name=='Forum_Screens_1'){
                return makeLambertTexture('./exports/textures/HighlightsPlay.jpg');
            }
        }
    }
    else if(name.includes('ey_verse_screen')||name.includes('Forum_Screens_3')||name.includes('Market_waterfall_screen_AI')||name.includes('SpeakEasy_screen')||name.includes('VR_Bar_screens04')||name.includes('VR_Bar_screens03')){
        if(name.includes('SpeakEasy_screen_frame')){
            return null;
        }
        texturename = 'exports/textures/' + playtextures[name];
        console.log(name)
        console.log(texturename)
        const bakedMaterial = makeLambertTexture(texturename);
        return bakedMaterial;

    }

    else if(name.includes('ey_verse_screen')){
        if(browser!='Edge'){

        console.log("EY VIDEO")
        var video = document.getElementById( 'video' );
            //video.play();
            videotexture = new THREE.VideoTexture( video );
            videomaterial = new THREE.MeshBasicMaterial( { map: videotexture } );
            videos.push(video);
            return videomaterial;
        } else{
            texturename = 'exports/textures/EYVersePlayTexture.jpg'
            const bakedTexture = textureLoader.load(texturename)
            bakedTexture.flipY = false;
            bakedTexture.encoding = THREE.sRGBEncoding
            const bakedMaterial = new THREE.MeshLambertMaterial({ map: bakedTexture })
            bakedMaterial.side = THREE.DoubleSide;
            //console.log("found texturename" + texturename);
            return bakedMaterial;
        }
        
          
    }

    return null;
    console.log("didn't find" + name)
}

function beginVideo(mesh){
    console.log("video mesh is " + mesh)
    var video = videos[videoindexes[mesh.name]]
    var svideotexture = new THREE.VideoTexture( video );
    var svideomaterial = new THREE.MeshBasicMaterial( { map: svideotexture } );
    mesh.material = svideomaterial;
    video.play();
    console.log("before " + VideoScreensGlow.toString());
    for(var i = 0; i < VideoScreensGlow.length; i++){
        console.log(VideoScreensGlow[i].name)
    }
    if(VideoScreensGlow.includes(mesh)){
        VideoScreensGlow.splice(VideoScreensGlow.indexOf(mesh), 1);
    }
    console.log("after " + VideoScreensGlow.toString());
    for(var i = 0; i < VideoScreensGlow.length; i++){
        console.log(VideoScreensGlow[i].name)
    }
    sounds[videoindexes[mesh.name]].play();
}

function loadVideos(){

    videos.push(document.getElementById( 'eyverse' ));
    videos.push(document.getElementById( 'irhighlights' ));
    videos.push(document.getElementById( 'beatboxer' ));
    videos.push(document.getElementById( 'robot' ));
    videos.push(document.getElementById( 'market1' ));
    videos.push(document.getElementById( 'market2' ));

}

function addInteract(bakedMesh){
    var name = bakedMesh.name;
    //Standard monitors
    if(name.includes("TZ_wall_monitors_")||name.includes("TZ_pillar_monitors_")||name.includes("TZ_blockchain_")||name.includes('CR_2035_screen')||name=='Forum_Screens_2'||name.includes('Market_waterfall_screen_Gil')){
        if(!name.includes('CR_2035_screen_frame')){
            TZmaps.push(bakedMesh);
        }
        
        
    }
    //Split monitors
    else if(name.includes('IZ_screen')||name.includes("Purple_pod_screen")||name.includes("infinite_possibilities_screen")){
        SplitScreens.push(bakedMesh);
        if(name.includes("IZ_screen_main")){
            IZMainScreen = bakedMesh;
            MainScreens.push(IZMainScreen);
        }
        if(name.includes("Purple_pod_screen_main")){
            PurpleMainScreen = bakedMesh;
            MainScreens.push(PurpleMainScreen);
        }
        if(name.includes("infinite_possibilities_screen_main")){
            SpaceMainScreen = bakedMesh;
            MainScreens.push(SpaceMainScreen);
        }
    }
    else if(name.includes("Slide_screen")){
        Slide_screen = bakedMesh;
    }
    else if(name.includes('IZ_map_button_')){
        //bakedMesh.material = makeSpecialMaterial(bakedMesh.name);
        mapButtons.push(bakedMesh)
        //console.log("map button")
    }
    else if(name.includes('Line001')){
        bakedMesh.visible = false;
        collision = bakedMesh;
        
    }
    else if(name.includes('ey_verse_screen')||name.includes('Forum_Screens_1')||name.includes('Forum_Screens_3')||name.includes('Market_waterfall_screen_AI')||name.includes('SpeakEasy_screen')||name.includes('VR_Bar_screens04')||name.includes('VR_Bar_screens03')){
        if(name.includes('SpeakEasy_screen_frame')){
            return null;
        }
        
        VideoScreens.push(bakedMesh);
        if(!(name.includes('Forum_Screens_1')&&browser!='Edge')){
            //if(!(name.includes('Market_waterfall_screen_AI')||name.includes('SpeakEasy_screen'))){
                VideoScreensGlow.push(bakedMesh);
            //}
            console.log("glow name " + name);
        }
        if(browser!='Edge'){
            if(!(name.includes('Forum_Screens_3')||name.includes('VR_Bar_screens04')||name.includes('VR_Bar_screens03'))){
                addSound(bakedMesh);
            }
        }
        else{
            soundsadded++;
        }
    }

}

function enterClick(){
    console.log("click!")
    beginScene();
}

function warpToMap(){
    camera.position.x = -16.82363656182083;
    camera.position.z = -0.37317274066446193;
    const neuler = new Euler( 0, -Math.PI, 0, 'YXZ' );
    camera.quaternion.setFromEuler(neuler);
    buttonClicked = true;
}

function showControls(){
    document.getElementById("controldisplay").style.visibility = "visible";
    document.getElementById("xbutton").style.visibility = "visible";
    document.getElementById("return").style.visibility = "hidden";
    document.getElementById("controlbutton").style.visibility = "hidden";
    document.getElementById("controller").style.visibility = "hidden";
    controlShowMode = true;
    buttonClicked = true;
}

function closeControls(){
    document.getElementById("controldisplay").style.visibility = "hidden";
    document.getElementById("xbutton").style.visibility = "hidden";
    document.getElementById("return").style.visibility = "visible";
    document.getElementById("controlbutton").style.visibility = "visible";
    document.getElementById("controller").style.visibility = "visible";
    controlShowMode = false;
    buttonClicked = true;
}