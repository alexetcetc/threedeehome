/**
 * Fix remaining failed statues
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

async function exportStatue(browser, filename, geometryCode) {
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
        log(`FAILED: ${filename} - ${err.message}`);
        return false;
    } finally {
        await page.close();
    }
}

// Fixed statues
const STATUES = {
    // #44 - Good King with Walled City (FIXED)
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
const cityBaseMesh = new THREE.Mesh(cityBaseGeo, marbleMaterialDark);
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

    // #50 - Kalumba Deceiver with Baskets (FIXED)
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

const sunSymbolGeo = new THREE.SphereGeometry(0.025, 8, 8);
const sunSymbolMesh = new THREE.Mesh(sunSymbolGeo, marbleMaterialLight);
sunSymbolMesh.position.set(-0.45, 1.32, 0.03);
group.add(sunSymbolMesh);

const basketLowGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.12, 10);
const basketLowMesh = new THREE.Mesh(basketLowGeo, marbleMaterialDark);
basketLowMesh.position.set(0.35, 0.65, 0);
basketLowMesh.rotation.z = 0.3;
group.add(basketLowMesh);

const boneGeo = new THREE.CylinderGeometry(0.01, 0.015, 0.06, 6);
const boneMesh = new THREE.Mesh(boneGeo, marbleMaterialLight);
boneMesh.position.set(0.38, 0.68, 0.05);
boneMesh.rotation.z = 0.5;
group.add(boneMesh);

const skullGeo = new THREE.SphereGeometry(0.02, 8, 8);
const skullMesh = new THREE.Mesh(skullGeo, marbleMaterialLight);
skullMesh.position.set(0.32, 0.7, -0.02);
group.add(skullMesh);
`
};

async function main() {
    log('=== Generating Fixed Statues ===');

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    for (const [key, code] of Object.entries(STATUES)) {
        const filename = `${key}.gltf`;
        await exportStatue(browser, filename, code);
    }

    await browser.close();
    log('=== Fixes Complete ===');
}

main().catch(err => {
    log(`FATAL ERROR: ${err.message}`);
    process.exit(1);
});
