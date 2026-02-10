/**
 * Generate Upper West Side Statues - HIGH DETAIL (250 primitives)
 * Testing rich detail: facial features, fingers, clothing folds, textures
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const MODELS_DIR = '/Users/alex/Documents/threedeehome/models';
const LOG_FILE = '/Users/alex/Documents/threedeehome/uws_high_generation.log';

// Marble colors
const COLORS = {
    light: '0xd8d4cc',
    medium: '0xd0ccc4',
    dark: '0xc8c4bc'
};

function log(msg) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${msg}`;
    console.log(line);
    fs.appendFileSync(LOG_FILE, line + '\n');
}

/**
 * Upper West Side Statues - HIGH DETAIL (~250 primitives each)
 */
const STATUES = {
    // #52 - The Herring Elder (HIGH DETAIL)
    herring_elder_high: {
        name: "The Herring Elder (High Detail)",
        geometry: () => `
// === BASE & LEGS ===
// Shoes
const shoeLGeo = new THREE.BoxGeometry(0.1, 0.04, 0.16);
const shoeLMesh = new THREE.Mesh(shoeLGeo, marbleMaterialDark);
shoeLMesh.position.set(-0.08, 0.02, 0.03);
group.add(shoeLMesh);

const shoeRGeo = new THREE.BoxGeometry(0.1, 0.04, 0.16);
const shoeRMesh = new THREE.Mesh(shoeRGeo, marbleMaterialDark);
shoeRMesh.position.set(0.08, 0.02, 0.03);
group.add(shoeRMesh);

// Ankles
const ankleLGeo = new THREE.CylinderGeometry(0.04, 0.045, 0.08, 10);
const ankleLMesh = new THREE.Mesh(ankleLGeo, marbleMaterial);
ankleLMesh.position.set(-0.08, 0.08, 0.02);
group.add(ankleLMesh);

const ankleRGeo = new THREE.CylinderGeometry(0.04, 0.045, 0.08, 10);
const ankleRMesh = new THREE.Mesh(ankleRGeo, marbleMaterial);
ankleRMesh.position.set(0.08, 0.08, 0.02);
group.add(ankleRMesh);

// Lower legs (calves)
const calfLGeo = new THREE.CylinderGeometry(0.05, 0.045, 0.25, 12);
const calfLMesh = new THREE.Mesh(calfLGeo, marbleMaterial);
calfLMesh.position.set(-0.08, 0.24, 0.01);
group.add(calfLMesh);

const calfRGeo = new THREE.CylinderGeometry(0.05, 0.045, 0.25, 12);
const calfRMesh = new THREE.Mesh(calfRGeo, marbleMaterial);
calfRMesh.position.set(0.08, 0.24, 0.01);
group.add(calfRMesh);

// Knees
const kneeLGeo = new THREE.SphereGeometry(0.05, 10, 10);
const kneeLMesh = new THREE.Mesh(kneeLGeo, marbleMaterial);
kneeLMesh.position.set(-0.08, 0.38, 0.02);
kneeLMesh.scale.set(1, 0.8, 0.9);
group.add(kneeLMesh);

const kneeRGeo = new THREE.SphereGeometry(0.05, 10, 10);
const kneeRMesh = new THREE.Mesh(kneeRGeo, marbleMaterial);
kneeRMesh.position.set(0.08, 0.38, 0.02);
kneeRMesh.scale.set(1, 0.8, 0.9);
group.add(kneeRMesh);

// Upper legs (thighs)
const thighLGeo = new THREE.CylinderGeometry(0.06, 0.055, 0.22, 12);
const thighLMesh = new THREE.Mesh(thighLGeo, marbleMaterial);
thighLMesh.position.set(-0.08, 0.5, 0);
group.add(thighLMesh);

const thighRGeo = new THREE.CylinderGeometry(0.06, 0.055, 0.22, 12);
const thighRMesh = new THREE.Mesh(thighRGeo, marbleMaterial);
thighRMesh.position.set(0.08, 0.5, 0);
group.add(thighRMesh);

// === TORSO ===
// Pelvis/hips
const pelvisGeo = new THREE.SphereGeometry(0.14, 14, 14);
const pelvisMesh = new THREE.Mesh(pelvisGeo, marbleMaterial);
pelvisMesh.position.set(0, 0.62, 0);
pelvisMesh.scale.set(1.1, 0.7, 0.85);
group.add(pelvisMesh);

// Lower belly
const bellyGeo = new THREE.SphereGeometry(0.13, 14, 14);
const bellyMesh = new THREE.Mesh(bellyGeo, marbleMaterial);
bellyMesh.position.set(0, 0.72, 0.02);
bellyMesh.scale.set(1, 0.9, 0.95);
group.add(bellyMesh);

// Ribcage
const ribcageGeo = new THREE.SphereGeometry(0.14, 14, 14);
const ribcageMesh = new THREE.Mesh(ribcageGeo, marbleMaterial);
ribcageMesh.position.set(0, 0.85, 0.01);
ribcageMesh.scale.set(1.05, 1.1, 0.9);
group.add(ribcageMesh);

// === CARDIGAN ===
// Cardigan body - open front
const cardiganBackGeo = new THREE.BoxGeometry(0.28, 0.4, 0.06);
const cardiganBackMesh = new THREE.Mesh(cardiganBackGeo, marbleMaterialDark);
cardiganBackMesh.position.set(0, 0.78, -0.08);
group.add(cardiganBackMesh);

// Cardigan left panel
const cardiganLGeo = new THREE.BoxGeometry(0.08, 0.4, 0.12);
const cardiganLMesh = new THREE.Mesh(cardiganLGeo, marbleMaterialDark);
cardiganLMesh.position.set(-0.12, 0.78, 0.02);
group.add(cardiganLMesh);

// Cardigan right panel
const cardiganRGeo = new THREE.BoxGeometry(0.08, 0.4, 0.12);
const cardiganRMesh = new THREE.Mesh(cardiganRGeo, marbleMaterialDark);
cardiganRMesh.position.set(0.12, 0.78, 0.02);
group.add(cardiganRMesh);

// Button-down shirt underneath (visible in V)
const shirtGeo = new THREE.BoxGeometry(0.14, 0.25, 0.02);
const shirtMesh = new THREE.Mesh(shirtGeo, marbleMaterialLight);
shirtMesh.position.set(0, 0.82, 0.08);
group.add(shirtMesh);

// Shirt buttons (6 buttons)
for (let i = 0; i < 6; i++) {
    const buttonGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.008, 8);
    const buttonMesh = new THREE.Mesh(buttonGeo, marbleMaterial);
    buttonMesh.position.set(0, 0.68 + i * 0.05, 0.09);
    buttonMesh.rotation.x = Math.PI / 2;
    group.add(buttonMesh);
}

// Cardigan collar
const collarLGeo = new THREE.BoxGeometry(0.04, 0.08, 0.06);
const collarLMesh = new THREE.Mesh(collarLGeo, marbleMaterialDark);
collarLMesh.position.set(-0.08, 0.98, 0.04);
collarLMesh.rotation.z = 0.2;
group.add(collarLMesh);

const collarRGeo = new THREE.BoxGeometry(0.04, 0.08, 0.06);
const collarRMesh = new THREE.Mesh(collarRGeo, marbleMaterialDark);
collarRMesh.position.set(0.08, 0.98, 0.04);
collarRMesh.rotation.z = -0.2;
group.add(collarRMesh);

// Cardigan pocket (left side)
const pocketGeo = new THREE.BoxGeometry(0.06, 0.06, 0.02);
const pocketMesh = new THREE.Mesh(pocketGeo, marbleMaterial);
pocketMesh.position.set(-0.1, 0.7, 0.07);
group.add(pocketMesh);

// === SHOULDERS & ARMS ===
// Shoulders
const shoulderLGeo = new THREE.SphereGeometry(0.065, 12, 12);
const shoulderLMesh = new THREE.Mesh(shoulderLGeo, marbleMaterialDark);
shoulderLMesh.position.set(-0.18, 0.95, 0);
group.add(shoulderLMesh);

const shoulderRGeo = new THREE.SphereGeometry(0.065, 12, 12);
const shoulderRMesh = new THREE.Mesh(shoulderRGeo, marbleMaterialDark);
shoulderRMesh.position.set(0.18, 0.95, 0);
group.add(shoulderRMesh);

// Upper arms
const upperArmLGeo = new THREE.CylinderGeometry(0.045, 0.05, 0.18, 12);
const upperArmLMesh = new THREE.Mesh(upperArmLGeo, marbleMaterialDark);
upperArmLMesh.position.set(-0.2, 0.85, 0.06);
upperArmLMesh.rotation.set(0.5, 0, 0.3);
group.add(upperArmLMesh);

const upperArmRGeo = new THREE.CylinderGeometry(0.045, 0.05, 0.18, 12);
const upperArmRMesh = new THREE.Mesh(upperArmRGeo, marbleMaterialDark);
upperArmRMesh.position.set(0.2, 0.85, 0.06);
upperArmRMesh.rotation.set(0.5, 0, -0.3);
group.add(upperArmRMesh);

// Elbows
const elbowLGeo = new THREE.SphereGeometry(0.04, 10, 10);
const elbowLMesh = new THREE.Mesh(elbowLGeo, marbleMaterialDark);
elbowLMesh.position.set(-0.22, 0.75, 0.12);
group.add(elbowLMesh);

const elbowRGeo = new THREE.SphereGeometry(0.04, 10, 10);
const elbowRMesh = new THREE.Mesh(elbowRGeo, marbleMaterialDark);
elbowRMesh.position.set(0.22, 0.75, 0.12);
group.add(elbowRMesh);

// Forearms
const forearmLGeo = new THREE.CylinderGeometry(0.035, 0.04, 0.16, 12);
const forearmLMesh = new THREE.Mesh(forearmLGeo, marbleMaterialDark);
forearmLMesh.position.set(-0.18, 0.68, 0.18);
forearmLMesh.rotation.set(0.9, 0, 0.2);
group.add(forearmLMesh);

const forearmRGeo = new THREE.CylinderGeometry(0.035, 0.04, 0.16, 12);
const forearmRMesh = new THREE.Mesh(forearmRGeo, marbleMaterialDark);
forearmRMesh.position.set(0.18, 0.68, 0.18);
forearmRMesh.rotation.set(0.9, 0, -0.2);
group.add(forearmRMesh);

// Wrists
const wristLGeo = new THREE.CylinderGeometry(0.025, 0.03, 0.05, 10);
const wristLMesh = new THREE.Mesh(wristLGeo, marbleMaterial);
wristLMesh.position.set(-0.12, 0.62, 0.22);
group.add(wristLMesh);

const wristRGeo = new THREE.CylinderGeometry(0.025, 0.03, 0.05, 10);
const wristRMesh = new THREE.Mesh(wristRGeo, marbleMaterial);
wristRMesh.position.set(0.12, 0.62, 0.22);
group.add(wristRMesh);

// === HANDS ===
// Left hand (supporting jar from below)
const palmLGeo = new THREE.BoxGeometry(0.06, 0.04, 0.07);
const palmLMesh = new THREE.Mesh(palmLGeo, marbleMaterial);
palmLMesh.position.set(-0.06, 0.55, 0.2);
palmLMesh.rotation.x = 0.3;
group.add(palmLMesh);

// Left fingers (4 fingers supporting)
for (let i = 0; i < 4; i++) {
    const fingerGeo = new THREE.CylinderGeometry(0.008, 0.01, 0.05, 8);
    const fingerMesh = new THREE.Mesh(fingerGeo, marbleMaterial);
    fingerMesh.position.set(-0.08 + i * 0.018, 0.52, 0.22);
    fingerMesh.rotation.x = 0.6;
    group.add(fingerMesh);
}

// Left thumb
const thumbLGeo = new THREE.CylinderGeometry(0.01, 0.012, 0.04, 8);
const thumbLMesh = new THREE.Mesh(thumbLGeo, marbleMaterial);
thumbLMesh.position.set(-0.1, 0.55, 0.18);
thumbLMesh.rotation.set(0.3, 0, 0.5);
group.add(thumbLMesh);

// Right hand (on top of jar lid)
const palmRGeo = new THREE.BoxGeometry(0.06, 0.03, 0.06);
const palmRMesh = new THREE.Mesh(palmRGeo, marbleMaterial);
palmRMesh.position.set(0.02, 0.78, 0.2);
palmRMesh.rotation.x = -0.2;
group.add(palmRMesh);

// Right fingers (resting on lid)
for (let i = 0; i < 4; i++) {
    const fingerGeo = new THREE.CylinderGeometry(0.008, 0.01, 0.04, 8);
    const fingerMesh = new THREE.Mesh(fingerGeo, marbleMaterial);
    fingerMesh.position.set(-0.01 + i * 0.016, 0.77, 0.24);
    fingerMesh.rotation.x = 0.8;
    group.add(fingerMesh);
}

// Right thumb
const thumbRGeo = new THREE.CylinderGeometry(0.01, 0.012, 0.035, 8);
const thumbRMesh = new THREE.Mesh(thumbRGeo, marbleMaterial);
thumbRMesh.position.set(0.06, 0.77, 0.18);
thumbRMesh.rotation.set(0.2, 0, -0.6);
group.add(thumbRMesh);

// === THE JAR ===
// Jar body (glass cylinder)
const jarBodyGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.28, 20);
const jarBodyMesh = new THREE.Mesh(jarBodyGeo, marbleMaterialLight);
jarBodyMesh.position.set(0, 0.62, 0.22);
group.add(jarBodyMesh);

// Jar bottom (thicker)
const jarBottomGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.03, 16);
const jarBottomMesh = new THREE.Mesh(jarBottomGeo, marbleMaterial);
jarBottomMesh.position.set(0, 0.49, 0.22);
group.add(jarBottomMesh);

// Jar lip/rim
const jarRimGeo = new THREE.TorusGeometry(0.1, 0.015, 8, 20);
const jarRimMesh = new THREE.Mesh(jarRimGeo, marbleMaterial);
jarRimMesh.position.set(0, 0.76, 0.22);
jarRimMesh.rotation.x = Math.PI / 2;
group.add(jarRimMesh);

// Jar lid
const jarLidGeo = new THREE.CylinderGeometry(0.07, 0.09, 0.04, 16);
const jarLidMesh = new THREE.Mesh(jarLidGeo, marbleMaterialDark);
jarLidMesh.position.set(0, 0.79, 0.22);
group.add(jarLidMesh);

// Lid grip ridges
for (let i = 0; i < 12; i++) {
    const ridgeGeo = new THREE.BoxGeometry(0.008, 0.035, 0.015);
    const ridgeMesh = new THREE.Mesh(ridgeGeo, marbleMaterialDark);
    const angle = (i / 12) * Math.PI * 2;
    ridgeMesh.position.set(
        Math.sin(angle) * 0.075,
        0.79,
        0.22 + Math.cos(angle) * 0.075
    );
    ridgeMesh.rotation.y = angle;
    group.add(ridgeMesh);
}

// === HERRING IN JAR ===
// 5 detailed herring
const herringData = [
    { pos: [0.03, 0.55, 0.24], rot: 0.2 },
    { pos: [-0.04, 0.58, 0.2], rot: -0.3 },
    { pos: [0.02, 0.64, 0.25], rot: 0.1 },
    { pos: [-0.02, 0.68, 0.19], rot: -0.15 },
    { pos: [0.04, 0.72, 0.22], rot: 0.25 }
];

herringData.forEach((fish, idx) => {
    // Fish body
    const fishBodyGeo = new THREE.SphereGeometry(0.025, 10, 10);
    const fishBodyMesh = new THREE.Mesh(fishBodyGeo, marbleMaterialDark);
    fishBodyMesh.position.set(...fish.pos);
    fishBodyMesh.scale.set(2, 0.5, 0.6);
    fishBodyMesh.rotation.y = fish.rot;
    group.add(fishBodyMesh);

    // Fish tail
    const tailGeo = new THREE.ConeGeometry(0.015, 0.03, 6);
    const tailMesh = new THREE.Mesh(tailGeo, marbleMaterialDark);
    tailMesh.position.set(fish.pos[0] - 0.04, fish.pos[1], fish.pos[2]);
    tailMesh.rotation.z = Math.PI / 2;
    tailMesh.scale.set(1, 1, 0.3);
    group.add(tailMesh);

    // Fish head
    const headGeo = new THREE.SphereGeometry(0.012, 8, 8);
    const headMesh = new THREE.Mesh(headGeo, marbleMaterialDark);
    headMesh.position.set(fish.pos[0] + 0.035, fish.pos[1], fish.pos[2]);
    group.add(headMesh);
});

// Brine liquid level line
const brineGeo = new THREE.TorusGeometry(0.09, 0.005, 6, 20);
const brineMesh = new THREE.Mesh(brineGeo, marbleMaterial);
brineMesh.position.set(0, 0.73, 0.22);
brineMesh.rotation.x = Math.PI / 2;
group.add(brineMesh);

// === NECK ===
const neckGeo = new THREE.CylinderGeometry(0.055, 0.07, 0.1, 12);
const neckMesh = new THREE.Mesh(neckGeo, marbleMaterial);
neckMesh.position.set(0, 1.02, 0.02);
neckMesh.rotation.x = 0.1;
group.add(neckMesh);

// Shirt collar
const shirtCollarLGeo = new THREE.BoxGeometry(0.03, 0.04, 0.04);
const shirtCollarLMesh = new THREE.Mesh(shirtCollarLGeo, marbleMaterialLight);
shirtCollarLMesh.position.set(-0.04, 0.99, 0.05);
shirtCollarLMesh.rotation.z = 0.3;
group.add(shirtCollarLMesh);

const shirtCollarRGeo = new THREE.BoxGeometry(0.03, 0.04, 0.04);
const shirtCollarRMesh = new THREE.Mesh(shirtCollarRGeo, marbleMaterialLight);
shirtCollarRMesh.position.set(0.04, 0.99, 0.05);
shirtCollarRMesh.rotation.z = -0.3;
group.add(shirtCollarRMesh);

// === HEAD ===
// Cranium
const craniumGeo = new THREE.SphereGeometry(0.1, 16, 16);
const craniumMesh = new THREE.Mesh(craniumGeo, marbleMaterial);
craniumMesh.position.set(0, 1.14, 0.02);
group.add(craniumMesh);

// Face plane (front of head, slightly flattened)
const faceGeo = new THREE.SphereGeometry(0.09, 14, 14);
const faceMesh = new THREE.Mesh(faceGeo, marbleMaterial);
faceMesh.position.set(0, 1.11, 0.06);
faceMesh.scale.set(0.9, 1, 0.5);
group.add(faceMesh);

// Brow ridge
const browGeo = new THREE.BoxGeometry(0.12, 0.02, 0.04);
const browMesh = new THREE.Mesh(browGeo, marbleMaterial);
browMesh.position.set(0, 1.15, 0.09);
group.add(browMesh);

// Eye sockets
const eyeSocketLGeo = new THREE.SphereGeometry(0.018, 10, 10);
const eyeSocketLMesh = new THREE.Mesh(eyeSocketLGeo, marbleMaterialDark);
eyeSocketLMesh.position.set(-0.03, 1.12, 0.1);
group.add(eyeSocketLMesh);

const eyeSocketRGeo = new THREE.SphereGeometry(0.018, 10, 10);
const eyeSocketRMesh = new THREE.Mesh(eyeSocketRGeo, marbleMaterialDark);
eyeSocketRMesh.position.set(0.03, 1.12, 0.1);
group.add(eyeSocketRMesh);

// Eyeballs
const eyeLGeo = new THREE.SphereGeometry(0.012, 10, 10);
const eyeLMesh = new THREE.Mesh(eyeLGeo, marbleMaterialLight);
eyeLMesh.position.set(-0.03, 1.12, 0.11);
group.add(eyeLMesh);

const eyeRGeo = new THREE.SphereGeometry(0.012, 10, 10);
const eyeRMesh = new THREE.Mesh(eyeRGeo, marbleMaterialLight);
eyeRMesh.position.set(0.03, 1.12, 0.11);
group.add(eyeRMesh);

// Pupils (looking down at jar with satisfaction)
const pupilLGeo = new THREE.SphereGeometry(0.005, 8, 8);
const pupilLMesh = new THREE.Mesh(pupilLGeo, marbleMaterialDark);
pupilLMesh.position.set(-0.03, 1.115, 0.122);
group.add(pupilLMesh);

const pupilRGeo = new THREE.SphereGeometry(0.005, 8, 8);
const pupilRMesh = new THREE.Mesh(pupilRGeo, marbleMaterialDark);
pupilRMesh.position.set(0.03, 1.115, 0.122);
group.add(pupilRMesh);

// Nose
const noseBridgeGeo = new THREE.BoxGeometry(0.025, 0.05, 0.03);
const noseBridgeMesh = new THREE.Mesh(noseBridgeGeo, marbleMaterial);
noseBridgeMesh.position.set(0, 1.09, 0.1);
group.add(noseBridgeMesh);

const noseTipGeo = new THREE.SphereGeometry(0.018, 10, 10);
const noseTipMesh = new THREE.Mesh(noseTipGeo, marbleMaterial);
noseTipMesh.position.set(0, 1.06, 0.12);
group.add(noseTipMesh);

// Nostrils
const nostrilLGeo = new THREE.SphereGeometry(0.006, 6, 6);
const nostrilLMesh = new THREE.Mesh(nostrilLGeo, marbleMaterialDark);
nostrilLMesh.position.set(-0.01, 1.055, 0.125);
group.add(nostrilLMesh);

const nostrilRGeo = new THREE.SphereGeometry(0.006, 6, 6);
const nostrilRMesh = new THREE.Mesh(nostrilRGeo, marbleMaterialDark);
nostrilRMesh.position.set(0.01, 1.055, 0.125);
group.add(nostrilRMesh);

// Cheeks
const cheekLGeo = new THREE.SphereGeometry(0.03, 10, 10);
const cheekLMesh = new THREE.Mesh(cheekLGeo, marbleMaterial);
cheekLMesh.position.set(-0.055, 1.07, 0.08);
cheekLMesh.scale.set(0.8, 0.7, 0.6);
group.add(cheekLMesh);

const cheekRGeo = new THREE.SphereGeometry(0.03, 10, 10);
const cheekRMesh = new THREE.Mesh(cheekRGeo, marbleMaterial);
cheekRMesh.position.set(0.055, 1.07, 0.08);
cheekRMesh.scale.set(0.8, 0.7, 0.6);
group.add(cheekRMesh);

// Mouth area
const upperLipGeo = new THREE.BoxGeometry(0.04, 0.01, 0.015);
const upperLipMesh = new THREE.Mesh(upperLipGeo, marbleMaterial);
upperLipMesh.position.set(0, 1.035, 0.11);
group.add(upperLipMesh);

const lowerLipGeo = new THREE.BoxGeometry(0.035, 0.012, 0.012);
const lowerLipMesh = new THREE.Mesh(lowerLipGeo, marbleMaterial);
lowerLipMesh.position.set(0, 1.025, 0.11);
group.add(lowerLipMesh);

// Gentle smile lines
const smileLineL = new THREE.CylinderGeometry(0.003, 0.003, 0.025, 6);
const smileLineLMesh = new THREE.Mesh(smileLineL, marbleMaterialDark);
smileLineLMesh.position.set(-0.025, 1.04, 0.1);
smileLineLMesh.rotation.z = 0.3;
group.add(smileLineLMesh);

const smileLineR = new THREE.CylinderGeometry(0.003, 0.003, 0.025, 6);
const smileLineRMesh = new THREE.Mesh(smileLineR, marbleMaterialDark);
smileLineRMesh.position.set(0.025, 1.04, 0.1);
smileLineRMesh.rotation.z = -0.3;
group.add(smileLineRMesh);

// Chin
const chinGeo = new THREE.SphereGeometry(0.025, 10, 10);
const chinMesh = new THREE.Mesh(chinGeo, marbleMaterial);
chinMesh.position.set(0, 1.01, 0.09);
chinMesh.scale.set(1, 0.8, 0.7);
group.add(chinMesh);

// Ears
const earLGeo = new THREE.SphereGeometry(0.025, 10, 10);
const earLMesh = new THREE.Mesh(earLGeo, marbleMaterial);
earLMesh.position.set(-0.1, 1.1, 0.01);
earLMesh.scale.set(0.4, 1, 0.7);
group.add(earLMesh);

const earRGeo = new THREE.SphereGeometry(0.025, 10, 10);
const earRMesh = new THREE.Mesh(earRGeo, marbleMaterial);
earRMesh.position.set(0.1, 1.1, 0.01);
earRMesh.scale.set(0.4, 1, 0.7);
group.add(earRMesh);

// Ear holes
const earHoleLGeo = new THREE.SphereGeometry(0.008, 6, 6);
const earHoleLMesh = new THREE.Mesh(earHoleLGeo, marbleMaterialDark);
earHoleLMesh.position.set(-0.1, 1.1, 0.02);
group.add(earHoleLMesh);

const earHoleRGeo = new THREE.SphereGeometry(0.008, 6, 6);
const earHoleRMesh = new THREE.Mesh(earHoleRGeo, marbleMaterialDark);
earHoleRMesh.position.set(0.1, 1.1, 0.02);
group.add(earHoleRMesh);

// === FLAT CAP ===
// Cap body
const capBodyGeo = new THREE.CylinderGeometry(0.11, 0.1, 0.04, 16);
const capBodyMesh = new THREE.Mesh(capBodyGeo, marbleMaterialDark);
capBodyMesh.position.set(0, 1.22, 0.02);
capBodyMesh.rotation.x = -0.15;
group.add(capBodyMesh);

// Cap top (puffed)
const capTopGeo = new THREE.SphereGeometry(0.1, 14, 14);
const capTopMesh = new THREE.Mesh(capTopGeo, marbleMaterialDark);
capTopMesh.position.set(0, 1.24, 0.01);
capTopMesh.scale.set(1, 0.35, 1);
group.add(capTopMesh);

// Cap brim (front)
const capBrimGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.015, 16, 1, false, -0.8, 1.6);
const capBrimMesh = new THREE.Mesh(capBrimGeo, marbleMaterialDark);
capBrimMesh.position.set(0, 1.21, 0.1);
capBrimMesh.rotation.x = -0.4;
group.add(capBrimMesh);

// Cap button on top
const capButtonGeo = new THREE.SphereGeometry(0.015, 8, 8);
const capButtonMesh = new THREE.Mesh(capButtonGeo, marbleMaterial);
capButtonMesh.position.set(0, 1.27, 0.01);
group.add(capButtonMesh);

// Cap seams (8 radial lines)
for (let i = 0; i < 8; i++) {
    const seamGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.1, 4);
    const seamMesh = new THREE.Mesh(seamGeo, marbleMaterial);
    const angle = (i / 8) * Math.PI * 2;
    seamMesh.position.set(
        Math.sin(angle) * 0.06,
        1.24,
        0.01 + Math.cos(angle) * 0.06
    );
    seamMesh.rotation.set(0.1, angle, Math.PI / 2);
    group.add(seamMesh);
}

// === WRINKLES/AGE DETAILS ===
// Forehead wrinkles (3 lines)
for (let i = 0; i < 3; i++) {
    const wrinkleGeo = new THREE.CylinderGeometry(0.002, 0.002, 0.06, 4);
    const wrinkleMesh = new THREE.Mesh(wrinkleGeo, marbleMaterialDark);
    wrinkleMesh.position.set(0, 1.17 + i * 0.012, 0.1);
    wrinkleMesh.rotation.z = Math.PI / 2;
    group.add(wrinkleMesh);
}

// Crow's feet (around eyes)
for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < 3; i++) {
        const crowGeo = new THREE.CylinderGeometry(0.002, 0.002, 0.015, 4);
        const crowMesh = new THREE.Mesh(crowGeo, marbleMaterialDark);
        crowMesh.position.set(side * 0.06, 1.12 + i * 0.01, 0.08);
        crowMesh.rotation.set(0, 0, side * (0.3 + i * 0.15));
        group.add(crowMesh);
    }
}
`
    },

    // #54 - The Pizza Dispute (HIGH DETAIL)
    pizza_dispute_high: {
        name: "The Pizza Dispute (High Detail)",
        geometry: () => `
// === GROUND/STREET ===
// Cobblestone ground base
const groundGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.03, 24);
const groundMesh = new THREE.Mesh(groundGeo, marbleMaterialDark);
groundMesh.position.set(0, 0.015, 0);
group.add(groundMesh);

// Cobblestone texture (multiple small stones)
for (let i = 0; i < 30; i++) {
    const stoneGeo = new THREE.BoxGeometry(0.08 + Math.random() * 0.04, 0.015, 0.08 + Math.random() * 0.04);
    const stoneMesh = new THREE.Mesh(stoneGeo, i % 3 === 0 ? marbleMaterial : marbleMaterialDark);
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 0.5;
    stoneMesh.position.set(Math.cos(angle) * dist, 0.025, Math.sin(angle) * dist);
    stoneMesh.rotation.y = Math.random() * 0.5;
    group.add(stoneMesh);
}

// === THE PIZZA SLICE ===
// Main slice body (triangular prism approximation)
const sliceGeo = new THREE.CylinderGeometry(0.01, 0.22, 0.025, 3);
const sliceMesh = new THREE.Mesh(sliceGeo, marbleMaterialLight);
sliceMesh.position.set(0, 0.06, 0);
sliceMesh.rotation.set(Math.PI / 2, 0.5, 0);
group.add(sliceMesh);

// Pizza sauce layer
const sauceGeo = new THREE.CylinderGeometry(0.008, 0.2, 0.008, 3);
const sauceMesh = new THREE.Mesh(sauceGeo, marbleMaterial);
sauceMesh.position.set(0, 0.075, 0);
sauceMesh.rotation.set(Math.PI / 2, 0.5, 0);
group.add(sauceMesh);

// Cheese layer (slightly melted looking)
const cheeseGeo = new THREE.CylinderGeometry(0.01, 0.19, 0.012, 3);
const cheeseMesh = new THREE.Mesh(cheeseGeo, marbleMaterialLight);
cheeseMesh.position.set(0, 0.08, 0);
cheeseMesh.rotation.set(Math.PI / 2, 0.5, 0);
group.add(cheeseMesh);

// Crust edge (thick curved edge)
const crustGeo = new THREE.TorusGeometry(0.2, 0.025, 8, 8, 0.6);
const crustMesh = new THREE.Mesh(crustGeo, marbleMaterial);
crustMesh.position.set(-0.08, 0.06, 0.15);
crustMesh.rotation.set(Math.PI / 2, 0, 2.3);
group.add(crustMesh);

// Pepperoni pieces (6 detailed)
const pepperoniPositions = [
    [0.08, 0.085, 0.02], [-0.02, 0.085, 0.06], [0.05, 0.085, -0.05],
    [-0.06, 0.085, -0.02], [0.12, 0.085, 0.06], [0.02, 0.085, 0.1]
];
pepperoniPositions.forEach(pos => {
    // Pepperoni disc
    const pepGeo = new THREE.CylinderGeometry(0.022, 0.024, 0.012, 12);
    const pepMesh = new THREE.Mesh(pepGeo, marbleMaterialDark);
    pepMesh.position.set(...pos);
    group.add(pepMesh);

    // Pepperoni curl/cup
    const curlGeo = new THREE.TorusGeometry(0.02, 0.004, 6, 12);
    const curlMesh = new THREE.Mesh(curlGeo, marbleMaterialDark);
    curlMesh.position.set(pos[0], pos[1] + 0.008, pos[2]);
    curlMesh.rotation.x = Math.PI / 2;
    group.add(curlMesh);
});

// Cheese drip/stretch (being pulled by rats)
const drip1Geo = new THREE.CylinderGeometry(0.008, 0.015, 0.12, 8);
const drip1Mesh = new THREE.Mesh(drip1Geo, marbleMaterialLight);
drip1Mesh.position.set(0.06, 0.1, 0.12);
drip1Mesh.rotation.set(-0.4, 0.2, 0.3);
group.add(drip1Mesh);

const drip2Geo = new THREE.CylinderGeometry(0.005, 0.012, 0.1, 8);
const drip2Mesh = new THREE.Mesh(drip2Geo, marbleMaterialLight);
drip2Mesh.position.set(-0.02, 0.1, -0.1);
drip2Mesh.rotation.set(0.5, 0, -0.2);
group.add(drip2Mesh);

// Grease puddle under slice
const greaseGeo = new THREE.CylinderGeometry(0.15, 0.18, 0.005, 16);
const greaseMesh = new THREE.Mesh(greaseGeo, marbleMaterial);
greaseMesh.position.set(0.02, 0.035, 0.02);
group.add(greaseMesh);

// === RAT 1 - THE CLAIMER (front paws on pizza) ===
// Body
const rat1BodyGeo = new THREE.SphereGeometry(0.055, 14, 14);
const rat1BodyMesh = new THREE.Mesh(rat1BodyGeo, marbleMaterial);
rat1BodyMesh.position.set(0.06, 0.1, 0.22);
rat1BodyMesh.scale.set(1.5, 0.9, 1);
group.add(rat1BodyMesh);

// Haunches
const rat1HaunchGeo = new THREE.SphereGeometry(0.04, 12, 12);
const rat1HaunchMesh = new THREE.Mesh(rat1HaunchGeo, marbleMaterial);
rat1HaunchMesh.position.set(0.08, 0.08, 0.28);
rat1HaunchMesh.scale.set(1.2, 1, 1);
group.add(rat1HaunchMesh);

// Head
const rat1HeadGeo = new THREE.SphereGeometry(0.035, 14, 14);
const rat1HeadMesh = new THREE.Mesh(rat1HeadGeo, marbleMaterial);
rat1HeadMesh.position.set(0.05, 0.12, 0.13);
rat1HeadMesh.scale.set(1, 0.9, 1.2);
group.add(rat1HeadMesh);

// Snout
const rat1SnoutGeo = new THREE.ConeGeometry(0.018, 0.05, 10);
const rat1SnoutMesh = new THREE.Mesh(rat1SnoutGeo, marbleMaterial);
rat1SnoutMesh.position.set(0.04, 0.11, 0.08);
rat1SnoutMesh.rotation.x = Math.PI / 2;
group.add(rat1SnoutMesh);

// Nose
const rat1NoseGeo = new THREE.SphereGeometry(0.008, 8, 8);
const rat1NoseMesh = new THREE.Mesh(rat1NoseGeo, marbleMaterialDark);
rat1NoseMesh.position.set(0.04, 0.11, 0.055);
group.add(rat1NoseMesh);

// Eyes
const rat1EyeLGeo = new THREE.SphereGeometry(0.008, 8, 8);
const rat1EyeLMesh = new THREE.Mesh(rat1EyeLGeo, marbleMaterialDark);
rat1EyeLMesh.position.set(0.035, 0.135, 0.12);
group.add(rat1EyeLMesh);

const rat1EyeRGeo = new THREE.SphereGeometry(0.008, 8, 8);
const rat1EyeRMesh = new THREE.Mesh(rat1EyeRGeo, marbleMaterialDark);
rat1EyeRMesh.position.set(0.06, 0.135, 0.12);
group.add(rat1EyeRMesh);

// Ears
const rat1EarLGeo = new THREE.SphereGeometry(0.018, 10, 10);
const rat1EarLMesh = new THREE.Mesh(rat1EarLGeo, marbleMaterialLight);
rat1EarLMesh.position.set(0.025, 0.15, 0.15);
rat1EarLMesh.scale.set(0.5, 1, 0.8);
group.add(rat1EarLMesh);

const rat1EarRGeo = new THREE.SphereGeometry(0.018, 10, 10);
const rat1EarRMesh = new THREE.Mesh(rat1EarRGeo, marbleMaterialLight);
rat1EarRMesh.position.set(0.07, 0.15, 0.15);
rat1EarRMesh.scale.set(0.5, 1, 0.8);
group.add(rat1EarRMesh);

// Inner ears (pink)
const rat1InnerEarLGeo = new THREE.SphereGeometry(0.01, 8, 8);
const rat1InnerEarLMesh = new THREE.Mesh(rat1InnerEarLGeo, marbleMaterial);
rat1InnerEarLMesh.position.set(0.025, 0.15, 0.155);
rat1InnerEarLMesh.scale.set(0.4, 0.8, 0.3);
group.add(rat1InnerEarLMesh);

const rat1InnerEarRGeo = new THREE.SphereGeometry(0.01, 8, 8);
const rat1InnerEarRMesh = new THREE.Mesh(rat1InnerEarRGeo, marbleMaterial);
rat1InnerEarRMesh.position.set(0.07, 0.15, 0.155);
rat1InnerEarRMesh.scale.set(0.4, 0.8, 0.3);
group.add(rat1InnerEarRMesh);

// Whiskers
for (let i = 0; i < 3; i++) {
    const whiskerLGeo = new THREE.CylinderGeometry(0.001, 0.001, 0.04, 4);
    const whiskerLMesh = new THREE.Mesh(whiskerLGeo, marbleMaterialLight);
    whiskerLMesh.position.set(0.02, 0.11 + i * 0.008, 0.07);
    whiskerLMesh.rotation.set(0, 0, 0.5 + i * 0.2);
    group.add(whiskerLMesh);

    const whiskerRGeo = new THREE.CylinderGeometry(0.001, 0.001, 0.04, 4);
    const whiskerRMesh = new THREE.Mesh(whiskerRGeo, marbleMaterialLight);
    whiskerRMesh.position.set(0.065, 0.11 + i * 0.008, 0.07);
    whiskerRMesh.rotation.set(0, 0, -0.5 - i * 0.2);
    group.add(whiskerRMesh);
}

// Front legs (on pizza)
const rat1FrontLLGeo = new THREE.CylinderGeometry(0.008, 0.01, 0.04, 8);
const rat1FrontLLMesh = new THREE.Mesh(rat1FrontLLGeo, marbleMaterial);
rat1FrontLLMesh.position.set(0.02, 0.09, 0.12);
rat1FrontLLMesh.rotation.set(0.6, 0, 0.3);
group.add(rat1FrontLLMesh);

const rat1FrontLRGeo = new THREE.CylinderGeometry(0.008, 0.01, 0.04, 8);
const rat1FrontLRMesh = new THREE.Mesh(rat1FrontLRGeo, marbleMaterial);
rat1FrontLRMesh.position.set(0.07, 0.09, 0.12);
rat1FrontLRMesh.rotation.set(0.6, 0, -0.3);
group.add(rat1FrontLRMesh);

// Front paws with toes
for (let paw = 0; paw < 2; paw++) {
    const pawX = paw === 0 ? 0.01 : 0.08;
    const pawGeo = new THREE.SphereGeometry(0.012, 8, 8);
    const pawMesh = new THREE.Mesh(pawGeo, marbleMaterial);
    pawMesh.position.set(pawX, 0.085, 0.09);
    pawMesh.scale.set(1.2, 0.6, 1.3);
    group.add(pawMesh);

    // Toes
    for (let t = 0; t < 4; t++) {
        const toeGeo = new THREE.SphereGeometry(0.004, 6, 6);
        const toeMesh = new THREE.Mesh(toeGeo, marbleMaterial);
        toeMesh.position.set(pawX - 0.01 + t * 0.007, 0.082, 0.075);
        group.add(toeMesh);
    }
}

// Back legs
const rat1BackLLGeo = new THREE.CylinderGeometry(0.012, 0.015, 0.05, 8);
const rat1BackLLMesh = new THREE.Mesh(rat1BackLLGeo, marbleMaterial);
rat1BackLLMesh.position.set(0.04, 0.06, 0.3);
rat1BackLLMesh.rotation.x = 0.2;
group.add(rat1BackLLMesh);

const rat1BackLRGeo = new THREE.CylinderGeometry(0.012, 0.015, 0.05, 8);
const rat1BackLRMesh = new THREE.Mesh(rat1BackLRGeo, marbleMaterial);
rat1BackLRMesh.position.set(0.12, 0.06, 0.3);
rat1BackLRMesh.rotation.x = 0.2;
group.add(rat1BackLRMesh);

// Tail (long, curved)
const rat1TailSegments = 8;
for (let i = 0; i < rat1TailSegments; i++) {
    const segRadius = 0.012 - i * 0.001;
    const tailSegGeo = new THREE.CylinderGeometry(segRadius, segRadius + 0.001, 0.035, 8);
    const tailSegMesh = new THREE.Mesh(tailSegGeo, marbleMaterial);
    const curve = i * 0.15;
    tailSegMesh.position.set(0.08 + i * 0.025, 0.08 + Math.sin(curve) * 0.02, 0.32 + i * 0.02);
    tailSegMesh.rotation.set(-0.2 + curve * 0.3, 0, 0.4 + i * 0.1);
    group.add(tailSegMesh);
}

// === RAT 2 - THE CHALLENGER (pulling from opposite side) ===
// Body
const rat2BodyGeo = new THREE.SphereGeometry(0.05, 14, 14);
const rat2BodyMesh = new THREE.Mesh(rat2BodyGeo, marbleMaterial);
rat2BodyMesh.position.set(-0.04, 0.09, -0.18);
rat2BodyMesh.scale.set(1.4, 0.85, 1);
group.add(rat2BodyMesh);

// Head (straining expression)
const rat2HeadGeo = new THREE.SphereGeometry(0.032, 14, 14);
const rat2HeadMesh = new THREE.Mesh(rat2HeadGeo, marbleMaterial);
rat2HeadMesh.position.set(-0.02, 0.1, -0.1);
rat2HeadMesh.scale.set(1, 0.9, 1.15);
group.add(rat2HeadMesh);

// Snout
const rat2SnoutGeo = new THREE.ConeGeometry(0.016, 0.045, 10);
const rat2SnoutMesh = new THREE.Mesh(rat2SnoutGeo, marbleMaterial);
rat2SnoutMesh.position.set(-0.01, 0.095, -0.06);
rat2SnoutMesh.rotation.x = Math.PI / 2;
group.add(rat2SnoutMesh);

// Nose
const rat2NoseGeo = new THREE.SphereGeometry(0.007, 8, 8);
const rat2NoseMesh = new THREE.Mesh(rat2NoseGeo, marbleMaterialDark);
rat2NoseMesh.position.set(-0.01, 0.095, -0.035);
group.add(rat2NoseMesh);

// Eyes (determined)
const rat2EyeLGeo = new THREE.SphereGeometry(0.007, 8, 8);
const rat2EyeLMesh = new THREE.Mesh(rat2EyeLGeo, marbleMaterialDark);
rat2EyeLMesh.position.set(-0.04, 0.115, -0.09);
group.add(rat2EyeLMesh);

const rat2EyeRGeo = new THREE.SphereGeometry(0.007, 8, 8);
const rat2EyeRMesh = new THREE.Mesh(rat2EyeRGeo, marbleMaterialDark);
rat2EyeRMesh.position.set(0, 0.115, -0.09);
group.add(rat2EyeRMesh);

// Ears
const rat2EarLGeo = new THREE.SphereGeometry(0.016, 10, 10);
const rat2EarLMesh = new THREE.Mesh(rat2EarLGeo, marbleMaterialLight);
rat2EarLMesh.position.set(-0.045, 0.13, -0.11);
rat2EarLMesh.scale.set(0.5, 1, 0.8);
group.add(rat2EarLMesh);

const rat2EarRGeo = new THREE.SphereGeometry(0.016, 10, 10);
const rat2EarRMesh = new THREE.Mesh(rat2EarRGeo, marbleMaterialLight);
rat2EarRMesh.position.set(0.01, 0.13, -0.11);
rat2EarRMesh.scale.set(0.5, 1, 0.8);
group.add(rat2EarRMesh);

// Front legs pulling
const rat2FrontLGeo = new THREE.CylinderGeometry(0.007, 0.009, 0.05, 8);
const rat2FrontLMesh = new THREE.Mesh(rat2FrontLGeo, marbleMaterial);
rat2FrontLMesh.position.set(-0.01, 0.08, -0.06);
rat2FrontLMesh.rotation.set(-0.8, 0, 0);
group.add(rat2FrontLMesh);

// Paws gripping cheese
const rat2PawGeo = new THREE.SphereGeometry(0.012, 8, 8);
const rat2PawMesh = new THREE.Mesh(rat2PawGeo, marbleMaterial);
rat2PawMesh.position.set(-0.01, 0.085, -0.03);
rat2PawMesh.scale.set(1.2, 0.5, 1.3);
group.add(rat2PawMesh);

// Back body
const rat2HaunchGeo = new THREE.SphereGeometry(0.035, 12, 12);
const rat2HaunchMesh = new THREE.Mesh(rat2HaunchGeo, marbleMaterial);
rat2HaunchMesh.position.set(-0.06, 0.07, -0.24);
group.add(rat2HaunchMesh);

// Tail
for (let i = 0; i < 6; i++) {
    const segRadius = 0.01 - i * 0.001;
    const tailSegGeo = new THREE.CylinderGeometry(segRadius, segRadius + 0.001, 0.03, 8);
    const tailSegMesh = new THREE.Mesh(tailSegGeo, marbleMaterial);
    tailSegMesh.position.set(-0.08 - i * 0.015, 0.065 + i * 0.01, -0.27 - i * 0.02);
    tailSegMesh.rotation.set(0.3, 0, -0.3 - i * 0.1);
    group.add(tailSegMesh);
}

// === RAT 3 - THE OPPORTUNIST (approaching from side) ===
// Body (smaller, sneaky)
const rat3BodyGeo = new THREE.SphereGeometry(0.045, 14, 14);
const rat3BodyMesh = new THREE.Mesh(rat3BodyGeo, marbleMaterialDark);
rat3BodyMesh.position.set(0.3, 0.07, 0.04);
rat3BodyMesh.scale.set(1.3, 0.8, 0.9);
group.add(rat3BodyMesh);

// Head (alert, watching)
const rat3HeadGeo = new THREE.SphereGeometry(0.028, 14, 14);
const rat3HeadMesh = new THREE.Mesh(rat3HeadGeo, marbleMaterialDark);
rat3HeadMesh.position.set(0.24, 0.08, 0.03);
rat3HeadMesh.scale.set(1, 0.9, 1.1);
group.add(rat3HeadMesh);

// Snout
const rat3SnoutGeo = new THREE.ConeGeometry(0.014, 0.04, 10);
const rat3SnoutMesh = new THREE.Mesh(rat3SnoutGeo, marbleMaterialDark);
rat3SnoutMesh.position.set(0.2, 0.075, 0.025);
rat3SnoutMesh.rotation.set(0, 0, Math.PI / 2);
group.add(rat3SnoutMesh);

// Nose
const rat3NoseGeo = new THREE.SphereGeometry(0.006, 8, 8);
const rat3NoseMesh = new THREE.Mesh(rat3NoseGeo, marbleMaterial);
rat3NoseMesh.position.set(0.178, 0.075, 0.025);
group.add(rat3NoseMesh);

// Eyes (beady, calculating)
const rat3EyeGeo = new THREE.SphereGeometry(0.006, 8, 8);
const rat3EyeMesh = new THREE.Mesh(rat3EyeGeo, marbleMaterialLight);
rat3EyeMesh.position.set(0.22, 0.092, 0.04);
group.add(rat3EyeMesh);

// Ears
const rat3EarGeo = new THREE.SphereGeometry(0.014, 10, 10);
const rat3EarMesh = new THREE.Mesh(rat3EarGeo, marbleMaterial);
rat3EarMesh.position.set(0.25, 0.1, 0.035);
rat3EarMesh.scale.set(0.5, 1, 0.8);
group.add(rat3EarMesh);

// Legs (crouched, ready to pounce)
const rat3FrontLGeo = new THREE.CylinderGeometry(0.006, 0.008, 0.03, 8);
const rat3FrontLMesh = new THREE.Mesh(rat3FrontLGeo, marbleMaterialDark);
rat3FrontLMesh.position.set(0.23, 0.055, 0.02);
rat3FrontLMesh.rotation.x = 0.3;
group.add(rat3FrontLMesh);

// Tail (tense, slightly raised)
for (let i = 0; i < 5; i++) {
    const segRadius = 0.008 - i * 0.001;
    const tailSegGeo = new THREE.CylinderGeometry(segRadius, segRadius + 0.001, 0.025, 8);
    const tailSegMesh = new THREE.Mesh(tailSegGeo, marbleMaterialDark);
    tailSegMesh.position.set(0.34 + i * 0.02, 0.07 + i * 0.008, 0.05);
    tailSegMesh.rotation.z = 0.5 + i * 0.05;
    group.add(tailSegMesh);
}

// === SCATTERED DEBRIS ===
// Crumbs around pizza
for (let i = 0; i < 12; i++) {
    const crumbGeo = new THREE.SphereGeometry(0.008 + Math.random() * 0.008, 6, 6);
    const crumbMesh = new THREE.Mesh(crumbGeo, marbleMaterialLight);
    const angle = Math.random() * Math.PI * 2;
    const dist = 0.2 + Math.random() * 0.15;
    crumbMesh.position.set(Math.cos(angle) * dist, 0.04, Math.sin(angle) * dist);
    group.add(crumbMesh);
}

// Fallen pepperoni (one that rolled away)
const fallenPepGeo = new THREE.CylinderGeometry(0.02, 0.022, 0.01, 12);
const fallenPepMesh = new THREE.Mesh(fallenPepGeo, marbleMaterialDark);
fallenPepMesh.position.set(-0.25, 0.04, 0.15);
fallenPepMesh.rotation.x = 0.8;
group.add(fallenPepMesh);
`
    },

    // #57 - The Vaping Barista (HIGH DETAIL)
    vaping_barista_high: {
        name: "The Vaping Barista (High Detail)",
        geometry: () => `
// === WALL (Background element) ===
// Brick wall texture
const wallBaseGeo = new THREE.BoxGeometry(0.9, 1.8, 0.1);
const wallBaseMesh = new THREE.Mesh(wallBaseGeo, marbleMaterialDark);
wallBaseMesh.position.set(0, 0.9, -0.18);
group.add(wallBaseMesh);

// Brick pattern (simplified rows)
for (let row = 0; row < 12; row++) {
    const offset = (row % 2) * 0.06;
    for (let col = 0; col < 5; col++) {
        const brickGeo = new THREE.BoxGeometry(0.15, 0.06, 0.02);
        const brickMesh = new THREE.Mesh(brickGeo, row % 3 === 0 ? marbleMaterial : marbleMaterialDark);
        brickMesh.position.set(-0.32 + col * 0.17 + offset, 0.15 + row * 0.14, -0.12);
        group.add(brickMesh);
    }
}

// === SHOES ===
// Left shoe (flat on ground)
const shoeLGeo = new THREE.BoxGeometry(0.09, 0.04, 0.15);
const shoeLMesh = new THREE.Mesh(shoeLGeo, marbleMaterialDark);
shoeLMesh.position.set(-0.08, 0.02, 0.05);
group.add(shoeLMesh);

// Left shoe sole
const soleLGeo = new THREE.BoxGeometry(0.1, 0.015, 0.16);
const soleLMesh = new THREE.Mesh(soleLGeo, marbleMaterial);
soleLMesh.position.set(-0.08, 0.008, 0.05);
group.add(soleLMesh);

// Right shoe (pressed against wall)
const shoeRGeo = new THREE.BoxGeometry(0.09, 0.15, 0.04);
const shoeRMesh = new THREE.Mesh(shoeRGeo, marbleMaterialDark);
shoeRMesh.position.set(0.08, 0.25, -0.1);
shoeRMesh.rotation.x = 0.2;
group.add(shoeRMesh);

// === LEGS ===
// Left leg (straight)
const legLGeo = new THREE.CylinderGeometry(0.045, 0.05, 0.5, 12);
const legLMesh = new THREE.Mesh(legLGeo, marbleMaterial);
legLMesh.position.set(-0.08, 0.29, 0.04);
group.add(legLMesh);

// Left knee
const kneeLGeo = new THREE.SphereGeometry(0.05, 10, 10);
const kneeLMesh = new THREE.Mesh(kneeLGeo, marbleMaterial);
kneeLMesh.position.set(-0.08, 0.42, 0.04);
kneeLMesh.scale.set(1, 0.8, 0.9);
group.add(kneeLMesh);

// Left thigh
const thighLGeo = new THREE.CylinderGeometry(0.055, 0.05, 0.25, 12);
const thighLMesh = new THREE.Mesh(thighLGeo, marbleMaterial);
thighLMesh.position.set(-0.08, 0.56, 0.02);
group.add(thighLMesh);

// Right leg (bent, foot on wall)
// Upper leg
const thighRGeo = new THREE.CylinderGeometry(0.055, 0.05, 0.2, 12);
const thighRMesh = new THREE.Mesh(thighRGeo, marbleMaterial);
thighRMesh.position.set(0.08, 0.52, -0.02);
thighRMesh.rotation.x = -0.5;
group.add(thighRMesh);

// Right knee
const kneeRGeo = new THREE.SphereGeometry(0.05, 10, 10);
const kneeRMesh = new THREE.Mesh(kneeRGeo, marbleMaterial);
kneeRMesh.position.set(0.08, 0.44, -0.08);
group.add(kneeRMesh);

// Right calf
const calfRGeo = new THREE.CylinderGeometry(0.04, 0.045, 0.18, 12);
const calfRMesh = new THREE.Mesh(calfRGeo, marbleMaterial);
calfRMesh.position.set(0.08, 0.34, -0.1);
calfRMesh.rotation.x = 0.6;
group.add(calfRMesh);

// === TORSO ===
// Pelvis
const pelvisGeo = new THREE.SphereGeometry(0.12, 14, 14);
const pelvisMesh = new THREE.Mesh(pelvisGeo, marbleMaterial);
pelvisMesh.position.set(0, 0.68, -0.01);
pelvisMesh.scale.set(1.1, 0.7, 0.9);
group.add(pelvisMesh);

// Core/belly
const coreGeo = new THREE.CylinderGeometry(0.11, 0.12, 0.2, 14);
const coreMesh = new THREE.Mesh(coreGeo, marbleMaterial);
coreMesh.position.set(0, 0.8, -0.02);
coreMesh.rotation.x = -0.1;
group.add(coreMesh);

// Chest
const chestGeo = new THREE.SphereGeometry(0.13, 14, 14);
const chestMesh = new THREE.Mesh(chestGeo, marbleMaterial);
chestMesh.position.set(0, 0.95, -0.03);
chestMesh.scale.set(1, 1.1, 0.85);
group.add(chestMesh);

// === APRON ===
// Main apron body
const apronGeo = new THREE.BoxGeometry(0.28, 0.45, 0.02);
const apronMesh = new THREE.Mesh(apronGeo, marbleMaterialLight);
apronMesh.position.set(0, 0.62, 0.1);
group.add(apronMesh);

// Apron pocket
const pocketGeo = new THREE.BoxGeometry(0.12, 0.08, 0.015);
const pocketMesh = new THREE.Mesh(pocketGeo, marbleMaterial);
pocketMesh.position.set(0, 0.52, 0.115);
group.add(pocketMesh);

// Pen in pocket
const penGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.08, 6);
const penMesh = new THREE.Mesh(penGeo, marbleMaterialDark);
penMesh.position.set(0.03, 0.56, 0.12);
penMesh.rotation.z = 0.1;
group.add(penMesh);

// Apron strings (tied in back, visible at sides)
const stringLGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.15, 6);
const stringLMesh = new THREE.Mesh(stringLGeo, marbleMaterialLight);
stringLMesh.position.set(-0.15, 0.65, 0.05);
stringLMesh.rotation.set(0, 0, 0.5);
group.add(stringLMesh);

const stringRGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.15, 6);
const stringRMesh = new THREE.Mesh(stringRGeo, marbleMaterialLight);
stringRMesh.position.set(0.15, 0.65, 0.05);
stringRMesh.rotation.set(0, 0, -0.5);
group.add(stringRMesh);

// Neck strap
const neckStrapGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.25, 6);
const neckStrapMesh = new THREE.Mesh(neckStrapGeo, marbleMaterialLight);
neckStrapMesh.position.set(0, 0.95, 0.08);
neckStrapMesh.rotation.x = 0.25;
group.add(neckStrapMesh);

// === T-SHIRT (visible at collar) ===
const shirtCollarGeo = new THREE.TorusGeometry(0.07, 0.015, 8, 16);
const shirtCollarMesh = new THREE.Mesh(shirtCollarGeo, marbleMaterial);
shirtCollarMesh.position.set(0, 1.02, 0);
shirtCollarMesh.rotation.x = Math.PI / 2;
group.add(shirtCollarMesh);

// === SHOULDERS & ARMS ===
// Shoulders
const shoulderLGeo = new THREE.SphereGeometry(0.06, 12, 12);
const shoulderLMesh = new THREE.Mesh(shoulderLGeo, marbleMaterial);
shoulderLMesh.position.set(-0.17, 1.0, -0.02);
group.add(shoulderLMesh);

const shoulderRGeo = new THREE.SphereGeometry(0.06, 12, 12);
const shoulderRMesh = new THREE.Mesh(shoulderRGeo, marbleMaterial);
shoulderRMesh.position.set(0.17, 1.0, -0.02);
group.add(shoulderRMesh);

// LEFT ARM (raised, holding vape)
const upperArmLGeo = new THREE.CylinderGeometry(0.04, 0.045, 0.16, 12);
const upperArmLMesh = new THREE.Mesh(upperArmLGeo, marbleMaterial);
upperArmLMesh.position.set(-0.2, 0.95, 0.04);
upperArmLMesh.rotation.set(0.3, 0, 0.4);
group.add(upperArmLMesh);

const elbowLGeo = new THREE.SphereGeometry(0.038, 10, 10);
const elbowLMesh = new THREE.Mesh(elbowLGeo, marbleMaterial);
elbowLMesh.position.set(-0.22, 0.88, 0.1);
group.add(elbowLMesh);

const forearmLGeo = new THREE.CylinderGeometry(0.032, 0.038, 0.14, 12);
const forearmLMesh = new THREE.Mesh(forearmLGeo, marbleMaterial);
forearmLMesh.position.set(-0.16, 0.95, 0.14);
forearmLMesh.rotation.set(-0.8, 0, 0.2);
group.add(forearmLMesh);

// Left hand holding vape
const handLGeo = new THREE.BoxGeometry(0.05, 0.035, 0.06);
const handLMesh = new THREE.Mesh(handLGeo, marbleMaterial);
handLMesh.position.set(-0.1, 1.02, 0.16);
handLMesh.rotation.x = -0.3;
group.add(handLMesh);

// Fingers curled around vape
for (let i = 0; i < 4; i++) {
    const fingerGeo = new THREE.CylinderGeometry(0.006, 0.008, 0.035, 8);
    const fingerMesh = new THREE.Mesh(fingerGeo, marbleMaterial);
    fingerMesh.position.set(-0.12 + i * 0.015, 1.01, 0.18);
    fingerMesh.rotation.x = 0.8;
    group.add(fingerMesh);
}

// Thumb
const thumbLGeo = new THREE.CylinderGeometry(0.008, 0.01, 0.03, 8);
const thumbLMesh = new THREE.Mesh(thumbLGeo, marbleMaterial);
thumbLMesh.position.set(-0.06, 1.02, 0.14);
thumbLMesh.rotation.set(0.2, 0, -0.6);
group.add(thumbLMesh);

// === VAPE PEN ===
const vapeBodyGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.1, 12);
const vapeBodyMesh = new THREE.Mesh(vapeBodyGeo, marbleMaterialDark);
vapeBodyMesh.position.set(-0.08, 1.05, 0.17);
vapeBodyMesh.rotation.set(-0.5, 0, 0.3);
group.add(vapeBodyMesh);

// Vape mouthpiece
const vapeTipGeo = new THREE.CylinderGeometry(0.008, 0.01, 0.025, 10);
const vapeTipMesh = new THREE.Mesh(vapeTipGeo, marbleMaterial);
vapeTipMesh.position.set(-0.06, 1.08, 0.18);
vapeTipMesh.rotation.set(-0.5, 0, 0.3);
group.add(vapeTipMesh);

// Vape LED indicator
const vapeLedGeo = new THREE.SphereGeometry(0.006, 8, 8);
const vapeLedMesh = new THREE.Mesh(vapeLedGeo, marbleMaterialLight);
vapeLedMesh.position.set(-0.1, 1.02, 0.16);
group.add(vapeLedMesh);

// === VAPOR CLOUD ===
// Multiple cloud puffs rising
const cloudData = [
    { pos: [-0.04, 1.12, 0.2], scale: 1 },
    { pos: [-0.02, 1.16, 0.19], scale: 1.3 },
    { pos: [-0.05, 1.2, 0.17], scale: 1.1 },
    { pos: [0, 1.24, 0.16], scale: 1.5 },
    { pos: [-0.03, 1.28, 0.14], scale: 1.2 },
    { pos: [0.02, 1.32, 0.13], scale: 1.6 },
    { pos: [-0.02, 1.36, 0.11], scale: 1.3 }
];

cloudData.forEach((cloud, i) => {
    const cloudGeo = new THREE.SphereGeometry(0.025 * cloud.scale, 10, 10);
    const cloudMesh = new THREE.Mesh(cloudGeo, marbleMaterialLight);
    cloudMesh.position.set(...cloud.pos);
    cloudMesh.scale.set(1.3, 0.8, 0.7);
    group.add(cloudMesh);
});

// Wispy tendrils
for (let i = 0; i < 5; i++) {
    const wispGeo = new THREE.CylinderGeometry(0.008, 0.015, 0.06, 6);
    const wispMesh = new THREE.Mesh(wispGeo, marbleMaterialLight);
    wispMesh.position.set(-0.02 + Math.random() * 0.04, 1.15 + i * 0.04, 0.18 - i * 0.01);
    wispMesh.rotation.set(Math.random() * 0.3, 0, Math.random() * 0.5 - 0.25);
    group.add(wispMesh);
}

// RIGHT ARM (down, holding phone)
const upperArmRGeo = new THREE.CylinderGeometry(0.04, 0.045, 0.18, 12);
const upperArmRMesh = new THREE.Mesh(upperArmRGeo, marbleMaterial);
upperArmRMesh.position.set(0.2, 0.88, 0.05);
upperArmRMesh.rotation.set(0.3, 0, -0.2);
group.add(upperArmRMesh);

const elbowRGeo = new THREE.SphereGeometry(0.038, 10, 10);
const elbowRMesh = new THREE.Mesh(elbowRGeo, marbleMaterial);
elbowRMesh.position.set(0.22, 0.78, 0.1);
group.add(elbowRMesh);

const forearmRGeo = new THREE.CylinderGeometry(0.032, 0.038, 0.16, 12);
const forearmRMesh = new THREE.Mesh(forearmRGeo, marbleMaterial);
forearmRMesh.position.set(0.2, 0.68, 0.14);
forearmRMesh.rotation.set(0.2, 0, -0.15);
group.add(forearmRMesh);

// Right hand
const handRGeo = new THREE.BoxGeometry(0.05, 0.03, 0.07);
const handRMesh = new THREE.Mesh(handRGeo, marbleMaterial);
handRMesh.position.set(0.19, 0.58, 0.17);
handRMesh.rotation.x = -0.6;
group.add(handRMesh);

// Fingers holding phone
for (let i = 0; i < 4; i++) {
    const fingerGeo = new THREE.CylinderGeometry(0.006, 0.008, 0.04, 8);
    const fingerMesh = new THREE.Mesh(fingerGeo, marbleMaterial);
    fingerMesh.position.set(0.17 + i * 0.012, 0.56, 0.2);
    fingerMesh.rotation.x = 0.6;
    group.add(fingerMesh);
}

// === PHONE ===
const phoneBodyGeo = new THREE.BoxGeometry(0.055, 0.11, 0.008);
const phoneBodyMesh = new THREE.Mesh(phoneBodyGeo, marbleMaterialDark);
phoneBodyMesh.position.set(0.19, 0.54, 0.2);
phoneBodyMesh.rotation.x = -0.7;
group.add(phoneBodyMesh);

// Phone screen (glowing)
const phoneScreenGeo = new THREE.BoxGeometry(0.048, 0.095, 0.003);
const phoneScreenMesh = new THREE.Mesh(phoneScreenGeo, marbleMaterialLight);
phoneScreenMesh.position.set(0.19, 0.54, 0.205);
phoneScreenMesh.rotation.x = -0.7;
group.add(phoneScreenMesh);

// Screen content suggestion (app icons)
for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
        const iconGeo = new THREE.BoxGeometry(0.012, 0.012, 0.002);
        const iconMesh = new THREE.Mesh(iconGeo, marbleMaterial);
        iconMesh.position.set(0.175 + col * 0.015, 0.57 - row * 0.025, 0.21);
        iconMesh.rotation.x = -0.7;
        group.add(iconMesh);
    }
}

// Camera bump
const cameraBumpGeo = new THREE.BoxGeometry(0.025, 0.025, 0.005);
const cameraBumpMesh = new THREE.Mesh(cameraBumpGeo, marbleMaterial);
cameraBumpMesh.position.set(0.175, 0.58, 0.195);
cameraBumpMesh.rotation.x = -0.7;
group.add(cameraBumpMesh);

// === NECK ===
const neckGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.1, 12);
const neckMesh = new THREE.Mesh(neckGeo, marbleMaterial);
neckMesh.position.set(0, 1.08, -0.01);
neckMesh.rotation.x = 0.1;
group.add(neckMesh);

// Adam's apple
const adamsAppleGeo = new THREE.SphereGeometry(0.015, 8, 8);
const adamsAppleMesh = new THREE.Mesh(adamsAppleGeo, marbleMaterial);
adamsAppleMesh.position.set(0, 1.06, 0.04);
group.add(adamsAppleMesh);

// === HEAD ===
// Cranium
const craniumGeo = new THREE.SphereGeometry(0.095, 16, 16);
const craniumMesh = new THREE.Mesh(craniumGeo, marbleMaterial);
craniumMesh.position.set(0, 1.2, 0);
group.add(craniumMesh);

// Face (tilted down looking at phone)
const faceGeo = new THREE.SphereGeometry(0.085, 14, 14);
const faceMesh = new THREE.Mesh(faceGeo, marbleMaterial);
faceMesh.position.set(0, 1.17, 0.04);
faceMesh.scale.set(0.9, 1, 0.6);
faceMesh.rotation.x = 0.3; // tilted down
group.add(faceMesh);

// Brow
const browGeo = new THREE.BoxGeometry(0.1, 0.018, 0.035);
const browMesh = new THREE.Mesh(browGeo, marbleMaterial);
browMesh.position.set(0, 1.2, 0.07);
browMesh.rotation.x = 0.2;
group.add(browMesh);

// Eyes (looking down)
const eyeLGeo = new THREE.SphereGeometry(0.012, 10, 10);
const eyeLMesh = new THREE.Mesh(eyeLGeo, marbleMaterialLight);
eyeLMesh.position.set(-0.025, 1.17, 0.085);
group.add(eyeLMesh);

const eyeRGeo = new THREE.SphereGeometry(0.012, 10, 10);
const eyeRMesh = new THREE.Mesh(eyeRGeo, marbleMaterialLight);
eyeRMesh.position.set(0.025, 1.17, 0.085);
group.add(eyeRMesh);

// Pupils (looking down at phone)
const pupilLGeo = new THREE.SphereGeometry(0.005, 8, 8);
const pupilLMesh = new THREE.Mesh(pupilLGeo, marbleMaterialDark);
pupilLMesh.position.set(-0.025, 1.165, 0.095);
group.add(pupilLMesh);

const pupilRGeo = new THREE.SphereGeometry(0.005, 8, 8);
const pupilRMesh = new THREE.Mesh(pupilRGeo, marbleMaterialDark);
pupilRMesh.position.set(0.025, 1.165, 0.095);
group.add(pupilRMesh);

// Nose
const noseGeo = new THREE.BoxGeometry(0.02, 0.04, 0.025);
const noseMesh = new THREE.Mesh(noseGeo, marbleMaterial);
noseMesh.position.set(0, 1.14, 0.08);
noseMesh.rotation.x = 0.2;
group.add(noseMesh);

const noseTipGeo = new THREE.SphereGeometry(0.014, 10, 10);
const noseTipMesh = new THREE.Mesh(noseTipGeo, marbleMaterial);
noseTipMesh.position.set(0, 1.12, 0.095);
group.add(noseTipMesh);

// Mouth (neutral, slight pout from exhale)
const lipGeo = new THREE.BoxGeometry(0.03, 0.012, 0.015);
const lipMesh = new THREE.Mesh(lipGeo, marbleMaterial);
lipMesh.position.set(0, 1.09, 0.09);
group.add(lipMesh);

// Chin
const chinGeo = new THREE.SphereGeometry(0.02, 10, 10);
const chinMesh = new THREE.Mesh(chinGeo, marbleMaterial);
chinMesh.position.set(0, 1.06, 0.08);
chinMesh.scale.set(1, 0.8, 0.7);
group.add(chinMesh);

// Light stubble suggestion
for (let i = 0; i < 15; i++) {
    const stubbleGeo = new THREE.SphereGeometry(0.003, 4, 4);
    const stubbleMesh = new THREE.Mesh(stubbleGeo, marbleMaterialDark);
    stubbleMesh.position.set(
        -0.03 + Math.random() * 0.06,
        1.06 + Math.random() * 0.04,
        0.075 + Math.random() * 0.02
    );
    group.add(stubbleMesh);
}

// Ears
const earLGeo = new THREE.SphereGeometry(0.022, 10, 10);
const earLMesh = new THREE.Mesh(earLGeo, marbleMaterial);
earLMesh.position.set(-0.095, 1.17, 0);
earLMesh.scale.set(0.4, 1, 0.7);
group.add(earLMesh);

const earRGeo = new THREE.SphereGeometry(0.022, 10, 10);
const earRMesh = new THREE.Mesh(earRGeo, marbleMaterial);
earRMesh.position.set(0.095, 1.17, 0);
earRMesh.scale.set(0.4, 1, 0.7);
group.add(earRMesh);

// === MAN BUN ===
// Hair base
const hairBaseGeo = new THREE.SphereGeometry(0.1, 14, 14);
const hairBaseMesh = new THREE.Mesh(hairBaseGeo, marbleMaterialDark);
hairBaseMesh.position.set(0, 1.22, -0.02);
hairBaseMesh.scale.set(1, 0.9, 1);
group.add(hairBaseMesh);

// The bun itself
const bunGeo = new THREE.SphereGeometry(0.045, 12, 12);
const bunMesh = new THREE.Mesh(bunGeo, marbleMaterialDark);
bunMesh.position.set(0, 1.3, -0.04);
group.add(bunMesh);

// Hair tie
const tieGeo = new THREE.TorusGeometry(0.035, 0.008, 8, 12);
const tieMesh = new THREE.Mesh(tieGeo, marbleMaterial);
tieMesh.position.set(0, 1.28, -0.04);
tieMesh.rotation.x = 0.3;
group.add(tieMesh);

// Loose strands
for (let i = 0; i < 6; i++) {
    const strandGeo = new THREE.CylinderGeometry(0.003, 0.005, 0.08, 6);
    const strandMesh = new THREE.Mesh(strandGeo, marbleMaterialDark);
    const angle = (i / 6) * Math.PI - 0.5;
    strandMesh.position.set(
        Math.sin(angle) * 0.08,
        1.22,
        Math.cos(angle) * 0.06
    );
    strandMesh.rotation.set(0.3, angle, 0.5);
    group.add(strandMesh);
}

// Undercut texture on sides
for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < 8; i++) {
        const buzzGeo = new THREE.SphereGeometry(0.008, 6, 6);
        const buzzMesh = new THREE.Mesh(buzzGeo, marbleMaterial);
        buzzMesh.position.set(
            side * 0.085,
            1.12 + i * 0.012,
            -0.02 + Math.random() * 0.04
        );
        group.add(buzzMesh);
    }
}
`
    }
};

// Generate HTML
function generateHTML(geometryCode) {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/exporters/GLTFExporter.js"></script>
</head>
<body>
<script>
const scene = new THREE.Scene();
const group = new THREE.Group();

const marbleMaterialLight = new THREE.MeshStandardMaterial({ color: ${COLORS.light}, roughness: 0.7, metalness: 0.0 });
const marbleMaterial = new THREE.MeshStandardMaterial({ color: ${COLORS.medium}, roughness: 0.75, metalness: 0.0 });
const marbleMaterialDark = new THREE.MeshStandardMaterial({ color: ${COLORS.dark}, roughness: 0.8, metalness: 0.0 });

${geometryCode}

scene.add(group);

const exporter = new THREE.GLTFExporter();
exporter.parse(scene, function(gltf) {
    window.gltfData = JSON.stringify(gltf);
    window.exportComplete = true;
}, { binary: false });
</script>
</body>
</html>`;
}

async function exportStatue(browser, filename, statue) {
    const page = await browser.newPage();
    try {
        const html = generateHTML(statue.geometry());
        await page.setContent(html);
        await page.waitForFunction('window.exportComplete === true', { timeout: 60000 });
        const gltfData = await page.evaluate(() => window.gltfData);
        const filepath = path.join(MODELS_DIR, filename);
        fs.writeFileSync(filepath, gltfData);
        const stats = fs.statSync(filepath);
        const gltf = JSON.parse(gltfData);
        const meshCount = gltf.meshes ? gltf.meshes.length : 0;
        log(`SUCCESS: ${filename} - ${meshCount} meshes, ${(stats.size / 1024).toFixed(1)} KB`);
        return true;
    } catch (err) {
        log(`ERROR: ${filename} - ${err.message}`);
        return false;
    } finally {
        await page.close();
    }
}

async function main() {
    log('=== Starting UWS HIGH DETAIL Statue Generation ===');
    log('Target: ~250 primitives per statue');
    log(`Output: ${MODELS_DIR}`);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox']
    });

    let generated = 0;
    let failed = 0;

    for (const [key, statue] of Object.entries(STATUES)) {
        const filename = `${key}.gltf`;
        log(`Generating: ${statue.name} -> ${filename}`);
        const success = await exportStatue(browser, filename, statue);
        if (success) generated++;
        else failed++;
    }

    await browser.close();

    log('=== Generation Complete ===');
    log(`Generated: ${generated}, Failed: ${failed}`);

    console.log('\nHigh detail test files:');
    for (const key of Object.keys(STATUES)) {
        const filepath = path.join(MODELS_DIR, `${key}.gltf`);
        if (fs.existsSync(filepath)) {
            const stats = fs.statSync(filepath);
            console.log(`  ✓ ${key}.gltf (${(stats.size / 1024).toFixed(1)} KB)`);
        }
    }
}

main().catch(err => {
    log(`FATAL: ${err.message}`);
    process.exit(1);
});
