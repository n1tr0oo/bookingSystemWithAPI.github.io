const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		console.log(entry)
		if (entry.isIntersecting) {
			entry.target.classList.add('show');
		} else {
			entry.target.classList.remove('show');
		}
	});
});
const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));


const audio = new Audio("audio.mp3");
const buttons = document.querySelectorAll("button");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    audio.play();
  });
});

// Create A New User
async function createUser() {
    try {
    const username = document.getElementById('username').value;
	  const firstName = document.getElementById('firstName').value;
	  const lastName = document.getElementById('lastName').value;
	  const email = document.getElementById('email').value;
	  const age = document.getElementById('age').value;
    const country = document.getElementById('country').value;
    const gender = document.getElementById('gender').value;
	  const password = document.getElementById('password').value;
	  const password2 = document.getElementById('password2').value;
    const role = "user";
    if (!username || !firstName || !lastName || !email || !age || !country || !gender || !password || !password2) {
      alert('Missing required fields');
      return;
    }
    if(password != password2){
      alert('Password doesnt match');
          return;
      } 
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address");
        return;
    } 
    if (password.length <= 8) {
        alert("Password must be longer than 8 characters");
        return;
    }
    var symbolPattern = /[!@#$%^&*().]/;
    if (!symbolPattern.test(password)) {
        alert("Password must contain at least one symbol like dot");
        return;
    }       
      const response = await fetch('/users', { 
        method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, firstName, lastName, email, age, country, gender, password, role }),
       });
      const createdUser = await response.data;
      console.log(createdUser);
      alert('User created successfully!');
    } catch (error) {
      console.error(error);
      alert('Error creating user.');
    }
  }

  async function login(){
    try{
      const email = document.getElementById('email').value;
      const hashPasswd = document.getElementById('password').value;
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
           'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, hashPasswd }),
     });
     if (!response.ok) {

      console.error('Error during login:', response.status, response.statusText);
      alert('Error logging in. Please check your credentials and try again.');
      return;
     }

    const data = await response.json();
    alert('Login successful!');
    console.log(data)
       if(data.role === "admin"){
          window.location.href =`/admin?username=${data.username}`;
       } else if(data.role === "user"){
          window.location.href =`/?username=${data.username}`;
       }
    }catch(error){
      console.error(error);
      alert('Error logining user.');
    }
  }


  // Get All Blogs
  async function getAllBlogs() {
    try {
      const response = await axios.get('/todos');
      const todos = response.data;
  
      // Clear previous content in the container
      const container = document.getElementById('container');
      container.innerHTML = '';
  
      // Iterate through each blog and create HTML elements
      todos.forEach(blog => {
        const blogContainer1 = document.createElement('div');
        blogContainer1.classList.add('posts');
        const blogContainer = document.createElement('div');
        blogContainer.classList.add('card-body');
        blogContainer1.appendChild(blogContainer)
        const titleElement = document.createElement('h4');
        titleElement.classList.add('card-title');
        titleElement.textContent = `Todo task: ${blog.title}`;
  
        const bodyElement = document.createElement('p');
        bodyElement.classList.add('card-text');
        bodyElement.textContent = `More details about todo: ${blog.body}`;
  
        const authorElement = document.createElement('p');
        authorElement.className = 'card-subtitle mb-2 text-muted';
        authorElement.textContent = `ID: ${blog._id}`;
  
        const createdAtElement = document.createElement('h6');
      
        createdAtElement.textContent = `Created At: ${blog.createdAt}`;

        const updatedAtElement = document.createElement('h6');
       
        updatedAtElement.textContent = `Updated At: ${blog.updatedAt}`;
  
        blogContainer.appendChild(titleElement);
        blogContainer.appendChild(authorElement);
        blogContainer.appendChild(bodyElement);        
        blogContainer.appendChild(createdAtElement);
        blogContainer.appendChild(updatedAtElement);
   
        // Add the blog container to the main container
        container.appendChild(blogContainer1);
      });
    } catch (error) {
      console.error(error);
    }
  }
  
  
  // Update Blog
  async function updateBlog() {
    const updateId = document.getElementById('updateId').value;
    const updateTitle = document.getElementById('updateTitle').value;
    const updateBody = document.getElementById('updateBody').value;
    const updateAuthor = document.getElementById('updateAuthor').value;
  
    try {
      await axios.put(`/todos/${updateId}`, {
        title: updateTitle,
        body: updateBody,
        author: updateAuthor,
      });
      alert('Todo updated successfully!');
      $('#exampleModal2').modal('hide');
      location.reload();
    } catch (error) {
      console.error(error);
      alert('Error updating todo.');
    }
  }
  
  // Delete Blog
  async function deleteBlog() {
    const deleteId = document.getElementById('deleteId').value;
  
    try {
      await axios.delete(`/todos/${deleteId}`);
      alert('Todo deleted successfully!');
      $('#exampleModal3').modal('hide');
      location.reload();
    } catch (error) {
      console.error(error);
      alert('Error deleting todo.');
    }
  }






  


 




