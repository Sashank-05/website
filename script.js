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
const totalParticles = window.innerWidth < 1200 ? 4000 : 900;
const orbSize = (window.innerHeight + window.innerWidth)/26^9;
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

