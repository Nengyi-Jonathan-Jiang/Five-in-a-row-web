(function () {
    "use strict";

    class Canvas {
        /**
         * @param width
         * Width of canvas in pixels. Defaults to window width.
         * @param height
         * Height of canvas in pixels. Defaults to window height.
         * @param parent
         * If parent is an HTML element,(like div or body),the created HTMLCanvasElement will be appended to it.
         * @param transparent
         * If true (default),the created canvas will be able to draw transparent/translucent colors or images.
         */
        constructor(width, height, parent, transparent = true) {
            this.canvas = document.createElement('canvas');
            this.w = this.canvas.width = width || window.innerWidth;
            this.h = this.canvas.height = height || window.innerHeight;
            if (parent && parent.appendChild) parent.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d', {
                alpha: transparent
            }) || (_ => {
                throw Error("Unable to create canvas rendering context");
            })();
            this.ctx.textAlign = "center";
            this.parent = parent;
            this.textOptions = {
                "font-style": "normal",
                "font-variant": "normal",
                "font-weight": "normal",
                "font-size": "12em",
                "line-height": "1",
                "font-family": "system-ui"
            };
        }

        set width(width) {
            this.resize(width, this.h);
        }

        get width() {
            return this.w;
        }

        set height(height) {
            this.resize(this.w, height);
        }

        get height() {
            return this.h;
        }

        /**
         * Resizes the canvas to the provided dimensions,or the size provided by the CSS attributes.
         * @param width
         * Width in pixels. If not truthy,will be the window width.
         * @param height
         * Height in pixels. If not truthy,will be the window height.
         */
        resize(width, height) {
            this.canvas.width = this.w = width || this.canvas.clientWidth;
            this.canvas.height = this.h = height || this.canvas.clientHeight;
        }

        /**
         * Resizes the canvas to the dimensions of the parent element (Will probably throw error if the parent provided in the constructor was not a HTMLElement)
         */
        resizeToParent() {
            if (!this.parent) return;
            this.resize(this.parent.clientWidth, this.parent.clientHeight);
        }

        /**
         * resizes the canvas to the dimensions of the window
         */
        resizeToWindow() {
            this.resize(window.innerWidth, window.innerHeight);
        }

        /**
         * Sets the stroke and fill color of subsequent operations
         * @param color
         * Hex value of the color (like #d4c00b)
         */
        setDrawColor(color) {
            this.ctx.strokeStyle = this.ctx.fillStyle = color;
        }

        /**
         * Sets the stroke color of subsequent operations
         * @param color
         * Hex value of the color (like #d4c00b)
         */
        setStrokeColor(color) {
            this.ctx.strokeStyle = color;
        }

        /**
         * Sets the fill color of subsequent operations
         * @param {string} color
         * Hex value of the color (like #d4c00b)
         */
        setFillColor(color) {
            this.ctx.fillStyle = color;
        }

        /**
         * Sets the stroke width of subsequent operations
         * @param {number} width
         * Stroke width in pixels
         */
        setStrokeWidth(width) {
            this.ctx.lineWidth = width;
        }

        /**
         * Wrapper for ctx.beginPath.
         */
        beginPath() {
            this.ctx.beginPath();
        }

        /**
         * Wrapper for ctx.moveTo.
         * Moves to (x,y). This starts a new line/fill
         */
        moveTo(x, y) {
            this.ctx.moveTo(x, y);
        }

        /**
         * Wrapper for ctx.lineTo
         * Makes a line to (x,y)
         */
        lineTo(x, y) {
            this.ctx.lineTo(x, y);
        }

        /**
         * Wrapper for ctx.arc
         * Draws an arc centered at (x,y) from a1 to a2 full turns clockwise with radius
         * r. If counterclockwise=true,the arc will be inverted (not mirrored)
         */
        arc(x, y, r, a1, a2, counterclockwise = false) {
            this.ctx.arc(x, y, r, a1 * 2 * Math.PI, a2 * 2 * Math.PI, counterclockwise);
        }

        /**
         * Wrapper for ctx.stroke
         * Draws the path onto the canvas
         */
        stroke() {
            this.ctx.stroke();
        }

        /**
         * Wrapper for ctx.fill
         * Fills in the area outlined in the path
         */
        fill() {
            this.ctx.fill();
        }

        /**
         * Wrapper for ctx.closePath
         */
        closePath() {
            this.ctx.closePath();
        }

        /**
         * Clears canvas. If color is provided,fill canvas with color
         * @param color
         * Hex value of the color (like #d4c00b). If not provided,the resulting canvas is transparent if transparency is enabled or white otherwise.
         */
        clear(color) {
            this.ctx.save();
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            if (color) this.setFillColor(color), this.ctx.fillRect(0, 0, this.w, this.h); else this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.ctx.restore();
        }

        /**
         * Draws a line from x1 to y1.
         */
        line(x1, y1, x2, y2) {
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
            this.ctx.closePath();
        }

        /**
         * Fills a rectancle with color. (x1,y1) is the top left corner and (x2,y2) is the bottom right corner.
         */
        fillRect(x1, y1, x2, y2) {
            this.ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
        }

        /**
         * Draws a rectancle. (x1,y1) is the top left corner and (x2,y2) is the bottom right corner.
         */
        drawRect(x1, y1, x2, y2) {
            this.ctx.beginPath();
            this.ctx.rect(x1, y1, x2 - x1, y2 - y1);
            this.ctx.stroke();
            this.ctx.closePath();
        }

        /**
         * Fills a square with top left corner at (x1,y1) and width
         */
        fillSquare(x, y, width) {
            this.ctx.fillRect(x, y, width, width);
        }

        /**
         * Draws a square with top left corner at (x,y) and width
         */
        square(x, y, width) {
            this.ctx.beginPath();
            this.ctx.rect(x, y, width, width);
            this.ctx.stroke();
            this.ctx.closePath();
        }

        /**
         * Fills a circle with center (x,y) and radius r
         */
        fillCircle(x, y, r) {
            this.ctx.beginPath();
            this.ctx.arc(x, y, r, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.closePath();
        }

        /**
         * Draws a circle with center (x,y) and radius r
         */
        circle(x, y, r) {
            this.ctx.beginPath();
            this.ctx.arc(x, y, r - this.ctx.lineWidth / 2, 0, 2 * Math.PI);
            this.ctx.stroke();
            this.ctx.closePath();
        }

        /**
         * Fills an arc centered at (x,y) from a1 to a2 full turns clockwise with radius
         * r. If counterclockwise=true,the arc will be inverted (not mirrored)
         */
        fillArc(x, y, r, a1, a2, counterclockwise = false) {
            this.beginPath();
            this.moveTo(x, y);
            this.arc(x, y, r, a1, a2);
            this.fill();
            this.closePath();
        }

        /**
         * Draws an arc centered at (x,y) from a1 to a2 full turns clockwise with radius
         * r. If counterclockwise=true,the arc will be inverted (not mirrored)
         */
        drawArc(x, y, r, a1, a2, counterclockwise = false) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.arc(x, y, r, a1 * 2 * Math.PI, a2 * 2 * Math.PI, counterclockwise);
            this.ctx.stroke();
            this.ctx.closePath();
        }

        /**
         * Fills an double arc centered at (x,y) from a1 to a2 full turns clockwise with radii
         * r1 and r2. If counterclockwise=true,the arc will be inverted (not mirrored)
         */
        fillDoubleArc(x, y, r1, r2, a1, a2, counterclockwise = false) {
            this.ctx.beginPath();
            this.ctx.arc(x, y, r1, a1 * 2 * Math.PI, a2 * 2 * Math.PI);
            this.ctx.arc(x, y, r2, a2 * 2 * Math.PI, a1 * 2 * Math.PI, counterclockwise);
            this.ctx.fill();
            this.ctx.closePath();
        }

        /**
         * Sets font style
         */
        setFont(family, italic, bold, line_height, small_caps) {
            if (family) this.textOptions["font-family"] = family;
            if (italic !== undefined) this.textOptions["font-style"] = italic ? "italic" : "normal";
            if (bold !== undefined) this.textOptions["font-weight"] = bold ? "bold" : "normal";
            if (line_height !== undefined) this.textOptions["line-height"] = line_height.toString();
            if (small_caps !== undefined) this.textOptions["font-variant"] = small_caps ? "small_caps" : "normal";
        }

        /**
         * Fill text with top left corner at (x,y)
         * @param txt
         * The text to display
         * @param size
         * The font size in pixels
         * @param  font
         * A string parsed like a CSS font property (like "italic bold 16px Times";)
         */
        fillText(txt, x, y, size) {
            this.ctx.beginPath();
            this.ctx.font = [this.textOptions["font-variant"], this.textOptions["font-weight"], size + "px", this.textOptions["font-family"]].join(" ");
            this.ctx.textAlign = "center";
            this.ctx.fillText(txt, x, y);
            this.ctx.closePath();
        }

        /**
         * Outline text with top left corner at (x,y)
         * @param txt
         * The text to display
         * @param size
         * The font size in pixels
         * @param font
         * A string parsed like a CSS font property (like "italic bold 16px Times";)
         */
        strokeText(txt, x, y, size) {
            this.ctx.beginPath();
            this.ctx.font = [this.textOptions["font-variant"], this.textOptions["font-weight"], size + "px", this.textOptions["font-family"]].join(" ");
            this.ctx.textAlign = "center";
            this.ctx.strokeText(txt, x, y);
            this.ctx.closePath();
        }

        /**
         * draws a polygon centered at center
         * @param center
         * center of polygon
         * @param points
         * verticies of polygon
         */
        polygon(center, points) {
            this.ctx.beginPath();
            this.ctx.moveTo(points[points.length - 1][0] + center[0], points[points.length - 1][1] + center[1]);
            let t = this;
            points.forEach(s => t.ctx.lineTo(s[0] + center[0], s[1] + center[1]));
            this.ctx.stroke();
            this.ctx.closePath();
        }

        /**
         * fills a polygon centered at center
         * @param center
         * center of polygon
         * @param points
         * verticies of polygon
         */
        fillPolygon(center, points) {
            this.ctx.beginPath();
            this.ctx.moveTo(points[points.length - 1][0] + center[0], points[points.length - 1][1] + center[1]);
            let t = this;
            points.forEach(s => t.ctx.lineTo(s[0] + center[0], s[1] + center[1]));
            this.ctx.fill();
            this.ctx.closePath();
        }

        /**
         * Draws a squircle
         * @param x
         * x-coordinate of the squircle center
         * @param y
         * y-coordinate of the squircle center
         * @param width
         * width of squircle
         * @param r
         * radius of rounded corners
         */
        squircle(x, y, width, r = 5) {
            this.ctx.beginPath();
            this.ctx.arc(x + width / 2 - r, y - width / 2 + r, r, 3 * Math.PI / 2, 0 * Math.PI / 2);
            this.ctx.arc(x + width / 2 - r, y + width / 2 - r, r, 0 * Math.PI / 2, 1 * Math.PI / 2);
            this.ctx.arc(x - width / 2 + r, y + width / 2 - r, r, 1 * Math.PI / 2, 2 * Math.PI / 2);
            this.ctx.arc(x - width / 2 + r, y - width / 2 + r, r, 2 * Math.PI / 2, 3 * Math.PI / 2);
            this.ctx.lineTo(x + width / 2 - r, y - width / 2);
            this.ctx.stroke();
            this.ctx.closePath();
        }

        /**
         * Fills a squircle
         * @param x
         * x-coordinate of the squircle center
         * @param y
         * y-coordinate of the squircle center
         * @param width
         * width of squircle
         * @param r
         * radius of rounded corners
         */
        fillSquircle(x, y, width, r = 5) {
            this.ctx.beginPath();
            this.ctx.arc(x + width / 2 - r, y - width / 2 + r, r, 3 * Math.PI / 2, 0 * Math.PI / 2);
            this.ctx.arc(x + width / 2 - r, y + width / 2 - r, r, 0 * Math.PI / 2, 1 * Math.PI / 2);
            this.ctx.arc(x - width / 2 + r, y + width / 2 - r, r, 1 * Math.PI / 2, 2 * Math.PI / 2);
            this.ctx.arc(x - width / 2 + r, y - width / 2 + r, r, 2 * Math.PI / 2, 3 * Math.PI / 2);
            this.ctx.lineTo(x + width / 2 - r, y - width / 2);
            this.ctx.fill();
            this.ctx.closePath();
        }

        /**
         * Draws a curve through 2 or more points
         * @param points
         * points to draw the curve through
         */
        spline(points) {
            const f = 0.3, t = 0.6;
            this.ctx.beginPath();
            this.ctx.moveTo(points[0][0], points[0][1]);
            let m = 0, dx1 = 0, dy1 = 0, dx2 = 0, dy2 = 0;
            let preP = points[0], curP, nexP;
            for (let i = 1; i < points.length; i++) {
                curP = points[i];
                nexP = points[i + 1];
                if (nexP) {
                    m = (preP[1] - curP[1]) / (preP[0] - curP[0]);
                    dx2 = -(nexP[0] - curP[0]) * f;
                    dy2 = dx2 * m * t;
                }
                this.ctx.bezierCurveTo(preP[0] - dx1, preP[1] - dy1, curP[0] + dx2, curP[1] + dy2, curP[0], curP[1]);
                dx1 = dx2;
                dy1 = dy2;
                preP = curP;
            }
            this.ctx.stroke();
            this.ctx.closePath();
        }

        /**
         * Draws a bezier curve with 3 control points
         * @param p1
         * first control point
         * @param p2
         * second control point
         * @param p3
         * third control point
         */
        bezier(p1, p2, p3) {
            this.ctx.beginPath();
            this.ctx.moveTo(...p1);
            this.ctx.quadraticCurveTo(...p2, ...p3);
            this.ctx.stroke();
            this.ctx.closePath();
        }

        /**
         * Draws unscaled image with top left corner at (x,y)
         */
        drawImage(img, x, y) {
            if (img.width * img.height === 0) {
                console.log(img);
            }
            this.ctx.drawImage(img, x, y);
        }

        /**
         * Draws an image scaled by a factor with top left corner at (x,y)
         */
        drawScaledImage(img, x, y, factor = 1) {
            this.ctx.drawImage(img, x, y, factor * img.width, factor * img.height);
        }

        /**
         * Draws an image scaled to width (preserving the aspect ratio) with top left corner at (x,y)
         */
        drawImageWithWidth(img, x, y, destwidth) {
            let destheight = destwidth / img.width * img.height;
            this.ctx.drawImage(img, x, y, destwidth, destheight);
        }

        /**
         * Draws an image scaled to height (preserving the aspect ratio) with top left corner at (x,y)
         */
        drawImageWithHeight(img, x, y, destheight) {
            let destwidth = destheight / img.height * img.width;
            this.ctx.drawImage(img, x, y, destwidth, destheight);
        }

        /**
         * Draws an image on a rect with top left corner (x1,y1) and bottom right corner (x2,y2)
         */
        drawImageOnRect(img, x1, y1, x2, y2) {
            let destwidth = ~~(x2 - x1);
            let destheight = ~~(y2 - y1);
            this.ctx.drawImage(img, x1, y1, destwidth, destheight);
        }

        /**
         * Wrapper for CanvasRenderingContext2D.save()
         * Saves the current state to a stack
         */
        pushState() {
            this.ctx.save();
        }

        /**
         * Wrapper for CanvasRenderingContext2D.restore()
         * Restores the last state on the stack and pops it from the stack
         */
        restoreState() {
            this.ctx.restore();
        }

        /**
         * rotate context by angle around (x,y) or (0,0) if not present
         * @param angle
         * angle in radians
         * @param clockwise
         * whether to rotate clockwise
         */
        rotate(angle, clockwise = true, x = 0, y = 0) {
            this.ctx.translate(-x, -y);
            this.ctx.rotate(clockwise ? angle : -angle);
            this.ctx.translate(x, y);
        }

        /**
         * translates context x units left and y units down
         */
        translate(x, y) {
            this.ctx.translate(x, y);
        }

        /**
         * Calls f(current time,elapsed time in milliseconds) 60 times per second (or tries to...)
         * @param {Function} f-the function to be called
         */
        static createAnimation(f) {
            let then = 0;
            const f2 = (t) => {
                if (f(0.001 * t, 0.001 * (then - t))) return;
                then = t;
                requestAnimationFrame(f2);
            };
            requestAnimationFrame(f2);
        }
    }

    class Pair {
        constructor(first, second) {
            this.first = first;
            this.second = second;
        }
    }

    var lastMove = null;

    class GameDisplay {
        static BLACK_IMAGE = document.getElementById('black-png')
        static WHITE_IMAGE = document.getElementById('white-png')
        static BOARD_IMAGE = document.getElementById('board-png')

        constructor() {
            this.SIZE = 800;
            this.LEFT_OFFSET = 0;
            this.TOP_OFFSET = 0;
            this.logic = new GameLogic(this);
            this.canvas = new Canvas(0, 0, document.body);
            this.canvas.canvas.onclick = e => this.onMouseDown(e.clientX, e.clientY);
            window.onkeypress = e => this.onKeyPressed(e.keyCode);
            window.onresize = (f=>(f(), f))(() => {
                this.canvas.resizeToWindow();
                document.body.style.setProperty('--width', this.canvas.width + "px");
                document.body.style.setProperty('--height', this.canvas.height + "px");
            });

            Canvas.createAnimation(_ => this.paint());
        }

        //Called every time the display needs to update
        paint() {
            //Recalculate dimensions
            const WIDTH = this.canvas.width, HEIGHT = this.canvas.height;
            const SIZE = this.SIZE = Math.min(WIDTH, HEIGHT);
            const LEFT_OFFSET = this.LEFT_OFFSET = (WIDTH - SIZE) >> 1,
                TOP_OFFSET = this.TOP_OFFSET = (HEIGHT - SIZE) >> 1;
            const BOARD_SIZE = GameLogic.BOARD_SIZE;
            const PIECE_RAD = ~~(SIZE / BOARD_SIZE / 2);
            //Paint board background
            this.canvas.clear("#000");

            this.canvas.drawImageOnRect(GameDisplay.BOARD_IMAGE, LEFT_OFFSET, TOP_OFFSET, LEFT_OFFSET + SIZE, TOP_OFFSET + SIZE);

            this.canvas.ctx.lineWidth = 2;
            this.canvas.setDrawColor("#000");
            //Draw grid
            for (let i = 0; i < BOARD_SIZE; i++) {
                const offset = i * SIZE / BOARD_SIZE;
                this.canvas.line(LEFT_OFFSET + PIECE_RAD, TOP_OFFSET + offset + PIECE_RAD, WIDTH - LEFT_OFFSET - PIECE_RAD, TOP_OFFSET + offset + PIECE_RAD);
                this.canvas.line(LEFT_OFFSET + offset + PIECE_RAD, TOP_OFFSET + PIECE_RAD, LEFT_OFFSET + offset + PIECE_RAD, HEIGHT - TOP_OFFSET - PIECE_RAD);
            }
            //Draw pieces
            this.canvas.ctx.lineWidth = ~~(PIECE_RAD / 6);
            for (let i = 0; i < GameLogic.BOARD_SIZE; i++) {
                for (let j = 0; j < GameLogic.BOARD_SIZE; j++) {
                    const circleX = LEFT_OFFSET + i * SIZE / BOARD_SIZE;
                    const circleY = TOP_OFFSET + j * SIZE / BOARD_SIZE;
                    switch (this.logic.getPieceAt(i, j)) {
                        case BOARD_CELL.PLAYER:
                            this.canvas.drawImageOnRect(GameDisplay.BLACK_IMAGE, circleX, circleY, circleX + 2 * PIECE_RAD, circleY + 2 * PIECE_RAD);
                            if (lastMove !== null && lastMove[0] === i && lastMove[1] === j) {
                                this.canvas.setDrawColor("#fff");
                                this.canvas.circle(circleX + PIECE_RAD, circleY + PIECE_RAD, PIECE_RAD / 2);
                                this.canvas.setDrawColor("#000");
                            }
                            break;
                        case BOARD_CELL.OPPONENT:
                            this.canvas.drawImageOnRect(GameDisplay.WHITE_IMAGE, circleX, circleY, circleX + 2 * PIECE_RAD, circleY + 2 * PIECE_RAD)
                            if (lastMove !== null && lastMove[0] === i && lastMove[1] === j) {
                                this.canvas.circle(circleX + PIECE_RAD, circleY + PIECE_RAD, PIECE_RAD / 2);
                            }
                            break;
                    }
                }
            }
        }

        onWin() {
            document.getElementById("game-result").dataset.result = "win";
            document.getElementById("game-result").onclick = (e => {
                if (e.target instanceof HTMLElement) e.target.dataset.result = "null";
                this.logic.resetBoard()
            });
        }

        onLose() {
            document.getElementById("game-result").dataset.result = "lose";
            document.getElementById("game-result").onclick = (e => {
                if (e.target instanceof HTMLElement) e.target.dataset.result = "null";
                this.logic.resetBoard()
            });
        }

        onDraw() {
            document.getElementById("game-result").dataset.result = "draw";
            document.getElementById("game-result").onclick = (e => {
                if (e.target instanceof HTMLElement) e.target.dataset.result = "null";
                this.logic.resetBoard()
            });
        }

        onKeyPressed(keyCode) {
            this.logic.onKey(keyCode);
        }

        onMouseDown(x, y) {
            this.logic.click(~~(GameLogic.BOARD_SIZE * (x - this.LEFT_OFFSET) / this.SIZE), ~~(GameLogic.BOARD_SIZE * (y - this.TOP_OFFSET) / this.SIZE));
        }
    }

    const BOARD_CELL = (function (BOARD_CELL) {
        BOARD_CELL[BOARD_CELL["EMPTY"] = 0] = "EMPTY";
        BOARD_CELL[BOARD_CELL["PLAYER"] = 1] = "PLAYER";
        BOARD_CELL[BOARD_CELL["OPPONENT"] = 2] = "OPPONENT";
        return BOARD_CELL;
    })({});

    class GameLogic {
        constructor(disp) {
            this.opponent = new ComputerOpponent(this);
            this.display = disp;
            this.resetBoard();
        }

        static get BOARD_SIZE() {
            return 15;
        }

        click(x, y) {
            if (x < 0 || x >= GameLogic.BOARD_SIZE || y < 0 || y >= GameLogic.BOARD_SIZE || this.board[x][y] !== BOARD_CELL.EMPTY) return;
            this.playerMove(x, y);
        }

        playerMove(x, y) {
            this.board[x][y] = BOARD_CELL.PLAYER;
            lastMove = [x, y];
            this.display.paint();
            switch (this.gameWon()) {
                case 1:
                    this.display.onWin();
                    break;
                case 3:
                    this.display.onDraw();
                    break;
                default:
                    this.opponentMove();
            }
        }

        opponentMove() {
            this.opponent.move();
            this.display.paint();
            switch (this.gameWon()) {
                case 2:
                    this.display.onLose();
                    break;
                case 3:
                    this.display.onDraw();
                    break;
            }
        }

        resetBoard() {
            this.board = new Array(GameLogic.BOARD_SIZE).fill(0).map(i => new Array(GameLogic.BOARD_SIZE).fill(BOARD_CELL.EMPTY));
        }

        gameWon() {
            return /.*XXXXX.*/.test(this.getRows()) || /.*XXXXX.*/.test(this.getCols()) || /.*XXXXX.*/.test(this.getDiagonals(false)) || /.*XXXXX.*/.test(this.getDiagonals(true)) ? 1 : /.*OOOOO.*/.test(this.getRows()) || /.*OOOOO.*/.test(this.getCols()) || /.*OOOOO.*/.test(this.getDiagonals(false)) || /.*OOOOO.*/.test(this.getDiagonals(true)) ? 2 : this.isFull() ? 3 : 0;
        }

        getPieceAt(x, y) {
            return this.board[x][y];
        }

        hasPieceAt(x, y) {
            return this.board[x][y] !== BOARD_CELL.EMPTY;
        }

        setPieceAt(o, x, y, val) {
            if (o === this.opponent) this.board[x][y] = val;
        }

        isEmpty() {
            for (let i of this.board) for (let j of i) if (j !== BOARD_CELL.EMPTY) return false;
            return true;
        }

        isFull() {
            for (let i of this.board) for (let j of i) if (j === BOARD_CELL.EMPTY) return false;
            return true;
        }

        getDiagonals(direction) {
            let res = "", i, j, x, y, l = GameLogic.BOARD_SIZE;
            for (i = l - 1; i > 0; i--) {
                for (j = 0, x = i; x < l; j++, x++) res += GameLogic.m.get(this.board[direction ? l - x - 1 : x][j]);
                res += "|";
            }
            for (i = 0; i < l; i++) {
                for (j = 0, y = i; y < l; j++, y++) res += GameLogic.m.get(this.board[direction ? l - j - 1 : j][y]);
                res += "|";
            }
            return res;
        }

        getRows() {
            let res = "", i, j, l = GameLogic.BOARD_SIZE;
            for (i = 0; i < l; i++) {
                for (j = 0; j < l; j++) res += GameLogic.m.get(this.board[i][j]);
                res += '|';
            }
            return res.toString();
        }

        getCols() {
            let res = "", i, j, l = GameLogic.BOARD_SIZE;
            for (i = 0; i < l; i++) {
                for (j = 0; j < l; j++) res += GameLogic.m.get(this.board[j][i]);
                res += '|';
            }
            return res;
        }
    }

    GameLogic.m = new Map([[BOARD_CELL.EMPTY, "_"], [BOARD_CELL.PLAYER, "X"], [BOARD_CELL.OPPONENT, "O"]]);

    class ComputerOpponent {
        constructor(logic) {
            this.logic = logic;
        }

        move() {
            const l = GameLogic.BOARD_SIZE;
            //If board is empty, go in middle space
            if (this.logic.isEmpty()) {
                this.logic.setPieceAt(this, l / 2, l / 2, BOARD_CELL.OPPONENT);
                return;
            }
            //Store best moves & score so far
            let bestMoves = [];
            let bestScore = Number.NEGATIVE_INFINITY;
            //For every empty space on the board
            for (let i = 0; i < l; i++) for (let j = 0; j < l; j++) {
                if (this.logic.hasPieceAt(i, j)) continue;
                //Set the space to 2 for now
                this.logic.setPieceAt(this, i, j, BOARD_CELL.OPPONENT);
                //See how advantageous the board is
                let score = this.score();
                //If it is better than the current best board(s), set it to the new best board
                if (score > bestScore) {
                    bestMoves = [new Pair(i, j)];
                    bestScore = score;
                }
                //Otherwise, if it's just as good as the best board(s), add it the set of best boards
                else if (score === bestScore) bestMoves.push(new Pair(i, j));
                //Reset the space to 0
                this.logic.setPieceAt(this, i, j, BOARD_CELL.EMPTY);
            }
            //Find a random move out of the best moves
            const move = bestMoves[~~(Math.random() * bestMoves.length)];
            lastMove = [move.first, move.second];
            //Carry out the move
            this.logic.setPieceAt(this, move.first, move.second, BOARD_CELL.OPPONENT);
        }

        //Find out how advantageous a given board configuration is
        score() {
            let score = 0;
            //All rows/columns/diagonals of the board, converted to a string and joined with '|'s
            let s = this.logic.getRows() + this.logic.getCols() + this.logic.getDiagonals(true) + this.logic.getDiagonals(false);
            //For each regex
            for (let a of ComputerOpponent.SCORING_MAP.entries()) {
                //Multiply by score per match * number of matches
                score += (s.match(a[0]) || {length: 0}).length * a[1];
            }
            //Return total score
            return score;
        }
    }

    ComputerOpponent.SCORING_MAP = new Map([//Guaranteed win for computer immediately
        [/OOOOO/g, 1000000000], //Guaranteed win for player in 1 moves
        [/XXXX_/g, -100000000], [/XXX_X/g, -100000000], [/XX_XX/g, -100000000], [/X_XXX/g, -100000000], [/_XXXX/g, -100000000], //Guaranteed win for computer in 2 moves
        [/_OOOO_/g, 20000000], //Possible win for computer in 2 moves
        [/OOOO_/g, 10000000], [/OOO_O/g, 10000000], [/OO_OO/g, 10000000], [/O_OOO/g, 10000000], [/_OOOO/g, 10000000], //Possible win for player in 3 moves
        [/_XXX__/g, -1000000], [/__XXX_/g, -1000000], [/_XX_X_/g, -1000000], [/_X_XX_/g, -1000000], [/_XXX_/g, -500000], //Possible win for computer in 4 moves
        [/_OOO__/g, 100000], [/__OOO_/g, 100000], [/_OO_O_/g, 100000], [/_O_OO_/g, 100000], [/_OOO_/g, 50000], //Good moves for computer
        [/__OO__/g, 1200], [/_OO__/g, 1000], [/__OO_/g, 1000], [/XXO_/g, 500], [/_OXX/g, 500], //Barely disadvantageous situations for computer
        [/__XX_/g, -1100], [/_XX__/g, -1100], [/OXO/g, -100], //Don't go in random places;
        [/OX/g, 1], [/XO/g, 1]]);
    window.game = new GameDisplay();
})();
