/**
 * Generate Floor Mattress Scene
 * Mattress, ruffled blanket, pillow, open laptop, glass of water
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const MODELS_DIR = '/Users/alex/Documents/threedeehome/models';

const COLORS = {
    light: '0xd8d4cc',
    medium: '0xd0ccc4',
    dark: '0xc8c4bc'
};

const STATUES = {
    floor_mattress: {
        name: "The Floor Mattress",
        geometry: () => `
// === MATTRESS ===
// Main mattress body
const mattressGeo = new THREE.BoxGeometry(0.9, 0.12, 1.4);
const mattressMesh = new THREE.Mesh(mattressGeo, marbleMaterialLight);
mattressMesh.position.set(0, 0.06, 0);
group.add(mattressMesh);

// Mattress edge piping (all 4 sides)
const pipeFrontGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.9, 8);
const pipeFrontMesh = new THREE.Mesh(pipeFrontGeo, marbleMaterial);
pipeFrontMesh.position.set(0, 0.12, 0.7);
pipeFrontMesh.rotation.z = Math.PI / 2;
group.add(pipeFrontMesh);

const pipeBackGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.9, 8);
const pipeBackMesh = new THREE.Mesh(pipeBackGeo, marbleMaterial);
pipeBackMesh.position.set(0, 0.12, -0.7);
pipeBackMesh.rotation.z = Math.PI / 2;
group.add(pipeBackMesh);

const pipeLeftGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.4, 8);
const pipeLeftMesh = new THREE.Mesh(pipeLeftGeo, marbleMaterial);
pipeLeftMesh.position.set(-0.45, 0.12, 0);
pipeLeftMesh.rotation.x = Math.PI / 2;
group.add(pipeLeftMesh);

const pipeRightGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.4, 8);
const pipeRightMesh = new THREE.Mesh(pipeRightGeo, marbleMaterial);
pipeRightMesh.position.set(0.45, 0.12, 0);
pipeRightMesh.rotation.x = Math.PI / 2;
group.add(pipeRightMesh);

// Mattress quilting pattern (tufts)
for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 5; col++) {
        const tuftGeo = new THREE.SphereGeometry(0.02, 8, 8);
        const tuftMesh = new THREE.Mesh(tuftGeo, marbleMaterial);
        tuftMesh.position.set(-0.25 + row * 0.25, 0.12, -0.5 + col * 0.25);
        tuftMesh.scale.set(1, 0.3, 1);
        group.add(tuftMesh);
    }
}

// === PILLOW ===
// Main pillow body
const pillowGeo = new THREE.BoxGeometry(0.55, 0.1, 0.35);
const pillowMesh = new THREE.Mesh(pillowGeo, marbleMaterialLight);
pillowMesh.position.set(0, 0.18, -0.5);
group.add(pillowMesh);

// Pillow puffiness (rounded top)
const pillowTopGeo = new THREE.SphereGeometry(0.28, 14, 14);
const pillowTopMesh = new THREE.Mesh(pillowTopGeo, marbleMaterialLight);
pillowTopMesh.position.set(0, 0.18, -0.5);
pillowTopMesh.scale.set(1, 0.35, 0.6);
group.add(pillowTopMesh);

// Pillow indent (where head would rest)
const pillowIndentGeo = new THREE.SphereGeometry(0.12, 10, 10);
const pillowIndentMesh = new THREE.Mesh(pillowIndentGeo, marbleMaterial);
pillowIndentMesh.position.set(0, 0.22, -0.48);
pillowIndentMesh.scale.set(1.2, 0.3, 0.8);
group.add(pillowIndentMesh);

// Pillow corner gathers
const gatherPositions = [[-0.25, -0.14], [0.25, -0.14], [-0.25, 0.14], [0.25, 0.14]];
gatherPositions.forEach(pos => {
    const gatherGeo = new THREE.SphereGeometry(0.03, 8, 8);
    const gatherMesh = new THREE.Mesh(gatherGeo, marbleMaterial);
    gatherMesh.position.set(pos[0], 0.16, -0.5 + pos[1]);
    gatherMesh.scale.set(0.8, 0.5, 0.8);
    group.add(gatherMesh);
});

// === BLANKET (ruffled, partially covering mattress) ===
// Main blanket body - draped diagonally
const blanketBaseGeo = new THREE.BoxGeometry(0.75, 0.04, 1.0);
const blanketBaseMesh = new THREE.Mesh(blanketBaseGeo, marbleMaterial);
blanketBaseMesh.position.set(0.05, 0.16, 0.15);
blanketBaseMesh.rotation.y = 0.15;
group.add(blanketBaseMesh);

// Blanket folds and ruffles (multiple overlapping shapes)
// Main fold across middle
const fold1Geo = new THREE.CylinderGeometry(0.04, 0.05, 0.7, 10);
const fold1Mesh = new THREE.Mesh(fold1Geo, marbleMaterial);
fold1Mesh.position.set(0.1, 0.19, 0.1);
fold1Mesh.rotation.z = Math.PI / 2;
fold1Mesh.rotation.y = 0.2;
group.add(fold1Mesh);

// Secondary fold
const fold2Geo = new THREE.CylinderGeometry(0.03, 0.04, 0.5, 10);
const fold2Mesh = new THREE.Mesh(fold2Geo, marbleMaterial);
fold2Mesh.position.set(-0.05, 0.2, 0.3);
fold2Mesh.rotation.z = Math.PI / 2;
fold2Mesh.rotation.y = -0.3;
group.add(fold2Mesh);

// Fold near foot of bed
const fold3Geo = new THREE.CylinderGeometry(0.035, 0.045, 0.6, 10);
const fold3Mesh = new THREE.Mesh(fold3Geo, marbleMaterial);
fold3Mesh.position.set(0, 0.18, 0.45);
fold3Mesh.rotation.z = Math.PI / 2;
fold3Mesh.rotation.y = 0.1;
group.add(fold3Mesh);

// Ruffled edge hanging off mattress
const ruffleGeo = new THREE.BoxGeometry(0.5, 0.15, 0.03);
const ruffleMesh = new THREE.Mesh(ruffleGeo, marbleMaterial);
ruffleMesh.position.set(0.35, 0.1, 0.55);
ruffleMesh.rotation.x = 0.4;
ruffleMesh.rotation.z = 0.1;
group.add(ruffleMesh);

// More ruffle waves
for (let i = 0; i < 4; i++) {
    const waveGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const waveMesh = new THREE.Mesh(waveGeo, marbleMaterial);
    waveMesh.position.set(0.15 + i * 0.1, 0.08, 0.58);
    waveMesh.scale.set(1.2, 0.6, 0.5);
    group.add(waveMesh);
}

// Bunched blanket corner (near pillow, pushed aside)
const bunchGeo = new THREE.SphereGeometry(0.1, 12, 12);
const bunchMesh = new THREE.Mesh(bunchGeo, marbleMaterial);
bunchMesh.position.set(-0.3, 0.2, -0.2);
bunchMesh.scale.set(0.8, 0.6, 1);
group.add(bunchMesh);

const bunch2Geo = new THREE.SphereGeometry(0.07, 10, 10);
const bunch2Mesh = new THREE.Mesh(bunch2Geo, marbleMaterial);
bunch2Mesh.position.set(-0.35, 0.18, -0.08);
bunch2Mesh.scale.set(1, 0.5, 0.8);
group.add(bunch2Mesh);

// Blanket texture - subtle wrinkle lines
for (let i = 0; i < 6; i++) {
    const wrinkleGeo = new THREE.CylinderGeometry(0.008, 0.01, 0.3 + Math.random() * 0.2, 6);
    const wrinkleMesh = new THREE.Mesh(wrinkleGeo, marbleMaterialDark);
    wrinkleMesh.position.set(-0.2 + i * 0.12, 0.185, 0.1 + Math.random() * 0.2);
    wrinkleMesh.rotation.z = Math.PI / 2;
    wrinkleMesh.rotation.y = Math.random() * 0.4 - 0.2;
    group.add(wrinkleMesh);
}

// === LAPTOP (open, beside bed) ===
// Laptop base
const laptopBaseGeo = new THREE.BoxGeometry(0.28, 0.015, 0.2);
const laptopBaseMesh = new THREE.Mesh(laptopBaseGeo, marbleMaterialDark);
laptopBaseMesh.position.set(-0.55, 0.01, 0.3);
laptopBaseMesh.rotation.y = 0.3;
group.add(laptopBaseMesh);

// Laptop keyboard area (recessed)
const keyboardGeo = new THREE.BoxGeometry(0.24, 0.005, 0.12);
const keyboardMesh = new THREE.Mesh(keyboardGeo, marbleMaterial);
keyboardMesh.position.set(-0.55, 0.018, 0.32);
keyboardMesh.rotation.y = 0.3;
group.add(keyboardMesh);

// Trackpad
const trackpadGeo = new THREE.BoxGeometry(0.08, 0.003, 0.05);
const trackpadMesh = new THREE.Mesh(trackpadGeo, marbleMaterialLight);
trackpadMesh.position.set(-0.54, 0.019, 0.4);
trackpadMesh.rotation.y = 0.3;
group.add(trackpadMesh);

// Keyboard keys (simplified rows)
for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 10; col++) {
        const keyGeo = new THREE.BoxGeometry(0.018, 0.004, 0.015);
        const keyMesh = new THREE.Mesh(keyGeo, marbleMaterialDark);
        const baseX = -0.66 + col * 0.022;
        const baseZ = 0.25 + row * 0.022;
        // Apply rotation offset
        const rotY = 0.3;
        const rx = baseX * Math.cos(rotY) - baseZ * Math.sin(rotY);
        const rz = baseX * Math.sin(rotY) + baseZ * Math.cos(rotY);
        keyMesh.position.set(rx, 0.022, rz);
        keyMesh.rotation.y = 0.3;
        group.add(keyMesh);
    }
}

// Laptop screen (open, angled)
const screenGeo = new THREE.BoxGeometry(0.28, 0.19, 0.008);
const screenMesh = new THREE.Mesh(screenGeo, marbleMaterialDark);
screenMesh.position.set(-0.51, 0.11, 0.2);
screenMesh.rotation.x = -0.25;
screenMesh.rotation.y = 0.3;
group.add(screenMesh);

// Screen display (lighter, "glowing")
const displayGeo = new THREE.BoxGeometry(0.25, 0.16, 0.003);
const displayMesh = new THREE.Mesh(displayGeo, marbleMaterialLight);
displayMesh.position.set(-0.51, 0.11, 0.204);
displayMesh.rotation.x = -0.25;
displayMesh.rotation.y = 0.3;
group.add(displayMesh);

// Screen bezel (thin frame)
const bezelTopGeo = new THREE.BoxGeometry(0.28, 0.012, 0.01);
const bezelTopMesh = new THREE.Mesh(bezelTopGeo, marbleMaterialDark);
bezelTopMesh.position.set(-0.505, 0.195, 0.185);
bezelTopMesh.rotation.x = -0.25;
bezelTopMesh.rotation.y = 0.3;
group.add(bezelTopMesh);

// Webcam dot
const webcamGeo = new THREE.SphereGeometry(0.004, 6, 6);
const webcamMesh = new THREE.Mesh(webcamGeo, marbleMaterial);
webcamMesh.position.set(-0.505, 0.2, 0.19);
group.add(webcamMesh);

// Laptop hinge
const hingeGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.26, 8);
const hingeMesh = new THREE.Mesh(hingeGeo, marbleMaterialDark);
hingeMesh.position.set(-0.55, 0.02, 0.22);
hingeMesh.rotation.z = Math.PI / 2;
hingeMesh.rotation.y = 0.3;
group.add(hingeMesh);

// === GLASS OF WATER ===
// Glass body (cylinder, slightly tapered)
const glassGeo = new THREE.CylinderGeometry(0.03, 0.025, 0.1, 16);
const glassMesh = new THREE.Mesh(glassGeo, marbleMaterialLight);
glassMesh.position.set(-0.6, 0.05, 0.55);
group.add(glassMesh);

// Glass rim (torus)
const glassRimGeo = new THREE.TorusGeometry(0.03, 0.004, 8, 16);
const glassRimMesh = new THREE.Mesh(glassRimGeo, marbleMaterial);
glassRimMesh.position.set(-0.6, 0.1, 0.55);
glassRimMesh.rotation.x = Math.PI / 2;
group.add(glassRimMesh);

// Water level (slightly below rim)
const waterGeo = new THREE.CylinderGeometry(0.026, 0.022, 0.07, 16);
const waterMesh = new THREE.Mesh(waterGeo, marbleMaterial);
waterMesh.position.set(-0.6, 0.04, 0.55);
group.add(waterMesh);

// Water surface (top)
const waterTopGeo = new THREE.CircleGeometry(0.026, 16);
const waterTopMesh = new THREE.Mesh(waterTopGeo, marbleMaterial);
waterTopMesh.position.set(-0.6, 0.075, 0.55);
waterTopMesh.rotation.x = -Math.PI / 2;
group.add(waterTopMesh);

// Glass bottom (thicker)
const glassBottomGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.01, 16);
const glassBottomMesh = new THREE.Mesh(glassBottomGeo, marbleMaterialDark);
glassBottomMesh.position.set(-0.6, 0.005, 0.55);
group.add(glassBottomMesh);

// Condensation droplets on glass
for (let i = 0; i < 8; i++) {
    const dropGeo = new THREE.SphereGeometry(0.004, 6, 6);
    const dropMesh = new THREE.Mesh(dropGeo, marbleMaterialLight);
    const angle = (i / 8) * Math.PI * 2;
    const height = 0.02 + Math.random() * 0.06;
    dropMesh.position.set(
        -0.6 + Math.cos(angle) * 0.032,
        height,
        0.55 + Math.sin(angle) * 0.032
    );
    dropMesh.scale.set(0.8, 1.2, 0.8);
    group.add(dropMesh);
}

// === FLOOR SHADOW/CONTEXT ===
// Subtle floor indication
const floorGeo = new THREE.PlaneGeometry(1.3, 1.8);
const floorMesh = new THREE.Mesh(floorGeo, marbleMaterialDark);
floorMesh.position.set(-0.1, 0.001, 0.1);
floorMesh.rotation.x = -Math.PI / 2;
group.add(floorMesh);
`
    }
};

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

async function main() {
    console.log('Generating floor mattress scene...');

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();

    try {
        const html = generateHTML(STATUES.floor_mattress.geometry());
        await page.setContent(html);
        await page.waitForFunction('window.exportComplete === true', { timeout: 30000 });

        const gltfData = await page.evaluate(() => window.gltfData);
        const filepath = path.join(MODELS_DIR, 'floor_mattress.gltf');
        fs.writeFileSync(filepath, gltfData);

        const stats = fs.statSync(filepath);
        const gltf = JSON.parse(gltfData);
        const meshCount = gltf.meshes ? gltf.meshes.length : 0;

        console.log(`SUCCESS: floor_mattress.gltf - ${meshCount} meshes, ${(stats.size / 1024).toFixed(1)} KB`);
    } catch (err) {
        console.log(`ERROR: ${err.message}`);
    }

    await browser.close();
}

main();
