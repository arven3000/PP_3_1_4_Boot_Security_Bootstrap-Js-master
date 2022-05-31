$(async function () {
    await getAllUser();
    await getModal();
    await checkRole();
    await getTitle();
    await getUserTable();
})

const findAllUsers = async () => await fetch('api/admin'),
    findAuthUser = async () => await fetch('api/admin/user'),
    findOneUser = async (id) => await fetch(`api/admin/${id}`),
    addNewUser = async (user) => await fetch('api/admin', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Referer': null
        },
        body: JSON.stringify(user)
    }),
    updateUser = async (user, id) => await fetch(`api/admin/${id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Referer': null
        },
        body: JSON.stringify(user)
    }),
    removeUser = async (id) => await fetch(`api/admin/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Referer': null
        }
    })

/*_-----------------------------------------------------------------------------------------------------------_*/

let isAdmin = false;

const adm = document.querySelector('.admin'),
    use = document.querySelector('.user'),
    adminTable = document.querySelector('.admin-class'),
    userTable = document.querySelector('.user-class'),
    newUserLink = document.querySelector('.new-user'),
    userTableLink = document.querySelector('.users'),
    newUserForm = document.querySelector('.newUser'),
    table = document.querySelector('.adminTable'),
    newUser = document.querySelector('.addForm');

adm.addEventListener('click', (e) => {
    e.preventDefault();
    showAdminTable();
});

use.addEventListener('click', (e) => {
    e.preventDefault();
    showAuthUserTable();
});

userTableLink.addEventListener('click', (e) => {
    e.preventDefault();
    showUserTable();
});

newUserLink.addEventListener('click', (e) => {
    e.preventDefault();
    showNewUserForm();

});

function showNewUserForm() {
    newUserLink.classList.add('active');
    userTableLink.classList.remove('active');
    newUserForm.style.display = 'block';
    table.style.display = 'none';
}

function showUserTable() {
    newUserForm.style.display = 'none'
    table.style.display = 'block';
    userTableLink.classList.add('active');
    newUserLink.classList.remove('active');
}

function showAdminTable() {
    userTable.style.display = 'none'
    adminTable.style.display = 'block';
    adm.classList.add('active');
    use.classList.remove('active');
}

function showAuthUserTable() {
    adminTable.style.display = 'none'
    userTable.style.display = 'block';
    use.classList.add('active');
    adm.classList.remove('active');
}

/*_---------------------------------------------------------------------------------------_*/

const getTitle = async () => {
    await findAuthUser().then(res => res.json()).then(data => {
        const nav = document.querySelector('.nav-item');
        const h = document.createElement('h4');
        const fragment = document.createDocumentFragment();
        h.style.color = 'white';

        let temp = '';
        temp += data.email + ' with roles: ' + data.roles.map(r => r.name).join(" ");
        h.innerText = temp;
        fragment.appendChild(h);
        nav.appendChild(fragment);
    });
}

/*_-----------------------------------------------------------------------------------------------------_*/

async function checkRole() {
    await findAuthUser().then(res => res.json()).then(async data => {
        let role = '';
        for (let i = 0; i < data.roles.length; i++) {
            role = data.roles[i].name;
            if (role === 'ADMIN') {
                isAdmin = true;
            }
        }
        if (!isAdmin) {
            showAuthUserTable();
            adm.style.display = 'none';
        }
    });
}

/*_-----------------------------------------------------------------------------------------------------------_*/


const getUserTable = async () => {
    await findAuthUser().then(res => res.json()).then(user => {
        const table = document.querySelector('.table-user');
        let tableRow = '';
        tableRow += `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.age}</td>
                        <td>${user.email}</td>
                        <td>${user.phoneNumber}</td>
                        <td>${user.roles.map(r => r.name).join(" ")}</td>
                        <td>
                </tr>
                    `;
        table.innerHTML = tableRow;
    });
}

/*_------------------------------------------------------------------------------------------------------------_*/

async function addUser() {

    const role = document.querySelector('#rolesNew').options;

    let array = []
    for (let i = 0; i < role.length; i++) {
        if (role[i].selected) {
            array.push({name: role[i].text})
        }
    }

    let user = {
        firstName: document.querySelector('#firstNameNew').value,
        lastName: document.querySelector('#lastNameNew').value,
        age: document.querySelector('#ageNew').value,
        email: document.querySelector('#emailNew').value,
        phoneNumber: document.querySelector('#phoneNumberNew').value,
        password: document.querySelector('#passwordNew').value,
        roles: array
    }

    const response = await addNewUser(user);
    if (response.ok) {
        await getAllUser();
        showUserTable();
    } else {
        let body = await response.json();
        let alert = document.querySelector('.alert');
        const h = document.createElement('h4');
        const fragment = document.createDocumentFragment();

        h.innerText = `${body.message}`;
        fragment.appendChild(h);
        alert.appendChild(fragment);
        alert.classList.add('show');
        $('#alert').on('click', async () => {
            alert.classList.remove('show');
            await getAllUser();
            showUserTable();
        });
    }
}

newUser.addEventListener('submit', async (e) => {
    e.preventDefault();
    await addUser();
    e.target.reset();
});

/*_-----------------------------------------------------------------------------------------------------------_*/

async function getAllUser() {
    let table = $('#tableAllUsers tbody');
    table.empty();

    await findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                let tableFilling = `$(
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.age}</td>
                        <td>${user.email}</td>
                        <td>${user.phoneNumber}</td>
                        <td>${user.roles.map(r => r.name).join(" ")}</td>
                        
                        <td>
                            <button id="edit" type="button" data-userid="${user.id}" data-action="edit" class="btn btn-info"
                             data-toggle="modal" data-target="#exampleModalEdit">Edit</button>  <!--className-->
                        </td>
                        <td>
                            <button id="delete" type="button" data-userid="${user.id}" data-action="delete" class="btn btn-danger"
                             data-toggle="modal" data-target="#exampleModalDelete">Delete</button>  <!--className-->
                        </td>      
                    </tr>
                )`;
                table.append(tableFilling);
            })
        })

    $("#tableAllUsers").find('button').on('click', (event) => {
        let openModal = $('#someDefaultModal');

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        openModal.attr('data-userid', buttonUserId);
        openModal.attr('data-action', buttonAction);
        openModal.modal('show');
    })
}

/*_-----------------------------------------------------------------------------------------------------------_*/

async function getModal() {
    $('#someDefaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        if (action === 'edit') {
            editUser(thisModal, userid);
        } else {
            deleteUser(thisModal, userid);
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    });
}

/*_-----------------------------------------------------------------------------------------------------------_*/

async function editUser(modal, id) {
    let response = await findOneUser(id);
    let user = response.json();

    modal.find('.modal-title').html('Edit user');

    let editButton = `<button  class="btn btn-success" id="editButton">Edit</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`

    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);

    await user.then(user => {
        let bodyForm = `
            <form class="form-group text-center" id="editUser">
               <div class="form-group mb-3 col-md-6 align-items-center text-center mx-auto">
                    <label for="id" class="col-form-label">ID</label>
                    <input type="text" class="form-control" id="id" value="${user.id}" readonly>
               </div>
                   
               <div class="form-group mb-3 col-md-6 align-items-center text-center mx-auto">
                    <label for="firstName" class="col-form-label">FirstName</label>
                    <input type="text" class="form-control" id="firstName" value="${user.firstName}">
               </div>

                <div class="form-group mb-3 col-md-6 align-items-center text-center mx-auto">
                    <label for="lastName" class="com-form-label">LastName</label>
                    <input type="text" class="form-control" id="lastName" value="${user.lastName}">
                </div>

                <div class="form-group mb-3 col-md-6 align-items-center text-center mx-auto">
                    <label for="age" class="com-form-label">Age</label>
                    <input type="number" class="form-control" id="age" value="${user.age}">
                </div>

                <div class="form-group mb-3 col-md-6 align-items-center text-center mx-auto">
                    <label for="email" class="com-form-label">Email</label>
                    <input type="text" class="form-control" id="email" value="${user.email}">
                </div>
                
                 <div class="form-group mb-3 col-md-6 align-items-center text-center mx-auto">
                    <label for="password" class="com-form-label">Password</label>
                    <input type="password" class="form-control" id="password" value="${user.password}">
                </div>
                
                <div class="form-group mb-3 col-md-6 align-items-center text-center mx-auto">
                    <label for="phoneNamber" class="com-form-label">Phone number</label>
                    <input type="tel" class="form-control" id="phoneNamber" value="${user.phoneNumber}">
                </div>
                
                <div class="form-group mb-3 col-md-6 align-items-center text-center mx-auto">
                        <label for="roles" class="form-label">Role: </label>
                        <select class="form-select form-select-sm" aria-label="Small select" name="select"
                                id="roles" size="2"
                                multiple required>
                            <option selected="selected" value="2" text="USER">USER</option>
                            <option value="1" text="ADMIN">ADMIN</option>
                        </select>
                    </div>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    $("#editButton").on('click', async () => {
        let id = modal.find("#id").val();
        let firstName = modal.find('#firstName').val().trim();
        let lastName = modal.find('#lastName').val().trim();
        let age = modal.find("#age").val().trim();
        let email = modal.find("#email").val().trim();
        let phoneNumber = modal.find('#phoneNamber').val().trim();
        let password = modal.find("#password").val().trim();

        const role = document.querySelector('#roles').options;

        let array = []
        for (let i = 0; i < role.length; i++) {
            if (role[i].selected) {
                array.push({name: role[i].getAttribute('text')})
            }
        }

        let user = {
            id: id,
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            phoneNumber: phoneNumber,
            password: password,
            roles: array
        }

        const response = await updateUser(user, id);

        if (response.ok) {
            await getAllUser();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.message}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}

/*_-----------------------------------------------------------------------------------------------------------_*/

async function deleteUser(modal, id) {
    let oneUser = await findOneUser(id);
    let user = oneUser.json();

    modal.find('.modal-title').html('Delete user');

    let deleteButton = `<button  class="btn btn-danger" id="deleteButton">Delete</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(deleteButton);
    modal.find('.modal-footer').append(closeButton);

    await user.then(user => {
        let bodyForm = `
            <form class="form-group text-center" id="editUser">
               <div class="form-group mb-3 col-md-6 align-items-center text-center mx-auto">
                    <label for="id" class="col-form-label">ID</label>
                    <input type="text" class="form-control" id="id" value="${user.id}" readonly disabled>
               </div>
                   
               <div class="form-group mb-3 col-md-6 align-items-center text-center mx-auto">
                    <label for="firstName" class="col-form-label">FirstName</label>
                    <input type="text" class="form-control" id="firstName" value="${user.firstName}" disabled>
               </div>

                <div class="form-group mb-3 col-md-6 align-items-center text-center mx-auto">
                    <label for="lastName" class="com-form-label">LastName</label>
                    <input type="text" class="form-control" id="lastName" value="${user.lastName}" disabled>
                </div>

                <div class="form-group mb-3 col-md-6 align-items-center text-center mx-auto">
                    <label for="age" class="com-form-label">Age</label> 
                    <input type="number" class="form-control" id="age" value="${user.age}" disabled>
                </div>

                <div class="form-group mb-3 col-md-6 align-items-center text-center mx-auto">
                    <label for="email" class="com-form-label">Email</label>
                    <input type="text" class="form-control" id="email" value="${user.email}" disabled>
                </div>
                                
                <div class="form-group mb-3 col-md-6 align-items-center text-center mx-auto">
                    <label for="phoneNamber" class="com-form-label">Phone number</label>
                    <input type="tel" class="form-control" id="phoneNamber" value="${user.phoneNumber}" disabled>
                </div>
                
                 <div class="form-group mb-3 col-md-6 align-items-center text-center mx-auto">
                    <label for="password" class="com-form-label">Password</label>
                    <input type="password" class="form-control" id="password" value="${user.password}" disabled>
                </div>
                
                <div class="form-group mb-3 col-md-6 align-items-center text-center mx-auto">
                        <label for="rolesNew" class="form-label">Role: </label>
                        <select class="form-select form-select-sm" aria-label="Small select" name="select"
                                id="rolesNew" size="2"
                                multiple disabled>
                            <option selected="selected" value="2" text="USER">USER</option>
                            <option value="1" text="ADMIN">ADMIN</option>
                        </select>
                    </div>
            </form>
        `;

        modal.find('.modal-body').append(bodyForm);
    });

    $("#deleteButton").on('click', async () => {
        await deleteUser(id);
        await getAllUser();
        modal.modal('hide');
    });
}
