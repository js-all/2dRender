class Wall {
    ax: number;
    ay: number;
    bx: number;
    by: number;
    color: rgb;
    constructor(ax: number, ay: number, bx: number, by: number, color = rgb.white) {
        this.ax = ax;
        this.ay = ay;
        this.bx = bx;
        this.by = by;
        this.color = color;
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.strokeStyle = this.color.value;
        ctx.moveTo(this.ax, this.ay);
        ctx.lineTo(this.bx, this.by);
        ctx.stroke();
        ctx.closePath();
    }
}