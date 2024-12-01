document.addEventListener("DOMContentLoaded", function () {
  const permissionButtons = document.querySelectorAll(".doctor-permission-btn");
  const dpNoneFirst = document.querySelector(".dp-none-first");

  permissionButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const dpNoneSecond = this.closest("tr").querySelector(".dp-none-second");

      if (dpNoneSecond) {
        dpNoneSecond.style.display =
          dpNoneSecond.style.display === "none" || !dpNoneSecond.style.display
            ? "table-cell"
            : "none";
      }

      const visibleElements = document.querySelectorAll(
        ".dp-none-second[style*='table-cell']"
      );

      if (visibleElements.length > 0) {
        dpNoneFirst.style.display = "table-cell";
      } else {
        dpNoneFirst.style.display = "none";
      }
    });
  });
});
