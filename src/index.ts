import{ IProject, ProjectStatus, UserRole, IToDo} from "./classes/Project.ts"
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
        // obtiene nombre del proyecto desde la interfaz de usuario
        const projectNameElement = document.querySelector('[data-project-info="name2"]');
        const projectName = projectNameElement?.textContent || "";

        // Encuentra el proyecto en la lista de proyectos gestionados por ProjectManager
        const project = projectManager.getProjectName(projectName);

        if (project) {
            // Obtén los elementos del formulario de edición
            const editProjectNameInput = document.querySelector('[name="nameEdit"]') as HTMLInputElement;
            const editProjectDescriptionInput = document.querySelector('[name="descriptionEdit"]') as HTMLInputElement;
            const editProjectStatusInput = document.querySelector('[name="statusEdit"]') as HTMLSelectElement;
            const editProjectRoleInput = document.querySelector('[name="userRoleEdit"]') as HTMLSelectElement;
            const editProjectFinishdateInput = document.querySelector('[name="finishDate"]') as HTMLInputElement;
            const editProjectCostInput = document.querySelector('[name="coste"]') as HTMLInputElement;

            if (editProjectNameInput && editProjectDescriptionInput &&
                editProjectStatusInput && editProjectRoleInput &&
                editProjectFinishdateInput && editProjectCostInput) {

                // los datos del proyecto pasan a llenar el formulario de edición
                editProjectNameInput.value = project.name;
                editProjectDescriptionInput.value = project.description;
                editProjectRoleInput.value = project.userRole;
                editProjectStatusInput.value = project.status;

                // Formatea la fecha al formato esperado por el input de fecha
                const formattedDate = `${project.finishDate.getFullYear()}-${(project.finishDate.getMonth() + 1).toString().padStart(2, '0')}-${project.finishDate.getDate().toString().padStart(2, '0')}`;
                editProjectFinishdateInput.value = formattedDate;

                // Asigna el coste al campo de coste del formulario
                editProjectCostInput.value = project.cost.toString();

                showModal('edit-project-modal');
            } else {
                console.error('Los elementos del formulario de edición no se encontraron.');
            }
        } else {
            console.error(`No se encontró un proyecto con el nombre ${projectName}`);
        }
    });
}



const btnCancelaEdita = document.getElementById("cancelaEdita");
const btnAceptaEdita = document.getElementById("aceptaEdita");

if (btnCancelaEdita && btnAceptaEdita) {
    btnCancelaEdita.addEventListener("click", () => {
        closeModal("edit-project-modal"); 
    });
    btnAceptaEdita.addEventListener("click", () => {
        const projectNameElement = document.querySelector('[data-project-info="name2"]');
        const projectName = projectNameElement?.textContent || "";
        const currentProject = projectManager.getProjectName(projectName);

        if (currentProject) {
            // Obtén los elementos del formulario de edición
            const editProjectNameInput = document.querySelector('[name="nameEdit"]') as HTMLInputElement;
            const editProjectDescriptionInput = document.querySelector('[name="descriptionEdit"]') as HTMLInputElement;
            const editProjectStatusInput = document.querySelector('[name="statusEdit"]') as HTMLSelectElement;
            const editProjectRoleInput = document.querySelector('[name="userRoleEdit"]') as HTMLSelectElement;
            const editProjectFinishdateInput = document.querySelector('[name="finishDate"]') as HTMLInputElement;
            const editProjectCostInput = document.querySelector('[name="coste"]') as HTMLInputElement;

            if (editProjectNameInput && editProjectDescriptionInput &&
                editProjectStatusInput && editProjectRoleInput &&
                editProjectFinishdateInput && editProjectCostInput) {

                // Actualiza los campos del proyecto con los valores del formulario
                currentProject.name = editProjectNameInput.value;
                currentProject.description = editProjectDescriptionInput.value;
                currentProject.status = editProjectStatusInput.value;
                currentProject.userRole = editProjectRoleInput.value;
                currentProject.finishDate = new Date(editProjectFinishdateInput.value);
                currentProject.cost = parseFloat(editProjectCostInput.value);
                closeModal("edit-project-modal");
                projectManager.updateProjectUI(currentProject);
            } else {
                console.error('Los elementos del formulario de edición no se encontraron.');
            }
        } else {
            console.error(`No se encontró un proyecto con el nombre ${projectName}`);
        }
    });
}
const btnAddTodo = document.getElementById('add-todo-btn');

if (btnAddTodo) {
    btnAddTodo.addEventListener('click', () => {
        const todoDescriptionInput = document.getElementById("todo-description");
        const todoListElement = document.getElementById("todo-list");

        if (todoDescriptionInput && todoListElement) {
            const todoDescription = todoDescriptionInput.value;

            // Obtén el nombre del proyecto actualmente visualizado
            const projectNameElement = document.querySelector('[data-project-info="name2"]');
            const projectName = projectNameElement?.textContent || "";
            
            // Obtén la instancia del proyecto actual
            const currentProject = projectManager.getProjectName(projectName);

            if (currentProject) {
                // Agrega el ToDo al proyecto
                const newTodo = {
                    description: todoDescription,
                    completed: false,
                };

                currentProject.addTodo(newTodo);

                // Limpia el valor del input después de agregar el ToDo (opcional)
                todoDescriptionInput.value = "";

                // Actualiza y muestra la lista de To-Dos, incluyendo los To-Dos del proyecto actual
                updateTodoList(currentProject.todos, todoListElement);

                // Actualiza la interfaz de usuario del proyecto
                projectManager.updateProjectUI(currentProject);
            }
        }
    });
}

export { updateTodoList };
function updateTodoList(todos, todoListElement) {
    
    // Limpiar la lista existente
    todoListElement.innerHTML = "";

    // Crear y agregar elementos de la lista solo para los To-Dos del proyecto actual
    todos.forEach((todo) => {
        const todoItem = document.createElement("div");
        todoItem.classList.add("todo-item");

        const todoContent = document.createElement("div");
        todoContent.style.display = "flex";
        todoContent.style.justifyContent = "space-between";
        todoContent.style.alignItems = "center";

        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                todoItem.classList.add('checked');
            } else {
                todoItem.classList.remove('checked');
            }
        });
        
        
        const description = document.createElement("p");
        description.textContent = todo.description.description; 

        const date = document.createElement("p");
        date.style.marginLeft = "10px";
        date.textContent = formatDate(new Date()); // fecha actual del sistema

        const deleteIcon = document.createElement("span");
        deleteIcon.innerHTML = "&#128465;"; 
        deleteIcon.style.cursor = "pointer"; 

        // Añadir un evento de clic al icono de papelera para eliminar el ToDo
        deleteIcon.addEventListener("click", () => {
            const projectNameElement = document.querySelector('[data-project-info="name2"]');
            const projectName = projectNameElement?.textContent || "";
            const currentProject = projectManager.getProjectName(projectName);

            if (currentProject) {
                currentProject.deleteTodo(todo.id);
                updateTodoList(currentProject.todos, todoListElement);
                projectManager.updateProjectUI(currentProject);
            }
        });

        todoContent.appendChild(checkbox);
        todoContent.appendChild(description);
        todoContent.appendChild(date);
        todoContent.appendChild(deleteIcon);

        todoItem.appendChild(todoContent);

        todoListElement.appendChild(todoItem);
    });
}
function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
   // const formattedDate = date.toLocaleDateString('en-US', options);
    const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
    return `${weekday},  ${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

