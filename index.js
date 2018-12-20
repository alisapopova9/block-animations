addListeners();

function addListeners() {

    const fadeInBlock = document.getElementById('fadeInBlock');
    let fadeIn = animaster().fadeIn(fadeInBlock, 2000);
    document.getElementById('fadeInPlay')
        .addEventListener('click', function() {
            fadeIn.execute();
        });
    document.getElementById('fadeInStop')
        .addEventListener('click', function() {
           fadeIn.stop();
        });

    const fadeOutBlock = document.getElementById('fadeOutBlock');
    let fadeOut = animaster().fadeOut(fadeOutBlock, 2000);
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function() {
            fadeOut.execute();
        });
    document.getElementById('fadeOutStop')
        .addEventListener('click', function() {
           fadeOut.stop();
        });

    const moveBlock = document.getElementById('moveBlock');
    let move = animaster().move(moveBlock, 2000, {x: 100, y: 10});
    document.getElementById('movePlay')
        .addEventListener('click', function() {
            move.execute();
        });
    document.getElementById('moveStop')
        .addEventListener('click', function() {
            move.stop();
        });

    const scaleBlock = document.getElementById('scaleBlock');
    let scale = animaster().scale(scaleBlock, 1000, 1.25);
    document.getElementById('scalePlay')
        .addEventListener('click', function() {
            scale.execute();
        });
    document.getElementById('scaleStop')
        .addEventListener('click', function() {
            scale.stop();
        });

    const moveAndHideBlock = document.getElementById('moveAndHideBlock');
    let moveAndHide = animaster().moveAndHide(moveAndHideBlock, 2000);
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function() {
            moveAndHide.execute();
        });
    document.getElementById('moveAndHideStop')
        .addEventListener('click', function() {
           moveAndHide.stop();
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 2000);
        });

    const hbBlock = document.getElementById('heartBeatingBlock');
    let heartBeating =  animaster().heartBeating(hbBlock);
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
        function resetFadeIn(element) {
            element.style.transitionDuration = null;
            element.classList.remove('show');
            element.classList.add('hide');
        }
        return {
            execute: function() {
                element.style.transitionDuration = `${duration}ms`;
                element.classList.remove('hide');
                element.classList.add('show');
            },
            stop: function() {
                resetFadeIn(element);
            },
        }
    }

    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    function move(element, duration, translation) {
        function resetMove(element) {
            element.style.transitionDuration = null;
            element.style.transform = null;
        }
        return {
          execute: function() {
              element.style.transitionDuration = `${duration}ms`;
              element.style.transform = getTransform(translation, null);
          },
          stop: function() {
            resetMove(element);
          },
        };
    }

    function scale(element, duration, ratio) {
        function resetScale(element) {
            element.style.transform = null;
            element.style.transitionDuration = null;
        }
        return {
            execute: function() {
                element.style.transitionDuration = `${duration}ms`;
                element.style.transform = getTransform(null, ratio);
            },
            stop: function() {
                resetScale(element);
            },
        };
    }

    function moveAndHide(element, duration) {
        let timerID;
        return {
          execute: function() {
              move(element, duration * 0.4, {x: 100, y: 20}).execute();
              timerID = setTimeout(() => fadeOut(element, duration * 0.6).execute(), duration * 0.4);
          },
          stop: function() {
              clearTimeout(timerID);
              move(element).stop();
              fadeOut(element).stop();
          },
        };
    }

    function fadeOut(element, duration) {
        function resetFadeOut(element) {
            element.style.transitionDuration = null;
            element.classList.remove('hide');
            element.classList.add('show');
        }
        return {
            execute: function () {
                element.style.transitionDuration = `${duration}ms`;
                element.classList.remove('show');
                element.classList.add('hide');
            },
            stop: function () {
                resetFadeOut(element);
            },
        };
    }
    function showAndHide(element, duration) {
        fadeIn(element, duration * 1/3).execute();
        setTimeout(() => fadeOut(element, duration * 1/3).execute(), duration * 2/3);
    }

    function heartBeating(element) {
        let timerID;
        return {
            execute: function() {
                const tick = () => {
                    scale(element, 500, 1.4).execute();
                    setTimeout(() => scale(element, 500, 1.0).execute(), 500);
                    timerID = setTimeout(tick, 1000);
                };
                    timerID = setTimeout(tick, 0);
            },

            stop: function() {
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
