;
(function ($, w, undefined) {
    var gridJS = null;

    gridJS = function () {
        this._grid = null;
        this._dataSource = null;
        this._dataItemCount = 0;
        this._dataRowBackColors = [];
        this._cellPadding = 5;
        this._hasRowAddHandler = false;
        this._rowAddHandler = null;
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
            var footerElement = this._grid.find("footerRow");
            var footerColumns = footerElement.find("column");
            var i = 0, j = 0, k = 0, colorIdx = 0;
            var currentRow = "";
            var headerRow = null, dataRow = null, footerRow = null, finalGrid = null;
            var headerCol = null, dataCol = null, dataColChildren = null, footerCol = null;
            var setDataRowBackColor = this._dataRowBackColors.length > 0;

            //initialize final grid table
            finalGrid = document.createElement("table");
            finalGrid.setAttribute("cellspacing", 0);
            finalGrid.setAttribute("cellpadding", this._cellPadding);
            finalGrid.setAttribute("class", this._grid.attr("class"));
            finalGrid = $(finalGrid);

            //header
            headerRow = document.createElement("tr");
            headerRow.setAttribute("class", headerElement.attr("class"));
            headerRow = $(headerRow);
            for (; i < headerColumns.length; i++) {
                headerCol = document.createElement("td");
                headerCol.setAttribute("class", $(headerColumns[i]).attr("class"));
                headerCol = $(headerCol);
                headerCol.html(headerColumns[i].innerHTML);
                headerRow.append(headerCol);
            }
            finalGrid.append(headerRow);

            //data rows
            i = 0;
            for (; i < dataSource.length; i++) {
                dataRow = document.createElement("tr");
                dataRow.setAttribute("class", dataElement.attr("class"));
                dataRow = $(dataRow);
                //set background colors if any provided
                if (setDataRowBackColor)
                {
                    if (colorIdx === this._dataRowBackColors.length) { colorIdx = 0}
                    dataRow.css("background-color", this._dataRowBackColors[colorIdx]);
                    colorIdx++;
                }
                //set the data for each row
                for (; j < dataColumns.length; j++) {
                    dataCol = document.createElement("td");
                    dataCol.setAttribute("class", $(dataColumns[i]).attr("class"));
                    dataCol = $(dataCol);
                    currentRow = dataColumns[j].innerHTML;

                    //lets now replace the template items with their data
                    currentRow = ReplaceToken(currentRow, dataSource[i])
                    dataCol.html(currentRow);
                    
                    //set unique IDs for all childrens
                    dataColChildren = dataCol[0].children;
                    for (; k < dataColChildren.length; k++) {
                        if (dataColChildren[k].id !== "") { dataColChildren[k].id += "_" + i; }
                    }
                    k = 0;
                    dataRow.append(dataCol);
                }
                //row add event handling
                if (this._hasRowAddHandler) {
                    dataRow = $(this._rowAddHandler(dataRow[0], dataSource, i));
                }
                
                finalGrid.append(dataRow);
                j = 0;
            }

            //footer
            i = 0;
            footerRow = document.createElement("tr");
            footerRow.setAttribute("class", footerElement.attr("class"));
            footerRow = $(footerRow);
            for (; i < footerColumns.length; i++) {
                footerCol = document.createElement("td");
                footerCol.setAttribute("class", $(footerColumns[i]).attr("class"));
                footerCol = $(footerCol);
                footerCol.html(footerColumns[i].innerHTML);
                footerRow.append(footerCol);
            }
            finalGrid.append(footerRow);

            //finally set the grid's inner html
            this._grid.html("");
            this._grid.append(finalGrid);
            return this;
        },
        setDataRowColors: function (colors) {
            this._dataRowBackColors = colors;
            return this;
        },
        setCellPadding: function (cellPadding) {
            this._cellPadding = cellPadding;
            return this;
        },
        onRowAddition: function (f) {
            this._hasRowAddHandler = true;
            this._rowAddHandler = f;
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
