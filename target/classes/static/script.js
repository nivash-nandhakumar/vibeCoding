document.addEventListener('DOMContentLoaded', () => {
    const clipboardHistory = document.getElementById('clipboard-history');
    const clipboardInput = document.getElementById('clipboard-input');
    const addButton = document.getElementById('add-button');
    const loginButton = document.querySelector('.login-button');
    const signupButton = document.querySelector('.signup_button');
    const avatarContainer = document.querySelector('.avatar-container');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const profileModal = document.getElementById('profile-modal');
    const editModal = document.getElementById('edit-modal');
    const closeButtons = document.querySelectorAll('.close-button');
    const loginSubmit = document.getElementById('login-submit');
    const signupSubmit = document.getElementById('signup-submit');
    const editSubmit = document.getElementById('edit-submit');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const signupUsernameInput = document.getElementById('signup-username');
    const signupPasswordInput = document.getElementById('signup-password');
    const signupEmailInput = document.getElementById('signup-email');
    const signupPhoneInput = document.getElementById('signup-phone');
    const profileButton = document.getElementById('profile-button');
    const logoutButton = document.getElementById('logout-button');
    const profileUsernameH2 = document.getElementById('profile-username-h2');
    const profileEmail = document.getElementById('profile-email');
    const profilePhone = document.getElementById('profile-phone');
    const editTextArea = document.getElementById('edit-textarea');

    let history = [];
    let currentEditId = null;

    const renderHistory = () => {
        clipboardHistory.innerHTML = '';
        if (localStorage.getItem('isLoggedIn') === 'true') {
            history.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = 'clipboard-item';
                const p = document.createElement('p');
                p.textContent = item.content;
                const buttonsDiv = document.createElement('div');
                buttonsDiv.className = 'buttons';
                const copyButton = document.createElement('button');
                copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                copyButton.onclick = () => {
                    navigator.clipboard.writeText(item.content);
                    copyButton.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => (copyButton.innerHTML = '<i class="fas fa-copy"></i>'), 1000);
                };
                const editButton = document.createElement('button');
                editButton.innerHTML = '<i class="fas fa-edit"></i>';
                editButton.onclick = () => {
                    currentEditId = item.content_Id;
                    editTextArea.value = item.content;
                    editModal.style.display = 'block';
                };
                const deleteButton = document.createElement('button');
                deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
                deleteButton.onclick = async () => {
                    div.style.animation = 'fadeOut 0.5s';
                    try {
                        const response = await fetch(`/api/data/${item.id}`, {
                            method: 'DELETE',
                        });
                        if (response.ok) {
                            setTimeout(() => {
                                updateLoginState();
                            }, 500);
                        } else {
                            alert('Failed to delete item from clipboard');
                            div.style.animation = ''; // Reset animation if delete fails
                        }
                    } catch (error) {
                        console.error('Error deleting item:', error);
                        alert('An error occurred while deleting the item.');
                        div.style.animation = ''; // Reset animation on error
                    }
                };
                buttonsDiv.appendChild(copyButton);
                buttonsDiv.appendChild(editButton);
                buttonsDiv.appendChild(deleteButton);
                div.appendChild(p);
                div.appendChild(buttonsDiv);
                clipboardHistory.appendChild(div);
            });
        }
    };

    const updateLoginState = async () => {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            loginButton.style.display = 'none';
            signupButton.style.display = 'none';
            avatarContainer.style.display = 'block';
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await fetch(`/api/data/${user.username}`);
            history = await response.json();
        } else {
            loginButton.style.display = 'block';
            signupButton.style.display = 'block';
            avatarContainer.style.display = 'none';
            history = [];
        }
        renderHistory();
    };

    addButton.addEventListener('click', async () => {
        const text = clipboardInput.value.trim();
        if (text && localStorage.getItem('isLoggedIn') === 'true') {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await fetch('/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: user.username, content: text })
            });
            if (response.ok) {
                clipboardInput.value = '';
                updateLoginState();
            } else {
                alert('Failed to add item to clipboard');
            }
        }
    });

    loginButton.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });

    signupButton.addEventListener('click', () => {
        signupModal.style.display = 'block';
    });

    closeButtons.forEach(button => {
        button.onclick = () => {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
            profileModal.style.display = 'none';
            editModal.style.display = 'none';
        };
    });

    window.addEventListener('click', (event) => {
        if (event.target == loginModal || event.target == signupModal || event.target == profileModal || event.target == editModal) {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
            profileModal.style.display = 'none';
            editModal.style.display = 'none';
        }
    });

    loginSubmit.addEventListener('click', async () => {
        const username = usernameInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const user = await response.json();
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('user', JSON.stringify(user));
                loginModal.style.display = 'none';
                signupModal.style.display = 'none';
                updateLoginState();
            } else {
                alert('Invalid username or password');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login. Please try again.');
        }

        usernameInput.value = '';
        passwordInput.value = '';
    });

    signupSubmit.addEventListener('click', async () => {
        const username = signupUsernameInput.value;
        const password = signupPasswordInput.value;
        const email = signupEmailInput.value;
        const phone = signupPhoneInput.value;

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, email, phone })
            });

            if (response.ok) {
                alert('User registered successfully');
                signupModal.style.display = 'none';
            } else {
                alert('Error registering user');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred during registration. Please try again.');
        }
    });

    editSubmit.addEventListener('click', async () => {
        const newContent = editTextArea.value.trim();
        console.log("button clickes", newContent, "   ", currentEditId)
        if (newContent && currentEditId) {
            try {
                const response = await fetch(`/api/data/${currentEditId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ content: newContent })
                });

                if (response.ok) {
                    editModal.style.display = 'none';
                    updateLoginState();
                } else {
                    alert('Failed to update item');
                }
            } catch (error) {
                console.error('Error updating item:', error);
                alert('An error occurred while updating the item.');
            }
        }
    });

    profileButton.addEventListener('click', () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            profileUsernameH2.textContent = user.username;
            profileEmail.textContent = user.email;
            profilePhone.textContent = user.phone;
            profileModal.style.display = 'block';
        }
    });

    logoutButton.addEventListener('click', () => {
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.removeItem('user');
        updateLoginState();
    });

    updateLoginState();
});