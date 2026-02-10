/**
 * Angel Caught on Rose Bush Statue Generator
 *
 * Creates a medium detail (10-25 primitives) statue of an angel
 * with wings tangled in a thorny rose bush. The pose suggests
 * struggle but also grace.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Output path
const OUTPUT_PATH = '/Users/alex/Documents/threedeehome/models/angel_rose_bush.gltf';

// Weathered marble palette
const MARBLE_COLORS = {
    light: 0xd8d4cc,   // Highlights
    medium: 0xd0ccc4,  // Main body
    dark: 0xc8c4bc     // Shadows, details
};

/**
 * Generate Angel Caught on Rose Bush - Medium Detail
 * Target: 10-25 primitives
 *
 * Composition:
 * - Angel body (torso, head, robe) - graceful but struggling pose
 * - Wings (tangled, spread at awkward angles)
 * - Arms (reaching, one caught)
 * - Rose bush (thorny branches, roses)
 */
function generateAngelRoseBushMedium() {
    return `
    // ===== ANGEL BODY =====
    // Torso - twisted in struggle
    const torsoGeo = new THREE.CylinderGeometry(0.14, 0.20, 0.45, 12);
    const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
    torsoMesh.position.set(0, 0.85, 0);
    torsoMesh.rotation.set(0.15, 0.2, -0.1); // Twisted pose
    group.add(torsoMesh);

    // Robe/lower body - flowing, caught
    const robeGeo = new THREE.ConeGeometry(0.30, 0.60, 12);
    const robeMesh = new THREE.Mesh(robeGeo, marbleMaterial);
    robeMesh.position.set(0, 0.32, 0);
    robeMesh.rotation.set(0.08, 0, 0.05);
    group.add(robeMesh);

    // Robe folds suggesting movement
    const fold1Geo = new THREE.CylinderGeometry(0.015, 0.05, 0.55, 8);
    const fold1Mesh = new THREE.Mesh(fold1Geo, marbleMaterialDark);
    fold1Mesh.position.set(0.12, 0.30, 0.15);
    fold1Mesh.rotation.set(0.1, 0, 0.12);
    group.add(fold1Mesh);

    // ===== HEAD =====
    const headGeo = new THREE.SphereGeometry(0.13, 14, 14);
    const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
    headMesh.position.set(0.02, 1.22, 0.02);
    headMesh.rotation.set(-0.25, 0.35, 0.1); // Looking up/aside in struggle
    group.add(headMesh);

    // Hair - disheveled from struggle
    const hairGeo = new THREE.SphereGeometry(0.14, 10, 10);
    const hairMesh = new THREE.Mesh(hairGeo, marbleMaterial);
    hairMesh.position.set(0, 1.30, -0.03);
    hairMesh.scale.set(1, 0.65, 0.9);
    group.add(hairMesh);

    // ===== WINGS (Tangled) =====
    // Left wing - caught in thorns, bent awkwardly
    const wingL1Geo = new THREE.BoxGeometry(0.03, 0.55, 0.35);
    const wingL1Mesh = new THREE.Mesh(wingL1Geo, marbleMaterialLight);
    wingL1Mesh.position.set(-0.30, 1.0, -0.20);
    wingL1Mesh.rotation.set(0.4, 0.3, Math.PI/3.5); // Awkward angle - caught
    group.add(wingL1Mesh);

    // Left wing upper - pulled back
    const wingL2Geo = new THREE.BoxGeometry(0.025, 0.40, 0.25);
    const wingL2Mesh = new THREE.Mesh(wingL2Geo, marbleMaterialLight);
    wingL2Mesh.position.set(-0.48, 1.25, -0.35);
    wingL2Mesh.rotation.set(0.5, 0.4, Math.PI/2.8);
    group.add(wingL2Mesh);

    // Right wing - straining to break free
    const wingR1Geo = new THREE.BoxGeometry(0.03, 0.60, 0.38);
    const wingR1Mesh = new THREE.Mesh(wingR1Geo, marbleMaterialLight);
    wingR1Mesh.position.set(0.32, 1.05, -0.18);
    wingR1Mesh.rotation.set(0.35, -0.25, -Math.PI/4.5);
    group.add(wingR1Mesh);

    // Right wing upper - extended
    const wingR2Geo = new THREE.BoxGeometry(0.025, 0.45, 0.28);
    const wingR2Mesh = new THREE.Mesh(wingR2Geo, marbleMaterialLight);
    wingR2Mesh.position.set(0.52, 1.38, -0.30);
    wingR2Mesh.rotation.set(0.45, -0.35, -Math.PI/3.2);
    group.add(wingR2Mesh);

    // ===== ARMS =====
    // Right arm - reaching out, graceful
    const armRGeo = new THREE.CylinderGeometry(0.035, 0.045, 0.32, 10);
    const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
    armRMesh.position.set(0.20, 1.0, 0.15);
    armRMesh.rotation.set(0.6, 0.1, -0.7);
    group.add(armRMesh);

    // Right hand reaching
    const handRGeo = new THREE.SphereGeometry(0.035, 8, 8);
    const handRMesh = new THREE.Mesh(handRGeo, marbleMaterial);
    handRMesh.position.set(0.38, 0.92, 0.32);
    handRMesh.scale.set(0.8, 1, 0.6);
    group.add(handRMesh);

    // Left arm - caught, pulled back
    const armLGeo = new THREE.CylinderGeometry(0.035, 0.045, 0.28, 10);
    const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
    armLMesh.position.set(-0.18, 0.95, -0.05);
    armLMesh.rotation.set(0.3, 0.4, 0.8);
    group.add(armLMesh);

    // ===== ROSE BUSH (Thorny) =====
    // Main branch - thick, gnarled
    const branch1Geo = new THREE.CylinderGeometry(0.04, 0.06, 0.70, 8);
    const branch1Mesh = new THREE.Mesh(branch1Geo, marbleMaterialDark);
    branch1Mesh.position.set(-0.45, 0.50, -0.25);
    branch1Mesh.rotation.set(0.3, 0.2, 0.6);
    group.add(branch1Mesh);

    // Secondary branch - wrapping toward wing
    const branch2Geo = new THREE.CylinderGeometry(0.025, 0.04, 0.50, 8);
    const branch2Mesh = new THREE.Mesh(branch2Geo, marbleMaterialDark);
    branch2Mesh.position.set(-0.38, 0.85, -0.30);
    branch2Mesh.rotation.set(-0.2, 0.3, 0.4);
    group.add(branch2Mesh);

    // Third branch - reaching up
    const branch3Geo = new THREE.CylinderGeometry(0.02, 0.03, 0.40, 8);
    const branch3Mesh = new THREE.Mesh(branch3Geo, marbleMaterialDark);
    branch3Mesh.position.set(-0.52, 1.10, -0.35);
    branch3Mesh.rotation.set(0.5, -0.2, 0.3);
    group.add(branch3Mesh);

    // Thorns on branches (small cones)
    const thorn1Geo = new THREE.ConeGeometry(0.012, 0.05, 6);
    const thorn1Mesh = new THREE.Mesh(thorn1Geo, marbleMaterialDark);
    thorn1Mesh.position.set(-0.42, 0.60, -0.22);
    thorn1Mesh.rotation.set(0.5, 0, 1.2);
    group.add(thorn1Mesh);

    const thorn2Geo = new THREE.ConeGeometry(0.012, 0.05, 6);
    const thorn2Mesh = new THREE.Mesh(thorn2Geo, marbleMaterialDark);
    thorn2Mesh.position.set(-0.48, 0.75, -0.28);
    thorn2Mesh.rotation.set(-0.3, 0, 0.8);
    group.add(thorn2Mesh);

    const thorn3Geo = new THREE.ConeGeometry(0.010, 0.04, 6);
    const thorn3Mesh = new THREE.Mesh(thorn3Geo, marbleMaterialDark);
    thorn3Mesh.position.set(-0.35, 0.90, -0.32);
    thorn3Mesh.rotation.set(0.2, 0.5, -0.6);
    group.add(thorn3Mesh);

    // ===== ROSES =====
    // Rose 1 - blooming (sphere core with petal layers)
    const rose1CoreGeo = new THREE.SphereGeometry(0.045, 10, 10);
    const rose1CoreMesh = new THREE.Mesh(rose1CoreGeo, marbleMaterial);
    rose1CoreMesh.position.set(-0.55, 0.70, -0.20);
    group.add(rose1CoreMesh);

    // Rose 1 petals (flattened torus)
    const rose1PetalGeo = new THREE.TorusGeometry(0.05, 0.02, 6, 10);
    const rose1PetalMesh = new THREE.Mesh(rose1PetalGeo, marbleMaterialLight);
    rose1PetalMesh.position.set(-0.55, 0.70, -0.18);
    rose1PetalMesh.rotation.set(Math.PI/2.5, 0, 0);
    group.add(rose1PetalMesh);

    // Rose 2 - smaller, near tangled wing
    const rose2Geo = new THREE.SphereGeometry(0.035, 8, 8);
    const rose2Mesh = new THREE.Mesh(rose2Geo, marbleMaterial);
    rose2Mesh.position.set(-0.40, 1.15, -0.38);
    group.add(rose2Mesh);
    `;
}

/**
 * Generate the HTML content for export
 */
function generateHTML(geometryCode) {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Angel Rose Bush Export</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/exporters/GLTFExporter.js"></script>
</head>
<body>
<script>
// Setup scene
const scene = new THREE.Scene();
const group = new THREE.Group();

// Marble materials - Weathered marble palette
const marbleMaterialLight = new THREE.MeshStandardMaterial({
    color: 0xd8d4cc,
    roughness: 0.7,
    metalness: 0.0
});
const marbleMaterial = new THREE.MeshStandardMaterial({
    color: 0xd0ccc4,
    roughness: 0.75,
    metalness: 0.0
});
const marbleMaterialDark = new THREE.MeshStandardMaterial({
    color: 0xc8c4bc,
    roughness: 0.8,
    metalness: 0.0
});

// Generate geometry
${geometryCode}

// Add group to scene
scene.add(group);

// Export to GLTF
const exporter = new THREE.GLTFExporter();
exporter.parse(scene, function(gltf) {
    window.gltfData = JSON.stringify(gltf);
    window.exportComplete = true;
}, { binary: false });
</script>
</body>
</html>`;
}

/**
 * Main export function
 */
async function main() {
    console.log('Generating Angel Caught on Rose Bush statue...\n');

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();

        const geometryCode = generateAngelRoseBushMedium();
        const htmlContent = generateHTML(geometryCode);

        // Navigate to page with HTML content
        await page.setContent(htmlContent);

        // Wait for export to complete
        await page.waitForFunction('window.exportComplete === true', { timeout: 30000 });

        // Get the GLTF data
        const gltfData = await page.evaluate(() => window.gltfData);

        // Count primitives (meshes)
        const gltf = JSON.parse(gltfData);
        const meshCount = gltf.meshes ? gltf.meshes.length : 0;

        // Write to file
        fs.writeFileSync(OUTPUT_PATH, gltfData);

        // Get file size
        const stats = fs.statSync(OUTPUT_PATH);
        const fileSizeKB = (stats.size / 1024).toFixed(1);

        console.log('========== EXPORT COMPLETE ==========');
        console.log(`Statue: Angel Caught on Rose Bush`);
        console.log(`Detail Level: MEDIUM`);
        console.log(`Primitive Count: ${meshCount} meshes`);
        console.log(`File Size: ${fileSizeKB} KB`);
        console.log(`Output: ${OUTPUT_PATH}`);
        console.log('=====================================');

        await page.close();
    } finally {
        await browser.close();
    }
}

main().catch(console.error);
