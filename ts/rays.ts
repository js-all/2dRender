class Ray {
    x: number;
    y: number;
    vx: number;
    vy: number;
    constructor(x: number, y: number, vx: number, vy: number) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }
    cast<T extends true | false>(walls: Wall[], returnObject?: T): T extends false ? [number | undefined, number | undefined] : [number | undefined, number | undefined, Wall] {
        if (returnObject === undefined) returnObject = <T>false;
        let ptx: number;
        let pty: number;
        let wall: Wall;
        let smallest: number = Infinity;
        for (let i of walls) {
            const x1 = i.ax;
            const y1 = i.ay;
            const x2 = i.bx;
            const y2 = i.by;

            const x3 = this.x;
            const y3 = this.y;
            const x4 = this.vx + this.x;
            const y4 = this.vy + this.y;

            const den: number = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
            if (den == 0) continue;

            const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
            const u = -(((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den);
            if (t > 0 && t < 1 && u > 0) {
                let tptx = x1 + t * (x2 - x1);
                let tpty = y1 + t * (y2 - y1);
                let distance: number = Math.hypot(Math.abs(tptx - this.x), Math.abs(tpty - this.y))
                if (distance < smallest) {
                    smallest = distance;
                    ptx = tptx;
                    pty = tpty;
                    wall = i;
                }

            }

        }
        if (returnObject) {
            //@ts-ignore
            return [ptx, pty, wall];
        } else {
            //@ts-ignore
            return [ptx, pty];
        }


    }
}