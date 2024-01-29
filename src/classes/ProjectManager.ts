import { IProject, Project } from "./Project";
import { updateTodoList } from '../index';

export interface ExportedProject {
    project: IProject;
    todos: IToDo[];
}

export class ProjectManager {
    // Lista de proyectos gestionados por el ProjectManager
    list: Project[] = [];
    
    // Elemento de interfaz de usuario donde se visualizarán los proyectos
    ui: HTMLElement;

    // Constructor que toma un contenedor HTML donde se mostrarán los proyectos
    constructor(container: HTMLElement) {
        this.ui = container;
    }
    
    newProject(data: IProject): Project {
        // Verifica si el nombre del proyecto ya está en uso
        const projectNames = this.list.map((project) => project.name);
        const nameInUse = projectNames.includes(data.name);
    
        // Lanzar un error si el nombre ya está en uso
        if (nameInUse) {
            throw new Error(`El proyecto con nombre "${data.name}" ya existe.`);
        }
    
        // Crear una nueva instancia de la clase Project con los datos proporcionados
        const project = new Project(data);
    
        //espera click, cuando se pulsa un proyecto se oculta el proyecto se muestran los detalles
        project.ui.addEventListener("click",()=>{
            const projectsPage=document.getElementById("project-page")
            const detailsPage=document.getElementById("project-details")
            if(!projectsPage|| !detailsPage){
                return
            }
            projectsPage.style.display="none"
            detailsPage.style.display="flex"
            this.setDetailsPage(project)
            
        })
        // Agregar la interfaz de usuario del proyecto al contenedor principal
        this.ui.append(project.ui);
    
        // Agregar el proyecto a la lista de proyectos gestionados
        this.list.push(project);
    
        return project;
    }


    getTotalCost() {
        let totalCost = 0;
        this.list.forEach((project) => {
            totalCost += project.cost;
        });

    console.log("Coste total de los proyectos: "+totalCost)
          //   return totalCost;
    }

    getNameProject(name:string){
        const project=this.list.find((project)=>{
            return project.name===name;
        })
        console.log("El nombre es: "+project)
    }
    

    private setDetailsPage(project:Project){
        console.log("Contenido de project:", project);

        const detailsPage=document.getElementById("project-details")
        if(!detailsPage){return}

        //actualiza datelles en cabecera de detalles-proyecto
        const nameHeader = detailsPage.querySelector("[data-project-info='name']");
        const descriptionHeader = detailsPage.querySelector("[data-project-info='description']");

        if (nameHeader) {
            nameHeader.textContent = project.name;
        }

        if (descriptionHeader) {
            descriptionHeader.textContent = project.description;
        }

        //actualiza datelles en card de detalles-proyecto
        const name=detailsPage.querySelector("[data-project-info='name2']") 
        if(name) {name.textContent=project.name}

        const description=detailsPage.querySelector("[data-project-info='description2']") 
        if(description) {description.textContent=project.description}

        const estado=detailsPage.querySelector("[data-project-info='estado2']") 
        if(estado) {estado.textContent=project.status}

        const coste = detailsPage.querySelector("[data-project-info='coste2']");
        if (coste) {coste.textContent = project.cost.toString();}

        const role=detailsPage.querySelector("[data-project-info='role2']") 
        if(role) {role.textContent=project.userRole}

        const fechafin = detailsPage.querySelector("[data-project-info='fecha-fin2']");
        if (fechafin) {
            let fechaObjeto = new Date(project.finishDate);
            fechafin.textContent = fechaObjeto.toDateString();
        }

        const progress = detailsPage.querySelector("[data-project-info='progress']") as HTMLElement;
        if (progress) {
            progress.style.width=project.progress+"%"
            progress.textContent=project.progress+"%"
        }

        const iniciales= detailsPage.querySelector("[data-project-info='iniciales']");
        if(iniciales){iniciales.textContent=project.name.slice(0, 2).toUpperCase()}

        const todoListElement = detailsPage.querySelector("#todo-list");

        // Actualiza la lista de todos con los todos del proyecto actual
        if (todoListElement) {
            updateTodoList(project.todos, todoListElement);
        }
    }

    getProject(id: string): Project | undefined {
        const project = this.list.find((project) => project.id === id);
        return project;
    }

    getProjectName(name: string): Project | undefined {
        const project = this.list.find((project) => project.name === name);
        return project;
    }

    //  elimina un proyecto por su identificador
    deleteProject(id: string): void {
        const project = this.getProject(id);
    
        // Si no se encuentra el proyecto, no hacer nada
        if (!project) {
            return;
        }
    
        // Eliminar la interfaz de usuario del proyecto
        project.ui.remove();
    
        // Filtrar la lista para obtener los proyectos restantes
        const remaining = this.list.filter((project) => project.id !== id);
    
        // Actualizar la lista de proyectos gestionados
        this.list = remaining;
    }


    
    exportToJSON(fileName: string = "projects"): void {
             // Crear un array para almacenar la información exportada de cada proyecto
             const exportedProjects: ExportedProject[] = [];

             // Iterar sobre la lista de proyectos
             this.list.forEach((project) => {
                 // Crear un objeto con la información del proyecto y sus todos
                 const exportedProject: ExportedProject = {
                     project: {
                         name: project.name,
                         description: project.description,
                         // ... otras propiedades del proyecto
                     },
                     todos: project.todos,
                 };
     
                 // Agregar el objeto a la lista de proyectos exportados
                 exportedProjects.push(exportedProject);
             });
        // Convertir la lista de proyectos a formato JSON
        const json = JSON.stringify(this.list, null, 2);
    
        // Crear un objeto Blob con el JSON y configurar el tipo MIME
        const blob = new Blob([json], { type: 'application/json' });
    
        // Crear una URL para el Blob y configurar un enlace de descarga
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
    
        // Simular un clic en el enlace para iniciar la descarga
        a.click();
    
        // Revocar la URL para liberar recursos
        URL.revokeObjectURL(url);
    }

    
    importToJSON(): void {
        // Crear un elemento de entrada de archivo
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
    
        // Crear un lector de archivos
        const reader = new FileReader();
    
        // Manejar el evento de carga del lector
        reader.addEventListener("load", () => {
            const json = reader.result;
    
            // Salir si no hay datos JSON
            if (!json) {
                return;
            }
            // Parsear el JSON y agregar los proyectos a la lista
            const projects: IProject[] = JSON.parse(json as string);
            for (const project of projects) {
                try {
                    this.newProject(project);
                } catch (error) {
                    // Manejar errores si ocurren durante la creación de proyectos
                }
            }
        });

        // Manejar el evento de cambio del elemento de entrada de archivo
        input.addEventListener('change', () => {
            const fileList = input.files;
    
            // Salir si no hay archivos en la lista
            if (!fileList) {
            return;
            }
    
            // Leer el contenido del archivo como texto
            reader.readAsText(fileList[0]);
        });

        // Simular un clic en el elemento de entrada de archivo para abrir el cuadro de diálogo de selección de archivos
        input.click();
    }

    editProject(id: string, newData: IProject): void {
        const project = this.getProject(id);

        if (!project) {
            console.error(`No se encontró un proyecto con el ID ${id}`);
            return;
        }

        // Actualizar la información del proyecto con los nuevos datos
        project.name = newData.name;
        project.description = newData.description;
        project.status = newData.status;
        project.userRole = newData.userRole;
        project.finishDate = newData.finishDate;

        // Actualizar la interfaz de usuario
        this.updateProjectUI(project);
    }

    updateProjectUI(project: Project): void {
        // Actualiza la interfaz de detalles del proyecto
        this.setDetailsPage(project);
    
        // Actualiza la interfaz de la tarjeta de proyecto
        const projectCard = this.findProjectCard(project.id);
        if (projectCard) {
            console.log(projectCard)
            project.updateUI();
        }
    }
    
    private findProjectCard(projectId: string): HTMLElement | null {
    const projectCards = this.ui.querySelectorAll('.project-card');
    for (const card of projectCards) {
        const projectIdAttribute = card.getAttribute('data-project-id');
        if (projectIdAttribute === projectId) {
            return card as HTMLElement;
        }
    }
    return null;
}
   

}
