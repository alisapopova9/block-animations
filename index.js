addListeners();

function addListeners() {

    const fadeInBlock = document.getElementById('fadeInBlock');
    document.getElementById('fadeInPlay')
        .addEventListener('click', function() {
            animaster().fadeIn(fadeInBlock, 2000);
        });
    // document.getElementById('fadeInStop')
    //     .addEventListener('click', function() {
    //        fadeIn.stop();
    //     });

    const fadeOutBlock = document.getElementById('fadeOutBlock');
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function() {
            animaster().fadeOut(fadeOutBlock, 2000);
        });
    // document.getElementById('fadeOutStop')
    //     .addEventListener('click', function() {
    //        fadeOut.stop();
    //     });

    const moveBlock = document.getElementById('moveBlock');
    document.getElementById('movePlay')
        .addEventListener('click', function() {
            animaster().move(moveBlock, 1000, {x: 100, y: 0});
        });
    // document.getElementById('moveStop')
    //     .addEventListener('click', function() {
    //         move.stop();
    //     });

    const scaleBlock = document.getElementById('scaleBlock');
    document.getElementById('scalePlay')
        .addEventListener('click', function() {
            animaster().scale(scaleBlock, 1000, 1.3);
        });
    // document.getElementById('scaleStop')
    //     .addEventListener('click', function() {
    //         scale.stop();
    //     });

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
    let _steps = [], _elementState = [];

    function addMove(duration, translation) {
        _steps.push({
           commandName: 'move',
           duration: duration,
           translation: translation,
        });
        return this;
    }

    function addScale(duration, ratio) {
        _steps.push({
           commandName: 'scale',
           duration: duration,
           ratio: ratio,
        });
        return this;
    }

    function addFadeIn(duration) {
       _steps.push({
            commandName: 'fadeIn',
            duration: duration,
        });
        return this;
    }

    function addFadeOut(duration) {
        _steps.push({
            commandName: 'fadeOut',
            duration: duration,
        });
        return this;
    }

    function executeMethod(element, step) {
        switch (step.commandName) {
            case 'move':
                element.style.transitionDuration = `${step.duration}ms`;
                let ratio;
                ratio = _elementState.length ? _elementState.shift().prevRatio : null;
                element.style.transform = getTransform(step.translation, ratio);
                _elementState.push({
                    prevTranslation: step.translation,
                });
                break;
            case 'scale':
                element.style.transitionDuration = `${step.duration}ms`;
                let translation;
                translation = _elementState.length ? _elementState.shift().prevTranslation : null;
                element.style.transform = getTransform(translation, step.ratio);
                _elementState.push({
                    prevRatio: step.ratio,
                });
                break;
            case 'fadeIn':
                element.style.transitionDuration = `${step.duration}ms`;
                element.classList.remove('hide');
                element.classList.add('show');
                break;
            case 'fadeOut':
                element.style.transitionDuration = `${step.duration}ms`;
                element.classList.remove('show');
                element.classList.add('hide');
                break;
        }
    }

    function play(element) {
        function executeStep() {
            let stepsTmp = _steps;
            let currentStep;
            if (stepsTmp.length) {
                currentStep = stepsTmp.shift();
                executeMethod(element, currentStep);
                setTimeout(() => executeStep(), currentStep.duration);
            }
            else return;
        }

        setTimeout(() => executeStep(), 0);
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

    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    function move(element, duration, translation) {
        this.addMove(duration, translation).play(element);
    }

    function scale(element, duration, ratio) {
        this.addScale(duration, ratio).play(element);
    }

    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function fadeIn(element, duration) {
        this.addFadeIn(duration).play(element);
    }

    function fadeOut(element, duration) {
        this.addFadeOut(duration).play(element);
    }

    return {
        fadeIn,
        move,
        scale,
        fadeOut,
        moveAndHide,
        showAndHide,
        heartBeating,
        addMove,
        addScale,
        addFadeIn,
        addFadeOut,
        play,
    };
}

const customAnimation = animaster()
    .addMove(1000, {x: 40, y: 40})
    .addScale(800, 1.3)
    .addMove(200, {x: 80, y: 0})
    .addScale(800, 1)
    .addMove(200, {x: 40, y: -40})
    .addScale(800, 0.7)
    .addMove(200, {x: 0, y: 0})
    .addScale(800, 1);
customAnimation.play(document.getElementById('customAnimationBlock'));
// customAnimation.play(document.getElementById('customAnimationBlock1'));
