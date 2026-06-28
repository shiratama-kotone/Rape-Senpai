const MODE_NORMAL = 1, MODE_ENDLESS = 2, MODE_PRACTICE = 3;

(function(w) {

    /* =========================
       I18N
    ========================= */
    function getJsonI18N(lang = 'zh') {
        return $.ajax({
            url: `./static/i18n/${lang}.json`,
            dataType: 'json',
            method: 'GET',
            async: false
        }).responseJSON;
    }

    const userLang = (navigator.language || navigator.userLanguage).startsWith('ja') ? 'ja' : 'zh';
    const I18N = getJsonI18N(userLang);

    $('[data-i18n]').each(function() {
        $(this).text(I18N[this.dataset.i18n]);
    });

    $('[data-placeholder-i18n]').each(function() {
        $(this).attr('placeholder', I18N[this.dataset.placeholderI18n]);
    });

    $('html').attr('lang', I18N['lang']);

    /* =========================
       AUTO MODE ★追加
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
        if (autoTimer) clearInterval(autoTimer);
        autoTimer = null;
    }

    w.toggleAutoMode = function(speed) {
        if (typeof speed === 'number') autoSpeed = speed;

        autoMode = !autoMode;

        if (autoMode) startAutoPlay();
        else stopAutoPlay();
    };

    /* =========================
       UI / Size
    ========================= */

    let isDesktop = !navigator.userAgent.match(/(ipad|iphone|ipod|android|windows phone)/i);
    let fontunit = isDesktop ? 20 : ((window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth) / 320) * 10;

    document.write('<style>' +
        'html,body{font-size:' + (fontunit < 30 ? fontunit : 30) + 'px;}' +
        '</style>');

    let map = {'d':1,'f':2,'j':3,'k':4};

    if (isDesktop) {
        document.write('<div id="gameBody"></div>');
        document.onkeydown = function(e) {
            let key = e.key.toLowerCase();
            if (map[key]) click(map[key]);
        };
    }

    let body, blockSize, GameLayer = [],
        GameLayerBG, touchArea = [],
        GameTimeLayer;

    let _gameBBList = [],
        _gameBBListIndex = 0,
        _gameOver = false,
        _gameStart = false,
        _gameScore = 0,
        _gameSettingNum = 20,
        _gameTime, _gameTimeNum;

    w.init = function() {
        body = document.getElementById('gameBody') || document.body;

        GameLayer.push(document.getElementById('GameLayer1'));
        GameLayer.push(document.getElementById('GameLayer2'));

        GameLayerBG = document.getElementById('GameLayerBG');
        GameTimeLayer = document.getElementById('GameTimeLayer');

        if (GameLayerBG.ontouchstart === null) {
            GameLayerBG.ontouchstart = gameTapEvent;
        } else {
            GameLayerBG.onmousedown = gameTapEvent;
        }

        gameInit();
    };

    function gameInit() {
        gameRestart();
    }

    function gameRestart() {
        _gameBBList = [];
        _gameBBListIndex = 0;
        _gameScore = 0;
        _gameOver = false;
        _gameStart = false;

        refreshGameLayer(GameLayer[0]);
        refreshGameLayer(GameLayer[1], 1);
    }

    function gameStart() {
        _gameStart = true;
        if (autoMode) startAutoPlay(); // ★AUTO同期
        _gameTime = setInterval(timer, 1000);
    }

    function timer() {
        _gameTimeNum--;
    }

    function gameTapEvent(e) {
        if (_gameOver) return;

        let p = _gameBBList[_gameBBListIndex];
        if (!p) return;

        if (!_gameStart) gameStart();

        _gameBBListIndex++;
        _gameScore++;

        gameLayerMoveNextRow();
    }

    function gameLayerMoveNextRow() {
        // simplified
    }

    function refreshGameLayer(box) {
        // simplified (元ロジックそのまま想定)
    }

    /* =========================
       AUTO UI
    ========================= */
    w.setAutoSpeed = function(v) {
        autoSpeed = v;
        if (autoMode) startAutoPlay();
    };

    w.getAutoStatus = function() {
        return { autoMode, autoSpeed };
    };

})(window);