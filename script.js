// Import Three.js library - already loaded from CDN in HTML

// 3D Cube Animation Setup
class CubeParticle {
    constructor(scene, color, size) {
        // Create cube geometry and material
        this.geometry = new THREE.BoxGeometry(size, size, size);
        this.material = new THREE.MeshPhongMaterial({
            color: color,
            shininess: 100,
            specular: 0xffffff
        });
        
        // Create mesh
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        
        // Random position
        this.mesh.position.x = (Math.random() - 0.5) * window.innerWidth * 0.8;
        this.mesh.position.y = (Math.random() - 0.5) * window.innerHeight * 0.8;
        this.mesh.position.z = Math.random() * -500 - 200;
        
        // Random rotation
        this.mesh.rotation.x = Math.random() * Math.PI;
        this.mesh.rotation.y = Math.random() * Math.PI;
        this.mesh.rotation.z = Math.random() * Math.PI;
        
        // Add to scene
        scene.add(this.mesh);
        
        // Set movement properties
        this.velocity = {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2,
            z: Math.random() * 2 + 2
        };
        
        this.rotationSpeed = {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
        };
        
        // Set initial state for initial animation
        this.initialAnimation = true;
        this.initialScale = 0.01;
        this.targetScale = 1;
        this.mesh.scale.set(this.initialScale, this.initialScale, this.initialScale);
        
        // Track whether cube has reached visible area
        this.hasReachedVisibleArea = false;
    }
    
    update() {
        // Initial pop animation
        if (this.initialAnimation) {
            this.initialScale += (this.targetScale - this.initialScale) * 0.1;
            this.mesh.scale.set(this.initialScale, this.initialScale, this.initialScale);
            
            if (Math.abs(this.initialScale - this.targetScale) < 0.01) {
                this.initialAnimation = false;
            }
        }
        
        // Update position
        this.mesh.position.x += this.velocity.x;
        this.mesh.position.y += this.velocity.y;
        this.mesh.position.z += this.velocity.z;
        
        // Update rotation
        this.mesh.rotation.x += this.rotationSpeed.x;
        this.mesh.rotation.y += this.rotationSpeed.y;
        this.mesh.rotation.z += this.rotationSpeed.z;
        
        // Check if the cube has gone past the camera
        if (this.mesh.position.z > 200) {
            this.mesh.position.z = -1000;
            this.hasReachedVisibleArea = true;
            
            if (this.hasReachedVisibleArea) {
                // Randomize position when recycling
                this.mesh.position.x = (Math.random() - 0.5) * window.innerWidth * 1.5;
                this.mesh.position.y = (Math.random() - 0.5) * window.innerHeight * 1.5;
            }
        }
        
        // Zigzag movement
        if (this.hasReachedVisibleArea) {
            this.mesh.position.x += Math.sin(this.mesh.position.z * 0.01) * 0.5;
            this.mesh.position.y += Math.cos(this.mesh.position.z * 0.01) * 0.5;
        }
    }
    
    respondToMouse(mouseX, mouseY) {
        // Only respond if in visible area
        if (this.mesh.position.z > -200 && this.mesh.position.z < 200) {
            // Calculate distance from mouse in normalized coordinates
            const dx = (mouseX / window.innerWidth) * 2 - 1 - (this.mesh.position.x / (window.innerWidth * 0.4));
            const dy = -(mouseY / window.innerHeight) * 2 + 1 - (this.mesh.position.y / (window.innerHeight * 0.4));
            
            // Apply subtle force based on mouse position
            this.velocity.x += dx * 0.05;
            this.velocity.y += dy * 0.05;
            
            // Apply limits to velocity
            this.velocity.x = Math.max(-3, Math.min(3, this.velocity.x));
            this.velocity.y = Math.max(-3, Math.min(3, this.velocity.y));
            
            // Add a slight damping effect
            this.velocity.x *= 0.98;
            this.velocity.y *= 0.98;
        }
    }
}

// Main animation setup
function initThreeJS() {
    // Set up scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    
    // Add renderer to container
    const container = document.getElementById('cube-container');
    container.appendChild(renderer.domElement);
    
    // Set camera position
    camera.position.z = 400;
    
    // Add lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Create colored cubes
    const colors = [
        0x5c3d9c, // Purple (primary)
        0xff5e62, // Coral
        0x2ec4b6, // Teal
        0xff9a00, // Orange
        0x7f5ad1, // Light purple
    ];
    
    const cubes = [];
    const numCubes = 30;
    
    for (let i = 0; i < numCubes; i++) {
        const colorIndex = i % colors.length;
        const size = Math.random() * 15 + 5; // Random size between 5 and 20
        const cube = new CubeParticle(scene, colors[colorIndex], size);
        cubes.push(cube);
    }
    
    // Mouse movement tracking
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });
    
    // Touch movement tracking for mobile
    document.addEventListener('touchmove', (event) => {
        if (event.touches.length > 0) {
            mouseX = event.touches[0].clientX;
            mouseY = event.touches[0].clientY;
        }
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Update all cubes
        cubes.forEach(cube => {
            cube.update();
            cube.respondToMouse(mouseX, mouseY);
        });
        
        // Render scene
        renderer.render(scene, camera);
    }
    
    // Initial animation call
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Initialize 3D animation when window loads
window.addEventListener('load', initThreeJS);

// Portfolio filtering
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-button');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Add click event to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get filter value
            const filterValue = button.getAttribute('data-filter');
            
            // Show/hide portfolio items based on filter
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form validation for booking form
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const eventTypeInput = document.getElementById('event_type');
            const eventDateInput = document.getElementById('event_date');
            const guestsInput = document.getElementById('guests');
            
            let isValid = true;
            
            // Simple validation
            if (nameInput.value.trim() === '') {
                highlightField(nameInput);
                isValid = false;
            }
            
            if (emailInput.value.trim() === '' || !isValidEmail(emailInput.value)) {
                highlightField(emailInput);
                isValid = false;
            }
            
            if (phoneInput.value.trim() === '') {
                highlightField(phoneInput);
                isValid = false;
            }
            
            if (eventTypeInput.value === '') {
                highlightField(eventTypeInput);
                isValid = false;
            }
            
            if (eventDateInput.value === '') {
                highlightField(eventDateInput);
                isValid = false;
            }
            
            if (guestsInput.value === '' || guestsInput.value < 1) {
                highlightField(guestsInput);
                isValid = false;
            }
            
            if (!isValid) {
                e.preventDefault();
                alert('Please fill all required fields correctly.');
            }
        });
    }
    
    // Helper function to highlight invalid fields
    function highlightField(field) {
        field.style.borderColor = '#ff3860';
        field.addEventListener('input', function() {
            field.style.borderColor = '';
        });
    }
    
    // Helper function to validate email
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});
