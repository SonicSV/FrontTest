import TodoService from './services/TodoService.js';
import tasksRender from './tasks.js';

const todosWrapper = document.querySelector('.todos-wrapper');
const todoWrapper = document.querySelector('.flex-wrapper-todo'),
    descriptionTaskInput = todoWrapper.querySelector('#description-task'),
    addTaskBtn = todoWrapper.querySelector('#add-task-btn');
const loginWrapper = document.querySelector('.flex-wrapper-login'),
    loginBtn = loginWrapper.querySelector('#login-btn'),
    loginUsername = loginWrapper.querySelector('#username');
const sessionUser = document.querySelector('.show-username'),
    exitBtn = sessionUser.querySelector('#exit-btn');

const todoService = new TodoService();

let tasks = [];

document.addEventListener("DOMContentLoaded", () =>{
    if(localStorage.getItem('username')){
        login()
    }
})

const filterTasks = () => {
    const activeTasks = tasks.length ? tasks.filter(item => item.state == 'open') : [];
    const completedTasks = tasks.length ? tasks.filter(item => item.state == 'done') : [];
    tasks = [...activeTasks, ...completedTasks];
}


function toggleDisplay(username) {
    if (username && username == localStorage.getItem('username')) {
        loginWrapper.style.display = 'none';
        todoWrapper.style.display = 'block';
        sessionUser.style.display = 'block';
        sessionUser.querySelector('h2').innerHTML = `Пользователь: ${localStorage.getItem('username')}`
    } else {
        loginWrapper.style.display = 'block';
        todoWrapper.style.display = 'none';
        sessionUser.style.display = 'none';
    }
}

toggleDisplay(localStorage.getItem('username'))

async function login() {
    await todoService.login(JSON.stringify({ "username": localStorage.getItem('username') }));
    await todoService.getTasks()
        .then(res => res.text())
        .then(res => res ? JSON.parse(res) : [])
        .then(res => tasks = res)
        .catch(e => console.log(e))
    filterTasks()
    tasksRender(tasks)
}

loginBtn.addEventListener('click', () => {
    if (localStorage.getItem('username') != loginUsername.value) {
        localStorage.setItem('username', loginUsername.value);
    }
    login()
    toggleDisplay(loginUsername.value)
    loginUsername.value = '';
})

exitBtn.addEventListener('click', () => {
    localStorage.setItem('username', '');
    //document.cookie = 'insit=';
    toggleDisplay('');
})

addTaskBtn.addEventListener('click', () => {
    try {
        // технически должен быть POST запрос, но на сервере реализован как PUT
        async function pushTask() {
            await todoService.getTasks()
                .then(res => res.text())
                .then(res => res ? JSON.parse(res) : [])
                .then(data => tasks = [{ description: descriptionTaskInput.value, state: 'open' }, ...data])
                .catch(e => console.log(e));
            todoService.updateTasks(JSON.stringify(tasks));
            tasksRender(tasks)
            descriptionTaskInput.value = '';
        }
        pushTask()
    } catch (error) {
        throw (e)
    }
})

function changeStateTask(index) {
    if (tasks[index]['state'] == 'open') {
        tasks[index]['state'] = 'done'
        document.getElementById(`${index}`).classList.add('checked')
        todoService.updateTasks(JSON.stringify(tasks));
        filterTasks()
        tasksRender(tasks)
    } else {
        tasks[index]['state'] = 'open'
        document.getElementById(`${index}`).classList.remove('checked')
        todoService.updateTasks(JSON.stringify(tasks));
        filterTasks()
        tasksRender(tasks)
    }
}

function deleteTask(index) {
    document.getElementById(`${index}`).classList.add('removing')
    tasks.splice(index, 1)
    todoService.updateTasks(JSON.stringify(tasks));

    setTimeout(() => {
        filterTasks()
        tasksRender(tasks)
    }, 500)
}

function eventListener(element, classname, func) {
    element.addEventListener('click', (event) => {
        if (event.target && event.target.matches(classname)) {
            func(event.target.parentNode.parentNode.getAttribute('id'))
        }
    })
}

eventListener(todosWrapper, 'input.btn-complete', changeStateTask)
eventListener(todosWrapper, 'button.btn-delete', deleteTask)