<pre class="brush: js">
var boundNorthwindGrid = new GridJS({
    gridId: 'boundNorthWindGrid',
    dataSource: NorthWindDataSource,
    cellPadding: 6,
    pagination: 10,
    pageButtonCss: { normalCss: 'NorthWindPaginationButton', activeCss: 'NorthWindPaginationActiveButton' },
    dataRowColors: ["#0B6121", "#0A2A0A"]
})
.addCustomFunction("GetOrderDate1", GetOrderDate1)
.addCustomFunction("GetShippedDate1", GetShippedDate1)
.draw();
        
//GetOrderDate1
function GetOrderDate1(data, rowIndex) {
    var date = new Date(Date.parse(data[rowIndex].OrderDate));
    return getDate(date);
}

//GetShippedDate1
function GetShippedDate1(data, rowIndex) {
    var date = new Date(Date.parse(data[rowIndex].ShippedDate));
    return getDate(date);
}

//returns meaningful date format
function getDate(rawDate) {
    month = rawDate.getMonth(),
    day = rawDate.getDate(),
    year = rawDate.getYear();
    return month + "/" + day + "/" + year;
}
</pre>