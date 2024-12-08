document.addEventListener("DOMContentLoaded", () => {
  let currentView = "month";
  let currentDate = new Date();
  let popupMode = ""; // "add", "edit", "view"

  const calendarTable = document.getElementById("calendarTable");
  const presentMonth = document.getElementById("presentMonth");
  const todayButton = document.getElementById("todayButton");
  const prevArrow = document.querySelector(".prev-arrow");
  const nextArrow = document.querySelector(".next-arrow");

  const weekView = document.getElementById("weekView");
  const weekViewBody = document.getElementById("weekViewBody");

  const dayView = document.getElementById("dayView");
  const dayViewBody = document.getElementById("dayViewBody");

  const dayViewButton = document.getElementById("dayViewButton");
  const weekViewButton = document.getElementById("weekViewButton");
  const monthViewButton = document.getElementById("monthViewButton");

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

  const weekDayNames = ["B.E", "Ç.A", "Ç", "C.A", "C.", "Ş.", "B."];

  const monthEvents = {
    "2024-12-01": [{ names: ["Həsən Hüseynov, Fərid Mirzəyev"] }],
    "2024-12-12": [{ names: ["Fərid Mirzəyev, Həsən Hüseynov"] }],
  };

  const weekEvents = {
    "2024-12-05": [
      {
        names: ["Həsən Hüseynov", "Pərviz Fətullayev", "Fərid Mirzəyev"],
        time: "09:30",
      },
      {
        names: ["Pərviz Fətullayev", "Əli Məmmədov"],
        time: "11:00",
      },
    ],
    "2024-12-08": [
      {
        names: ["Müəllim", "Şagirdlər"],
        time: "16:30",
      },
    ],
  };

  const dayEvents = {
    "2024-12-05": [
      {
        time: "09:30",
        names: ["Həsən Hüseynov", "Pərviz Fətullayev", "Fərid Mirzəyev"],
      },
      {
        time: "14:00",
        names: ["Əli Məmmədov", "Leyla Qasımova"],
      },
    ],
    "2024-12-06": [
      {
        time: "10:00",
        names: ["Nərgiz Əliyeva", "Əli Məmmədov"],
      },
    ],
  };

  // Popup Elements
  const calendarEventPopup = document.querySelector(".calendar-event-popup");
  const popupHeader = calendarEventPopup.querySelector("h4");
  const popupCloseIcon = calendarEventPopup.querySelector(".fa-xmark");
  const popupCancelButton = calendarEventPopup.querySelector(".treatment-content-popup-close");
  const popupSaveButton = calendarEventPopup.querySelector(".treatment-content-popup-confirm");
  const overlay = document.getElementById("overlay");

  // Delete Popup Elements
  const deletePopup = document.querySelector(".ellipsis-delete-popup");
  const deleteCloseButton = deletePopup.querySelector(".ellipsis-popup-close");
  const deleteConfirmButton = deletePopup.querySelector(".ellipsis-popup-confirm");
  const deletePopupCloseIcon = deletePopup.querySelector(".fa-trash-can"); // Assuming there's an icon to close

  // Function to open popup
  function openPopup(mode, eventData = null) {
    popupMode = mode;
    popupHeader.textContent =
      mode === "add"
        ? "Add New Event"
        : mode === "edit"
        ? "Edit Event"
        : "View Event";

    // Enable or disable inputs based on mode
    const inputs = calendarEventPopup.querySelectorAll("input, textarea, checkbox");
    if (mode === "view") {
      inputs.forEach((input) => {
        input.disabled = true;
      });
    } else {
      inputs.forEach((input) => {
        input.disabled = false;
      });
    }

    // If editing or viewing, populate the form with event data
    if ((mode === "edit" || mode === "view") && eventData) {
      // Assuming eventData contains the necessary fields
      // Example:
      // eventData = {
      //   participants: "John Doe",
      //   startDate: "2024-12-01",
      //   endDate: "2024-12-01",
      //   startTime: "10:00",
      //   endTime: "12:00",
      //   theme: "green",
      //   description: "Meeting description"
      // };
      calendarEventPopup.querySelector('input[type="text"]').value = eventData.participants || "";
      calendarEventPopup.querySelector('input[type="date"]:first-of-type').value = eventData.startDate || "";
      calendarEventPopup.querySelector('input[type="date"]:last-of-type').value = eventData.endDate || "";
      calendarEventPopup.querySelector('input[type="time"]:first-of-type').value = eventData.startTime || "";
      calendarEventPopup.querySelector('input[type="time"]:last-of-type').value = eventData.endTime || "";
      calendarEventPopup.querySelector('textarea').value = eventData.description || "";
      
      // Handle theme checkboxes
      const themeColors = ["green", "blue", "orange", "purple", "red"];
      themeColors.forEach((color) => {
        const checkbox = calendarEventPopup.querySelector(`input[type="checkbox"][value="${color}"]`);
        if (checkbox) {
          checkbox.checked = eventData.theme === color;
        }
      });
    } else {
      // Clear the form for 'add' mode
      calendarEventPopup.querySelectorAll("input, textarea").forEach((input) => {
        if (input.type !== "checkbox") {
          input.value = "";
        }
        if (input.type === "checkbox") {
          input.checked = false;
        }
      });
    }

    calendarEventPopup.style.display = "block";
    overlay.style.display = "block";
  }

  // Function to close popup
  function closePopup() {
    calendarEventPopup.style.display = "none";
    overlay.style.display = "none";
    popupMode = "";
  }

  // Function to open delete popup
  function openDeletePopup() {
    deletePopup.style.display = "block";
    overlay.style.display = "block";
  }

  // Function to close delete popup
  function closeDeletePopup() {
    deletePopup.style.display = "none";
    overlay.style.display = "none";
  }

  // Event listener for closing popup
  popupCloseIcon.addEventListener("click", closePopup);
  popupCancelButton.addEventListener("click", closePopup);
  popupSaveButton.addEventListener("click", () => {
    // Save functionality can be implemented here
    closePopup();
  });

  // Event listener for closing delete popup
  deleteCloseButton.addEventListener("click", closeDeletePopup);
  deleteConfirmButton.addEventListener("click", () => {
    // Delete functionality can be implemented here
    closeDeletePopup();
  });

  // Event listener for overlay click to close popups
  overlay.addEventListener("click", () => {
    closePopup();
    closeDeletePopup();
    // Also close any open dropdowns
    closeAllDropdowns();
  });

  // Function to close all dropdowns
  function closeAllDropdowns() {
    const allDropdowns = document.querySelectorAll(".ellipsis-drop-down");
    allDropdowns.forEach((dropdown) => {
      dropdown.style.display = "none";
    });
  }

  // Handle ellipsis dropdown toggle
  function handleEllipsisToggle(event) {
    event.stopPropagation(); // Prevent event bubbling
    const dropdown = this.nextElementSibling;
    if (dropdown.style.display === "block") {
      dropdown.style.display = "none";
    } else {
      closeAllDropdowns();
      dropdown.style.display = "block";
    }
  }

  // Attach event listeners to all ellipsis icons
  function attachEllipsisListeners() {
    const ellipsisIcons = document.querySelectorAll(".fa-ellipsis-vertical");
    ellipsisIcons.forEach((icon) => {
      icon.addEventListener("click", handleEllipsisToggle);
    });
  }

  // Handle Add Event button click
  const addEventButton = document.querySelector(".event-button-box button");
  addEventButton.addEventListener("click", () => {
    openPopup("add");
    closeAllDropdowns();
  });

  // Delegate event listeners for View, Edit, and Delete buttons inside dropdowns
  document.addEventListener("click", (event) => {
    // View Button
    if (event.target.closest(".ellipsis-drop-down button:nth-child(1)")) {
      const dropdown = event.target.closest(".ellipsis-drop-down");
      dropdown.style.display = "none";
      // Fetch event data as needed
      const eventDetails = event.target.closest(".event").querySelector(".event-details");
      const date = eventDetails.querySelector(".date").textContent;
      const time = eventDetails.querySelector(".time").textContent;
      const participants = eventDetails.querySelector(".name").textContent;
      // Example eventData structure
      const eventData = {
        participants: participants,
        startDate: "2024-12-01", // This should be parsed from date and time
        endDate: "2024-12-01",
        startTime: "10:30",
        endTime: "17:30",
        theme: "orange",
        description: "Event description", // This should be fetched accordingly
      };
      openPopup("view", eventData);
    }

    // Edit Button
    if (event.target.closest(".ellipsis-drop-down button:nth-child(2)")) {
      const dropdown = event.target.closest(".ellipsis-drop-down");
      dropdown.style.display = "none";
      // Fetch event data as needed
      const eventDetails = event.target.closest(".event").querySelector(".event-details");
      const date = eventDetails.querySelector(".date").textContent;
      const time = eventDetails.querySelector(".time").textContent;
      const participants = eventDetails.querySelector(".name").textContent;
      // Example eventData structure
      const eventData = {
        participants: participants,
        startDate: "2024-12-01", // This should be parsed from date and time
        endDate: "2024-12-01",
        startTime: "10:30",
        endTime: "17:30",
        theme: "orange",
        description: "Event description", // This should be fetched accordingly
      };
      openPopup("edit", eventData);
    }

    // Delete Button
    if (event.target.closest(".ellipsis-drop-down button:nth-child(3)")) {
      const dropdown = event.target.closest(".ellipsis-drop-down");
      dropdown.style.display = "none";
      openDeletePopup();
    }
  });

  // Initial attachment of ellipsis listeners
  attachEllipsisListeners();

  // Re-attach ellipsis listeners whenever the calendar is re-rendered
  // Modify renderCalendar, renderWeekView, renderDayView to call attachEllipsisListeners()

  // Modify existing render functions to re-attach listeners after rendering
  const originalRenderCalendar = renderCalendar;
  renderCalendar = function () {
    originalRenderCalendar();
    attachEllipsisListeners();
  };

  const originalRenderWeekView = renderWeekView;
  renderWeekView = function () {
    originalRenderWeekView();
    attachEllipsisListeners();
  };

  const originalRenderDayView = renderDayView;
  renderDayView = function () {
    originalRenderDayView();
    attachEllipsisListeners();
  };

  // Rest of the existing code...

  function getStartOfWeek(date) {
    const day = date.getDay();
    const diff = (day + 6) % 7;
    const start = new Date(date);
    start.setDate(date.getDate() - diff);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  function formatWeekRange(startDate) {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const startMonth = monthNames[startDate.getMonth()];
    const endMonth = monthNames[endDate.getMonth()];
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const year = startDate.getFullYear();

    if (startMonth === endMonth) {
      return `${startDay} - ${endDay} ${startMonth} ${year}`;
    } else {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
    }
  }

  function formatWeekDayHeader(date) {
    const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
    const dayName = weekDayNames[dayIndex];
    const dateStr = `${dayName} ${date.getDate()}/${date.getMonth() + 1}`;
    return dateStr;
  }

  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    presentMonth.textContent = `${monthNames[month]} ${year}`;
    calendarTable.innerHTML = "";

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    const weekRow = document.createElement("tr");
    weekDayNames.forEach((day) => {
      const th = document.createElement("th");
      th.textContent = day;
      weekRow.appendChild(th);
    });
    thead.appendChild(weekRow);

    let dayCounter = 1;
    let nextMonthDay = 1;
    let startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    for (let i = 0; i < 6; i++) {
      const row = document.createElement("tr");

      for (let j = 0; j < 7; j++) {
        const cell = document.createElement("td");

        if (i === 0 && j < startingDay) {
          cell.textContent = daysInPrevMonth - (startingDay - j - 1);
          cell.classList.add("prev-month");
        } else if (dayCounter > daysInMonth) {
          cell.textContent = nextMonthDay;
          nextMonthDay++;
          cell.classList.add("next-month");
        } else {
          const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayCounter).padStart(2, "0")}`;
          cell.textContent = dayCounter;

          if (monthEvents[fullDate]) {
            monthEvents[fullDate].forEach((event) => {
              const eventBox = document.createElement("div");
              eventBox.classList.add("month-event-box");
              const namesArray = event.names.flatMap((name) =>
                name.split(",").map((n) => n.trim())
              );
              let displayName = namesArray[0];
              if (namesArray.length > 1) {
                const firstName = namesArray[0].split(" ")[0];
                displayName = `${firstName}..`;
              }
              eventBox.innerHTML = `<div class="name">${displayName}</div><i class="fa-solid fa-users"></i>`;
              cell.appendChild(eventBox);
            });
          }

          const today = new Date();
          if (
            dayCounter === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
          ) {
            cell.classList.add("today-color");
          }

          cell.addEventListener("click", () => {
            currentDate = new Date(year, month, dayCounter);
            if (currentView === "day") {
              renderDayView();
            } else if (currentView === "week") {
              renderWeekView();
            }
          });

          dayCounter++;
        }

        row.appendChild(cell);
      }

      tbody.appendChild(row);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    calendarTable.appendChild(table);

    weekView.classList.add("d-none");
    dayView.classList.add("d-none");
    calendarTable.classList.remove("d-none");
  }

  function renderWeekView() {
    weekView.classList.remove("d-none");
    calendarTable.classList.add("d-none");
    dayView.classList.add("d-none");

    weekViewBody.innerHTML = "";

    const startOfWeek = getStartOfWeek(currentDate);
    presentMonth.textContent = formatWeekRange(startOfWeek);

    const datesInWeek = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      datesInWeek.push(date);
    }

    const weekViewHeader = weekView.querySelector("thead tr");
    if (weekViewHeader) {
      const headerCells = weekViewHeader.querySelectorAll("th");
      datesInWeek.forEach((date, index) => {
        const headerCell = headerCells[index + 1];
        if (headerCell) {
          headerCell.textContent = formatWeekDayHeader(date);
          const today = new Date();
          if (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
          ) {
            headerCell.classList.add("current-date");
          } else {
            headerCell.classList.remove("current-date");
          }
        }
      });
    } else {
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      const timeHeader = document.createElement("th");
      timeHeader.textContent = "Saat";
      headerRow.appendChild(timeHeader);
      datesInWeek.forEach((date) => {
        const th = document.createElement("th");
        th.textContent = formatWeekDayHeader(date);
        const today = new Date();
        if (
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        ) {
          th.classList.add("current-date");
        }
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      weekView.appendChild(thead);
    }

    const currentHour = new Date().getHours();

    for (let hour = 0; hour < 24; hour++) {
      const row = document.createElement("tr");

      const timeCell = document.createElement("td");
      timeCell.textContent = `${String(hour).padStart(2, "0")}:00`;
      timeCell.classList.add("time-cell");
      if (hour === currentHour) {
        timeCell.classList.add("current-hour");
      }
      row.appendChild(timeCell);

      datesInWeek.forEach((date) => {
        const cell = document.createElement("td");
        const fullDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

        if (weekEvents[fullDate]) {
          weekEvents[fullDate].forEach((event) => {
            const eventHour = parseInt(event.time.split(":")[0], 10);
            if (eventHour === hour) {
              const eventDiv = document.createElement("div");
              eventDiv.classList.add("event");

              const timeDiv = document.createElement("div");
              timeDiv.classList.add("event-time");
              timeDiv.textContent = event.time;
              eventDiv.appendChild(timeDiv);

              event.names.forEach((name) => {
                const nameDiv = document.createElement("div");
                nameDiv.classList.add("event-name");
                nameDiv.textContent = name;
                eventDiv.appendChild(nameDiv);
              });

              cell.appendChild(eventDiv);
            }
          });
        }

        row.appendChild(cell);
      });

      weekViewBody.appendChild(row);
    }

    attachEllipsisListeners();
  }

  function renderDayView() {
    dayViewBody.innerHTML = "";

    presentMonth.textContent = `${currentDate.getDate()} ${
      monthNames[currentDate.getMonth()]
    } ${currentDate.getFullYear()}`;

    const now = new Date();
    const currentHour = now.getHours();

    for (let hour = 0; hour < 24; hour++) {
      const row = document.createElement("tr");

      const timeCell = document.createElement("td");
      timeCell.textContent = `${String(hour).padStart(2, "0")}:00`;
      timeCell.classList.add("time-cell");
      if (hour === currentHour) {
        timeCell.classList.add("current-hour");
      }
      row.appendChild(timeCell);

      const eventCell = document.createElement("td");
      eventCell.classList.add("event-cell");

      const fullDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

      if (dayEvents[fullDate]) {
        dayEvents[fullDate].forEach((event) => {
          const eventHour = parseInt(event.time.split(":")[0], 10);
          if (eventHour === hour) {
            const eventDiv = document.createElement("div");
            eventDiv.classList.add("event");

            const timeDiv = document.createElement("div");
            timeDiv.textContent = event.time;
            timeDiv.classList.add("event-time");
            eventDiv.appendChild(timeDiv);

            event.names.forEach((name) => {
              const nameElement = document.createElement("div");
              nameElement.textContent = name;
              nameElement.classList.add("event-name");
              eventDiv.appendChild(nameElement);
            });

            eventCell.appendChild(eventDiv);
          }
        });
      }

      row.appendChild(eventCell);
      dayViewBody.appendChild(row);
    }

    attachEllipsisListeners();
  }

  function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    renderCalendar();
  }

  function changeWeek(offset) {
    currentDate.setDate(currentDate.getDate() + 7 * offset);
    renderWeekView();
  }

  function changeDay(offset) {
    currentDate.setDate(currentDate.getDate() + offset);
    renderDayView();
  }

  function goToToday() {
    currentDate = new Date();
    renderView();
  }

  function renderView() {
    if (currentView === "month") {
      renderCalendar();
    } else if (currentView === "week") {
      renderWeekView();
    } else if (currentView === "day") {
      renderDayView();
    }
  }

  prevArrow.addEventListener("click", () => {
    if (currentView === "month") {
      changeMonth(-1);
    } else if (currentView === "week") {
      changeWeek(-1);
    } else if (currentView === "day") {
      changeDay(-1);
    }
  });

  nextArrow.addEventListener("click", () => {
    if (currentView === "month") {
      changeMonth(1);
    } else if (currentView === "week") {
      changeWeek(1);
    } else if (currentView === "day") {
      changeDay(1);
    }
  });

  todayButton.addEventListener("click", () => {
    goToToday();
  });

  dayViewButton.addEventListener("click", () => {
    if (currentView !== "day") {
      currentView = "day";
      renderDayView();
      document.querySelectorAll(".view-option").forEach((el) => el.classList.remove("active"));
      dayViewButton.classList.add("active");
      weekView.classList.add("d-none");
      calendarTable.classList.add("d-none");
      dayView.classList.remove("d-none");
    }
  });

  weekViewButton.addEventListener("click", () => {
    if (currentView !== "week") {
      currentView = "week";
      renderWeekView();
      document.querySelectorAll(".view-option").forEach((el) => el.classList.remove("active"));
      weekViewButton.classList.add("active");
      calendarTable.classList.add("d-none");
      dayView.classList.add("d-none");
      weekView.classList.remove("d-none");
    }
  });

  monthViewButton.addEventListener("click", () => {
    if (currentView !== "month") {
      currentView = "month";
      renderCalendar();
      document.querySelectorAll(".view-option").forEach((el) => el.classList.remove("active"));
      monthViewButton.classList.add("active");
      weekView.classList.add("d-none");
      dayView.classList.add("d-none");
      calendarTable.classList.remove("d-none");
    }
  });

  renderCalendar();
});
