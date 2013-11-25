;
(function ($, w, undefined) {
    var gridJS = null;

    gridJS = function () {
        this._grid = null;
        this._headerHTML = "";
        this._dataHTML = "";
        this._footerHTML = "";
        this._dataSource = null;
        this._dataItemCount = 0;
        return this;
    };
    gridJS.prototype = {
        getGrid: function (gridID) {
            this._grid = $("gridJS[id = '" + gridID + "']");
            return this;
        },
        dataSource: function (dataSource) {
            this._dataSource = dataSource;
            this._dataItemCount = dataSource.length;
            return this;
        },
        draw: function () {
            var dataSource = this._dataSource;
            var headerElement = this._grid.find("headerRow");
            var headerColumns = headerElement.find("column");
            var dataElement = this._grid.find("dataRow");
            var dataColumns = dataElement.find("column");
            var footerElement = null;
            var wholeGrid = [];
            var headerHtml = [];
            var dataHtml = [];
            var i = 0, j = 0;
            var currentRow = "";

            //header
            headerHtml.push("<tr>");
            for (; i < headerColumns.length; i++) {
                headerHtml.push("<td>");
                headerHtml.push(headerColumns[i].innerHTML);
                headerHtml.push("</td>");
            }
            headerHtml.push("</tr>");
            this._headerHTML = headerHtml.join("");
            debugger;
            //data rows
            i = 0;
            for (; i < dataSource.length; i++) {
                dataHtml.push("<tr>");
                for (; j < dataColumns.length; j++) {
                    currentRow = dataColumns[j].innerHTML;
                    dataHtml.push("<td>");

                    //lets now replace the template items with their data
                    currentRow = ReplaceToken(currentRow, dataSource[i])
                    dataHtml.push(currentRow);
                    dataHtml.push("</td>");
                }
                dataHtml.push("</tr>");
                j = 0;
            }
            this._dataHTML = dataHtml.join("");

            //lets create template for the complete grid
            wholeGrid.push("<table>");
            wholeGrid.push("{{header}}");
            wholeGrid.push("{{data}}");
            //wholeGrid.push("{{footer}}");
            wholeGrid.push("</table>");

            wholeGrid = wholeGrid.join("");
            wholeGrid = wholeGrid.replace("{{header}}", this._headerHTML);
            wholeGrid = wholeGrid.replace("{{data}}", this._dataHTML);


            //finally set the grid's inner html
            this._grid.html(wholeGrid);
            return this;
        }
    };

    function ReplaceToken(str, data) {
        var i = 0;
        var length = str.length;
        var ptr = "", ptr;
        var pStart = 0, pEnd = 0, tokenStart = 0, tokenEnd = 0;
        var token = "", tokenName = "";
        var output = str;
        
        for (; i < length; i++) {
            if (i < length) {
                ptr = str.substr(i, 2);

                if (ptr === "{{") {
                    pStart = i;
                    tokenStart = i + 2;
                }
                else if (ptr === "}}") {
                    pEnd = i+1;
                    tokenEnd = i - 1;
                    token = str.substr(pStart, pEnd - pStart + 1);
                    tokenName = str.substr(tokenStart, tokenEnd - tokenStart + 1);
                    output = output.replace(token, data[tokenName]);
                }
            }
        }

        return output;
    }

    w["GridJS"] = gridJS;

})(jQuery, window);