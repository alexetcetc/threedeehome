/**
 * Generate Remaining Piranesi Statues
 * Generates GLTF files for statues not yet created
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const MODELS_DIR = '/Users/alex/Documents/threedeehome/models';
const LOG_FILE = '/Users/alex/Documents/threedeehome/generation_progress.log';

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
 * All 51 statues with their geometry generators (MEDIUM detail: 10-25 primitives)
 */
const STATUES = {
    // #1 - Woman Carrying Beehive
    beehive_woman: {
        name: "Woman Carrying Beehive",
        geometry: () => `
// Woman's body - robed figure
const robeGeo = new THREE.ConeGeometry(0.3, 1.0, 12);
const robeMesh = new THREE.Mesh(robeGeo, marbleMaterial);
robeMesh.position.set(0, 0.5, 0);
group.add(robeMesh);

// Torso
const torsoGeo = new THREE.CylinderGeometry(0.15, 0.2, 0.4, 12);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0, 1.1, 0);
group.add(torsoMesh);

// Head
const headGeo = new THREE.SphereGeometry(0.12, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 1.45, 0);
group.add(headMesh);

// Hair
const hairGeo = new THREE.SphereGeometry(0.13, 10, 10);
const hairMesh = new THREE.Mesh(hairGeo, marbleMaterial);
hairMesh.position.set(0, 1.50, -0.02);
hairMesh.scale.set(1, 0.7, 0.9);
group.add(hairMesh);

// Arms holding beehive
const armLGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.35, 8);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.2, 1.0, 0.15);
armLMesh.rotation.set(0.5, 0, 0.3);
group.add(armLMesh);

const armRGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.35, 8);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.2, 1.0, 0.15);
armRMesh.rotation.set(0.5, 0, -0.3);
group.add(armRMesh);

// Beehive (skep) - straw dome shape
const hiveGeo = new THREE.SphereGeometry(0.2, 12, 12);
const hiveMesh = new THREE.Mesh(hiveGeo, marbleMaterialDark);
hiveMesh.position.set(0, 0.95, 0.25);
hiveMesh.scale.set(0.8, 1.2, 0.8);
group.add(hiveMesh);

// Hive rings (straw texture)
for (let i = 0; i < 4; i++) {
    const ringGeo = new THREE.TorusGeometry(0.15 - i * 0.02, 0.015, 8, 16);
    const ringMesh = new THREE.Mesh(ringGeo, marbleMaterialDark);
    ringMesh.position.set(0, 0.85 + i * 0.08, 0.25);
    ringMesh.rotation.x = Math.PI / 2;
    group.add(ringMesh);
}

// Bees on the hive
const beePositions = [[0.1, 1.05, 0.4], [-0.08, 0.9, 0.38], [0.05, 0.8, 0.35]];
beePositions.forEach(pos => {
    const beeGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const beeMesh = new THREE.Mesh(beeGeo, marbleMaterialLight);
    beeMesh.position.set(...pos);
    beeMesh.scale.set(1.3, 1, 0.8);
    group.add(beeMesh);
});

// Bee over eye
const eyeBeeGeo = new THREE.SphereGeometry(0.03, 8, 8);
const eyeBeeMesh = new THREE.Mesh(eyeBeeGeo, marbleMaterialLight);
eyeBeeMesh.position.set(0.06, 1.46, 0.11);
eyeBeeMesh.scale.set(1.3, 1, 0.8);
group.add(eyeBeeMesh);
`
    },

    // #6 - Young Boy Playing Cymbals
    boy_cymbals: {
        name: "Young Boy Playing Cymbals",
        geometry: () => `
// Boy's body - small figure, arms raised
const bodyGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.5, 12);
const bodyMesh = new THREE.Mesh(bodyGeo, marbleMaterial);
bodyMesh.position.set(0, 0.35, 0);
group.add(bodyMesh);

// Legs
const legLGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.35, 10);
const legLMesh = new THREE.Mesh(legLGeo, marbleMaterial);
legLMesh.position.set(-0.08, 0.05, 0);
group.add(legLMesh);

const legRGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.35, 10);
const legRMesh = new THREE.Mesh(legRGeo, marbleMaterial);
legRMesh.position.set(0.08, 0.05, 0);
group.add(legRMesh);

// Torso
const torsoGeo = new THREE.SphereGeometry(0.14, 12, 12);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0, 0.55, 0);
torsoMesh.scale.set(1, 1.2, 0.8);
group.add(torsoMesh);

// Head - joyful expression
const headGeo = new THREE.SphereGeometry(0.1, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 0.78, 0);
group.add(headMesh);

// Curly hair
for (let i = 0; i < 6; i++) {
    const curlGeo = new THREE.SphereGeometry(0.03, 8, 8);
    const curlMesh = new THREE.Mesh(curlGeo, marbleMaterial);
    const angle = (i / 6) * Math.PI * 2;
    curlMesh.position.set(Math.sin(angle) * 0.08, 0.86, Math.cos(angle) * 0.06);
    group.add(curlMesh);
}

// Arms raised high - about to clash cymbals
const armLGeo = new THREE.CylinderGeometry(0.035, 0.04, 0.3, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.2, 0.75, 0);
armLMesh.rotation.z = 0.8;
group.add(armLMesh);

const armRGeo = new THREE.CylinderGeometry(0.035, 0.04, 0.3, 10);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.2, 0.75, 0);
armRMesh.rotation.z = -0.8;
group.add(armRMesh);

// Left cymbal
const cymbalLGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16);
const cymbalLMesh = new THREE.Mesh(cymbalLGeo, marbleMaterialLight);
cymbalLMesh.position.set(-0.32, 0.92, 0);
cymbalLMesh.rotation.z = 0.3;
group.add(cymbalLMesh);

const cymbalLDomeGeo = new THREE.SphereGeometry(0.04, 10, 10);
const cymbalLDomeMesh = new THREE.Mesh(cymbalLDomeGeo, marbleMaterialLight);
cymbalLDomeMesh.position.set(-0.33, 0.93, 0);
cymbalLDomeMesh.scale.set(1, 0.5, 1);
group.add(cymbalLDomeMesh);

// Right cymbal
const cymbalRGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16);
const cymbalRMesh = new THREE.Mesh(cymbalRGeo, marbleMaterialLight);
cymbalRMesh.position.set(0.32, 0.92, 0);
cymbalRMesh.rotation.z = -0.3;
group.add(cymbalRMesh);

const cymbalRDomeGeo = new THREE.SphereGeometry(0.04, 10, 10);
const cymbalRDomeMesh = new THREE.Mesh(cymbalRDomeGeo, marbleMaterialLight);
cymbalRDomeMesh.position.set(0.33, 0.93, 0);
cymbalRDomeMesh.scale.set(1, 0.5, 1);
group.add(cymbalRDomeMesh);
`
    },

    // #9 - Man Trampled by Centaur
    man_centaur: {
        name: "Man Trampled by Centaur",
        geometry: () => `
// Centaur - horse body
const horseBodyGeo = new THREE.SphereGeometry(0.35, 14, 14);
const horseBodyMesh = new THREE.Mesh(horseBodyGeo, marbleMaterial);
horseBodyMesh.position.set(0, 0.6, 0);
horseBodyMesh.scale.set(1.5, 0.9, 0.9);
group.add(horseBodyMesh);

// Horse hindquarters
const hindGeo = new THREE.SphereGeometry(0.28, 12, 12);
const hindMesh = new THREE.Mesh(hindGeo, marbleMaterial);
hindMesh.position.set(-0.4, 0.55, 0);
group.add(hindMesh);

// Horse front legs (rearing)
const frontLegLGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.5, 10);
const frontLegLMesh = new THREE.Mesh(frontLegLGeo, marbleMaterial);
frontLegLMesh.position.set(0.35, 0.65, 0.12);
frontLegLMesh.rotation.set(0, 0, -0.8);
group.add(frontLegLMesh);

const frontLegRGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.5, 10);
const frontLegRMesh = new THREE.Mesh(frontLegRGeo, marbleMaterial);
frontLegRMesh.position.set(0.35, 0.65, -0.12);
frontLegRMesh.rotation.set(0, 0, -0.8);
group.add(frontLegRMesh);

// Horse back legs
const backLegLGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.55, 10);
const backLegLMesh = new THREE.Mesh(backLegLGeo, marbleMaterial);
backLegLMesh.position.set(-0.45, 0.28, 0.15);
group.add(backLegLMesh);

const backLegRGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.55, 10);
const backLegRMesh = new THREE.Mesh(backLegRGeo, marbleMaterial);
backLegRMesh.position.set(-0.45, 0.28, -0.15);
group.add(backLegRMesh);

// Human torso of centaur
const centaurTorsoGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.4, 12);
const centaurTorsoMesh = new THREE.Mesh(centaurTorsoGeo, marbleMaterial);
centaurTorsoMesh.position.set(0.25, 1.0, 0);
centaurTorsoMesh.rotation.z = -0.2;
group.add(centaurTorsoMesh);

// Centaur head
const centaurHeadGeo = new THREE.SphereGeometry(0.1, 12, 12);
const centaurHeadMesh = new THREE.Mesh(centaurHeadGeo, marbleMaterial);
centaurHeadMesh.position.set(0.3, 1.28, 0);
group.add(centaurHeadMesh);

// Centaur arms raised
const centaurArmGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.3, 10);
const centaurArmMesh = new THREE.Mesh(centaurArmGeo, marbleMaterial);
centaurArmMesh.position.set(0.4, 1.15, 0);
centaurArmMesh.rotation.z = -0.6;
group.add(centaurArmMesh);

// Fallen man beneath hooves
const manBodyGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.5, 10);
const manBodyMesh = new THREE.Mesh(manBodyGeo, marbleMaterialDark);
manBodyMesh.position.set(0.45, 0.1, 0);
manBodyMesh.rotation.z = Math.PI / 2;
group.add(manBodyMesh);

// Man's head
const manHeadGeo = new THREE.SphereGeometry(0.08, 10, 10);
const manHeadMesh = new THREE.Mesh(manHeadGeo, marbleMaterialDark);
manHeadMesh.position.set(0.7, 0.1, 0);
group.add(manHeadMesh);

// Man's arm reaching up
const manArmGeo = new THREE.CylinderGeometry(0.03, 0.04, 0.25, 8);
const manArmMesh = new THREE.Mesh(manArmGeo, marbleMaterialDark);
manArmMesh.position.set(0.5, 0.25, 0);
manArmMesh.rotation.z = -0.5;
group.add(manArmMesh);
`
    },

    // #10 - The Gardener
    gardener: {
        name: "The Gardener",
        geometry: () => `
// Body - working pose, bent slightly
const robeGeo = new THREE.ConeGeometry(0.28, 0.9, 12);
const robeMesh = new THREE.Mesh(robeGeo, marbleMaterial);
robeMesh.position.set(0, 0.45, 0);
group.add(robeMesh);

// Torso leaning forward
const torsoGeo = new THREE.CylinderGeometry(0.14, 0.18, 0.35, 12);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0.05, 0.95, 0.05);
torsoMesh.rotation.x = 0.3;
group.add(torsoMesh);

// Head
const headGeo = new THREE.SphereGeometry(0.11, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0.1, 1.22, 0.08);
group.add(headMesh);

// Simple cap/hat
const hatGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.06, 10);
const hatMesh = new THREE.Mesh(hatGeo, marbleMaterialDark);
hatMesh.position.set(0.1, 1.32, 0.06);
group.add(hatMesh);

// Arms holding tool
const armLGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.35, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.15, 0.95, 0.18);
armLMesh.rotation.set(0.6, 0, 0.3);
group.add(armLMesh);

const armRGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.35, 10);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.15, 0.85, 0.2);
armRMesh.rotation.set(0.8, 0, -0.2);
group.add(armRMesh);

// Spade handle
const handleGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8);
const handleMesh = new THREE.Mesh(handleGeo, marbleMaterialDark);
handleMesh.position.set(0.1, 0.6, 0.25);
handleMesh.rotation.x = 0.4;
group.add(handleMesh);

// Spade blade
const bladeGeo = new THREE.BoxGeometry(0.15, 0.2, 0.02);
const bladeMesh = new THREE.Mesh(bladeMesh, marbleMaterialDark);
bladeMesh.position.set(0.1, 0.15, 0.35);
bladeMesh.rotation.x = 0.4;
group.add(bladeMesh);

// Ground/earth mound
const moundGeo = new THREE.SphereGeometry(0.2, 10, 10);
const moundMesh = new THREE.Mesh(moundGeo, marbleMaterialDark);
moundMesh.position.set(0.15, 0.05, 0.3);
moundMesh.scale.set(1.5, 0.4, 1);
group.add(moundMesh);
`
    },

    // #12 - The Ship on Waves
    ship_waves: {
        name: "The Ship on Waves",
        geometry: () => `
// Stylized waves base
for (let i = 0; i < 5; i++) {
    const waveGeo = new THREE.TorusGeometry(0.4 - i * 0.05, 0.06, 8, 16, Math.PI);
    const waveMesh = new THREE.Mesh(waveGeo, marbleMaterialDark);
    waveMesh.position.set(i * 0.08 - 0.15, 0.1 + i * 0.03, 0);
    waveMesh.rotation.x = -Math.PI / 2;
    waveMesh.rotation.z = i * 0.1;
    group.add(waveMesh);
}

// Ship hull
const hullGeo = new THREE.CylinderGeometry(0.08, 0.15, 0.6, 12);
const hullMesh = new THREE.Mesh(hullGeo, marbleMaterial);
hullMesh.position.set(0, 0.4, 0);
hullMesh.rotation.z = Math.PI / 2;
hullMesh.scale.set(0.6, 1, 0.8);
group.add(hullMesh);

// Hull keel
const keelGeo = new THREE.BoxGeometry(0.6, 0.08, 0.04);
const keelMesh = new THREE.Mesh(keelGeo, marbleMaterialDark);
keelMesh.position.set(0, 0.28, 0);
group.add(keelMesh);

// Deck
const deckGeo = new THREE.BoxGeometry(0.5, 0.03, 0.22);
const deckMesh = new THREE.Mesh(deckGeo, marbleMaterial);
deckMesh.position.set(0, 0.48, 0);
group.add(deckMesh);

// Main mast
const mastGeo = new THREE.CylinderGeometry(0.02, 0.025, 0.7, 8);
const mastMesh = new THREE.Mesh(mastGeo, marbleMaterial);
mastMesh.position.set(0, 0.8, 0);
group.add(mastMesh);

// Sail
const sailGeo = new THREE.BoxGeometry(0.35, 0.4, 0.02);
const sailMesh = new THREE.Mesh(sailGeo, marbleMaterialLight);
sailMesh.position.set(0, 0.85, 0.08);
sailMesh.rotation.y = 0.1;
group.add(sailMesh);

// Sail curve (belly)
const bellyCurveGeo = new THREE.SphereGeometry(0.2, 10, 10);
const bellyCurveMesh = new THREE.Mesh(bellyCurveGeo, marbleMaterialLight);
bellyCurveMesh.position.set(0, 0.85, 0.12);
bellyCurveMesh.scale.set(0.9, 1, 0.3);
group.add(bellyCurveMesh);

// Bow (front)
const bowGeo = new THREE.ConeGeometry(0.08, 0.2, 8);
const bowMesh = new THREE.Mesh(bowGeo, marbleMaterial);
bowMesh.position.set(0.35, 0.4, 0);
bowMesh.rotation.z = -Math.PI / 2;
group.add(bowMesh);

// Stern (back)
const sternGeo = new THREE.BoxGeometry(0.08, 0.2, 0.15);
const sternMesh = new THREE.Mesh(sternGeo, marbleMaterial);
sternMesh.position.set(-0.28, 0.45, 0);
group.add(sternMesh);
`
    },

    // #13 - Man Reading Large Book
    man_book: {
        name: "Man Reading Large Book",
        geometry: () => `
// Robed figure, mysterious
const robeGeo = new THREE.ConeGeometry(0.35, 1.1, 12);
const robeMesh = new THREE.Mesh(robeGeo, marbleMaterial);
robeMesh.position.set(0, 0.55, 0);
group.add(robeMesh);

// Torso
const torsoGeo = new THREE.CylinderGeometry(0.16, 0.22, 0.4, 12);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0, 1.15, 0);
group.add(torsoMesh);

// Hooded head
const hoodGeo = new THREE.SphereGeometry(0.14, 12, 12);
const hoodMesh = new THREE.Mesh(hoodGeo, marbleMaterial);
hoodMesh.position.set(0, 1.42, 0);
group.add(hoodMesh);

// Hood overhang
const hoodTopGeo = new THREE.SphereGeometry(0.15, 10, 10);
const hoodTopMesh = new THREE.Mesh(hoodTopGeo, marbleMaterial);
hoodTopMesh.position.set(0, 1.48, -0.05);
hoodTopMesh.scale.set(1, 0.7, 1.2);
group.add(hoodTopMesh);

// Shadowed face (dark indentation)
const faceGeo = new THREE.SphereGeometry(0.08, 10, 10);
const faceMesh = new THREE.Mesh(faceGeo, marbleMaterialDark);
faceMesh.position.set(0, 1.40, 0.08);
group.add(faceMesh);

// Arms cradling book
const armLGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.35, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.2, 1.0, 0.15);
armLMesh.rotation.set(0.7, 0, 0.4);
group.add(armLMesh);

const armRGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.35, 10);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.2, 1.0, 0.15);
armRMesh.rotation.set(0.7, 0, -0.4);
group.add(armRMesh);

// Large open book
const bookLeftGeo = new THREE.BoxGeometry(0.25, 0.35, 0.04);
const bookLeftMesh = new THREE.Mesh(bookLeftGeo, marbleMaterialLight);
bookLeftMesh.position.set(-0.13, 0.95, 0.25);
bookLeftMesh.rotation.y = 0.3;
group.add(bookLeftMesh);

const bookRightGeo = new THREE.BoxGeometry(0.25, 0.35, 0.04);
const bookRightMesh = new THREE.Mesh(bookRightGeo, marbleMaterialLight);
bookRightMesh.position.set(0.13, 0.95, 0.25);
bookRightMesh.rotation.y = -0.3;
group.add(bookRightMesh);

// Book spine
const spineGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.35, 8);
const spineMesh = new THREE.Mesh(spineGeo, marbleMaterialDark);
spineMesh.position.set(0, 0.95, 0.18);
group.add(spineMesh);

// Text lines on pages
for (let i = 0; i < 5; i++) {
    const lineGeo = new THREE.BoxGeometry(0.18, 0.008, 0.002);
    const lineMesh = new THREE.Mesh(lineGeo, marbleMaterialDark);
    lineMesh.position.set(-0.12, 1.05 - i * 0.04, 0.27);
    lineMesh.rotation.y = 0.3;
    group.add(lineMesh);
}
`
    },

    // #14 - Woman with Cloud Shield
    woman_cloud_shield: {
        name: "Woman with Cloud Shield",
        geometry: () => `
// Noble woman's body
const robeGeo = new THREE.ConeGeometry(0.32, 1.0, 12);
const robeMesh = new THREE.Mesh(robeGeo, marbleMaterial);
robeMesh.position.set(0, 0.5, 0);
group.add(robeMesh);

// Torso
const torsoGeo = new THREE.CylinderGeometry(0.14, 0.2, 0.4, 12);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0, 1.05, 0);
group.add(torsoMesh);

// Head
const headGeo = new THREE.SphereGeometry(0.11, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 1.38, 0);
group.add(headMesh);

// Elegant hair
const hairGeo = new THREE.SphereGeometry(0.12, 10, 10);
const hairMesh = new THREE.Mesh(hairGeo, marbleMaterial);
hairMesh.position.set(0, 1.44, -0.03);
hairMesh.scale.set(1, 0.8, 1);
group.add(hairMesh);

// Left arm holding shield
const armLGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.4, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.25, 1.0, 0.1);
armLMesh.rotation.set(0.3, 0, 0.5);
group.add(armLMesh);

// Right arm supporting
const armRGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.35, 10);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.18, 0.95, 0.15);
armRMesh.rotation.set(0.5, 0, -0.3);
group.add(armRMesh);

// Large round shield
const shieldGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.04, 20);
const shieldMesh = new THREE.Mesh(shieldGeo, marbleMaterialLight);
shieldMesh.position.set(-0.35, 0.85, 0.15);
shieldMesh.rotation.set(0.2, 0.6, 0.1);
group.add(shieldMesh);

// Shield rim
const rimGeo = new THREE.TorusGeometry(0.35, 0.03, 8, 20);
const rimMesh = new THREE.Mesh(rimGeo, marbleMaterial);
rimMesh.position.set(-0.35, 0.85, 0.17);
rimMesh.rotation.set(0.2, 0.6, 0.1);
group.add(rimMesh);

// Clouds on shield (puffy spheres)
const cloudPositions = [[-0.32, 0.9, 0.22], [-0.4, 0.8, 0.2], [-0.28, 0.78, 0.21]];
cloudPositions.forEach(pos => {
    const cloudGeo = new THREE.SphereGeometry(0.08, 10, 10);
    const cloudMesh = new THREE.Mesh(cloudGeo, marbleMaterial);
    cloudMesh.position.set(...pos);
    cloudMesh.scale.set(1.3, 0.8, 0.5);
    group.add(cloudMesh);
});

// More cloud puffs
const puffPositions = [[-0.38, 0.88, 0.2], [-0.3, 0.85, 0.22], [-0.42, 0.82, 0.19]];
puffPositions.forEach(pos => {
    const puffGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const puffMesh = new THREE.Mesh(puffGeo, marbleMaterial);
    puffMesh.position.set(...pos);
    puffMesh.scale.set(1.2, 0.7, 0.4);
    group.add(puffMesh);
});
`
    },

    // #15 - Child Examining Flower
    child_flower: {
        name: "Child Examining Flower",
        geometry: () => `
// Small child, bending forward
const bodyGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.4, 12);
const bodyMesh = new THREE.Mesh(bodyGeo, marbleMaterial);
bodyMesh.position.set(0, 0.3, 0);
bodyMesh.rotation.x = 0.4;
group.add(bodyMesh);

// Legs
const legLGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.3, 10);
const legLMesh = new THREE.Mesh(legLGeo, marbleMaterial);
legLMesh.position.set(-0.06, 0.08, -0.08);
group.add(legLMesh);

const legRGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.3, 10);
const legRMesh = new THREE.Mesh(legRGeo, marbleMaterial);
legRMesh.position.set(0.06, 0.08, -0.08);
group.add(legRMesh);

// Head bowed forward
const headGeo = new THREE.SphereGeometry(0.09, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 0.52, 0.15);
group.add(headMesh);

// Simple hair
const hairGeo = new THREE.SphereGeometry(0.095, 10, 10);
const hairMesh = new THREE.Mesh(hairGeo, marbleMaterial);
hairMesh.position.set(0, 0.56, 0.12);
hairMesh.scale.set(1, 0.7, 0.9);
group.add(hairMesh);

// Arms reaching down to flower
const armLGeo = new THREE.CylinderGeometry(0.03, 0.035, 0.25, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.08, 0.38, 0.2);
armLMesh.rotation.set(0.9, 0, 0.2);
group.add(armLMesh);

const armRGeo = new THREE.CylinderGeometry(0.03, 0.035, 0.25, 10);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.08, 0.38, 0.2);
armRMesh.rotation.set(0.9, 0, -0.2);
group.add(armRMesh);

// Hands cupped around flower
const handLGeo = new THREE.SphereGeometry(0.03, 8, 8);
const handLMesh = new THREE.Mesh(handLGeo, marbleMaterial);
handLMesh.position.set(-0.04, 0.22, 0.32);
group.add(handLMesh);

const handRGeo = new THREE.SphereGeometry(0.03, 8, 8);
const handRMesh = new THREE.Mesh(handRGeo, marbleMaterial);
handRMesh.position.set(0.04, 0.22, 0.32);
group.add(handRMesh);

// Flower stem
const stemGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.15, 6);
const stemMesh = new THREE.Mesh(stemGeo, marbleMaterialDark);
stemMesh.position.set(0, 0.15, 0.32);
group.add(stemMesh);

// Flower petals
const petalGeo = new THREE.SphereGeometry(0.025, 8, 8);
for (let i = 0; i < 5; i++) {
    const petalMesh = new THREE.Mesh(petalGeo, marbleMaterialLight);
    const angle = (i / 5) * Math.PI * 2;
    petalMesh.position.set(
        Math.sin(angle) * 0.03,
        0.24,
        0.32 + Math.cos(angle) * 0.03
    );
    petalMesh.scale.set(1, 0.5, 1);
    group.add(petalMesh);
}

// Flower center
const centerGeo = new THREE.SphereGeometry(0.015, 8, 8);
const centerMesh = new THREE.Mesh(centerGeo, marbleMaterial);
centerMesh.position.set(0, 0.24, 0.32);
group.add(centerMesh);
`
    },

    // #16 - Sack of Grain Devoured by Mice
    grain_mice: {
        name: "Sack of Grain Devoured by Mice",
        geometry: () => `
// Burlap sack - torn and slumping
const sackBaseGeo = new THREE.SphereGeometry(0.35, 12, 12);
const sackBaseMesh = new THREE.Mesh(sackBaseGeo, marbleMaterial);
sackBaseMesh.position.set(0, 0.25, 0);
sackBaseMesh.scale.set(1, 0.8, 0.9);
group.add(sackBaseMesh);

// Sack top (gathered)
const sackTopGeo = new THREE.CylinderGeometry(0.15, 0.25, 0.3, 10);
const sackTopMesh = new THREE.Mesh(sackTopGeo, marbleMaterial);
sackTopMesh.position.set(0, 0.55, 0);
group.add(sackTopMesh);

// Torn opening
const tearGeo = new THREE.TorusGeometry(0.12, 0.03, 8, 12, Math.PI);
const tearMesh = new THREE.Mesh(tearGeo, marbleMaterialDark);
tearMesh.position.set(0.15, 0.35, 0.2);
tearMesh.rotation.set(0.5, 0.3, 0.2);
group.add(tearMesh);

// Spilled grain pile
const grainPileGeo = new THREE.SphereGeometry(0.2, 10, 10);
const grainPileMesh = new THREE.Mesh(grainPileGeo, marbleMaterialLight);
grainPileMesh.position.set(0.25, 0.08, 0.2);
grainPileMesh.scale.set(1.2, 0.4, 1);
group.add(grainPileMesh);

// Individual grain scatter
for (let i = 0; i < 8; i++) {
    const grainGeo = new THREE.SphereGeometry(0.015, 6, 6);
    const grainMesh = new THREE.Mesh(grainGeo, marbleMaterialLight);
    grainMesh.position.set(
        0.2 + Math.random() * 0.3 - 0.15,
        0.02,
        0.15 + Math.random() * 0.2 - 0.1
    );
    grainMesh.scale.set(1, 0.6, 0.8);
    group.add(grainMesh);
}

// Mice swarming the sack
const mousePositions = [
    [0.2, 0.3, 0.25],    // on tear
    [-0.15, 0.2, 0.28],  // climbing sack
    [0.3, 0.1, 0.18],    // on grain pile
    [0.15, 0.05, 0.3],   // on ground
    [-0.2, 0.15, 0.22],  // on sack side
    [0.05, 0.45, 0.18],  // near top
    [0.25, 0.22, 0.15],  // inside tear
    [-0.1, 0.08, 0.25]   // eating grain
];

mousePositions.forEach((pos, i) => {
    // Mouse body
    const mouseBodyGeo = new THREE.SphereGeometry(0.035, 8, 8);
    const mouseBodyMesh = new THREE.Mesh(mouseBodyGeo, marbleMaterialDark);
    mouseBodyMesh.position.set(...pos);
    mouseBodyMesh.scale.set(1.4, 0.8, 0.9);
    const angle = Math.random() * Math.PI * 2;
    mouseBodyMesh.rotation.y = angle;
    group.add(mouseBodyMesh);

    // Mouse head
    const mouseHeadGeo = new THREE.SphereGeometry(0.02, 8, 8);
    const mouseHeadMesh = new THREE.Mesh(mouseHeadGeo, marbleMaterialDark);
    mouseHeadMesh.position.set(
        pos[0] + Math.sin(angle) * 0.04,
        pos[1] + 0.01,
        pos[2] + Math.cos(angle) * 0.04
    );
    group.add(mouseHeadMesh);

    // Mouse tail
    const tailGeo = new THREE.CylinderGeometry(0.003, 0.006, 0.06, 6);
    const tailMesh = new THREE.Mesh(tailGeo, marbleMaterialDark);
    tailMesh.position.set(
        pos[0] - Math.sin(angle) * 0.04,
        pos[1],
        pos[2] - Math.cos(angle) * 0.04
    );
    tailMesh.rotation.z = Math.PI / 3;
    tailMesh.rotation.y = angle;
    group.add(tailMesh);
});
`
    },

    // #17 - The Crowd in the Temple
    crowd_temple: {
        name: "The Crowd in the Temple",
        geometry: () => `
// Temple base/floor
const floorGeo = new THREE.BoxGeometry(1.2, 0.05, 0.8);
const floorMesh = new THREE.Mesh(floorGeo, marbleMaterialDark);
floorMesh.position.set(0, 0.025, 0);
group.add(floorMesh);

// Temple columns (2 in back)
const columnPositions = [[-0.4, 0.5, -0.3], [0.4, 0.5, -0.3]];
columnPositions.forEach(pos => {
    const colGeo = new THREE.CylinderGeometry(0.06, 0.07, 1.0, 12);
    const colMesh = new THREE.Mesh(colGeo, marbleMaterial);
    colMesh.position.set(...pos);
    group.add(colMesh);

    // Column capital
    const capGeo = new THREE.BoxGeometry(0.15, 0.06, 0.15);
    const capMesh = new THREE.Mesh(capGeo, marbleMaterial);
    capMesh.position.set(pos[0], 1.03, pos[2]);
    group.add(capMesh);
});

// Crowd - multiple simple figures
const crowdPositions = [
    [-0.25, 0.25, 0.1], [-0.1, 0.25, 0.15], [0.05, 0.25, 0.08],
    [0.2, 0.25, 0.12], [-0.15, 0.25, -0.1], [0.1, 0.25, -0.08],
    [-0.3, 0.25, 0.25], [0.25, 0.25, 0.22]
];

crowdPositions.forEach(pos => {
    // Body
    const bodyGeo = new THREE.ConeGeometry(0.06, 0.35, 8);
    const bodyMesh = new THREE.Mesh(bodyGeo, marbleMaterial);
    bodyMesh.position.set(...pos);
    group.add(bodyMesh);

    // Head
    const headGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
    headMesh.position.set(pos[0], pos[1] + 0.22, pos[2]);
    group.add(headMesh);
});

// Dog among crowd
const dogBodyGeo = new THREE.SphereGeometry(0.05, 8, 8);
const dogBodyMesh = new THREE.Mesh(dogBodyGeo, marbleMaterialDark);
dogBodyMesh.position.set(0.15, 0.08, 0.2);
dogBodyMesh.scale.set(1.5, 0.8, 0.8);
group.add(dogBodyMesh);

const dogHeadGeo = new THREE.SphereGeometry(0.03, 8, 8);
const dogHeadMesh = new THREE.Mesh(dogHeadGeo, marbleMaterialDark);
dogHeadMesh.position.set(0.22, 0.1, 0.2);
group.add(dogHeadMesh);

// Young man with banner (elevated, apart)
const bannerManGeo = new THREE.CylinderGeometry(0.05, 0.08, 0.5, 10);
const bannerManMesh = new THREE.Mesh(bannerManGeo, marbleMaterialLight);
bannerManMesh.position.set(-0.45, 0.35, 0.2);
group.add(bannerManMesh);

const bannerHeadGeo = new THREE.SphereGeometry(0.05, 10, 10);
const bannerHeadMesh = new THREE.Mesh(bannerHeadGeo, marbleMaterialLight);
bannerHeadMesh.position.set(-0.45, 0.65, 0.2);
group.add(bannerHeadMesh);

// Banner pole
const poleGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.6, 6);
const poleMesh = new THREE.Mesh(poleGeo, marbleMaterial);
poleMesh.position.set(-0.42, 0.7, 0.22);
poleMesh.rotation.z = 0.2;
group.add(poleMesh);

// Banner flag
const flagGeo = new THREE.BoxGeometry(0.2, 0.15, 0.01);
const flagMesh = new THREE.Mesh(flagGeo, marbleMaterialLight);
flagMesh.position.set(-0.32, 0.9, 0.23);
group.add(flagMesh);

// Moon (crescent shape in background)
const moonGeo = new THREE.TorusGeometry(0.1, 0.03, 8, 16, Math.PI * 1.5);
const moonMesh = new THREE.Mesh(moonGeo, marbleMaterialLight);
moonMesh.position.set(0.3, 1.1, -0.35);
moonMesh.rotation.z = 0.5;
group.add(moonMesh);
`
    },
};

// Generate HTML for export
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
        await page.waitForFunction('window.exportComplete === true', { timeout: 30000 });

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
    log('=== Starting Statue Generation ===');

    // Check existing files
    const existingFiles = fs.readdirSync(MODELS_DIR)
        .filter(f => f.endsWith('.gltf') && !f.includes('/'));
    log(`Found ${existingFiles.length} existing GLTF files`);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox']
    });

    let generated = 0;
    let skipped = 0;
    let failed = 0;

    for (const [key, statue] of Object.entries(STATUES)) {
        const filename = `${key}.gltf`;

        if (existingFiles.includes(filename)) {
            log(`SKIP: ${filename} already exists`);
            skipped++;
            continue;
        }

        const success = await exportStatue(browser, filename, statue);
        if (success) {
            generated++;
        } else {
            failed++;
        }
    }

    await browser.close();

    log('=== Generation Complete ===');
    log(`Generated: ${generated}, Skipped: ${skipped}, Failed: ${failed}`);
}

main().catch(err => {
    log(`FATAL: ${err.message}`);
    process.exit(1);
});
