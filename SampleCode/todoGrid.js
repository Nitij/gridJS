﻿<pre class="brush: js">

var todoGrid,
    todo = function (t, d) {
        this.title = t;
        this.done = d;
    },
    todoList = [],
    $txtTodo = $("#txtTodo");


AddTodo = function () {
    todoList.push(new todo($txtTodo.val(), ""));
    todoGrid.reDraw();
    $txtTodo.val("");
}

ClearAllTodo = function () {
    todoList.length = 0;
    todoGrid.reDraw();
}

todoGrid = new GridJS({
    gridId: 'todoGrid',
    dataSource: todoList,
    dataRowColors: ["#FFFFFF", "#FBEFFB", "#EFF8FB", "#FBFBEF", "#FBEFEF"],
    mouseOverColor: '#FFC1C1',
    pagination: 10
})
.addCustomFunction("GetTodoStatus", function (data, rowIndex) {
    if (data[rowIndex]["done"] === true) { return "Done"; }
    else { return "Normal"; }
})
.draw();
</pre>