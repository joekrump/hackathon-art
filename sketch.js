const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: "A4", // could be "A4" or "postcard" or something like that.
  units: "cm",
  pixelsPerInch: 300,
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'blue';
    context.fillRect(0, 0, width, height);

    context.beginPath();
    context.arc(width / 2, height / 2 , width * 0.2, 0, Math.PI * 2, false);
    context.fillStyle = "red";
    context.fill();
    context.lineWidth = width * 0.05;
    context.strokeStyle = "black";
    context.stroke();
  };
};

canvasSketch(sketch, settings);
