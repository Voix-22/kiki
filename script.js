const addBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const categorySelect = document.getElementById("category");
const prioritySelect = document.getElementById("priority");
const dueDateInput = document.getElementById("dueDate");

const searchInput = document.getElementById("searchInput");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const darkModeBtn = document.getElementById("darkModeBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let draggedIndex = null;

/* SAVE */

function saveTasks(){
localStorage.setItem("tasks",JSON.stringify(tasks));
}

/* ADD */

function addTask(){

const text = taskInput.value.trim();
const category = categorySelect.value;
const priority = prioritySelect.value;
const dueDate = dueDateInput.value;

if(text===""){
alert("Task cannot be empty");
return;
}

tasks.push({
text,
category,
priority,
dueDate,
completed:false
});

saveTasks();
renderTasks();

taskInput.value="";
}

/* RENDER */

function renderTasks(){

taskList.innerHTML="";

tasks.forEach((task,index)=>{

const li=document.createElement("li");

li.classList.add(task.category);
li.classList.add(task.priority);
li.draggable=true;

if(task.completed) li.classList.add("completed");

if(task.dueDate){

const today=new Date();
const due=new Date(task.dueDate);

if(due<today && !task.completed){
li.classList.add("overdue");
}

}

const content=document.createElement("div");
content.className="task-content";

content.innerHTML=`
<strong>${task.text}</strong><br>
<small>${task.category} | ${task.priority}</small><br>
<small>Due: ${task.dueDate || "No date"}</small>
`;

content.onclick=()=>{
tasks[index].completed=!tasks[index].completed;
saveTasks();
renderTasks();
};

const deleteBtn=document.createElement("button");
deleteBtn.textContent="Delete";
deleteBtn.className="deleteBtn";

deleteBtn.onclick=(e)=>{
e.stopPropagation();
tasks.splice(index,1);
saveTasks();
renderTasks();
};

li.appendChild(content);
li.appendChild(deleteBtn);

/* DRAG */

li.addEventListener("dragstart",()=>{
draggedIndex=index;
});

li.addEventListener("dragover",(e)=>{
e.preventDefault();
});

li.addEventListener("drop",()=>{

const temp=tasks[draggedIndex];

tasks.splice(draggedIndex,1);
tasks.splice(index,0,temp);

saveTasks();
renderTasks();

});

taskList.appendChild(li);

});

updateProgress();
}

/* PROGRESS */

function updateProgress(){

const total=tasks.length;
const completed=tasks.filter(t=>t.completed).length;

const percent = total===0 ? 0 : (completed/total)*100;

progressBar.style.width = percent + "%";

progressText.textContent =
completed+" / "+total+" tasks completed";

}

/* SEARCH */

searchInput.addEventListener("input",function(){

const query=this.value.toLowerCase();

document.querySelectorAll("#taskList li").forEach(task=>{

task.style.display =
task.textContent.toLowerCase().includes(query)
? "flex"
: "none";

});

});

/* DARK MODE */

darkModeBtn.onclick=()=>{

document.body.classList.toggle("dark-mode");

localStorage.setItem(
"darkMode",
document.body.classList.contains("dark-mode")
);

};

if(localStorage.getItem("darkMode")==="true"){
document.body.classList.add("dark-mode");
}

/* SERVICE WORKER */

if("serviceWorker" in navigator){
navigator.serviceWorker.register("service-worker.js");
}

addBtn.addEventListener("click",addTask);

taskInput.addEventListener("keydown",e=>{
if(e.key==="Enter") addTask();
});

renderTasks();
