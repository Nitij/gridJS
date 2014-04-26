;
(function () {
    
    function initializeGrid() {
        var customEditableGrid = new GridJS({
            gridId: 'customEditableGrid',
            dataSource: OfficeRooms,
            cellPadding: 8,
            dataRowColors: ["white", "#E0E0E0"]
        })
        .addCustomFunction('getEditDisplay', getEditDisplay)
        .addCustomFunction('getDoneDisplay', getDoneDisplay)
        .addCustomFunction('getDivDoneDisplay', getDivDoneDisplay);

        function getEditDisplay(data, rowIndex) {
            if (data[rowIndex].edit) return 'inline'
            else return 'none';
        }

        function getDoneDisplay(data, rowIndex) {
            if (!data[rowIndex].edit) return 'inline'
            else return 'none';
        }

        function getDivDoneDisplay(data, rowIndex) {
            if (!data[rowIndex].edit) return 'block'
            else return 'none';
        }

        return customEditableGrid;
    }
    var sampleCode = {};
    sampleCode.html = 'SampleCode/customEditableGrid.html';
    sampleCode.js = 'SampleCode/customEditableGrid.js';

    //attach to the namespace
    App.Grids['BuildcustomEditableGrid'] = initializeGrid;
    App.GridSampleCode['CustomEditableGridSampleCode'] = sampleCode;
})();