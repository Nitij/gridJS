<pre class="brush: js">
var customEditableGrid = new GridJS({
    gridId: 'customEditableGrid',
    dataSource: OfficeRooms,
    cellPadding: 8,
    dataRowColors: ["white", "#E0E0E0"]
})
.addCustomFunction('getEditDisplay', getEditDisplay)
.addCustomFunction('getDoneDisplay', getDoneDisplay)
.addCustomFunction('getDivDoneDisplay', getDivDoneDisplay)
.draw();

function getEditDisplay(data, rowIndex) {
    if (data[rowIndex].edit) return 'inline'
    else return 'none';
}

function getDoneDisplay(data, rowIndex) {
    if (!data[rowIndex].edit) return 'inline'
    else return 'none';
}

function getDivDoneDisplay(data, rowIndex) {
    if (!data[rowIndex].edit) return 'block'
    else return 'none';
}

function customEditableGridEdit(self) {
    var rowId = self.getAttribute('rowId'),
        doneButtonId = 'doneButton' + '_' + rowId,
        doneButton = document.getElementById(doneButtonId);

    self.style.display = 'none';
    doneButton.style.display = 'inline';

    OfficeRooms[rowId].edit = true;
    customEditableGrid.reDrawRow(rowId);
}

function customEditableGridDone(self) {
    var rowId = self.getAttribute('rowId'),
        editButtonId = 'editButton' + '_' + rowId,
        editButton = document.getElementById(editButtonId);

    self.style.display = 'none';
    editButton.style.display = 'inline';

    OfficeRooms[rowId].edit = false;
    customEditableGrid.reDrawRow(rowId);
}

function addNewRoomRecord() {
    var $txtAddRoomName = $('#txtAddRoomName');
    var $txtAddRoomType = $('#txtAddRoomType');
    var $txtAddRoomColor = $('#txtAddRoomColor');

    OfficeRooms.push({
        roomName: $txtAddRoomName.val(),
        roomType: $txtAddRoomType.val(),
        color: $txtAddRoomColor.val(),
        edit: false
    });

    $txtAddRoomName.val('');
    $txtAddRoomType.val('');
    $txtAddRoomColor.val('');

    customEditableGrid.reDraw();
}
</pre>