;
(function (w) {

    //function to hide source code popup
    function hideCode() {
        App.Helper.HideCode();
    }

    //show todo grid sample code
    function showTodoGridCode(){
        App.Helper.ShowCode(App.GridSampleCode.TodoGridSampleCode);
    }

    //show country grid sample code
    function showCountryGridCode() {
        App.Helper.ShowCode(App.GridSampleCode.CountryGridSampleCode);
    }

    //show northwind grid sample code
    function showNorthwindGridCode() {
        App.Helper.ShowCode(App.GridSampleCode.NorthwindGridSampleCode);
    }

    //show shopping grid sample code
    function showShoppingGridCode() {
        App.Helper.ShowCode(App.GridSampleCode.ShoppingGridSampleCode);
    }

    //show bound northwind grid sample code
    function showBoundNorthwindGridCode() {
        App.Helper.ShowCode(App.GridSampleCode.BoundNorthwindGridSampleCode);
    }

    //show validation grid sample code
    function showValidationGridCode() {
        App.Helper.ShowCode(App.GridSampleCode.ValidationNorthWindGridSampleCode);
    }

    //show custom editable grid sample code
    function showCustomEditableGridCode() {
        App.Helper.ShowCode(App.GridSampleCode.CustomEditableGridSampleCode);
    }
    

    //attach to the namespace
    App.Events['HideSourceCode'] = hideCode;
    App.Events['ShowTodoGridCode'] = showTodoGridCode;
    App.Events['ShowCountryGridCode'] = showCountryGridCode;
    App.Events['ShowNorthwindGridCode'] = showNorthwindGridCode;
    App.Events['ShowShoppingGridCode'] = showShoppingGridCode;
    App.Events['ShowBoundNorthwindGridCode'] = showBoundNorthwindGridCode;
    App.Events['ShowValidationGridCode'] = showValidationGridCode;
    App.Events['ShowCustomEditableGridCode'] = showCustomEditableGridCode;
})(window);