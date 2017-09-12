/// <reference path="../node_modules/@types/jquery/index.d.ts"/>  
/// <reference path="../node_modules/@types/bootstrap/index.d.ts"/>  
/// <reference path="../node_modules/@types/jqueryui/index.d.ts"/>

class BaseTodo<T> {
    list:Array<T>;

    constructor(private type:string){

    }
    create(data:T){
        this.list.push(data);
    }
    delete(data:T){
        var deleteIndex=this.list.indexOf(data);
        this.list.splice(deleteIndex,1);
    }
    render(){

    }
}
//todo內容物的interface
interface todoItem{
    content:any;
    status:todoStatus;
}
//todoStatus的枚舉
enum todoStatus{
    done,
    undo
}

class TodoService extends BaseTodo<todoItem>{
    constructor(){
        super("todoItem");
    }
    render():void{
        let doneHtml='';
        let undoHtml='';
        this.list.forEach(item=>{
            if(item.status == todoStatus.done){
                doneHtml += `<li>${item.content}<button class="remove-item btn btn-default btn-xs pull-right">X</button></li>`;
            }else if(item.status == todoStatus.undo){
                undoHtml += `<li class="ui-state-default"><div class="checkbox"><label><input type="checkbox" value="" />${item.content}</label></div></li>` ;
            }
        });
        $('#done-items').html(doneHtml);
        $('#sortable').html(undoHtml);
        $('.add-todo').val('');//remove input text
        let itemNum = this.list.length;
        $('.count-todos').html(itemNum.toString());
    }

    delete(data:todoItem){
        data.status = todoStatus.done;
    }

    init(){
        var list = localStorage.getItem("todoList");
        if(!list){
            // localStorage未存有值時建立新array(todoItem格式)
            this.list = new Array<todoItem>();
        }else{
            this.list = JSON.parse(list);
            console.log(this.list);
        }
        //瀏覽器關閉時儲存list清單
        window.onbeforeunload = e =>{
            localStorage.setItem("todoList",JSON.stringify(this.list));
        }
        $('.add-todo').on('keypress',e => {
            e.preventDefault;
            if (e.which == 13) {
                if($(e.target).val() != ''){
                    var todo = $(e.target).val();
                    this.create({
                        content : $(e.target).val() ,
                        status : todoStatus.undo 
                    });
                    this.render();                 
                }else{
                    // some validation
                }
            }
        });
        // mark task as done
        $('.todolist').on('change','#sortable li input[type="checkbox"]',(e)=>{
            var self = e.target;
            var text = $(self).parent().text();
            if($(self).prop('checked')){
                var doneItem = this.list.filter((i)=>{return text == i.content;})[0];//filter回傳是陣列，所以選取第0項
                this.delete(doneItem);
                this.render();
            }
        });
        //remove
        $('.todolist').on('click','#done-items li button.remove-item' ,(e)=>{
            var text = $(e.target).parent().parent().text();
            var removeItem = this.list.filter((i)=>{return text == i.content;})[0]; 
            var index = this.list.indexOf(removeItem);
            this.list.splice(index,1) ;
            this.render();
        });
        //all done
        $('#checkAll').on('click',e=>{
            this.list.forEach(item=>{
                item.status = todoStatus.done;
            });
            this.render();
        })


        this.render();
    }
}

var todoService = new TodoService();
todoService.init();