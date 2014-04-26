;
(function () {
    function initializeGrid() {
        var shoppingGrid = new GridJS({
            gridId: 'shoppingGrid',
            dataSource: ShoppingDataSource,
            cellPadding: 8,
            pagination: 1,
            pageButtonCss: { normalCss: 'ShoppingPaginationButton', activeCss: 'ShoppingPaginationActiveButton' }
        })
        .addCustomFunction("PriceAfterDiscount", priceAfterDiscount);

        //function to get price after discount
        function priceAfterDiscount(data, rowIndex) {
            var price = data[rowIndex].price;
            var discount = data[rowIndex].discount;

            return price - ((price * discount) / 100);
        }

        return shoppingGrid;
    }
    var sampleCode = {};
    sampleCode.html = 'SampleCode/shoppingGrid.html';
    sampleCode.js = 'SampleCode/shoppingGrid.js';

    //attach to the namespace
    App.Grids['BuildShoppingGrid'] = initializeGrid;
    App.GridSampleCode['ShoppingGridSampleCode'] = sampleCode;
})();