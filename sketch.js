const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const seed = random.getRandomSeed();
random.setSeed(seed);
console.log(seed);

const settings = {
  dimensions: [2048, 2048],
  pixelsPerInch: 100,
  suffix: seed,
};

const sketch = () => {
  const palette = random.pick(palettes);

  const createGrid =  () => {
    const points = [];
    const count = 40;
    let u;
    let v;
    let radius;
    console.log(palette);
    for(let x = 0; x < count; x++) {
      for(let y = 0; y < count; y++) {
        u = count <= 1 ? 0.5 : x / (count - 1);
        v = count <= 1 ? 0.5 : y / (count - 1);
        radius = Math.abs(random.noise2D(u, v)) * 0.05;

        points.push({
          color: random.pick(palette),
          radius,
          rotate: random.noise2D(u * 40, v * 40),
          position: [u, v]
        });
      }
    }

    return points;
  };


  const points = createGrid().filter(() => {
    return (random.value() > 0.5);
  });
  const margin = 20;

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    let x;
    let y;

    points.forEach(({ position, radius, color, rotate }) => {
      const [u, v] = position;
      x = lerp(margin, width - margin, u);
      y = lerp(margin, height - margin, v);

      // context.beginPath();
      // context.arc(x, y, radius * width, 0, Math.PI * 2, false);
      // context.strokeStyle = "black";
      // context.lineWidth = 3;
      // context.fillStyle = color;
      // context.fill();
      // context.stroke();
      context.save();
      context.fillStyle = color;
      context.font = `${radius * width}px 'Arial'`;
      context.translate(x, y);
      context.rotate(rotate);
      context.fillText("CLIO", 0, 0);
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
