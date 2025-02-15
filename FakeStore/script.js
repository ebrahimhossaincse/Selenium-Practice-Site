let productsData = []; // Store fetched products

document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    loadCart();
});

// Fetch products from FakeStoreAPI
function fetchProducts() {
    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(data => {
            productsData = data; // Store the original product list
            displayProducts(productsData);
        });
}

// Display products in Bootstrap card format
function displayProducts(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    products.forEach(product => {
        const productCard = `
            <div class="col-md-4 mb-4 d-flex justify-content-center">
                <div class="card" style="width: 18rem;">
                    <img class="card-img-top" src="${product.image}" alt="${product.title}" style="height: 200px; object-fit: contain;">
                    <div class="card-body text-center">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">${product.description.substring(0, 80)}...</p>
                        <p class="card-text fw-bold">$${product.price}</p>
                        <button class="btn btn-primary" onclick="addToCart(${product.id}, '${product.title}', ${product.price})">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
        productList.innerHTML += productCard;
    });
}

// Sorting Function
function sortProducts() {
    const sortOption = document.getElementById("sort-options").value;
    let sortedProducts = [...productsData];

    switch (sortOption) {
        case "price-low-high":
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case "price-high-low":
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case "name-a-z":
            sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case "name-z-a":
            sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
            break;
        default:
            sortedProducts = [...productsData]; // Reset to original order
    }

    displayProducts(sortedProducts);
}

// Cart Management
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(id, name, price) {
    cart.push({ id, name, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

function loadCart() {
    updateCartCount();
}

function updateCartCount() {
    document.getElementById("cart-count").innerText = cart.length;
}

// View Cart Modal
function viewCart() {
    const cartItemsList = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    cartItemsList.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        cartItemsList.innerHTML += `<li class="list-group-item">${item.name} - $${item.price} 
            <button class="btn btn-danger btn-sm float-end" onclick="removeFromCart(${index})">X</button></li>`;
    });

    cartTotal.innerText = total.toFixed(2);
    new bootstrap.Modal(document.getElementById("cartModal")).show();
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    viewCart();
    updateCartCount();
}

// Checkout Process (Simulated)
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Save order to localStorage
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push({ items: cart, total: cart.reduce((sum, item) => sum + item.price, 0), date: new Date().toLocaleString() });
    localStorage.setItem("orders", JSON.stringify(orders));

    // Clear cart
    cart = [];
    localStorage.removeItem("cart");
    updateCartCount();
    alert("Order placed successfully!");
    new bootstrap.Modal(document.getElementById("cartModal")).hide();
}
