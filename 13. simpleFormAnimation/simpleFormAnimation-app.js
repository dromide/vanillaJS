function animatedForm() {
    const arrows = document.querySelectorAll(".fa-arrow-down");

    arrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            const input = arrow.previousElementSibling;
            console.log(input);
            const parent = arrow.parentElement;
            console.log(parent);
            const nextForm = parent.nextElementSibling;

            // Check for validation
            if (input.type === 'text' && validateUser(input)) {
                // console.log("everything is Ok!");
                nextSlide(parent, nextForm);
            } else if (input.type === 'email' && validateEmail(input)) {
                nextSlide(parent, nextForm);
            } else if (input.type === 'password' && validateUser(input)) {
                nextSlide(parent, nextForm);
            } else {
                parent.style.animation = 'shake 0.5s ease';
            }
            // get rid of animation
            parent.addEventListener('animationend', () => {
                parent.style.animation = "";
            });
        });
    });
}

function validateUser(user) {
    if (user.value.length < 6) {
        console.log("not enough character");
        error("rgb(189,87,87)");
    } else {
        error("rgb(87,189,130)");
        return true;
    }
}

function validateEmail(email) {
    const validation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // need one more Check
    if (validation.test(email.value)) {
        error("rgb(87,189,130)");
        return true;
    } else {
        error("rgb(189,87,87)");
    }
}

function nextSlide(parent, nextForm) {
    parent.classList.add('innactive');
    parent.classList.remove('active');
    nextForm.classList.add('active');
}

function error(color) {
    document.body.style.backgroundColor = color;
}

animatedForm();

// 옆에 프로그래스바를 만들어 어디 있는지 알게하기, 이동가능하도록?