<pre class="brush: js">
var shoppingGrid = new GridJS({
    gridId: 'shoppingGrid',
    dataSource: ShoppingDataSource,
    cellPadding: 8,
    pagination: 1,
    pageButtonCss: { normalCss: 'ShoppingPaginationButton', activeCss: 'ShoppingPaginationActiveButton' }
})
.addCustomFunction("PriceAfterDiscount", priceAfterDiscount)
.draw();

//function to get price after discount
function priceAfterDiscount(data, rowIndex) {
    var price = data[rowIndex].price;
    var discount = data[rowIndex].discount;

    return price - ((price * discount) / 100);
}
</pre>