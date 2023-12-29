import{ IProject, ProjectStatus, UserRole} from "./classes/Project.ts"
import { ProjectManager } from "./classes/ProjectManager.ts"


function showModal(id: string) {
    const modal = document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement) {
        modal.showModal()
    } else {
        console.warn("No se ha encontrado el modal proporcionado. ID: ", id)
    }
}

function closeModal(id: string) {
    const modal = document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement) {
        modal.close()
    } else {
        console.warn("No se ha encontrado el modal proporcionado. ID: ", id)
    }
}

const projectListUI=document.getElementById("project-list") as HTMLElement
const projectManager=new ProjectManager(projectListUI)




const newProjectBtn=document.getElementById("new-proyect-btn");
if (newProjectBtn) {
    newProjectBtn.addEventListener("click", () => {showModal("new-project-modal")})
} else {
    console.warn("No se ha encontrado el botón de nuevos proyectos")
}

const projectForm = document.getElementById("new-project-form")
if (projectForm && projectForm instanceof HTMLFormElement) {
    projectForm.addEventListener("submit", (e) => {
        e.preventDefault(); 
        const formData = new FormData(projectForm)
        
        const projectData: IProject = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            userRole: formData.get("userRole") as UserRole,
            status: formData.get("status") as ProjectStatus,
            finishDate: new Date(formData.get("finishdate")as string)
        };
        try{
            const project = projectManager.newProject(projectData)
            projectForm.reset()
            closeModal("new-project-modal")
        } catch(error){
            window.alert(error)
        }
        
    })
} else {
    console.warn("The project form was not found. Check the ID!")
}

const cancelBtn=document.getElementById("cancela-btn")
if(cancelBtn){
    cancelBtn.addEventListener("click",()=>{
        closeModal("new-project-modal")
    })
}

const exportProjectsBtn=document.getElementById("export-projects-btn")
if(exportProjectsBtn){
    exportProjectsBtn.addEventListener("click",()=>{
        projectManager.exportToJSON()
    })
}

const importProjectsBtn=document.getElementById("import-projects-btn")
if(importProjectsBtn){
    importProjectsBtn.addEventListener("click",()=>{
        projectManager.importToJSON()
    })
}

const btnProyectos=document.getElementById("btn-proyectos")
if (btnProyectos) {
    btnProyectos.addEventListener("click",()=>{
        const projectsPage=document.getElementById("project-page")
        const detailsPage=document.getElementById("project-details")
        if(!projectsPage|| !detailsPage){return}
        projectsPage.style.display="flex"
        detailsPage.style.display="none"
        
    })
}