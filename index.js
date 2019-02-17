addListeners();

function addListeners() {
    const customAnimation = animaster()
        .addMove(1000, {x: 40, y: 40})
        .addScale(800, 1.3)
        .addMove(200, {x: 80, y: 0})
        .addScale(800, 1)
        .addMove(200, {x: 40, y: -40})
        .addScale(800, 0.7)
        .addMove(200, {x: 0, y: 0})
        .addScale(800, 1)
        .buildHandler();
    const customAnimationBlock = document.getElementById('customAnimationBlock')
        .addEventListener('click', customAnimation);

    const customAnimationNew = animaster()
        .addMove(1000, {x: 40, y: 40})
        .addScale(800, 1.3)
        .addMove(200, {x: 80, y: 0})
        .addScale(800, 1)
        .addMove(200, {x: 40, y: -40})
        .addScale(800, 0.7)
        .addMove(200, {x: 0, y: 0})
        .addScale(800, 1)
        .buildHandler();
    const customAnimationBlock1 = document.getElementById('customAnimationBlock1')
        .addEventListener('click', customAnimationNew);

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

    let mahContext;
    const moveAndHideBlock = document.getElementById('moveAndHideBlock');
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function() {
            mahContext = animaster().moveAndHide(moveAndHideBlock, 2000);
        });
    document.getElementById('moveAndHideStop')
        .addEventListener('click', function() {
           mahContext.reset("moveAndHide");
        });

    const showAndHideBlock = document.getElementById('showAndHideBlock');
    let sahContext;
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            sahContext = animaster().showAndHide(showAndHideBlock, 2000);
        });
    document.getElementById('showAndHideStop')
        .addEventListener('click', function () {
           sahContext.reset("showAndHide");
        });

    const hbBlock = document.getElementById('heartBeatingBlock');
    let hbContext;
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            hbContext = animaster().heartBeating(hbBlock);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            hbContext.stop();
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
    let _steps = [], _elementState = [], _handlerContext = null;

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
        let _timerID, _wasStopped = false;
        let stepsTmp = _steps;
        function executeStep() {
            let currentStep;
            if (stepsTmp.length && !_wasStopped) {
                currentStep = stepsTmp.shift();
                if (isCycled) {
                    stepsTmp.push(currentStep);
                }
                executeMethod(element, currentStep);
                _timerID = setTimeout(() => executeStep(), currentStep.duration);
            }
            else return;
        }

        _timerID = setTimeout(() => executeStep(), 0);
        
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
            clearTimeout(_timerID);
            resetMove();
            resetFadeOut();
        }
        function resetShowAndHide() {
            clearTimeout(_timerID);
            resetFadeIn();
        }

        function reset(from) {
            _wasStopped = true;
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
            _wasStopped = true;
            clearTimeout(_timerID);
            return this;
        }
        return {
            reset,
            stop,
        }
    }

    function heartBeating(element) {
        return this
            .addScale(500, 1.4)
            .addScale(500, 1.0)
            .play(element, true);
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
        return this
            .addFadeIn(duration * 1/3)
            .addDelay(duration * 2/3)
            .addFadeOut(duration * 1/3)
            .play(element);
    }

    function moveAndHide(element, duration) {
        return this
            .addMove(duration * 0.6, {x: 100, y: 20})
            .addFadeOut(duration * 0.4)
            .play(element);
    }
    
    function buildHandler() {
        let _timerID;
        let stepsTmp = _steps;
        function executeStep() {
            let currentStep;
            if (_handlerContext === null)
                _handlerContext = this;
            if (stepsTmp.length) {
                currentStep = stepsTmp.shift();
                executeMethod(_handlerContext, currentStep);
                _timerID = setTimeout(() => executeStep(), currentStep.duration);
            }
            else return;
        }

        return executeStep;
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
        buildHandler,
    };
}
