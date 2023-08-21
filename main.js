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

const closeButton = document.querySelector('[data-close-modal]');
const modal = document.querySelector('[data-modal]');

closeButton.addEventListener('click', () => {
    modal.close()
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
    for (i of users.users) {
        storedUserList.push([['id', i.id], ['email', i.email], ['firstName', i.firstName], ['lastName', i.lastName], ['birthDate', i.birthDate],
        ['gender', i.gender], ['university', i.university], ['city', i.address.city]]);
        const li = document.createElement('li');
        li.setAttribute('id', 'user' + i.id);
        li.setAttribute('class', 'list_item')
        li.innerHTML = `
    <div><img src="${i.image}" alt="user avatar"></div>
            <div>
                <p id="email">${i.email}</p>
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
    // console.log(storedUserList);
    for (i of storedUserList) {
        tempUser.push(Object.fromEntries(i));
    }
    storedUserList = tempUser;
    // console.log(storedUserList)

    // + 1.3. Save user list to localStorage.
    localStorage.setItem('users', JSON.stringify(storedUserList));
    return storedUserList;
}


// + 1.2.If list in localStorage get it from there.
if (!localStorage.getItem('users')) {
    listBuild()
} else {
    listBuildFromLocalStorage()
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
                <p id="email">${i.email}</p>
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
        deleteUser(userId);
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
    if (document.getElementById("data_form")) {
        const dataForm = document.getElementById("data_form");
        dataForm.remove();
    }
    // console.log(userId);
    form.setAttribute('style', 'display: flex')
    document.getElementById("form_header").textContent = 'user data update';
    document.getElementById("fname").setAttribute("value", userId.firstName);
    document.getElementById("lname").setAttribute("value", userId.lastName);
    document.getElementById("bdate").setAttribute("value", userId.birthDate);
    document.getElementById("email").setAttribute("value", "test");
    document.getElementById(userId.gender).checked = true;
    document.getElementById("university").setAttribute("value", userId.university);
    document.getElementById("city").setAttribute("value", userId.city);
    document.getElementById("form_submit").setAttribute('value', 'update');
}

// DELETE user
function deleteUser(userId) {
    document.getElementById("data_modal").addEventListener('click', (e) => {
        // console.log(userId);
        if (e.target.textContent = "YES") {
            for (let i = 0; i < storedUserList.length; i++) {
                if (storedUserList[i].id == userId.id) {
                    console.log("Match: ");
                    console.log('User ID in list', storedUserList[i].id,);
                    console.log('User to delete', userId);
                    storedUserList.splice(i, 1);
                    console.log('storedUserList is:', storedUserList);
                    break
                }
            }
            list.innerHTML = "";
            if (storedUserList.length < 1) {
                localStorage.clear();
                console.log('We are building a new list, cause:', storedUserList.length);
                listBuild()
            } else {
                localStorage.clear();
                console.log('We are getting list from storage, cause:', storedUserList.length);
                localStorage.setItem('users', JSON.stringify(storedUserList))
                listBuildFromLocalStorage()
            }
        }
    })

}


// FORM VALIDATION


function ShowError(elem, msg) {
    console.log(elem);
    const errorAlert = elem.parentNode.querySelector('.alert');
    console.log(errorAlert);
    errorAlert.textContent = msg;
    elem.classList.add('.active');
}

function ShowSuccess(elem, msg) {
    console.log('true');
    const errorAlert = elem.parentNode.querySelector('.alert');
    errorAlert.textContent = '';
    elem.classList.remove('.active');
}
///Validate NAME ///
function validateFname(el, message) {
    // console.log(el)
    if (el.value !== "") {
        res.push(['Your name:', el.value]);
        ShowSuccess(el, message);
        return true;
    } else {
        // console.log(el, FNAME_ERROR);
        ShowError(el, message);
        return false;
    }
}

///Validate LASTNAME ///
function validateLname(el, message) {
    // console.log(el)
    if (el.value !== "") {
        res.push(['Your surname', el.value]);
        ShowSuccess(el, message);
        return true;
    } else {
        // console.log(el, FNAME_ERROR);
        ShowError(el, message);
        return false;
    }
}

///Validate PAYMENT ///
function validatepayment(el, message) {
    let selectedpayment;
    for (const radio of el) {
        if (radio.checked) {
            selectedpayment = radio.value;
        }
    }
    if (selectedpayment) {
        res.push(['Way of payment:', selectedpayment]);
        ShowSuccess(radioError, message);
        return true;
    }
    ShowError(radioError, message);
    return false;
}


///Validate QUANTITY ///
function validatequantity(el, message) {
    console.log()
    let qty = el.valueAsNumber;
    if (qty > 0) {
        res.push(['Ordered quantity:', qty]);
        ShowSuccess(radioError, message);
        return true;
    }
    ShowError(radioError, message);
    return false;
}



///Validate CITY ///
function validateCity(el, message) {
    if (el.selectedIndex != 0) {
        res.push(['City of delivery:', el.value]);
        ShowSuccess(el, message);
        return true;
    }
    ShowError(el, message);
    return false;
}

///Validate NOVA POSHTA ///
function validateAddress(el, message) {
    // console.log(el)
    if (el.value !== "") {
        res.push(['Nova poshta brunch:', el.value]);
        ShowSuccess(el, message);
        return true;
    } else {
        // console.log(el, FNAME_ERROR);
        ShowError(el, message);
        return false;
    }
}

///Validate COMMENTS///
function validateComments(el, message) {
    // console.log(el)
    if (el.value !== "") {
        res.push(['Comments:', el.value]);
        ShowSuccess(el, message);
        return true;
    } else {
        // console.log(el, FNAME_ERROR);
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


    console.log(res);

}
//////// EventListener for the form.////////

// myform.addEventListener('submit', (event) => {
//     event.preventDefault();
//     // console.log(fnameElement, 'inside listener')
//     res = []
//     const isFnameValid = validateFname(fnameElement, FNAME_ERROR);
//     const isLnameValid = validateLname(lnameElement, LNAME_ERROR);
//     const ispaymentValid = validatepayment(paymentElement, payment_ERROR);
//     const isquantityValid = validatequantity(quantityElement, quantity_ERROR);
//     const isCityValid = validateCity(cityElement, CITY_ERROR);
//     const isAddressValid = validateAddress(addressElement, ADDRESS_ERROR);
//     const isCommentsValid = validateComments(commentsElement, COMMENTS_ERROR);

//     if (isFnameValid && isLnameValid && ispaymentValid && isquantityValid && isCityValid && isAddressValid && isCommentsValid) {
//         res.push(["Product: ", currentProd[0].product]);
//         console.log('Submit');
//         datatable();
//     }
// })



