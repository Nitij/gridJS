;
(function (w, d, undefined) {
    "use strict";
    var gridJS = null;

    //constants
    var HEADER_ROW_TAG_NAME = 'headerRow',  //header row tag name
        DATA_ROW_TAG_NAME = 'dataRow',      //data row tag name
        FOOTER_ROW_TAG_NAME = 'footerRow',  //footer row tag name
        COLUMN_TAG_NAME = 'column',         //column tag name
        INPUT_TEXT = 'text',                //input type text
        INPUT_NUMBER = 'number',            //input type number
        INPUT_PASSWORD = 'password',        //input type password
        INPUT_CHECBOX = 'checkbox',         //input type checkbox
        INPUT_SEARCH = 'search',            //input type search
        INPUT_TEL = 'tel',                  //input type tel
        INPUT_URL = 'url',                  //input type url
        INPUT_EMAIL = 'email',              //input type email
        INPUT_TIME = 'time',                //input type time
        INPUT_DATETIME = 'datetime',        //input type datetime
        INPUT_DATE = 'date',                //input type date
        INPUT_MONTH = 'month',              //input type month
        INPUT_WEEK = 'week';                //input type week

    //initializers
    var currentPageNumber = 1,
        cellPadding = 5;

    //config function
    //Config Object Properties:
    //-----------------
    //gridId
    //dataSource
    //updateDataRowOnInputChange
    //beforeGridPageChange
    //onRowRedrawComplete
    //onGridPageChange
    //onGridLoaded
    //allowPageChange
    //disableInputBindings
    //pageButtonCss {normalCss: 'value', activeCss: 'value'}
    //pagination
    //dataRowColors []
    //cellPadding
    //onRowAddition
    //mouseOverColor
    //-----------------
    gridJS = function (config) {

        var f = null,
            o = null,
            c = config;

        //initializing stuff here
        this._sourceGrid = null;                        //this will be used to gather source grid markup on grid redraw
        this._grid = null;
        this._gridID = null;
        this._dataSource = null;
        this._dataItemCount = 0;
        this._dataRowBackColors = [];
        this._cellPadding = cellPadding;
        this._hasRowAddHandler = false;
        this._rowAddHandler = null;
        this._hasMouseOverColor = false;
        this._mouseOverColor = "";
        this._hasPagination = false;
        this._pageRowCount = 0;
        this._currentPageNumber = currentPageNumber;
        this._headerElement = null;
        this._dataElement = null;
        this._footerElement = null;
        this._pageButtonNormalCss = "";
        this._pageButtonActiveCss = "";
        this._dataChanges = {};
        this._bindInput = true;
        this._updateRowOnDataChange = true;
        this._customFunctions = {};                     //object to store custom functions
        this._hasCustomBindings = false;                //flag to determine if there are custom input bindings or not
        this._allowPageChange = true;                   //flag to allow or dis-allow grid page change
        this._onGridLoaded = null;                      //function/event handler to call when grid is loaded
        this._onGridPageChange = null;                  //event handler for grid page change event
        this._beforeGridPageChange = null;              //event handler for grid page change event before the page is changed
        this._onRowRedrawComplete = null;               //event handler for row re-draw complete event
        

        //configure the properties based on the config object
        //set the grid
        if (c['gridId']) {
            this._sourceGrid = d.createElement('gridjs');
            this._gridID = c['gridId'];
            this._grid = d.querySelector('#' + c['gridId']);
            this._sourceGrid.innerHTML = this._grid.innerHTML;
        }

        //set the data-source
        if (c['dataSource']) {
            this._dataSource = c['dataSource'];
            this._dataItemCount = c['dataSource'].length;
        }

        //set updateDataRowOnInputChange flag
        if (!IsNullOrUndefined(c['updateDataRowOnInputChange']))
            this._updateRowOnDataChange = c['updateDataRowOnInputChange'];

        //set beforeGridPageChange event
        f = c['beforeGridPageChange'];
        if (f && isFunction(f))
            this._beforeGridPageChange = f;

        //set onRowRedrawComplete event
        f = c['onRowRedrawComplete'];
        if (f && isFunction(f))
            this._onRowRedrawComplete = f;

        //set onGridPageChange event
        f = c['onGridPageChange'];
        if (f && isFunction(f))
            this._onGridPageChange = f;

        //set onGridLoaded event
        f = c['onGridLoaded'];
        if (f && isFunction(f))
            this._onGridLoaded = f;

        //set allowPageChange flag
        this._allowPageChange = c['allowPageChange'] || true;

        //set disableInputBindings flag
        this._bindInput = c['disableInputBindings'] || true;

        //set pagination button css
        o = c['pageButtonCss'];
        if (o) {
            this._pageButtonNormalCss = o['normalCss'];
            this._pageButtonActiveCss = o['activeCss'];
        }

        //set pagination
        if (c['pagination']) {
            this._hasPagination = true;
            this._pageRowCount = c['pagination'];
        }

        //set dataRowColors
        o = c['dataRowColors'];
        if (o && o.length && typeof o !== '[Object object]')
            this._dataRowBackColors = o;

        //set cellPadding
        o = c['cellPadding'];
        if (o) this._cellPadding = o;

        //set onRowAddition event
        f = c['onRowAddition'];
        if (f && isFunction(f)) {
            this._hasRowAddHandler = true;
            this._rowAddHandler = f;
        }

        //set mouseOverColor
        o = c['mouseOverColor'];
        if (o) {
            this._hasMouseOverColor = true;
            this._mouseOverColor = o;
        }

        //return our grid object
        return this;
    };
    gridJS.prototype = {
        
        //flag to determine if data row should be updated on binded input data change or not
        updateDataRowOnInputChange: function (bool) {
            this._updateRowOnDataChange = bool;
            return this;
        },

        //event wireup which fires up before the page is changed
        beforeGridPageChange: function (func) {
            if (isFunction(func))
                this._beforeGridPageChange = func;
            return this;
        },

        //function which is called when row redraw is completed which happens when any bound input is changed
        onRowRedrawComplete: function (func) {
            if (isFunction(func))
                this._onRowRedrawComplete = func;
            return this;
        },

        //function to set grid page change event handler
        onGridPageChange: function (func) {
            if (isFunction(func))
                this._onGridPageChange = func;
            return this;
        },

        //function to set grid loaded event handler
        onGridLoaded: function (func) {
            if (isFunction(func))
                this._onGridLoaded = func;
            return this;
        },

        //function to set the flag to allow grid page change or not
        allowPageChange: function (bool) {
            this._allowPageChange = bool;
            return this;
        },

        //adds a custom function to call
        addCustomFunction: function (funcName, f) {
            this._customFunctions[funcName] = f;
            this._hasCustomBindings = true;
            return this;
        },

        //disable or enable input bindings
        disableInputBindings: function (bool) {
            this._bindInput = bool;
            return this;
        },

        //sets the page button normal and active css
        setPageButtonCss: function (normalCss, activeCss) {
            this._pageButtonNormalCss = normalCss;
            this._pageButtonActiveCss = activeCss;
            return this;
        },

        //initialize the grid
        init: function () {            
            this._headerElement = this._sourceGrid.querySelector(HEADER_ROW_TAG_NAME);
            this._dataElement = this._sourceGrid.querySelector(DATA_ROW_TAG_NAME);
            this._footerElement = this._sourceGrid.querySelector(FOOTER_ROW_TAG_NAME);
            return this;
        },

        //draws the grid
        draw: function () {
            this.init().reDraw();
            return this;
        },

        //set number of rows in a page
        setPagination: function (numRows) {
            this._hasPagination = true;
            this._pageRowCount = numRows;
            return this;
        },

        //gets the grid element id
        getGrid: function (gridID) {
            this._gridID = gridID;
            this._sourceGrid = d.createElement('gridjs');
            this._grid = d.querySelector('#' + gridID);
            this._sourceGrid.innerHTML = this._grid.innerHTML;
            return this;
        },

        //sets the JSON data source
        dataSource: function (dataSource) {
            this._dataSource = dataSource;
            this._dataItemCount = dataSource.length;
            return this;
        },

        //re-draw the entire grid
        reDraw: function () {
            var dataSource = this._dataSource,
                headerElement = this._headerElement,
                headerColumns = headerElement.querySelectorAll(COLUMN_TAG_NAME),
                dataElement = this._dataElement,
                dataColumns = dataElement.querySelectorAll(COLUMN_TAG_NAME),
                footerElement = this._footerElement,
                footerColumns = footerElement.querySelectorAll(COLUMN_TAG_NAME),
                i = 0, j = 0, k = 0, colorIdx = 0,
                dataSourceLength = null, startRow = null, endRow = null,
                currentRow = "",
                headerRow = null, dataRow = null, footerRow = null,
                finalGrid = null,
                headerCol = null, dataCol = null, footerCol = null,
                dataColChildren = null,
                setDataRowBackColor = this._dataRowBackColors.length > 0,           //vars for data row back color
                paginationDiv = null, tempAnchor = null,                            //vars for pagination
                pageClickEvent = null,                                              //page click event for pagination
                currentElement = null,                                              // used to process html elements
                inputBindings = [],                                                 //input element's binding data, format: {id, rowIndex, propertyToBind}                
                procesedRow = null,
                tempAttribute = null;                                               //temp attribute var which can be reused
            
            //initialize final grid table
            finalGrid = d.createElement('table');
            finalGrid.setAttribute('cellspacing', 0);
            finalGrid.setAttribute('cellpadding', this._cellPadding);
            finalGrid.setAttribute('class', this._grid.className);
            
            //header
            headerRow = d.createElement('tr');
            headerRow.setAttribute('class', headerElement.className);
            for (; i < headerColumns.length; i++) {
                headerCol = document.createElement('td');
                headerCol.setAttribute('class', (headerColumns[i]).className);
                headerCol.innerHTML = headerColumns[i].innerHTML;
                headerRow.appendChild(headerCol);
            }
            finalGrid.appendChild(headerRow);

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
                finalGrid.appendChild(procesedRow.dataRow);
                inputBindings = procesedRow.inputBindings;
                j = 0;
            }

            //footer
            i = 0;
            footerRow = d.createElement("tr");
            footerRow.setAttribute('class', footerElement.className);
            for (; i < footerColumns.length; i++) {
                footerCol = document.createElement("td");
                footerCol.setAttribute("class", footerColumns[i].className);
                footerCol.innerHTML = footerColumns[i].innerHTML;
                footerRow.appendChild(footerCol);
            }
            finalGrid.appendChild(footerRow);

            //lets now set the pagination area
            if (this._hasPagination) {
                paginationDiv = d.createElement("div");
                paginationDiv.setAttribute("class", this._grid.className);
                paginationDiv.style.textAlign = 'center';
                paginationDiv.style.textDecoration = 'none';
                paginationDiv.style.paddingTop = '4px';

                //'<' anchor
                if (this._currentPageNumber > 1) {
                    tempAnchor = getTempPageNumberAnchor();
                    tempAnchor.setAttribute('class', this._pageButtonNormalCss);
                    tempAnchor.innerHTML = '<';


                    pageClickEvent = DrawGridByPage.bind(this, [this._currentPageNumber - 1]);
                    tempAnchor.onclick = pageClickEvent;
                    paginationDiv.appendChild(tempAnchor);
                    paginationDiv.appendChild(getNbspElement());
                }

                //page number anchors                
                i = 1;
                j = parseInt(dataSourceLength / this._pageRowCount);
                if (dataSourceLength % this._pageRowCount > 0)
                    j++;
                for (; i <= j; i++) {
                    tempAnchor = getTempPageNumberAnchor();

                    //if this is current page then bold this number
                    if (i === this._currentPageNumber) {
                        tempAnchor.setAttribute('class', this._pageButtonActiveCss);
                        tempAnchor.style.fontWeight = 'bold';
                    }
                    else {
                        tempAnchor.setAttribute('class', this._pageButtonNormalCss);
                    }
                    pageClickEvent = DrawGridByPage.bind(this, [i]);
                    tempAnchor.onclick = pageClickEvent;
                    tempAnchor.innerHTML = i;
                    paginationDiv.appendChild(tempAnchor);
                    paginationDiv.appendChild(getNbspElement());
                }
                if (this._currentPageNumber < j) {
                    //'>' anchor
                    tempAnchor = getTempPageNumberAnchor();

                    tempAnchor.setAttribute('class', this._pageButtonNormalCss);
                    tempAnchor.innerHTML = '>';
                    pageClickEvent = DrawGridByPage.bind(this, [this._currentPageNumber + 1]);
                    tempAnchor.onclick = pageClickEvent;
                    paginationDiv.appendChild(tempAnchor);
                }
            }

            //finally set the grid's inner html
            
            this._grid.innerHTML = '';
            this._grid.appendChild(finalGrid);

            //append the pagination to the grid
            if (this._hasPagination) {
                this._grid.appendChild(paginationDiv);
            }
            //lets bind the input elements to the data source
            if (this._bindInput) {
                BindInputs.call(this, inputBindings);
            }
            //call grid loaded event handler
            CallEventFunction(this._onGridLoaded);

            return this;
        },

        //re-draw a specific row binding the new data.
        reDrawRow: function () {
            var rowIndex = arguments[0],
                dataRow = d.querySelector("#" + this._gridID + '_dataRow_' + rowIndex),
                output = null;
            dataRow.innerHTML = '';
            output = GetDataRow.call(this, rowIndex, null, false, null);
            dataRow.innerHTML = output.dataRow.innerHTML;

            //call row redraw complete event
            if (!IsNullOrUndefined(this._onRowRedrawComplete)) {
                this._onRowRedrawComplete(this._dataSource, rowIndex);
            }
            BindInputs.call(this, output.inputBindings);
            return this;
        },

        //this is to set alternate colors or custom color sequence for the rows
        setDataRowColors: function (colors) {
            if (colors.length && typeof colors !== '[Object object]')
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
            for (var dataChange in dataChanges) {
                dataUpdates.push(dataChange);
            }
            return dataUpdates;
        },

        //set the page number and draw the grid again
        drawGridByPage: function (e) {
            //call 'boforeGridPageChangeEvent'
            if (!IsNullOrUndefined(this._beforeGridPageChange))
                this._beforeGridPageChange(e[0]);
            //only load next page if allowed
            if (this._allowPageChange) {
                this._currentPageNumber = e[0];
                //call grid page chage event handler
                CallEventFunction(this._onGridPageChange);
                this.reDraw();
            }
            return false;
        }
    };

    //function to check if the passed argument is a function or not
    function isFunction(f) {
        return (typeof f === 'function');
    }

    //function to get whitespace span element
    function getNbspElement() {
        var nbsp = d.createElement('span');
        nbsp.innerHTML = '&nbsp;'
        return nbsp;
    }

    //function to return anchor for page numbers
    function getTempPageNumberAnchor() {
        var tempAnchor = d.createElement('a');
        tempAnchor.setAttribute('href', '#');
        tempAnchor.style.textDecoration = 'none';
        tempAnchor.style.paddingLeft = '2px';
        tempAnchor.style.paddingRight = '2px';
        tempAnchor.style.display = 'inline-block';

        return tempAnchor;
    }

    //function to call event handler functions
    function CallEventFunction(func) {
        if (!IsNullOrUndefined(func)
                && typeof (func) === 'function') {
            func();
        }
    }

    //function to bind inputs to the data source
    function BindInputs(inputBindings) {
        var i = 0,                                                          //counter
            currentRow,
            bindInputDelegate,                                              //delegate to bind inputs to the data source
            currentElement;

        for (; i < inputBindings.length; i++) {
            currentRow = inputBindings[i];                                  //reusing currentRow var here
            currentElement = this._grid.querySelector("#" + currentRow.id); //reusing currentElement var here
            bindInputDelegate = BindInput.bind(currentElement, [this
                , currentRow.rowIndex, currentRow.propToBind]);

            //set the correct event handler based on type of input
            switch (currentElement.type) {
                case INPUT_TEXT:
                case INPUT_NUMBER:
                case INPUT_PASSWORD:
                case INPUT_SEARCH:
                case INPUT_TEL:
                case INPUT_URL:
                case INPUT_EMAIL:
                case INPUT_TIME:
                case INPUT_DATETIME:
                case INPUT_DATE:
                case INPUT_MONTH:
                case INPUT_WEEK:
                    currentElement.onchange = bindInputDelegate;
                    break;
                case INPUT_CHECBOX:
                    currentElement.onclick = bindInputDelegate;
                    break;
            }
        }
    }

    //Function to return a data row after parsing its contents
    function GetDataRow(startRow, inputBindings, setColor, colorIdx) {
        var dataRow,
            dataCol = null,
            dataColChildren = null,
            currentElement = null,                                          // used to process html elements
            currentRow = "",
            setDataRowBackColor = this._dataRowBackColors.length > 0,       //set background colors if we have any added to the list
            j = 0,
            k = 0,
            dataColumns = this._dataElement.querySelectorAll(COLUMN_TAG_NAME),
            dataSource = this._dataSource,
            tempAttribute = null,                                           //temp attribute var which can be reused
            returnVal = {};
        
        //set to empty array if undefined or null
        if (IsNullOrUndefined(inputBindings)) { inputBindings = []; }

        dataRow = document.createElement('tr');
        dataRow.setAttribute('id', this._gridID + '_dataRow_' + startRow);
        dataRow.setAttribute('class', this._dataElement.className);

        //set background colors if any provided
        if (setDataRowBackColor) {
            dataRow.style.backgroundColor = this._dataRowBackColors[colorIdx];
        }

        //set mouse over and out color
        if (setColor && this._hasMouseOverColor) {
            dataRow.onmouseover = SetBackgroundColor.bind(null, [dataRow, this._mouseOverColor]);
            dataRow.onmouseout = SetBackgroundColor.bind(null, [dataRow, dataRow.style.backgroundColor]);
        }

        //set the data for each row
        for (; j < dataColumns.length; j++) {
            dataCol = document.createElement("td");
            dataCol.setAttribute("class", dataColumns[j].className);
            dataCol.innerHTML = currentRow = dataColumns[j].innerHTML;

            //set unique IDs for all childrens and input bindings
            dataColChildren = dataCol.children;

            for (; k < dataColChildren.length; k++) {
                currentElement = dataColChildren[k];
                if (currentElement.id !== "") {
                    currentElement.id = dataColChildren[k].id += "_" + startRow;
                    currentElement.setAttribute('rowId', startRow);
                }
                if (this._bindInput) {
                    //input bindings
                    switch (currentElement.tagName.toLowerCase()) {
                        case "input":
                            if (currentElement.getAttribute('model')) {
                                inputBindings.push(GetInputBinding(currentElement, startRow));
                                switch (currentElement.type) {
                                    case INPUT_TEXT:
                                    case INPUT_NUMBER:
                                    case INPUT_PASSWORD:
                                    case INPUT_SEARCH:
                                    case INPUT_TEL:
                                    case INPUT_URL:
                                    case INPUT_EMAIL:
                                    case INPUT_TIME:
                                    case INPUT_DATETIME:
                                    case INPUT_DATE:
                                    case INPUT_MONTH:
                                    case INPUT_WEEK:
                                        tempAttribute = d.createAttribute("value");
                                        tempAttribute.value = currentElement.getAttribute('model');
                                        dataColChildren[k].setAttributeNode(tempAttribute);
                                        break;
                                    case INPUT_CHECBOX:
                                        if (ReplaceToken(currentElement.getAttribute('model')
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
            currentRow = ReplaceToken(dataCol.innerHTML
                , dataSource
                , startRow
                , this._customFunctions
                , this._hasCustomBindings)
            dataCol.innerHTML = currentRow;
            dataRow.appendChild(dataCol);
        }
        //row add event handling
        if (this._hasRowAddHandler) {
            dataRow = this._rowAddHandler(dataRow, dataSource, startRow);
        }

        //finally return the row
        returnVal['dataRow'] = dataRow;
        returnVal['inputBindings'] = inputBindings;
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
            case INPUT_TEXT:
            case INPUT_NUMBER:
            case INPUT_PASSWORD:
            case INPUT_SEARCH:
            case INPUT_TEL:
            case INPUT_URL:
            case INPUT_EMAIL:
            case INPUT_TIME:
            case INPUT_DATETIME:
            case INPUT_DATE:
            case INPUT_MONTH:
            case INPUT_WEEK:
                value = this.value;
                break;
            case INPUT_CHECBOX:
                value = this.checked;
                break;
        }
        //this needs more work as heirarchichal binds are not supported
        grid._dataSource[rowIndex][propertyName] = value;
        grid._dataChanges["row" + rowIndex] = grid._dataSource[rowIndex];

        //lets refresh the current row data here to update all the value bindings.
        if (grid._updateRowOnDataChange) {
            grid.reDrawRow.call(grid, rowIndex);
        }
    }

    //Set the background color of the html element passed in the even parameters
    function SetBackgroundColor(e) {
        var el = e[0],
            color = e[1];
        el.style.backgroundColor = color;
    }

    //set the page number and draw the grid again
    function DrawGridByPage(e) {
        //call 'boforeGridPageChangeEvent'
        if (!IsNullOrUndefined(this._beforeGridPageChange))
            this._beforeGridPageChange(e[0]);
        //only load next page if allowed
        if (this._allowPageChange) {
            this._currentPageNumber = e[0];
            //call grid page chage event handler
            CallEventFunction(this._onGridPageChange);
            this.reDraw();
        }
        return false;
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
            data = dataSource[rowIndex],
            evaluatedToken = null;

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
                        evaluatedToken = EvalToken(data, tokenName);
                        output = output.replace(token, (IsNullOrUndefined(evaluatedToken) ? '' : evaluatedToken));
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
        var func = f.replace('()', ''),
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
    function IsNullOrUndefined(obj) {
        return obj === null || obj === undefined;
    }

    w['GridJS'] = gridJS;

})(window, document);
