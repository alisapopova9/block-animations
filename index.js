addListeners();

function addListeners() {
    const customAnimationBlock = document.getElementById('customAnimationBlock');
    document.getElementById('customAnimationPlay')
        .addEventListener('click', function() {
            customAnimation.play(customAnimationBlock);
        });

    const customAnimationBlock1 = document.getElementById('customAnimationBlock1');
    document.getElementById('customAnimationPlay1')
        .addEventListener('click', function() {
            customAnimationNew.play(customAnimationBlock1);
        });

    const fadeInBlock = document.getElementById('fadeInBlock');
    document.getElementById('fadeInPlay')
        .addEventListener('click', function() {
            animaster().fadeIn(fadeInBlock, 2000);
        });
    document.getElementById('fadeInStop')
        .addEventListener('click', function() {
           animaster().play(fadeInBlock).reset('fadeIn');
        });

    const fadeOutBlock = document.getElementById('fadeOutBlock');
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function() {
            animaster().fadeOut(fadeOutBlock, 2000);
        });
    document.getElementById('fadeOutStop')
        .addEventListener('click', function() {
           animaster().play(fadeOutBlock).reset('fadeOut');
        });

    const moveBlock = document.getElementById('moveBlock');
    document.getElementById('movePlay')
        .addEventListener('click', function() {
            animaster().move(moveBlock, 1000, {x: 100, y: 0});
        });
    document.getElementById('moveStop')
        .addEventListener('click', function() {
            animaster().play(moveBlock).reset('move');
        });

    const scaleBlock = document.getElementById('scaleBlock');
    document.getElementById('scalePlay')
        .addEventListener('click', function() {
            animaster().scale(scaleBlock, 1000, 1.3);
        });
    document.getElementById('scaleStop')
        .addEventListener('click', function() {
            animaster().play(scaleBlock).reset('scale');
        });

    const moveAndHideBlock = document.getElementById('moveAndHideBlock');
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function() {
            animaster().moveAndHide(moveAndHideBlock, 2000);
        });
    document.getElementById('moveAndHideStop')
        .addEventListener('click', function() {
           animaster().play(moveAndHideBlock).reset('moveAndHide');
        });

    const showAndHideBlock = document.getElementById('showAndHideBlock');
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            animaster().showAndHide(showAndHideBlock, 2000);
        });
    document.getElementById('showAndHideStop')
        .addEventListener('click', function () {
           animaster().play(showAndHideBlock).reset('showAndHide');
        });

    const hbBlock = document.getElementById('heartBeatingBlock');
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            animaster().heartBeating(hbBlock);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
           animaster().play(hbBlock).stop();
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
    let _steps = [], _elementState = [], _timerID, _wasStopped = false;

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

    function addDelay(duration) {
        _steps.push({
            commandName: 'delay',
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
            case 'delay':
                element.style.transitionDuration = `${step.duration}`;
                break;
        }
    }

    function play(element, isCycled) {
        function executeStep() {
            // let stepsTmp = _steps;
            let currentStep;
            if (_steps.length && !this._wasStopped) {
                currentStep = _steps.shift();
                if (isCycled) {
                    _steps.push(currentStep);
                }
                executeMethod(element, currentStep);
                this._timerID = setTimeout(() => executeStep(), currentStep.duration);
                console.log(this._timerID);
            }
            else return;
        }
        function resetTransitionDuration() {
            element.style.transitionDuration = `0ms`;
        }
        function resetFadeOut() {
            element.classList.remove('hide');
            element.classList.add('show');
        }
        function resetFadeIn() {
            element.classList.remove('show');
            element.classList.add('hide');
        }
        function resetScale() {
            element.style.transitionDuration = `0ms`;
            element.style.transform = getTransform(null, 1.0);
        }
        function resetMove() {
            element.style.transitionDuration = `0ms`;
            element.style.transform = getTransform({x: 0, y: 0}, null);
        }
        function clearSteps() {
            _steps = [];
        }
        function resetMoveAndHide() {
            clearTimeout(this._timerID);
            clearSteps();
            resetMove();
            resetFadeOut();
        }
        function resetShowAndHide() {
            clearTimeout(this._timerID);
            clearSteps();
            resetFadeIn();
        }

        executeStep();
        // _timerID = setTimeout(() => executeStep(), 0);

        function reset(from) {
            this._wasStopped = true;
            resetTransitionDuration();
            switch (from) {
                case 'fadeOut':
                    resetFadeOut();
                    break;
                case 'fadeIn':
                    resetFadeIn();
                    break;
                case 'scale':
                    resetScale();
                    break;
                case 'move':
                    resetMove();
                    break;
                case 'moveAndHide':
                    resetMoveAndHide();
                    break;
                case 'showAndHide':
                    resetShowAndHide();
                    break;
            }
            return this;
        }
        function stop() {
            this._wasStopped = true;
            clearTimeout(this._timerID);
            clearSteps();
            return this;
        }
        return {
            reset,
            stop
        }
    }

    function heartBeating(element) {
        this.addScale(500, 1.4)
            .addScale(500, 1.0).play(element, true);
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

    function showAndHide(element, duration) {
        this.addFadeIn(duration * 1/3)
            .addDelay(duration * 2/3)
            .addFadeOut(duration * 1/3).play(element);
    }

    function moveAndHide(element, duration) {
        this.addMove(duration * 0.6, {x: 100, y: 20})
            .addFadeOut(duration * 0.4).play(element);
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
        addDelay,
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
const customAnimationNew = animaster()
    .addMove(1000, {x: 40, y: 40})
    .addScale(800, 1.3)
    .addMove(200, {x: 80, y: 0})
    .addScale(800, 1)
    .addMove(200, {x: 40, y: -40})
    .addScale(800, 0.7)
    .addMove(200, {x: 0, y: 0})
    .addScale(800, 1);
// customAnimation.play(document.getElementById('customAnimationBlock'));
// customAnimationNew.play(document.getElementById('customAnimationBlock1'));
