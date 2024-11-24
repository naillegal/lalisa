// sidebar close-open toggle
const sidebar = document.getElementById('sidebar');
const responsiveSidebar = document.getElementById('responsive-sidebar');
const navbar = document.getElementById('navbar');
const slot = document.getElementById('slot');
const toggleBars = document.querySelector('.fa-bars');
const toggleArrow = document.querySelector('.fa-arrow-right');

toggleBars.addEventListener('click', () => {
  sidebar.style.display = 'none';
  responsiveSidebar.style.display = 'flex';

  navbar.style.width = 'calc(100% - 92px)';
  slot.style.width = 'calc(100% - 92px)';

  toggleBars.classList.add('d-none');
  toggleArrow.classList.remove('d-none');
});

toggleArrow.addEventListener('click', () => {
  sidebar.style.display = 'flex';
  responsiveSidebar.style.display = 'none';

  navbar.style.width = 'calc(100% - 245px)';
  slot.style.width = 'calc(100% - 245px)';

  toggleArrow.classList.add('d-none');
  toggleBars.classList.remove('d-none');
});






