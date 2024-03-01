const userLink = document.getElementById('userLink')
const postLink = document.getElementById('postLink')
const contentBlock2 = document.getElementById('content')

fetch('/username')
    .then(response => response.json())
    .then(user => {
        const usernameDisplay = document.getElementById('usernameDisplay');
        usernameDisplay.innerHTML = `${user.username}`;
    })
    .catch(error => console.error('Error:', error)); 



    
async function fetchAndRenderUsers() {
    const response = await fetch('/users');
    const users = await response.json();
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = '';
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user._id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button class="edit-btn" onclick="editUser('${user._id}')">Edit</button>
                <button class="delete-btn" onclick="deleteUser('${user._id}')">Delete</button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}


function loadUsers(event) {
    event.preventDefault()
    const userTable = document.createElement('table');
    userTable.innerHTML = `
        <thead class="thead-dark">
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody id="userTableBody"></tbody>
    `;

    contentBlock2.innerHTML = '';
    contentBlock2.appendChild(userTable);

    fetchAndRenderUsers();
}

async function editUser(_id) {
    const newUsername = prompt('Enter new username:');
    const newEmail = prompt('Enter new email:');

    try {
        await axios.put(`/users/${_id}`, {
            username: newUsername,
            email: newEmail
        });
        alert('User updated successfully!');
        location.reload();
      } catch (error) {
        console.error(error);
        alert('Error updating user.');
      }
    fetchAndRenderUsers();
}



async function deleteUser(_id) {
    try {
        const confirmDelete = confirm('Are you sure you want to delete this user?');
        if (confirmDelete) {
        await axios.delete(`/users/${_id}`);
        alert('User deleted successfully!');
        fetchAndRenderUsers();
        }else{
            console.error(`Error deleting user with ID ${_id}`);}
      } catch (error) {
        console.error(error);
        alert('Error deleting user.');
      }
}

