;
(function () {
    function initializeGrid() {

        var boundNorthwindGrid = new GridJS({
            gridId: 'boundNorthWindGrid',
            dataSource: NorthWindDataSource,
            cellPadding: 6,
            pagination: 10,
            pageButtonCss: { normalCss: 'NorthWindPaginationButton', activeCss: 'NorthWindPaginationActiveButton' },
            dataRowColors: ["#0B6121", "#0A2A0A"]
        })
        .addCustomFunction("GetOrderDate", GetOrderDate)
        .addCustomFunction("GetShippedDate", GetShippedDate);
        
        //GetOrderDate1
        function GetOrderDate(data, rowIndex) {
            var date = new Date(Date.parse(data[rowIndex].OrderDate));
            return getDate(date);
        }

        //GetShippedDate1
        function GetShippedDate(data, rowIndex) {
            var date = new Date(Date.parse(data[rowIndex].ShippedDate));
            return getDate(date);
        }

        //returns meaningful date format
        function getDate(rawDate) {
            var month = rawDate.getMonth(),
                day = rawDate.getDate(),
                year = rawDate.getYear();
            return month + "/" + day + "/" + year;
        }

        return boundNorthwindGrid;
    }
    var sampleCode = {};
    sampleCode.html = 'SampleCode/boundNorthwindGrid.html';
    sampleCode.js = 'SampleCode/boundNorthwindGrid.js';

    //attach to the namespace
    App.Grids['BuildBoundNorthwindGrid'] = initializeGrid;
    App.GridSampleCode['BoundNorthwindGridSampleCode'] = sampleCode;
})();
