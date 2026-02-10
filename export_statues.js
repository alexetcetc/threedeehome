/**
 * Statue Generator - Creates A-Frame primitive statues and exports to GLTF
 *
 * Uses Puppeteer to run Three.js in a browser context for GLTF export
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Output directory
const MODELS_DIR = '/Users/alex/Documents/threedeehome/models';

// Marble color palette
const MARBLE_COLORS = {
    light: 0xd8d4cc,
    medium: 0xd0ccc4,
    dark: 0xc8c4bc,
    vein: 0xbeb8b0
};

/**
 * Statue definitions with geometry at each detail level
 */
const STATUES = {
    broken_finger: {
        name: "Broken Marble Finger",
        low: generateBrokenFingerLow,
        medium: generateBrokenFingerMedium,
        high: generateBrokenFingerHigh
    },
    angel_trumpet: {
        name: "Angel Blowing Trumpet",
        low: generateAngelLow,
        medium: generateAngelMedium,
        high: generateAngelHigh
    },
    elephant_castle: {
        name: "Elephant Carrying Castle",
        low: generateElephantLow,
        medium: generateElephantMedium,
        high: generateElephantHigh
    }
};

// ============ BROKEN FINGER GENERATORS ============

function generateBrokenFingerLow() {
    // LOW: 3-5 primitives - Abstract finger shape
    return `
    // Main finger shaft - tapered cylinder
    const fingerGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.8, 8);
    const fingerMesh = new THREE.Mesh(fingerGeo, marbleMaterial);
    fingerMesh.position.set(0, 0.4, 0);
    fingerMesh.rotation.z = 0.1;
    group.add(fingerMesh);

    // Fingertip - sphere
    const tipGeo = new THREE.SphereGeometry(0.09, 8, 8);
    const tipMesh = new THREE.Mesh(tipGeo, marbleMaterial);
    tipMesh.position.set(0.02, 0.82, 0);
    group.add(tipMesh);

    // Jagged break base - irregular box
    const breakGeo = new THREE.BoxGeometry(0.25, 0.12, 0.2);
    const breakMesh = new THREE.Mesh(breakGeo, marbleMaterialDark);
    breakMesh.position.set(-0.02, 0.02, 0);
    breakMesh.rotation.set(0.1, 0.2, -0.05);
    group.add(breakMesh);
    `;
}

function generateBrokenFingerMedium() {
    // MEDIUM: 12-18 primitives - Recognizable finger with joint details
    return `
    // Base segment (proximal phalanx)
    const baseGeo = new THREE.CylinderGeometry(0.10, 0.14, 0.35, 12);
    const baseMesh = new THREE.Mesh(baseGeo, marbleMaterial);
    baseMesh.position.set(0, 0.18, 0);
    baseMesh.rotation.z = 0.08;
    group.add(baseMesh);

    // First knuckle bulge
    const knuckle1Geo = new THREE.SphereGeometry(0.11, 12, 12);
    const knuckle1Mesh = new THREE.Mesh(knuckle1Geo, marbleMaterial);
    knuckle1Mesh.position.set(0.01, 0.38, 0);
    knuckle1Mesh.scale.set(1, 0.7, 0.9);
    group.add(knuckle1Mesh);

    // Middle segment (middle phalanx)
    const middleGeo = new THREE.CylinderGeometry(0.085, 0.10, 0.28, 12);
    const middleMesh = new THREE.Mesh(middleGeo, marbleMaterial);
    middleMesh.position.set(0.02, 0.54, 0);
    middleMesh.rotation.z = 0.05;
    group.add(middleMesh);

    // Second knuckle
    const knuckle2Geo = new THREE.SphereGeometry(0.09, 12, 12);
    const knuckle2Mesh = new THREE.Mesh(knuckle2Geo, marbleMaterial);
    knuckle2Mesh.position.set(0.03, 0.70, 0);
    knuckle2Mesh.scale.set(1, 0.7, 0.9);
    group.add(knuckle2Mesh);

    // Distal segment (distal phalanx)
    const distalGeo = new THREE.CylinderGeometry(0.06, 0.085, 0.22, 12);
    const distalMesh = new THREE.Mesh(distalGeo, marbleMaterial);
    distalMesh.position.set(0.04, 0.82, 0);
    distalMesh.rotation.z = 0.03;
    group.add(distalMesh);

    // Fingertip rounded
    const tipGeo = new THREE.SphereGeometry(0.065, 12, 12);
    const tipMesh = new THREE.Mesh(tipGeo, marbleMaterial);
    tipMesh.position.set(0.045, 0.94, 0);
    tipMesh.scale.set(1, 1.2, 0.85);
    group.add(tipMesh);

    // Fingernail (flat ellipse)
    const nailGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.01, 8);
    const nailMesh = new THREE.Mesh(nailGeo, marbleMaterialLight);
    nailMesh.position.set(0.048, 0.95, 0.04);
    nailMesh.rotation.x = Math.PI / 2;
    nailMesh.scale.set(0.8, 1, 1.4);
    group.add(nailMesh);

    // Jagged break - multiple pieces
    const break1Geo = new THREE.TetrahedronGeometry(0.12);
    const break1Mesh = new THREE.Mesh(break1Geo, marbleMaterialDark);
    break1Mesh.position.set(-0.04, 0.03, 0.02);
    break1Mesh.rotation.set(0.3, 0.5, 0.2);
    group.add(break1Mesh);

    const break2Geo = new THREE.TetrahedronGeometry(0.10);
    const break2Mesh = new THREE.Mesh(break2Geo, marbleMaterialDark);
    break2Mesh.position.set(0.05, 0.02, -0.03);
    break2Mesh.rotation.set(-0.2, 0.8, 0.1);
    group.add(break2Mesh);

    const break3Geo = new THREE.TetrahedronGeometry(0.08);
    const break3Mesh = new THREE.Mesh(break3Geo, marbleMaterial);
    break3Mesh.position.set(0, 0.01, 0.06);
    break3Mesh.rotation.set(0.5, -0.3, 0.4);
    group.add(break3Mesh);

    // Wrinkle lines on knuckles (thin boxes)
    const wrinkle1Geo = new THREE.BoxGeometry(0.15, 0.008, 0.04);
    const wrinkle1Mesh = new THREE.Mesh(wrinkle1Geo, marbleMaterialDark);
    wrinkle1Mesh.position.set(0.015, 0.40, 0.08);
    group.add(wrinkle1Mesh);

    const wrinkle2Geo = new THREE.BoxGeometry(0.12, 0.008, 0.035);
    const wrinkle2Mesh = new THREE.Mesh(wrinkle2Geo, marbleMaterialDark);
    wrinkle2Mesh.position.set(0.035, 0.72, 0.07);
    group.add(wrinkle2Mesh);
    `;
}

function generateBrokenFingerHigh() {
    // HIGH: 35-45 primitives - Detailed anatomy with skin texture
    return `
    // ===== BASE SEGMENT (Proximal Phalanx) =====
    const baseGeo = new THREE.CylinderGeometry(0.10, 0.14, 0.35, 16);
    const baseMesh = new THREE.Mesh(baseGeo, marbleMaterial);
    baseMesh.position.set(0, 0.18, 0);
    baseMesh.rotation.z = 0.08;
    group.add(baseMesh);

    // Side tendons
    const tendon1Geo = new THREE.CylinderGeometry(0.015, 0.02, 0.32, 8);
    const tendon1Mesh = new THREE.Mesh(tendon1Geo, marbleMaterial);
    tendon1Mesh.position.set(0.08, 0.18, 0.04);
    tendon1Mesh.rotation.z = 0.08;
    group.add(tendon1Mesh);

    const tendon2Geo = new THREE.CylinderGeometry(0.015, 0.02, 0.32, 8);
    const tendon2Mesh = new THREE.Mesh(tendon2Geo, marbleMaterial);
    tendon2Mesh.position.set(-0.06, 0.18, 0.04);
    tendon2Mesh.rotation.z = 0.08;
    group.add(tendon2Mesh);

    // ===== FIRST KNUCKLE =====
    const knuckle1Geo = new THREE.SphereGeometry(0.11, 16, 16);
    const knuckle1Mesh = new THREE.Mesh(knuckle1Geo, marbleMaterial);
    knuckle1Mesh.position.set(0.01, 0.38, 0);
    knuckle1Mesh.scale.set(1, 0.7, 0.9);
    group.add(knuckle1Mesh);

    // Knuckle bone bumps
    const bumpL1Geo = new THREE.SphereGeometry(0.025, 8, 8);
    const bumpL1Mesh = new THREE.Mesh(bumpL1Geo, marbleMaterial);
    bumpL1Mesh.position.set(0.09, 0.38, 0);
    group.add(bumpL1Mesh);

    const bumpR1Geo = new THREE.SphereGeometry(0.025, 8, 8);
    const bumpR1Mesh = new THREE.Mesh(bumpR1Geo, marbleMaterial);
    bumpR1Mesh.position.set(-0.07, 0.38, 0);
    group.add(bumpR1Mesh);

    // Wrinkles at first knuckle
    for (let i = 0; i < 4; i++) {
        const wrinkleGeo = new THREE.BoxGeometry(0.14 - i * 0.02, 0.006, 0.03);
        const wrinkleMesh = new THREE.Mesh(wrinkleGeo, marbleMaterialDark);
        wrinkleMesh.position.set(0.015, 0.395 + i * 0.015, 0.09);
        group.add(wrinkleMesh);
    }

    // ===== MIDDLE SEGMENT =====
    const middleGeo = new THREE.CylinderGeometry(0.085, 0.10, 0.28, 16);
    const middleMesh = new THREE.Mesh(middleGeo, marbleMaterial);
    middleMesh.position.set(0.02, 0.54, 0);
    middleMesh.rotation.z = 0.05;
    group.add(middleMesh);

    // Side tendons middle
    const tendon3Geo = new THREE.CylinderGeometry(0.012, 0.015, 0.26, 8);
    const tendon3Mesh = new THREE.Mesh(tendon3Geo, marbleMaterial);
    tendon3Mesh.position.set(0.085, 0.54, 0.03);
    tendon3Mesh.rotation.z = 0.05;
    group.add(tendon3Mesh);

    const tendon4Geo = new THREE.CylinderGeometry(0.012, 0.015, 0.26, 8);
    const tendon4Mesh = new THREE.Mesh(tendon4Geo, marbleMaterial);
    tendon4Mesh.position.set(-0.045, 0.54, 0.03);
    tendon4Mesh.rotation.z = 0.05;
    group.add(tendon4Mesh);

    // ===== SECOND KNUCKLE =====
    const knuckle2Geo = new THREE.SphereGeometry(0.09, 16, 16);
    const knuckle2Mesh = new THREE.Mesh(knuckle2Geo, marbleMaterial);
    knuckle2Mesh.position.set(0.03, 0.70, 0);
    knuckle2Mesh.scale.set(1, 0.7, 0.9);
    group.add(knuckle2Mesh);

    // Knuckle bone bumps
    const bumpL2Geo = new THREE.SphereGeometry(0.02, 8, 8);
    const bumpL2Mesh = new THREE.Mesh(bumpL2Geo, marbleMaterial);
    bumpL2Mesh.position.set(0.10, 0.70, 0);
    group.add(bumpL2Mesh);

    const bumpR2Geo = new THREE.SphereGeometry(0.02, 8, 8);
    const bumpR2Mesh = new THREE.Mesh(bumpR2Geo, marbleMaterial);
    bumpR2Mesh.position.set(-0.04, 0.70, 0);
    group.add(bumpR2Mesh);

    // Wrinkles at second knuckle
    for (let i = 0; i < 3; i++) {
        const wrinkleGeo = new THREE.BoxGeometry(0.11 - i * 0.02, 0.005, 0.025);
        const wrinkleMesh = new THREE.Mesh(wrinkleGeo, marbleMaterialDark);
        wrinkleMesh.position.set(0.035, 0.715 + i * 0.012, 0.075);
        group.add(wrinkleMesh);
    }

    // ===== DISTAL SEGMENT =====
    const distalGeo = new THREE.CylinderGeometry(0.06, 0.085, 0.22, 16);
    const distalMesh = new THREE.Mesh(distalGeo, marbleMaterial);
    distalMesh.position.set(0.04, 0.82, 0);
    distalMesh.rotation.z = 0.03;
    group.add(distalMesh);

    // ===== FINGERTIP =====
    const tipGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const tipMesh = new THREE.Mesh(tipGeo, marbleMaterial);
    tipMesh.position.set(0.045, 0.94, 0);
    tipMesh.scale.set(1, 1.2, 0.85);
    group.add(tipMesh);

    // Fingertip pad (underside)
    const padGeo = new THREE.SphereGeometry(0.055, 12, 12);
    const padMesh = new THREE.Mesh(padGeo, marbleMaterial);
    padMesh.position.set(0.045, 0.92, -0.03);
    padMesh.scale.set(0.9, 1.1, 0.7);
    group.add(padMesh);

    // ===== FINGERNAIL =====
    // Nail bed
    const nailBedGeo = new THREE.BoxGeometry(0.065, 0.12, 0.01);
    const nailBedMesh = new THREE.Mesh(nailBedGeo, marbleMaterialLight);
    nailBedMesh.position.set(0.048, 0.94, 0.05);
    group.add(nailBedMesh);

    // Nail surface
    const nailGeo = new THREE.CylinderGeometry(0.035, 0.04, 0.01, 12);
    const nailMesh = new THREE.Mesh(nailGeo, marbleMaterialLight);
    nailMesh.position.set(0.048, 0.95, 0.055);
    nailMesh.rotation.x = Math.PI / 2;
    nailMesh.scale.set(0.85, 1, 1.5);
    group.add(nailMesh);

    // Cuticle
    const cuticleGeo = new THREE.TorusGeometry(0.035, 0.008, 8, 12, Math.PI);
    const cuticleMesh = new THREE.Mesh(cuticleGeo, marbleMaterial);
    cuticleMesh.position.set(0.048, 0.88, 0.055);
    cuticleMesh.rotation.x = Math.PI / 2;
    cuticleMesh.rotation.z = Math.PI;
    group.add(cuticleMesh);

    // ===== JAGGED BREAK =====
    // Large break shards
    const break1Geo = new THREE.TetrahedronGeometry(0.14);
    const break1Mesh = new THREE.Mesh(break1Geo, marbleMaterialDark);
    break1Mesh.position.set(-0.05, 0.04, 0.03);
    break1Mesh.rotation.set(0.3, 0.5, 0.2);
    group.add(break1Mesh);

    const break2Geo = new THREE.TetrahedronGeometry(0.12);
    const break2Mesh = new THREE.Mesh(break2Geo, marbleMaterialDark);
    break2Mesh.position.set(0.06, 0.03, -0.04);
    break2Mesh.rotation.set(-0.2, 0.8, 0.1);
    group.add(break2Mesh);

    const break3Geo = new THREE.TetrahedronGeometry(0.10);
    const break3Mesh = new THREE.Mesh(break3Geo, marbleMaterial);
    break3Mesh.position.set(0.02, 0.02, 0.08);
    break3Mesh.rotation.set(0.5, -0.3, 0.4);
    group.add(break3Mesh);

    // Small debris
    const debris1Geo = new THREE.TetrahedronGeometry(0.05);
    const debris1Mesh = new THREE.Mesh(debris1Geo, marbleMaterial);
    debris1Mesh.position.set(-0.08, 0.01, -0.06);
    debris1Mesh.rotation.set(1.2, 0.4, 0.8);
    group.add(debris1Mesh);

    const debris2Geo = new THREE.OctahedronGeometry(0.04);
    const debris2Mesh = new THREE.Mesh(debris2Geo, marbleMaterialDark);
    debris2Mesh.position.set(0.1, 0.01, 0.05);
    debris2Mesh.rotation.set(0.7, 1.1, 0.3);
    group.add(debris2Mesh);

    const debris3Geo = new THREE.TetrahedronGeometry(0.035);
    const debris3Mesh = new THREE.Mesh(debris3Geo, marbleMaterial);
    debris3Mesh.position.set(-0.03, 0.015, -0.09);
    debris3Mesh.rotation.set(0.9, 0.2, 1.5);
    group.add(debris3Mesh);

    // Crack lines radiating from break
    const crack1Geo = new THREE.BoxGeometry(0.005, 0.15, 0.005);
    const crack1Mesh = new THREE.Mesh(crack1Geo, marbleMaterialDark);
    crack1Mesh.position.set(0.05, 0.10, 0.06);
    crack1Mesh.rotation.set(0.2, 0, 0.3);
    group.add(crack1Mesh);

    const crack2Geo = new THREE.BoxGeometry(0.005, 0.12, 0.005);
    const crack2Mesh = new THREE.Mesh(crack2Geo, marbleMaterialDark);
    crack2Mesh.position.set(-0.04, 0.08, -0.05);
    crack2Mesh.rotation.set(-0.15, 0, -0.25);
    group.add(crack2Mesh);
    `;
}

// ============ ANGEL TRUMPET GENERATORS ============

function generateAngelLow() {
    // LOW: 6-8 primitives - Symbolic angel shape
    return `
    // Body - cone
    const bodyGeo = new THREE.ConeGeometry(0.3, 1.2, 8);
    const bodyMesh = new THREE.Mesh(bodyGeo, marbleMaterial);
    bodyMesh.position.set(0, 0.6, 0);
    group.add(bodyMesh);

    // Head - sphere
    const headGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
    headMesh.position.set(0, 1.35, 0);
    group.add(headMesh);

    // Left wing - flattened cone
    const wingLGeo = new THREE.ConeGeometry(0.5, 0.8, 4);
    const wingLMesh = new THREE.Mesh(wingLGeo, marbleMaterialLight);
    wingLMesh.position.set(-0.5, 1.0, -0.1);
    wingLMesh.rotation.set(0, 0, Math.PI/3);
    wingLMesh.scale.set(0.15, 1, 0.8);
    group.add(wingLMesh);

    // Right wing
    const wingRGeo = new THREE.ConeGeometry(0.5, 0.8, 4);
    const wingRMesh = new THREE.Mesh(wingRGeo, marbleMaterialLight);
    wingRMesh.position.set(0.5, 1.0, -0.1);
    wingRMesh.rotation.set(0, 0, -Math.PI/3);
    wingRMesh.scale.set(0.15, 1, 0.8);
    group.add(wingRMesh);

    // Trumpet - cylinder
    const trumpetGeo = new THREE.CylinderGeometry(0.03, 0.12, 0.5, 8);
    const trumpetMesh = new THREE.Mesh(trumpetGeo, marbleMaterialDark);
    trumpetMesh.position.set(0.35, 1.3, 0.15);
    trumpetMesh.rotation.z = -Math.PI/4;
    group.add(trumpetMesh);

    // Arms reaching to trumpet - simple cylinder
    const armGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.4, 8);
    const armMesh = new THREE.Mesh(armGeo, marbleMaterial);
    armMesh.position.set(0.18, 1.15, 0.1);
    armMesh.rotation.z = -Math.PI/5;
    group.add(armMesh);
    `;
}

function generateAngelMedium() {
    // MEDIUM: 18-25 primitives
    return `
    // ===== BODY =====
    // Torso
    const torsoGeo = new THREE.CylinderGeometry(0.18, 0.25, 0.5, 12);
    const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
    torsoMesh.position.set(0, 0.95, 0);
    group.add(torsoMesh);

    // Robe/lower body
    const robeGeo = new THREE.ConeGeometry(0.35, 0.7, 12);
    const robeMesh = new THREE.Mesh(robeGeo, marbleMaterial);
    robeMesh.position.set(0, 0.35, 0);
    group.add(robeMesh);

    // Robe folds
    const fold1Geo = new THREE.CylinderGeometry(0.02, 0.06, 0.65, 8);
    const fold1Mesh = new THREE.Mesh(fold1Geo, marbleMaterialDark);
    fold1Mesh.position.set(0.15, 0.33, 0.2);
    fold1Mesh.rotation.set(0.1, 0, 0.08);
    group.add(fold1Mesh);

    const fold2Geo = new THREE.CylinderGeometry(0.02, 0.05, 0.6, 8);
    const fold2Mesh = new THREE.Mesh(fold2Geo, marbleMaterialDark);
    fold2Mesh.position.set(-0.12, 0.35, 0.18);
    fold2Mesh.rotation.set(0.08, 0, -0.1);
    group.add(fold2Mesh);

    // ===== HEAD =====
    const headGeo = new THREE.SphereGeometry(0.16, 16, 16);
    const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
    headMesh.position.set(0, 1.35, 0);
    group.add(headMesh);

    // Hair - wavy top
    const hairGeo = new THREE.SphereGeometry(0.17, 12, 12);
    const hairMesh = new THREE.Mesh(hairGeo, marbleMaterial);
    hairMesh.position.set(0, 1.42, -0.02);
    hairMesh.scale.set(1, 0.6, 0.9);
    group.add(hairMesh);

    // Hair curls
    for (let i = 0; i < 5; i++) {
        const curlGeo = new THREE.SphereGeometry(0.04, 8, 8);
        const curlMesh = new THREE.Mesh(curlGeo, marbleMaterial);
        const angle = (i / 5) * Math.PI - Math.PI/2;
        curlMesh.position.set(Math.sin(angle) * 0.15, 1.50, Math.cos(angle) * 0.08 - 0.05);
        group.add(curlMesh);
    }

    // Face tilt
    headMesh.rotation.set(-0.2, 0.3, 0);

    // ===== WINGS =====
    // Left wing - main
    const wingL1Geo = new THREE.BoxGeometry(0.04, 0.7, 0.4);
    const wingL1Mesh = new THREE.Mesh(wingL1Geo, marbleMaterialLight);
    wingL1Mesh.position.set(-0.35, 1.15, -0.15);
    wingL1Mesh.rotation.set(0.3, 0.2, Math.PI/4);
    group.add(wingL1Mesh);

    // Left wing - upper
    const wingL2Geo = new THREE.BoxGeometry(0.03, 0.5, 0.3);
    const wingL2Mesh = new THREE.Mesh(wingL2Geo, marbleMaterialLight);
    wingL2Mesh.position.set(-0.55, 1.45, -0.25);
    wingL2Mesh.rotation.set(0.4, 0.3, Math.PI/3);
    group.add(wingL2Mesh);

    // Right wing - main
    const wingR1Geo = new THREE.BoxGeometry(0.04, 0.7, 0.4);
    const wingR1Mesh = new THREE.Mesh(wingR1Geo, marbleMaterialLight);
    wingR1Mesh.position.set(0.35, 1.15, -0.15);
    wingR1Mesh.rotation.set(0.3, -0.2, -Math.PI/4);
    group.add(wingR1Mesh);

    // Right wing - upper
    const wingR2Geo = new THREE.BoxGeometry(0.03, 0.5, 0.3);
    const wingR2Mesh = new THREE.Mesh(wingR2Geo, marbleMaterialLight);
    wingR2Mesh.position.set(0.55, 1.45, -0.25);
    wingR2Mesh.rotation.set(0.4, -0.3, -Math.PI/3);
    group.add(wingR2Mesh);

    // ===== ARMS =====
    // Right arm (holding trumpet)
    const armRGeo = new THREE.CylinderGeometry(0.045, 0.055, 0.35, 10);
    const armRMesh = new THREE.Mesh(armRGeo, marbleMaterial);
    armRMesh.position.set(0.22, 1.12, 0.12);
    armRMesh.rotation.set(0.4, 0, -0.5);
    group.add(armRMesh);

    // Right forearm
    const forearmRGeo = new THREE.CylinderGeometry(0.04, 0.045, 0.28, 10);
    const forearmRMesh = new THREE.Mesh(forearmRGeo, marbleMaterial);
    forearmRMesh.position.set(0.38, 1.22, 0.22);
    forearmRMesh.rotation.set(0.8, 0, -0.3);
    group.add(forearmRMesh);

    // Left arm (supporting)
    const armLGeo = new THREE.CylinderGeometry(0.045, 0.055, 0.32, 10);
    const armLMesh = new THREE.Mesh(armLGeo, marbleMaterial);
    armLMesh.position.set(-0.15, 1.08, 0.15);
    armLMesh.rotation.set(0.5, 0, 0.4);
    group.add(armLMesh);

    // ===== TRUMPET =====
    // Mouthpiece
    const mouthpieceGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.08, 8);
    const mouthpieceMesh = new THREE.Mesh(mouthpieceGeo, marbleMaterialDark);
    mouthpieceMesh.position.set(0.08, 1.32, 0.16);
    mouthpieceMesh.rotation.set(0.3, 0, -0.8);
    group.add(mouthpieceMesh);

    // Tube
    const tubeGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.35, 10);
    const tubeMesh = new THREE.Mesh(tubeGeo, marbleMaterialDark);
    tubeMesh.position.set(0.30, 1.35, 0.25);
    tubeMesh.rotation.set(0.3, 0, -0.8);
    group.add(tubeMesh);

    // Bell
    const bellGeo = new THREE.CylinderGeometry(0.04, 0.12, 0.15, 12);
    const bellMesh = new THREE.Mesh(bellGeo, marbleMaterialDark);
    bellMesh.position.set(0.52, 1.38, 0.35);
    bellMesh.rotation.set(0.3, 0, -0.8);
    group.add(bellMesh);
    `;
}

function generateAngelHigh() {
    // HIGH: 40-50 primitives
    return `
    // ===== BODY =====
    // Torso
    const torsoGeo = new THREE.CylinderGeometry(0.16, 0.22, 0.45, 16);
    const torsoMesh = new THREE.Mesh(torsoGeo, marbleMaterial);
    torsoMesh.position.set(0, 0.97, 0);
    group.add(torsoMesh);

    // Chest definition
    const chestGeo = new THREE.SphereGeometry(0.14, 12, 12);
    const chestMesh = new THREE.Mesh(chestGeo, marbleMaterial);
    chestMesh.position.set(0, 1.05, 0.08);
    chestMesh.scale.set(1.3, 0.8, 0.6);
    group.add(chestMesh);

    // Shoulders
    const shoulderLGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const shoulderLMesh = new THREE.Mesh(shoulderLGeo, marbleMaterial);
    shoulderLMesh.position.set(-0.18, 1.15, 0);
    group.add(shoulderLMesh);

    const shoulderRGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const shoulderRMesh = new THREE.Mesh(shoulderRGeo, marbleMaterial);
    shoulderRMesh.position.set(0.18, 1.15, 0);
    group.add(shoulderRMesh);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.12, 12);
    const neckMesh = new THREE.Mesh(neckGeo, marbleMaterial);
    neckMesh.position.set(0, 1.24, 0);
    group.add(neckMesh);

    // Robe
    const robeGeo = new THREE.ConeGeometry(0.38, 0.75, 16);
    const robeMesh = new THREE.Mesh(robeGeo, marbleMaterial);
    robeMesh.position.set(0, 0.38, 0);
    group.add(robeMesh);

    // Robe folds (detailed)
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const foldGeo = new THREE.CylinderGeometry(0.015, 0.05, 0.7, 8);
        const foldMesh = new THREE.Mesh(foldGeo, marbleMaterialDark);
        foldMesh.position.set(Math.sin(angle) * 0.2, 0.36, Math.cos(angle) * 0.2);
        foldMesh.rotation.set(Math.cos(angle) * 0.1, 0, Math.sin(angle) * 0.08);
        group.add(foldMesh);
    }

    // ===== HEAD =====
    const headGeo = new THREE.SphereGeometry(0.14, 20, 20);
    const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
    headMesh.position.set(0, 1.38, 0);
    headMesh.rotation.set(-0.15, 0.25, 0);
    group.add(headMesh);

    // Facial features
    // Brow ridge
    const browGeo = new THREE.BoxGeometry(0.12, 0.02, 0.04);
    const browMesh = new THREE.Mesh(browGeo, marbleMaterial);
    browMesh.position.set(0, 1.42, 0.11);
    browMesh.rotation.set(-0.15, 0.25, 0);
    group.add(browMesh);

    // Nose
    const noseGeo = new THREE.ConeGeometry(0.02, 0.06, 6);
    const noseMesh = new THREE.Mesh(noseGeo, marbleMaterial);
    noseMesh.position.set(0.02, 1.38, 0.14);
    noseMesh.rotation.set(Math.PI/2 - 0.3, 0.25, 0);
    group.add(noseMesh);

    // Cheeks
    const cheekLGeo = new THREE.SphereGeometry(0.035, 8, 8);
    const cheekLMesh = new THREE.Mesh(cheekLGeo, marbleMaterial);
    cheekLMesh.position.set(-0.06, 1.36, 0.10);
    group.add(cheekLMesh);

    const cheekRGeo = new THREE.SphereGeometry(0.035, 8, 8);
    const cheekRMesh = new THREE.Mesh(cheekRGeo, marbleMaterial);
    cheekRMesh.position.set(0.08, 1.36, 0.10);
    group.add(cheekRMesh);

    // Chin
    const chinGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const chinMesh = new THREE.Mesh(chinGeo, marbleMaterial);
    chinMesh.position.set(0.02, 1.30, 0.10);
    chinMesh.scale.set(1, 1.2, 0.8);
    group.add(chinMesh);

    // Hair
    const hairBaseGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const hairBaseMesh = new THREE.Mesh(hairBaseGeo, marbleMaterial);
    hairBaseMesh.position.set(0, 1.45, -0.02);
    hairBaseMesh.scale.set(1, 0.7, 0.95);
    group.add(hairBaseMesh);

    // Hair curls
    for (let i = 0; i < 8; i++) {
        const curlGeo = new THREE.SphereGeometry(0.035, 8, 8);
        const curlMesh = new THREE.Mesh(curlGeo, marbleMaterial);
        const angle = (i / 8) * Math.PI * 1.5 - Math.PI/2;
        curlMesh.position.set(
            Math.sin(angle) * 0.14,
            1.52 + Math.random() * 0.03,
            Math.cos(angle) * 0.08 - 0.02
        );
        group.add(curlMesh);
    }

    // ===== WINGS (Detailed) =====
    // Left wing - primary feathers
    for (let i = 0; i < 5; i++) {
        const featherGeo = new THREE.BoxGeometry(0.02, 0.25 + i * 0.08, 0.08);
        const featherMesh = new THREE.Mesh(featherGeo, marbleMaterialLight);
        featherMesh.position.set(
            -0.30 - i * 0.12,
            1.20 + i * 0.08,
            -0.15 - i * 0.05
        );
        featherMesh.rotation.set(0.3 + i * 0.05, 0.2, Math.PI/4 + i * 0.08);
        group.add(featherMesh);
    }

    // Left wing - secondary feathers
    for (let i = 0; i < 4; i++) {
        const featherGeo = new THREE.BoxGeometry(0.015, 0.18 + i * 0.05, 0.06);
        const featherMesh = new THREE.Mesh(featherGeo, marbleMaterialLight);
        featherMesh.position.set(
            -0.25 - i * 0.08,
            0.95 + i * 0.05,
            -0.12 - i * 0.03
        );
        featherMesh.rotation.set(0.25, 0.15, Math.PI/5 + i * 0.06);
        group.add(featherMesh);
    }

    // Right wing - primary feathers
    for (let i = 0; i < 5; i++) {
        const featherGeo = new THREE.BoxGeometry(0.02, 0.25 + i * 0.08, 0.08);
        const featherMesh = new THREE.Mesh(featherGeo, marbleMaterialLight);
        featherMesh.position.set(
            0.30 + i * 0.12,
            1.20 + i * 0.08,
            -0.15 - i * 0.05
        );
        featherMesh.rotation.set(0.3 + i * 0.05, -0.2, -Math.PI/4 - i * 0.08);
        group.add(featherMesh);
    }

    // Right wing - secondary feathers
    for (let i = 0; i < 4; i++) {
        const featherGeo = new THREE.BoxGeometry(0.015, 0.18 + i * 0.05, 0.06);
        const featherMesh = new THREE.Mesh(featherGeo, marbleMaterialLight);
        featherMesh.position.set(
            0.25 + i * 0.08,
            0.95 + i * 0.05,
            -0.12 - i * 0.03
        );
        featherMesh.rotation.set(0.25, -0.15, -Math.PI/5 - i * 0.06);
        group.add(featherMesh);
    }

    // ===== ARMS =====
    // Right upper arm
    const armRUpperGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.22, 12);
    const armRUpperMesh = new THREE.Mesh(armRUpperGeo, marbleMaterial);
    armRUpperMesh.position.set(0.22, 1.08, 0.08);
    armRUpperMesh.rotation.set(0.5, 0, -0.6);
    group.add(armRUpperMesh);

    // Right elbow
    const elbowRGeo = new THREE.SphereGeometry(0.045, 10, 10);
    const elbowRMesh = new THREE.Mesh(elbowRGeo, marbleMaterial);
    elbowRMesh.position.set(0.32, 1.02, 0.18);
    group.add(elbowRMesh);

    // Right forearm
    const armRLowerGeo = new THREE.CylinderGeometry(0.035, 0.04, 0.20, 12);
    const armRLowerMesh = new THREE.Mesh(armRLowerGeo, marbleMaterial);
    armRLowerMesh.position.set(0.40, 1.12, 0.28);
    armRLowerMesh.rotation.set(1.0, 0, -0.2);
    group.add(armRLowerMesh);

    // Right hand
    const handRGeo = new THREE.SphereGeometry(0.04, 10, 10);
    const handRMesh = new THREE.Mesh(handRGeo, marbleMaterial);
    handRMesh.position.set(0.46, 1.22, 0.35);
    handRMesh.scale.set(0.8, 1, 0.6);
    group.add(handRMesh);

    // Left upper arm
    const armLUpperGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.20, 12);
    const armLUpperMesh = new THREE.Mesh(armLUpperGeo, marbleMaterial);
    armLUpperMesh.position.set(-0.18, 1.06, 0.10);
    armLUpperMesh.rotation.set(0.6, 0, 0.5);
    group.add(armLUpperMesh);

    // Left forearm
    const armLLowerGeo = new THREE.CylinderGeometry(0.035, 0.04, 0.18, 12);
    const armLLowerMesh = new THREE.Mesh(armLLowerGeo, marbleMaterial);
    armLLowerMesh.position.set(-0.08, 1.02, 0.22);
    armLLowerMesh.rotation.set(0.8, 0, 0.2);
    group.add(armLLowerMesh);

    // Left hand (cupped under trumpet)
    const handLGeo = new THREE.SphereGeometry(0.035, 10, 10);
    const handLMesh = new THREE.Mesh(handLGeo, marbleMaterial);
    handLMesh.position.set(0.02, 1.02, 0.32);
    handLMesh.scale.set(1, 0.8, 0.6);
    group.add(handLMesh);

    // ===== TRUMPET (Detailed) =====
    // Mouthpiece cup
    const mpCupGeo = new THREE.CylinderGeometry(0.012, 0.018, 0.04, 10);
    const mpCupMesh = new THREE.Mesh(mpCupGeo, marbleMaterialDark);
    mpCupMesh.position.set(0.10, 1.30, 0.18);
    mpCupMesh.rotation.set(0.25, 0, -0.75);
    group.add(mpCupMesh);

    // Mouthpiece stem
    const mpStemGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.06, 10);
    const mpStemMesh = new THREE.Mesh(mpStemGeo, marbleMaterialDark);
    mpStemMesh.position.set(0.14, 1.31, 0.21);
    mpStemMesh.rotation.set(0.25, 0, -0.75);
    group.add(mpStemMesh);

    // Main tube
    const tubeGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.30, 12);
    const tubeMesh = new THREE.Mesh(tubeGeo, marbleMaterialDark);
    tubeMesh.position.set(0.30, 1.35, 0.30);
    tubeMesh.rotation.set(0.25, 0, -0.75);
    group.add(tubeMesh);

    // Valve section
    const valveGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.08, 12);
    const valveMesh = new THREE.Mesh(valveGeo, marbleMaterialDark);
    valveMesh.position.set(0.22, 1.33, 0.25);
    valveMesh.rotation.set(0.25, 0, -0.75);
    group.add(valveMesh);

    // Valve buttons
    for (let i = 0; i < 3; i++) {
        const buttonGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.03, 8);
        const buttonMesh = new THREE.Mesh(buttonGeo, marbleMaterial);
        buttonMesh.position.set(0.20 + i * 0.025, 1.36, 0.22 + i * 0.015);
        group.add(buttonMesh);
    }

    // Bell flare
    const bellGeo = new THREE.CylinderGeometry(0.035, 0.14, 0.18, 16);
    const bellMesh = new THREE.Mesh(bellGeo, marbleMaterialDark);
    bellMesh.position.set(0.52, 1.40, 0.42);
    bellMesh.rotation.set(0.25, 0, -0.75);
    group.add(bellMesh);

    // Bell rim
    const rimGeo = new THREE.TorusGeometry(0.14, 0.015, 8, 20);
    const rimMesh = new THREE.Mesh(rimGeo, marbleMaterialDark);
    rimMesh.position.set(0.58, 1.42, 0.48);
    rimMesh.rotation.set(Math.PI/2 + 0.25, -0.75, 0);
    group.add(rimMesh);
    `;
}

// ============ ELEPHANT CASTLE GENERATORS ============

function generateElephantLow() {
    // LOW: 7-8 primitives
    return `
    // Body - large ellipsoid
    const bodyGeo = new THREE.SphereGeometry(0.5, 8, 8);
    const bodyMesh = new THREE.Mesh(bodyGeo, marbleMaterial);
    bodyMesh.position.set(0, 0.5, 0);
    bodyMesh.scale.set(1.3, 0.9, 0.8);
    group.add(bodyMesh);

    // Head
    const headGeo = new THREE.SphereGeometry(0.25, 8, 8);
    const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
    headMesh.position.set(0.5, 0.6, 0);
    group.add(headMesh);

    // Trunk - curved cylinder
    const trunkGeo = new THREE.CylinderGeometry(0.06, 0.1, 0.5, 8);
    const trunkMesh = new THREE.Mesh(trunkGeo, marbleMaterial);
    trunkMesh.position.set(0.7, 0.35, 0);
    trunkMesh.rotation.z = 0.5;
    group.add(trunkMesh);

    // Legs (4 cylinders)
    const legPositions = [[-0.25, 0.25, 0.2], [-0.25, 0.25, -0.2], [0.2, 0.25, 0.2], [0.2, 0.25, -0.2]];
    legPositions.forEach(pos => {
        const legGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.5, 8);
        const legMesh = new THREE.Mesh(legGeo, marbleMaterial);
        legMesh.position.set(...pos);
        group.add(legMesh);
    });

    // Castle - simple box
    const castleGeo = new THREE.BoxGeometry(0.5, 0.4, 0.4);
    const castleMesh = new THREE.Mesh(castleGeo, marbleMaterialLight);
    castleMesh.position.set(0, 1.1, 0);
    group.add(castleMesh);

    // Tower
    const towerGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.3, 8);
    const towerMesh = new THREE.Mesh(towerGeo, marbleMaterialLight);
    towerMesh.position.set(0, 1.45, 0);
    group.add(towerMesh);
    `;
}

function generateElephantMedium() {
    // MEDIUM: 20-25 primitives
    return `
    // ===== ELEPHANT BODY =====
    // Main body
    const bodyGeo = new THREE.SphereGeometry(0.45, 16, 16);
    const bodyMesh = new THREE.Mesh(bodyGeo, marbleMaterial);
    bodyMesh.position.set(0, 0.55, 0);
    bodyMesh.scale.set(1.4, 1.0, 0.85);
    group.add(bodyMesh);

    // Hindquarters
    const hindGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const hindMesh = new THREE.Mesh(hindGeo, marbleMaterial);
    hindMesh.position.set(-0.35, 0.50, 0);
    hindMesh.scale.set(1.1, 1.0, 0.9);
    group.add(hindMesh);

    // ===== HEAD =====
    const headGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
    headMesh.position.set(0.55, 0.65, 0);
    group.add(headMesh);

    // Forehead dome
    const foreheadGeo = new THREE.SphereGeometry(0.15, 12, 12);
    const foreheadMesh = new THREE.Mesh(foreheadGeo, marbleMaterial);
    foreheadMesh.position.set(0.58, 0.80, 0);
    foreheadMesh.scale.set(1, 0.8, 0.9);
    group.add(foreheadMesh);

    // Ears
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

    // ===== TRUNK =====
    // Upper trunk
    const trunk1Geo = new THREE.CylinderGeometry(0.08, 0.12, 0.25, 12);
    const trunk1Mesh = new THREE.Mesh(trunk1Geo, marbleMaterial);
    trunk1Mesh.position.set(0.72, 0.50, 0);
    trunk1Mesh.rotation.z = 0.6;
    group.add(trunk1Mesh);

    // Middle trunk
    const trunk2Geo = new THREE.CylinderGeometry(0.06, 0.08, 0.22, 12);
    const trunk2Mesh = new THREE.Mesh(trunk2Geo, marbleMaterial);
    trunk2Mesh.position.set(0.82, 0.30, 0);
    trunk2Mesh.rotation.z = 0.3;
    group.add(trunk2Mesh);

    // Lower trunk (curled)
    const trunk3Geo = new THREE.CylinderGeometry(0.04, 0.06, 0.18, 12);
    const trunk3Mesh = new THREE.Mesh(trunk3Geo, marbleMaterial);
    trunk3Mesh.position.set(0.85, 0.12, 0);
    trunk3Mesh.rotation.z = -0.4;
    group.add(trunk3Mesh);

    // ===== TUSKS =====
    const tuskLGeo = new THREE.CylinderGeometry(0.015, 0.03, 0.25, 8);
    const tuskLMesh = new THREE.Mesh(tuskLGeo, marbleMaterialLight);
    tuskLMesh.position.set(0.72, 0.50, 0.10);
    tuskLMesh.rotation.set(0, 0, 0.8);
    group.add(tuskLMesh);

    const tuskRGeo = new THREE.CylinderGeometry(0.015, 0.03, 0.25, 8);
    const tuskRMesh = new THREE.Mesh(tuskRGeo, marbleMaterialLight);
    tuskRMesh.position.set(0.72, 0.50, -0.10);
    tuskRMesh.rotation.set(0, 0, 0.8);
    group.add(tuskRMesh);

    // ===== LEGS =====
    const legData = [
        {pos: [-0.30, 0.25, 0.22], rot: 0.05},
        {pos: [-0.30, 0.25, -0.22], rot: -0.05},
        {pos: [0.25, 0.25, 0.22], rot: -0.03},
        {pos: [0.25, 0.25, -0.22], rot: 0.03}
    ];
    legData.forEach(leg => {
        const legGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.50, 12);
        const legMesh = new THREE.Mesh(legGeo, marbleMaterial);
        legMesh.position.set(...leg.pos);
        legMesh.rotation.z = leg.rot;
        group.add(legMesh);
    });

    // Tail
    const tailGeo = new THREE.CylinderGeometry(0.02, 0.04, 0.25, 8);
    const tailMesh = new THREE.Mesh(tailGeo, marbleMaterial);
    tailMesh.position.set(-0.60, 0.45, 0);
    tailMesh.rotation.z = -0.5;
    group.add(tailMesh);

    // ===== CASTLE/HOWDAH =====
    // Platform
    const platformGeo = new THREE.BoxGeometry(0.55, 0.08, 0.45);
    const platformMesh = new THREE.Mesh(platformGeo, marbleMaterialDark);
    platformMesh.position.set(0, 1.0, 0);
    group.add(platformMesh);

    // Main structure
    const structureGeo = new THREE.BoxGeometry(0.45, 0.35, 0.38);
    const structureMesh = new THREE.Mesh(structureGeo, marbleMaterialLight);
    structureMesh.position.set(0, 1.22, 0);
    group.add(structureMesh);

    // Corner towers
    const towerPositions = [[0.18, 1.55, 0.14], [0.18, 1.55, -0.14], [-0.18, 1.55, 0.14], [-0.18, 1.55, -0.14]];
    towerPositions.forEach(pos => {
        const towerGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.35, 10);
        const towerMesh = new THREE.Mesh(towerGeo, marbleMaterialLight);
        towerMesh.position.set(...pos);
        group.add(towerMesh);

        // Tower cap
        const capGeo = new THREE.ConeGeometry(0.08, 0.12, 10);
        const capMesh = new THREE.Mesh(capGeo, marbleMaterial);
        capMesh.position.set(pos[0], pos[1] + 0.22, pos[2]);
        group.add(capMesh);
    });

    // Central dome
    const domeGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const domeMesh = new THREE.Mesh(domeGeo, marbleMaterial);
    domeMesh.position.set(0, 1.50, 0);
    domeMesh.scale.set(1, 0.7, 1);
    group.add(domeMesh);
    `;
}

function generateElephantHigh() {
    // HIGH: 45-50 primitives
    return `
    // ===== ELEPHANT BODY =====
    // Main body
    const bodyGeo = new THREE.SphereGeometry(0.42, 20, 20);
    const bodyMesh = new THREE.Mesh(bodyGeo, marbleMaterial);
    bodyMesh.position.set(0, 0.55, 0);
    bodyMesh.scale.set(1.5, 1.0, 0.88);
    group.add(bodyMesh);

    // Hindquarters
    const hindGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const hindMesh = new THREE.Mesh(hindGeo, marbleMaterial);
    hindMesh.position.set(-0.38, 0.52, 0);
    hindMesh.scale.set(1.15, 1.0, 0.92);
    group.add(hindMesh);

    // Belly curve
    const bellyGeo = new THREE.SphereGeometry(0.30, 12, 12);
    const bellyMesh = new THREE.Mesh(bellyGeo, marbleMaterial);
    bellyMesh.position.set(-0.05, 0.35, 0);
    bellyMesh.scale.set(1.8, 0.6, 0.85);
    group.add(bellyMesh);

    // ===== HEAD =====
    const headGeo = new THREE.SphereGeometry(0.20, 20, 20);
    const headMesh = new THREE.Mesh(headGeo, marbleMaterial);
    headMesh.position.set(0.58, 0.68, 0);
    group.add(headMesh);

    // Forehead dome
    const foreheadGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const foreheadMesh = new THREE.Mesh(foreheadGeo, marbleMaterial);
    foreheadMesh.position.set(0.60, 0.82, 0);
    foreheadMesh.scale.set(1.1, 0.85, 0.95);
    group.add(foreheadMesh);

    // Eye sockets
    const eyeSocketLGeo = new THREE.SphereGeometry(0.04, 10, 10);
    const eyeSocketLMesh = new THREE.Mesh(eyeSocketLGeo, marbleMaterialDark);
    eyeSocketLMesh.position.set(0.68, 0.72, 0.12);
    group.add(eyeSocketLMesh);

    const eyeSocketRGeo = new THREE.SphereGeometry(0.04, 10, 10);
    const eyeSocketRMesh = new THREE.Mesh(eyeSocketRGeo, marbleMaterialDark);
    eyeSocketRMesh.position.set(0.68, 0.72, -0.12);
    group.add(eyeSocketRMesh);

    // Ears (detailed)
    const earLGeo = new THREE.SphereGeometry(0.18, 12, 12);
    const earLMesh = new THREE.Mesh(earLGeo, marbleMaterial);
    earLMesh.position.set(0.45, 0.72, 0.25);
    earLMesh.scale.set(0.25, 0.9, 1);
    group.add(earLMesh);

    const earLInnerGeo = new THREE.SphereGeometry(0.12, 10, 10);
    const earLInnerMesh = new THREE.Mesh(earLInnerGeo, marbleMaterialDark);
    earLInnerMesh.position.set(0.47, 0.72, 0.26);
    earLInnerMesh.scale.set(0.2, 0.7, 0.8);
    group.add(earLInnerMesh);

    const earRGeo = new THREE.SphereGeometry(0.18, 12, 12);
    const earRMesh = new THREE.Mesh(earRGeo, marbleMaterial);
    earRMesh.position.set(0.45, 0.72, -0.25);
    earRMesh.scale.set(0.25, 0.9, 1);
    group.add(earRMesh);

    const earRInnerGeo = new THREE.SphereGeometry(0.12, 10, 10);
    const earRInnerMesh = new THREE.Mesh(earRInnerGeo, marbleMaterialDark);
    earRInnerMesh.position.set(0.47, 0.72, -0.26);
    earRInnerMesh.scale.set(0.2, 0.7, 0.8);
    group.add(earRInnerMesh);

    // ===== TRUNK (Detailed segments) =====
    const trunkSegments = [
        {r1: 0.09, r2: 0.12, h: 0.15, pos: [0.72, 0.55, 0], rot: 0.5},
        {r1: 0.075, r2: 0.09, h: 0.14, pos: [0.80, 0.42, 0], rot: 0.3},
        {r1: 0.06, r2: 0.075, h: 0.13, pos: [0.85, 0.28, 0], rot: 0.1},
        {r1: 0.045, r2: 0.06, h: 0.12, pos: [0.86, 0.15, 0], rot: -0.2},
        {r1: 0.035, r2: 0.045, h: 0.10, pos: [0.82, 0.05, 0], rot: -0.6}
    ];
    trunkSegments.forEach(seg => {
        const segGeo = new THREE.CylinderGeometry(seg.r1, seg.r2, seg.h, 14);
        const segMesh = new THREE.Mesh(segGeo, marbleMaterial);
        segMesh.position.set(...seg.pos);
        segMesh.rotation.z = seg.rot;
        group.add(segMesh);
    });

    // Trunk tip
    const trunkTipGeo = new THREE.SphereGeometry(0.04, 10, 10);
    const trunkTipMesh = new THREE.Mesh(trunkTipGeo, marbleMaterial);
    trunkTipMesh.position.set(0.76, 0.02, 0);
    trunkTipMesh.scale.set(1, 1.2, 0.8);
    group.add(trunkTipMesh);

    // ===== TUSKS =====
    const tuskLGeo = new THREE.CylinderGeometry(0.012, 0.028, 0.28, 10);
    const tuskLMesh = new THREE.Mesh(tuskLGeo, marbleMaterialLight);
    tuskLMesh.position.set(0.75, 0.52, 0.11);
    tuskLMesh.rotation.set(-0.1, 0, 0.75);
    group.add(tuskLMesh);

    const tuskRGeo = new THREE.CylinderGeometry(0.012, 0.028, 0.28, 10);
    const tuskRMesh = new THREE.Mesh(tuskRGeo, marbleMaterialLight);
    tuskRMesh.position.set(0.75, 0.52, -0.11);
    tuskRMesh.rotation.set(0.1, 0, 0.75);
    group.add(tuskRMesh);

    // ===== LEGS (Detailed) =====
    const legData = [
        {pos: [-0.32, 0, 0.23], name: 'BL'},
        {pos: [-0.32, 0, -0.23], name: 'BR'},
        {pos: [0.28, 0, 0.23], name: 'FL'},
        {pos: [0.28, 0, -0.23], name: 'FR'}
    ];
    legData.forEach(leg => {
        // Upper leg
        const upperGeo = new THREE.CylinderGeometry(0.08, 0.10, 0.22, 14);
        const upperMesh = new THREE.Mesh(upperGeo, marbleMaterial);
        upperMesh.position.set(leg.pos[0], 0.38, leg.pos[2]);
        group.add(upperMesh);

        // Lower leg
        const lowerGeo = new THREE.CylinderGeometry(0.085, 0.09, 0.25, 14);
        const lowerMesh = new THREE.Mesh(lowerGeo, marbleMaterial);
        lowerMesh.position.set(leg.pos[0], 0.14, leg.pos[2]);
        group.add(lowerMesh);

        // Foot
        const footGeo = new THREE.CylinderGeometry(0.10, 0.11, 0.05, 14);
        const footMesh = new THREE.Mesh(footGeo, marbleMaterial);
        footMesh.position.set(leg.pos[0], 0.025, leg.pos[2]);
        group.add(footMesh);

        // Toenails
        for (let i = 0; i < 3; i++) {
            const nailGeo = new THREE.SphereGeometry(0.02, 8, 8);
            const nailMesh = new THREE.Mesh(nailGeo, marbleMaterialLight);
            const angle = (i - 1) * 0.4;
            nailMesh.position.set(
                leg.pos[0] + Math.cos(angle) * 0.09,
                0.02,
                leg.pos[2] + Math.sin(angle) * 0.03
            );
            nailMesh.scale.set(1, 0.5, 0.8);
            group.add(nailMesh);
        }
    });

    // Tail
    const tailGeo = new THREE.CylinderGeometry(0.015, 0.035, 0.28, 10);
    const tailMesh = new THREE.Mesh(tailGeo, marbleMaterial);
    tailMesh.position.set(-0.62, 0.48, 0);
    tailMesh.rotation.z = -0.6;
    group.add(tailMesh);

    // Tail tuft
    const tuftGeo = new THREE.SphereGeometry(0.03, 8, 8);
    const tuftMesh = new THREE.Mesh(tuftGeo, marbleMaterial);
    tuftMesh.position.set(-0.72, 0.32, 0);
    tuftMesh.scale.set(1, 1.5, 0.8);
    group.add(tuftMesh);

    // ===== CASTLE/HOWDAH =====
    // Blanket/saddle
    const blanketGeo = new THREE.BoxGeometry(0.65, 0.06, 0.55);
    const blanketMesh = new THREE.Mesh(blanketGeo, marbleMaterialDark);
    blanketMesh.position.set(-0.02, 0.95, 0);
    group.add(blanketMesh);

    // Blanket fringe
    for (let i = 0; i < 8; i++) {
        const fringeGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.08, 6);
        const fringeMesh = new THREE.Mesh(fringeGeo, marbleMaterialDark);
        fringeMesh.position.set(-0.30 + i * 0.08, 0.88, 0.28);
        group.add(fringeMesh);
    }

    // Platform
    const platformGeo = new THREE.BoxGeometry(0.52, 0.06, 0.42);
    const platformMesh = new THREE.Mesh(platformGeo, marbleMaterial);
    platformMesh.position.set(0, 1.02, 0);
    group.add(platformMesh);

    // Main structure walls
    const wallFGeo = new THREE.BoxGeometry(0.48, 0.30, 0.04);
    const wallFMesh = new THREE.Mesh(wallFGeo, marbleMaterialLight);
    wallFMesh.position.set(0, 1.20, 0.19);
    group.add(wallFMesh);

    const wallBGeo = new THREE.BoxGeometry(0.48, 0.30, 0.04);
    const wallBMesh = new THREE.Mesh(wallBGeo, marbleMaterialLight);
    wallBMesh.position.set(0, 1.20, -0.19);
    group.add(wallBMesh);

    const wallLGeo = new THREE.BoxGeometry(0.04, 0.30, 0.38);
    const wallLMesh = new THREE.Mesh(wallLGeo, marbleMaterialLight);
    wallLMesh.position.set(0.22, 1.20, 0);
    group.add(wallLMesh);

    const wallRGeo = new THREE.BoxGeometry(0.04, 0.30, 0.38);
    const wallRMesh = new THREE.Mesh(wallRGeo, marbleMaterialLight);
    wallRMesh.position.set(-0.22, 1.20, 0);
    group.add(wallRMesh);

    // Corner towers with crenellations
    const towerPositions = [[0.20, 1.52, 0.16], [0.20, 1.52, -0.16], [-0.20, 1.52, 0.16], [-0.20, 1.52, -0.16]];
    towerPositions.forEach(pos => {
        // Tower body
        const towerGeo = new THREE.CylinderGeometry(0.055, 0.065, 0.38, 12);
        const towerMesh = new THREE.Mesh(towerGeo, marbleMaterialLight);
        towerMesh.position.set(...pos);
        group.add(towerMesh);

        // Crenellations
        for (let i = 0; i < 4; i++) {
            const crenGeo = new THREE.BoxGeometry(0.025, 0.04, 0.025);
            const crenMesh = new THREE.Mesh(crenGeo, marbleMaterialLight);
            const angle = (i / 4) * Math.PI * 2;
            crenMesh.position.set(
                pos[0] + Math.sin(angle) * 0.055,
                pos[1] + 0.21,
                pos[2] + Math.cos(angle) * 0.055
            );
            group.add(crenMesh);
        }

        // Tower cap
        const capGeo = new THREE.ConeGeometry(0.075, 0.14, 12);
        const capMesh = new THREE.Mesh(capGeo, marbleMaterial);
        capMesh.position.set(pos[0], pos[1] + 0.26, pos[2]);
        group.add(capMesh);

        // Spire
        const spireGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.08, 6);
        const spireMesh = new THREE.Mesh(spireGeo, marbleMaterial);
        spireMesh.position.set(pos[0], pos[1] + 0.37, pos[2]);
        group.add(spireMesh);
    });

    // Central dome
    const domeGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const domeMesh = new THREE.Mesh(domeGeo, marbleMaterial);
    domeMesh.position.set(0, 1.48, 0);
    domeMesh.scale.set(1, 0.65, 1);
    group.add(domeMesh);

    // Dome finial
    const finialGeo = new THREE.CylinderGeometry(0.015, 0.025, 0.10, 8);
    const finialMesh = new THREE.Mesh(finialGeo, marbleMaterial);
    finialMesh.position.set(0, 1.62, 0);
    group.add(finialMesh);

    // Finial ball
    const ballGeo = new THREE.SphereGeometry(0.025, 10, 10);
    const ballMesh = new THREE.Mesh(ballGeo, marbleMaterial);
    ballMesh.position.set(0, 1.70, 0);
    group.add(ballMesh);

    // Decorative arches on walls
    const archPositions = [[0, 1.22, 0.21], [0, 1.22, -0.21]];
    archPositions.forEach(pos => {
        const archGeo = new THREE.TorusGeometry(0.08, 0.015, 8, 12, Math.PI);
        const archMesh = new THREE.Mesh(archGeo, marbleMaterial);
        archMesh.position.set(...pos);
        archMesh.rotation.y = pos[2] > 0 ? 0 : Math.PI;
        group.add(archMesh);
    });
    `;
}

/**
 * Generate the HTML content for a statue
 */
function generateHTML(geometryCode) {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Statue Export</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/exporters/GLTFExporter.js"></script>
</head>
<body>
<script>
// Setup scene
const scene = new THREE.Scene();
const group = new THREE.Group();

// Marble materials
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
 * Export a single statue to GLTF
 */
async function exportStatue(browser, statueName, level, generatorFn) {
    const page = await browser.newPage();

    try {
        const geometryCode = generatorFn();
        const htmlContent = generateHTML(geometryCode);

        // Navigate to data URL with the HTML content
        await page.setContent(htmlContent);

        // Wait for export to complete
        await page.waitForFunction('window.exportComplete === true', { timeout: 30000 });

        // Get the GLTF data
        const gltfData = await page.evaluate(() => window.gltfData);

        // Count primitives (meshes)
        const gltf = JSON.parse(gltfData);
        const meshCount = gltf.meshes ? gltf.meshes.length : 0;

        // Write to file
        const filename = `${statueName}_${level}.gltf`;
        const filepath = path.join(MODELS_DIR, filename);
        fs.writeFileSync(filepath, gltfData);

        // Get file size
        const stats = fs.statSync(filepath);
        const fileSizeKB = (stats.size / 1024).toFixed(1);

        console.log(`  ${level.toUpperCase()}: ${filename} - ${meshCount} meshes, ${fileSizeKB} KB`);

        return { filename, meshCount, fileSizeKB };
    } finally {
        await page.close();
    }
}

/**
 * Main export function
 */
async function main() {
    console.log('Starting statue generation...\n');

    // Ensure output directory exists
    if (!fs.existsSync(MODELS_DIR)) {
        fs.mkdirSync(MODELS_DIR, { recursive: true });
    }

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const results = [];

    try {
        for (const [statueName, statue] of Object.entries(STATUES)) {
            console.log(`\nGenerating: ${statue.name}`);

            for (const level of ['low', 'medium', 'high']) {
                const result = await exportStatue(browser, statueName, level, statue[level]);
                results.push({ ...result, statueName, level });
            }
        }
    } finally {
        await browser.close();
    }

    // Summary
    console.log('\n========== SUMMARY ==========');
    console.log(`Total files generated: ${results.length}`);
    console.log('\nBy detail level:');

    ['low', 'medium', 'high'].forEach(level => {
        const levelResults = results.filter(r => r.level === level);
        const avgMeshes = (levelResults.reduce((sum, r) => sum + r.meshCount, 0) / levelResults.length).toFixed(0);
        const avgSize = (levelResults.reduce((sum, r) => sum + parseFloat(r.fileSizeKB), 0) / levelResults.length).toFixed(1);
        console.log(`  ${level.toUpperCase()}: avg ${avgMeshes} meshes, avg ${avgSize} KB`);
    });

    console.log('\nAll files saved to:', MODELS_DIR);
}

main().catch(console.error);
