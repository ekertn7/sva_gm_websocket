// preload = document.getElementById('preloader');
// canvas = document.querySelector("#myCanvas");
// context = canvas.getContext("2d");
// elements = new Figures();
// nodes = new Set();
// edges = new Set();


// var previousSelectedFigure;
// var isDraggingFigure = false;
// var isDraggingCanvas = false;
// var scale = 1.0;
// var translatePos = {x: 0, y: 0};
// var lastPosition = {x: canvas.width / 2, y: canvas.height / 2};

// canvas.onmousedown = canvasClick;
// canvas.onmousemove = dragFigureAndCanvas;
// canvas.onmouseup = stopDragging;
// canvas.onwheel = changeScale;
// window.addEventListener('resize', resizeCanvas, false);

// resizeCanvas();
// // createElements(example);

// const sidebarButtonFilter = document.querySelector("#sidebarButtonFilter");

// sidebarButtonFilter.onclick = () => {
//     let trPos; let scale;
//     do {
//         setGraphAtCenter(getMinMaxCoordinates())
//         trPos = translatePos;
//         drawCanvas();

//         setGraphAtNormalSize(getMinMaxCoordinates());
//         scale = scale;
//         drawCanvas();
//     } while (trPos.x != 0 || trPos.y != 0 || scale != 1)
// }

// //Функции для создания и отрисовки элементов графа


// //Создание элементов графа
// function createElements(example) {
//     example.nodes.forEach(node => {
//         //
//         let label = new NodeLabel(node.label, example.layout.positionLabelNode, example.layout.colorLabelNode, example.layout.fontSize + "px" + example.layout.fontFamilies);
//         //
//         elements.newNode(node.id, node.position.x, node.position.y, node.size, node.color, node.shape, label, node.group)
//     });
//     example.edges.forEach(edge => {
//         //
//         let label = new EdgeLabel(edge.label, example.layout.positionLabelEdge, example.layout.colorLabelEdge, example.layout.fontSize + "px" + example.layout.fontFamilies);
//         //
//         let arrow = new EdgeArrow(edge.arrow, edge.color)
//         //
//         elements.newEdge(edge.id, edge.from, edge.to, edge.width, edge.color, edge.shape, arrow, label, edge.group)
//     });
//     drawCanvas();
// };

// function changeStyleElements(){
//     let counter = elements.figures.length;
//     for (let count = 0; count < counter; count++){
//         let label;
//         let elem = elements.figures.shift();
//         if (elem.group.includes("Node")){
//             if (!document.getElementById(elem.group + '_txt').checked) label = new NodeLabel();
//             //
//             else label = new NodeLabel(elem.label.content, document.getElementById(elem.group + '_position').value, document.getElementById(elem.group + '_colorLabel').value, document.getElementById(elem.group + '_sizeLabel').value + 'px' + example.layout.fontFamilies);
//             //
//             elements.newNode(elem.id, elem.position.x, elem.position.y, elem.size, document.getElementById(elem.group + '_color').value, document.getElementById(elem.group + '_shape').value, label, elem.group);
//         }
//         else {
//             if (!document.getElementById(elem.group + '_txt').checked) label = new EdgeLabel();
//             //
//             else label = new EdgeLabel(elem.label.content, document.getElementById(elem.group + '_position').value, document.getElementById(elem.group + '_colorLabel').value, document.getElementById(elem.group + '_sizeLabel').value + 'px' + example.layout.fontFamilies);
//             //
//             let arrow = new EdgeArrow(document.getElementById(elem.group + '_arrow').value, document.getElementById(elem.group + '_color').value);
//             //
//             elements.newEdge(elem.id, elem.from.id, elem.to.id, elem.width, document.getElementById(elem.group + '_color').value, document.getElementById(elem.group + '_shape').value, arrow, label, elem.group);
//         }
//     }
//     drawCanvas();
// }

// //отрисовка всех элементов
// function drawCanvas(){
//     context.clearRect(0, 0, canvas.width * 10, canvas.height * 10)
//     elements.figures.forEach(elem => elem.dragCanvas());
//     elements.draw();
//     translatePos = {x:0, y:0};
//     scale = 1;
// }

// //установка выбранного элемента
// function setSelect(id){
//     previousSelectedFigure = elements.figures.find(el => el.id == id);
//     previousSelectedFigure.isSelected = true;
//     drawCanvas();
// }


// //Функции для взаимодействия с канвас


// //событие при изменение канвы
// function resizeCanvas() {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     drawCanvas();
// }

// //событие при нажатие на канву или фигуру
// function canvasClick(e){ 
//     scale = 1;
//     var selectFigure = elements.isSelectedFigure(getMousePos(e));
//     if (previousSelectedFigure != null) previousSelectedFigure.isSelected = false;

//     if (selectFigure.isSelectFigure){
//         previousSelectedFigure = selectFigure.figure;
//         previousSelectedFigure.isSelected = true;
//         isDraggingFigure = true;
//         isDraggingCanvas = false;
//         lastPosition = previousSelectedFigure.position;
//         } 
//     else {
//         previousSelectedFigure = null;
//         isDraggingFigure = false;
//         isDraggingCanvas = true;
//         lastPosition = getMousePos(e);
//     }
//     drawCanvas();
//     return;
// }

// //событие при движении канвы или фигуры
// function dragFigureAndCanvas(e){
//     e.preventDefault();
//     if (isDraggingFigure && previousSelectedFigure != null){
//         previousSelectedFigure.drag(getMousePos(e));
//         drawCanvas();
//     } else {
//         if (isDraggingCanvas){
//             var mousePos = getMousePos(e);
//             translatePos.x = mousePos.x - lastPosition.x;
//             translatePos.y = mousePos.y - lastPosition.y;
//             lastPosition = mousePos;
//             drawCanvas();
//         }
//     }
// }

// //событие при остановке движения канвы или фигуры
// function stopDragging() {
//     if (previousSelectedFigure != null && previousSelectedFigure.isSelected
//         && previousSelectedFigure.position.x == lastPosition.x && previousSelectedFigure.position.y == lastPosition.y){
//         if (document.getElementById('rightSidebar').classList == 'sidebar') setVis('rightSidebar');
//         let p = document.getElementById('info');
//         // let infoLegend = example.nodes.find(el => el.id == previousSelectedFigure.id).infoLegend;
//         let str = '';
//         for (var key in infoLegend){
//             str += key + ' ' + infoLegend[key] + '<br>'; 
//         }
//         let link = '<a href="javascript:void(0);" onclick="setSelect(\'' + previousSelectedFigure.id + '\')"; id="my_node">';
//         p.innerHTML = "Узел " + link + previousSelectedFigure.label.content + "</a><br>";
//         p.innerHTML += str;
//     }
//     isDraggingFigure = false;
//     isDraggingCanvas = false;
//     translatePos = {x: 0, y: 0};
// }

// //событие при изменение масштаба канвы
// function changeScale(e){
//     if (e.deltaY < 0) scale = 1.2;
//     else scale = 0.8;
//     drawCanvas();

//     var mousePos = getMousePos(e);
//     let coords = getMinMaxCoordinates();
//     let centerGraph = {x: (coords.maxX + coords.minX) / 2, y: (coords.maxY + coords.minY) / 2};

//     translatePos.x = mousePos.x - centerGraph.x;
//     translatePos.y = mousePos.y - centerGraph.y;
//     drawCanvas();
// }

// //получение координат курсора
// function getMousePos(e){
//     return {
//         x: e.clientX - canvas.offsetLeft,
//         y: e.clientY - canvas.offsetTop
//     };
// }
