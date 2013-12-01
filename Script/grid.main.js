;
(function ($, w, undefined) {
    "use strict";
    var gridJS = null;

    gridJS = function () {
        this._grid = null;
        this._dataSource = null;
        this._dataItemCount = 0;
        this._dataRowBackColors = [];
        this._cellPadding = 5;
        this._hasRowAddHandler = false;
        this._rowAddHandler = null;
        this._hasMouseOverColor = false;
        this._mouseOverColor = "";
        this._hasPagination = false;
        this._pageRowCount = 0;
        this._currentPageNumber = 1;
        this._headerElement = null;
        this._dataElement = null;
        this._footerElement = null;
        this._pageButtonNormalCss = "";
        this._pageButtonActiveCss = "";
        return this;
    };
    gridJS.prototype = {
        setPageButtonCss: function (normalCss, activeCss) {
            this._pageButtonNormalCss = normalCss;
            this._pageButtonActiveCss = activeCss;
            return this;
        },
        init: function () {
            this._headerElement = this._grid.find("headerRow");
            this._dataElement = this._grid.find("dataRow");
            this._footerElement = this._grid.find("footerRow");
            return this;
        },
        draw: function(){
            this.init().reDraw();
            return this;
        },
        setPagination: function (numRows) {
            this._hasPagination = true;
            this._pageRowCount = numRows;
            return this;
        },
        getGrid: function (gridID) {
            this._grid = $("gridJS[id = '" + gridID + "']");
            return this;
        },
        dataSource: function (dataSource) {
            this._dataSource = dataSource;
            this._dataItemCount = dataSource.length;
            return this;
        },
        reDraw: function () {
            var dataSource = this._dataSource;
            var headerElement = this._headerElement;
            var headerColumns = headerElement.find("column");
            var dataElement = this._dataElement;
            var dataColumns = dataElement.find("column");
            var footerElement = this._footerElement;
            var footerColumns = footerElement.find("column");
            var i = 0, j = 0, k = 0, colorIdx = 0;
            var dataSourceLength = null, startRow = null, endRow = null;
            var currentRow = "";
            var headerRow = null, dataRow = null, footerRow = null, finalGrid = null;
            var headerCol = null, dataCol = null, dataColChildren = null, footerCol = null;
            var setDataRowBackColor = this._dataRowBackColors.length > 0; //vars for data row back color
            var paginationDiv = null, tempAnchor = null; //vars for pagination
            var pageClickEvent = null; //page click event for pagination
            var currentElement = null;// used to process html elements
            var inputBindings = []; //input element's binding data, format: {id, rowIndex, propertyToBind}
            var bindInputDelegate; //delegate to bind inputs to the data source
            //initialize final grid table
            finalGrid = document.createElement("table");
            finalGrid.setAttribute("cellspacing", 0);
            finalGrid.setAttribute("cellpadding", this._cellPadding);
            finalGrid.setAttribute("class", this._grid.attr("class"));
            finalGrid = $(finalGrid);

            //header
            headerRow = $(document.createElement("tr"));
            headerRow.attr("class", headerElement.attr("class"));
            for (; i < headerColumns.length; i++) {
                headerCol = document.createElement("td");
                headerCol.setAttribute("class", $(headerColumns[i]).attr("class"));
                headerCol = $(headerCol);
                headerCol.html(headerColumns[i].innerHTML);
                headerRow.append(headerCol);
            }
            finalGrid.append(headerRow);

            //data rows
            //first handle the pagination if any applied
            dataSourceLength = dataSource.length;
            if (this._hasPagination) {
                startRow = 0 + (this._currentPageNumber * this._pageRowCount) - this._pageRowCount;
                endRow = this._currentPageNumber * this._pageRowCount;
                if (endRow > dataSourceLength)
                    endRow = dataSourceLength;
            }
            else {
                startRow = 0;
                endRow = dataSourceLength;
            }

            for (; startRow < endRow; startRow++) {
                dataRow = $(document.createElement("tr"));
                dataRow.attr("class", dataElement.attr("class"));
                
                //set background colors if any provided
                if (setDataRowBackColor) {
                    if (colorIdx === this._dataRowBackColors.length) { colorIdx = 0 }
                    dataRow.css("background-color", this._dataRowBackColors[colorIdx]);
                    colorIdx++;
                }

                //set mouse over and out color
                if (this._hasMouseOverColor) {
                    dataRow.mouseover([dataRow, this._mouseOverColor], SetBackgroundColor);
                    dataRow.mouseout([dataRow, dataRow.css("background-color")]
                        , SetBackgroundColor);
                }

                //set the data for each row
                for (; j < dataColumns.length; j++) {
                    dataCol = document.createElement("td");
                    dataCol.setAttribute("class", $(dataColumns[startRow]).attr("class"));
                    dataCol = $(dataCol);
                    currentRow = dataColumns[j].innerHTML;

                    dataCol.html(currentRow);

                    //set unique IDs for all childrens and input bindings
                    dataColChildren = dataCol[0].children;
                    
                    for (; k < dataColChildren.length; k++) {
                        //currentElement = dataColChildren[k];
                        if (dataColChildren[k].id !== "") { dataColChildren[k].id += "_" + startRow; }
                        if (dataColChildren[k].tagName.toLowerCase() === "input") {
                            inputBindings.push(GetInputBinding(dataColChildren[k], startRow));
                        }
                    }
                    
                    //lets now replace the template items with their data
                    currentRow = ReplaceToken(dataCol.html(), dataSource[startRow])
                    //currentRow = ReplaceToken(currentRow, dataSource[startRow])
                    dataCol.html(currentRow);
                    
                    k = 0;
                    dataRow.append(dataCol);
                }
                //row add event handling
                if (this._hasRowAddHandler) {
                    dataRow = $(this._rowAddHandler(dataRow[0], dataSource, startRow));
                }

                finalGrid.append(dataRow);
                j = 0;
            }

            //footer
            i = 0;
            footerRow = $(document.createElement("tr"));
            footerRow.attr("class", footerElement.attr("class"));
            for (; i < footerColumns.length; i++) {
                footerCol = document.createElement("td");
                footerCol.setAttribute("class", $(footerColumns[i]).attr("class"));
                footerCol = $(footerCol);
                footerCol.html(footerColumns[i].innerHTML);
                footerRow.append(footerCol);
            }
            finalGrid.append(footerRow);

            //lets now set the pagination area
            if (this._hasPagination) {
                paginationDiv = $(document.createElement("div"));
                paginationDiv.attr("class", this._grid.attr("class"));
                paginationDiv.css("text-align", "center");
                paginationDiv.css("text-decoration", "none");
                paginationDiv.css("padding-top", "4px");

                //'<' anchor
                if (this._currentPageNumber > 1) {
                    tempAnchor = $(document.createElement("a"));
                    tempAnchor.attr("href", "#");
                    tempAnchor.attr("class", this._pageButtonNormalCss);
                    tempAnchor.append("<");
                    tempAnchor.css("text-decoration", "none");
                    tempAnchor.css("padding-left", "2px");
                    tempAnchor.css("padding-right", "2px");
                    tempAnchor.css("display", "inline-block");
                    pageClickEvent = $.proxy(DrawGridByPage, this, [this._currentPageNumber - 1]);
                    tempAnchor.click(pageClickEvent);
                    tempAnchor.click(function () { return false;});
                    paginationDiv.append(tempAnchor);
                    paginationDiv.append("&nbsp;");
                }

                //page number anchors                
                i = 1;
                j = parseInt(dataSourceLength / this._pageRowCount);
                if (dataSourceLength % this._pageRowCount > 0)
                    j++;
                for (; i <= j; i++) {
                    tempAnchor = $(document.createElement("a"));
                    tempAnchor.attr("href", "#");
                    
                    tempAnchor.css("text-decoration", "none");
                    tempAnchor.css("padding-left", "2px");
                    tempAnchor.css("padding-right", "2px");
                    tempAnchor.css("display", "inline-block");
                    //if this is current page then bold this number
                    if (i === this._currentPageNumber) {
                        tempAnchor.attr("class", this._pageButtonActiveCss);
                        tempAnchor.css("font-weight", "bold");
                    }
                    else {
                        tempAnchor.attr("class", this._pageButtonNormalCss);
                    }

                    pageClickEvent = $.proxy(DrawGridByPage, this, [i]);
                    tempAnchor.click(pageClickEvent);
                    tempAnchor.click(function () { return false; });
                    tempAnchor.append(i);
                    paginationDiv.append(tempAnchor);
                    paginationDiv.append("&nbsp;");
                }
                if (this._currentPageNumber < j) {
                    //'>' anchor
                    tempAnchor = $(document.createElement("a"));
                    tempAnchor.attr("href", "#");
                    tempAnchor.attr("class", this._pageButtonNormalCss);
                    tempAnchor.append(">");
                    tempAnchor.css("text-decoration", "none");
                    tempAnchor.css("padding-left", "2px");
                    tempAnchor.css("padding-right", "2px");
                    tempAnchor.css("display", "inline-block");
                    pageClickEvent = $.proxy(DrawGridByPage, this, [this._currentPageNumber + 1]);
                    tempAnchor.click(pageClickEvent);
                    tempAnchor.click(function () { return false; });
                    paginationDiv.append(tempAnchor);
                }
            }


            //finally set the grid's inner html
            this._grid.html("");
            this._grid.append(finalGrid);
            //append the pagination to the grid
            if (this._hasPagination) {
                this._grid.append(paginationDiv);
            }

            //lets bind the input elements to the data source
            i = 0; //reset counter
            for (; i < inputBindings.length; i++) {
                currentRow = inputBindings[i]; //reusing currentRow var here
                currentElement = $("#" + currentRow.id); //reusing currentElement var here
                bindInputDelegate = $.proxy(BindInput, currentElement[0], [this
                    , currentRow.rowIndex, currentRow.propToBind]);
                //set the correct event handler based on type of input
                switch (currentElement[0].type) {
                    case "text":
                        currentElement.change(bindInputDelegate);
                        break;
                }
            }

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
        },
        setMouseOverColor: function (color) {
            this._hasMouseOverColor = true;
            this._mouseOverColor = color;
            return this;
        }
    };

    //Binds the input element value with the data source
    function GetInputBinding(inputElement, index) {
        var value = "";
        var eventType = "";
        var pStart = null, pEnd = null;
        var tokenStart = null, tokenEnd = null;
        var token = "";
        var binding = {};
        switch (inputElement.type) {
            case "text":
                value = inputElement.value;
                break;
        }
        pStart = value.indexOf("{{");
        pEnd = value.indexOf("}}");
        tokenStart = pStart + 2;
        tokenEnd = pEnd - 1;
        token = value.substr(tokenStart, tokenEnd - tokenStart + 1);
        binding["id"] = inputElement.id;
        binding["rowIndex"] = index;
        binding["propToBind"] = token;
        return binding;
    }

    //Binds the input element's value with the grid's data source
    function BindInput(e) {
        var value = null;
        var grid = e[0];
        var rowIndex = e[1];
        var propertyName = e[2];
        switch (this.type) {
            case "text":
                value = this.value;
        }
        grid._dataSource[rowIndex][propertyName] = value;
    }

    //Set the background color of the html element passed in the even parameters
    function SetBackgroundColor(e) {
        var el = e.data[0];
        var color = e.data[1];
        el.css("background-color", color);
    }

    //set the page number and draw the grid again
    function DrawGridByPage(e) {
        this._currentPageNumber = e[0];
        this.reDraw();
    }

    function ReplaceToken(str, data) {
        var i = 0;
        var length = str.length;
        var ptr = "";
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
                    pEnd = i + 1;
                    tokenEnd = i - 1;
                    token = str.substr(pStart, pEnd - pStart + 1);
                    tokenName = str.substr(tokenStart, tokenEnd - tokenStart + 1);
                    output = output.replace(token, EvalToken(data, tokenName));
                }
            }
        }

        return output;
    }

    //Function to evaluate token
    function EvalToken(data, str) {
        var i = 0;
        var length = str.length;
        var ptr = "";
        var pStart = 0, pEnd = 0;
        var token = "";
        var resetPointer = false;
        for (; i < length; i++) {
            if (i < length) {
                ptr = str.substr(i, 1);
                if (resetPointer) {
                    pStart = i;
                    resetPointer = false;
                }
                if ((ptr === "[" || ptr === "." || ptr === "]")
                    && (i < (length - 1))) {
                    //set pointer end
                    pEnd = i;
                    //get the current data
                    data = GetTokenData(str, data, pStart, pEnd);
                    resetPointer = true;
                }
                if (i === (length - 1)) {
                    //set pointer end
                    if (ptr === "]") {
                        pEnd = i;
                    }
                    else {
                        pEnd = i + 1;
                    }
                    //get the current data
                    data = GetTokenData(str, data, pStart, pEnd);
                    resetPointer = true;
                }
            }
        }
        return data;
    }

    //Returns the token data from the string and data passed
    function GetTokenData(str, data, pStart, pEnd) {
        var token = str.substr(pStart, pEnd - pStart);
        if (token.length > 0) {
            data = data[token];
        }
        return data;
    }

    w["GridJS"] = gridJS;

})(jQuery, window);
