addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 2000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 2000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 2000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 2000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 2000);
        });

    const block = document.getElementById('heartBeatingBlock');
    let heartBeating =  animaster().heartBeating(block);
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            heartBeating.execute();
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
           heartBeating.stop();
        });
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}

function animaster() {
    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }
    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }
    function scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }
    function moveAndHide(element, duration) {
        move(element, duration * 0.4, {x: 100, y: 20});
        setTimeout(() => fadeOut(element, duration * 0.6), duration * 0.4);
    }
    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }
    function showAndHide(element, duration) {
        fadeIn(element, duration * 1/3);
        setTimeout(() => fadeOut(element, duration * 1/3), duration * 2/3);
    }

    function heartBeating(element) {
        let timerID;
        return {
            execute: function() {
                const tick = () => {
                    scale(element, 500, 1.4);
                    setTimeout(() => scale(element, 500, 1.0), 500);
                    timerID = setTimeout(tick, 1000);
                    console.log(timerID);
                };
                    timerID = setTimeout(tick, 0);
            },

            stop: function() {
                console.log(timerID);
                clearTimeout(timerID);
            },
        }
    }

    return {
        fadeIn,
        move,
        scale,
        fadeOut,
        moveAndHide,
        showAndHide,
        heartBeating,
    };
}
