// Створити CRUD-додаток (Create, Read, Update, Delete):

//  1. Виводиться список користувачів із кнопками “Edit”, “Remove”, “View” біля кожного користувача
//  (use data-id attributes або event delegation)
//  список користувачів отримувати з js-файлу (масив об'єктів / використовувати функції-конструктори – за бажанням)

//  2. При натисканні на кнопку “View” відкриваються дані користувача у блоці під списком
//  3. При натисканні на кнопку “Edit” з'являється можливість редагувати дані в блоці під списком.
//  4. Дані зберігаються при натисканні на кнопку “Save” та оновлюють дані у списку
//  5.При натисканні на кнопку “Remove” користувач видаляється зі списку
//  - Обов'язково підтвердження видалення (для уникнення видалення помилково)
//  - Реалізувати можливість додавання нових користувачів
//  - Бажано перевикористовувати форму редагування
//  - При додаванні користувач з'являється у списку
//  - Після перезавантаження сторінки всі зміни повинні зберігатись (використовувати localStorage)

// + 1. List creation: - this shold be function.
// + 1.1.If list is not in localStorage get list from API.
// + 1.2.If list in localStorage get it from there.
// + 1.3. Save user list to localStorage.
// + 2. View user data:
// + 2.1 Put addEventListener on VIEW button
// + 2.2 Add user info under the list.
// + 2.3 - add close button to this info window.
// 3. Edit user data:
// + 3.1 When EDIT button pressed open EDIT window under user row accordingly.
// + All user data should be already in form fields accordingly.
// 3.2. Add SAVE button to EDIT window.
// 3.3. When SAVE button pressed update the list calling "List creation" function.
// 4. Delete user:
// 4.1 When DELETE button pressed show confirmation modal window.
// 4.1 Update the user list calling "List creation" function.
// 5.Create the user: - this is a function user_func both for edit and creation.
// 5.1 Add button CREATE USER under the list.
// 5.2 When CREATE USER button is pressed open FORM under the list.
// 5.3 Validate the form using RegExp.
// 5.4.When SAVE button pressed update the list using "List creation" function.


const list = document.getElementById("user_list");
const form = document.getElementById("form");
let storedUserList = [];
let tempUser = [];
let userId = {};
let userIDtoEdit;
let idGen = 5;

const myform = document.getElementById('form');
const fnameElement = myform.elements["fname"];
const lnameElement = myform.elements['lname'];
const bdateElement = myform.elements['bdate'];
const emailElement = myform.elements['email'];
const genderElement = myform.elements['gender'];
const universityElement = myform.elements['university'];
const cityElement = myform.elements['city'];
const radioError = document.querySelector('.radio-header');
const addUser = document.getElementById('add_user');
res = []

const FNAME_ERROR = 'Please input first name';
const LNAME_ERROR = 'Please input last name';
const BDATE_ERROR = 'Please enter your date of birth';
const EMAIL_ERROR = 'Please enter your email';
const GENDER_ERROR = 'Please indicate your gender';
const UNIVERSITY_ERROR = 'Please enter your university';
const CITY_ERROR = 'Please check your city of living';

const lnameRegEx = /^[A-Z][a-z]{2,15}$/;
const bdateRegEx = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-(19|20)\d\d$/;
const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const closeButton = document.querySelector('[data-close-modal]');
const modal = document.querySelector('[data-modal]');

closeButton.addEventListener('click', () => {
    modal.close()
})

document.getElementById("data_modal").addEventListener('click', (e) => {
    if (e.target.textContent = "YES") {
        deleteUser(userId);
    }
})

// Function to show user list build from API response.
// + 1.1.If list is not in localStorage get list from API.
// Async func to receive users list from API dummyJson
async function getUsers() {
    const response = await fetch('https://dummyjson.com/users?limit=5');
    const list = await response.json();
    return list;
}

async function listBuild() {
    let users = await getUsers();
    storedUserList = [];
    for (i of users.users) {
        let date = new Date(i.birthDate);
        let day = date.getDate();
        if (day < 10) {
            day = '0' + date.getDate();
        }
        let month = date.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }
        let year = date.getFullYear();
        date = `${day}-${month}-${year}`;
        storedUserList.push([['id', i.id], ['email', i.email], ['firstName', i.firstName], ['lastName', i.lastName], ['birthDate', date],
        ['gender', i.gender], ['university', i.university], ['city', i.address.city]]);
        const li = document.createElement('li');
        li.setAttribute('id', 'user' + i.id);
        li.setAttribute('class', 'list_item')
        li.innerHTML = `
    <div><img src="${i.image}" alt="user avatar"></div>
            <div>
                <p id="table_email">${i.email}</p>
            </div>
            <div>
                <p>${i.firstName}</p>
            </div>
            <div>
                <p>${i.lastName}</p>
            </div>
            <div><button type="button" class="btn btn-primary">Open</button></div>
            <div><button type="button" class="btn btn-success">Edit</button></div>
            <div data-open-modal><button type="button" class="btn btn-danger">Delete</button></div>
            `;
        user_list.appendChild(li);
    }
    for (i of storedUserList) {
        tempUser.push(Object.fromEntries(i));
    }
    storedUserList = tempUser;
    tempUser = [];
    // + 1.3. Save user list to localStorage.
    localStorage.setItem('users', JSON.stringify(storedUserList));
    return storedUserList;
}

function listBuildFromLocalStorage() {
    storedUserList = JSON.parse(localStorage.getItem('users'));
    for (i of storedUserList) {
        const li = document.createElement('li');
        li.setAttribute('id', 'user' + i.id);
        li.setAttribute('class', 'list_item')
        li.innerHTML = `
    <div><img src="https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg" alt="user avatar"></div>
            <div>
                <p id="table_email">${i.email}</p>
            </div>
            <div>
                <p>${i.firstName}</p>
            </div>
            <div>
                <p>${i.lastName}</p>
            </div>
            <div><button type="button" class="btn btn-primary">Open</button></div>
            <div><button type="button" class="btn btn-success">Edit</button></div>
            <div data-open-modal><button type="button" class="btn btn-danger">Delete</button></div>
            `;
        user_list.appendChild(li);
    }
    const closeButton = document.querySelector('[data-close-modal]');
    const modal = document.querySelector('[data-modal]');
    closeButton.addEventListener('click', () => {
        modal.close()
    })
}

// 2.1 Put addEventListener on OPEN/EDIT/DELETE buttons

list.addEventListener('click', (e) => {
    for (let i = 0; i < (storedUserList.length); i++) {
        if (storedUserList[i].id == e.target.parentElement.parentElement.id.replace('user', '')) {
            userId = storedUserList[i];
            break;
        }
    }
    if (e.target.innerHTML == 'Open') {
        viewUser(userId);
    }
    if (e.target.innerHTML == 'Edit') {
        editUser(userId);
    }
    if (e.target.innerHTML == 'Delete') {
        modal.showModal()
    }
})


// VIEW User function
// + 2. View user data:
// + 2.2 Add user info under the list.
// + 2.3 - add close button to this info window.
function viewUser(userId) {
    if (document.getElementById("data_form")) {
        const dataForm = document.getElementById("data_form");
        dataForm.remove();
    }
    document.getElementById("form").style.display = 'none';

    // for (i of storedUserList) {
    //     if (i.id == e.target.parentElement.parentElement.id.replace('user', '')) {
    //         let userId = storedUserList[i];
    //         break;
    //     }
    // }
    const dataForm = document.createElement('div');
    dataForm.innerHTML = `
        <div id="data_form">
        <h1>user data</h1>
        <p>First name: ${userId.firstName}</p>
        <p>Last name: ${userId.lastName}</p>
        <p>Email: ${userId.email}</p>
        <p>Birthdate: ${userId.birthDate}</p>
        <p>Gender: ${userId.gender}</p>
        <p>University: ${userId.university}</p>
        <p>City of living: ${userId.city}</p>
        <button id="closeData">Close</button>
    </div>
        `
    list.appendChild(dataForm)
    const dataClose = document.getElementById("closeData");
    dataClose.addEventListener('click', (e) => {
        dataForm.remove();
    })
}

// EDIT User function
// 3. Edit user data:
function editUser(userId) {
    FormClear();
    if (document.getElementById("data_form")) {
        const dataForm = document.getElementById("data_form");
        dataForm.remove();
    }
    form.setAttribute('style', 'display: flex')
    document.getElementById("form_header").textContent = 'user data update';
    document.getElementById("fname").value = userId.firstName;
    document.getElementById("lname").value = userId.lastName;
    document.getElementById("bdate").value = userId.birthDate;
    document.getElementById("email").value = userId.email;
    document.getElementById(userId.gender).checked = true;
    document.getElementById("university").value = userId.university;
    document.getElementById("city").value = userId.city;
    document.getElementById("form_submit").setAttribute('value', 'update');
    userIDtoEdit = userId.id
}


// DELETE user
function deleteUser(userId) {
    for (let i = 0; i < storedUserList.length; i++) {
        if (storedUserList[i].id == userId.id) {
            storedUserList.splice(i, 1);
            break
        }
    }
    list.innerHTML = "";
    localStorage.clear();
    if (storedUserList.length < 1) {
        listBuild()
    } else {
        localStorage.setItem('users', JSON.stringify(storedUserList))
        listBuildFromLocalStorage()
    }
}

//Add user
addUser.addEventListener('click', (e) => {
    e.preventDefault();
    FormClear();
    myform.setAttribute('style', 'display: flex');
    document.getElementById("form_header").textContent = 'Add user';
    document.getElementById("form_submit").setAttribute('value', 'add user');
})

// + 1.2.If list in localStorage get it from there.
if (!localStorage.getItem('users')) {
    listBuild()
} else {
    listBuildFromLocalStorage()
}


// Clear form
function FormClear() {
    document.getElementById("fname").value = "";
    document.getElementById("lname").value = "";
    document.getElementById("bdate").value = "";
    document.getElementById("email").value = "";
    document.getElementById("male").checked = false;
    document.getElementById("female").checked = false;
    document.getElementById("university").value = "";
    document.getElementById("city").value = "";
}


// FORM VALIDATION
function ShowError(elem, msg) {
    const errorAlert = elem.parentNode.querySelector('.alert');
    errorAlert.textContent = msg;
    elem.classList.add('.active');
}


function ShowSuccess(elem, msg) {
    const errorAlert = elem.parentNode.querySelector('.alert');
    errorAlert.textContent = '';
    elem.classList.remove('.active');
}


///Validate NAME ///
function validateFname(el, message) {
    if (lnameRegEx.test(el.value)) {
        res.push(['firstName', el.value]);
        ShowSuccess(el, message);
        return true;
    } else {
        ShowError(el, message);
        return false;
    }
}


///Validate LASTNAME ///
function validateLname(el, message) {
    if (lnameRegEx.test(el.value)) {
        res.push(['lastName', el.value]);
        ShowSuccess(el, message);
        return true;
    } else {
        ShowError(el, message);
        return false;
    }
}


///Validate Date of birth ///
function validateBDate(el, message) {
    let date = new Date(el.value);
    let day = date.getDate();
    if (day < 10) {
        day = '0' + date.getDate();
    }
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    let year = date.getFullYear();
    date = `${day}-${month}-${year}`;

    if (bdateRegEx.test(date)) {
        res.push(['birthDate', date]);
        ShowSuccess(el, message);
        return true;
    } else {
        ShowError(el, message);
        return false;
    }
}


///Validate EMAIL ///
function validateEmail(el, message) {
    if (emailRegEx.test(el.value)) {
        res.push(['email', el.value]);
        ShowSuccess(el, message);
        return true;
    } else {
        ShowError(el, message);
        return false;
    }
}


///Validate GENDER///
function validateGender(el, message) {
    let selectedgender;
    for (const radio of el) {
        if (radio.checked) {
            selectedgender = radio.value;
        }
    }
    if (selectedgender) {
        res.push(['gender', selectedgender]);
        ShowSuccess(radioError, message);
        return true;
    }
    ShowError(radioError, message);
    return false;
}


///Validate University ///
function validateUniversity(el, message) {
    if (el.value !== "") {
        res.push(['university', el.value]);
        ShowSuccess(el, message);
        return true;
    } else {
        ShowError(el, message);
        return false;
    }
}


///Validate CITY ///
function validateCity(el, message) {
    if (el.value !== "") {
        res.push(['city', el.value]);
        ShowSuccess(el, message);
        return true;
    } else {
        ShowError(el, message);
        return false;
    }
}


function datatable() {
    document.getElementById('form').setAttribute('style', 'display: none');
    const section = document.getElementById('form_sec')
    table = document.createElement('table');
    table.setAttribute('id', 'datatable');
    section.appendChild(table);
    thead = document.createElement('th');
    thead.setAttribute('colspan', 2);
    thead.textContent = 'Your order details';
    table.appendChild(thead);
    for (i of res) {
        const row = document.createElement('tr');
        const cellOne = document.createElement('td');
        cellOne.textContent = i[0];
        const cellTwo = document.createElement('td');
        cellTwo.textContent = i[1];
        row.appendChild(cellOne);
        row.appendChild(cellTwo);
        table.appendChild(row);
    }
}


//////// EventListener for the form.////////

myform.addEventListener('submit', (event) => {
    event.preventDefault();
    res = []
    const isFnameValid = validateFname(fnameElement, FNAME_ERROR);
    const isLnameValid = validateLname(lnameElement, LNAME_ERROR);
    const isBdateValid = validateBDate(bdateElement, BDATE_ERROR);
    const isEmailValid = validateEmail(emailElement, EMAIL_ERROR);
    const isGenderValid = validateGender(genderElement, GENDER_ERROR);
    const isUniversityValid = validateUniversity(universityElement, UNIVERSITY_ERROR);
    const isCityValid = validateCity(cityElement, CITY_ERROR);

    if (isFnameValid && isLnameValid && isGenderValid && isBdateValid && isEmailValid && isUniversityValid && isCityValid) {
        if (!userIDtoEdit) {
            idGen += 1;
            res.push(['id', idGen]);
            storedUserList.push(Object.fromEntries(res));
        } else {
            userIDtoEdit = null;
            for (let i = 0; i < storedUserList.length; i++) {
                if (storedUserList[i].id == userId.id) {
                    res.push(['id', userId.id]);
                    storedUserList[i] = Object.fromEntries(res);
                    break
                }
            }
        }
        localStorage.clear();
        localStorage.setItem('users', JSON.stringify(storedUserList));
        list.innerHTML = "";
        FormClear();
        myform.setAttribute('style', 'display: none');
        listBuildFromLocalStorage()
    }
})



