"strict";
// Tab switching functionality
const tabs = document.querySelectorAll(".tab");
const searchContents = document.querySelectorAll(".search-content");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const tabId = tab.getAttribute("data-tab");

    // Remove active class from all tabs and contents
    tabs.forEach((t) => t.classList.remove("active"));
    searchContents.forEach((content) => content.classList.remove("active"));

    // Add active class to clicked tab and corresponding content
    tab.classList.add("active");
    document.getElementById(tabId).classList.add("active");
  });
});

// Return date click to switch to round-trip tab
function initializeReturnDateSwitch() {
  const oneWayReturnDate = document.getElementById("return-date-1");
  if (oneWayReturnDate) {
    oneWayReturnDate.addEventListener("click", () => {
      // Find the round-trip tab and click it
      const roundTripTab = document.querySelector(
        '.tab[data-tab="round-trip"]'
      );
      if (roundTripTab) {
        roundTripTab.click();

        // Copy the "From" and "To" values from one-way to round-trip
        const fromOneWay = document.getElementById("from-airport-1");
        const toOneWay = document.getElementById("to-airport-1");
        const fromRoundTrip = document.getElementById("from-airport-2");
        const toRoundTrip = document.getElementById("to-airport-2");
        const departureOneWay = document.getElementById("departure-date-1");
        const departureRoundTrip = document.getElementById("departure-date-2");

        if (fromOneWay && fromRoundTrip) {
          fromRoundTrip.value = fromOneWay.value;
        }

        if (toOneWay && toRoundTrip) {
          toRoundTrip.value = toOneWay.value;
        }

        if (departureOneWay && departureRoundTrip) {
          departureRoundTrip.value = departureOneWay.value;
        }

        // Focus on the return date input in the round-trip tab
        const returnDateRoundTrip = document.getElementById("return-date-2");
        if (returnDateRoundTrip) {
          setTimeout(() => {
            returnDateRoundTrip.focus();
          }, 100);
        }
      }
    });
  }
}

// Dropdown functionality
function initializeDropdowns() {
  const dropdownInputs = document.querySelectorAll(".dropdown .search-input");

  dropdownInputs.forEach((input) => {
    input.addEventListener("click", (e) => {
      const dropdown = e.target.closest(".dropdown");

      // Close all other dropdowns
      document.querySelectorAll(".dropdown").forEach((d) => {
        if (d !== dropdown) {
          d.classList.remove("active");
        }
      });

      // Toggle current dropdown
      dropdown.classList.toggle("active");
      e.stopPropagation();
    });
  });
}

// Close dropdowns when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".dropdown")) {
    document.querySelectorAll(".dropdown").forEach((dropdown) => {
      dropdown.classList.remove("active");
    });
  }
});

// Initialize all dropdowns
initializeDropdowns();

// Passenger counter functionality
function initializeCounterButtons() {
  const counterBtns = document.querySelectorAll(".counter-btn");

  counterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const counterValue = btn.parentElement.querySelector(".counter-value");
      let value = parseInt(counterValue.textContent);

      if (btn.classList.contains("decrease")) {
        if (value > 0) {
          value--;
        }
      } else if (btn.classList.contains("increase")) {
        value++;
      }

      counterValue.textContent = value;
      updatePassengerSummary(btn.closest(".dropdown"));
    });
  });
}

// Initialize all counter buttons
initializeCounterButtons();

// Update passenger summary text
function updatePassengerSummary(dropdown) {
  const values = dropdown.querySelectorAll(".counter-value");
  const input = dropdown.querySelector(".search-input");

  const adults = parseInt(values[0].textContent);
  const children = parseInt(values[1].textContent);
  const infants = parseInt(values[2].textContent);

  let summary = "";

  if (adults > 0) {
    summary += `${adults} Adult${adults > 1 ? "s" : ""}`;
  }

  if (children > 0) {
    summary += summary
      ? `, ${children} Child${children > 1 ? "ren" : ""}`
      : `${children} Child${children > 1 ? "ren" : ""}`;
  }

  if (infants > 0) {
    summary += summary
      ? `, ${infants} Infant${infants > 1 ? "s" : ""}`
      : `${infants} Infant${infants > 1 ? "s" : ""}`;
  }

  // Get selected cabin class
  const selectedCabin = dropdown.querySelector(
    'input[name^="cabin-class"]:checked'
  );
  const cabinText = selectedCabin
    ? selectedCabin.value.charAt(0).toUpperCase() + selectedCabin.value.slice(1)
    : "Economy";

  input.value = `${summary}, ${cabinText}`;
}

// Initialize cabins
function initializeCabinOptions() {
  const cabinOptions = document.querySelectorAll('input[name^="cabin-class"]');
  cabinOptions.forEach((option) => {
    option.addEventListener("change", () => {
      updatePassengerSummary(option.closest(".dropdown"));
    });
  });
}

// Initialize all cabin options
initializeCabinOptions();

// Special offers selection
const offerItems = document.querySelectorAll(".offers-list li");
offerItems.forEach((item) => {
  item.addEventListener("click", () => {
    const dropdown = item.closest(".dropdown");
    const input = dropdown.querySelector(".search-input");
    input.value = item.textContent;
    dropdown.classList.remove("active");
  });
});

// Airport swap functionality
function initializeSwapButtons() {
  const swapBtns = document.querySelectorAll(".swap-btn");
  swapBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest(".search-row");
      const fromInput = row.querySelector('input[id^="from-airport"]');
      const toInput = row.querySelector('input[id^="to-airport"]');

      // Get current values
      const fromValue = fromInput.value;
      const toValue = toInput.value;

      // Swap the values
      fromInput.value = toValue;
      toInput.value = fromValue;

      // Visual feedback
      btn.classList.add("swap-active");
      setTimeout(() => {
        btn.classList.remove("swap-active");
      }, 500);
    });
  });
}

// Initialize all swap buttons
initializeSwapButtons();

// Simple date picker functionality
function initializeDatePickers() {
  const datePickers = document.querySelectorAll(".date-picker");
  datePickers.forEach((picker) => {
    picker.addEventListener("focus", () => {
      // In a real implementation, you would initialize a date picker library here
      // For this demo, we'll use a simple type change
      picker.type = "date";
    });

    picker.addEventListener("blur", () => {
      if (!picker.value) {
        picker.type = "text";
      }
    });
  });
}

// Initialize all date pickers
initializeDatePickers();

// Chatbot toggle (for demo)
const chatbot = document.querySelector(".chatbot");
chatbot.addEventListener("click", () => {
  alert("Chatbot would appear here to help with your booking.");
});

// Initialize the return date switch functionality
initializeReturnDateSwitch();
