const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [2048, 2048],
  pixelsPerInch: 300,
};

random.setSeed(12);

const sketch = () => {
  const createGrid =  () => {
    const points = [];
    const count = 20;

    for(let x = 0; x < count; x++) {
      for(let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        points.push({
          radius: random.value() * 0.03,
          position: [u, v]
        });
      }
    }

    return points;
  };

  const points = createGrid().filter(() => {
    return (random.value() > 0.5);
  });
  const margin = 400;

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    points.forEach(({ position, radius }) => {
      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.beginPath();
      context.arc(x, y, radius * width, 0, Math.PI * 2, false);
      context.strokeStyle = "black";
      context.lineWidth = 3;
      context.stroke();
    });
  };
};

canvasSketch(sketch, settings);
