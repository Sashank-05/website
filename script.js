// Wait for DOM Content to load
document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Setup
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', toggleTheme);
    setInitialTheme();
    updateParticleColors();
});

let Ltheme = true;

function setInitialTheme() {
    const savedTheme =
        localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        Ltheme = false;
    } else {
        Ltheme = true;
        document.body.classList.remove('dark-theme');
    }
}

function toggleTheme() {
    if (document.body.classList.contains('dark-theme')) {
        Ltheme = true;
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        updateParticleColors();


    } else {
        Ltheme = false;
        updateParticleColors();
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    }
}

// Create the scene
const totalParticles = window.innerWidth < 1200 ? 400 : 900;
const orbSize = (window.innerHeight + window.innerWidth) / 26 ^ 9;
const baseHue = 0;
const animationDuration = 18;


// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xFFFFFF, 0);
document.getElementById('globe-container').appendChild(renderer.domElement);

// Camera position
camera.position.z = 300;

// Create particles
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(totalParticles * 3);
const colors = new Float32Array(totalParticles * 3);
const delays = new Float32Array(totalParticles);
const directions = new Float32Array(totalParticles * 3);

for (let i = 0; i < totalParticles; i++) {
    // Random rotations
    const randomY = Math.random() * Math.PI * 2;
    const randomZ = Math.random() * Math.PI * 2;

    // Direction vector
    const direction = new THREE.Vector3(1, 0, 0);
    direction.applyEuler(new THREE.Euler(0, randomY, randomZ));
    direction.normalize();

    // Store attributes
    directions[i * 3] = direction.x;
    directions[i * 3 + 1] = direction.y;
    directions[i * 3 + 2] = direction.z;

    // Color
    const hue = baseHue + (10 / totalParticles) * i;
    const color = new THREE.Color(`hsl(${hue}, 100%, ${Ltheme ? 0 : 100}%)`);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    // Delay
    delays[i] = i * 0.01;
}

geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
geometry.setAttribute('delay', new THREE.BufferAttribute(delays, 1));
geometry.setAttribute('direction', new THREE.BufferAttribute(directions, 3));

// Shader material
const material = new THREE.ShaderMaterial({
    vertexShader: `
                uniform float time;
                attribute vec3 direction;
                attribute float delay;
                attribute vec3 color;
                varying vec3 vColor;
                varying float vOpacity;
                
                void main() {
                    float t = mod(time + delay, ${animationDuration}.0);
                    float progress = 0.0;
                    vOpacity = 0.0;
                    
                    if (t < 2.6) {
                         progress = smoothstep(0.0, 2.6, t);
                        vOpacity = smoothstep(0.0, 2.6, t);
                    } else if (t < 10.4) {
                        progress = 1.0;
                        vOpacity = 1.0;
                    } else {
                       progress = mix(1.0, 3.0, (t - 10.4) / 2.6);
                        vOpacity = 1.0 - (t - 10.4) / 2.6;
                    }
                    
                    vec3 newPosition = direction * progress * ${orbSize}.0;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                    gl_PointSize = 2.0;
                    vColor = color;
                }
            `,
    fragmentShader: `
                varying vec3 vColor;
                varying float vOpacity;
                
                void main() {
                    gl_FragColor = vec4(vColor, vOpacity);
                    vec2 circCoord = 1.0 * gl_PointCoord - 1.0;
                    if (dot(circCoord, circCoord) > 1.0) {
                        discard;
                    }
                }
            `,
    uniforms: {
        time: {value: 0}
    },
    transparent: true,
    depthWrite: false
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Animation
const clock = new THREE.Clock();
let time = 0;

function animate() {
    requestAnimationFrame(animate);

    time = clock.getElapsedTime();
    material.uniforms.time.value = time;

    // Rotate system
    const rotationSpeed = (Math.PI * 2) / animationDuration;
    particles.rotation.y = time * rotationSpeed;
    particles.rotation.x = time * rotationSpeed;


    renderer.render(scene, camera);
}

animate();

// Handle resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function updateParticleColors() {
    const newLightness = Ltheme ? 0.0 : 1.0;

    for (let i = 0; i < totalParticles; i++) {
        colors[i * 3] = newLightness;
        colors[i * 3 + 1] = newLightness;
        colors[i * 3 + 2] = newLightness;

    }

    geometry.attributes.color.needsUpdate = true
    renderer.render(scene, camera);

}


const cursor = document.querySelector('.custom-cursor');
const cparticles = [];
const PARTICLE_COUNT = window.innerHeight < 1200 ? 400 : 700;
const INFLUENCE_RADIUS = 100;
const FORCE_FACTOR = 0.15;
const FRICTION = 0.85;
const VISIBLE_DURATION = 1000; // Time in ms particles stay visible

// Create background particles
function createBackgroundParticles() {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const particle = document.createElement("div");
        particle.classList.add("particle");
        document.getElementById('particles').appendChild(particle);

        const pos = {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: 0,
            vy: 0,
            lastActive: 0 // Timestamp of last interaction
        };

        particle.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
        cparticles.push({element: particle, ...pos});
    }
}

// Mouse position and movement tracking
let mouseX = 0;
let mouseY = 0;
let prevMouseX = 0;
let prevMouseY = 0;

document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Animation loop
function updateParticles() {
    const deltaX = mouseX - prevMouseX;
    const deltaY = mouseY - prevMouseY;
    const now = Date.now();

    cparticles.forEach(particle => {
        // Calculate distance from cursor
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Apply force if within influence radius
        if (distance < INFLUENCE_RADIUS) {
            const proximity = (INFLUENCE_RADIUS - distance) / INFLUENCE_RADIUS;
            const forceX = deltaX * FORCE_FACTOR * proximity;
            const forceY = deltaY * FORCE_FACTOR * proximity;

            particle.vx += forceX;
            particle.vy += forceY;

            // Make particle visible and reset its visibility timer
            particle.element.style.opacity = "1";
            particle.lastActive = now;
        }

        // Update physics
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= FRICTION;
        particle.vy *= FRICTION;

        // Apply boundaries
        if (particle.x < 0) particle.x = window.innerWidth;
        if (particle.x > window.innerWidth) particle.x = 0;
        if (particle.y < 0) particle.y = window.innerHeight;
        if (particle.y > window.innerHeight) particle.y = 0;

        // Update position
        particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;

        // Hide particle if it hasn't been active for a while
        if (now - particle.lastActive > VISIBLE_DURATION) {
            particle.element.style.opacity = "0";
        }
    });

    prevMouseX = mouseX;
    prevMouseY = mouseY;
    requestAnimationFrame(updateParticles);
}

// Initialize
createBackgroundParticles();
updateParticles();

// Your existing hover effects
document.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
})
