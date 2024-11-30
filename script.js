let filmList = JSON.parse(localStorage.getItem('userFilms')) || [];


function toggleForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
    registerForm.style.display = registerForm.style.display === 'none' ? 'block' : 'none';
}


function addFilm() {
    const filmTitle = document.getElementById('registerFilmTitle').value;
    const filmCoverInput = document.getElementById('registerFilmCover');
    const filmCover = filmCoverInput.files[0];

    if (!filmTitle || !filmCover) {
        alert('Por favor, preencha o título do filme e selecione uma capa.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const newFilm = {
            title: filmTitle,
            cover: e.target.result,
        };

        filmList.push(newFilm);
        updateFilmPreview();
        document.getElementById('registerFilmTitle').value = '';
        filmCoverInput.value = '';
    };

    reader.readAsDataURL(filmCover);
}


function updateFilmPreview() {
    const filmPreview = document.getElementById('filmPreview');
    filmPreview.innerHTML = '';

    filmList.forEach((film, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="film-item">
                <img src="${film.cover}" alt="${film.title}">
                <span>${film.title}</span>
                <button onclick="removeFilm(${index})">Remover</button>
            </div>
        `;
        filmPreview.appendChild(li);
    });
}


function removeFilm(index) {
    filmList.splice(index, 1);
    updateFilmPreview();
}


function register() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;

    if (!name || !email || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    if (!email.includes('@')) {
        alert('Por favor, insira um email válido.');
        return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
        alert('A senha deve conter pelo menos 8 caracteres, incluindo letras e números.');
        return;
    }

    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPassword', password);
    localStorage.setItem('userFilms', JSON.stringify(filmList));

    alert('Registro realizado com sucesso!');
    toggleForm();

    
    document.getElementById('registerName').value = '';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value = '';
}


function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const storedEmail = localStorage.getItem('userEmail');
    const storedPassword = localStorage.getItem('userPassword');

    if (email === storedEmail && password === storedPassword) {
        alert('Login realizado com sucesso!');
        window.location.href = 'filmes.html';
    } else if (email !== storedEmail) {
        alert('Usuário não encontrado. Por favor, registre-se primeiro.');
    } else {
        alert('Senha incorreta.');
    }
}
