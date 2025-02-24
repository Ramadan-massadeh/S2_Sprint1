// Project Contributors:
// - Design (HTML, CSS, DOM): Ramadan Masadekh
// - JavaScript Functions (JS Logic): Brandon Pike
// - UI/UX & Wireframes (Figma Design): Brady Keats

document.addEventListener("DOMContentLoaded", function () {
  // Mobile Navigation Toggle
  const menuToggle = document.getElementById("mobile-menu");
  const navList = document.querySelector(".nav-list");

  menuToggle.addEventListener("click", function () {
    navList.classList.toggle("active");
  });

  // Background Image Slideshow
  const header = document.getElementById("header");
  const images = [
    "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=900",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=900",
    "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?w=900",
    "https://plus.unsplash.com/premium_photo-1661953124283-76d0a8436b87?w=900",
  ];

  let index = 0;
  setInterval(() => {
    index = (index + 1) % images.length;
    header.style.backgroundImage = `url(${encodeURI(images[index])})`;
  }, 5000);
});

// ORDER CLASS - Handle Orders & Local Storage
class Order {
  constructor(name, phone, address, item, quantity) {
    this.name = name;
    this.phone = phone;
    this.address = address;
    this.item = item;
    this.quantity = quantity;
  }

  static getStoredOrders() {
    return JSON.parse(localStorage.getItem("orders")) || [];
  }

  static saveOrder(order) {
    let orders = Order.getStoredOrders();
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
  }

  static displayOrders() {
    const orderList = document.getElementById("summaryList");
    orderList.innerHTML = "";
    let orders = Order.getStoredOrders();

    orders.forEach((order) => {
      let row = document.createElement("li");
      row.innerHTML = `<strong>${order.item}</strong> - ${order.quantity} pcs (${order.name})`;
      orderList.appendChild(row);
    });

    document.getElementById("orderSummary").style.display = orders.length
      ? "block"
      : "none";
  }

  static clearOrders() {
    localStorage.removeItem("orders");
    Order.displayOrders();
  }
}

// ORDER FORM HANDLING
document.addEventListener("DOMContentLoaded", function () {
  const orderForm = document.getElementById("orderForm");
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const addressInput = document.getElementById("address");
  const itemSelect = document.getElementById("item");
  const quantityInput = document.getElementById("quantity");
  const totalCostDisplay = document.getElementById("totalCost");
  const calculateTotalBtn = document.getElementById("calculateTotalBtn");
  const placeOrderBtn = document.getElementById("placeOrderBtn");
  const alertMessage = document.getElementById("alert");

  const prices = { Pizza: 10, Burger: 5, Pasta: 7, Salad: 4 };

  // Show alert messages
  function showAlert(message, type = "error") {
    alertMessage.textContent = message;
    alertMessage.style.backgroundColor = type === "success" ? "green" : "red";
    alertMessage.style.display = "block";

    setTimeout(() => {
      alertMessage.style.display = "none";
    }, 2000);
  }

  // Calculate and display total cost
  calculateTotalBtn.addEventListener("click", function () {
    const selectedItem = itemSelect.value;
    const quantity = parseInt(quantityInput.value);

    if (selectedItem && quantity > 0) {
      const totalCost = prices[selectedItem] * quantity;
      totalCostDisplay.textContent = `Total Cost: $${totalCost.toFixed(2)}`;
    } else {
      totalCostDisplay.textContent =
        "Please select an item and enter a valid quantity.";
    }
  });

  // Handle order submission
  placeOrderBtn.addEventListener("click", function () {
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();
    const selectedItem = itemSelect.value;
    const quantity = parseInt(quantityInput.value);

    if (name && phone && address && selectedItem && quantity > 0) {
      const newOrder = new Order(name, phone, address, selectedItem, quantity);
      Order.saveOrder(newOrder);

      showAlert("Order placed successfully!", "success");

      // Clear form
      orderForm.reset();
      totalCostDisplay.textContent = "";
      Order.displayOrders();
    } else {
      showAlert("Please complete the form before placing your order.");
    }
  });

  // Load saved orders when page loads
  Order.displayOrders();
});

// MENU PAGE - ADD ITEMS TO ORDER
document.addEventListener("DOMContentLoaded", function () {
  const addToOrderButtons = document.querySelectorAll(".add-to-order");

  addToOrderButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const itemName = this.parentElement.dataset.name;
      const itemPrice = this.parentElement.dataset.price;

      let quantity = prompt(`How many ${itemName} would you like to add?`);
      if (quantity && quantity > 0) {
        const name = "Guest";
        const phone = "N/A";
        const address = "N/A";

        const newOrder = new Order(name, phone, address, itemName, quantity);
        Order.saveOrder(newOrder);

        showAlert(`${quantity}x ${itemName} added to your order!`, "success");
        Order.displayOrders();
      } else {
        showAlert("Invalid quantity. Please try again.");
      }
    });
  });
});
