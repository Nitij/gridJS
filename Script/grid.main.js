;
(function ($, w, d, undefined) {
    "use strict";
    var gridJS = null;

    gridJS = function () {
        this._grid = null;
        this._gridID = null;
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
        this._dataChanges = {};
        this._bindInput = true;
        this._customFunctions = {};
        this._hasCustomBindings = false;
        return this;
    };
    gridJS.prototype = {
        addCustomFunction: function (funcName, f) {
            this._customFunctions[funcName] = f;
            this._hasCustomBindings = true;
            return this;
        },
        disableInputBindings: function (bool) {
            this._bindInput = bool;
            return this;
        },
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
            this._gridID = gridID;
            return this;
        },
        dataSource: function (dataSource) {
            this._dataSource = dataSource;
            this._dataItemCount = dataSource.length;
            return this;
        },
        //re-draw the entire grid
        reDraw: function () {
            var dataSource = this._dataSource,
                headerElement = this._headerElement,
                headerColumns = headerElement.find("column"),
                dataElement = this._dataElement,
                dataColumns = dataElement.find("column"),
                footerElement = this._footerElement,
                footerColumns = footerElement.find("column"),
                i = 0, j = 0, k = 0, colorIdx = 0,
                dataSourceLength = null, startRow = null, endRow = null,
                currentRow = "",
                headerRow = null, dataRow = null, footerRow = null, finalGrid = null,
                headerCol = null, dataCol = null, dataColChildren = null, footerCol = null,
                setDataRowBackColor = this._dataRowBackColors.length > 0, //vars for data row back color
                paginationDiv = null, tempAnchor = null, //vars for pagination
                pageClickEvent = null, //page click event for pagination
                currentElement = null,// used to process html elements
                inputBindings = [], //input element's binding data, format: {id, rowIndex, propertyToBind}                
                procesedRow = null,
                tempAttribute = null; //temp attribute var which can be reused

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

            //DATA ROWS
            //============================================================================================
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
                if (colorIdx === this._dataRowBackColors.length) { colorIdx = 0 }
                procesedRow = GetDataRow.call(this, startRow, inputBindings, true, colorIdx);
                colorIdx++;

                finalGrid.append(procesedRow.dataRow);
                inputBindings = procesedRow.inputBindings;
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
                paginationDiv.css({
                    "text-align": "center",
                    "text-decoration": "none",
                    "padding-top": "4px"
                });

                //'<' anchor
                if (this._currentPageNumber > 1) {
                    tempAnchor = $(document.createElement("a"));
                    tempAnchor.attr("href", "#");
                    tempAnchor.attr("class", this._pageButtonNormalCss);
                    tempAnchor.append("<");
                    tempAnchor.css({
                        "text-decoration": "none",
                        "padding-left": "2px",
                        "padding-right": "2px",
                        "display": "inline-block"
                    });
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
                    tempAnchor.css({
                        "text-decoration": "none",
                        "padding-left": "2px",
                        "padding-right": "2px",
                        "display": "inline-block"
                    });

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
                    tempAnchor.css({
                        "text-decoration": "none",
                        "padding-left": "2px",
                        "padding-right": "2px",
                        "display": "inline-block"
                    });
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
            if (this._bindInput) {
                BindInputs.call(this, inputBindings);
            }

            return this;
        },
        //re-draw a specific row binding the new data.
        reDrawRow: function () {
            var rowIndex = arguments[0],
                $dataRow = $("#" + this._gridID + "_dataRow_" + rowIndex),
                output = GetDataRow.call(this, rowIndex, null, false, null)
            $dataRow.html(output.dataRow.html());
            BindInputs.call(this, output.inputBindings);
            return this;
        },
        //this is to set alternate colors or custom color sequence for the rows
        setDataRowColors: function (colors) {
            this._dataRowBackColors = colors;
            return this;
        },
        //set the padding of the table cells
        setCellPadding: function (cellPadding) {
            this._cellPadding = cellPadding;
            return this;
        },
        //this is to set row add event handler
        onRowAddition: function (f) {
            this._hasRowAddHandler = true;
            this._rowAddHandler = f;
            return this;
        },
        //Sets row mouse over color
        setMouseOverColor: function (color) {
            this._hasMouseOverColor = true;
            this._mouseOverColor = color;
            return this;
        },
        //Returns an array containing updated data rows
        getDataUpdates: function () {
            var dataUpdates = [];
            var dataChanges = this._dataChanges;
            $.each(dataChanges, function (key, element) {
                dataUpdates.push(element);
            });
            return dataUpdates;
        }
    };

    //function to bind inputs to the data source
    function BindInputs(inputBindings) {
        var i = 0, //counter
            currentRow,
            bindInputDelegate, //delegate to bind inputs to the data source
            currentElement;
        for (; i < inputBindings.length; i++) {
            currentRow = inputBindings[i]; //reusing currentRow var here
            currentElement = $("#" + currentRow.id); //reusing currentElement var here
            bindInputDelegate = $.proxy(BindInput, currentElement[0], [this
                , currentRow.rowIndex, currentRow.propToBind]);
            //set the correct event handler based on type of input
            switch (currentElement[0].type) {
                case "text":
                case "number":
                case "password":
                    currentElement.change(bindInputDelegate);
                    break;
                case "checkbox":
                    currentElement.click(bindInputDelegate);
                    break;
            }
        }
    }
    //Function to return a data row after parsing its contents
    function GetDataRow(startRow, inputBindings, setColor, colorIdx) {
        var dataRow,
            dataCol = null,
            dataColChildren = null,
            currentElement = null,// used to process html elements
            $currentElement = null,//jQuery equivalent
            currentRow = "",
            setDataRowBackColor = this._dataRowBackColors.length > 0,
            j = 0,
            k = 0,
            dataColumns = this._dataElement.find("column"),
            dataSource = this._dataSource,
            tempAttribute = null, //temp attribute var which can be reused
            returnVal = {},
            $imgTags = null;

        if (inputBindings === null || inputBindings === undefined) { inputBindings = [];}

        dataRow = $(document.createElement("tr"));
        dataRow.attr("id", this._gridID + "_dataRow_" + startRow);
        dataRow.attr("class", this._dataElement.attr("class"));

        //set background colors if any provided
        if (setDataRowBackColor) {
            dataRow.css("background-color", this._dataRowBackColors[colorIdx]);
        }

        //set mouse over and out color
        if (setColor && this._hasMouseOverColor) {
            dataRow.mouseover([dataRow, this._mouseOverColor], SetBackgroundColor);
            dataRow.mouseout([dataRow, dataRow.css("background-color")]
                , SetBackgroundColor);
        }

        //set the data for each row
        for (; j < dataColumns.length; j++) {
            dataCol = document.createElement("td");
            dataCol.setAttribute("class", $(dataColumns[j]).attr("class"));
            dataCol = $(dataCol);
            currentRow = dataColumns[j].innerHTML;
            dataCol.html(currentRow);

            //set unique IDs for all childrens and input bindings
            dataColChildren = dataCol[0].children;

            for (; k < dataColChildren.length; k++) {
                currentElement = dataColChildren[k];
                $currentElement = $(currentElement);
                if (currentElement.id !== "") {
                    currentElement.id = dataColChildren[k].id += "_" + startRow;
                }
                if (this._bindInput) {
                    //input bindings
                    switch (currentElement.tagName.toLowerCase()) {
                        case "input":
                            if ($currentElement.attr("model")) {
                                inputBindings.push(GetInputBinding(currentElement, startRow));
                                switch (currentElement.type) {
                                    case "text":
                                    case "number":
                                    case "password":
                                        tempAttribute = d.createAttribute("value");
                                        tempAttribute.value = $currentElement.attr("model");
                                        dataColChildren[k].setAttributeNode(tempAttribute);
                                        break;
                                    case "checkbox":
                                        if (ReplaceToken($currentElement.attr("model")
                                            , dataSource
                                            , startRow
                                            , this._customFunctions
                                            , this._hasCustomBindings) === 'true') {
                                            tempAttribute = d.createAttribute("checked");
                                            dataColChildren[k].setAttributeNode(tempAttribute);
                                        }
                                        break;
                                }
                            }
                            break;
                    }
                }
            }
            k = 0; //reset counter
            //lets now replace the template items with their data
            currentRow = ReplaceToken(dataCol.html()
                , dataSource
                , startRow
                , this._customFunctions
                , this._hasCustomBindings)
            dataCol.html(currentRow);
            dataRow.append(dataCol);
        }
        //row add event handling
        if (this._hasRowAddHandler) {
            dataRow = $(this._rowAddHandler(dataRow[0], dataSource, startRow));
        }

        //finally return the row
        returnVal["dataRow"] = dataRow;
        returnVal["inputBindings"] = inputBindings;
        return returnVal;
    }
    //Binds the input element value with the data source
    function GetInputBinding(inputElement, index) {
        var value = "",
            eventType = "",
            pStart = null, pEnd = null,
            tokenStart = null, tokenEnd = null,
            token = "",
            binding = {};

        value = inputElement.getAttribute("model");
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
        var value = null,
            grid = e[0],
            rowIndex = e[1],
            propertyName = e[2],
            rowReDrawDelegate = null;
        switch (this.type) {
            case "text":
            case "number":
            case "password":
                value = this.value;
                break;
            case "checkbox":
                value = this.checked;
                break;
        }
        grid._dataSource[rowIndex][propertyName] = value;
        grid._dataChanges["row" + rowIndex] = grid._dataSource[rowIndex];

        //lets refresh the current row data here to update all the value bindings.
        grid.reDrawRow.call(grid, rowIndex);
    }

    //Set the background color of the html element passed in the even parameters
    function SetBackgroundColor(e) {
        var el = e.data[0],
            color = e.data[1];
        el.css("background-color", color);
    }

    //set the page number and draw the grid again
    function DrawGridByPage(e) {
        this._currentPageNumber = e[0];
        this.reDraw();
    }

    //replaces token of the format {{value}} from the provided html string
    //with its appropriate value from the data source
    function ReplaceToken(str, dataSource, rowIndex, customBindings, hasCustomBindings) {
        var i = 0,
            length = str.length,
            ptr = "",
            pStart = 0, pEnd = 0, tokenStart = 0, tokenEnd = 0,
            token = "", tokenName = "",
            output = str,
            data = dataSource[rowIndex];
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
                    if (!IsFunctionTemplate(tokenName)) {
                        output = output.replace(token, EvalToken(data, tokenName));
                    }
                    else {
                        //final check, will procedd if there is any custom binding added else
                        //there is no need to process the code any further
                        if (hasCustomBindings) {
                            output = output.replace(token
                            , EvalFunction(tokenName, dataSource, rowIndex, customBindings));
                        }
                        else {
                            //replace the token template with empty string if 
                            //there are no function bindings added
                            output = output.replace(token, "");
                        }
                    }
                    //handle model-src
                    output = output.replace("model-src", "src");
                }
            }
        }

        return output;
    }

    //Function to determine if the provided string is a function template or not
    function IsFunctionTemplate(str) {
        var length = str.length;
        if (length) {
            //(length - 2) because of the zero based index
            if (str.substr(length - 2, 2) === "()") {
                return true;
            }
            else {
                return false;
            }
        }
    }

    //Function to evalute value from a template function
    function EvalFunction(f, dataSource, rowIndex, customBindings) {
        var func = f.replace("()", ""),
            func = customBindings[func];
        if (!IsNullOrUndefined(func)) {
            return func(dataSource, rowIndex);
        }
    }

    //Function to evaluate token
    function EvalToken(data, str) {
        var i = 0,
            length = str.length,
            ptr = "",
            pStart = 0, pEnd = 0,
            token = "",
            resetPointer = false;
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

    //Checks if an object is null or undefined.
    function IsNullOrUndefined(obj){
        return obj === null || obj === undefined;
    }

    w["GridJS"] = gridJS;

})(jQuery, window, document);
