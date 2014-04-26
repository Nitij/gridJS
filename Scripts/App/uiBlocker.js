;
(function (w) {
    var $divUIBlocker = {},
        $divSourceCode = {};

    //function to show the source code while blocking the reset of the ui
    function showCode(sampleCode) {
        $divUIBlocker = (!$divUIBlocker.length) ? $('#divUIBlocker') : $divUIBlocker;
        $divSourceCode = (!$divSourceCode.length) ? $('#divSourceCode') : $divSourceCode;
        var $htmlCode = $divSourceCode.find('#htmlCode'),
            $jsCode = $divSourceCode.find('#jsCode'),
            $divCodePopup = $divSourceCode.find('#divCodePopup');

        $htmlCode.load(sampleCode.html, function () {
            SyntaxHighlighter.highlight();            
        });

        $jsCode.load(sampleCode.js, function () {
            SyntaxHighlighter.highlight();
        });        

        $divUIBlocker.fadeIn()
            .promise()
            .done(function () {
                $divSourceCode.fadeIn()
                .promise()
                .done(function () {
                    $divCodePopup.scrollTop(0);
                });
            });       
    }

    //function to hide source code popup
    function hideCode() {
        $divUIBlocker = (!$divUIBlocker.length) ? $('#divUIBlocker') : $divUIBlocker;
        $divSourceCode = (!$divSourceCode.length) ? $('#divSourceCode') : $divSourceCode;
        $divSourceCode.fadeOut()
            .promise()
            .done(function () {
                $divUIBlocker.fadeOut();
            });
    }

    //attach to the namespace
    App.Helper['ShowCode'] = showCode;
    App.Helper['HideCode'] = hideCode;

})(window);