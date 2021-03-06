const canvasSketch = require('canvas-sketch');
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");
const eases = require("eases");
const BezierEasing = require("bezier-easing");
const glsl = require('glslify');
// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');

// const seed = random.getRandomSeed();
const seed = "25971";

console.log(seed);
random.setSeed(seed);

const settings = {
  dimensions: [512, 512],
  fps: 24,
  // duration: 4,
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  suffix: seed,
  // Turn on MSAA
  attributes: { antialias: true }
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });

  // WebGL background color
  renderer.setClearColor('#e6e6e6', 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();
  const palette = random.pick(palettes);
  // Setup your scene
  const scene = new THREE.Scene();

  const box = new THREE.BoxGeometry(1, 1, 1);
  const meshes = [];

  const fragmentShader = /* glsl */`
    varying vec2 vUv;
    uniform vec3 color;

    void main () {
      gl_FragColor = vec4(vec3(color * vUv.x), 1.0);
    }
  `;

  const vertexShader = glsl(/* glsl */`
    varying vec2 vUv;
    uniform float time;

    #pragma glslify: noise = require('glsl-noise/simplex/4d');

    void main() {
      vUv = uv;
      vec3 pos = position.xyz;
      pos += noise(vec4(position.xyz, time));
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `);

  for (let i = 0; i < 100; i++) {
    const mesh = new THREE.Mesh(
      box,
      new THREE.ShaderMaterial({
        fragmentShader,
        vertexShader,
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Color(random.pick(palette))}
        }
      })
    );

    mesh.position.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1),
    );

    mesh.scale.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1),
    );
    mesh.scale.multiplyScalar(0.5);
    meshes.push(mesh);
    scene.add(mesh);
  }

  scene.add(new THREE.AmbientLight('hsl(0, 0%, 60%)'));
  const light = new THREE.DirectionalLight('white', 1);
  const easeFn = BezierEasing(.2, .1, .2, .2);
  light.position.set(14, 1, 50);
  scene.add(light);

  // draw each frame
  return {
    // Handle resize events here
    resize ({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);

      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 2.0;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update the camera
      camera.updateProjectionMatrix();
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render ({ time, playhead }) {
      renderer.render(scene, camera);
      const t = Math.sin(time * Math.PI);
      scene.rotation.y = easeFn(t);

      meshes.forEach(mesh => {
        mesh.material.uniforms.time.value = time;
      });
      // scene.rotation.y = easeFn(t);
      scene.rotation.z = easeFn(t);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload () {
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
