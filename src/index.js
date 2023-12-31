import { loadLists, loadPage, loadTodos } from "./pageDom";

// Create todo items with a factory
// todo should have title, descr, date, priority
const todoFactory = (title, descr, date, priority) => {
    return {title, descr, date, priority}
}

// todos should have a button to delete
function setTodoDeleteBtns() {
    const todoDeleteBtn = document.querySelectorAll('#deletetodo');
    todoDeleteBtn.forEach((ele) => {
    ele.addEventListener('click', deleteTodo);
})
}

function deleteTodo(ele) {
    let todoIndex = findTodo(ele);
    currentList.splice(todoIndex, 1);

    clearTodos();
    loadTodos(currentList);
    setTodoDeleteBtns();
    saveToStorage();
}

function findTodo(ele) {
    let parent = ele.target.parentElement.parentElement;
    let siblings = parent.children;

    for (let i = 0; i < siblings.length; i++) {
        if (siblings[i] === ele.target.parentElement) {
            return i;
        }
    }
}

// Add default list of todos
const defaultList = [];
const createDefault = (() => {
    const washDishes = todoFactory('Wash Dishes', 'Clean dishes in the sink', '09-14-2023',
                                'Low');
    defaultList.push(washDishes)
    const brushTeeth = todoFactory('Brush Teeth', '', '09-13-2023', 'Medium');
    defaultList.push(brushTeeth);
    const makeDinner = todoFactory('Make Dinner', 'Cook something to eat', '09-13-2023',
                                'Low');
    defaultList.push(makeDinner);
    const finishProject = todoFactory('Finish Project', 'Finish To Do List', '09-15-2023',
                                'High');
    defaultList.push(finishProject);
})();

// Users should be able to create new todo
// Form for user to create new todo
// todo should get added to current list
function setTodoCreate() {
    const todoCreate = document.querySelector('#createtodo');
    todoCreate.addEventListener('click', displayTodoForm);
}

function displayTodoForm() {
    const todoForm = document.querySelector('#todoformcontainer');
    todoForm.show();

    setTodoFormBtns();
}

function setTodoFormBtns() {
    const addBtn = document.querySelector('#newtodobutton');
    addBtn.addEventListener('click', addNewTodo);

    const cancelBtn = document.querySelector('#newtododelete');
    cancelBtn.addEventListener('click', cancelNewTodo);

    addEventListener('keypress', submitEnterTodo);
}

function submitEnterTodo(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addNewTodo();
        removeEventListener('keypress', submitEnterTodo);
    }
}

function addNewTodo() {
    const newTodoName = document.querySelector('#newtodoname').value;
    const newTodoDescr = document.querySelector('#newtododescr').value;
    const newTodoDate = document.querySelector('#newtododate').value;
    const newTodoPriority = document.querySelector('#newtodopriority').value;

    if (newTodoName !== '' && newTodoDescr !== '' && newTodoDate !== '' && 
     newTodoPriority !== '') {
        let newTodo = todoFactory(newTodoName, newTodoDescr, newTodoDate, newTodoPriority);
        currentList.push(newTodo)

        clearTodos()
        loadTodos(currentList);
        setTodoDeleteBtns();

        hideTodoForm();
        removeEventListener('keypress', submitEnterTodo);
        saveToStorage()
    }
    
}

function cancelNewTodo() {
    hideTodoForm();
    removeEventListener('keypress', submitEnterTodo);
}

function hideTodoForm() {
    const todoForm = document.querySelector('#newtodo');
    todoForm.reset()
    const todoFormContainer = document.querySelector('#todoformcontainer');
    todoFormContainer.close()
}

// Users should be able to create a new list 
// Form for users to create new list
function setListCreate() {
    const listCreate = document.querySelector('#createlist')
    listCreate.addEventListener('click', displayListForm);
}

function displayListForm() {
    const listForm = document.querySelector('#listformcontainer');
    listForm.show();

    setListFormBtns();
}

function setListFormBtns() {
    const addBtn = document.querySelector('#newlistbutton');
    addBtn.addEventListener('click', addNewList);

    const cancelBtn = document.querySelector('#newlistdelete');
    cancelBtn.addEventListener('click', cancelNewList);

    addEventListener('keypress', submitEnterList)
}

function submitEnterList(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addNewList();
        removeEventListener('keypress', submitEnterList);
    }
}

function addNewList() {
    const newListName = document.querySelector('#newlistname').value;
    if (newListName !== '') {
        listOfLists[newListName] = [];

        clearLists()
        changeCurrentList(newListName);

        let listNames = Object.keys(listOfLists);
        loadLists(listNames);
        setListListener();
        setListDeleteBtn();

        hideListForm();
        removeEventListener('keypress', submitEnterList);
        saveToStorage()
    }
}

function clearLists() {
    let listBody = document.querySelector('#sidebarcontainer');
    while (listBody.firstChild) {
        listBody.removeChild(listBody.lastChild);
    }
}

function cancelNewList() {
    hideListForm();
    removeEventListener('keypress', submitEnterList);
}

function hideListForm() {
    const listForm = document.querySelector('#newlist');
    listForm.reset()
    const listFormContainer = document.querySelector('#listformcontainer');
    listFormContainer.close()
}

// Create object for lists
let listOfLists = {};
listOfLists.Default = defaultList;

let currentList = defaultList;

// Users should be able to swap lists 
function setListListener() {
    const listTitles = document.querySelectorAll('#listtitle');
    listTitles.forEach((ele) => {
        ele.addEventListener('click', listListener)
    })
}

function listListener(ele) {
    let listName = ele.target.textContent
    changeCurrentList(listName);
}

function changeCurrentList(listName) {
    currentList = listOfLists[listName]

    clearTodos();
    loadTodos(currentList);
    setTodoDeleteBtns();
}

function clearTodos() {
    let todoBody = document.querySelector('#bodycontainer');
    while (todoBody.firstChild) {
        todoBody.removeChild(todoBody.lastChild);
    }
}


// Button to delete list 
// When deleting list, delete all todos inside
function setListDeleteBtn() {
    const listDelete = document.querySelectorAll('#deletelist');
    listDelete.forEach((ele) => {
        ele.addEventListener('click', deleteList);
    })
}

function deleteList(ele) {
    let listName = ele.target.previousSibling.textContent;

    if (listOfLists[listName] === currentList) {
        currentList = [];
        clearTodos();
    }

    delete listOfLists[listName];

    let container = ele.target.parentElement.parentElement;
    let listItem = ele.target.parentElement;
    container.removeChild(listItem);
    saveToStorage()
}

// Add local storage
// Save lists and todos to local storage when new one is added
function saveToStorage() {
    localStorage.setItem('localLists', JSON.stringify(listOfLists));
}

function checkStorage() {
    let storageLists = JSON.parse(localStorage.getItem('localLists'));
    if (storageLists !== null) {
        console.log(storageLists)
        listOfLists = storageLists;
        currentList = listOfLists[Object.keys(listOfLists)[0]];
    } 
}

// Look for data in local storage when loading
// Load default list if no local storage
function loadContent(list) {
    checkStorage();
    let listNames = Object.keys(listOfLists);
    loadPage();
    if (currentList !== undefined) {
        loadTodos(currentList);
    }
    loadLists(listNames);
}

function setButtons() {
    setTodoDeleteBtns();
    setTodoCreate();
    setListListener();
    setListDeleteBtn();
    setListCreate();
}

loadContent();
setButtons()

