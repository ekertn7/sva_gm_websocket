const PORT = 1422

preload = document.getElementById('preloader');
canvas = document.querySelector("#myCanvas");
context = canvas.getContext("2d");
elements = new Figures();
nodes = new Set();
edges = new Set();


var previousSelectedFigure;
var isDraggingFigure = false;
var isDraggingCanvas = false;
var scale = 1.0;
var translatePos = {x: 0, y: 0};
var lastPosition = {x: canvas.width / 2, y: canvas.height / 2};

canvas.onmousedown = canvasClick;
canvas.onmousemove = dragFigureAndCanvas;
canvas.onmouseup = stopDragging;
canvas.onwheel = changeScale;
window.addEventListener('resize', resizeCanvas, false);

resizeCanvas();
// createElements(example);

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

//Функции для создания и отрисовки элементов графа


//Создание элементов графа
function createElements(example) {
    example.nodes.forEach(node => {
        //
        let label = new NodeLabel(node.label, example.layout.positionLabelNode, example.layout.colorLabelNode, example.layout.fontSize + "px" + example.layout.fontFamilies);
        //
        elements.newNode(node.id, node.position.x, node.position.y, node.size, node.color, node.shape, label, node.group)
    });
    example.edges.forEach(edge => {
        //
        let label = new EdgeLabel(edge.label, example.layout.positionLabelEdge, example.layout.colorLabelEdge, example.layout.fontSize + "px" + example.layout.fontFamilies);
        //
        let arrow = new EdgeArrow(edge.arrow, edge.color)
        //
        elements.newEdge(edge.id, edge.from, edge.to, edge.width, edge.color, edge.shape, arrow, label, edge.group)
    });
    drawCanvas();
};

function changeStyleElements(){
    let counter = elements.figures.length;
    for (let count = 0; count < counter; count++){
        let label;
        let elem = elements.figures.shift();
        if (elem.group.includes("Node")){
            if (!document.getElementById(elem.group + '_txt').checked) label = new NodeLabel();
            //
            else label = new NodeLabel(elem.label.content, document.getElementById(elem.group + '_position').value, document.getElementById(elem.group + '_colorLabel').value, document.getElementById(elem.group + '_sizeLabel').value + 'px' + example.layout.fontFamilies);
            //
            elements.newNode(elem.id, elem.position.x, elem.position.y, elem.size, document.getElementById(elem.group + '_color').value, document.getElementById(elem.group + '_shape').value, label, elem.group);
        }
        else {
            if (!document.getElementById(elem.group + '_txt').checked) label = new EdgeLabel();
            //
            else label = new EdgeLabel(elem.label.content, document.getElementById(elem.group + '_position').value, document.getElementById(elem.group + '_colorLabel').value, document.getElementById(elem.group + '_sizeLabel').value + 'px' + example.layout.fontFamilies);
            //
            let arrow = new EdgeArrow(document.getElementById(elem.group + '_arrow').value, document.getElementById(elem.group + '_color').value);
            //
            elements.newEdge(elem.id, elem.from.id, elem.to.id, elem.width, document.getElementById(elem.group + '_color').value, document.getElementById(elem.group + '_shape').value, arrow, label, elem.group);
        }
    }
    drawCanvas();
}

//отрисовка всех элементов
function drawCanvas(){
    context.clearRect(0, 0, canvas.width * 10, canvas.height * 10)
    elements.figures.forEach(elem => elem.dragCanvas());
    elements.draw();
    translatePos = {x:0, y:0};
    scale = 1;
}

//установка выбранного элемента
function setSelect(id){
    previousSelectedFigure = elements.figures.find(el => el.id == id);
    previousSelectedFigure.isSelected = true;
    drawCanvas();
}


//Функции для взаимодействия с канвас


//событие при изменение канвы
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawCanvas();
}

//событие при нажатие на канву или фигуру
function canvasClick(e){ 
    scale = 1;
    var selectFigure = elements.isSelectedFigure(getMousePos(e));
    if (previousSelectedFigure != null) previousSelectedFigure.isSelected = false;

    if (selectFigure.isSelectFigure){
        previousSelectedFigure = selectFigure.figure;
        previousSelectedFigure.isSelected = true;
        isDraggingFigure = true;
        isDraggingCanvas = false;
        lastPosition = previousSelectedFigure.position;
        } 
    else {
        previousSelectedFigure = null;
        isDraggingFigure = false;
        isDraggingCanvas = true;
        lastPosition = getMousePos(e);
    }
    drawCanvas();
    return;
}

//событие при движении канвы или фигуры
function dragFigureAndCanvas(e){
    e.preventDefault();
    if (isDraggingFigure && previousSelectedFigure != null){
        previousSelectedFigure.drag(getMousePos(e));
        drawCanvas();
    } else {
        if (isDraggingCanvas){
            var mousePos = getMousePos(e);
            translatePos.x = mousePos.x - lastPosition.x;
            translatePos.y = mousePos.y - lastPosition.y;
            lastPosition = mousePos;
            drawCanvas();
        }
    }
}

//событие при остановке движения канвы или фигуры
function stopDragging() {
    if (previousSelectedFigure != null && previousSelectedFigure.isSelected
        && previousSelectedFigure.position.x == lastPosition.x && previousSelectedFigure.position.y == lastPosition.y){
        if (document.getElementById('rightSidebar').classList == 'sidebar') setVis('rightSidebar');
        let p = document.getElementById('info');
        // let infoLegend = example.nodes.find(el => el.id == previousSelectedFigure.id).infoLegend;
        let str = '';
        for (var key in infoLegend){
            str += key + ' ' + infoLegend[key] + '<br>'; 
        }
        let link = '<a href="javascript:void(0);" onclick="setSelect(\'' + previousSelectedFigure.id + '\')"; id="my_node">';
        p.innerHTML = "Узел " + link + previousSelectedFigure.label.content + "</a><br>";
        p.innerHTML += str;
    }
    isDraggingFigure = false;
    isDraggingCanvas = false;
    translatePos = {x: 0, y: 0};
}

//событие при изменение масштаба канвы
function changeScale(e){
    if (e.deltaY < 0) scale = 1.2;
    else scale = 0.8;
    drawCanvas();

    var mousePos = getMousePos(e);
    let coords = getMinMaxCoordinates();
    let centerGraph = {x: (coords.maxX + coords.minX) / 2, y: (coords.maxY + coords.minY) / 2};

    translatePos.x = mousePos.x - centerGraph.x;
    translatePos.y = mousePos.y - centerGraph.y;
    drawCanvas();
}

//получение координат курсора
function getMousePos(e){
    return {
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop
    };
}


document.addEventListener("DOMContentLoaded", function() {
    
    const uploadInputSeparator = document.querySelector("#upload_input_separator");
    const uploadInputFile = document.querySelector("#upload_input_file");
    const uploadButtonSend = document.querySelector("#upload_button_send");
    const uploadButtonTemp = document.querySelector("#upload_button_temp");

    const uploadWaiting = document.querySelector("#upload_waiting");
    const uploadSelected = document.querySelector("#upload_selected");
    const uploadLoading = document.querySelector("#upload_loading");
    const uploadH1 = document.querySelector("#upload_h1");
    const uploadH2 = document.querySelector("#upload_h2");
    const uploadH3 = document.querySelector("#upload_h3");
    const uploadSep = document.querySelector("#upload_sep");
    const upload = document.querySelector("#upload");
    const columns = document.querySelector("#columns");


    const columnsButtonSend = document.querySelector("#columns_button_send");

    const sidebarBlockExitExit = document.querySelector("#sidebarBlockExitExit");
    const sidebarBlockAlgorithmsApply = document.querySelector("#sidebarBlockAlgorithmsApply");
    const sidebarBlockMetricsApply = document.querySelector("#sidebarBlockMetricsApply");
    

    let websocketClient = new WebSocket('ws://localhost:' + PORT);
    // websocketClient.binaryType = "blob";

    uploadInputFile.onchange = () => {
        uploadH2.innerText = 'Файл выбран: ' + uploadInputFile.files.item(0).name;
        uploadH3.innerText = 'файл можно заменить, кликнув по данному окну повторно';

        uploadWaiting.classList.add('invisible');
        uploadSelected.classList.remove('invisible');
        uploadLoading.classList.add('invisible');
        uploadButtonSend.classList.remove('invisible');
        uploadButtonTemp.classList.add('invisible');

        uploadInputFile.parentElement.classList.remove('uploadInputWaiting');
        uploadInputFile.parentElement.classList.add('uploadInputSelected');
        uploadInputFile.parentElement.classList.remove('uploadInputLoading');
        document.querySelector(".uploadSep").classList.remove('invisible');
    };

    columnsButtonSend.onclick = () => {
        columns.classList.add('invisible');
    };    

    // Событие при загрузке сервера
    websocketClient.onopen = () => {
        console.log("Client connected")
        // columnsButtonSend.onclick = () => {
        //     const message = String('{"query_type": "test"}');
        //     websocketClient.send(message);
        // };

        sidebarBlockAlgorithmsApply.onclick = () => {
            const algorithmShortestPath = document.querySelector("#algorithmShortestPath");
            const algorithmSearchStronglyConnectedComponentsKosaraju = document.querySelector("#algorithmSearchStronglyConnectedComponentsKosaraju");
            const algorithmSearchStronglyConnectedComponentsTarjan = document.querySelector("#algorithmSearchStronglyConnectedComponentsTarjan");
            const algorithmGetSimpleLoops = document.querySelector("#algorithmGetSimpleLoops");
            const algorithmAdjMatrix = document.querySelector("#algorithmAdjMatrix");
            const algorithmKruskal = document.querySelector("#algorithmKruskal");
            const algorithmPrim = document.querySelector("#algorithmPrim");
            const algorithmMaximalMatching = document.querySelector("#algorithmMaximalMatching");
            var metricsData = [];
            if (algorithmShortestPath.checked) {
                metricsData.push('algorithmShortestPath');
            };
            if (algorithmSearchStronglyConnectedComponentsKosaraju.checked) {
                metricsData.push('algorithmSearchStronglyConnectedComponentsKosaraju');
            };
            if (algorithmSearchStronglyConnectedComponentsTarjan.checked) {
                metricsData.push('algorithmSearchStronglyConnectedComponentsTarjan');
            };
            if (algorithmGetSimpleLoops.checked) {
                metricsData.push('algorithmGetSimpleLoops');
            };
            if (algorithmAdjMatrix.checked) {
                metricsData.push('algorithmAdjMatrix');
            };
            if (algorithmKruskal.checked) {
                metricsData.push('algorithmKruskal');
            };
            if (algorithmPrim.checked) {
                metricsData.push('algorithmPrim');
            };
            if (algorithmMaximalMatching.checked) {
                metricsData.push('algorithmMaximalMatching');
            };
            const message = String('{"query_type": "algorithms", ' +
                                    '"message": "' + metricsData + '"}');
            // console.log(message);
            websocketClient.send(message);
        };

        sidebarBlockMetricsApply.onclick = () => {
            const metricPageRank = document.querySelector("#metricPageRank");
            const metricDegreeСentrality = document.querySelector("#metricDegreeСentrality");
            var metricsData = [];
            if (metricPageRank.checked) {
                metricsData.push('metricPageRank');
            };
            if (metricDegreeСentrality.checked) {
                metricsData.push('metricDegreeСentrality');
            };
            const message = String('{"query_type": "metrics", ' +
                                    '"message": "' + metricsData + '"}');
            // console.log(message);
            websocketClient.send(message);
        };

        
        sidebarBlockExitExit.onclick = () => {
            const message = String('{"query_type": "exit"}');
            // console.log(message);
            websocketClient.send(message);
        };

        uploadButtonSend.onclick = () => {
            uploadWaiting.classList.add('invisible');
            uploadSelected.classList.add('invisible');
            uploadLoading.classList.remove('invisible');
            uploadInputFile.classList.add('invisible');
            uploadSep.classList.add('invisible');

            uploadH1.innerText = 'Ожидайте загрузки файла';
            uploadH2.innerText = 'Файл загружается';
            uploadH3.innerText = 'вы будете автоматически перенаправлены на следующую страницу';
            uploadButtonSend.classList.add('invisible');
            
            uploadInputFile.parentElement.classList.remove('uploadInputWaiting');
            uploadInputFile.parentElement.classList.remove('uploadInputSelected');
            uploadInputFile.parentElement.classList.add('uploadInputLoading');
            
            const file = uploadInputFile.files.item(0);
            const reader = new FileReader();

            reader.readAsBinaryString(file);
            reader.onload = function() {
                const data = window.btoa(reader.result);
                const filename = file.name;
                const separator = uploadInputSeparator.value;
                const message = String('{"query_type": "file", ' +
                                        '"message": "' + data + '", ' +
                                        '"file_name": "' + filename + '", ' +
                                        '"separator": "' + separator + '"}');
                websocketClient.send(message);

                
                // console.log(message);
            };
            reader.onerror = function() {
                console.log(reader.error);
            };
        };

        
    };

    // Событие при получении сообщения от сервера
    websocketClient.onmessage = (event) => {
        // console.log(event.data);
        // console.log(typeof(event.data));
        const recieve = JSON.parse(event.data);
        if (recieve.query_type === "columns") {
            // console.log(recieve.message);
            upload.classList.add('invisible');
        };

        if (recieve.query_type === "graph") {
            // console.log(recieve.message);
            upload.classList.add('invisible');
            const example = recieve.message;
            createElements(example);
        };
    };

    // Событие при закрытии соединения
    // // websocketClient.onclose = (event) => {
    // //     event.code === 1000
    // //     event.reason === "Работа закончена"
    // //     event.wasClean === true
    // // };
}, false)