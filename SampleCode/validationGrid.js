<pre class="brush: js">
var validationNorthWindGrid,
    vManager,
    shipNameValidatorList = [],
    shipCityValidatorList = [],
    shipCountryValidatorList = [];

vManager = new ValidationManager()
.showPassImgNotification(false);

validationNorthWindGrid = new GridJS({
    gridId: 'validationGrid',
    dataSource: NorthWindDataSource,
    cellPadding: 6,
    pagination: 10,
    pageButtonCss: { normalCss: 'NorthWindValidationGridButton', activeCss: 'NorthWindValidationActiveButton' },
    onGridLoaded: OnValidationGridLoaded,
    onGridPageChange: OnGridPageChange,
    onRowAddition: onGridRowAdd,
    beforeGridPageChange: BeforeGridPageChange,
    updateDataRowOnInputChange: false
})
.addCustomFunction("GetOrderDate", GetOrderDate)
.addCustomFunction("GetShippedDate", GetShippedDate)
.addCustomFunction("GetShipNameValidator", GetShipNameValidator)
.addCustomFunction("GetShipCityValidator", GetShipCityValidator)
.addCustomFunction("GetShipCountryValidator", GetShipCountryValidator)
.draw();        

//GetOrderDate1
function GetOrderDate(data, rowIndex) {
    var date = new Date(Date.parse(data[rowIndex].OrderDate));
    return getDate(date);
}

//GetShippedDate1
function GetShippedDate(data, rowIndex) {
    var date = new Date(Date.parse(data[rowIndex].ShippedDate));
    return getDate(date);
}

function BeforeGridPageChange(dataSource, rowIndex) {
    var isValid = vManager.validateAll();
    if (!isValid) validationNorthWindGrid.allowPageChange(false);
    else validationNorthWindGrid.allowPageChange(true);
}

function onGridRowAdd(dataRow, dataSource, rowIndex) {
    var shipNameValidator = "valShipName_" + rowIndex,
        shipCityValidator = "valShipCity_" + rowIndex,
        shipCountryValidator = "valShipCountry_" + rowIndex;

    shipNameValidatorList.push(shipNameValidator);
    shipCityValidatorList.push(shipCityValidator);
    shipCountryValidatorList.push(shipCountryValidator);

    return dataRow;
}

//returns meaningful date format
function getDate(rawDate) {
    var month = rawDate.getMonth(),
        day = rawDate.getDate(),
        year = rawDate.getYear();
    return month + "/" + day + "/" + year;
}

function OnValidationGridLoaded() {
    vManager.addValidator(shipNameValidatorList, [{ type: ValidationType.Required, message: "Ship Name is required." }])
        .addValidator(shipCityValidatorList, [{ type: ValidationType.Required, message: "Ship City is required." }])
        .addValidator(shipCountryValidatorList, [{ type: ValidationType.Required, message: "Ship Country is required." }])
    .initialize();
}

function OnGridPageChange() {
    //reset the validator lists before grid new page is loaded
    shipNameValidatorList = [];
    shipCityValidatorList = [];
    shipCountryValidatorList = [];
    vManager.clearValidators();
}

function GetShipNameValidator(data, rowIndex) {
    return "valShipName_" + rowIndex;
}

function GetShipCityValidator(data, rowIndex) {
    return "valShipCity_" + rowIndex;
}

function GetShipCountryValidator(data, rowIndex) {
    return "valShipCountry_" + rowIndex;
}
</pre>