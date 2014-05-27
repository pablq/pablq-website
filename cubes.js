var WIDTH = 750,
    HEIGHT = 500;

var VIEW_ANGLE = 90,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1;
    FAR = 10000;

var $container = $("#container");

var renderer = new THREE.WebGLRenderer({alpha:true});
renderer.setSize(WIDTH, HEIGHT);
$container.append(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
                            VIEW_ANGLE,
                            ASPECT,
                            NEAR,
                            FAR);
camera.position.z = 250;
scene.add(camera);

var cubes = [];

var genNewCube = function(){
    var geo = new THREE.BoxGeometry(111,111,111);
    var mat = new THREE.MeshLambertMaterial({color:0x000000, opacity:1, transparent:true});
    var new_cube = new THREE.Mesh(geo, mat);
    if((Math.floor(Math.random() * 10))%2){
        new_cube.incX = true;
    } else {
        new_cube.incX = false;
    }
    if((Math.floor(Math.random() * 10))%2){
        new_cube.incY = true;
    } else {
        new_cube.incY = false;
    }
    if((Math.floor(Math.random() * 10))%2){
        new_cube.incZ = true;
    } else {
        new_cube.incZ = false;
    }
    return new_cube;
}

var randColor = function(anObject){
    var red = Math.random();
    var green = Math.random();
    var blue = Math.random();
    anObject.material.color.setRGB(red, green, blue);
    anObject.material.opacity += (Math.random()-.5)*.125;
    if(anObject.material.opacity < .3){
        anObject.material.opacity = .3;
    } else if(anObject.material.opacity > .8){
        anObject.material.opacity = .8;
    }
}

var randPos = function(anObject){
    var x = Math.floor(Math.random() * (375 - (-375) + 1)) - 375;
    var y = Math.floor(Math.random() * (250 - (-250) + 1)) - 250;
    var z = Math.floor(Math.random() * (-250 + 1));
    anObject.position.setX(x);
    anObject.position.setY(y);
    anObject.position.setZ(z);
}

var newLight = function(){
    var thisLight = new THREE.PointLight( 0xEFFAE5 );
    return thisLight;
}

var static_light = newLight();
static_light.intensity = 2;
static_light.position.z = 100;
scene.add(static_light);

var floating_light = newLight();
floating_light.intensity = .5;
var floating_light1 = newLight();
floating_light.intensity = .5;
scene.add(floating_light);
scene.add(floating_light1);

var pause = false;

$("body").keyup(function(event){
    if(event.keyCode == 32){
        pause = !pause;
    }
    if(event.keyCode == 220){
        scene.remove(cubes.pop());
    }
});

var h = $(window).height();
var w = $(window).width();
var half_h = h / 2;
var half_w = w / 2;

var convert_x = function(x){
    return x - half_w;
}

var convert_y = function(y){
    return half_h - y;
}

$("body").click(function(event){
    var cube = genNewCube();
    cube.position.x = convert_x(event.clientX);
    cube.position.y = convert_y(event.clientY);
    randColor(cube);
    scene.add(cube);
    cubes.push(cube);
});

var updatePos = function(anObject){
    var maxX = 375,
        minX = -375,
        maxY = 250,
        minY = -250,
        maxZ = 125,
        minZ = -300;
    if(anObject.position.x >= maxX || anObject.position.x <= minX){
        anObject.incX = !anObject.incX;
    }
    if(anObject.position.y >= maxY || anObject.position.y <= minY){
        anObject.incY = !anObject.incY;
    }
    if(anObject.position.z >= maxZ || anObject.position.z <= minZ){
        anObject.incZ = !anObject.incZ;
    }
    if(anObject.incX){
        anObject.position.x += .75;
    } else {
        anObject.position.x -= .75;
    }
    if(anObject.incY){
        anObject.position.y += .75;
    } else {
        anObject.position.y -= .75;
    }
    if(anObject.incZ){
        anObject.position.z += .75;
    } else {
        anObject.position.z -= .75;
    }
}

var texture, tmat, plane;
texture = THREE.ImageUtils.loadTexture("./texture.png");
tmat = new THREE.MeshLambertMaterial({ map : texture });
plane = new THREE.Mesh(new THREE.PlaneGeometry(2000,1500), tmat);
plane.position.z = -300;
plane.rotation.y = .025;
var p_mv = 0;
plane.mvrt = false;
var shift_p = function(){
    if(p_mv > 100){
        plane.mvrt = !plane.mvrt;
        p_mv = 0;
    }
    if(plane.mvrt){
        plane.rotation.y += 0.0005;
    } else {
        plane.rotation.y -= 0.0005;
    }
    p_mv++;
}
scene.add(plane);

var render = function(){
    requestAnimationFrame(render);
    if(!pause){
        var animationArray = cubes.slice();
        for(var i = 0, len = animationArray.length; i < len; i++){
            animationArray[i].rotation.x += 0.01;
            animationArray[i].rotation.y += 0.01;
            if(Math.floor((Math.random()*100)+1)%49===0){
                randColor(animationArray[i]);
            }
            updatePos(animationArray[i]);
        }
        updatePos(floating_light);
        updatePos(floating_light1);
        shift_p();
    }
    renderer.render(scene, camera);
}

render();
