document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Dynamic Hero Section Background Animation
const hero = document.querySelector('.hero');

window.addEventListener('scroll', () => {
    let offset = window.pageYOffset;
    hero.style.backgroundPositionY = `${offset * 0.5}px`;
});
