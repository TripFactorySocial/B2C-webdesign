"use strict";

// DOM Elements
const tabs = document.querySelectorAll(".tab");
const searchContents = document.querySelectorAll(".search-content");
const dropdowns = document.querySelectorAll(".dropdown");
const dropdownInputs = document.querySelectorAll(".dropdown .search-input");
const counterBtns = document.querySelectorAll(".counter-btn");
const cabinOptions = document.querySelectorAll('input[name^="cabin-class"]');
const swapBtns = document.querySelectorAll(".swap-btn");
const datePickers = document.querySelectorAll(".date-picker");
const chatbot = document.querySelector(".chatbot");
const oneWayReturnDate = document.getElementById("return-date-1");
const offerLabels = document.querySelectorAll(".offer-label");

// Initialize the application
function initApp() {
  initTabSwitching();
  initializeReturnDateSwitch();
  initializeDropdowns();
  initializeCounterButtons();
  initializeCabinOptions();
  initializeSwapButtons();
  initializeDatePickers();
  initializeChatbot();
  initializeOfferSelection();

  // Close dropdowns when clicking outside
  document.addEventListener("click", handleOutsideClick);

  // Set initial state for passenger summaries
  updateAllPassengerSummaries();
}

// Tab switching functionality
function initTabSwitching() {
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
}

// Return date click to switch to round-trip tab
function initializeReturnDateSwitch() {
  if (oneWayReturnDate) {
    oneWayReturnDate.addEventListener("click", () => {
      // Find the round-trip tab and click it
      const roundTripTab = document.querySelector(
        '.tab[data-tab="round-trip"]'
      );
      if (roundTripTab) {
        roundTripTab.click();

        // Copy the "From" and "To" values from one-way to round-trip
        copyValuesFromOneWayToRoundTrip();
      }
    });
  }
}

// Copy values from one-way to round-trip
function copyValuesFromOneWayToRoundTrip() {
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

// Dropdown functionality
function initializeDropdowns() {
  dropdownInputs.forEach((input) => {
    input.addEventListener("click", (e) => {
      const dropdown = e.target.closest(".dropdown");

      // Close all other dropdowns
      dropdowns.forEach((d) => {
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
function handleOutsideClick(e) {
  if (!e.target.closest(".dropdown")) {
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove("active");
    });
  }
}

// Passenger counter functionality
function initializeCounterButtons() {
  counterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const counterValue = btn.parentElement.querySelector(".counter-value");
      let value = parseInt(counterValue.textContent);

      if (btn.classList.contains("decrease")) {
        // Don't allow adults to go below 1
        if (
          value >
          (btn
            .closest(".passenger-type")
            .querySelector("span")
            .textContent.includes("Adults")
            ? 1
            : 0)
        ) {
          value--;
        }
      } else if (btn.classList.contains("increase")) {
        // Limit the maximum number of passengers (optional)
        if (value < 9) {
          value++;
        }
      }

      counterValue.textContent = value;
      updatePassengerSummary(btn.closest(".dropdown"));
    });
  });
}

// Update all passenger summaries on page load
function updateAllPassengerSummaries() {
  dropdowns.forEach((dropdown) => {
    updatePassengerSummary(dropdown);
  });
}

// Update passenger summary text
function updatePassengerSummary(dropdown) {
  const values = dropdown.querySelectorAll(".counter-value");
  const input = dropdown.querySelector(".search-input");

  if (!values.length || !input) return;

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
  cabinOptions.forEach((option) => {
    option.addEventListener("change", () => {
      updatePassengerSummary(option.closest(".dropdown"));
    });
  });
}

// Special offers selection
function initializeOfferSelection() {
  offerLabels.forEach((label) => {
    label.addEventListener("click", () => {
      // Add visual feedback on selection
      const container = label.closest(".special-offers-container");
      if (container) {
        container.querySelectorAll(".offer-label").forEach((l) => {
          l.classList.remove("selected");
        });
        label.classList.add("selected");
      }
    });
  });
}

// Airport swap functionality
function initializeSwapButtons() {
  swapBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest(".search-row");
      const fromInput = row.querySelector('input[id^="from-airport"]');
      const toInput = row.querySelector('input[id^="to-airport"]');

      if (!fromInput || !toInput) return;

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

// Date picker functionality
function initializeDatePickers() {
  datePickers.forEach((picker) => {
    picker.addEventListener("focus", () => {
      // In a real implementation, you would initialize a date picker library here
      // For this demo, we'll use a simple type change
      picker.type = "date";

      // Set min date to today
      const today = new Date().toISOString().split("T")[0];
      picker.min = today;
    });

    picker.addEventListener("blur", () => {
      if (!picker.value) {
        picker.type = "text";
      }
    });

    // Format date when value changes
    picker.addEventListener("change", () => {
      if (picker.value) {
        const date = new Date(picker.value);
        const formattedDate = date.toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        picker.dataset.formattedDate = formattedDate;

        // Keep the date input visible after selection
        picker.type = "date";
      }
    });
  });
}

// Chatbot toggle
function initializeChatbot() {
  chatbot.addEventListener("click", () => {
    alert("Chatbot would appear here to help with your booking.");
  });
}

// Initialize the app when DOM is fully loaded
document.addEventListener("DOMContentLoaded", initApp);
