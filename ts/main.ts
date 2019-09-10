const canvas = <HTMLCanvasElement>document.createElement('canvas');
const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
const cw: number = 1000;
const ch: number = 1000;
canvas.height = ch;
canvas.width = cw;

document.body.appendChild(canvas)

// ---- scene setup --------------

const box = new Box(500, 100, 200, 200, rgb.white);
box.angle = 1.4544;
const BackWallsColor = rgb.createGrey(100);
const walls = [
    new Wall(0, 0, cw, 0, BackWallsColor),
    new Wall(cw, 0, cw, ch, BackWallsColor),
    new Wall(cw, ch, 0, ch, BackWallsColor),
    new Wall(0, ch, 0, 0, BackWallsColor),
    ...box.getSegments(),
];
let angle = 0;
const points: [number, number][] = [];
const ActiveKeys: number[] = [];
const viewAngle = Math.PI / 2;
let cameraAngle = -(Math.PI / 4 * 2.25);
const cameraPos: [number, number] = [500, 500]
let start = new Date().getTime();

function draw() {
    // ---- has to be before for fps ------------
    start = new Date().getTime();
    ctx.clearRect(0, 0, cw, ch);
    // ------------------------------------------
    box.angle += Math.PI * 2 / 5000;
    if (box.angle > Math.PI * 2) box.angle = 0;
    walls.splice(4, 4);
    walls.push(...box.getSegments());
    // background color
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cw, ch);
    ctx.fillStyle = rgb.createGrey(50).value;
    ctx.fillRect(0, ch / 2, cw, ch / 2);
    //keys
    const rotateFactor = Math.PI * 2 / 1000;
    const moveFactor = 0.5;
    if (IsInKeys(37)) {
        cameraAngle -= rotateFactor;
    }
    if (IsInKeys(39)) {
        cameraAngle += rotateFactor;
    }
    if (IsInKeys(83)) {
        cameraPos[1] += Math.sin(cameraAngle + viewAngle / 2 + Math.PI) * moveFactor;
        cameraPos[0] += Math.cos(cameraAngle + viewAngle / 2 + Math.PI) * moveFactor;
    }
    if (IsInKeys(81)) {
        cameraPos[1] += Math.sin(cameraAngle + viewAngle / 2 - Math.PI / 2) * moveFactor;
        cameraPos[0] += Math.cos(cameraAngle + viewAngle / 2 - Math.PI / 2) * moveFactor;
    }
    if (IsInKeys(68)) {
        cameraPos[1] += Math.sin(cameraAngle + viewAngle / 2 + Math.PI / 2) * moveFactor;
        cameraPos[0] += Math.cos(cameraAngle + viewAngle / 2 + Math.PI / 2) * moveFactor;
    }
    if (IsInKeys(90)) {
        cameraPos[1] += Math.sin(cameraAngle + viewAngle / 2) * moveFactor;
        cameraPos[0] += Math.cos(cameraAngle + viewAngle / 2) * moveFactor;
    }
    // rays
    let angle = cameraAngle;
    const render: rgb[] = [];
    const distances: number[] = [];
    for (let i of new Array(cw)) {
        angle += viewAngle / cw;
        const ray = new Ray(cameraPos[0], cameraPos[1], Math.cos(angle), Math.sin(angle)).cast(walls, true);
        if (ray[0] === undefined && ray[1] === undefined) {
            render.push(rgb.black);
            distances.push(Math.hypot(cw, ch));
        }
        else {
            render.push(ray[2].color);
            //@ts-ignore
            distances.push(distanceCo(cameraPos[0], cameraPos[1], ray[0], ray[1]))
        }
    }
    for (let i = 0; i < render.length; i++) {
        const pixel = render[i];
        const d = distances[i];
        const sq = d * d;
        const sqW = cw * cw;
        const b = P5map(sq, 0, sqW, 255, 0);
        const h = ch * (viewAngle / Math.PI * 180) / d//P5map(d, 0, cw, ch, 100);
        if (pixel.equal(rgb.black)) continue;
        ctx.fillStyle = //pixel.darker(b).value;
            rgb.createGrey(b).value;
        ctx.fillRect(i, (ch - h) / 2, 1, h);
    }
    ctx.save();
    ctx.translate(50, 50);
    ctx.scale(0.1, 0.1);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cw, ch);
    for (let i of walls) {
        i.draw(ctx);
    }
    box.draw(ctx);
    ctx.beginPath();
    ctx.arc(cameraPos[0], cameraPos[1], 500, cameraAngle, cameraAngle + viewAngle);
    ctx.lineTo(cameraPos[0], cameraPos[1]);
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(cameraPos[0], cameraPos[1], 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(150, 50);
    ctx.lineTo(150, 150);
    ctx.lineTo(50, 150);
    ctx.lineTo(50, 50);
    ctx.strokeStyle = "green";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();
    // ---- has to be last fps counter ------------
    const time = new Date().getTime() - start;
    ctx.fillStyle = "red";
    ctx.font = "Arial 50px"
    ctx.fillText((Math.floor((1000 / time) * 100) / 100).toString(), 10, 50);
}


draw.rate = 1000;

draw.interval = setInterval(draw, 1000 / draw.rate);


const _$$c: HTMLCanvasElement = canvas;
const _$$cw = _$$c.width;
const _$$ch = _$$c.height;
function _$$adaptSize() {
    let rhl = _$$cw / _$$ch;
    let rlh = _$$ch / _$$cw;
    if (window.innerWidth > window.innerHeight * rhl) {
        _$$c.style.width = 'inherit';
        _$$c.style.height = '100%';
    }
    if (window.innerHeight > window.innerWidth * rlh) {
        _$$c.style.height = 'inherit';
        _$$c.style.width = '100%';
    }
}
_$$adaptSize();

window.addEventListener('resize', _$$adaptSize);

function IsInKeys(...key: number[]) {
    for (let i of key) {
        if (ActiveKeys.indexOf(i) === -1) {
            return false;
        }
    }
    return true;
}

document.addEventListener("keydown", e => {
    if (ActiveKeys.indexOf(e.keyCode) === -1) {
        ActiveKeys.push(e.keyCode);
    }
});

document.addEventListener('keyup', e => {
    if (ActiveKeys.indexOf(e.keyCode) !== -1) {
        ActiveKeys.splice(ActiveKeys.indexOf(e.keyCode), 1)
    }
})

