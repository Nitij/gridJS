;
(function () {
    function initializeGrid() {
        var northWindGrid = new GridJS({
            gridId: 'northwindGrid',
            dataSource: NorthWindDataSource,
            cellPadding: 6,
            pagination: 10,
            pageButtonCss: { normalCss: 'NorthWindPaginationButton', activeCss: '' },
            dataRowColors: ["#0B6121", "#0A2A0A"]
        })
        .addCustomFunction("GetOrderDate", function (data, rowIndex) {
            var date = new Date(Date.parse(data[rowIndex].OrderDate));
            return getDate(date);
        })
        .addCustomFunction("GetShippedDate", function (data, rowIndex) {
            var date = new Date(Date.parse(data[rowIndex].ShippedDate));
            return getDate(date);
        });

        //returns meaningful date format
        function getDate(rawDate) {
            month = rawDate.getMonth(),
            day = rawDate.getDate(),
            year = rawDate.getYear();
            return month + "/" + day + "/" + year;
        }

        return northWindGrid;
    }
    var sampleCode = {};
    sampleCode.html = 'SampleCode/northwindGrid.html';
    sampleCode.js = 'SampleCode/northwindGrid.js';

    //attach to the namespace
    App.Grids['BuildNorthwindGrid'] = initializeGrid;
    App.GridSampleCode['NorthwindGridSampleCode'] = sampleCode;
})();