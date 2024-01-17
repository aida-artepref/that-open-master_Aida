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
        
        const projectName = formData.get("name") as string;
        if (projectName.length < 5) {
            const mensaje = document.getElementById("err") as HTMLElement;
            mensaje.textContent = "El nombre del proyecto debe tener al menos 5 caracteres.";
            toggleModal("error");
            return;
        }
        const projectDate = formData.get("finishDate") as string;
        let finishDate;
        if (projectDate) {
            finishDate = new Date(projectDate);
        } else {
            finishDate = new Date();
        }

        const projectData: IProject = {
            name: projectName,
            description: formData.get("description") as string,
            userRole: formData.get("userRole") as UserRole,
            status: formData.get("status") as ProjectStatus,
            finishDate: finishDate,
        };
        try{
            const project = projectManager.newProject(projectData)
            projectForm.reset()
            toggleModal("new-project-modal")
            projectManager.getNameProject(projectData.name)
        } catch(error){
           // window.alert(error)
            const mensaje=document.getElementById("err") as HTMLElement
            mensaje.textContent=error
            toggleModal("error")

        }
        projectManager.getTotalCost();
    })
} else {
    console.warn("The project form was not found. Check the ID!")
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



const btnError=document.getElementById("btnError")
if(btnError){
    btnError.addEventListener("click",()=>{
        toggleModal("error")
    })
}

/*M2-3.8  cierra ventana dialogo*/
const cancelBtn=document.getElementById("cancela-btn")
if(cancelBtn){
    cancelBtn.addEventListener("click",()=>{
        toggleModal("new-project-modal")
    })
}

function toggleModal(id : string){
    const modal=document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement) {
        if(modal.open)
            modal.close();
        else +
            modal.showModal()
        }
    else console.warn("Id is not found" , id)
}

// Obtén una referencia al elemento con el ID "project-list"
var projectList = document.getElementById("project-list");

if (projectList) {
    // Obtén la primera tarjeta dentro de "project-list"
    var firstCard = projectList.querySelector('.project-card');

    if (firstCard) {
        // Elimina  del DOM
        firstCard.remove();
    } else {
        console.warn("No se encontró ninguna tarjeta para eliminar.");
    }
} else {
    console.warn("No se encontró el elemento con el ID 'project-list'.");
}

const btnEdit = document.getElementById('btnEdit');
const editProjectModal = document.getElementById('edit-project-modal');
if (btnEdit && editProjectModal) {
    btnEdit.addEventListener('click', () => {
        const projectNameElement = document.querySelector('[data-project-info="name2"]');
        const projectDescriptionElement = document.querySelector('[data-project-info="description2"]');
        const projectStatusElement = document.querySelector('[data-project-info="estado2"]');
        const projectCostElement = document.querySelector('[data-project-info="coste2"]');
        const projectRoleElement = document.querySelector('[data-project-info="role2"]');
        const projectDateElement = document.querySelector('[data-project-info="fecha-fin2"]');

        const editProjectNameInput = document.querySelector('[name="nameEdit"]') as HTMLInputElement;
        const editProjectDescriptionInput = document.querySelector('[name="descriptionEdit"]') as HTMLInputElement;
        const editProjectStatusInput = document.querySelector('[name="statusEdit"]') as HTMLSelectElement;
        const editProjectRoleInput = document.querySelector('[name="userRoleEdit"]') as HTMLSelectElement;
        const editProjectFinishdateInput = document.querySelector('[name="finishDate"]') as HTMLInputElement;
        const editProjectCostInput = document.querySelector('[name="coste"]') as HTMLInputElement;

        if (projectNameElement && projectDescriptionElement && projectStatusElement && projectCostElement &&
            projectRoleElement && projectDateElement && editProjectNameInput && editProjectDescriptionInput &&
            editProjectStatusInput && editProjectRoleInput && editProjectFinishdateInput && editProjectCostInput) {

            const projectName = projectNameElement.textContent ?? "";
            const projectDescription = projectDescriptionElement.textContent ?? "";
            const projectStatus = projectStatusElement.textContent ?? "";
            const projectCost = projectCostElement.textContent ?? "";
            const projectRole = projectRoleElement.textContent ?? "";

            // La fecha en formato de texto (ejemplo: "Wed Jan 17 2024")
            const projectDateText = projectDateElement.textContent ?? "";

            // Convierte la fecha de texto a un objeto Date
            const projectDate = new Date(projectDateText);

            // Asigna los datos del proyecto a los campos del formulario
            editProjectNameInput.value = projectName;
            editProjectDescriptionInput.value = projectDescription;
            editProjectRoleInput.value = projectRole;
            editProjectStatusInput.value = projectStatus;

            // Asigna la fecha al campo de fecha del formulario
            const formattedDate = `${projectDate.getFullYear()}-${(projectDate.getMonth() + 1).toString().padStart(2, '0')}-${projectDate.getDate().toString().padStart(2, '0')}`;
            editProjectFinishdateInput.value = formattedDate;

            // Asigna el coste al campo de coste del formulario
            editProjectCostInput.value = projectCost;

            // Muestra el modal de edición
            showModal('edit-project-modal');
        } else {
            console.error('Los elementos de proyecto o de edición no se encontraron.');
        }
    });
}
