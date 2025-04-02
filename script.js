let tally = 0;
function getCookie(listName) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim(); // trim: trimming off white-space
        if (cookie.startsWith(listName + '='))
            return cookie.substring(listName.length + 1);
    }
}
function removeCookie() {
    document.cookie = "listName=; expire=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    location.reload(true);
}

function openPreviousList() {
    let listName = document.getElementById('listName');
    if (!listName.checkValidity()) {
        document.getElementById('currentList').innerText = "Invalid List";
        return;
    }

    const date = new Date();
    date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();
    let cookieStr = "listName=" + listName.value + "; " + expires + "; path=/";
    document.cookie = cookieStr;
    location.reload(true);
}

let currentList = null;
function loadList() {
    currentList = getCookie('listName');
    console.log('Current List: ', currentList);
    currentList = currentList ? currentList : 'Untitled List';

    document.getElementById('currentList').textContent = escapeHTML(currentList);

    let todoListJSON = localStorage.getItem(`${currentList}_todoListJSON`); // stuck
    let todoList = todoListJSON ? JSON.parse(todoListJSON) : [];
    updateDisplay(todoList);

    if (!todoListJSON) {
    console.log("Error: No existing list");
    }
}

function addToListDisplay() {
    let todoItem = document.getElementById('todoItem').value.trim();
    if (todoItem === "")
        return;

    todoItem = escapeHTML(todoItem);
    tallyUpAddedTasks(1);

    let todoListJSON = localStorage.getItem(`${currentList}_todoListJSON`) || "[]";
    let todoList = JSON.parse(todoListJSON);

    todoList.push({ task: todoItem });
    localStorage.setItem(`${currentList}_todoListJSON`, JSON.stringify(todoList));

    updateDisplay(todoList);
    document.getElementById('todoItem').value = "";
}
function updateDisplay(todoList) {
    const list = document.getElementById('list');
    if (todoList.length === 0) {
        list.innerText = "Empty";
    }
    else {
        list.innerText = todoList.map(item => `- ${item.task}`).join('\n');
    }
}
function removeFromList() {
    let removeTask = document.getElementById('removeTask').value.trim();
    if (removeTask === "")
        return;

    removeTask = escapeHTML(removeTask);

    let todoListJSON = localStorage.getItem(`${currentList}_todoListJSON`) || "[]";
    let todoList = JSON.parse(todoListJSON);

    const newList = todoList.filter(item => item.task !== removeTask);
    localStorage.setItem(`${currentList}_todoListJSON`, JSON.stringify(newList));

    if (newList.length === todoList.length) {
        document.getElementById('removeTask').placeholder = "Task Doesn't Exist";
    }

    updateDisplay(newList);
    document.getElementById('removeTask').value = "";
}

function tallyUpAddedTasks(amount) {
    tally += amount;
    sessionStorage.setItem('tally', tally);

    document.getElementById('tasksAdded').textContent = tally;
}

function escapeHTML(input) {    // taken from last project lol (lazy)
    return input.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#029;");
}

function darkMode() {
    document.body.style.backgroundColor = '#141417';
    document.body.style.color = '#FFFFFF';

    const all = document.querySelectorAll('*');
    all.forEach(element => {
        element.style.backgroundColor = '#141417';
        element.style.color = '#FFFFFF';
    });
    const inputBoxes = document.querySelectorAll('.inputBox');
    inputBoxes.forEach(inputBox => {
       inputBox.style.backgroundColor = 'white';
       inputBox.style.color = 'black';
       inputBox.style.border = '1.5px solid grey';

    });

    document.getElementById('currentTheme').textContent = 'Dark Mode';
    saveColorSettings();
}
function lightMode() {
    document.body.style.backgroundColor = 'white';
    document.body.style.color = 'black';

    const all = document.querySelectorAll('*');
    all.forEach(element => {
        element.style.backgroundColor = 'white';
        element.style.color = 'black';
    });

    document.getElementById('currentTheme').textContent = 'Light Mode';
    saveColorSettings();
}
function defaultMode() {
    document.body.style.backgroundColor = '#CEE7F2';
    document.body.style.color = '#23235C';

    const all = document.querySelectorAll('*');
    all.forEach(element => {
        element.style.backgroundColor = '#CEE7F2';
        element.style.color = '#23235C';
    });

    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
       button.style.backgroundColor = '#B5DDEF';
       button.style.color = '#23235C';
    });

    const inputBoxes = document.querySelectorAll('.inputBox');
    inputBoxes.forEach(inputBox => {
       inputBox.style.backgroundColor = 'white';
       inputBox.style.color = 'black';
       inputBox.style.border = '1.5px solid grey';

    });

    document.getElementById('currentTheme').textContent = 'Default Mode';
    saveColorSettings();
}

function saveColorSettings() {
    const currentTheme = document.getElementById('currentTheme').textContent;

    const date = new Date();
    date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `theme=${currentTheme}; ${expires}; path=/`;
}
function getThemeCookie() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith('theme='))
            return cookie.substring('theme='.length);
    }
    return 'Default Mode';
}

document.addEventListener('DOMContentLoaded', () => {
    // Theme
    let savedTheme = getThemeCookie();
    if (savedTheme === 'Dark Mode')
        darkMode();
    else if (savedTheme === 'Light Mode')
        lightMode();
    else
        defaultMode();
    // Tally
    tally = parseInt(sessionStorage.getItem('tally')) || 0
    // List
    loadList();
});

