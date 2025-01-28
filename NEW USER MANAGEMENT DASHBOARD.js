const userForm = document.getElementById("user-form");
const userList = document.getElementById("user-list");
const errorMessage = document.getElementById("error-message");
const submitButton = document.getElementById("submit-button");
const updateButton = document.getElementById("update-button");
let editingUserId = null;

function getUsers() {
    let users = JSON.parse(localStorage.getItem("users"));
    if (!users) {
        users = Array.from({
            length: 10
        }, (_, i) => ({
            id: i + 1,
            firstName: `First${i + 1}`,
            lastName: `Last${i + 1}`,
            email: `user${i + 1}@example.com`,
            department: `Department ${i + 1}`
        }));
        saveUsers(users);
    }
    return users;
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function renderUsers() {
    const users = getUsers();
    userList.innerHTML = "";
    users.forEach((user) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${user.id}</td>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.email}</td>
                        <td>${user.department}</td>
                        <td>
                            <button onclick="editUser(${user.id})" class="edit-btn">Edit</button>
                            <button onclick="deleteUser(${user.id})" class="del-btn">Delete</button>
                        </td>`;
        userList.appendChild(tr);
    });
}

userForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const firstName = document.getElementById("name").value;
    const lastName = document.getElementById("last-name").value;
    const email = document.getElementById("email").value;
    const department = document.getElementById("department").value;
    let users = getUsers();

    // If not in edit mode, generate a new ID for the user
    if (editingUserId === null) {
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        users.push({
            id: newId,
            firstName,
            lastName,
            email,
            department
        });
    } else {
        // In edit mode, update the existing user
        users = users.map(user =>
            user.id === editingUserId ? {
                ...user,
                firstName,
                lastName,
                email,
                department
            } : user
        );
    }

    saveUsers(users);
    renderUsers();
    userForm.reset();
    submitButton.style.display = "block";
    updateButton.style.display = "none";
    editingUserId = null;
});

updateButton.addEventListener("click", () => {
    const firstName = document.getElementById("name").value;
    const lastName = document.getElementById("last-name").value;
    const email = document.getElementById("email").value;
    const department = document.getElementById("department").value;
    let users = getUsers();

    users = users.map(user => user.id === editingUserId ? {
        id: user.id,
        firstName,
        lastName,
        email,
        department
    } : user);

    saveUsers(users);
    renderUsers();
    userForm.reset();
    submitButton.style.display = "block";
    updateButton.style.display = "none";
    editingUserId = null;
});

function editUser(id) {
    const users = getUsers();
    const user = users.find(user => user.id === id);
    document.getElementById("name").value = user.firstName;
    document.getElementById("last-name").value = user.lastName;
    document.getElementById("email").value = user.email;
    document.getElementById("department").value = user.department;
    editingUserId = id;
    submitButton.style.display = "none";
    updateButton.style.display = "block";
}

function deleteUser(id) {
    let users = getUsers().filter(user => user.id !== id);

    // Re-sequence the remaining user IDs
    users = users.map((user, index) => ({
        ...user,
        id: index + 1 // Reassign new IDs starting from 1
    }));

    saveUsers(users);
    renderUsers();
}

renderUsers();