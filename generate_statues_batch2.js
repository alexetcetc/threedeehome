/**
 * Generate Piranesi Statues - Batch 2
 * Remaining statues including fixes and new ones
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

// Batch 2 statues
const STATUES = {
    // #26 - Elephant Plain (FIXED)
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
const tuskLMesh = new THREE.Mesh(tuskLGeo, marbleMaterialLight);
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

    // #36 - Woman Crowned with Coral
    woman_coral_crown: `
const robeGeo = new THREE.ConeGeometry(0.32, 1.05, 12);
const robeMesh = new THREE.Mesh(robeGeo, marbleMaterial);
robeMesh.position.set(0, 0.52, 0);
group.add(robeMesh);

const torsoGeo = new THREE.CylinderGeometry(0.14, 0.2, 0.4, 12);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0, 1.1, 0);
group.add(torsoMesh);

const headGeo = new THREE.SphereGeometry(0.12, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 1.42, 0);
group.add(headMesh);

const coralBaseGeo = new THREE.TorusGeometry(0.1, 0.02, 8, 16);
const coralBaseMesh = new THREE.Mesh(coralBaseGeo, marbleMaterialDark);
coralBaseMesh.position.set(0, 1.55, 0);
coralBaseMesh.rotation.x = Math.PI / 2;
group.add(coralBaseMesh);

for (let i = 0; i < 6; i++) {
    const branchGeo = new THREE.CylinderGeometry(0.01, 0.02, 0.15, 6);
    const branchMesh = new THREE.Mesh(branchGeo, marbleMaterialDark);
    const angle = (i / 6) * Math.PI * 2;
    branchMesh.position.set(Math.sin(angle) * 0.08, 1.62, Math.cos(angle) * 0.08);
    branchMesh.rotation.z = Math.sin(angle) * 0.3;
    branchMesh.rotation.x = Math.cos(angle) * 0.3;
    group.add(branchMesh);
}

const armLGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.38, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.28, 1.2, 0);
armLMesh.rotation.z = 0.8;
group.add(armLMesh);

const armRGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.38, 10);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.28, 1.2, 0);
armRMesh.rotation.z = -0.8;
group.add(armRMesh);

for (let i = 0; i < 4; i++) {
    const handCoralGeo = new THREE.CylinderGeometry(0.008, 0.015, 0.08, 6);
    const handCoralMesh = new THREE.Mesh(handCoralGeo, marbleMaterialDark);
    handCoralMesh.position.set(-0.42 + i * 0.02, 1.38 + i * 0.02, 0);
    handCoralMesh.rotation.z = 0.5 + i * 0.1;
    group.add(handCoralMesh);
}
`,

    // #37 - Lion in Cage of Coral
    lion_coral_cage: `
const lionBodyGeo = new THREE.SphereGeometry(0.25, 12, 12);
const lionBodyMesh = new THREE.Mesh(lionBodyGeo, marbleMaterial);
lionBodyMesh.position.set(0, 0.3, 0);
lionBodyMesh.scale.set(1.4, 1, 0.9);
group.add(lionBodyMesh);

const lionHeadGeo = new THREE.SphereGeometry(0.15, 12, 12);
const lionHeadMesh = new THREE.Mesh(lionHeadGeo, marbleMaterial);
lionHeadMesh.position.set(0.28, 0.4, 0);
group.add(lionHeadMesh);

const maneGeo = new THREE.SphereGeometry(0.18, 10, 10);
const maneMesh = new THREE.Mesh(maneGeo, marbleMaterial);
maneMesh.position.set(0.22, 0.42, 0);
maneMesh.scale.set(1, 1.1, 1.2);
group.add(maneMesh);

const pawPositions = [[-0.1, 0.08, 0.12], [-0.1, 0.08, -0.12], [0.15, 0.08, 0.12], [0.15, 0.08, -0.12]];
pawPositions.forEach(pos => {
    const pawGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const pawMesh = new THREE.Mesh(pawGeo, marbleMaterial);
    pawMesh.position.set(...pos);
    pawMesh.scale.set(1, 0.6, 0.8);
    group.add(pawMesh);
});

const tailGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.25, 8);
const tailMesh = new THREE.Mesh(tailGeo, marbleMaterial);
tailMesh.position.set(-0.3, 0.25, 0);
tailMesh.rotation.z = -0.8;
group.add(tailMesh);

for (let i = 0; i < 8; i++) {
    const barGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.7, 8);
    const barMesh = new THREE.Mesh(barGeo, marbleMaterialDark);
    const angle = (i / 8) * Math.PI * 2;
    barMesh.position.set(Math.sin(angle) * 0.4, 0.35, Math.cos(angle) * 0.35);
    group.add(barMesh);

    const branchGeo = new THREE.CylinderGeometry(0.008, 0.012, 0.1, 6);
    const branchMesh = new THREE.Mesh(branchGeo, marbleMaterialDark);
    branchMesh.position.set(Math.sin(angle) * 0.42, 0.6, Math.cos(angle) * 0.37);
    branchMesh.rotation.z = Math.sin(angle) * 0.4;
    group.add(branchMesh);
}
`,

    // #38 - Man with Coral Aflame
    man_coral_fire: `
const robeGeo = new THREE.ConeGeometry(0.3, 1.0, 12);
const robeMesh = new THREE.Mesh(robeGeo, marbleMaterial);
robeMesh.position.set(0, 0.5, 0);
group.add(robeMesh);

const torsoGeo = new THREE.CylinderGeometry(0.14, 0.19, 0.4, 12);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0, 1.05, 0);
group.add(torsoMesh);

const headGeo = new THREE.SphereGeometry(0.11, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 1.38, 0);
group.add(headMesh);

const armLGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.35, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterialDark);
armLMesh.position.set(-0.22, 0.98, 0);
armLMesh.rotation.z = 0.3;
group.add(armLMesh);

const armRGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.35, 10);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.2, 0.95, 0.15);
armRMesh.rotation.set(0.5, 0, -0.3);
group.add(armRMesh);

const boxGeo = new THREE.BoxGeometry(0.12, 0.08, 0.1);
const boxMesh = new THREE.Mesh(boxGeo, marbleMaterialLight);
boxMesh.position.set(0.28, 0.85, 0.22);
group.add(boxMesh);

for (let i = 0; i < 8; i++) {
    const coralGeo = new THREE.CylinderGeometry(0.01, 0.02, 0.12 + Math.random() * 0.1, 6);
    const coralMesh = new THREE.Mesh(coralGeo, marbleMaterialDark);
    coralMesh.position.set(
        -0.25 - Math.random() * 0.1,
        0.9 + Math.random() * 0.25,
        Math.random() * 0.1 - 0.05
    );
    coralMesh.rotation.set(Math.random() * 0.3, 0, Math.random() * 0.5 - 0.25);
    group.add(coralMesh);
}

const shoulderCoralGeo = new THREE.SphereGeometry(0.08, 8, 8);
const shoulderCoralMesh = new THREE.Mesh(shoulderCoralGeo, marbleMaterialDark);
shoulderCoralMesh.position.set(-0.2, 1.15, 0);
shoulderCoralMesh.scale.set(1.2, 0.8, 0.6);
group.add(shoulderCoralMesh);
`,

    // #39 - Man Entwined with Serpents
    man_serpents: `
const baseGeo = new THREE.BoxGeometry(0.6, 0.08, 0.4);
const baseMesh = new THREE.Mesh(baseGeo, marbleMaterialDark);
baseMesh.position.set(0, 0.04, 0);
group.add(baseMesh);

const bodyGeo = new THREE.CylinderGeometry(0.15, 0.18, 0.6, 12);
const bodyMesh = new THREE.Mesh(bodyGeo, marbleMaterial);
bodyMesh.position.set(0, 0.35, 0);
bodyMesh.rotation.z = Math.PI / 2.5;
group.add(bodyMesh);

const headGeo = new THREE.SphereGeometry(0.11, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0.32, 0.45, 0);
headMesh.rotation.z = 0.2;
group.add(headMesh);

const legLGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.4, 10);
const legLMesh = new THREE.Mesh(legLGeo, marbleMaterial);
legLMesh.position.set(-0.2, 0.18, 0.12);
legLMesh.rotation.x = Math.PI / 4;
group.add(legLMesh);

const legRGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.4, 10);
const legRMesh = new THREE.Mesh(legRGeo, marbleMaterial);
legRMesh.position.set(-0.2, 0.18, -0.1);
legRMesh.rotation.x = -Math.PI / 5;
group.add(legRMesh);

for (let s = 0; s < 3; s++) {
    const segments = 8;
    for (let i = 0; i < segments; i++) {
        const snakeGeo = new THREE.SphereGeometry(0.03 - i * 0.002, 8, 8);
        const snakeMesh = new THREE.Mesh(snakeGeo, marbleMaterialDark);
        const t = i / segments;
        const xOffset = s * 0.12 - 0.12;
        const yOffset = s * 0.08;
        snakeMesh.position.set(
            xOffset + Math.sin(t * Math.PI * 2) * 0.15,
            0.2 + t * 0.35 + yOffset,
            Math.cos(t * Math.PI * 2 + s) * 0.12
        );
        snakeMesh.scale.set(1.5, 1, 1);
        group.add(snakeMesh);
    }

    const headSGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const headSMesh = new THREE.Mesh(headSGeo, marbleMaterialDark);
    headSMesh.position.set(s * 0.1 - 0.05, 0.55 + s * 0.05, 0.1 - s * 0.05);
    headSMesh.scale.set(1.3, 1, 0.8);
    group.add(headSMesh);
}
`,

    // #40 - Man with Shattered Sword and Orb
    man_shattered_sword: `
const robeGeo = new THREE.ConeGeometry(0.28, 0.85, 12);
const robeMesh = new THREE.Mesh(robeGeo, marbleMaterial);
robeMesh.position.set(0, 0.3, 0);
group.add(robeMesh);

const torsoGeo = new THREE.CylinderGeometry(0.13, 0.18, 0.38, 12);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0, 0.8, 0);
torsoMesh.rotation.x = 0.15;
group.add(torsoMesh);

const headGeo = new THREE.SphereGeometry(0.1, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 1.1, 0.05);
headMesh.rotation.x = 0.3;
group.add(headMesh);

const armLGeo = new THREE.CylinderGeometry(0.035, 0.045, 0.32, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.18, 0.78, 0.15);
armLMesh.rotation.set(0.7, 0, 0.4);
group.add(armLMesh);

const armRGeo = new THREE.CylinderGeometry(0.035, 0.045, 0.32, 10);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.18, 0.75, 0.18);
armRMesh.rotation.set(0.8, 0, -0.3);
group.add(armRMesh);

for (let i = 0; i < 5; i++) {
    const shardGeo = new THREE.BoxGeometry(0.02, 0.08 + Math.random() * 0.06, 0.01);
    const shardMesh = new THREE.Mesh(shardGeo, marbleMaterialLight);
    shardMesh.position.set(-0.12 + i * 0.03, 0.7 + Math.random() * 0.1, 0.28);
    shardMesh.rotation.set(Math.random() * 0.5, 0, Math.random() * 0.8 - 0.4);
    group.add(shardMesh);
}

for (let i = 0; i < 6; i++) {
    const orbShardGeo = new THREE.TetrahedronGeometry(0.025);
    const orbShardMesh = new THREE.Mesh(orbShardGeo, marbleMaterialLight);
    orbShardMesh.position.set(
        0.22 + Math.random() * 0.08 - 0.04,
        0.62 + Math.random() * 0.1,
        0.25 + Math.random() * 0.06 - 0.03
    );
    orbShardMesh.rotation.set(Math.random(), Math.random(), Math.random());
    group.add(orbShardMesh);
}
`,

    // #41 - Fat Heretical Pope on Throne
    heretical_pope: `
const throneGeo = new THREE.BoxGeometry(0.55, 0.8, 0.45);
const throneMesh = new THREE.Mesh(throneGeo, marbleMaterialDark);
throneMesh.position.set(0, 0.4, -0.05);
group.add(throneMesh);

const throneBackGeo = new THREE.BoxGeometry(0.55, 0.5, 0.08);
const throneBackMesh = new THREE.Mesh(throneBackGeo, marbleMaterialDark);
throneBackMesh.position.set(0, 0.95, -0.22);
group.add(throneBackMesh);

const bodyGeo = new THREE.SphereGeometry(0.3, 14, 14);
const bodyMesh = new THREE.Mesh(bodyGeo, marbleMaterial);
bodyMesh.position.set(0, 0.55, 0.05);
bodyMesh.scale.set(1.3, 1.2, 1.1);
group.add(bodyMesh);

const headGeo = new THREE.SphereGeometry(0.12, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 0.95, 0.08);
group.add(headMesh);

const miterGeo = new THREE.ConeGeometry(0.08, 0.2, 8);
const miterMesh = new THREE.Mesh(miterGeo, marbleMaterialLight);
miterMesh.position.set(0, 1.15, 0.06);
group.add(miterMesh);

const jowlLGeo = new THREE.SphereGeometry(0.05, 8, 8);
const jowlLMesh = new THREE.Mesh(jowlLGeo, marbleMaterial);
jowlLMesh.position.set(-0.08, 0.88, 0.12);
group.add(jowlLMesh);

const jowlRGeo = new THREE.SphereGeometry(0.05, 8, 8);
const jowlRMesh = new THREE.Mesh(jowlRGeo, marbleMaterial);
jowlRMesh.position.set(0.08, 0.88, 0.12);
group.add(jowlRMesh);

const armLGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.3, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.32, 0.55, 0.1);
armLMesh.rotation.z = 0.3;
group.add(armLMesh);

const armRGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.3, 10);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.32, 0.55, 0.1);
armRMesh.rotation.z = -0.3;
group.add(armRMesh);

const armrestLGeo = new THREE.BoxGeometry(0.08, 0.06, 0.35);
const armrestLMesh = new THREE.Mesh(armrestLGeo, marbleMaterialDark);
armrestLMesh.position.set(-0.28, 0.53, 0.08);
group.add(armrestLMesh);

const armrestRGeo = new THREE.BoxGeometry(0.08, 0.06, 0.35);
const armrestRMesh = new THREE.Mesh(armrestRGeo, marbleMaterialDark);
armrestRMesh.position.set(0.28, 0.53, 0.08);
group.add(armrestRMesh);
`,

    // #42 - Queen in Chariot
    queen_chariot: `
const chariotFloorGeo = new THREE.BoxGeometry(0.5, 0.05, 0.35);
const chariotFloorMesh = new THREE.Mesh(chariotFloorGeo, marbleMaterialDark);
chariotFloorMesh.position.set(0, 0.15, 0);
group.add(chariotFloorMesh);

const chariotFrontGeo = new THREE.BoxGeometry(0.5, 0.3, 0.05);
const chariotFrontMesh = new THREE.Mesh(chariotFrontGeo, marbleMaterialDark);
chariotFrontMesh.position.set(0, 0.3, 0.15);
group.add(chariotFrontMesh);

const wheelLGeo = new THREE.TorusGeometry(0.15, 0.03, 8, 16);
const wheelLMesh = new THREE.Mesh(wheelLGeo, marbleMaterial);
wheelLMesh.position.set(-0.3, 0.15, 0);
wheelLMesh.rotation.y = Math.PI / 2;
group.add(wheelLMesh);

const wheelRGeo = new THREE.TorusGeometry(0.15, 0.03, 8, 16);
const wheelRMesh = new THREE.Mesh(wheelRGeo, marbleMaterial);
wheelRMesh.position.set(0.3, 0.15, 0);
wheelRMesh.rotation.y = Math.PI / 2;
group.add(wheelRMesh);

for (let w = 0; w < 2; w++) {
    const xPos = w === 0 ? -0.3 : 0.3;
    for (let i = 0; i < 6; i++) {
        const spokeGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.12, 6);
        const spokeMesh = new THREE.Mesh(spokeGeo, marbleMaterial);
        const angle = (i / 6) * Math.PI * 2;
        spokeMesh.position.set(xPos, 0.15 + Math.sin(angle) * 0.06, Math.cos(angle) * 0.06);
        spokeMesh.rotation.x = angle;
        spokeMesh.rotation.z = Math.PI / 2;
        group.add(spokeMesh);
    }
}

const queenRobeGeo = new THREE.ConeGeometry(0.18, 0.6, 12);
const queenRobeMesh = new THREE.Mesh(queenRobeGeo, marbleMaterial);
queenRobeMesh.position.set(0, 0.48, -0.02);
group.add(queenRobeMesh);

const queenTorsoGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.25, 12);
const queenTorsoMesh = new THREE.Mesh(queenTorsoGeo, marbleMaterial);
queenTorsoMesh.position.set(0, 0.9, -0.02);
group.add(queenTorsoMesh);

const queenHeadGeo = new THREE.SphereGeometry(0.08, 12, 12);
const queenHeadMesh = new THREE.Mesh(queenHeadGeo, marbleMaterial);
queenHeadMesh.position.set(0, 1.12, 0);
group.add(queenHeadMesh);

const crownGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.06, 10);
const crownMesh = new THREE.Mesh(crownGeo, marbleMaterialLight);
crownMesh.position.set(0, 1.22, 0);
group.add(crownMesh);
`,

    // #43 - Androgynous Figure with Lantern
    hermit_lantern: `
const cloakGeo = new THREE.ConeGeometry(0.35, 1.15, 12);
const cloakMesh = new THREE.Mesh(cloakGeo, marbleMaterial);
cloakMesh.position.set(0, 0.58, 0);
group.add(cloakMesh);

const hoodGeo = new THREE.SphereGeometry(0.15, 12, 12);
const hoodMesh = new THREE.Mesh(hoodGeo, marbleMaterial);
hoodMesh.position.set(0, 1.25, 0);
group.add(hoodMesh);

const hoodFrontGeo = new THREE.SphereGeometry(0.12, 10, 10);
const hoodFrontMesh = new THREE.Mesh(hoodFrontGeo, marbleMaterial);
hoodFrontMesh.position.set(0, 1.22, 0.08);
hoodFrontMesh.scale.set(1, 0.9, 0.6);
group.add(hoodFrontMesh);

const shadowFaceGeo = new THREE.SphereGeometry(0.06, 8, 8);
const shadowFaceMesh = new THREE.Mesh(shadowFaceGeo, marbleMaterialDark);
shadowFaceMesh.position.set(0, 1.2, 0.08);
group.add(shadowFaceMesh);

const armGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.45, 10);
const armMesh = new THREE.Mesh(armGeo, marbleMaterial);
armMesh.position.set(0.22, 1.15, 0.15);
armMesh.rotation.set(0.3, 0, -0.8);
group.add(armMesh);

const lanternBaseGeo = new THREE.BoxGeometry(0.1, 0.15, 0.1);
const lanternBaseMesh = new THREE.Mesh(lanternBaseGeo, marbleMaterialDark);
lanternBaseMesh.position.set(0.4, 1.35, 0.22);
group.add(lanternBaseMesh);

const lanternTopGeo = new THREE.ConeGeometry(0.06, 0.08, 6);
const lanternTopMesh = new THREE.Mesh(lanternTopGeo, marbleMaterialDark);
lanternTopMesh.position.set(0.4, 1.46, 0.22);
group.add(lanternTopMesh);

const lanternRingGeo = new THREE.TorusGeometry(0.04, 0.008, 6, 12);
const lanternRingMesh = new THREE.Mesh(lanternRingGeo, marbleMaterialDark);
lanternRingMesh.position.set(0.4, 1.52, 0.22);
lanternRingMesh.rotation.x = Math.PI / 2;
group.add(lanternRingMesh);

const glassGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.12, 8);
const glassMesh = new THREE.Mesh(glassGeo, marbleMaterialLight);
glassMesh.position.set(0.4, 1.35, 0.22);
group.add(glassMesh);

const staffGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.9, 8);
const staffMesh = new THREE.Mesh(staffGeo, marbleMaterialDark);
staffMesh.position.set(-0.2, 0.6, 0.1);
staffMesh.rotation.z = 0.1;
group.add(staffMesh);
`,

    // #44 - Good King with Walled City
    good_king: `
const robeGeo = new THREE.ConeGeometry(0.32, 1.05, 12);
const robeMesh = new THREE.Mesh(robeGeo, marbleMaterial);
robeMesh.position.set(0, 0.52, 0);
group.add(robeMesh);

const torsoGeo = new THREE.CylinderGeometry(0.15, 0.2, 0.4, 12);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0, 1.1, 0);
group.add(torsoMesh);

const headGeo = new THREE.SphereGeometry(0.12, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 1.42, 0);
group.add(headMesh);

const beardGeo = new THREE.ConeGeometry(0.08, 0.15, 8);
const beardMesh = new THREE.Mesh(beardGeo, marbleMaterial);
beardMesh.position.set(0, 1.32, 0.06);
beardMesh.rotation.x = 0.2;
group.add(beardMesh);

const crownGeo = new THREE.CylinderGeometry(0.1, 0.11, 0.08, 12);
const crownMesh = new THREE.Mesh(crownGeo, marbleMaterialLight);
crownMesh.position.set(0, 1.55, 0);
group.add(crownMesh);

const armLGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.38, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.25, 1.05, 0.12);
armLMesh.rotation.set(0.5, 0, 0.5);
group.add(armLMesh);

const handLGeo = new THREE.SphereGeometry(0.06, 10, 10);
const handLMesh = new THREE.Mesh(handLGeo, marbleMaterial);
handLMesh.position.set(-0.35, 0.92, 0.25);
group.add(handLMesh);

const cityBaseGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.05, 16);
const cityBaseMesh = new THREE.Mesh(cityBaseMesh, marbleMaterialDark);
cityBaseMesh.position.set(-0.35, 0.88, 0.25);
group.add(cityBaseMesh);

const wallGeo = new THREE.TorusGeometry(0.1, 0.02, 6, 16);
const wallMesh = new THREE.Mesh(wallGeo, marbleMaterialDark);
wallMesh.position.set(-0.35, 0.92, 0.25);
wallMesh.rotation.x = Math.PI / 2;
group.add(wallMesh);

for (let i = 0; i < 4; i++) {
    const towerGeo = new THREE.CylinderGeometry(0.02, 0.025, 0.08, 6);
    const towerMesh = new THREE.Mesh(towerGeo, marbleMaterialDark);
    const angle = (i / 4) * Math.PI * 2;
    towerMesh.position.set(-0.35 + Math.sin(angle) * 0.08, 0.96, 0.25 + Math.cos(angle) * 0.08);
    group.add(towerMesh);
}

const armRGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.35, 10);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.22, 1.2, 0);
armRMesh.rotation.z = -0.8;
group.add(armRMesh);
`,

    // #45 - Two Children Laughing with Flute
    children_flute: `
const child1BodyGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.4, 10);
const child1BodyMesh = new THREE.Mesh(child1BodyGeo, marbleMaterial);
child1BodyMesh.position.set(-0.12, 0.3, 0);
group.add(child1BodyMesh);

const child1HeadGeo = new THREE.SphereGeometry(0.07, 10, 10);
const child1HeadMesh = new THREE.Mesh(child1HeadGeo, marbleMaterial);
child1HeadMesh.position.set(-0.12, 0.58, 0.02);
child1HeadMesh.rotation.x = -0.2;
group.add(child1HeadMesh);

const child1HairGeo = new THREE.SphereGeometry(0.075, 8, 8);
const child1HairMesh = new THREE.Mesh(child1HairGeo, marbleMaterial);
child1HairMesh.position.set(-0.12, 0.62, -0.01);
child1HairMesh.scale.set(1, 0.7, 0.9);
group.add(child1HairMesh);

const child2BodyGeo = new THREE.CylinderGeometry(0.075, 0.095, 0.38, 10);
const child2BodyMesh = new THREE.Mesh(child2BodyGeo, marbleMaterial);
child2BodyMesh.position.set(0.12, 0.28, 0.05);
group.add(child2BodyMesh);

const child2HeadGeo = new THREE.SphereGeometry(0.065, 10, 10);
const child2HeadMesh = new THREE.Mesh(child2HeadGeo, marbleMaterial);
child2HeadMesh.position.set(0.12, 0.55, 0.08);
child2HeadMesh.rotation.x = -0.3;
group.add(child2HeadMesh);

const child2HairGeo = new THREE.SphereGeometry(0.07, 8, 8);
const child2HairMesh = new THREE.Mesh(child2HairGeo, marbleMaterial);
child2HairMesh.position.set(0.12, 0.59, 0.05);
child2HairMesh.scale.set(1, 0.65, 0.85);
group.add(child2HairMesh);

const arm1Geo = new THREE.CylinderGeometry(0.025, 0.03, 0.2, 8);
const arm1Mesh = new THREE.Mesh(arm1Geo, marbleMaterial);
arm1Mesh.position.set(-0.02, 0.4, 0.1);
arm1Mesh.rotation.set(0.5, 0, -0.6);
group.add(arm1Mesh);

const arm2Geo = new THREE.CylinderGeometry(0.025, 0.03, 0.18, 8);
const arm2Mesh = new THREE.Mesh(arm2Geo, marbleMaterial);
arm2Mesh.position.set(0.02, 0.38, 0.12);
arm2Mesh.rotation.set(0.6, 0, 0.5);
group.add(arm2Mesh);

const fluteGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.2, 8);
const fluteMesh = new THREE.Mesh(fluteGeo, marbleMaterialDark);
fluteMesh.position.set(0, 0.42, 0.18);
fluteMesh.rotation.z = Math.PI / 2;
group.add(fluteMesh);
`,

    // #46 - Figure Covered in Mussels and Shellfish
    shellfish_figure: `
const bodyGeo = new THREE.CylinderGeometry(0.16, 0.2, 0.9, 12);
const bodyMesh = new THREE.Mesh(bodyGeo, marbleMaterial);
bodyMesh.position.set(0, 0.55, 0);
group.add(bodyMesh);

const headGeo = new THREE.SphereGeometry(0.12, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 1.1, 0);
group.add(headMesh);

const armLGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.35, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.22, 0.75, 0);
armLMesh.rotation.z = 0.3;
group.add(armLMesh);

const armRGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.35, 10);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.22, 0.75, 0);
armRMesh.rotation.z = -0.3;
group.add(armRMesh);

const musselPositions = [
    [0.12, 0.8, 0.15], [-0.1, 0.6, 0.18], [0.15, 0.4, 0.16],
    [-0.14, 0.9, 0.12], [0.08, 0.5, 0.17], [-0.05, 0.7, 0.16],
    [0.1, 1.05, 0.1], [-0.08, 0.45, 0.15], [0.05, 0.95, 0.12],
    [-0.12, 0.75, 0.14], [0.14, 0.65, 0.15], [-0.06, 0.55, 0.17]
];

musselPositions.forEach(pos => {
    const musselGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const musselMesh = new THREE.Mesh(musselGeo, marbleMaterialDark);
    musselMesh.position.set(...pos);
    musselMesh.scale.set(0.8, 1.3, 0.6);
    musselMesh.rotation.set(Math.random() * 0.5, Math.random() * 0.5, Math.random() * 0.5);
    group.add(musselMesh);
});

const barnaclePositions = [
    [0.05, 1.15, 0.08], [-0.1, 0.85, 0.16], [0.13, 0.7, 0.14],
    [-0.08, 0.5, 0.16], [0.1, 0.35, 0.14]
];

barnaclePositions.forEach(pos => {
    const barnacleGeo = new THREE.ConeGeometry(0.025, 0.04, 6);
    const barnacleMesh = new THREE.Mesh(barnacleGeo, marbleMaterialLight);
    barnacleMesh.position.set(...pos);
    group.add(barnacleMesh);
});
`,

    // #47 - Imana Turning Away
    imana_turning: `
const robeGeo = new THREE.ConeGeometry(0.35, 1.15, 12);
const robeMesh = new THREE.Mesh(robeGeo, marbleMaterial);
robeMesh.position.set(0, 0.58, 0);
group.add(robeMesh);

const torsoGeo = new THREE.CylinderGeometry(0.15, 0.22, 0.45, 12);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0, 1.2, 0);
torsoMesh.rotation.y = 0.5;
group.add(torsoMesh);

const headGeo = new THREE.SphereGeometry(0.12, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(-0.05, 1.52, -0.08);
headMesh.rotation.y = 0.8;
group.add(headMesh);

const hairGeo = new THREE.SphereGeometry(0.13, 10, 10);
const hairMesh = new THREE.Mesh(hairGeo, marbleMaterial);
hairMesh.position.set(-0.08, 1.58, -0.12);
hairMesh.scale.set(1, 0.8, 1);
group.add(hairMesh);

const shoulderLGeo = new THREE.SphereGeometry(0.08, 10, 10);
const shoulderLMesh = new THREE.Mesh(shoulderLGeo, marbleMaterial);
shoulderLMesh.position.set(-0.2, 1.32, 0);
group.add(shoulderLMesh);

const shoulderRGeo = new THREE.SphereGeometry(0.08, 10, 10);
const shoulderRMesh = new THREE.Mesh(shoulderRGeo, marbleMaterial);
shoulderRMesh.position.set(0.18, 1.3, -0.08);
group.add(shoulderRMesh);

const armTrailGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.4, 10);
const armTrailMesh = new THREE.Mesh(armTrailGeo, marbleMaterial);
armTrailMesh.position.set(0.3, 1.1, 0.15);
armTrailMesh.rotation.set(0.3, -0.4, -0.8);
group.add(armTrailMesh);

const handGeo = new THREE.SphereGeometry(0.04, 8, 8);
const handMesh = new THREE.Mesh(handGeo, marbleMaterial);
handMesh.position.set(0.45, 0.95, 0.28);
group.add(handMesh);

const foldGeo = new THREE.CylinderGeometry(0.02, 0.04, 0.5, 8);
const foldMesh = new THREE.Mesh(foldGeo, marbleMaterialDark);
foldMesh.position.set(0.15, 0.5, 0.22);
foldMesh.rotation.x = 0.1;
group.add(foldMesh);
`,

    // #48 - Mbombo Vomiting Creation
    mbombo_creation: `
const bodyGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.7, 14);
const bodyMesh = new THREE.Mesh(bodyGeo, marbleMaterial);
bodyMesh.position.set(0, 0.55, 0);
bodyMesh.rotation.x = 0.3;
group.add(bodyMesh);

const headGeo = new THREE.SphereGeometry(0.14, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 1.0, 0.15);
headMesh.rotation.x = 0.4;
group.add(headMesh);

const mouthGeo = new THREE.TorusGeometry(0.05, 0.015, 8, 12, Math.PI);
const mouthMesh = new THREE.Mesh(mouthGeo, marbleMaterialDark);
mouthMesh.position.set(0, 0.95, 0.28);
mouthMesh.rotation.x = Math.PI;
group.add(mouthMesh);

const sunGeo = new THREE.SphereGeometry(0.08, 12, 12);
const sunMesh = new THREE.Mesh(sunGeo, marbleMaterialLight);
sunMesh.position.set(0, 0.85, 0.4);
group.add(sunMesh);

const moonGeo = new THREE.SphereGeometry(0.05, 10, 10);
const moonMesh = new THREE.Mesh(moonGeo, marbleMaterialLight);
moonMesh.position.set(0.1, 0.78, 0.38);
group.add(moonMesh);

const animalPositions = [[0.08, 0.7, 0.35], [-0.06, 0.65, 0.38], [0.12, 0.6, 0.32], [-0.1, 0.55, 0.35], [0.05, 0.5, 0.38]];
animalPositions.forEach((pos, i) => {
    const animalGeo = new THREE.SphereGeometry(0.025 + i * 0.003, 8, 8);
    const animalMesh = new THREE.Mesh(animalGeo, marbleMaterial);
    animalMesh.position.set(...pos);
    animalMesh.scale.set(1.3, 0.8, 0.9);
    group.add(animalMesh);
});

const streamGeo = new THREE.CylinderGeometry(0.08, 0.15, 0.5, 10);
const streamMesh = new THREE.Mesh(streamGeo, marbleMaterialLight);
streamMesh.position.set(0, 0.6, 0.38);
streamMesh.rotation.x = Math.PI / 4;
streamMesh.scale.set(0.6, 1, 0.4);
group.add(streamMesh);

const armLGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.35, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.25, 0.65, 0.05);
armLMesh.rotation.z = 0.4;
group.add(armLMesh);

const armRGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.35, 10);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.25, 0.65, 0.05);
armRMesh.rotation.z = -0.4;
group.add(armRMesh);
`,

    // #49 - Ryangombe and the Buffalo
    ryangombe_buffalo: `
const buffaloBodyGeo = new THREE.SphereGeometry(0.35, 14, 14);
const buffaloBodyMesh = new THREE.Mesh(buffaloBodyGeo, marbleMaterialDark);
buffaloBodyMesh.position.set(-0.15, 0.4, 0);
buffaloBodyMesh.scale.set(1.5, 1, 1);
group.add(buffaloBodyMesh);

const buffaloHeadGeo = new THREE.SphereGeometry(0.18, 12, 12);
const buffaloHeadMesh = new THREE.Mesh(buffaloHeadGeo, marbleMaterialDark);
buffaloHeadMesh.position.set(0.3, 0.5, 0);
buffaloHeadMesh.scale.set(1.2, 1, 0.9);
group.add(buffaloHeadMesh);

const hornLGeo = new THREE.TorusGeometry(0.12, 0.02, 8, 12, Math.PI);
const hornLMesh = new THREE.Mesh(hornLGeo, marbleMaterial);
hornLMesh.position.set(0.25, 0.65, 0.12);
hornLMesh.rotation.set(0, 0, -0.5);
group.add(hornLMesh);

const hornRGeo = new THREE.TorusGeometry(0.12, 0.02, 8, 12, Math.PI);
const hornRMesh = new THREE.Mesh(hornRGeo, marbleMaterial);
hornRMesh.position.set(0.25, 0.65, -0.12);
hornRMesh.rotation.set(0, 0, -0.5);
group.add(hornRMesh);

const legPositions = [[-0.35, 0.18, 0.15], [-0.35, 0.18, -0.15], [0.05, 0.18, 0.15], [0.05, 0.18, -0.15]];
legPositions.forEach(pos => {
    const legGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.36, 10);
    const legMesh = new THREE.Mesh(legGeo, marbleMaterialDark);
    legMesh.position.set(...pos);
    group.add(legMesh);
});

const warriorBodyGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.45, 12);
const warriorBodyMesh = new THREE.Mesh(warriorBodyGeo, marbleMaterial);
warriorBodyMesh.position.set(0.25, 0.75, 0);
warriorBodyMesh.rotation.x = -0.4;
group.add(warriorBodyMesh);

const warriorHeadGeo = new THREE.SphereGeometry(0.08, 12, 12);
const warriorHeadMesh = new THREE.Mesh(warriorHeadGeo, marbleMaterial);
warriorHeadMesh.position.set(0.18, 1.0, 0);
group.add(warriorHeadMesh);

const armGeo = new THREE.CylinderGeometry(0.03, 0.04, 0.25, 8);
const armMesh = new THREE.Mesh(armGeo, marbleMaterial);
armMesh.position.set(0.35, 0.85, 0.1);
armMesh.rotation.set(0.3, 0, -0.5);
group.add(armMesh);
`,

    // #50 - Kalumba Deceiver with Baskets
    kalumba_baskets: `
const bodyGeo = new THREE.CylinderGeometry(0.14, 0.18, 0.7, 12);
const bodyMesh = new THREE.Mesh(bodyGeo, marbleMaterial);
bodyMesh.position.set(0, 0.55, 0);
group.add(bodyMesh);

const headGeo = new THREE.SphereGeometry(0.11, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 1.02, 0);
group.add(headMesh);

const smileGeo = new THREE.TorusGeometry(0.04, 0.008, 6, 10, Math.PI);
const smileMesh = new THREE.Mesh(smileGeo, marbleMaterialDark);
smileMesh.position.set(0, 0.98, 0.1);
smileMesh.rotation.x = Math.PI;
group.add(smileMesh);

const armLGeo = new THREE.CylinderGeometry(0.035, 0.045, 0.4, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.25, 1.0, 0);
armLMesh.rotation.z = 1.0;
group.add(armLMesh);

const armRGeo = new THREE.CylinderGeometry(0.035, 0.045, 0.35, 10);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.22, 0.8, 0);
armRMesh.rotation.z = -0.6;
group.add(armRMesh);

const basketHighGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.12, 10);
const basketHighMesh = new THREE.Mesh(basketHighGeo, marbleMaterialLight);
basketHighMesh.position.set(-0.42, 1.25, 0);
group.add(basketHighMesh);

const seedGeo = new THREE.SphereGeometry(0.02, 6, 6);
const seedMesh = new THREE.Mesh(seedGeo, marbleMaterial);
seedMesh.position.set(-0.42, 1.3, 0);
group.add(seedMesh);

const sunGeo = new THREE.SphereGeometry(0.025, 8, 8);
const sunMesh = new THREE.Mesh(sunGeo, marbleMaterialLight);
sunMesh.position.set(-0.45, 1.32, 0.03);
group.add(sunMesh);

const basketLowGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.12, 10);
const basketLowMesh = new THREE.Mesh(basketLowGeo, marbleMaterialDark);
basketLowMesh.position.set(0.35, 0.65, 0);
basketLowMesh.rotation.z = 0.3;
group.add(basketLowMesh);

const boneGeo = new THREE.CylinderGeometry(0.01, 0.015, 0.06, 6);
const boneMesh = new THREE.Mesh(boneMesh, marbleMaterialLight);
boneMesh.position.set(0.38, 0.68, 0.05);
boneMesh.rotation.z = 0.5;
group.add(boneMesh);

const skullGeo = new THREE.SphereGeometry(0.02, 8, 8);
const skullMesh = new THREE.Mesh(skullGeo, marbleMaterialLight);
skullMesh.position.set(0.32, 0.7, -0.02);
group.add(skullMesh);
`,

    // #51 - Nyiragongo's Keeper
    nyiragongo_keeper: `
const craterGeo = new THREE.TorusGeometry(0.35, 0.1, 12, 20);
const craterMesh = new THREE.Mesh(craterGeo, marbleMaterialDark);
craterMesh.position.set(0, 0.1, 0);
craterMesh.rotation.x = Math.PI / 2;
group.add(craterMesh);

const lavaBaseGeo = new THREE.CylinderGeometry(0.25, 0.35, 0.15, 16);
const lavaBaseMesh = new THREE.Mesh(lavaBaseGeo, marbleMaterialDark);
lavaBaseMesh.position.set(0, 0.08, 0);
group.add(lavaBaseMesh);

const bodyGeo = new THREE.CylinderGeometry(0.12, 0.2, 0.6, 12);
const bodyMesh = new THREE.Mesh(bodyGeo, marbleMaterial);
bodyMesh.position.set(0, 0.5, 0);
group.add(bodyMesh);

const lavaFlowGeo = new THREE.CylinderGeometry(0.15, 0.18, 0.35, 12);
const lavaFlowMesh = new THREE.Mesh(lavaFlowGeo, marbleMaterialDark);
lavaFlowMesh.position.set(0, 0.25, 0);
lavaFlowMesh.scale.set(1, 1, 0.6);
group.add(lavaFlowMesh);

const torsoGeo = new THREE.CylinderGeometry(0.11, 0.14, 0.35, 12);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0, 0.88, 0);
group.add(torsoMesh);

const headGeo = new THREE.SphereGeometry(0.1, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 1.15, 0);
group.add(headMesh);

const hairGeo = new THREE.ConeGeometry(0.12, 0.25, 10);
const hairMesh = new THREE.Mesh(hairGeo, marbleMaterial);
hairMesh.position.set(0, 1.32, -0.02);
hairMesh.rotation.x = 0.1;
group.add(hairMesh);

const armLGeo = new THREE.CylinderGeometry(0.035, 0.045, 0.35, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.22, 1.0, 0.08);
armLMesh.rotation.set(0.3, 0, 0.8);
group.add(armLMesh);

const armRGeo = new THREE.CylinderGeometry(0.035, 0.045, 0.35, 10);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.22, 1.0, 0.08);
armRMesh.rotation.set(0.3, 0, -0.8);
group.add(armRMesh);

const handLGeo = new THREE.SphereGeometry(0.04, 8, 8);
const handLMesh = new THREE.Mesh(handLGeo, marbleMaterial);
handLMesh.position.set(-0.38, 1.12, 0.15);
group.add(handLMesh);

const handRGeo = new THREE.SphereGeometry(0.04, 8, 8);
const handRMesh = new THREE.Mesh(handRGeo, marbleMaterial);
handRMesh.position.set(0.38, 1.12, 0.15);
group.add(handRMesh);
`
};

async function main() {
    log('=== Starting Batch 2 Statue Generation ===');

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
    log(`Processing ${statueKeys.length} statues in batch 2...`);

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
    }

    await browser.close();

    log('=== Batch 2 Complete ===');
    log(`FINAL: Generated ${generated}, Skipped ${skipped}, Failed ${failed}`);
}

main().catch(err => {
    log(`FATAL ERROR: ${err.message}`);
    console.error(err);
    process.exit(1);
});
