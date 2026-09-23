import * as THREE from './three.module.min.js';
import { GLTFLoader } from './GLTFLoader.js';

const world = document.getElementById('world');
if (!world) throw new Error('3D world container missing');

const canvas = document.createElement('canvas');
canvas.id = 'game3dCanvas';
canvas.setAttribute('aria-hidden', 'true');
world.prepend(canvas);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
world.classList.add('webgl-ready');
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
camera.position.set(1.1, 5.4, 13.6);
camera.lookAt(0, 0.3, 0);

scene.add(new THREE.HemisphereLight(0xa9dfff, 0x071020, 2.2));
const key = new THREE.DirectionalLight(0xffe1a2, 4.1);
key.position.set(-4, 7, 7); key.castShadow = true;
key.shadow.mapSize.set(1024, 1024); scene.add(key);
const rim = new THREE.PointLight(0x27d9ff, 22, 18);
rim.position.set(5, 2.4, 1); scene.add(rim);

const mats = {
  stone: new THREE.MeshStandardMaterial({ color: 0x1ad5ee, transparent:true, opacity:.055, depthWrite:false, metalness: .2, roughness: .45 }),
  stone2: new THREE.MeshStandardMaterial({ color: 0xdfff54, transparent:true, opacity:.15, depthWrite:false, metalness: .15, roughness: .4 }),
  edge: new THREE.MeshStandardMaterial({ color: 0x56e8ff, transparent:true, opacity:.38, depthWrite:false, emissive:0x0a8ca8, emissiveIntensity:.7, metalness: .4, roughness: .25 }),
  cyan: new THREE.MeshStandardMaterial({ color: 0x00a7cb, metalness: .35, roughness: .28, emissive: 0x003b50, emissiveIntensity: .8 }),
  gold: new THREE.MeshStandardMaterial({ color: 0xd69a2b, metalness: .9, roughness: .2 }),
  black: new THREE.MeshStandardMaterial({ color: 0x080b12, metalness: .48, roughness: .2 }),
  white: new THREE.MeshStandardMaterial({ color: 0xf2f3ef, roughness: .58 }),
  navy: new THREE.MeshStandardMaterial({ color: 0x07182d, metalness: .24, roughness: .31 }),
  eye: new THREE.MeshStandardMaterial({ color: 0x1ce3d1, emissive: 0x075c59, emissiveIntensity: 1.1, roughness: .18 }),
  pink: new THREE.MeshStandardMaterial({ color: 0xc9797d, roughness: .6 }),
};

const bridge = new THREE.Group();
bridge.position.set(0, 0, 0);
scene.add(bridge);
const tiles = new Map();

function numberTexture(value) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d'); x.clearRect(0, 0, 128, 128);
  x.font = '900 58px system-ui'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.strokeStyle = 'rgba(0,8,24,.9)'; x.lineWidth = 10; x.strokeText(String(value), 64, 67);
  x.fillStyle = value === 0 ? '#ddff54' : '#f6fbff'; x.fillText(String(value), 64, 67);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function routePoint(value) {
  const u = (value + 10) / 20;
  const x = THREE.MathUtils.lerp(-5.15, 7.0, u);
  const y = THREE.MathUtils.lerp(-1.72, .85, u) + Math.sin(u * Math.PI) * .08;
  const z = THREE.MathUtils.lerp(.72, -.78, u);
  return new THREE.Vector3(x, y, z);
}

for (let value = -10; value <= 10; value++) {
  const point = routePoint(value);
  const tile = new THREE.Group(); tile.position.copy(point); tile.userData.value = value;
  const u=(value+10)/20, perspective=THREE.MathUtils.lerp(1.08,.70,u);
  tile.scale.setScalar(perspective);
  const block = new THREE.Mesh(new THREE.BoxGeometry(.48, .055, .78), value === 0 ? mats.stone2 : mats.stone);
  block.castShadow = block.receiveShadow = true; tile.add(block);
  const trim = new THREE.Mesh(new THREE.BoxGeometry(.51, .018, .82), mats.edge);
  trim.position.y = -.035; tile.add(trim);
  const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: numberTexture(value), transparent: true, depthTest: false }));
  label.scale.set(.36, .36, 1); label.position.set(0, .12, 0); tile.add(label);
  bridge.add(tile); tiles.set(value, { group: tile, block, label });
}

const rail = new THREE.Mesh(new THREE.BoxGeometry(11.7, .05, .05), mats.gold);
rail.visible=false; rail.position.set(0, .58, .66); bridge.add(rail);
for (let i = -10; i <= 10; i += 2) {
  const post = new THREE.Mesh(new THREE.CylinderGeometry(.035, .05, .72, 10), mats.gold); post.visible=false;
  const p = routePoint(i); post.position.set(p.x, .30 + p.y, .66 + p.z); bridge.add(post);
}

function mesh(geo, mat, position, scale, parent) {
  const m = new THREE.Mesh(geo, mat); m.position.set(...position); m.scale.set(...scale);
  m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
}

// A true joint hierarchy: every visible part is attached to an animated THREE.Bone.
const catRoot = new THREE.Bone();
const hips = new THREE.Bone(); hips.position.y = .47; catRoot.add(hips);
const spine = new THREE.Bone(); spine.position.y = .48; hips.add(spine);
const headBone = new THREE.Bone(); headBone.position.y = .63; spine.add(headBone);
const legL = new THREE.Bone(), legR = new THREE.Bone();
legL.position.set(-.22, .06, 0); legR.position.set(.22, .06, 0); hips.add(legL, legR);
const armL = new THREE.Bone(), armR = new THREE.Bone();
armL.position.set(-.43, .48, 0); armR.position.set(.43, .48, 0); spine.add(armL, armR);
const tail1 = new THREE.Bone(), tail2 = new THREE.Bone();
tail1.position.set(0, .18, .18); tail2.position.set(0, .42, 0); hips.add(tail1); tail1.add(tail2);
scene.add(catRoot);

mesh(new THREE.SphereGeometry(.44, 24, 16), mats.navy, [0,.12,0], [1,.98,.72], spine);
mesh(new THREE.SphereGeometry(.42, 28, 18), mats.white, [0,.12,-.015], [1.14,1,.92], headBone);
mesh(new THREE.ConeGeometry(.17,.40,3), mats.white, [-.25,.43,0], [1,1,1], headBone).rotation.z = .10;
mesh(new THREE.ConeGeometry(.17,.40,3), mats.white, [.25,.43,0], [1,1,1], headBone).rotation.z = -.10;
mesh(new THREE.SphereGeometry(.065,16,10), mats.eye, [-.15,.17,.37], [1,.55,1.25], headBone);
mesh(new THREE.SphereGeometry(.065,16,10), mats.eye, [.15,.17,.37], [1,.55,1.25], headBone);
mesh(new THREE.ConeGeometry(.045,.07,3), mats.pink, [0,.05,.43], [1,1,1], headBone).rotation.x = Math.PI/2;

const hat = mesh(new THREE.CylinderGeometry(.28,.34,.48,24), mats.black, [0,.54,0], [1,1,1], headBone);
mesh(new THREE.CylinderGeometry(.46,.46,.07,24), mats.black, [0,.31,0], [1,1,1], headBone);
mesh(new THREE.CylinderGeometry(.345,.345,.10,24), mats.cyan, [0,.43,0], [1,1,1], headBone);
const bowL = mesh(new THREE.ConeGeometry(.14,.22,3), mats.cyan, [-.13,.38,.38], [1,1,1], spine); bowL.rotation.z = Math.PI/2;
const bowR = mesh(new THREE.ConeGeometry(.14,.22,3), mats.cyan, [.13,.38,.38], [1,1,1], spine); bowR.rotation.z = -Math.PI/2;
mesh(new THREE.SphereGeometry(.07,14,10), mats.gold, [0,.38,.42], [1,1,.65], spine);

for (const [bone, side] of [[legL,-1],[legR,1]]) {
  mesh(new THREE.CapsuleGeometry(.11,.40,5,10), mats.navy, [0,-.25,0], [1,1,1], bone);
  mesh(new THREE.BoxGeometry(.26,.16,.38), mats.black, [0,-.54,.08], [1,1,1], bone).rotation.x = -.08;
}
for (const [bone, side] of [[armL,-1],[armR,1]]) {
  const a = mesh(new THREE.CapsuleGeometry(.095,.38,5,10), mats.white, [0,-.23,0], [1,1,1], bone);
  a.rotation.z = side * .10; mesh(new THREE.SphereGeometry(.12,16,10), mats.white, [0,-.48,0], [1,1,1], bone);
}
mesh(new THREE.CapsuleGeometry(.11,.38,5,10), mats.white, [0,.22,0], [1,1,1], tail1).rotation.x = -.7;
mesh(new THREE.CapsuleGeometry(.10,.34,5,10), mats.white, [0,.20,0], [1,1,1], tail2).rotation.x = -.55;
const cane = mesh(new THREE.CylinderGeometry(.022,.022,.92,10), mats.gold, [.17,-.40,.12], [1,1,1], armR); cane.rotation.z = -.12;

catRoot.scale.setScalar(.86);
catRoot.rotation.y = -.22;
let characterRoot = catRoot, characterMixer = null;
let currentValue = 0, targetValue = 0, walking = false, targetGlow = null, startTime = performance.now(), previousTime = performance.now();

new GLTFLoader().load('./miao_baron.glb', gltf => {
  const model = gltf.scene;
  model.name = 'MiaoBaronGLB';
  model.scale.setScalar(.48);
  model.rotation.y = 0;
  model.userData.footOffset = .182;
  model.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  catRoot.visible = false;
  scene.add(model);
  characterRoot = model;
  placeCharacter(currentValue);
  if (gltf.animations.length) {
    characterMixer = new THREE.AnimationMixer(model);
    characterMixer.clipAction(gltf.animations[0]).play();
    characterMixer.timeScale = 0;
  }
  world.classList.add('glb-ready');
}, undefined, error => console.error('Miao Baron GLB failed to load', error));

const beacon = new THREE.Group(); beacon.visible = false; scene.add(beacon);
const ring = new THREE.Mesh(new THREE.TorusGeometry(.32,.035,10,40), new THREE.MeshBasicMaterial({ color:0xddff54, transparent:true, opacity:.9 }));
ring.rotation.x = Math.PI/2; beacon.add(ring);
const beam = new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,1.0,10), new THREE.MeshBasicMaterial({ color:0xddff54, transparent:true, opacity:.62 }));
beam.position.y=.5; beacon.add(beam);

function footPoint(value) {
  const p = routePoint(value).clone(); bridge.localToWorld(p); p.y += .10; return p;
}
function placeCharacter(value) {
  characterRoot.position.copy(footPoint(value));
  characterRoot.position.y -= characterRoot.userData.footOffset || 0;
}
function setTarget(value) {
  const p=footPoint(value); beacon.position.copy(p); beacon.visible=true;
  if (targetGlow) targetGlow.block.material = targetGlow.original;
  const t=tiles.get(value); if(t){ t.original=t.block.material; t.block.material=mats.cyan; targetGlow=t; }
}
function moveTo(value, immediate=false) {
  value=Math.max(-10,Math.min(10,Number(value))); targetValue=value; setTarget(value);
  if(immediate){currentValue=value; placeCharacter(value); walking=false;}
  else walking=true;
}
window.Yuanlai3D={ moveTo, setTarget, mark:setTarget };

function syncHitTargets(){
  document.querySelectorAll('.tick').forEach(t=>{
    const value=Number(t.dataset.value), p=footPoint(value).clone().project(camera);
    t.style.setProperty('--screen-x',`${(p.x*.5+.5)*100}%`);
    t.style.setProperty('--screen-y',`${(-p.y*.5+.5)*100}%`);
    t.addEventListener('pointerenter',()=>{const q=tiles.get(value);if(q&&!q.original){q.block.material=mats.stone2;}});
    t.addEventListener('pointerleave',()=>{const q=tiles.get(value);if(q&&!q.original)q.block.material=value===0?mats.stone2:mats.stone;});
  });
}

function resize(){
  const w=world.clientWidth,h=world.clientHeight; renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix(); syncHitTargets();
}
new ResizeObserver(resize).observe(world); resize(); moveTo(0,true);

function animate(now){
  requestAnimationFrame(animate); const t=(now-startTime)/1000;
  const dt=Math.min((now-previousTime)/1000,.05); previousTime=now;
  if(characterMixer){characterMixer.timeScale=walking?1.35:0;characterMixer.update(dt);}
  if(walking){
    const d=targetValue-currentValue, step=Math.sign(d)*Math.min(Math.abs(d),.065);
    currentValue+=step; if(Math.abs(d)<.07){currentValue=targetValue;walking=false;}
    placeCharacter(currentValue); characterRoot.rotation.y=THREE.MathUtils.lerp(characterRoot.rotation.y,step<0?.62:-.62,.16);
    if(characterRoot===catRoot){legL.rotation.z=Math.sin(t*12)*.55; legR.rotation.z=-legL.rotation.z; armL.rotation.z=-legL.rotation.z*.55; armR.rotation.z=legL.rotation.z*.55;}
    characterRoot.position.y+=Math.abs(Math.sin(t*12))*.018;
  } else {
    if(characterRoot===catRoot){legL.rotation.z*=.82;legR.rotation.z*=.82;armL.rotation.z*=.82;armR.rotation.z*=.82;
    headBone.rotation.z=Math.sin(t*1.7)*.035; tail1.rotation.z=Math.sin(t*2.2)*.20; tail2.rotation.z=Math.sin(t*2.2+.7)*.22;}
  }
  ring.rotation.z=t*1.5; ring.scale.setScalar(1+Math.sin(t*3)*.08);
  renderer.render(scene,camera);
}
requestAnimationFrame(animate);
