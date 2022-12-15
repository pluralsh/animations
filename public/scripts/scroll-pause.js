(function () {
    var DEBOUNCE_TIME = 300;
    var iframes = document.querySelectorAll("iframe[data-animation-frame]");
    var iframeWindows = [];
    iframes.forEach(function (iframe) {
        // Once the iframe is done loading, assign its window object to the variable we prepared earlier
        iframe.addEventListener("load", function () {
            iframeWindows.push(iframe.contentWindow);
        });
    });
    var timeout;
    var listener = function () {
        if (typeof timeout !== "number") {
            iframeWindows.forEach(function (win) {
                win.postMessage("pause", "*");
            });
        }
        else {
            window.clearTimeout(timeout);
        }
        timeout = window.setTimeout(function () {
            iframeWindows.forEach(function (win) {
                timeout = undefined;
                win.postMessage("play", "*");
            });
        }, DEBOUNCE_TIME);
    };
    var scrollListener = window.addEventListener("scroll", listener);
    var resizeListener = window.addEventListener("resize", listener);
})();
