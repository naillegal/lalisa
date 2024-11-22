// sidebar close-open toggle
// Elementləri seçirik
const sidebar = document.getElementById('sidebar');
const responsiveSidebar = document.getElementById('responsive-sidebar');
const navbar = document.getElementById('navbar');
const slot = document.getElementById('slot');
const toggleBars = document.querySelector('.fa-bars');
const toggleArrow = document.querySelector('.fa-arrow-right');

// fa-bars-a klik hadisəsi
toggleBars.addEventListener('click', () => {
  // Sidebar gizlədilir, responsive-sidebar göstərilir
  sidebar.style.display = 'none';
  responsiveSidebar.style.display = 'flex';

  // Navbar və Slot bölməsinin eni tənzimlənir
  navbar.style.width = 'calc(100% - 92px)';
  slot.style.width = 'calc(100% - 92px)';

  // İkonları dəyişdiririk
  toggleBars.classList.add('d-none');
  toggleArrow.classList.remove('d-none');
});

// fa-arrow-right-a klik hadisəsi
toggleArrow.addEventListener('click', () => {
  // Sidebar göstərilir, responsive-sidebar gizlədilir
  sidebar.style.display = 'flex';
  responsiveSidebar.style.display = 'none';

  // Navbar və Slot bölməsinin eni tənzimlənir
  navbar.style.width = 'calc(100% - 245px)';
  slot.style.width = 'calc(100% - 245px)';

  // İkonları dəyişdiririk
  toggleArrow.classList.add('d-none');
  toggleBars.classList.remove('d-none');
});






