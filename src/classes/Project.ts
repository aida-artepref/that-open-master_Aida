import{v4 as uuidv4} from 'uuid'

export type ProjectStatus= "Pendiente"|"Activo"|"Acabado"
export type UserRole= 'Arquitecto'|'Ingeniero'|'Modelador'

export interface IProject{
        name: string
        description: string
        status:ProjectStatus
        userRole: UserRole
        finishDate: Date  
}


export class Project implements IProject{
        name: string
        description: string
        status: "Pendiente"|"Activo"|"Acabado"
        userRole: "Arquitecto"|"Ingeniero"|"Modelador"
        finishDate: Date

        ui:HTMLDivElement
        cost: number=0
        progress: number=0
        id:string

        constructor(data: IProject){
                // for(const key in data){
                //         this[key]=data[key]
                // }
               // define datos del proyecto
                this.name=data.name
                this.description=data.description
                this.status=data.status
                this.userRole=data.userRole
                this.finishDate=data.finishDate
                this.id=uuidv4()
                this.setUI()
        }

        setUI(){
                if(this.ui){return}
                this.ui=document.createElement("div")
                this.ui.className="project-card"
                this.ui.innerHTML=`
        
                <div class="card-header">
                        <p style="background-color: var(--primary); padding: 10px; border-radius: 8px; aspect-ratio: 1;">HC</p>
                        <div>
                                <h5>${this.name}</h5>
                                <p>${this.description}</p>
                        </div>
                </div>
                <div class="card-content">
                        <div class="card-property">
                                <p style="color:darkgrey">Estado</p>
                                <p>${this.status}</p>
                        </div>
                        <div class="card-property">
                                <p style="color:darkgrey">Role</p>
                                <p>${this.userRole}</p>
                        </div>
                        <div class="card-property">
                                <p style="color:darkgrey">Coste</p>
                                <p>${this.cost}</p>
                        </div>
                        <div class="card-property">
                                <p style="color:darkgrey">Progreso</p>
                                <p>${this.progress*100}%</p>
                        </div>
                </div>
        `
        }
}