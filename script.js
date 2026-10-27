const products = [
    { id: 1, name: "Smartphone", category: "Electronics", price: 15000, icon: "fa-solid fa-mobile-screen-button" },
    { id: 2, name: "Headphones", category: "Electronics", price: 2000, icon: "fa-solid fa-headphones" },
    { id: 3, name: "Smart Watch", category: "Electronics", price: 3500, icon: "fa-solid fa-clock" },
    { id: 4, name: "T-Shirt", category: "Fashion", price: 800, icon: "fa-solid fa-shirt" },
    { id: 5, name: "Sneakers", category: "Fashion", price: 2500, icon: "fa-solid fa-shoe-prints" },
    { id: 6, name: "Backpack", category: "Accessories", price: 1200, icon: "fa-solid fa-bag-shopping" },
    { id: 7, name: "Sunglasses", category: "Accessories", price: 900, icon: "fa-solid fa-glasses" },
    { id: 8, name: "Laptop", category: "Electronics", price: 45000, icon: "fa-solid fa-laptop" }
];

let cart = [];
let discount = 0;

function displayProducts() {
    let category = document.getElementById("category").value;
    let sort = document.getElementById("sort").value;

    let list = products.filter(p =>
        category === "All" || p.category === category
    );

    if (sort === "low") list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);

    document.getElementById("product-list").innerHTML = list.map(p => `
        <div class="product-card">
            <div class="product-icon"><i class="${p.icon}"></i></div>
            <h3>${p.name}</h3>
            <p>${p.category}</p>
            <h3>₹${p.price}</h3>
            <button onclick="addToCart(${p.id})">
                <i class="fa-solid fa-cart-plus"></i> Add to Cart
            </button>
        </div>
    `).join("");
}

function addToCart(id) {
    let item = cart.find(p => p.id === id);

    if (item) {
        item.quantity++;
    } else {
        cart.push({ id: id, quantity: 1 });
    }

    updateCart();
}

function updateCart() {
    let subtotal = 0;
    let count = 0;

    document.getElementById("cart-items").innerHTML = cart.map(item => {
        let p = products.find(p => p.id === item.id);
        let price = p.price * item.quantity;

        subtotal += price;
        count += item.quantity;

        return `
            <div class="cart-item">
                <div>
                    <h4>${p.name}</h4>
                    <p>Price: ₹${p.price}</p>
                    <p>Item Total: ₹${price}</p>
                    <button onclick="changeQty(${p.id}, -1)">-</button>
                    ${item.quantity}
                    <button onclick="changeQty(${p.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeItem(${p.id})">
                    Remove
                </button>
            </div>
        `;
    }).join("") || "<p>Your cart is empty.</p>";

    if (cart.length === 0) discount = 0;

    let total = subtotal - discount;

    document.getElementById("cart-count").textContent = count;
    document.getElementById("subtotal").textContent = "₹" + subtotal;
    document.getElementById("discount").textContent = "₹" + discount;
    document.getElementById("total").textContent = "₹" + total;
    document.getElementById("checkout-total").textContent = "₹" + total;
}

function changeQty(id, amount) {
    let item = cart.find(p => p.id === id);

    if (item) {
        item.quantity += amount;

        if (item.quantity <= 0) {
            removeItem(id);
        } else {
            updateCart();
        }
    }
}

function removeItem(id) {
    cart = cart.filter(p => p.id !== id);
    updateCart();
}

document.getElementById("apply-coupon").onclick = function() {
    let code = document.getElementById("coupon-code").value.trim().toUpperCase();
    let subtotal = cart.reduce((sum, item) => {
        let p = products.find(p => p.id === item.id);
        return sum + p.price * item.quantity;
    }, 0);

    let message = document.getElementById("coupon-message");

    if (cart.length > 0 && code === "SAVE10") {
        discount = subtotal * 0.10;
        message.textContent = "10% discount applied!";
    } else {
        discount = 0;
        message.textContent = cart.length ? "Invalid coupon code." : "Add products first.";
    }

    updateCart();
};

document.getElementById("category").onchange = displayProducts;
document.getElementById("sort").onchange = displayProducts;


document.getElementById("checkout-btn").onclick = function() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    document.getElementById("checkout").classList.remove("hidden");
    document.getElementById("checkout").scrollIntoView();
};

document.getElementById("checkout-form").onsubmit = function(event) {
    event.preventDefault();

    if (cart.length === 0) 
        return;

    let name = document.getElementById("customer-name").value;

    document.getElementById("order-message").textContent =
        "Thank you, " + name + "! Your order has been placed.";

    cart = [];
    discount = 0;
    updateCart();
    this.reset();
};

displayProducts();
updateCart();
