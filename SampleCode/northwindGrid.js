<pre class="brush: js">
var northWindGrid = new GridJS({
    gridId: 'northwindGrid',
    dataSource: NorthWindDataSource,
    cellPadding: 6,
    pagination: 10,
    pageButtonCss: { normalCss: 'NorthWindPaginationButton', activeCss: 'NorthWindPaginationActiveButton' },
    dataRowColors: ["#0B6121", "#0A2A0A"]
})
.addCustomFunction("GetOrderDate", function (data, rowIndex) {
    var date = new Date(Date.parse(data[rowIndex].OrderDate));
    return getDate(date);
})
.addCustomFunction("GetShippedDate", function (data, rowIndex) {
    var date = new Date(Date.parse(data[rowIndex].ShippedDate));
    return getDate(date);
}).draw();

//returns meaningful date format
function getDate(rawDate) {
    var month = rawDate.getMonth(),
        day = rawDate.getDate(),
        year = rawDate.getYear();
    return month + "/" + day + "/" + year;
}
</pre>