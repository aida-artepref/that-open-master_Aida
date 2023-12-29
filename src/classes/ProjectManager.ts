import { IProject, Project } from "./Project";

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
            if(!projectsPage|| !detailsPage){return}
            projectsPage.style.display="none"
            detailsPage.style.display="flex"
            
        })
        // Agregar la interfaz de usuario del proyecto al contenedor principal
        this.ui.append(project.ui);
    
        // Agregar el proyecto a la lista de proyectos gestionados
        this.list.push(project);
    
        // Devolver la instancia del proyecto recién creado
        return project;
    }

    
    getProject(id: string): Project | undefined {
        const project = this.list.find((project) => project.id === id);
        return project;
    }

    getProjectNome(name: string): Project | undefined {
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
}
