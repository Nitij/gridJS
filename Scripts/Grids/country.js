;
(function () {
    function initializeGrid() {
        var countryGrid = new GridJS({
            gridId: 'countryGrid',
            dataSource: CountryDataSource,
            cellPadding: 8,
            dataRowColors: ["#F8FBEF", "#EFF5FB"]
        });

        return countryGrid;            
    }
    var sampleCode = {};
    sampleCode.html = 'SampleCode/countryGrid.html';
    sampleCode.js = 'SampleCode/countryGrid.js';

    //attach to the namespace
    App.Grids['BuildCountryGrid'] = initializeGrid;
    App.GridSampleCode['CountryGridSampleCode'] = sampleCode;
})();