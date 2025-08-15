const canvas = document.getElementById('trinketCanvas');
const ctx = canvas.getContext('2d');

const PIXEL_SIZE = 10; // Size of each 'pixel' in the pixelated effect
const GRASS_SHADES = [
    '#4CAF50', '#66BB6A', '#81C784', '#A5D6A7', '#C8E6C9',
    '#388E3C', '#43A047', '#4CAF50', '#66BB6A', '#81C784'
];

const FLOWER_COLORS = [
    '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', // Yellows/Oranges
    '#E91E63', '#D81B60', '#C2185B', '#AD1457', // Pinks/Reds
    '#9C27B0', '#8E24AA', '#7B1FA2', '#6A1B9A', // Purples
    '#2196F3', '#1976D2', '#1565C0', '#0D47A1'  // Blues
];

let animationFrameId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawGrassyField();
}

function drawGrassyField() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < canvas.height; y += PIXEL_SIZE) {
        for (let x = 0; x < canvas.width; x += PIXEL_SIZE) {
            const shade = GRASS_SHADES[Math.floor(Math.random() * GRASS_SHADES.length)];
            ctx.fillStyle = shade;
            ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
        }
    }
}

function drawFlower(x, y) {
    const numPetals = Math.floor(Math.random() * 3) + 3; // 3 to 5 petals
    const centerColor = FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)];
    const petalColor = FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)];

    // Draw center
    ctx.fillStyle = centerColor;
    ctx.fillRect(x - PIXEL_SIZE / 2, y - PIXEL_SIZE / 2, PIXEL_SIZE, PIXEL_SIZE);

    // Draw petals symmetrically
    for (let i = 0; i < numPetals; i++) {
        const angle = (i / numPetals) * Math.PI * 2;
        const petalX = x + Math.round(Math.cos(angle) * PIXEL_SIZE);
        const petalY = y + Math.round(Math.sin(angle) * PIXEL_SIZE);
        ctx.fillStyle = petalColor;
        ctx.fillRect(petalX - PIXEL_SIZE / 2, petalY - PIXEL_SIZE / 2, PIXEL_SIZE, PIXEL_SIZE);
    }
}

canvas.addEventListener('click', (event) => {
    // Align click to pixel grid
    const clickX = Math.floor(event.clientX / PIXEL_SIZE) * PIXEL_SIZE;
    const clickY = Math.floor(event.clientY / PIXEL_SIZE) * PIXEL_SIZE;
    drawFlower(clickX, clickY);
});

window.addEventListener('resize', resizeCanvas);

// Initial draw
resizeCanvas();
