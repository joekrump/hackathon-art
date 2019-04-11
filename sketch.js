const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const settings = {
  dimensions: [2048, 2048],
  pixelsPerInch: 300,
};

const sketch = () => {
  const palette = random.pick(palettes);

  const createGrid =  () => {
    const points = [];
    const count = 40;

    for(let x = 0; x < count; x++) {
      for(let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const radius = Math.abs(random.noise2D(u, v)) * 0.05;

        points.push({
          color: random.pick(palette),
          radius,
          rotate: random.noise2D(u, v),
          position: [u, v]
        });
      }
    }

    return points;
  };

  // random.setSeed(12);

  const points = createGrid().filter(() => {
    return (random.value() > 0.5);
  });
  const margin = 400;

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    points.forEach(({ position, radius, color, rotate }) => {
      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

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
      context.fillText("=", 0, 0);
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
