document.addEventListener("DOMContentLoaded", () => {
  const calendarTable = document.getElementById("calendarTable");
  const presentMonth = document.getElementById("presentMonth");
  const todayButton = document.getElementById("todayButton");
  const prevArrow = document.querySelector(".prev-arrow");
  const nextArrow = document.querySelector(".next-arrow");

  const monthNames = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "İyun",
    "İyul",
    "Avqust",
    "Sentyabr",
    "Oktyabr",
    "Noyabr",
    "Dekabr",
  ];

  let currentDate = new Date();

  // Tədbir məlumatları
  const events = {
    "2024-11-01": [{ name: "Həsən Hüs...", type: "event" }],
    "2024-11-12": [{ name: "Həsən Hüs...", type: "group-event" }],
  };

  function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    presentMonth.textContent = `${monthNames[month]} ${year}`;
    calendarTable.innerHTML = "";

    // Cədvəl yaratma
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Həftə günləri
    const weekRow = document.createElement("tr");
    ["B.", "B.E", "Ç.A", "Ç", "C.A", "C.", "Ş."].forEach((day) => {
      const th = document.createElement("th");
      th.textContent = day;
      weekRow.appendChild(th);
    });
    thead.appendChild(weekRow);

    // Günlər
    let day = 1;
    let nextMonthDay = 1;
    for (let i = 0; i < 6; i++) {
      const row = document.createElement("tr");

      for (let j = 0; j < 7; j++) {
        const cell = document.createElement("td");

        if (i === 0 && j < firstDayOfMonth) {
          // Keçən ayın günləri
          cell.textContent = daysInPrevMonth - (firstDayOfMonth - j - 1);
          cell.classList.add("prev-month");
        } else if (day > daysInMonth) {
          // Gələn ayın günləri
          cell.textContent = nextMonthDay;
          nextMonthDay++;
          cell.classList.add("next-month");
        } else {
          // Cari ayın günləri
          const fullDate = `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;
          cell.textContent = day;

          // Tədbirlər əlavə etmək
          if (events[fullDate]) {
            events[fullDate].forEach((event) => {
              const eventBox = document.createElement("div");
              if (event.type === "group-event") {
                cell.classList.add("group-event");
                eventBox.classList.add("group-event-box");
              } else {
                cell.classList.add("event");
                eventBox.classList.add("event-box");
              }
              eventBox.innerHTML = `
                  <div class="name">${event.name}</div>
                  ${
                    event.type === "group-event"
                      ? '<i class="fa-solid fa-users"></i>'
                      : ""
                  }
                `;
              cell.appendChild(eventBox);
            });
          }

          if (
            day === currentDate.getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear()
          ) {
            cell.classList.add("today-color");
          }
          day++;
        }

        row.appendChild(cell);
      }

      tbody.appendChild(row);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    calendarTable.appendChild(table);
  }

  function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    renderCalendar(currentDate);
  }

  function goToToday() {
    currentDate = new Date();
    renderCalendar(currentDate);
  }

  prevArrow.addEventListener("click", () => changeMonth(-1));
  nextArrow.addEventListener("click", () => changeMonth(1));
  todayButton.addEventListener("click", goToToday);

  // İlk render
  renderCalendar(currentDate);
});
