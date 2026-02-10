/**
 * Generate Upper West Side Test Statues
 * Testing 3 statues from Alex's NYC collection
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const MODELS_DIR = '/Users/alex/Documents/threedeehome/models';
const LOG_FILE = '/Users/alex/Documents/threedeehome/uws_generation.log';

// Marble colors (same as Piranesi statues)
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
 * Upper West Side Test Statues (MEDIUM detail: 10-25 primitives)
 */
const STATUES = {
    // #52 - The Herring Elder
    herring_elder: {
        name: "The Herring Elder",
        geometry: () => `
// Elderly man's body - slightly hunched
const bodyGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.7, 12);
const bodyMesh = new THREE.Mesh(bodyGeo, marbleMaterial);
bodyMesh.position.set(0, 0.45, 0);
bodyMesh.rotation.x = 0.15; // slight hunch
group.add(bodyMesh);

// Legs
const legLGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.5, 10);
const legLMesh = new THREE.Mesh(legLGeo, marbleMaterial);
legLMesh.position.set(-0.08, 0.15, 0);
group.add(legLMesh);

const legRGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.5, 10);
const legRMesh = new THREE.Mesh(legRGeo, marbleMaterial);
legRMesh.position.set(0.08, 0.15, 0);
group.add(legRMesh);

// Torso/shoulders
const torsoGeo = new THREE.SphereGeometry(0.2, 12, 12);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0, 0.85, 0.02);
torsoMesh.scale.set(1.1, 0.8, 0.9);
group.add(torsoMesh);

// Head
const headGeo = new THREE.SphereGeometry(0.12, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 1.1, 0.05);
group.add(headMesh);

// Flat cap
const capBrimGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.02, 12);
const capBrimMesh = new THREE.Mesh(capBrimGeo, marbleMaterialDark);
capBrimMesh.position.set(0, 1.18, 0.08);
capBrimMesh.rotation.x = -0.2;
group.add(capBrimMesh);

const capTopGeo = new THREE.SphereGeometry(0.11, 10, 10);
const capTopMesh = new THREE.Mesh(capTopGeo, marbleMaterialDark);
capTopMesh.position.set(0, 1.2, 0.03);
capTopMesh.scale.set(1, 0.4, 1);
group.add(capTopMesh);

// Arms cradling jar
const armLGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.35, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.18, 0.7, 0.12);
armLMesh.rotation.set(0.8, 0, 0.4);
group.add(armLMesh);

const armRGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.35, 10);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.18, 0.7, 0.12);
armRMesh.rotation.set(0.8, 0, -0.4);
group.add(armRMesh);

// The jar - glass cylinder shape
const jarBodyGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.3, 16);
const jarBodyMesh = new THREE.Mesh(jarBodyGeo, marbleMaterialLight);
jarBodyMesh.position.set(0, 0.65, 0.18);
group.add(jarBodyMesh);

// Jar lid
const jarLidGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.04, 12);
const jarLidMesh = new THREE.Mesh(jarLidGeo, marbleMaterialDark);
jarLidMesh.position.set(0, 0.82, 0.18);
group.add(jarLidMesh);

// Hand on top of jar
const handTopGeo = new THREE.SphereGeometry(0.04, 8, 8);
const handTopMesh = new THREE.Mesh(handTopGeo, marbleMaterial);
handTopMesh.position.set(0, 0.86, 0.18);
group.add(handTopMesh);

// Herring fish inside jar (3 fish shapes)
const fishPositions = [
    [0.03, 0.6, 0.2],
    [-0.04, 0.68, 0.16],
    [0.02, 0.72, 0.22]
];
fishPositions.forEach(pos => {
    const fishGeo = new THREE.SphereGeometry(0.03, 8, 8);
    const fishMesh = new THREE.Mesh(fishGeo, marbleMaterialDark);
    fishMesh.position.set(...pos);
    fishMesh.scale.set(1.8, 0.5, 0.6);
    fishMesh.rotation.z = Math.random() * 0.5 - 0.25;
    group.add(fishMesh);
});

// Cardigan texture - buttons
for (let i = 0; i < 3; i++) {
    const buttonGeo = new THREE.SphereGeometry(0.015, 6, 6);
    const buttonMesh = new THREE.Mesh(buttonGeo, marbleMaterialDark);
    buttonMesh.position.set(0, 0.55 + i * 0.12, 0.17);
    group.add(buttonMesh);
}
`
    },

    // #54 - The Pizza Dispute
    pizza_dispute: {
        name: "The Pizza Dispute",
        geometry: () => `
// Ground base
const groundGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.02, 16);
const groundMesh = new THREE.Mesh(groundGeo, marbleMaterialDark);
groundMesh.position.set(0, 0.01, 0);
group.add(groundMesh);

// Pizza slice - triangular approximation using box
const sliceGeo = new THREE.BoxGeometry(0.35, 0.03, 0.25);
const sliceMesh = new THREE.Mesh(sliceGeo, marbleMaterialLight);
sliceMesh.position.set(0, 0.06, 0);
sliceMesh.rotation.y = 0.2;
group.add(sliceMesh);

// Pizza crust edge
const crustGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.12, 8);
const crustMesh = new THREE.Mesh(crustGeo, marbleMaterial);
crustMesh.position.set(-0.18, 0.06, 0);
crustMesh.rotation.z = Math.PI / 2;
group.add(crustMesh);

// Pepperoni circles on pizza
const pepPositions = [[0.05, 0.08, 0.05], [-0.02, 0.08, -0.04], [0.12, 0.08, 0.02]];
pepPositions.forEach(pos => {
    const pepGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.015, 8);
    const pepMesh = new THREE.Mesh(pepGeo, marbleMaterialDark);
    pepMesh.position.set(...pos);
    group.add(pepMesh);
});

// RAT 1 - Front paws on pizza, claiming
const rat1BodyGeo = new THREE.SphereGeometry(0.06, 10, 10);
const rat1BodyMesh = new THREE.Mesh(rat1BodyGeo, marbleMaterial);
rat1BodyMesh.position.set(0.08, 0.1, 0.2);
rat1BodyMesh.scale.set(1.4, 0.9, 1);
group.add(rat1BodyMesh);

const rat1HeadGeo = new THREE.SphereGeometry(0.04, 10, 10);
const rat1HeadMesh = new THREE.Mesh(rat1HeadGeo, marbleMaterial);
rat1HeadMesh.position.set(0.06, 0.12, 0.1);
rat1HeadMesh.scale.set(1, 0.9, 1.2);
group.add(rat1HeadMesh);

// Rat 1 snout
const rat1SnoutGeo = new THREE.ConeGeometry(0.02, 0.04, 8);
const rat1SnoutMesh = new THREE.Mesh(rat1SnoutGeo, marbleMaterial);
rat1SnoutMesh.position.set(0.05, 0.11, 0.05);
rat1SnoutMesh.rotation.x = Math.PI / 2;
group.add(rat1SnoutMesh);

// Rat 1 tail
const rat1TailGeo = new THREE.CylinderGeometry(0.008, 0.015, 0.15, 6);
const rat1TailMesh = new THREE.Mesh(rat1TailGeo, marbleMaterial);
rat1TailMesh.position.set(0.15, 0.1, 0.28);
rat1TailMesh.rotation.set(-0.3, 0.2, 0.8);
group.add(rat1TailMesh);

// Rat 1 ears
const rat1EarGeo = new THREE.SphereGeometry(0.015, 6, 6);
const rat1EarLMesh = new THREE.Mesh(rat1EarGeo, marbleMaterialLight);
rat1EarLMesh.position.set(0.03, 0.15, 0.12);
group.add(rat1EarLMesh);
const rat1EarRMesh = new THREE.Mesh(rat1EarGeo, marbleMaterialLight);
rat1EarRMesh.position.set(0.09, 0.15, 0.12);
group.add(rat1EarRMesh);

// RAT 2 - Pulling from opposite side
const rat2BodyGeo = new THREE.SphereGeometry(0.055, 10, 10);
const rat2BodyMesh = new THREE.Mesh(rat2BodyGeo, marbleMaterial);
rat2BodyMesh.position.set(-0.05, 0.1, -0.18);
rat2BodyMesh.scale.set(1.3, 0.85, 1);
group.add(rat2BodyMesh);

const rat2HeadGeo = new THREE.SphereGeometry(0.035, 10, 10);
const rat2HeadMesh = new THREE.Mesh(rat2HeadGeo, marbleMaterial);
rat2HeadMesh.position.set(-0.03, 0.11, -0.08);
rat2HeadMesh.scale.set(1, 0.9, 1.2);
group.add(rat2HeadMesh);

// Rat 2 snout
const rat2SnoutGeo = new THREE.ConeGeometry(0.018, 0.035, 8);
const rat2SnoutMesh = new THREE.Mesh(rat2SnoutGeo, marbleMaterial);
rat2SnoutMesh.position.set(-0.02, 0.1, -0.04);
rat2SnoutMesh.rotation.x = Math.PI / 2;
group.add(rat2SnoutMesh);

// Rat 2 tail - curved away
const rat2TailGeo = new THREE.CylinderGeometry(0.007, 0.012, 0.13, 6);
const rat2TailMesh = new THREE.Mesh(rat2TailGeo, marbleMaterial);
rat2TailMesh.position.set(-0.1, 0.08, -0.26);
rat2TailMesh.rotation.set(0.4, -0.3, -0.5);
group.add(rat2TailMesh);

// RAT 3 - Approaching from side, opportunistic
const rat3BodyGeo = new THREE.SphereGeometry(0.05, 10, 10);
const rat3BodyMesh = new THREE.Mesh(rat3BodyGeo, marbleMaterialDark);
rat3BodyMesh.position.set(0.28, 0.08, 0.05);
rat3BodyMesh.scale.set(1.3, 0.8, 0.9);
group.add(rat3BodyMesh);

const rat3HeadGeo = new THREE.SphereGeometry(0.03, 10, 10);
const rat3HeadMesh = new THREE.Mesh(rat3HeadGeo, marbleMaterialDark);
rat3HeadMesh.position.set(0.2, 0.09, 0.04);
rat3HeadMesh.scale.set(1, 0.9, 1.1);
group.add(rat3HeadMesh);

// Rat 3 tail
const rat3TailGeo = new THREE.CylinderGeometry(0.006, 0.01, 0.12, 6);
const rat3TailMesh = new THREE.Mesh(rat3TailGeo, marbleMaterialDark);
rat3TailMesh.position.set(0.38, 0.07, 0.06);
rat3TailMesh.rotation.z = 0.6;
group.add(rat3TailMesh);

// Stretched cheese strand (connecting pizza to rat 1's mouth)
const cheeseGeo = new THREE.CylinderGeometry(0.008, 0.012, 0.12, 6);
const cheeseMesh = new THREE.Mesh(cheeseGeo, marbleMaterialLight);
cheeseMesh.position.set(0.05, 0.1, 0.08);
cheeseMesh.rotation.x = 0.3;
group.add(cheeseMesh);
`
    },

    // #57 - The Vaping Barista
    vaping_barista: {
        name: "The Vaping Barista",
        geometry: () => `
// Wall section (background element)
const wallGeo = new THREE.BoxGeometry(0.8, 1.5, 0.08);
const wallMesh = new THREE.Mesh(wallGeo, marbleMaterialDark);
wallMesh.position.set(0, 0.75, -0.15);
group.add(wallMesh);

// Body - casual lean against wall
const bodyGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.65, 12);
const bodyMesh = new THREE.Mesh(bodyGeo, marbleMaterial);
bodyMesh.position.set(0, 0.5, 0);
bodyMesh.rotation.x = -0.1; // leaning back
group.add(bodyMesh);

// Legs - one straight, one bent with foot on wall
const legLGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.55, 10);
const legLMesh = new THREE.Mesh(legLGeo, marbleMaterial);
legLMesh.position.set(-0.07, 0.18, 0.03);
group.add(legLMesh);

// Right leg bent, foot on wall
const legRUpperGeo = new THREE.CylinderGeometry(0.05, 0.055, 0.28, 10);
const legRUpperMesh = new THREE.Mesh(legRUpperGeo, marbleMaterial);
legRUpperMesh.position.set(0.07, 0.25, -0.02);
legRUpperMesh.rotation.x = -0.4;
group.add(legRUpperMesh);

const legRLowerGeo = new THREE.CylinderGeometry(0.045, 0.05, 0.25, 10);
const legRLowerMesh = new THREE.Mesh(legRLowerGeo, marbleMaterial);
legRLowerMesh.position.set(0.07, 0.15, -0.12);
legRLowerMesh.rotation.x = 0.8;
group.add(legRLowerMesh);

// Foot on wall
const footGeo = new THREE.BoxGeometry(0.06, 0.12, 0.04);
const footMesh = new THREE.Mesh(footGeo, marbleMaterialDark);
footMesh.position.set(0.07, 0.2, -0.12);
footMesh.rotation.x = 0.3;
group.add(footMesh);

// Torso
const torsoGeo = new THREE.CylinderGeometry(0.13, 0.15, 0.35, 12);
const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
torsoMesh.position.set(0, 0.9, -0.02);
torsoMesh.rotation.x = -0.1;
group.add(torsoMesh);

// Apron
const apronGeo = new THREE.BoxGeometry(0.25, 0.4, 0.02);
const apronMesh = new THREE.Mesh(apronGeo, marbleMaterialLight);
apronMesh.position.set(0, 0.55, 0.12);
group.add(apronMesh);

// Apron neck strap
const strapGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.25, 6);
const strapMesh = new THREE.Mesh(strapGeo, marbleMaterialLight);
strapMesh.position.set(0, 0.85, 0.1);
strapMesh.rotation.x = 0.3;
group.add(strapMesh);

// Head - tilted down looking at phone
const headGeo = new THREE.SphereGeometry(0.1, 12, 12);
const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
headMesh.position.set(0, 1.15, 0.02);
headMesh.rotation.x = 0.4; // looking down
group.add(headMesh);

// Man bun
const bunGeo = new THREE.SphereGeometry(0.05, 10, 10);
const bunMesh = new THREE.Mesh(bunGeo, marbleMaterialDark);
bunMesh.position.set(0, 1.22, -0.06);
group.add(bunMesh);

// Left arm - holding vape near mouth
const armLGeo = new THREE.CylinderGeometry(0.035, 0.04, 0.3, 10);
const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
armLMesh.position.set(-0.15, 1.0, 0.08);
armLMesh.rotation.set(0.3, 0, 0.6);
group.add(armLMesh);

// Vape pen
const vapeGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.1, 8);
const vapeMesh = new THREE.Mesh(vapeGeo, marbleMaterialDark);
vapeMesh.position.set(-0.08, 1.08, 0.12);
vapeMesh.rotation.z = 0.3;
group.add(vapeMesh);

// Vape cloud (small puffs)
const cloudPositions = [[-0.05, 1.12, 0.15], [-0.02, 1.15, 0.14], [-0.07, 1.18, 0.12]];
cloudPositions.forEach((pos, i) => {
    const cloudGeo = new THREE.SphereGeometry(0.025 + i * 0.01, 8, 8);
    const cloudMesh = new THREE.Mesh(cloudGeo, marbleMaterialLight);
    cloudMesh.position.set(...pos);
    cloudMesh.scale.set(1.2, 0.8, 0.6);
    group.add(cloudMesh);
});

// Right arm - holding phone down at waist
const armRGeo = new THREE.CylinderGeometry(0.035, 0.04, 0.35, 10);
const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
armRMesh.position.set(0.15, 0.75, 0.1);
armRMesh.rotation.set(0.2, 0, -0.3);
group.add(armRMesh);

// Phone in hand
const phoneGeo = new THREE.BoxGeometry(0.05, 0.1, 0.01);
const phoneMesh = new THREE.Mesh(phoneGeo, marbleMaterialDark);
phoneMesh.position.set(0.18, 0.55, 0.15);
phoneMesh.rotation.x = -0.8;
group.add(phoneMesh);

// Phone screen glow (lighter rectangle)
const screenGeo = new THREE.BoxGeometry(0.04, 0.08, 0.005);
const screenMesh = new THREE.Mesh(screenGeo, marbleMaterialLight);
screenMesh.position.set(0.18, 0.55, 0.156);
screenMesh.rotation.x = -0.8;
group.add(screenMesh);
`
    }
};

// Generate HTML for THREE.js export
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
    log('=== Starting UWS Test Statue Generation ===');
    log(`Output directory: ${MODELS_DIR}`);

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
        if (success) {
            generated++;
        } else {
            failed++;
        }
    }

    await browser.close();

    log('=== Generation Complete ===');
    log(`Generated: ${generated}, Failed: ${failed}`);

    console.log('\nTest files created:');
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
