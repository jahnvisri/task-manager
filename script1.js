document.getElementById('signin').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
  
    // Get the entered username and password
    var username = document.getElementById('username').value;
    var password = document.getElementById('pass').value;
  
    // Perform your login validation here
    // For demonstration purposes, we'll assume "username" and "password" as valid credentials
    if (username === 'admin' && password === 'password') {
      // Redirect to another page
      window.location.href = 'index.html';
    } else {
      alert('Invalid username or password. Please try again.');
    }
  });
  
  // Toggle password visibility
  var showPassword = document.getElementById('showpwd');
  showPassword.addEventListener('click', function() {
    var passwordInput = document.getElementById('pass');
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      showPassword.classList.remove('fa-eye-slash');
      showPassword.classList.add('fa-eye');
    } else {
      passwordInput.type = 'password';
      showPassword.classList.remove('fa-eye');
      showPassword.classList.add('fa-eye-slash');
    }
  });