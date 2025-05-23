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
const destinationsWrapper = document.querySelector(".destinations-wrapper");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const footerToggles = document.querySelectorAll(".mobile-toggle");

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
  initializeDestinationSlider();
  initializeFooterToggle();
  initializeOffersCarousel();

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
      const toValue = toInput.value || "Enter city or airport";

      // Create overlay elements to animate the text
      const fromOverlay = document.createElement("div");
      const toOverlay = document.createElement("div");

      // Style the overlays to match the input text
      fromOverlay.style.position = "absolute";
      fromOverlay.style.pointerEvents = "none";
      fromOverlay.style.transition = "transform 0.3s ease, opacity 0.3s ease";
      fromOverlay.style.zIndex = "10";
      fromOverlay.textContent = fromValue;

      toOverlay.style.position = "absolute";
      toOverlay.style.pointerEvents = "none";
      toOverlay.style.transition = "transform 0.3s ease, opacity 0.3s ease";
      toOverlay.style.zIndex = "10";
      toOverlay.textContent = toValue;

      // Position overlays precisely over the text in the input fields
      const fromRect = fromInput.getBoundingClientRect();
      fromOverlay.style.left = fromRect.left + "px";
      fromOverlay.style.top = fromRect.top + "px";
      fromOverlay.style.width = fromRect.width + "px";
      fromOverlay.style.height = fromRect.height + "px";
      fromOverlay.style.padding = window.getComputedStyle(fromInput).padding;
      fromOverlay.style.fontSize = window.getComputedStyle(fromInput).fontSize;
      fromOverlay.style.fontFamily =
        window.getComputedStyle(fromInput).fontFamily;
      fromOverlay.style.lineHeight =
        window.getComputedStyle(fromInput).lineHeight;
      fromOverlay.style.color = window.getComputedStyle(fromInput).color;
      fromOverlay.style.display = "flex";
      fromOverlay.style.alignItems = "center";

      const toRect = toInput.getBoundingClientRect();
      toOverlay.style.left = toRect.left + "px";
      toOverlay.style.top = toRect.top + "px";
      toOverlay.style.width = toRect.width + "px";
      toOverlay.style.height = toRect.height + "px";
      toOverlay.style.padding = window.getComputedStyle(toInput).padding;
      toOverlay.style.fontSize = window.getComputedStyle(toInput).fontSize;
      toOverlay.style.fontFamily = window.getComputedStyle(toInput).fontFamily;
      toOverlay.style.lineHeight = window.getComputedStyle(toInput).lineHeight;
      toOverlay.style.color = window.getComputedStyle(toInput).color;
      toOverlay.style.display = "flex";
      toOverlay.style.alignItems = "center";

      // Add overlays to the document
      document.body.appendChild(fromOverlay);
      document.body.appendChild(toOverlay);

      // Hide text in the original inputs
      fromInput.style.color = "transparent";
      toInput.style.color = "transparent";

      // Add the rotating animation to the button
      btn.classList.add("swap-active");

      // Animate the overlays
      setTimeout(() => {
        // Move the text visuals in opposite directions and fade out
        fromOverlay.style.transform = "translateY(20px)";
        toOverlay.style.transform = "translateY(-20px)";
        fromOverlay.style.opacity = "0";
        toOverlay.style.opacity = "0";

        // After animation completes, swap the values and restore inputs
        setTimeout(() => {
          // Swap the values in the actual input fields
          fromInput.value = toValue;
          toInput.value = fromValue;

          // Remove the overlays
          document.body.removeChild(fromOverlay);
          document.body.removeChild(toOverlay);

          // Restore text color in the original inputs
          fromInput.style.color = "";
          toInput.style.color = "";

          // Remove animation class from button
          setTimeout(() => {
            btn.classList.remove("swap-active");
          }, 300);
        }, 300);
      }, 50);
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

// Destination slider functionality
function initializeDestinationSlider() {
  if (!destinationsWrapper || !prevBtn || !nextBtn) return;

  const scrollAmount = 300;

  prevBtn.addEventListener("click", () => {
    destinationsWrapper.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  });

  nextBtn.addEventListener("click", () => {
    destinationsWrapper.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  });

  // Add click functionality to destination items
  const destinationItems = document.querySelectorAll(".destination-item");
  destinationItems.forEach((item) => {
    item.addEventListener("click", () => {
      const code = item.querySelector(".destination-code").textContent;
      alert(`Explore flights to ${code}`);
    });
  });
}

// Footer collapse functionality
function initializeFooterToggle() {
  footerToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const section = toggle.getAttribute("data-section");
      const content = document.querySelector(`[data-content="${section}"]`);

      if (content) {
        // Toggle active state
        toggle.classList.toggle("active");
        content.classList.toggle("active");

        // Close other sections (optional - for accordion behavior)
        // Uncomment the lines below if you want accordion behavior
        // /*
        footerToggles.forEach((otherToggle) => {
          if (otherToggle !== toggle) {
            otherToggle.classList.remove("active");
            const otherSection = otherToggle.getAttribute("data-section");
            const otherContent = document.querySelector(
              `[data-content="${otherSection}"]`
            );
            if (otherContent) {
              otherContent.classList.remove("active");
            }
          }
        });
        // */
      }
    });
  });
}

// Offers Carousel functionality
function initializeOffersCarousel() {
  const carousel = document.querySelector(".offers-carousel");
  const prevButton = document.querySelector(".offers-nav-prev");
  const nextButton = document.querySelector(".offers-nav-next");
  const indicators = document.querySelectorAll(".indicator");

  if (!carousel || !prevButton || !nextButton) return;

  const cards = carousel.querySelectorAll(".offer-card");
  let currentIndex = 0;
  let autoPlayInterval;
  const cardWidth = 320 + 24; // card width + gap
  const visibleCards = Math.floor(carousel.offsetWidth / cardWidth);
  const maxIndex = Math.max(0, cards.length - visibleCards);

  // Update carousel position
  function updateCarousel() {
    const translateX = -(currentIndex * cardWidth);
    carousel.style.transform = `translateX(${translateX}px)`;

    // Update indicators
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle(
        "active",
        index === Math.floor(currentIndex / visibleCards)
      );
    });

    // Update button states
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex >= maxIndex;
  }

  // Go to specific slide
  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    updateCarousel();
  }

  // Next slide
  function nextSlide() {
    if (currentIndex < maxIndex) {
      currentIndex++;
    } else {
      currentIndex = 0; // Loop back to start
    }
    updateCarousel();
  }

  // Previous slide
  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = maxIndex; // Loop to end
    }
    updateCarousel();
  }

  // Auto play
  function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(nextSlide, 4000);
  }

  // Stop auto play
  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
    }
  }

  // Event listeners
  prevButton.addEventListener("click", () => {
    prevSlide();
    stopAutoPlay();
    startAutoPlay();
  });

  nextButton.addEventListener("click", () => {
    nextSlide();
    stopAutoPlay();
    startAutoPlay();
  });

  // Indicator clicks
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      goToSlide(index * visibleCards);
      stopAutoPlay();
      startAutoPlay();
    });
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    stopAutoPlay();
  });

  carousel.addEventListener("touchmove", (e) => {
    touchEndX = e.touches[0].clientX;
  });

  carousel.addEventListener("touchend", () => {
    const swipeDistance = touchStartX - touchEndX;
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    startAutoPlay();
  });

  // Pause on hover
  carousel.addEventListener("mouseenter", stopAutoPlay);
  carousel.addEventListener("mouseleave", startAutoPlay);

  // Handle resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateCarousel();
    }, 250);
  });

  // Initialize
  updateCarousel();
  startAutoPlay();
}

// Initialize the app when DOM is fully loaded
document.addEventListener("DOMContentLoaded", initApp);
