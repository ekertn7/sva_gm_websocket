document.addEventListener("DOMContentLoaded", function() {

    // const sidebarButtonFilter = document.querySelector("#sidebarButtonFilter");
    // const sidebarBlockFilter = document.querySelector("#sidebarBlockFilter");
    const sidebarButtonAlgorithms = document.querySelector("#sidebarButtonAlgorithms");
    const sidebarBlockAlgorithms = document.querySelector("#sidebarBlockAlgorithms");
    const sidebarButtonMetrics = document.querySelector("#sidebarButtonMetrics");
    const sidebarBlockMetrics = document.querySelector("#sidebarBlockMetrics");
    const sidebarButtonExit = document.querySelector("#sidebarButtonExit");
    const sidebarBlockExit = document.querySelector("#sidebarBlockExit");
    // ---
    // sidebarButtonFilter.onclick = () => {
    //     if (sidebarBlockFilter.classList.contains('sidebarBlockInvisible')) {
    //         // закрываем все остальное
    //         sidebarBlockFilter.classList.add('sidebarBlockInvisible');
    //         sidebarButtonFilter.querySelector('img').src = "images/sidebarButtonFilter.svg";
    //         sidebarButtonFilter.classList.remove('sidebarButtonActive');
    //         sidebarButtonFilter.querySelector('p').classList.remove('invisible');
    //         sidebarBlockAlgorithms.classList.add('sidebarBlockInvisible');
    //         sidebarButtonAlgorithms.querySelector('img').src = "images/sidebarButtonAlgorithms.svg";
    //         sidebarButtonAlgorithms.classList.remove('sidebarButtonActive');
    //         sidebarButtonAlgorithms.querySelector('p').classList.remove('invisible');
    //         sidebarBlockMetrics.classList.add('sidebarBlockInvisible');
    //         sidebarButtonMetrics.querySelector('img').src = "images/sidebarButtonMetrics.svg";
    //         sidebarButtonMetrics.classList.remove('sidebarButtonActive');
    //         sidebarButtonMetrics.querySelector('p').classList.remove('invisible');
    //         sidebarBlockExit.classList.add('sidebarBlockInvisible');
    //         sidebarButtonExit.querySelector('img').src = "images/sidebarButtonExit.svg";
    //         sidebarButtonExit.classList.remove('sidebarButtonActive');
    //         sidebarButtonExit.querySelector('p').classList.remove('invisible');
    //         // открываем текущее
    //         // setZoom();
    //         // sidebarBlockFilter.classList.remove('sidebarBlockInvisible');
    //         // sidebarButtonFilter.querySelector('img').src = "images/sidebarButtonHide.svg";
    //         // sidebarButtonFilter.classList.add('sidebarButtonActive');
    //         // sidebarButtonFilter.querySelector('p').classList.add('invisible');
    //     } else {
    //         // закрываем текущее
    //         // setZoom();
    //         // sidebarBlockFilter.classList.add('sidebarBlockInvisible');
    //         // sidebarButtonFilter.querySelector('img').src = "images/sidebarButtonFilter.svg";
    //         // sidebarButtonFilter.classList.remove('sidebarButtonActive');
    //         // sidebarButtonFilter.querySelector('p').classList.remove('invisible');
    //     };
    // };
    // ---
    sidebarButtonAlgorithms.onclick = () => {
        if (sidebarBlockAlgorithms.classList.contains('sidebarBlockInvisible')) {
            // закрываем все остальное
            // sidebarBlockFilter.classList.add('sidebarBlockInvisible');
            // sidebarButtonFilter.querySelector('img').src = "images/sidebarButtonFilter.svg";
            // sidebarButtonFilter.classList.remove('sidebarButtonActive');
            // sidebarButtonFilter.querySelector('p').classList.remove('invisible');
            sidebarBlockAlgorithms.classList.add('sidebarBlockInvisible');
            sidebarButtonAlgorithms.querySelector('img').src = "images/sidebarButtonAlgorithms.svg";
            sidebarButtonAlgorithms.classList.remove('sidebarButtonActive');
            sidebarButtonAlgorithms.querySelector('p').classList.remove('invisible');
            sidebarBlockMetrics.classList.add('sidebarBlockInvisible');
            sidebarButtonMetrics.querySelector('img').src = "images/sidebarButtonMetrics.svg";
            sidebarButtonMetrics.classList.remove('sidebarButtonActive');
            sidebarButtonMetrics.querySelector('p').classList.remove('invisible');
            sidebarBlockExit.classList.add('sidebarBlockInvisible');
            sidebarButtonExit.querySelector('img').src = "images/sidebarButtonExit.svg";
            sidebarButtonExit.classList.remove('sidebarButtonActive');
            sidebarButtonExit.querySelector('p').classList.remove('invisible');
            // открываем текущее
            sidebarBlockAlgorithms.classList.remove('sidebarBlockInvisible');
            sidebarButtonAlgorithms.querySelector('img').src = "images/sidebarButtonHide.svg";
            sidebarButtonAlgorithms.classList.add('sidebarButtonActive');
            sidebarButtonAlgorithms.querySelector('p').classList.add('invisible');
        } else {
            // закрываем текущее
            sidebarBlockAlgorithms.classList.add('sidebarBlockInvisible');
            sidebarButtonAlgorithms.querySelector('img').src = "images/sidebarButtonAlgorithms.svg";
            sidebarButtonAlgorithms.classList.remove('sidebarButtonActive');
            sidebarButtonAlgorithms.querySelector('p').classList.remove('invisible');
        };
    };
    // ---
    sidebarButtonMetrics.onclick = () => {
        if (sidebarBlockMetrics.classList.contains('sidebarBlockInvisible')) {
            // закрываем все остальное
            // sidebarBlockFilter.classList.add('sidebarBlockInvisible');
            // sidebarButtonFilter.querySelector('img').src = "images/sidebarButtonFilter.svg";
            // sidebarButtonFilter.classList.remove('sidebarButtonActive');
            // sidebarButtonFilter.querySelector('p').classList.remove('invisible');
            sidebarBlockAlgorithms.classList.add('sidebarBlockInvisible');
            sidebarButtonAlgorithms.querySelector('img').src = "images/sidebarButtonAlgorithms.svg";
            sidebarButtonAlgorithms.classList.remove('sidebarButtonActive');
            sidebarButtonAlgorithms.querySelector('p').classList.remove('invisible');
            sidebarBlockMetrics.classList.add('sidebarBlockInvisible');
            sidebarButtonMetrics.querySelector('img').src = "images/sidebarButtonMetrics.svg";
            sidebarButtonMetrics.classList.remove('sidebarButtonActive');
            sidebarButtonMetrics.querySelector('p').classList.remove('invisible');
            sidebarBlockExit.classList.add('sidebarBlockInvisible');
            sidebarButtonExit.querySelector('img').src = "images/sidebarButtonExit.svg";
            sidebarButtonExit.classList.remove('sidebarButtonActive');
            sidebarButtonExit.querySelector('p').classList.remove('invisible');
            // открываем текущее
            sidebarBlockMetrics.classList.remove('sidebarBlockInvisible');
            sidebarButtonMetrics.querySelector('img').src = "images/sidebarButtonHide.svg";
            sidebarButtonMetrics.classList.add('sidebarButtonActive');
            sidebarButtonMetrics.querySelector('p').classList.add('invisible');
        } else {
            // закрываем текущее
            sidebarBlockMetrics.classList.add('sidebarBlockInvisible');
            sidebarButtonMetrics.querySelector('img').src = "images/sidebarButtonMetrics.svg";
            sidebarButtonMetrics.classList.remove('sidebarButtonActive');
            sidebarButtonMetrics.querySelector('p').classList.remove('invisible');
        };
    };
    // ---
    sidebarButtonExit.onclick = () => {
        if (sidebarBlockExit.classList.contains('sidebarBlockInvisible')) {
            // закрываем все остальное
            // sidebarBlockFilter.classList.add('sidebarBlockInvisible');
            // sidebarButtonFilter.querySelector('img').src = "images/sidebarButtonFilter.svg";
            // sidebarButtonFilter.classList.remove('sidebarButtonActive');
            // sidebarButtonFilter.querySelector('p').classList.remove('invisible');
            sidebarBlockAlgorithms.classList.add('sidebarBlockInvisible');
            sidebarButtonAlgorithms.querySelector('img').src = "images/sidebarButtonAlgorithms.svg";
            sidebarButtonAlgorithms.classList.remove('sidebarButtonActive');
            sidebarButtonAlgorithms.querySelector('p').classList.remove('invisible');
            sidebarBlockMetrics.classList.add('sidebarBlockInvisible');
            sidebarButtonMetrics.querySelector('img').src = "images/sidebarButtonMetrics.svg";
            sidebarButtonMetrics.classList.remove('sidebarButtonActive');
            sidebarButtonMetrics.querySelector('p').classList.remove('invisible');
            sidebarBlockExit.classList.add('sidebarBlockInvisible');
            sidebarButtonExit.querySelector('img').src = "images/sidebarButtonExit.svg";
            sidebarButtonExit.classList.remove('sidebarButtonActive');
            sidebarButtonExit.querySelector('p').classList.remove('invisible');
            // открываем текущее
            sidebarBlockExit.classList.remove('sidebarBlockInvisible');
            sidebarButtonExit.querySelector('img').src = "images/sidebarButtonHide.svg";
            sidebarButtonExit.classList.add('sidebarButtonActive');
            sidebarButtonExit.querySelector('p').classList.add('invisible');
        } else {
            // закрываем текущее
            sidebarBlockExit.classList.add('sidebarBlockInvisible');
            sidebarButtonExit.querySelector('img').src = "images/sidebarButtonExit.svg";
            sidebarButtonExit.classList.remove('sidebarButtonActive');
            sidebarButtonExit.querySelector('p').classList.remove('invisible');
        };
    };
    // ---
    const sidebarBlockExitStay = document.querySelector("#sidebarBlockExitStay");
    sidebarBlockExitStay.onclick = () => {
        sidebarBlockExit.classList.add('sidebarBlockInvisible');
        sidebarButtonExit.querySelector('img').src = "images/sidebarButtonExit.svg";
        sidebarButtonExit.classList.remove('sidebarButtonActive');
    };
}, false);