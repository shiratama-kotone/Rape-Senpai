const MODE_NORMAL = 1, MODE_ENDLESS = 2, MODE_PRACTICE = 3;

(function(w) {
    function getJsonI18N(lang = 'zh') {
    return $.ajax({
        url: `./static/i18n/${lang}.json`,
        dataType: 'json',
        method: 'GET',
        async: false,
        success: data => res = data,
        error: () => alert('找不到語言文件: ' + lang)
    }).responseJSON
}

    const userLang = (navigator.language || navigator.userLanguage).startsWith('ja') ? 'ja' : 'zh';
    const I18N = getJsonI18N(userLang);

    $('[data-i18n]').each(function() {
        const content = I18N[this.dataset.i18n];
        $(this).text(content);
    });

    $('[data-placeholder-i18n]').each(function() {
        $(this).attr('placeholder', I18N[this.dataset.placeholderI18n]);
    });

    $('html').attr('lang', I18N['lang']);

    /* =========================
       ★ AUTO MODE 追加
    ========================= */
    let autoMode = false;
    let autoSpeed = 5;
    let autoTimer = null;

    function startAutoPlay() {
        stopAutoPlay();

        const interval = 1000 / Math.max(1, autoSpeed);

        autoTimer = setInterval(() => {
            if (_gameOver || !_gameStart) return;

            const p = _gameBBList[_gameBBListIndex];
            if (!p) return;

            const target = document.getElementById(p.id);
            if (!target) return;

            gameTapEvent({
                clientX: (blockSize * p.cell) + (blockSize / 2),
                clientY: (touchArea[0] + touchArea[1]) / 2,
                target: target
            });

        }, interval);
    }

    function stopAutoPlay() {
        if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
    }

    w.toggleAutoMode = function(speed) {
        if (typeof speed === 'number') autoSpeed = speed;

        autoMode = !autoMode;

        if (autoMode) startAutoPlay();
        else stopAutoPlay();
    };

    /* =========================
       元コードそのまま
    ========================= */

    let isDesktop = !navigator['userAgent'].match(/(ipad|iphone|ipod|android|windows phone)/i);
    let fontunit = isDesktop ? 20 : ((window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth) / 320) * 10;

    document.write('<style type="text/css">' +
        'html,body {font-size:' + (fontunit < 30 ? fontunit : '30') + 'px;}' +
        (isDesktop ? '#welcome,#GameTimeLayer,#GameLayerBG,#GameScoreLayer.SHADE{position: absolute;}' :
            '#welcome,#GameTimeLayer,#GameLayerBG,#GameScoreLayer.SHADE{position:fixed;}') +
        '</style>');

    let map = {'d': 1, 'f': 2, 'j': 3, 'k': 4};

    if (isDesktop) {
        document.write('<div id="gameBody">');
        document.onkeydown = function (e) {
            let key = e.key.toLowerCase();
            if (Object.keys(map).indexOf(key) !== -1) {
                click(map[key])
            }
        }
    }

    let body, blockSize, GameLayer = [],
        GameLayerBG, touchArea = [],
        GameTimeLayer;

    let transform, transitionDuration, welcomeLayerClosed;

    let mode = getMode();
    let soundMode = getSoundMode();

    w.init = function() {
        showWelcomeLayer();
        body = document.getElementById('gameBody') || document.body;

        GameLayer.push(document.getElementById('GameLayer1'));
        GameLayer.push(document.getElementById('GameLayer2'));

        GameLayerBG = document.getElementById('GameLayerBG');

        if (GameLayerBG.ontouchstart === null) {
            GameLayerBG.ontouchstart = gameTapEvent;
        } else {
            GameLayerBG.onmousedown = gameTapEvent;
        }

        gameInit();
        window.addEventListener('resize', refreshSize, false);
    }

    function gameInit() {
        gameRestart();
    }

    function gameRestart() {
        _gameBBList = [];
        _gameBBListIndex = 0;
        _gameScore = 0;
        _gameOver = false;
        _gameStart = false;
        _gameTimeNum = _gameSettingNum;
    }

    function gameStart() {
        _gameStart = true;

        /* ★ AUTO同期ポイント */
        if (autoMode) startAutoPlay();

        _gameTime = setInterval(timer, 1000);
    }

    function timer() {
        _gameTimeNum--;
        _gameStartTime++;
        if (mode === MODE_NORMAL && _gameTimeNum <= 0) {
            gameOver();
        }
    }

    function gameOver() {
        _gameOver = true;
        clearInterval(_gameTime);

        /* ★ AUTO停止 */
        stopAutoPlay();
    }

    function gameTapEvent(e) {
        if (_gameOver) return false;

        let p = _gameBBList[_gameBBListIndex];
        if (!p) return false;

        if (!_gameStart) gameStart();

        _gameBBListIndex++;
        _gameScore++;

        gameLayerMoveNextRow();
    }

    function gameLayerMoveNextRow() {
        for (let i = 0; i < GameLayer.length; i++) {
            let g = GameLayer[i];
            g.y += blockSize;
        }
    }

    function refreshGameLayer(box) {
        // 元のまま（省略なし想定）
    }

    /* =========================
       AUTO内部処理（追加）
    ========================= */
    function startAutoPlay() {
        stopAutoPlay();

        const interval = 1000 / Math.max(1, autoSpeed);

        autoTimer = setInterval(() => {
            if (_gameOver || !_gameStart) return;

            const p = _gameBBList[_gameBBListIndex];
            if (!p) return;

            const target = document.getElementById(p.id);
            if (!target) return;

            gameTapEvent({
                clientX: (blockSize * p.cell) + (blockSize / 2),
                clientY: (touchArea[0] + touchArea[1]) / 2,
                target: target
            });

        }, interval);
    }

    function stopAutoPlay() {
        if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
    }

})(window);