interface points {
  x: number;
  y: number;
}

function distancePt(a: points, b: points) {
  return distanceCo(a.x, a.y, b.x, b.y);
}

function distanceCo(ax: number, ay: number, bx: number, by: number) {
  return Math.hypot(Math.abs(ax - bx), Math.abs(ay - by));
}

rgb.addColorGetter("orange", new rgb(255, 165, 0));

rgb.config.overwriteColor = false;

function P5map(n: number, start1: number, stop1: number, start2: number, stop2: number) {
  const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
  if (start2 < stop2) {
    return Math.max(Math.min(newval, stop2), start2);
  } else {
    return Math.max(Math.min(newval, start2), stop2);
  }
};