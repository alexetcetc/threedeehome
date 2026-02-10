/**
 * Generate All Piranesi Statues - Complete Generator
 * Generates GLTF files for all 51 statues from statues.md
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const MODELS_DIR = '/Users/alex/Documents/threedeehome/models';
const LOG_FILE = '/Users/alex/Documents/threedeehome/generation_progress.log';

function log(msg) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${msg}`;
    console.log(line);
    fs.appendFileSync(LOG_FILE, line + '\n');
}

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

const marbleMaterialLight = new THREE.MeshStandardMaterial({ color: 0xd8d4cc, roughness: 0.7, metalness: 0.0 });
const marbleMaterial = new THREE.MeshStandardMaterial({ color: 0xd0ccc4, roughness: 0.75, metalness: 0.0 });
const marbleMaterialDark = new THREE.MeshStandardMaterial({ color: 0xc8c4bc, roughness: 0.8, metalness: 0.0 });

try {
${geometryCode}
    scene.add(group);

    const exporter = new THREE.GLTFExporter();
    exporter.parse(scene, function(gltf) {
        window.gltfData = JSON.stringify(gltf);
        window.exportComplete = true;
    }, { binary: false });
} catch(e) {
    window.exportError = e.message;
    window.exportComplete = true;
}
</script>
</body>
</html>`;
}

async function exportStatue(browser, filename, geometryCode, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        const page = await browser.newPage();
        try {
            const html = generateHTML(geometryCode);
            await page.setContent(html);
            await page.waitForFunction('window.exportComplete === true', { timeout: 30000 });

            const error = await page.evaluate(() => window.exportError);
            if (error) {
                throw new Error(error);
            }

            const gltfData = await page.evaluate(() => window.gltfData);
            const filepath = path.join(MODELS_DIR, filename);
            fs.writeFileSync(filepath, gltfData);

            const stats = fs.statSync(filepath);
            const gltf = JSON.parse(gltfData);
            const meshCount = gltf.meshes ? gltf.meshes.length : 0;

            log(`SUCCESS: ${filename} - ${meshCount} meshes, ${(stats.size / 1024).toFixed(1)} KB`);
            return true;
        } catch (err) {
            log(`ATTEMPT ${attempt}/${retries} FAILED: ${filename} - ${err.message}`);
            if (attempt < retries) {
                await new Promise(r => setTimeout(r, 2000));
            }
        } finally {
            await page.close();
        }
    }
    return false;
}

// All statue definitions
const STATUES = {
    // #6 - Young Boy Playing Cymbals
    boy_cymbals: `
const bodyGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.5, 12);
const bodyMesh = new THREE.Mesh(bodyGeo, marbleMaterial);
bodyMesh.position.set(0, 0.35, 0);
group.add(bodyMesh);

const legLGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.35, 10);
const legLMesh = new THREE.Mesh(legLGeo, marbleMaterial);
legLMesh.position.set(-0.08, 0.05, 0);
group.add(legLMesh);

const legRGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.35, 10);
const legRMesh = new THREE.Mesh(legRGeo, marbleMaterial);
legRMesh.position.set(0.08, 0.05, 0);
group.add(legRMesh);

const torsoGeo = new THREE.SphereGeometry(0.14, 12, 12);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0, 0.55, 0);
torsoMesh.scale.set(1, 1.2, 0.8);
group.add(torsoMesh);

const headGeo = new THREE.SphereGeometry(0.1, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 0.78, 0);
group.add(headMesh);

for (let i = 0; i < 6; i++) {
    const curlGeo = new THREE.SphereGeometry(0.03, 8, 8);
    const curlMesh = new THREE.Mesh(curlGeo, marbleMaterial);
    const angle = (i / 6) * Math.PI * 2;
    curlMesh.position.set(Math.sin(angle) * 0.08, 0.86, Math.cos(angle) * 0.06);
    group.add(curlMesh);
}

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

const cymbalLGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16);
const cymbalLMesh = new THREE.Mesh(cymbalLGeo, marbleMaterialLight);
cymbalLMesh.position.set(-0.32, 0.92, 0);
cymbalLMesh.rotation.z = 0.3;
group.add(cymbalLMesh);

const cymbalRGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16);
const cymbalRMesh = new THREE.Mesh(cymbalRGeo, marbleMaterialLight);
cymbalRMesh.position.set(0.32, 0.92, 0);
cymbalRMesh.rotation.z = -0.3;
group.add(cymbalRMesh);
`,

    // #9 - Man Trampled by Centaur
    man_centaur: `
const horseBodyGeo = new THREE.SphereGeometry(0.35, 14, 14);
const horseBodyMesh = new THREE.Mesh(horseBodyGeo, marbleMaterial);
horseBodyMesh.position.set(0, 0.6, 0);
horseBodyMesh.scale.set(1.5, 0.9, 0.9);
group.add(horseBodyMesh);

const hindGeo = new THREE.SphereGeometry(0.28, 12, 12);
const hindMesh = new THREE.Mesh(hindGeo, marbleMaterial);
hindMesh.position.set(-0.4, 0.55, 0);
group.add(hindMesh);

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

const backLegLGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.55, 10);
const backLegLMesh = new THREE.Mesh(backLegLGeo, marbleMaterial);
backLegLMesh.position.set(-0.45, 0.28, 0.15);
group.add(backLegLMesh);

const backLegRGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.55, 10);
const backLegRMesh = new THREE.Mesh(backLegRGeo, marbleMaterial);
backLegRMesh.position.set(-0.45, 0.28, -0.15);
group.add(backLegRMesh);

const centaurTorsoGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.4, 12);
const centaurTorsoMesh = new THREE.Mesh(centaurTorsoGeo, marbleMaterial);
centaurTorsoMesh.position.set(0.25, 1.0, 0);
centaurTorsoMesh.rotation.z = -0.2;
group.add(centaurTorsoMesh);

const centaurHeadGeo = new THREE.SphereGeometry(0.1, 12, 12);
const centaurHeadMesh = new THREE.Mesh(centaurHeadGeo, marbleMaterial);
centaurHeadMesh.position.set(0.3, 1.28, 0);
group.add(centaurHeadMesh);

const manBodyGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.5, 10);
const manBodyMesh = new THREE.Mesh(manBodyGeo, marbleMaterialDark);
manBodyMesh.position.set(0.45, 0.1, 0);
manBodyMesh.rotation.z = Math.PI / 2;
group.add(manBodyMesh);

const manHeadGeo = new THREE.SphereGeometry(0.08, 10, 10);
const manHeadMesh = new THREE.Mesh(manHeadGeo, marbleMaterialDark);
manHeadMesh.position.set(0.7, 0.1, 0);
group.add(manHeadMesh);

const manArmGeo = new THREE.CylinderGeometry(0.03, 0.04, 0.25, 8);
const manArmMesh = new THREE.Mesh(manArmGeo, marbleMaterialDark);
manArmMesh.position.set(0.5, 0.25, 0);
manArmMesh.rotation.z = -0.5;
group.add(manArmMesh);
`,

    // #10 - The Gardener
    gardener: `
const robeGeo = new THREE.ConeGeometry(0.28, 0.9, 12);
const robeMesh = new THREE.Mesh(robeGeo, marbleMaterial);
robeMesh.position.set(0, 0.45, 0);
group.add(robeMesh);

const torsoGeo = new THREE.CylinderGeometry(0.14, 0.18, 0.35, 12);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0.05, 0.95, 0.05);
torsoMesh.rotation.x = 0.3;
group.add(torsoMesh);

const headGeo = new THREE.SphereGeometry(0.11, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0.1, 1.22, 0.08);
group.add(headMesh);

const hatGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.06, 10);
const hatMesh = new THREE.Mesh(hatGeo, marbleMaterialDark);
hatMesh.position.set(0.1, 1.32, 0.06);
group.add(hatMesh);

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

const handleGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8);
const handleMesh = new THREE.Mesh(handleGeo, marbleMaterialDark);
handleMesh.position.set(0.1, 0.6, 0.25);
handleMesh.rotation.x = 0.4;
group.add(handleMesh);

const bladeGeo = new THREE.BoxGeometry(0.15, 0.2, 0.02);
const bladeMesh = new THREE.Mesh(bladeGeo, marbleMaterialDark);
bladeMesh.position.set(0.1, 0.15, 0.35);
bladeMesh.rotation.x = 0.4;
group.add(bladeMesh);

const moundGeo = new THREE.SphereGeometry(0.2, 10, 10);
const moundMesh = new THREE.Mesh(moundGeo, marbleMaterialDark);
moundMesh.position.set(0.15, 0.05, 0.3);
moundMesh.scale.set(1.5, 0.4, 1);
group.add(moundMesh);
`,

    // #12 - The Ship on Waves
    ship_waves: `
for (let i = 0; i < 5; i++) {
    const waveGeo = new THREE.TorusGeometry(0.4 - i * 0.05, 0.06, 8, 16, Math.PI);
    const waveMesh = new THREE.Mesh(waveGeo, marbleMaterialDark);
    waveMesh.position.set(i * 0.08 - 0.15, 0.1 + i * 0.03, 0);
    waveMesh.rotation.x = -Math.PI / 2;
    waveMesh.rotation.z = i * 0.1;
    group.add(waveMesh);
}

const hullGeo = new THREE.CylinderGeometry(0.08, 0.15, 0.6, 12);
const hullMesh = new THREE.Mesh(hullGeo, marbleMaterial);
hullMesh.position.set(0, 0.4, 0);
hullMesh.rotation.z = Math.PI / 2;
hullMesh.scale.set(0.6, 1, 0.8);
group.add(hullMesh);

const deckGeo = new THREE.BoxGeometry(0.5, 0.03, 0.22);
const deckMesh = new THREE.Mesh(deckGeo, marbleMaterial);
deckMesh.position.set(0, 0.48, 0);
group.add(deckMesh);

const mastGeo = new THREE.CylinderGeometry(0.02, 0.025, 0.7, 8);
const mastMesh = new THREE.Mesh(mastGeo, marbleMaterial);
mastMesh.position.set(0, 0.8, 0);
group.add(mastMesh);

const sailGeo = new THREE.BoxGeometry(0.35, 0.4, 0.02);
const sailMesh = new THREE.Mesh(sailGeo, marbleMaterialLight);
sailMesh.position.set(0, 0.85, 0.08);
sailMesh.rotation.y = 0.1;
group.add(sailMesh);

const bowGeo = new THREE.ConeGeometry(0.08, 0.2, 8);
const bowMesh = new THREE.Mesh(bowGeo, marbleMaterial);
bowMesh.position.set(0.35, 0.4, 0);
bowMesh.rotation.z = -Math.PI / 2;
group.add(bowMesh);

const sternGeo = new THREE.BoxGeometry(0.08, 0.2, 0.15);
const sternMesh = new THREE.Mesh(sternGeo, marbleMaterial);
sternMesh.position.set(-0.28, 0.45, 0);
group.add(sternMesh);
`,

    // #13 - Man Reading Large Book
    man_book: `
const robeGeo = new THREE.ConeGeometry(0.35, 1.1, 12);
const robeMesh = new THREE.Mesh(robeGeo, marbleMaterial);
robeMesh.position.set(0, 0.55, 0);
group.add(robeMesh);

const torsoGeo = new THREE.CylinderGeometry(0.16, 0.22, 0.4, 12);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0, 1.15, 0);
group.add(torsoMesh);

const hoodGeo = new THREE.SphereGeometry(0.14, 12, 12);
const hoodMesh = new THREE.Mesh(hoodGeo, marbleMaterial);
hoodMesh.position.set(0, 1.42, 0);
group.add(hoodMesh);

const hoodTopGeo = new THREE.SphereGeometry(0.15, 10, 10);
const hoodTopMesh = new THREE.Mesh(hoodTopGeo, marbleMaterial);
hoodTopMesh.position.set(0, 1.48, -0.05);
hoodTopMesh.scale.set(1, 0.7, 1.2);
group.add(hoodTopMesh);

const faceGeo = new THREE.SphereGeometry(0.08, 10, 10);
const faceMesh = new THREE.Mesh(faceGeo, marbleMaterialDark);
faceMesh.position.set(0, 1.40, 0.08);
group.add(faceMesh);

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

const spineGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.35, 8);
const spineMesh = new THREE.Mesh(spineGeo, marbleMaterialDark);
spineMesh.position.set(0, 0.95, 0.18);
group.add(spineMesh);
`,

    // #14 - Woman with Cloud Shield
    woman_cloud_shield: `
const robeGeo = new THREE.ConeGeometry(0.32, 1.0, 12);
const robeMesh = new THREE.Mesh(robeGeo, marbleMaterial);
robeMesh.position.set(0, 0.5, 0);
group.add(robeMesh);

const torsoGeo = new THREE.CylinderGeometry(0.14, 0.2, 0.4, 12);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0, 1.05, 0);
group.add(torsoMesh);

const headGeo = new THREE.SphereGeometry(0.11, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 1.38, 0);
group.add(headMesh);

const hairGeo = new THREE.SphereGeometry(0.12, 10, 10);
const hairMesh = new THREE.Mesh(hairGeo, marbleMaterial);
hairMesh.position.set(0, 1.44, -0.03);
hairMesh.scale.set(1, 0.8, 1);
group.add(hairMesh);

const armLGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.4, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.25, 1.0, 0.1);
armLMesh.rotation.set(0.3, 0, 0.5);
group.add(armLMesh);

const shieldGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.04, 20);
const shieldMesh = new THREE.Mesh(shieldGeo, marbleMaterialLight);
shieldMesh.position.set(-0.35, 0.85, 0.15);
shieldMesh.rotation.set(0.2, 0.6, 0.1);
group.add(shieldMesh);

const rimGeo = new THREE.TorusGeometry(0.35, 0.03, 8, 20);
const rimMesh = new THREE.Mesh(rimGeo, marbleMaterial);
rimMesh.position.set(-0.35, 0.85, 0.17);
rimMesh.rotation.set(0.2, 0.6, 0.1);
group.add(rimMesh);

const cloudPositions = [[-0.32, 0.9, 0.22], [-0.4, 0.8, 0.2], [-0.28, 0.78, 0.21]];
cloudPositions.forEach(pos => {
    const cloudGeo = new THREE.SphereGeometry(0.08, 10, 10);
    const cloudMesh = new THREE.Mesh(cloudGeo, marbleMaterial);
    cloudMesh.position.set(...pos);
    cloudMesh.scale.set(1.3, 0.8, 0.5);
    group.add(cloudMesh);
});
`,

    // #15 - Child Examining Flower
    child_flower: `
const bodyGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.4, 12);
const bodyMesh = new THREE.Mesh(bodyGeo, marbleMaterial);
bodyMesh.position.set(0, 0.3, 0);
bodyMesh.rotation.x = 0.4;
group.add(bodyMesh);

const legLGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.3, 10);
const legLMesh = new THREE.Mesh(legLGeo, marbleMaterial);
legLMesh.position.set(-0.06, 0.08, -0.08);
group.add(legLMesh);

const legRGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.3, 10);
const legRMesh = new THREE.Mesh(legRGeo, marbleMaterial);
legRMesh.position.set(0.06, 0.08, -0.08);
group.add(legRMesh);

const headGeo = new THREE.SphereGeometry(0.09, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 0.52, 0.15);
group.add(headMesh);

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

const stemGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.15, 6);
const stemMesh = new THREE.Mesh(stemGeo, marbleMaterialDark);
stemMesh.position.set(0, 0.15, 0.32);
group.add(stemMesh);

for (let i = 0; i < 5; i++) {
    const petalGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const petalMesh = new THREE.Mesh(petalGeo, marbleMaterialLight);
    const angle = (i / 5) * Math.PI * 2;
    petalMesh.position.set(Math.sin(angle) * 0.03, 0.24, 0.32 + Math.cos(angle) * 0.03);
    petalMesh.scale.set(1, 0.5, 1);
    group.add(petalMesh);
}

const centerGeo = new THREE.SphereGeometry(0.015, 8, 8);
const centerMesh = new THREE.Mesh(centerGeo, marbleMaterial);
centerMesh.position.set(0, 0.24, 0.32);
group.add(centerMesh);
`,

    // #16 - Sack of Grain Devoured by Mice
    grain_mice: `
const sackBaseGeo = new THREE.SphereGeometry(0.35, 12, 12);
const sackBaseMesh = new THREE.Mesh(sackBaseGeo, marbleMaterial);
sackBaseMesh.position.set(0, 0.25, 0);
sackBaseMesh.scale.set(1, 0.8, 0.9);
group.add(sackBaseMesh);

const sackTopGeo = new THREE.CylinderGeometry(0.15, 0.25, 0.3, 10);
const sackTopMesh = new THREE.Mesh(sackTopGeo, marbleMaterial);
sackTopMesh.position.set(0, 0.55, 0);
group.add(sackTopMesh);

const tearGeo = new THREE.TorusGeometry(0.12, 0.03, 8, 12, Math.PI);
const tearMesh = new THREE.Mesh(tearGeo, marbleMaterialDark);
tearMesh.position.set(0.15, 0.35, 0.2);
tearMesh.rotation.set(0.5, 0.3, 0.2);
group.add(tearMesh);

const grainPileGeo = new THREE.SphereGeometry(0.2, 10, 10);
const grainPileMesh = new THREE.Mesh(grainPileGeo, marbleMaterialLight);
grainPileMesh.position.set(0.25, 0.08, 0.2);
grainPileMesh.scale.set(1.2, 0.4, 1);
group.add(grainPileMesh);

const mousePositions = [[0.2, 0.3, 0.25], [-0.15, 0.2, 0.28], [0.3, 0.1, 0.18], [0.15, 0.05, 0.3], [-0.2, 0.15, 0.22], [0.05, 0.45, 0.18]];
mousePositions.forEach((pos, i) => {
    const mouseBodyGeo = new THREE.SphereGeometry(0.035, 8, 8);
    const mouseBodyMesh = new THREE.Mesh(mouseBodyGeo, marbleMaterialDark);
    mouseBodyMesh.position.set(...pos);
    mouseBodyMesh.scale.set(1.4, 0.8, 0.9);
    const angle = i * 1.1;
    mouseBodyMesh.rotation.y = angle;
    group.add(mouseBodyMesh);

    const mouseHeadGeo = new THREE.SphereGeometry(0.02, 8, 8);
    const mouseHeadMesh = new THREE.Mesh(mouseHeadGeo, marbleMaterialDark);
    mouseHeadMesh.position.set(pos[0] + Math.sin(angle) * 0.04, pos[1] + 0.01, pos[2] + Math.cos(angle) * 0.04);
    group.add(mouseHeadMesh);
});
`,

    // #17 - The Crowd in the Temple
    crowd_temple: `
const floorGeo = new THREE.BoxGeometry(1.2, 0.05, 0.8);
const floorMesh = new THREE.Mesh(floorGeo, marbleMaterialDark);
floorMesh.position.set(0, 0.025, 0);
group.add(floorMesh);

const columnPositions = [[-0.4, 0.5, -0.3], [0.4, 0.5, -0.3]];
columnPositions.forEach(pos => {
    const colGeo = new THREE.CylinderGeometry(0.06, 0.07, 1.0, 12);
    const colMesh = new THREE.Mesh(colGeo, marbleMaterial);
    colMesh.position.set(...pos);
    group.add(colMesh);
});

const crowdPositions = [[-0.25, 0.25, 0.1], [-0.1, 0.25, 0.15], [0.05, 0.25, 0.08], [0.2, 0.25, 0.12], [-0.15, 0.25, -0.1], [0.1, 0.25, -0.08]];
crowdPositions.forEach(pos => {
    const bodyGeo = new THREE.ConeGeometry(0.06, 0.35, 8);
    const bodyMesh = new THREE.Mesh(bodyGeo, marbleMaterial);
    bodyMesh.position.set(...pos);
    group.add(bodyMesh);

    const headGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
    headMesh.position.set(pos[0], pos[1] + 0.22, pos[2]);
    group.add(headMesh);
});

const bannerManGeo = new THREE.CylinderGeometry(0.05, 0.08, 0.5, 10);
const bannerManMesh = new THREE.Mesh(bannerManGeo, marbleMaterialLight);
bannerManMesh.position.set(-0.45, 0.35, 0.2);
group.add(bannerManMesh);

const poleGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.6, 6);
const poleMesh = new THREE.Mesh(poleGeo, marbleMaterial);
poleMesh.position.set(-0.42, 0.7, 0.22);
group.add(poleMesh);

const flagGeo = new THREE.BoxGeometry(0.2, 0.15, 0.01);
const flagMesh = new THREE.Mesh(flagGeo, marbleMaterialLight);
flagMesh.position.set(-0.32, 0.9, 0.23);
group.add(flagMesh);
`,

    // #18 - Minotaur Standing Guard
    minotaur_guard: `
const legLGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.6, 12);
const legLMesh = new THREE.Mesh(legLGeo, marbleMaterial);
legLMesh.position.set(-0.12, 0.3, 0);
group.add(legLMesh);

const legRGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.6, 12);
const legRMesh = new THREE.Mesh(legRGeo, marbleMaterial);
legRMesh.position.set(0.12, 0.3, 0);
group.add(legRMesh);

const torsoGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.5, 14);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0, 0.85, 0);
group.add(torsoMesh);

const chestGeo = new THREE.SphereGeometry(0.2, 12, 12);
const chestMesh = new THREE.Mesh(chestGeo, marbleMaterial);
chestMesh.position.set(0, 0.95, 0.05);
chestMesh.scale.set(1.2, 1, 0.8);
group.add(chestMesh);

const neckGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.15, 10);
const neckMesh = new THREE.Mesh(neckGeo, marbleMaterial);
neckMesh.position.set(0, 1.18, 0);
group.add(neckMesh);

const headGeo = new THREE.SphereGeometry(0.14, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 1.38, 0.02);
headMesh.scale.set(0.9, 1.1, 1);
group.add(headMesh);

const snoutGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.15, 10);
const snoutMesh = new THREE.Mesh(snoutGeo, marbleMaterial);
snoutMesh.position.set(0, 1.32, 0.15);
snoutMesh.rotation.x = Math.PI / 2;
group.add(snoutMesh);

const hornLGeo = new THREE.ConeGeometry(0.03, 0.2, 8);
const hornLMesh = new THREE.Mesh(hornLGeo, marbleMaterialLight);
hornLMesh.position.set(-0.12, 1.52, 0);
hornLMesh.rotation.z = 0.3;
group.add(hornLMesh);

const hornRGeo = new THREE.ConeGeometry(0.03, 0.2, 8);
const hornRMesh = new THREE.Mesh(hornRGeo, marbleMaterialLight);
hornRMesh.position.set(0.12, 1.52, 0);
hornRMesh.rotation.z = -0.3;
group.add(hornRMesh);

const armLGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.4, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.28, 0.85, 0);
armLMesh.rotation.z = 0.15;
group.add(armLMesh);

const armRGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.4, 10);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.28, 0.85, 0);
armRMesh.rotation.z = -0.15;
group.add(armRMesh);
`,

    // #19 - Minotaur Seated
    minotaur_seated: `
const seatGeo = new THREE.BoxGeometry(0.5, 0.3, 0.4);
const seatMesh = new THREE.Mesh(seatGeo, marbleMaterialDark);
seatMesh.position.set(0, 0.15, 0);
group.add(seatMesh);

const legLGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.35, 12);
const legLMesh = new THREE.Mesh(legLGeo, marbleMaterial);
legLMesh.position.set(-0.15, 0.15, 0.2);
legLMesh.rotation.x = Math.PI / 2.5;
group.add(legLMesh);

const legRGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.35, 12);
const legRMesh = new THREE.Mesh(legRGeo, marbleMaterial);
legRMesh.position.set(0.15, 0.15, 0.2);
legRMesh.rotation.x = Math.PI / 2.5;
group.add(legRMesh);

const torsoGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.45, 14);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0, 0.55, 0);
group.add(torsoMesh);

const headGeo = new THREE.SphereGeometry(0.14, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 0.95, 0.02);
headMesh.scale.set(0.9, 1.1, 1);
group.add(headMesh);

const snoutGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.12, 10);
const snoutMesh = new THREE.Mesh(snoutGeo, marbleMaterial);
snoutMesh.position.set(0, 0.9, 0.14);
snoutMesh.rotation.x = Math.PI / 2;
group.add(snoutMesh);

const hornLGeo = new THREE.ConeGeometry(0.03, 0.18, 8);
const hornLMesh = new THREE.Mesh(hornLGeo, marbleMaterialLight);
hornLMesh.position.set(-0.11, 1.1, 0);
hornLMesh.rotation.z = 0.3;
group.add(hornLMesh);

const hornRGeo = new THREE.ConeGeometry(0.03, 0.18, 8);
const hornRMesh = new THREE.Mesh(hornRGeo, marbleMaterialLight);
hornRMesh.position.set(0.11, 1.1, 0);
hornRMesh.rotation.z = -0.3;
group.add(hornRMesh);

const armLGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.35, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.22, 0.5, 0.12);
armLMesh.rotation.set(0.5, 0, 0.3);
group.add(armLMesh);

const armRGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.35, 10);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.22, 0.5, 0.12);
armRMesh.rotation.set(0.5, 0, -0.3);
group.add(armRMesh);
`,

    // #20 - Minotaur Walking
    minotaur_walking: `
const legLGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.55, 12);
const legLMesh = new THREE.Mesh(legLGeo, marbleMaterial);
legLMesh.position.set(-0.1, 0.28, 0.15);
legLMesh.rotation.x = -0.3;
group.add(legLMesh);

const legRGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.55, 12);
const legRMesh = new THREE.Mesh(legRGeo, marbleMaterial);
legRMesh.position.set(0.1, 0.28, -0.1);
legRMesh.rotation.x = 0.25;
group.add(legRMesh);

const torsoGeo = new THREE.CylinderGeometry(0.17, 0.21, 0.48, 14);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0, 0.82, 0);
torsoMesh.rotation.x = 0.1;
group.add(torsoMesh);

const headGeo = new THREE.SphereGeometry(0.13, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 1.2, 0.05);
headMesh.scale.set(0.9, 1.1, 1);
group.add(headMesh);

const snoutGeo = new THREE.CylinderGeometry(0.055, 0.075, 0.12, 10);
const snoutMesh = new THREE.Mesh(snoutGeo, marbleMaterial);
snoutMesh.position.set(0, 1.14, 0.16);
snoutMesh.rotation.x = Math.PI / 2;
group.add(snoutMesh);

const hornLGeo = new THREE.ConeGeometry(0.03, 0.18, 8);
const hornLMesh = new THREE.Mesh(hornLGeo, marbleMaterialLight);
hornLMesh.position.set(-0.1, 1.35, 0.02);
hornLMesh.rotation.z = 0.3;
group.add(hornLMesh);

const hornRGeo = new THREE.ConeGeometry(0.03, 0.18, 8);
const hornRMesh = new THREE.Mesh(hornRGeo, marbleMaterialLight);
hornRMesh.position.set(0.1, 1.35, 0.02);
hornRMesh.rotation.z = -0.3;
group.add(hornRMesh);

const armLGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.38, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.25, 0.75, -0.05);
armLMesh.rotation.set(-0.3, 0, 0.2);
group.add(armLMesh);

const armRGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.38, 10);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.25, 0.75, 0.1);
armRMesh.rotation.set(0.3, 0, -0.2);
group.add(armRMesh);
`,

    // #21 - Minotaur Raging
    minotaur_raging: `
const legLGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.55, 12);
const legLMesh = new THREE.Mesh(legLGeo, marbleMaterial);
legLMesh.position.set(-0.15, 0.28, 0);
legLMesh.rotation.z = -0.15;
group.add(legLMesh);

const legRGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.55, 12);
const legRMesh = new THREE.Mesh(legRGeo, marbleMaterial);
legRMesh.position.set(0.15, 0.28, 0);
legRMesh.rotation.z = 0.15;
group.add(legRMesh);

const torsoGeo = new THREE.CylinderGeometry(0.2, 0.24, 0.5, 14);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0, 0.85, 0);
torsoMesh.rotation.x = -0.2;
group.add(torsoMesh);

const chestGeo = new THREE.SphereGeometry(0.22, 12, 12);
const chestMesh = new THREE.Mesh(chestGeo, marbleMaterial);
chestMesh.position.set(0, 0.9, 0.08);
chestMesh.scale.set(1.2, 1, 0.9);
group.add(chestMesh);

const headGeo = new THREE.SphereGeometry(0.15, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 1.22, 0.1);
headMesh.scale.set(0.9, 1.1, 1);
headMesh.rotation.x = -0.4;
group.add(headMesh);

const snoutGeo = new THREE.CylinderGeometry(0.06, 0.09, 0.14, 10);
const snoutMesh = new THREE.Mesh(snoutGeo, marbleMaterial);
snoutMesh.position.set(0, 1.12, 0.22);
snoutMesh.rotation.x = Math.PI / 2.5;
group.add(snoutMesh);

const hornLGeo = new THREE.ConeGeometry(0.035, 0.22, 8);
const hornLMesh = new THREE.Mesh(hornLGeo, marbleMaterialLight);
hornLMesh.position.set(-0.12, 1.35, 0.15);
hornLMesh.rotation.set(-0.4, 0, 0.4);
group.add(hornLMesh);

const hornRGeo = new THREE.ConeGeometry(0.035, 0.22, 8);
const hornRMesh = new THREE.Mesh(hornRGeo, marbleMaterialLight);
hornRMesh.position.set(0.12, 1.35, 0.15);
hornRMesh.rotation.set(-0.4, 0, -0.4);
group.add(hornRMesh);

const armLGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.42, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.35, 0.95, 0);
armLMesh.rotation.set(0, 0, 0.8);
group.add(armLMesh);

const armRGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.42, 10);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.35, 0.95, 0);
armRMesh.rotation.set(0, 0, -0.8);
group.add(armRMesh);
`,

    // #22 - Minotaur Mourning
    minotaur_mourning: `
const legLGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.55, 12);
const legLMesh = new THREE.Mesh(legLGeo, marbleMaterial);
legLMesh.position.set(-0.12, 0.28, 0);
group.add(legLMesh);

const legRGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.55, 12);
const legRMesh = new THREE.Mesh(legRGeo, marbleMaterial);
legRMesh.position.set(0.12, 0.28, 0);
group.add(legRMesh);

const torsoGeo = new THREE.CylinderGeometry(0.17, 0.21, 0.48, 14);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0, 0.82, 0);
torsoMesh.rotation.x = 0.25;
group.add(torsoMesh);

const headGeo = new THREE.SphereGeometry(0.14, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 1.12, 0.12);
headMesh.scale.set(0.9, 1.1, 1);
headMesh.rotation.x = 0.4;
group.add(headMesh);

const snoutGeo = new THREE.CylinderGeometry(0.055, 0.075, 0.12, 10);
const snoutMesh = new THREE.Mesh(snoutGeo, marbleMaterial);
snoutMesh.position.set(0, 1.02, 0.2);
snoutMesh.rotation.x = Math.PI / 2.2;
group.add(snoutMesh);

const hornLGeo = new THREE.ConeGeometry(0.028, 0.16, 8);
const hornLMesh = new THREE.Mesh(hornLGeo, marbleMaterialLight);
hornLMesh.position.set(-0.1, 1.25, 0.08);
hornLMesh.rotation.z = 0.3;
group.add(hornLMesh);

const hornRGeo = new THREE.ConeGeometry(0.028, 0.16, 8);
const hornRMesh = new THREE.Mesh(hornRGeo, marbleMaterialLight);
hornRMesh.position.set(0.1, 1.25, 0.08);
hornRMesh.rotation.z = -0.3;
group.add(hornRMesh);

const armLGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.35, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.1, 1.0, 0.15);
armLMesh.rotation.set(0.8, 0, 0.4);
group.add(armLMesh);

const armRGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.35, 10);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.1, 1.0, 0.15);
armRMesh.rotation.set(0.8, 0, -0.4);
group.add(armRMesh);

const handGeo = new THREE.SphereGeometry(0.08, 10, 10);
const handMesh = new THREE.Mesh(handGeo, marbleMaterial);
handMesh.position.set(0, 1.08, 0.28);
handMesh.scale.set(1.2, 0.8, 0.6);
group.add(handMesh);
`,

    // #23 - Minotaur Pointing
    minotaur_pointing: `
const legLGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.55, 12);
const legLMesh = new THREE.Mesh(legLGeo, marbleMaterial);
legLMesh.position.set(-0.12, 0.28, 0);
group.add(legLMesh);

const legRGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.55, 12);
const legRMesh = new THREE.Mesh(legRGeo, marbleMaterial);
legRMesh.position.set(0.12, 0.28, 0);
group.add(legRMesh);

const torsoGeo = new THREE.CylinderGeometry(0.17, 0.21, 0.48, 14);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0, 0.82, 0);
group.add(torsoMesh);

const headGeo = new THREE.SphereGeometry(0.13, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 1.18, 0.02);
headMesh.scale.set(0.9, 1.1, 1);
headMesh.rotation.y = 0.3;
group.add(headMesh);

const snoutGeo = new THREE.CylinderGeometry(0.055, 0.075, 0.12, 10);
const snoutMesh = new THREE.Mesh(snoutGeo, marbleMaterial);
snoutMesh.position.set(0.04, 1.12, 0.13);
snoutMesh.rotation.x = Math.PI / 2;
snoutMesh.rotation.y = 0.3;
group.add(snoutMesh);

const hornLGeo = new THREE.ConeGeometry(0.028, 0.17, 8);
const hornLMesh = new THREE.Mesh(hornLGeo, marbleMaterialLight);
hornLMesh.position.set(-0.1, 1.32, 0);
hornLMesh.rotation.z = 0.3;
group.add(hornLMesh);

const hornRGeo = new THREE.ConeGeometry(0.028, 0.17, 8);
const hornRMesh = new THREE.Mesh(hornRGeo, marbleMaterialLight);
hornRMesh.position.set(0.1, 1.32, 0);
hornRMesh.rotation.z = -0.3;
group.add(hornRMesh);

const armLGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.35, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.24, 0.82, 0);
armLMesh.rotation.z = 0.2;
group.add(armLMesh);

const armRGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.5, 10);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.4, 1.0, 0.1);
armRMesh.rotation.set(0.3, 0, -1.2);
group.add(armRMesh);

const handGeo = new THREE.SphereGeometry(0.04, 8, 8);
const handMesh = new THREE.Mesh(handGeo, marbleMaterial);
handMesh.position.set(0.65, 1.05, 0.15);
group.add(handMesh);

const fingerGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.1, 6);
const fingerMesh = new THREE.Mesh(fingerGeo, marbleMaterial);
fingerMesh.position.set(0.72, 1.06, 0.15);
fingerMesh.rotation.z = -Math.PI / 2;
group.add(fingerMesh);
`,

    // #24 - Minotaur Carrying Burden
    minotaur_burden: `
const legLGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.55, 12);
const legLMesh = new THREE.Mesh(legLGeo, marbleMaterial);
legLMesh.position.set(-0.12, 0.28, 0);
legLMesh.rotation.z = 0.05;
group.add(legLMesh);

const legRGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.55, 12);
const legRMesh = new THREE.Mesh(legRGeo, marbleMaterial);
legRMesh.position.set(0.12, 0.28, 0);
legRMesh.rotation.z = -0.05;
group.add(legRMesh);

const torsoGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.5, 14);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0, 0.85, 0);
torsoMesh.rotation.x = 0.2;
group.add(torsoMesh);

const headGeo = new THREE.SphereGeometry(0.13, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 1.15, 0.1);
headMesh.scale.set(0.9, 1.1, 1);
headMesh.rotation.x = 0.3;
group.add(headMesh);

const snoutGeo = new THREE.CylinderGeometry(0.055, 0.075, 0.12, 10);
const snoutMesh = new THREE.Mesh(snoutGeo, marbleMaterial);
snoutMesh.position.set(0, 1.08, 0.2);
snoutMesh.rotation.x = Math.PI / 2.3;
group.add(snoutMesh);

const hornLGeo = new THREE.ConeGeometry(0.028, 0.16, 8);
const hornLMesh = new THREE.Mesh(hornLGeo, marbleMaterialLight);
hornLMesh.position.set(-0.1, 1.28, 0.08);
hornLMesh.rotation.z = 0.3;
group.add(hornLMesh);

const hornRGeo = new THREE.ConeGeometry(0.028, 0.16, 8);
const hornRMesh = new THREE.Mesh(hornRGeo, marbleMaterialLight);
hornRMesh.position.set(0.1, 1.28, 0.08);
hornRMesh.rotation.z = -0.3;
group.add(hornRMesh);

const armLGeo = new THREE.CylinderGeometry(0.055, 0.065, 0.4, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.2, 1.1, 0);
armLMesh.rotation.set(0, 0, 1.2);
group.add(armLMesh);

const armRGeo = new THREE.CylinderGeometry(0.055, 0.065, 0.4, 10);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.2, 1.1, 0);
armRMesh.rotation.set(0, 0, -1.2);
group.add(armRMesh);

const burdenGeo = new THREE.BoxGeometry(0.45, 0.3, 0.35);
const burdenMesh = new THREE.Mesh(burdenGeo, marbleMaterialDark);
burdenMesh.position.set(0, 1.4, 0);
group.add(burdenMesh);
`,

    // #25 - Minotaur At Rest
    minotaur_rest: `
const groundGeo = new THREE.BoxGeometry(0.8, 0.08, 0.5);
const groundMesh = new THREE.Mesh(groundGeo, marbleMaterialDark);
groundMesh.position.set(0, 0.04, 0);
group.add(groundMesh);

const bodyGeo = new THREE.CylinderGeometry(0.2, 0.22, 0.7, 14);
const bodyMesh = new THREE.Mesh(bodyGeo, marbleMaterial);
bodyMesh.position.set(0, 0.25, 0);
bodyMesh.rotation.z = Math.PI / 2;
group.add(bodyMesh);

const legLGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.45, 12);
const legLMesh = new THREE.Mesh(legLGeo, marbleMaterial);
legLMesh.position.set(-0.25, 0.15, 0.2);
legLMesh.rotation.x = Math.PI / 3;
group.add(legLMesh);

const legRGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.45, 12);
const legRMesh = new THREE.Mesh(legRGeo, marbleMaterial);
legRMesh.position.set(-0.25, 0.15, -0.15);
legRMesh.rotation.x = -Math.PI / 4;
group.add(legRMesh);

const headGeo = new THREE.SphereGeometry(0.14, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0.35, 0.35, 0);
headMesh.scale.set(0.9, 1.1, 1);
group.add(headMesh);

const snoutGeo = new THREE.CylinderGeometry(0.055, 0.075, 0.1, 10);
const snoutMesh = new THREE.Mesh(snoutGeo, marbleMaterial);
snoutMesh.position.set(0.45, 0.3, 0);
snoutMesh.rotation.z = Math.PI / 2;
group.add(snoutMesh);

const hornLGeo = new THREE.ConeGeometry(0.025, 0.14, 8);
const hornLMesh = new THREE.Mesh(hornLGeo, marbleMaterialLight);
hornLMesh.position.set(0.35, 0.5, 0.1);
hornLMesh.rotation.x = -0.3;
group.add(hornLMesh);

const hornRGeo = new THREE.ConeGeometry(0.025, 0.14, 8);
const hornRMesh = new THREE.Mesh(hornRGeo, marbleMaterialLight);
hornRMesh.position.set(0.35, 0.5, -0.1);
hornRMesh.rotation.x = 0.3;
group.add(hornRMesh);

const armGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.3, 10);
const armMesh = new THREE.Mesh(armGeo, marbleMaterial);
armMesh.position.set(0.15, 0.35, 0.18);
armMesh.rotation.x = Math.PI / 3;
group.add(armMesh);
`,

    // #26 - Elephant Plain
    elephant_plain: `
const bodyGeo = new THREE.SphereGeometry(0.42, 16, 16);
const bodyMesh = new THREE.Mesh(bodyGeo, marbleMaterial);
bodyMesh.position.set(0, 0.55, 0);
bodyMesh.scale.set(1.4, 1.0, 0.85);
group.add(bodyMesh);

const hindGeo = new THREE.SphereGeometry(0.32, 12, 12);
const hindMesh = new THREE.Mesh(hindGeo, marbleMaterial);
hindMesh.position.set(-0.35, 0.5, 0);
group.add(hindMesh);

const headGeo = new THREE.SphereGeometry(0.22, 16, 16);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0.55, 0.65, 0);
group.add(headMesh);

const earLGeo = new THREE.SphereGeometry(0.15, 8, 8);
const earLMesh = new THREE.Mesh(earLGeo, marbleMaterial);
earLMesh.position.set(0.45, 0.70, 0.22);
earLMesh.scale.set(0.3, 0.8, 1);
group.add(earLMesh);

const earRGeo = new THREE.SphereGeometry(0.15, 8, 8);
const earRMesh = new THREE.Mesh(earRGeo, marbleMaterial);
earRMesh.position.set(0.45, 0.70, -0.22);
earRMesh.scale.set(0.3, 0.8, 1);
group.add(earRMesh);

const trunkGeo = new THREE.CylinderGeometry(0.05, 0.1, 0.45, 12);
const trunkMesh = new THREE.Mesh(trunkGeo, marbleMaterial);
trunkMesh.position.set(0.78, 0.4, 0);
trunkMesh.rotation.z = 0.5;
group.add(trunkMesh);

const tuskLGeo = new THREE.CylinderGeometry(0.015, 0.03, 0.22, 8);
const tuskLMesh = new THREE.Mesh(tuskLMesh, marbleMaterialLight);
tuskLMesh.position.set(0.7, 0.5, 0.1);
tuskLMesh.rotation.z = 0.7;
group.add(tuskLMesh);

const tuskRGeo = new THREE.CylinderGeometry(0.015, 0.03, 0.22, 8);
const tuskRMesh = new THREE.Mesh(tuskRGeo, marbleMaterialLight);
tuskRMesh.position.set(0.7, 0.5, -0.1);
tuskRMesh.rotation.z = 0.7;
group.add(tuskRMesh);

const legPositions = [[-0.28, 0.25, 0.2], [-0.28, 0.25, -0.2], [0.22, 0.25, 0.2], [0.22, 0.25, -0.2]];
legPositions.forEach(pos => {
    const legGeo = new THREE.CylinderGeometry(0.09, 0.1, 0.5, 12);
    const legMesh = new THREE.Mesh(legGeo, marbleMaterial);
    legMesh.position.set(...pos);
    group.add(legMesh);
});

const tailGeo = new THREE.CylinderGeometry(0.02, 0.035, 0.22, 8);
const tailMesh = new THREE.Mesh(tailGeo, marbleMaterial);
tailMesh.position.set(-0.58, 0.45, 0);
tailMesh.rotation.z = -0.4;
group.add(tailMesh);
`,

    // #27 - Elderly King with Crown (gulls nesting)
    elderly_king: `
const robeGeo = new THREE.ConeGeometry(0.35, 1.1, 12);
const robeMesh = new THREE.Mesh(robeGeo, marbleMaterial);
robeMesh.position.set(0, 0.55, 0);
group.add(robeMesh);

const torsoGeo = new THREE.CylinderGeometry(0.16, 0.22, 0.4, 12);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0, 1.15, 0);
group.add(torsoMesh);

const headGeo = new THREE.SphereGeometry(0.13, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 1.45, 0);
group.add(headMesh);

const beardGeo = new THREE.ConeGeometry(0.1, 0.2, 8);
const beardMesh = new THREE.Mesh(beardGeo, marbleMaterial);
beardMesh.position.set(0, 1.32, 0.08);
beardMesh.rotation.x = 0.3;
group.add(beardMesh);

const crownGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.1, 12);
const crownMesh = new THREE.Mesh(crownGeo, marbleMaterialLight);
crownMesh.position.set(0, 1.58, 0);
group.add(crownMesh);

for (let i = 0; i < 5; i++) {
    const pointGeo = new THREE.ConeGeometry(0.025, 0.08, 6);
    const pointMesh = new THREE.Mesh(pointGeo, marbleMaterialLight);
    const angle = (i / 5) * Math.PI * 2;
    pointMesh.position.set(Math.sin(angle) * 0.1, 1.66, Math.cos(angle) * 0.1);
    group.add(pointMesh);
}

const nestGeo = new THREE.TorusGeometry(0.08, 0.025, 8, 12);
const nestMesh = new THREE.Mesh(nestGeo, marbleMaterialDark);
nestMesh.position.set(0, 1.62, 0);
nestMesh.rotation.x = Math.PI / 2;
group.add(nestMesh);

const gullBodyGeo = new THREE.SphereGeometry(0.04, 8, 8);
const gullBodyMesh = new THREE.Mesh(gullBodyGeo, marbleMaterialLight);
gullBodyMesh.position.set(0, 1.68, 0);
gullBodyMesh.scale.set(1.2, 0.8, 0.8);
group.add(gullBodyMesh);

const gullHeadGeo = new THREE.SphereGeometry(0.02, 6, 6);
const gullHeadMesh = new THREE.Mesh(gullHeadGeo, marbleMaterialLight);
gullHeadMesh.position.set(0.04, 1.7, 0);
group.add(gullHeadMesh);
`,

    // #28 - Fox Teaching Students
    fox_teacher: `
const foxBodyGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.5, 12);
const foxBodyMesh = new THREE.Mesh(foxBodyGeo, marbleMaterial);
foxBodyMesh.position.set(0, 0.55, 0);
group.add(foxBodyMesh);

const foxHeadGeo = new THREE.SphereGeometry(0.1, 12, 12);
const foxHeadMesh = new THREE.Mesh(foxHeadGeo, marbleMaterial);
foxHeadMesh.position.set(0, 0.88, 0);
foxHeadMesh.scale.set(0.9, 1.1, 1);
group.add(foxHeadMesh);

const snoutGeo = new THREE.ConeGeometry(0.04, 0.12, 8);
const snoutMesh = new THREE.Mesh(snoutGeo, marbleMaterial);
snoutMesh.position.set(0, 0.85, 0.1);
snoutMesh.rotation.x = Math.PI / 2;
group.add(snoutMesh);

const earLGeo = new THREE.ConeGeometry(0.03, 0.08, 6);
const earLMesh = new THREE.Mesh(earLGeo, marbleMaterial);
earLMesh.position.set(-0.06, 1.0, 0);
earLMesh.rotation.z = 0.2;
group.add(earLMesh);

const earRGeo = new THREE.ConeGeometry(0.03, 0.08, 6);
const earRMesh = new THREE.Mesh(earRGeo, marbleMaterial);
earRMesh.position.set(0.06, 1.0, 0);
earRMesh.rotation.z = -0.2;
group.add(earRMesh);

const foxArmGeo = new THREE.CylinderGeometry(0.03, 0.04, 0.25, 8);
const foxArmMesh = new THREE.Mesh(foxArmGeo, marbleMaterial);
foxArmMesh.position.set(0.12, 0.7, 0.1);
foxArmMesh.rotation.set(0.5, 0, -0.5);
group.add(foxArmMesh);

const squirrelPositions = [[-0.25, 0.2, 0.15], [-0.15, 0.18, 0.22]];
squirrelPositions.forEach(pos => {
    const sqBodyGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const sqBodyMesh = new THREE.Mesh(sqBodyGeo, marbleMaterialLight);
    sqBodyMesh.position.set(...pos);
    sqBodyMesh.scale.set(0.8, 1.2, 0.8);
    group.add(sqBodyMesh);

    const sqHeadGeo = new THREE.SphereGeometry(0.03, 8, 8);
    const sqHeadMesh = new THREE.Mesh(sqHeadGeo, marbleMaterialLight);
    sqHeadMesh.position.set(pos[0], pos[1] + 0.1, pos[2] + 0.02);
    group.add(sqHeadMesh);
});

const satyrPositions = [[0.2, 0.22, 0.12], [0.28, 0.2, 0.2]];
satyrPositions.forEach(pos => {
    const satBodyGeo = new THREE.ConeGeometry(0.04, 0.15, 8);
    const satBodyMesh = new THREE.Mesh(satBodyGeo, marbleMaterialDark);
    satBodyMesh.position.set(...pos);
    group.add(satBodyMesh);

    const satHeadGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const satHeadMesh = new THREE.Mesh(satHeadGeo, marbleMaterialDark);
    satHeadMesh.position.set(pos[0], pos[1] + 0.1, pos[2]);
    group.add(satHeadMesh);

    const hornGeo = new THREE.ConeGeometry(0.008, 0.03, 4);
    const hornMesh = new THREE.Mesh(hornGeo, marbleMaterialDark);
    hornMesh.position.set(pos[0] + 0.02, pos[1] + 0.13, pos[2]);
    group.add(hornMesh);
});
`,

    // #29 - Man and Boy Mapping Stars
    star_mappers: `
const manRobeGeo = new THREE.ConeGeometry(0.25, 0.9, 12);
const manRobeMesh = new THREE.Mesh(manRobeGeo, marbleMaterial);
manRobeMesh.position.set(-0.15, 0.45, 0);
group.add(manRobeMesh);

const manTorsoGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.35, 12);
const manTorsoMesh = new THREE.Mesh(manTorsoGeo, marbleMaterial);
manTorsoMesh.position.set(-0.15, 0.98, 0);
group.add(manTorsoMesh);

const manHeadGeo = new THREE.SphereGeometry(0.1, 12, 12);
const manHeadMesh = new THREE.Mesh(manHeadGeo, marbleMaterial);
manHeadMesh.position.set(-0.15, 1.22, 0);
group.add(manHeadMesh);

const boyRobeGeo = new THREE.ConeGeometry(0.15, 0.5, 10);
const boyRobeMesh = new THREE.Mesh(boyRobeGeo, marbleMaterial);
boyRobeMesh.position.set(0.2, 0.25, 0);
group.add(boyRobeMesh);

const boyHeadGeo = new THREE.SphereGeometry(0.07, 10, 10);
const boyHeadMesh = new THREE.Mesh(boyHeadGeo, marbleMaterial);
boyHeadMesh.position.set(0.2, 0.6, 0);
group.add(boyHeadMesh);

const mapGeo = new THREE.BoxGeometry(0.35, 0.25, 0.01);
const mapMesh = new THREE.Mesh(mapGeo, marbleMaterialLight);
mapMesh.position.set(0.05, 0.85, 0.15);
mapMesh.rotation.set(-0.3, 0, 0);
group.add(mapMesh);

for (let i = 0; i < 8; i++) {
    const starGeo = new THREE.SphereGeometry(0.012, 6, 6);
    const starMesh = new THREE.Mesh(starGeo, marbleMaterialDark);
    starMesh.position.set(
        0.05 + (Math.random() - 0.5) * 0.25,
        0.85 + (Math.random() - 0.5) * 0.15,
        0.16
    );
    group.add(starMesh);
}

const manArmGeo = new THREE.CylinderGeometry(0.03, 0.04, 0.3, 8);
const manArmMesh = new THREE.Mesh(manArmGeo, marbleMaterial);
manArmMesh.position.set(-0.02, 0.95, 0.1);
manArmMesh.rotation.set(0.5, 0, -0.6);
group.add(manArmMesh);

const boyArmGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.2, 8);
const boyArmMesh = new THREE.Mesh(boyArmGeo, marbleMaterial);
boyArmMesh.position.set(0.12, 0.58, 0.08);
boyArmMesh.rotation.set(0.6, 0, 0.4);
group.add(boyArmMesh);
`,

    // #30 - Gardener Pruning Roses
    gardener_roses: `
const robeGeo = new THREE.ConeGeometry(0.28, 0.95, 12);
const robeMesh = new THREE.Mesh(robeGeo, marbleMaterial);
robeMesh.position.set(0, 0.48, 0);
group.add(robeMesh);

const torsoGeo = new THREE.CylinderGeometry(0.13, 0.18, 0.38, 12);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0, 1.0, 0.05);
torsoMesh.rotation.x = 0.2;
group.add(torsoMesh);

const headGeo = new THREE.SphereGeometry(0.1, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 1.28, 0.08);
group.add(headMesh);

const armLGeo = new THREE.CylinderGeometry(0.035, 0.045, 0.32, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.18, 0.95, 0.18);
armLMesh.rotation.set(0.7, 0, 0.4);
group.add(armLMesh);

const armRGeo = new THREE.CylinderGeometry(0.035, 0.045, 0.32, 10);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.15, 0.92, 0.2);
armRMesh.rotation.set(0.8, 0, -0.3);
group.add(armRMesh);

const shearsGeo = new THREE.BoxGeometry(0.15, 0.04, 0.02);
const shearsMesh = new THREE.Mesh(shearsGeo, marbleMaterialDark);
shearsMesh.position.set(0.02, 0.85, 0.35);
shearsMesh.rotation.y = 0.3;
group.add(shearsMesh);

const bushGeo = new THREE.SphereGeometry(0.25, 10, 10);
const bushMesh = new THREE.Mesh(bushGeo, marbleMaterialDark);
bushMesh.position.set(0.25, 0.35, 0.25);
bushMesh.scale.set(1, 1.2, 0.8);
group.add(bushMesh);

for (let i = 0; i < 4; i++) {
    const roseGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const roseMesh = new THREE.Mesh(roseGeo, marbleMaterialLight);
    roseMesh.position.set(
        0.25 + (Math.random() - 0.5) * 0.2,
        0.45 + Math.random() * 0.15,
        0.25 + (Math.random() - 0.5) * 0.15
    );
    group.add(roseMesh);
}
`,

    // #31 - Shepherdess with Lamb
    shepherdess_lamb: `
const robeGeo = new THREE.ConeGeometry(0.3, 1.0, 12);
const robeMesh = new THREE.Mesh(robeGeo, marbleMaterial);
robeMesh.position.set(0, 0.5, 0);
group.add(robeMesh);

const torsoGeo = new THREE.CylinderGeometry(0.14, 0.19, 0.38, 12);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0, 1.05, 0);
group.add(torsoMesh);

const headGeo = new THREE.SphereGeometry(0.11, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 1.38, 0);
group.add(headMesh);

const hairGeo = new THREE.SphereGeometry(0.12, 10, 10);
const hairMesh = new THREE.Mesh(hairGeo, marbleMaterial);
hairMesh.position.set(0, 1.44, -0.02);
hairMesh.scale.set(1, 0.75, 0.95);
group.add(hairMesh);

const armLGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.35, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.2, 0.95, 0.12);
armLMesh.rotation.set(0.5, 0, 0.5);
group.add(armLMesh);

const armRGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.35, 10);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.15, 0.9, 0.15);
armRMesh.rotation.set(0.7, 0, -0.3);
group.add(armRMesh);

const lambBodyGeo = new THREE.SphereGeometry(0.12, 10, 10);
const lambBodyMesh = new THREE.Mesh(lambBodyGeo, marbleMaterialLight);
lambBodyMesh.position.set(0, 0.85, 0.2);
lambBodyMesh.scale.set(1.2, 0.9, 0.8);
group.add(lambBodyMesh);

const lambHeadGeo = new THREE.SphereGeometry(0.06, 10, 10);
const lambHeadMesh = new THREE.Mesh(lambHeadGeo, marbleMaterialLight);
lambHeadMesh.position.set(0.1, 0.9, 0.25);
group.add(lambHeadMesh);

const earGeo = new THREE.SphereGeometry(0.02, 6, 6);
const earMesh = new THREE.Mesh(earGeo, marbleMaterialLight);
earMesh.position.set(0.12, 0.94, 0.28);
earMesh.scale.set(1.5, 0.5, 1);
group.add(earMesh);
`,

    // Continue with more statues...
    // #32 - Two Horned Giants Struggling from Wall
    horned_giants: `
const wallGeo = new THREE.BoxGeometry(0.15, 1.2, 0.8);
const wallMesh = new THREE.Mesh(wallGeo, marbleMaterialDark);
wallMesh.position.set(-0.1, 0.6, 0);
group.add(wallMesh);

const torso1Geo = new THREE.CylinderGeometry(0.15, 0.18, 0.5, 12);
const torso1Mesh = new THREE.Mesh(torso1Geo, marbleMaterial);
torso1Mesh.position.set(0.15, 0.7, 0.2);
torso1Mesh.rotation.z = -0.4;
group.add(torso1Mesh);

const head1Geo = new THREE.SphereGeometry(0.12, 12, 12);
const head1Mesh = new THREE.Mesh(head1Geo, marbleMaterial);
head1Mesh.position.set(0.25, 1.0, 0.2);
group.add(head1Mesh);

const horn1LGeo = new THREE.ConeGeometry(0.025, 0.15, 8);
const horn1LMesh = new THREE.Mesh(horn1LGeo, marbleMaterialLight);
horn1LMesh.position.set(0.18, 1.12, 0.22);
horn1LMesh.rotation.z = 0.3;
group.add(horn1LMesh);

const horn1RGeo = new THREE.ConeGeometry(0.025, 0.15, 8);
const horn1RMesh = new THREE.Mesh(horn1RGeo, marbleMaterialLight);
horn1RMesh.position.set(0.32, 1.12, 0.22);
horn1RMesh.rotation.z = -0.3;
group.add(horn1RMesh);

const arm1Geo = new THREE.CylinderGeometry(0.05, 0.06, 0.4, 10);
const arm1Mesh = new THREE.Mesh(arm1Geo, marbleMaterial);
arm1Mesh.position.set(0.35, 0.85, 0.25);
arm1Mesh.rotation.set(0, 0, -0.8);
group.add(arm1Mesh);

const torso2Geo = new THREE.CylinderGeometry(0.15, 0.18, 0.5, 12);
const torso2Mesh = new THREE.Mesh(torso2Geo, marbleMaterial);
torso2Mesh.position.set(0.15, 0.65, -0.2);
torso2Mesh.rotation.z = -0.5;
group.add(torso2Mesh);

const head2Geo = new THREE.SphereGeometry(0.11, 12, 12);
const head2Mesh = new THREE.Mesh(head2Geo, marbleMaterial);
head2Mesh.position.set(0.28, 0.92, -0.2);
group.add(head2Mesh);

const horn2Geo = new THREE.ConeGeometry(0.025, 0.14, 8);
const horn2Mesh = new THREE.Mesh(horn2Geo, marbleMaterialLight);
horn2Mesh.position.set(0.28, 1.05, -0.2);
group.add(horn2Mesh);

const arm2Geo = new THREE.CylinderGeometry(0.05, 0.06, 0.38, 10);
const arm2Mesh = new THREE.Mesh(arm2Geo, marbleMaterial);
arm2Mesh.position.set(0.38, 0.78, -0.15);
arm2Mesh.rotation.set(0.2, 0, -0.9);
group.add(arm2Mesh);
`,

    // #33 - Father Removing Thorn from Son's Foot
    father_son_thorn: `
const seatGeo = new THREE.BoxGeometry(0.5, 0.25, 0.4);
const seatMesh = new THREE.Mesh(seatGeo, marbleMaterialDark);
seatMesh.position.set(0, 0.125, 0);
group.add(seatMesh);

const fatherBodyGeo = new THREE.CylinderGeometry(0.15, 0.18, 0.5, 12);
const fatherBodyMesh = new THREE.Mesh(fatherBodyGeo, marbleMaterial);
fatherBodyMesh.position.set(-0.1, 0.55, 0);
fatherBodyMesh.rotation.x = 0.2;
group.add(fatherBodyMesh);

const fatherHeadGeo = new THREE.SphereGeometry(0.11, 12, 12);
const fatherHeadMesh = new THREE.Mesh(fatherHeadGeo, marbleMaterial);
fatherHeadMesh.position.set(-0.05, 0.9, 0.08);
fatherHeadMesh.rotation.x = 0.3;
group.add(fatherHeadMesh);

const fatherArmLGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.35, 10);
const fatherArmLMesh = new THREE.Mesh(fatherArmLGeo, marbleMaterial);
fatherArmLMesh.position.set(-0.2, 0.55, 0.2);
fatherArmLMesh.rotation.set(0.8, 0, 0.3);
group.add(fatherArmLMesh);

const fatherArmRGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.35, 10);
const fatherArmRMesh = new THREE.Mesh(fatherArmRGeo, marbleMaterial);
fatherArmRMesh.position.set(0.05, 0.5, 0.22);
fatherArmRMesh.rotation.set(0.9, 0, -0.2);
group.add(fatherArmRMesh);

const sonBodyGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.35, 10);
const sonBodyMesh = new THREE.Mesh(sonBodyGeo, marbleMaterial);
sonBodyMesh.position.set(0.15, 0.45, 0.05);
sonBodyMesh.rotation.z = 0.3;
group.add(sonBodyMesh);

const sonHeadGeo = new THREE.SphereGeometry(0.07, 10, 10);
const sonHeadMesh = new THREE.Mesh(sonHeadGeo, marbleMaterial);
sonHeadMesh.position.set(0.22, 0.7, 0.05);
group.add(sonHeadMesh);

const sonLegGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.3, 10);
const sonLegMesh = new THREE.Mesh(sonLegGeo, marbleMaterial);
sonLegMesh.position.set(0.1, 0.35, 0.2);
sonLegMesh.rotation.x = Math.PI / 2.5;
group.add(sonLegMesh);

const footGeo = new THREE.SphereGeometry(0.05, 8, 8);
const footMesh = new THREE.Mesh(footGeo, marbleMaterial);
footMesh.position.set(0.05, 0.25, 0.35);
footMesh.scale.set(1.3, 0.7, 0.8);
group.add(footMesh);
`,

    // #34 - Old Man Holding Model Ship
    old_man_ship: `
const robeGeo = new THREE.ConeGeometry(0.3, 1.0, 12);
const robeMesh = new THREE.Mesh(robeGeo, marbleMaterial);
robeMesh.position.set(0, 0.5, 0);
group.add(robeMesh);

const torsoGeo = new THREE.CylinderGeometry(0.14, 0.2, 0.4, 12);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0, 1.05, 0);
group.add(torsoMesh);

const headGeo = new THREE.SphereGeometry(0.11, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 1.38, 0);
group.add(headMesh);

const beardGeo = new THREE.ConeGeometry(0.08, 0.18, 8);
const beardMesh = new THREE.Mesh(beardGeo, marbleMaterial);
beardMesh.position.set(0, 1.28, 0.06);
beardMesh.rotation.x = 0.2;
group.add(beardMesh);

const armLGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.35, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.2, 0.95, 0.12);
armLMesh.rotation.set(0.5, 0, 0.4);
group.add(armLMesh);

const armRGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.35, 10);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.18, 0.92, 0.15);
armRMesh.rotation.set(0.6, 0, -0.3);
group.add(armRMesh);

const shipHullGeo = new THREE.CylinderGeometry(0.03, 0.06, 0.25, 10);
const shipHullMesh = new THREE.Mesh(shipHullGeo, marbleMaterialLight);
shipHullMesh.position.set(0, 0.85, 0.25);
shipHullMesh.rotation.z = Math.PI / 2;
shipHullMesh.scale.set(0.6, 1, 0.7);
group.add(shipHullMesh);

const mastGeo = new THREE.CylinderGeometry(0.008, 0.01, 0.2, 6);
const mastMesh = new THREE.Mesh(mastGeo, marbleMaterialLight);
mastMesh.position.set(0, 0.95, 0.25);
group.add(mastMesh);

const sailGeo = new THREE.BoxGeometry(0.12, 0.1, 0.008);
const sailMesh = new THREE.Mesh(sailGeo, marbleMaterialLight);
sailMesh.position.set(0, 0.95, 0.27);
group.add(sailMesh);
`,

    // #35 - Winged Horse with Colt
    pegasus_colt: `
const horseBodyGeo = new THREE.SphereGeometry(0.35, 14, 14);
const horseBodyMesh = new THREE.Mesh(horseBodyGeo, marbleMaterial);
horseBodyMesh.position.set(0, 0.6, 0);
horseBodyMesh.scale.set(1.4, 0.9, 0.85);
group.add(horseBodyMesh);

const horseNeckGeo = new THREE.CylinderGeometry(0.1, 0.15, 0.35, 12);
const horseNeckMesh = new THREE.Mesh(horseNeckGeo, marbleMaterial);
horseNeckMesh.position.set(0.35, 0.85, 0);
horseNeckMesh.rotation.z = -0.5;
group.add(horseNeckMesh);

const horseHeadGeo = new THREE.SphereGeometry(0.12, 12, 12);
const horseHeadMesh = new THREE.Mesh(horseHeadGeo, marbleMaterial);
horseHeadMesh.position.set(0.5, 1.05, 0);
horseHeadMesh.scale.set(1.3, 1, 0.8);
group.add(horseHeadMesh);

const legPositions = [[-0.2, 0.25, 0.15], [-0.2, 0.25, -0.15], [0.15, 0.25, 0.15], [0.15, 0.25, -0.15]];
legPositions.forEach(pos => {
    const legGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.5, 10);
    const legMesh = new THREE.Mesh(legGeo, marbleMaterial);
    legMesh.position.set(...pos);
    group.add(legMesh);
});

const wingLGeo = new THREE.BoxGeometry(0.05, 0.5, 0.3);
const wingLMesh = new THREE.Mesh(wingLGeo, marbleMaterialLight);
wingLMesh.position.set(-0.1, 0.95, 0.25);
wingLMesh.rotation.set(0.3, 0, 0.6);
group.add(wingLMesh);

const wingRGeo = new THREE.BoxGeometry(0.05, 0.5, 0.3);
const wingRMesh = new THREE.Mesh(wingRGeo, marbleMaterialLight);
wingRMesh.position.set(-0.1, 0.95, -0.25);
wingRMesh.rotation.set(-0.3, 0, 0.6);
group.add(wingRMesh);

const coltBodyGeo = new THREE.SphereGeometry(0.18, 12, 12);
const coltBodyMesh = new THREE.Mesh(coltBodyGeo, marbleMaterial);
coltBodyMesh.position.set(-0.45, 0.35, 0.2);
coltBodyMesh.scale.set(1.3, 0.9, 0.8);
group.add(coltBodyMesh);

const coltHeadGeo = new THREE.SphereGeometry(0.08, 10, 10);
const coltHeadMesh = new THREE.Mesh(coltHeadGeo, marbleMaterial);
coltHeadMesh.position.set(-0.32, 0.48, 0.2);
coltHeadMesh.scale.set(1.2, 1, 0.8);
group.add(coltHeadMesh);

const coltWingGeo = new THREE.BoxGeometry(0.03, 0.2, 0.12);
const coltWingMesh = new THREE.Mesh(coltWingGeo, marbleMaterialLight);
coltWingMesh.position.set(-0.5, 0.48, 0.28);
coltWingMesh.rotation.set(0.2, 0, 0.5);
group.add(coltWingMesh);
`
};

async function main() {
    log('=== Starting Complete Statue Generation ===');

    if (!fs.existsSync(MODELS_DIR)) {
        fs.mkdirSync(MODELS_DIR, { recursive: true });
    }

    const existingFiles = fs.readdirSync(MODELS_DIR)
        .filter(f => f.endsWith('.gltf') && !f.includes('archive'));
    log(`Found ${existingFiles.length} existing GLTF files`);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    let generated = 0;
    let skipped = 0;
    let failed = 0;

    const statueKeys = Object.keys(STATUES);
    log(`Processing ${statueKeys.length} statues...`);

    for (const key of statueKeys) {
        const filename = `${key}.gltf`;

        if (existingFiles.includes(filename)) {
            log(`SKIP: ${filename} already exists`);
            skipped++;
            continue;
        }

        const success = await exportStatue(browser, filename, STATUES[key]);
        if (success) {
            generated++;
        } else {
            failed++;
        }

        // Progress update
        const total = generated + skipped + failed;
        if (total % 5 === 0) {
            log(`PROGRESS: ${total}/${statueKeys.length} processed (${generated} new, ${skipped} skipped, ${failed} failed)`);
        }
    }

    await browser.close();

    log('=== Generation Complete ===');
    log(`FINAL: Generated ${generated}, Skipped ${skipped}, Failed ${failed}`);
    log(`Total statues defined: ${statueKeys.length}`);
}

main().catch(err => {
    log(`FATAL ERROR: ${err.message}`);
    console.error(err);
    process.exit(1);
});
