document.querySelectorAll('.toggle-status').forEach(button => {
    button.addEventListener('click', function () {
        this.classList.toggle('active');
    });
});
