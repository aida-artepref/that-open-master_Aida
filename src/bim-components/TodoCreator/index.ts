import * as OBC from "openbim-components"

interface ToDo{
    description: string
    date:Date
    fragmentMap: OBC.FragmentIdMap
}

export class TodoCreator extends OBC.Component<ToDo[]> implements OBC.UI{
    static uuid="c4984016-818d-4c8b-b93f-e6454ed0a896"
    enabled= true;
    uiElement= new OBC.UIElement<{
        activationButton: OBC.Button
        todoList:OBC.FloatingWindow
    }>()
    private _components:OBC.Components
    private _list: ToDo[]=[]
    // constructor(components:OBC.Components){
    //     super(components)
    //     this._components=components
    //     components.tools.add(TodoCreator.uuid, this)
    //     this.setUI()
    // }
    constructor(components: OBC.Components){
        super(components)
        this._components=components
        components.tools.add(TodoCreator.uuid, this)
        this.setUI()
    }

    addTodo(description: string){
        const todo:ToDo={
            description,
            date: new Date,
            fragmentMap: undefined
        }
    }


    private setUI(){
        const activationButton = new OBC.Button(this._components)
        activationButton.materialIcon="construction"
        
        const newTodoButton= new OBC.Button(this._components, {name:"Crea ToDo"})
        activationButton.addChild(newTodoButton);

        const form = new OBC.Modal(this._components)
        this._components.ui.add(form)
        form.title="Create New ToDo"

        const descriptionInput= new OBC.TextArea(this._components)
        descriptionInput.label="Descripcion"
        form.slots.content.addChild(descriptionInput)

        form.slots.content.get().style.padding="20 px"
        form.slots.content.get().style.display="flex"
        form.slots.content.get().style.flexDirection="column"
        form.slots.content.get().style.rowGap="20px"

        form.onAccept.add(()=>{

        })

        form.onCancel.add(()=> form.visible=false)

        newTodoButton.onClick.add(()=>form.visible=true)

        const todoList = new OBC.FloatingWindow(this._components)
        this._components.ui.add(todoList)
        todoList.visible=false
        todoList.title="To-Do List"

        const todoListBtn=new OBC.Button(this._components, {name:"Lista ToDo"})
        activationButton.addChild(todoListBtn);
        todoListBtn.onClick.add(()=> todoList.visible=!todoList.visible)

        //configura el boton de activacion y distribuye la lista 
        this.uiElement.set({activationButton, todoList})
        
    }

    get(): ToDo[]{
       return this._list
    }

}

// const tool=new TodoCreator()
// TodoCreator.uuid