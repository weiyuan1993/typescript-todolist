/// <reference path="../node_modules/@types/jquery/index.d.ts"/>  
/// <reference path="../node_modules/@types/bootstrap/index.d.ts"/>  
/// <reference path="../node_modules/@types/jqueryui/index.d.ts"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BaseTodo = /** @class */ (function () {
    function BaseTodo(type) {
        this.type = type;
    }
    BaseTodo.prototype.create = function (data) {
        this.list.push(data);
    };
    BaseTodo.prototype["delete"] = function (data) {
        var deleteIndex = this.list.indexOf(data);
        this.list.splice(deleteIndex, 1);
    };
    BaseTodo.prototype.render = function () {
    };
    return BaseTodo;
}());
//todoStatus的枚舉
var todoStatus;
(function (todoStatus) {
    todoStatus[todoStatus["done"] = 0] = "done";
    todoStatus[todoStatus["undo"] = 1] = "undo";
})(todoStatus || (todoStatus = {}));
var TodoService = /** @class */ (function (_super) {
    __extends(TodoService, _super);
    function TodoService() {
        return _super.call(this, "todoItem") || this;
    }
    TodoService.prototype.render = function () {
        var doneHtml = '';
        var undoHtml = '';
        this.list.forEach(function (item) {
            if (item.status == todoStatus.done) {
                doneHtml += "<li>" + item.content + "<button class=\"remove-item btn btn-default btn-xs pull-right\">X</button></li>";
            }
            else if (item.status == todoStatus.undo) {
                undoHtml += "<li class=\"ui-state-default\"><div class=\"checkbox\"><label><input type=\"checkbox\" value=\"\" />" + item.content + "</label></div></li>";
            }
        });
        $('#done-items').html(doneHtml);
        $('#sortable').html(undoHtml);
        $('.add-todo').val(''); //remove input text
    };
    TodoService.prototype["delete"] = function (data) {
        data.status = todoStatus.done;
    };
    TodoService.prototype.init = function () {
        var _this = this;
        var list = localStorage.getItem("todoList");
        if (!list) {
            // localStorage未存有值時建立新array(todoItem格式)
            this.list = new Array();
        }
        else {
            this.list = JSON.parse(list);
            console.log(this.list);
        }
        //瀏覽器關閉時儲存list清單
        window.onbeforeunload = function (e) {
            localStorage.setItem("todoList", JSON.stringify(_this.list));
        };
        $('.add-todo').on('keypress', function (e) {
            e.preventDefault;
            if (e.which == 13) {
                if ($(e.target).val() != '') {
                    var todo = $(e.target).val();
                    _this.create({
                        content: $(e.target).val(),
                        status: todoStatus.undo
                    });
                    _this.render();
                }
                else {
                    // some validation
                }
            }
        });
        // mark task as done
        $('.todolist').on('change', '#sortable li input[type="checkbox"]', function (e) {
            var self = e.target;
            var text = $(self).parent().text();
            if ($(self).prop('checked')) {
                var doneItem = _this.list.filter(function (i) { return text == i.content; })[0];
                _this["delete"](doneItem);
                _this.render();
            }
        });
        $('.todolist').on('click', '#done-items li button.remove-item', function (evt) {
            var text = $(evt.target).parent().parent().text();
            var removeItem = _this.list.filter(function (i) { return text == i.content; })[0];
            var index = _this.list.indexOf(removeItem);
            _this.list.splice(index, 1);
            _this.render();
        });
        $('#checkAll').on('click', function (e) {
            _this.list.forEach(function (item) {
                item.status = todoStatus.done;
            });
            _this.render();
        });
        this.render();
    };
    return TodoService;
}(BaseTodo));
var todoService = new TodoService();
todoService.init();
