import * as THREE from "three"
import * as OBC from "openbim-components"
import{GUI} from "three/examples/jsm/libs/lil-gui.module.min"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import{ IProject, ProjectStatus, UserRole, IToDo} from "./classes/Project.ts"
import { ProjectManager } from "./classes/ProjectManager.ts"
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader"
import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader"

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
//const projectManager=new ProjectManager(projectListUI)




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
       // projectManager.getTotalCost();
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

/*
// Visor ---- escena + camara + luces + renderer
const scene= new THREE.Scene()


const viewerContainer=document.getElementById("viewer-container") as HTMLElement;
// const continerDimensions=viewerContainer.getBoundingClientRect()
// const aspectRatio=continerDimensions.width/continerDimensions.height 
const camera = new THREE.PerspectiveCamera(75)
camera.position.z = 5 

const renderer =new THREE.WebGLRenderer({alpha: true , antialias:true})
viewerContainer.append(renderer.domElement)
// renderer.setSize(continerDimensions.width, continerDimensions.height )


//---------- Responsive ---------- 
function resizeViewer(){//cuando la ventana cambia de tamaño
    const containerDimension=viewerContainer.getBoundingClientRect()   // obtenemos la dimension de visor
    renderer.setSize(containerDimension.width,containerDimension.height) //con ese tamaño obtenemos el tamaño del render
    const aspectRatio=containerDimension.width/containerDimension.height   //recalcula la relacion de espacio
    camera.aspect= aspectRatio;  //en la camara
    camera.updateProjectionMatrix() //actualiza propiedades de camara
}

window.addEventListener("resize",resizeViewer) 
resizeViewer()

const geometry= new THREE.BoxGeometry()
const material= new THREE.MeshStandardMaterial()
const cube = new THREE.Mesh(geometry, material )

const directionLight = new THREE.DirectionalLight()
const ambientLight = new THREE.AmbientLight()
ambientLight.intensity=0.5

//scene.add(cube, directionLight, ambientLight )
scene.add( directionLight, ambientLight )


const cameraControls=new OrbitControls(camera, viewerContainer)

function renderScene(){
    renderer.render(scene, camera)
    window.requestAnimationFrame(renderScene)
}

renderScene();

const axes= new THREE.AxesHelper()
const grid =new THREE.GridHelper()
grid.material.transparent=true;
grid.material.opacity=0.4
grid.material.color= new THREE.Color("#grey")

scene.add(grid, axes)

const gui = new GUI()

const cubeControls=gui.addFolder("Cube")
cubeControls.add(cube.position, "x", -10, 10, 1)
cubeControls.add(cube.position, "y", -10, 10, 1)
cubeControls.add(cube.position, "z", -10, 10, 1)
cubeControls.add(cube,"visible")
cubeControls.addColor(cube.material,"color")


const lightControls= gui.addFolder("Luz direccional") // nuevo ayudante de control para la luz direccional
lightControls.add(directionLight.position, "x", -10, 10, 1).name("x");
lightControls.add(directionLight.position, "y", -10, 10, 1).name("y");
lightControls.add(directionLight.position, "z", -10, 10, 1).name("z");
lightControls.addColor(directionLight, "color").name("Color Luz");
lightControls.add(directionLight, "intensity", 0, 100).name("Intensidad");



const objLoader = new OBJLoader()
const mtlLoader= new MTLLoader()


mtlLoader.load("../assets/Gear/Gear1.mtl", (materials) => {
    materials.preload()
    objLoader.setMaterials(materials)
    objLoader.load("../assets/Gear/Gear1.obj", (mesh) => {
        scene.add(mesh)
    })
})
*/
const geometry= new THREE.BoxGeometry()
const material= new THREE.MeshStandardMaterial()
const cube = new THREE.Mesh(geometry, material )


const viewer = new OBC.Components() 
const sceneComponents= new OBC.SimpleScene(viewer)
viewer.scene= sceneComponents
sceneComponents.setup()
const scene=sceneComponents.get()
scene.background= null

const viewerContainer=document.getElementById("viewer-container")as HTMLDivElement
const rendererComponent= new OBC.PostproductionRenderer(viewer,viewerContainer)
viewer.renderer=rendererComponent

const cameraComponent= new OBC.OrthoPerspectiveCamera(viewer)
viewer.camera= cameraComponent

const raycasterComponent= new OBC.SimpleRaycaster(viewer)
viewer.raycaster=raycasterComponent

viewer.init()
cameraComponent.updateAspect()
rendererComponent.postproduction.enabled=true


const ifcLoader = new OBC.FragmentIfcLoader(viewer)
ifcLoader.settings.wasm={
    path:"https://unpkg.com/web-ifc@0.0.43/",
    absolute: true
}
const highlingther= new OBC.FragmentHighlighter(viewer)
highlingther.setup()

const propertiesProcessor = new OBC.IfcPropertiesProcessor(viewer)
highlingther.events.select.onClear.add(()=>{
    propertiesProcessor.cleanPropertiesList()
})



const classifier = new OBC.FragmentClassifier(viewer)
const classificationWindow = new OBC.FloatingWindow(viewer)
classificationWindow.visible=false
viewer.ui.add(classificationWindow)
classificationWindow.title="Model Groups"

const classificationsBtn = new OBC.Button(viewer)
classificationsBtn.materialIcon = "account_tree"
classificationsBtn.onClick.add(()=>{
    classificationWindow.visible=!classificationWindow.visible
    classificationsBtn.active=classificationWindow.visible
})

async function createModelTree(){
    const fragmentTree = new OBC.FragmentTree(viewer)
    await fragmentTree.init()
    await fragmentTree.update(["model","storeys","entities"])
    fragmentTree.onHovered.add((fragmentMap)=>{
        highlingther.highlightByID("hover",fragmentMap)
    })
    fragmentTree.onSelected.add((fragmentMap)=>{
        highlingther.highlightByID("select",fragmentMap)
    })
    const tree = fragmentTree.get().uiElement.get("tree")
    return tree;
}

ifcLoader.onIfcLoaded.add(async (model)=>{
    highlingther.update();
    console.log(model)
    classifier.byStorey(model)
    classifier.byEntity(model)
    classifier.byModel(model.name,model)
    classifier.get()
    const tree= await createModelTree()
    await classificationWindow.slots.content.dispose(true)
    classificationWindow.addChild(tree)

    propertiesProcessor.process(model)
    highlingther.events.select.onHighlight.add((fragmentMap) => {
        const expressID=[...Object.values(fragmentMap)[0]][0]
        propertiesProcessor.renderProperties(model, Number (expressID))
    })
})


const toolbar= new OBC.Toolbar(viewer)
toolbar.addChild(
    ifcLoader.uiElement.get("main"),
    classificationsBtn,
    propertiesProcessor.uiElement.get("main")
)

viewer.ui.addToolbar(toolbar)

