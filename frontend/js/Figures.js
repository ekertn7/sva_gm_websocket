class NodeLabel {
    constructor(content, position, color, font) {
        this.content = (content == null) ? "" : content;
        this.position = (position == null) ? "TopLeft" : position;
        this.color = (color == null) ? "black" : color;
        this.font = (font == null) ? "20px cursive" : font;
        this.multilineContent = "";
        this.height = 0;
        this.width = 0;
    }

    getFontHeight(font) {
        var parentBlock = document.createElement("span");
        parentBlock.appendChild(document.createTextNode("height"));
        document.body.appendChild(parentBlock)
        parentBlock.style = "font: " + font + "; white-space: nowrap; display: inline;";
        var height = parentBlock.offsetHeight;
        document.body.removeChild(parentBlock);
        return height;
    }

    getTextParameters(maxWidth, lineHeight) {
        var words = this.content.split(" ");
        var txt = "";
        var line = "";
        var countLine = 0;
        var maxLineWidth = 0;
        for(var word of words){
            var testLine = line + word + " ";
            var testWidth = context.measureText(testLine).width;
            if (testWidth > maxWidth){
                if (line.length != 0){
                    line = line.substr(0, line.length - 1)
                    if (maxLineWidth < context.measureText(line).width) maxLineWidth = context.measureText(line).width;
                    txt += line + "\n";
                    line = word + " "
                }
                else{
                    if (maxLineWidth < testWidth) maxLineWidth = testWidth;
                    txt += word + '\n';
                    line = "";
                }
                countLine++;
            }
            else {
                line = testLine;
            }
        }
        line = line.trim();
        if(maxLineWidth < context.measureText(line).width) maxLineWidth = context.measureText(line).width;
        txt += line;
        this.multilineContent = txt;
        this.height = (countLine + 1) * lineHeight;
        this.width = maxLineWidth;
    }

}

class NodeFigure {
    constructor(id, x, y, size, color, shape, label, group) {
        this.id = id;
        this.shape = (shape == null) ? "Circle" : shape;
        this.color = (color == null) ? "black" : color;
        this.size = (size == null) ? randomFromTo(20, 100) : size;
        this.radius = this.size / 2;
        this.group = group;
        this.isSelected = false;

        this.position = { x: (x == null) ? randomFromTo(0, canvas.width) : x, y: (y == null) ? randomFromTo(0, canvas.height) : y };
        this.center = { x: this.position.x + this.radius, y: this.position.y + this.radius };
        this.label = (label == null) ? new NodeLabel() : label;
        this.koefSizeFontToFigure = parseFloat(this.label.font) / this.size;
    }

    draw() {
        context.strokeStyle = "black";
        if (this.isSelected) context.lineWidth = 5;
        else context.lineWidth = 1;
        context.stroke();
    }

    drag(mousePosition) {
        this.position = { x: mousePosition.x - this.radius, y: mousePosition.y - this.radius };
        this.center = { x: mousePosition.x, y: mousePosition.y }
    }

    dragCanvas() {
        this.radius = this.radius * scale;
        this.size = this.size * scale;
        this.position = { x: (this.position.x + translatePos.x) * scale, y: (this.position.y + translatePos.y) * scale};
        this.center = { x: this.position.x + this.radius, y: this.position.y + this.radius };

        for (var param of this.label.font.split(' ')){
            if (param.indexOf('px') != -1) {
                var sizeFont = this.size * this.koefSizeFontToFigure;
                sizeFont = (sizeFont < 5) ? 5 : ((sizeFont > 50) ? 50 : sizeFont);
                this.label.font = this.label.font.replace(param, sizeFont + "px");
                break;
            }
        }
    }

    addLabel(){
        context.font = this.label.font;
        context.fillStyle = this.label.color;
        var fontHeight = this.label.getFontHeight(this.label.font);
        this.label.getTextParameters(this.radius, fontHeight);
        var labelPosition = this.getLabelPosition();
        var words = this.label.multilineContent.split("\n");
        var y = labelPosition.y;
        for (var word of words){
            context.fillText(word, labelPosition.x, y);
            y += fontHeight;
        }
    }

    getLabelPosition() {
        var x = 0; var y = 0;
        switch (this.label.position) {
            case "TopLeft":
                x = this.center.x - this.radius - this.label.width - 5;
                y = this.center.y - this.radius - this.label.height - 5;
                break;
            case "TopCenter":
                x = this.center.x - this.label.width / 2;
                y = this.center.y - this.radius - this.label.height - 5;
                break;
            case "TopRight":
                x = this.center.x + this.radius + 5;
                y = this.center.y - this.radius - this.label.height -5;
                break;
            case "CenterLeft":
                x = this.center.x - this.radius - this.label.width - 5;
                y = this.center.y - this.label.height / 2 + 5;
                break;
            case "CenterRight":
                x = this.center.x + this.radius + 5;
                y = this.center.y - this.label.height / 2 + 5;
                break;
            case "BottomLeft":
                x = this.center.x - this.radius - this.label.width - 5;
                y = this.center.y + this.radius + 15;
                break;
            case "BottomCenter":
                x = this.center.x - this.label.width / 2;
                y = this.center.y + this.radius + 15;
                break;
            case "BottomRight":
                x = this.center.x + this.radius + 5;
                y = this.center.y + this.radius + 15;
                break;
        }
        return { x, y }
    }

}

class Circle extends NodeFigure {
    constructor(id, x, y, size, color, shape, label, group) {
        super(id, x, y, size, color, shape, label, group);
    }

    draw() {
        context.beginPath();
        context.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
        context.fillStyle = this.color;
        context.fill();
        super.draw();
        super.addLabel();
    }

    drag(mousePosition) {
        super.drag(mousePosition);
    }

    isSelect(mousePosition) {
        var distanceFromCenter = Math.sqrt(Math.pow(this.center.x - mousePosition.x, 2) + Math.pow(this.center.y - mousePosition.y, 2))
        if (distanceFromCenter <= this.radius)
            return true;
        return false;
    }
}

class Triangle extends NodeFigure {
    constructor(id, x, y, size, color, shape, label, group) {
        super(id, x, y, size, color, shape, label, group);
    }

    draw() {
        context.beginPath();
        context.moveTo(this.center.x, this.position.y);
        context.lineTo(this.position.x + this.size, this.position.y + this.size);
        context.lineTo(this.position.x, this.position.y + this.size);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();
        super.draw();
        super.addLabel();
    }

    drag(mousePosition) {
        super.drag(mousePosition);
    }

    isSelect(mousePosition) {
        return inTriangle(this.center.x, this.position.y, this.position.x + this.size, this.position.y + this.size, this.position.x, this.position.y + this.size, mousePosition)
    }
}

class Rectangle extends NodeFigure {
    constructor(id, x, y, size, color, shape, label, group) {
        super(id, x, y, size, color, shape, label, group);
    }

    draw() {
        context.beginPath()
        context.rect(this.position.x, this.position.y, this.size, this.size);
        context.fillStyle = this.color;
        context.fill();
        super.draw();
        super.addLabel();
    }

    drag(mousePosition) {
        super.drag(mousePosition);
    }

    isSelect(mousePosition) {
        return inRectangle(this.position.x, this.position.y, this.position.x + this.size, this.position.y + this.size, mousePosition)
    }
}

class Rhomb extends NodeFigure {
    constructor(id, x, y, size, color, shape, label, group) {
        super(id, x, y, size, color, shape, label, group);
    }

    draw() {
        context.beginPath();
        context.moveTo(this.center.x, this.position.y);
        context.lineTo(this.position.x + this.size, this.center.y);
        context.lineTo(this.center.x, this.position.y + this.size);
        context.lineTo(this.position.x, this.center.y);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();
        super.draw();
        super.addLabel();
    }

    drag(mousePosition) {
        super.drag(mousePosition);
    }

    isSelect(mousePosition) {
        return (inTriangle(this.position.x, this.center.y, this.center.x, this.position.y, this.position.x + this.size, this.center.y, mousePosition)
            || inTriangle(this.position.x, this.center.y, this.center.x, this.position.y + this.size, this.position.x + this.size, this.center.y, mousePosition))
    }
}

class Pentagon extends NodeFigure {
    constructor(id, x, y, size, color, shape, label, group) {
        super(id, x, y, size, color, shape, label, group);
    }

    draw() {
        context.beginPath();
        context.moveTo(this.center.x, this.position.y);
        context.lineTo(this.position.x + this.size, this.position.y + 1 * this.size / 3);
        context.lineTo(this.position.x + 5 * this.size / 6, this.position.y + this.size);
        context.lineTo(this.position.x + 1 * this.size / 6, this.position.y + this.size);
        context.lineTo(this.position.x, this.position.y + 1 * this.size / 3);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();
        super.draw();
        super.addLabel();
    }

    drag(mousePosition) {
        super.drag(mousePosition);
    }

    isSelect(mousePosition) {
        return (inTriangle(this.position.x, this.position.y + 1 * this.size / 3, this.center.x, this.position.y, this.position.x + this.size, this.position.y + 1 * this.size / 3, mousePosition))
            || (inTriangle(this.position.x, this.position.y + 1 * this.size / 3, this.position.x + 1 * this.size / 6, this.position.y + this.size, this.position.x + this.size, this.position.y + 1 * this.size / 3, mousePosition))
            || (inTriangle(this.position.x, this.position.y + 1 * this.size / 3, this.position.x + 5 * this.size / 6, this.position.y + this.size, this.position.x + this.size, this.position.y + 1 * this.size / 3, mousePosition))
    }
}

class Hexagon extends NodeFigure {
    constructor(id, x, y, size, color, shape, label, group) {
        super(id, x, y, size, color, shape, label, group);
    }

    draw() {
        context.beginPath();
        context.moveTo(this.position.x + 1.5 * this.size / 6, this.position.y);
        context.lineTo(this.position.x + 4.5 * this.size / 6, this.position.y);
        context.lineTo(this.position.x + this.size, this.center.y);
        context.lineTo(this.position.x + 4.5 * this.size / 6, this.position.y + this.size);
        context.lineTo(this.position.x + 1.5 * this.size / 6, this.position.y + this.size);
        context.lineTo(this.position.x, this.center.y);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();
        super.draw();
        super.addLabel();
    }

    drag(mousePosition) {
        super.drag(mousePosition);
    }

    isSelect(mousePosition) {
        return (inTriangle(this.position.x + 1.5 * this.size / 6, this.position.y, this.position.x + 1.5 * this.size / 6, this.position.y + this.size, this.position.x, this.center.y, mousePosition)
            || inTriangle(this.position.x + 4.5 * this.size / 6, this.position.y, this.position.x + 4.5 * this.size / 6, this.position.y + this.size, this.position.x + this.size, this.center.y, mousePosition)
            || inRectangle(this.position.x + 1.5 * this.size / 6, this.position.y, this.position.x + 4.5 * this.size / 6, this.position.y + this.size, mousePosition))
    }
}

class Plus extends NodeFigure {
    constructor(id, x, y, size, color, shape, label, group) {
        super(id, x, y, size, color, shape, label, group);
    }

    draw() {
        context.beginPath();
        context.moveTo(this.position.x + this.size / 3, this.position.y);
        context.lineTo(this.position.x + 2 * this.size / 3, this.position.y);
        context.lineTo(this.position.x + 2 * this.size / 3, this.position.y + this.size / 3);
        context.lineTo(this.position.x + this.size, this.position.y + this.size / 3);
        context.lineTo(this.position.x + this.size, this.position.y + 2 * this.size / 3);
        context.lineTo(this.position.x + 2 * this.size / 3, this.position.y + 2 * this.size / 3);
        context.lineTo(this.position.x + 2 * this.size / 3, this.position.y + this.size);
        context.lineTo(this.position.x + this.size / 3, this.position.y + this.size);
        context.lineTo(this.position.x + this.size / 3, this.position.y + 2 * this.size / 3);
        context.lineTo(this.position.x, this.position.y + 2 * this.size / 3);
        context.lineTo(this.position.x, this.position.y + this.size / 3);
        context.lineTo(this.position.x + this.size / 3, this.position.y + this.size / 3);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();
        super.draw();
        super.addLabel();
    }

    drag(mousePosition) {
        super.drag(mousePosition);
    }

    isSelect(mousePosition) {
        return (inRectangle(this.position.x + this.size / 3, this.position.y, this.position.x + 2 * this.size / 3, this.position.y + this.size, mousePosition)
            || inRectangle(this.position.x, this.position.y + this.size / 3, this.position.x + this.size, this.position.y + 2 * this.size / 3, mousePosition))
    }
}

const shapeMapping = {
    "Circle": Circle, "Triangle": Triangle, "Rectangle": Rectangle, "Rhomb": Rhomb, "Pentagon": Pentagon, "Hexagon": Hexagon, "Plus": Plus
}

class Figures {
    constructor() {
        this.figures = []
    }
    newNode(id, x, y, size, color, shape, label, group) {
        if (this.figures.find(f => f.id == id)) return;
        var figure = new shapeMapping[shape](id, x, y, size, color, shape, label, group);
        this.figures.push(figure)
        return figure;
    }
    newEdge(id, from, to, width, color, shape, arrow, label, group) {
        if (this.figures.find(f => f.id == id)) return;
        var direction = 1;
        if (this.figures.filter(figure => figure.constructor.name == "Edge").find(f => (f.to.id == from && f.from.id == to))) direction = -1;
        if (from == to) shape = "loop";
        var figure = new Edge(id, this.getFiguresById(from), this.getFiguresById(to), width, color, shape, arrow, label, direction, group);
        this.figures.push(figure);
        return figure;
    }
    get allFigures() {
        return this.figures;
    }
    get numberOfFigures() {
        return this.figures.length;
    }
    getFiguresById(id) {
        return this.figures.find(f => f.id == id);
    }
    draw() {
        //нужно сначала рисовать ребра, потом все остальное
        this.figures.filter(figure => figure.constructor.name.includes("Edge")).forEach(fig => fig.draw());
        this.figures.filter(figure => !figure.constructor.name.includes("Edge")).forEach(fig => fig.draw());
    }
    isSelectedFigure(mousePos) {
        var isSelectFigure = false;
        var figure;
        for (var i = this.figures.length - 1; i >= 0; i--) {
            figure = this.figures[i];
            if (!figure.constructor.name.includes("Edge") && figure.isSelect(mousePos)) isSelectFigure = true;
            if (isSelectFigure) break;
        }
        return {
            isSelectFigure: isSelectFigure,
            figure: figure
        };
    }
}

class EdgeLabel {
    constructor(content, position, color, font) {
        this.content = (content == null) ? "" : content;
        this.position = (position == null) ? "TopCenter" : position;
        this.color = (color == null) ? "black" : color;
        this.font = (font == null) ? "20px cursive" : font;
        this.lenght = 0;
    }
}

class EdgeArrow {
    constructor(arrow, color) {
        this.arrow = (arrow == null) ? "none" : arrow;
        this.color = (color == null) ? "black" : color;
        this.lenght = 0;
    }
}

class Edge {
    constructor(id, from, to, width, color, shape, arrow, label, direction, group) {
        this.id = id;
        this.from = from;
        this.to = to;
        this.width = (width == null) ? randomFromTo(3, 10) : width;
        this.color = (color == null) ? "grey" : color;
        this.shape = (shape == null) ? "straight" : shape;
        this.arrow = (arrow == null) ? new EdgeArrow() : arrow;
        this.label = (label == null) ? new EdgeLabel() : label;
        this.direction = (direction == null) ? 1 : direction;
        this.isSelected = false;
        this.group = group
        this.arrowLength = 30;
        this.curveRadius = 100;

    }

    dragCanvas() {
        this.width = this.width * scale;
        //доделать для стрелочек * scale
        this.arrowLength = this.arrowLength * scale;
        this.curveRadius = this.curveRadius * scale;

        var labelFont = this.label.font.split('px');
        this.label.font = (labelFont[0] * scale).toString() + 'px' + labelFont[1];  
    }

    draw() {
        switch (this.shape) {
            case "straight":
                context.beginPath();
                context.moveTo(this.from.center.x, this.from.center.y);
                context.lineTo(this.to.center.x, this.to.center.y);
                context.lineWidth = this.width;
                context.strokeStyle = this.color;
                context.stroke();
                this.addLabel();
                this.addArrow();
                break;
            case "curve":
                context.beginPath();
                var x1 = this.from.center.x; var y1 = this.from.center.y;
                var x2 = 0; var y2 = 0;
                var x3 = this.to.center.x; var y3 = this.to.center.y;
                context.moveTo(x1, y1);
                var controlPoint = this.controlPoint(x1, y1, x3, y3, this.direction)
                x2 = controlPoint.x;
                y2 = controlPoint.y;
                context.quadraticCurveTo(x2, y2, x3, y3);
                context.lineWidth = this.width;
                context.strokeStyle = this.color;
                context.stroke();
                this.addLabel();
                this.addArrow();
                break;
            case "loop":
                context.beginPath();
                var radius = this.from.radius;
                context.arc(this.from.position.x, this.from.position.y, radius, 0, 2 * Math.PI);
                context.strokeStyle = this.color;
                context.stroke();
                //super.draw();
                this.addLabel(radius);
            //this.addarrow();
        }
    }

    controlPoint(x1, y1, x3, y3, direction) {
        var x2 = 0; var y2 = 0;
        var cX = (x3 + x1) / 2;
        var cY = (y3 + y1) / 2;
        var koef = (y3 - y1) / (x3 - x1);
        if (koef == 0) {
            koef = 0.001;
        }
        koef = -1 / koef;
        var b = cY - koef * cX;
        var R = this.curveRadius;
        var a = 1 + koef ** 2;
        var d = 2 * koef * b - 2 * cX - 2 * koef * cY;
        var c = cX ** 2 + b ** 2 + cY ** 2 - 2 * b * cY - R ** 2;
        var D = d ** 2 - 4 * a * c;
        x2 = (d * (-1) + direction * Math.sqrt(D)) / (2 * a);
        y2 = koef * x2 + b;
    
        return { x: x2, y: y2 }
    }

    addLabel(radius){
        context.font = this.label.font;
        context.fillStyle = this.label.color;
        this.label.lenght = context.measureText(this.label.content).width;
        var labelPosition = this.getLabelPosition(radius);
        context.fillText(this.label.content, labelPosition.x, labelPosition.y);
    }
    
    getLabelPosition(radius) {
        var x = 0; var y = 0;
        switch (this.label.position) {
            case "TopCenterLable":
                if (this.shape == "loop") {
                    //console.log("TopCenter loop")
                    x = this.from.center.x - radius * 2 - this.label.lenght;
                    y = this.from.center.y - radius * 2 - (this.width + 5);
                } else if (this.shape == "curve") {
                    var controlPoint = this.controlPoint(this.from.center.x, this.from.center.y, this.to.center.x, this.to.center.y, this.direction);
                    x = controlPoint.x - this.label.lenght / 2;
                    y = controlPoint.y;
                }
                else {
                    //console.log("TopCenter no loop")
                    x = (this.from.center.x + this.to.center.x) / 2 - this.label.lenght / 2;
                    y = (this.from.center.y + this.to.center.y) / 2 - (this.width + 10);
                }
                break;
            case "BottomCenterLabel":
                if (this.shape == "loop") {
                    //console.log("TopCenter loop")
                    x = this.from.center.x - radius * 2 - this.label.lenght;
                    y = this.from.center.y - radius * 2 - (this.width + 5);
                } else if (this.shape == "curve") {
                    var controlPoint = this.controlPointCurve(this.from.center.x, this.from.center.y, this.to.center.x, this.to.center.y, this.direction);
                    x = controlPoint.x - this.label.lenght / 2;
                    y = controlPoint.y;
                } else {
                    //console.log("TopCenter no loop")
                    x = (this.from.center.x + this.to.center.x) / 2 - this.label.lenght / 2;
                    y = (this.from.center.y + this.to.center.y) / 2 + this.width + 10;
                }
                break;
        }
        return { x, y }
    }

    addArrow(){
        context.fillStyle = this.arrow.color;
        this.getArrowPosition();
        context.lineWidth = 2;
        context.strokeStyle = "black";
        context.fillStyle = this.color;
    }

    pointOnCurve(p1, p2, p3, t) {
        var p = (1 - t) ** 2 * p1 + 2 * (1 - t) * t * p2 + t ** 2 * p3;
        return p;
    }

    straightLength(x1, y1, x2, y2) {
        var l = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        return l;
    }

    getArrowPosition() {
        var x1 = 0; var y1 = 0;
        var x2 = 0; var y2 = 0;
        var x3 = 0; var y3 = 0;
        var x4 = 0; var y4 = 0;
        var step1 = 0; var step2 = 0;
        if (this.to.radius) {
            var step1 = this.to.radius;
        }
        else {
            step1 = Math.sqrt(this.to.size ** 2 + this.to.size ** 2)
        }
        step2 = step1 + this.arrowLength;

        switch (this.shape) {
            case "straight":
                var dx = this.from.center.x - this.to.center.x;
                var dy = this.from.center.y - this.to.center.y;
                var r = Math.sqrt(dx ** 2 + dy ** 2);

                break;
            case "curve":
                //Доделать
                var controlPoint = this.controlPoint(this.from.center.x, this.from.center.y, this.to.center.x, this.to.center.y, this.direction);
                var l = this.straightLength(this.from.center.x, this.from.center.y, this.to.center.x, this.to.center.y);
                //console.log(l)
                var t = 0;
                if (l > 500) {
                    t = 0.95;
                } else if (l <= 500 && l >= 460) {
                    t = 0.9 - (1 - l / 500)

                } else if (l < 460 && l >= 250) {
                    t = 0.82
                } else {
                    t = 0.8
                }
                var cpx = this.pointOnCurve(this.from.center.x, controlPoint.x, this.to.center.x, t);
                var cpy = this.pointOnCurve(this.from.center.y, controlPoint.y, this.to.center.y, t);
                var dx = cpx - this.to.center.x;
                var dy = cpy - this.to.center.y;
                var r = Math.sqrt(dx ** 2 + dy ** 2);
                break;
        }

        switch (this.arrow.arrow) {
            case "none":
                break;
            case "triangle":
                x1 = dx * (step1 / r) + this.to.center.x;
                y1 = dy * (step1 / r) + this.to.center.y;
                x2 = dx * (step2 / r) + this.to.center.x;
                y2 = dy * (step2 / r) + this.to.center.y;
                var alpha = Math.PI / 4;
                x3 = -Math.sin(alpha) * (y2 - y1) + Math.cos(alpha) * (x2 - x1) + x1;
                y3 = Math.cos(alpha) * (y2 - y1) + Math.sin(alpha) * (x2 - x1) + y1;
                alpha = -Math.PI / 4;
                x4 = -Math.sin(alpha) * (y2 - y1) + Math.cos(alpha) * (x2 - x1) + x1;
                y4 = Math.cos(alpha) * (y2 - y1) + Math.sin(alpha) * (x2 - x1) + y1;
                context.beginPath();
                context.moveTo(x1, y1);
                context.lineTo(x3, y3);
                context.lineTo(x4, y4);
                context.closePath();
                context.lineWidth = 2;
                context.strokeStyle = "black";
                context.fillStyle = this.color;
                context.fill()
                break;
            case "angle":
                x1 = dx * (step1 / r) + this.to.center.x;
                y1 = dy * (step1 / r) + this.to.center.y;
                x2 = dx * (step2 / r) + this.to.center.x;
                y2 = dy * (step2 / r) + this.to.center.y;
                var alpha = Math.PI / 4;
                x3 = -Math.sin(alpha) * (y2 - y1) + Math.cos(alpha) * (x2 - x1) + x1;
                y3 = Math.cos(alpha) * (y2 - y1) + Math.sin(alpha) * (x2 - x1) + y1;
                alpha = -Math.PI / 4;
                x4 = -Math.sin(alpha) * (y2 - y1) + Math.cos(alpha) * (x2 - x1) + x1;
                y4 = Math.cos(alpha) * (y2 - y1) + Math.sin(alpha) * (x2 - x1) + y1;
                context.beginPath();
                context.moveTo(x1, y1);
                context.lineTo(x3, y3);
                context.moveTo(x1, y1);
                context.lineTo(x4, y4);
                context.lineWidth = this.width;
                context.strokeStyle = this.color;
                context.stroke();
                break;
            case "vee":
                var x5 = 0; var y5 = 0
                x1 = dx * (step1 / r) + this.to.center.x;
                y1 = dy * (step1 / r) + this.to.center.y;
                step2 = step1 + this.arrowLength;
                x2 = dx * (step2 / r) + this.to.center.x;
                y2 = dy * (step2 / r) + this.to.center.y;
                step2 = step1 + this.arrowLength / 2;
                x5 = dx * (step2 / r) + this.to.center.x;
                y5 = dy * (step2 / r) + this.to.center.y;
                var alpha = Math.PI / 6;
                x3 = -Math.sin(alpha) * (y2 - y1) + Math.cos(alpha) * (x2 - x1) + x1;
                y3 = Math.cos(alpha) * (y2 - y1) + Math.sin(alpha) * (x2 - x1) + y1;
                alpha = -Math.PI / 6;
                x4 = -Math.sin(alpha) * (y2 - y1) + Math.cos(alpha) * (x2 - x1) + x1;
                y4 = Math.cos(alpha) * (y2 - y1) + Math.sin(alpha) * (x2 - x1) + y1;
                context.beginPath();
                context.moveTo(x1, y1);
                context.lineTo(x3, y3);
                context.lineTo(x5, y5);
                context.lineTo(x4, y4);
                context.closePath();
                context.lineWidth = 2;
                context.strokeStyle = "black";
                context.fillStyle = this.color;
                context.fill()
                break;
        }
    }
}



function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function inTriangle(x1, y1, x2, y2, x3, y3, mousePosition) {
    var a = (x1 - mousePosition.x) * (y2 - y1) - (x2 - x1) * (y1 - mousePosition.y);
    var b = (x2 - mousePosition.x) * (y3 - y2) - (x3 - x2) * (y2 - mousePosition.y);
    var c = (x3 - mousePosition.x) * (y1 - y3) - (x1 - x3) * (y3 - mousePosition.y);

    return ((a >= 0 && b >= 0 && c >= 0) || (a <= 0 && b <= 0 && c <= 0))

}

function inRectangle(xLT, yLT, xRB, yRB, mousePosition) {
    return ((xLT <= mousePosition.x && mousePosition.x <= xRB) && (yLT <= mousePosition.y && mousePosition.y <= yRB))
}