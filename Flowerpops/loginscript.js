document.addEventListener('DOMContentLoaded', function() {
    // Define user accounts with roles
    const users = {
        'user@webdev.com': { password: 'user123', role: 'user' },
        'admin@flowerpops.com': { password: 'admin123', role: 'admin' },
        'superadmin@flowerpops.com': { password: 'superadmin123', role: 'superadmin' }
    };

    // Access the form element
    const loginForm = document.querySelector('form');

    // Add an event listener for the form submission
    loginForm.addEventListener('submit', function(event) {
        // Prevent the default form submission
        event.preventDefault();

        // Get the values entered by the user
        const email = document.querySelector('input[type="email"]').value;
        const password = document.querySelector('input[type="password"]').value;

        // Simple validation (for demo purposes only - not secure)
        if (email.trim() === '' || password.trim() === '') {
            alert('Please enter both email and password.');
            return;
        }

        // Check if user exists and password is correct
        if (users[email] && users[email].password === password) {
            const userRole = users[email].role;
            
            // Redirect based on user role
            if (userRole === 'superadmin') {
                alert('Login successful! Redirecting to super admin dashboard...');
                window.location.href = 'superadmin.html';
            } else if (userRole === 'admin') {
                alert('Login successful! Redirecting to admin dashboard...');
                window.location.href = 'admin.html';
            } else {
                alert('Login successful! Redirecting to user page...');
                window.location.href = 'user.html';
            }
        } else {
            alert('Invalid email or password. Please try again.');
        }
    });
});
