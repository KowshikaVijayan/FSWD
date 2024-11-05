const productList = document.getElementById("product-list");
const cartList = document.getElementById("cart-list");
const orderModal = document.getElementById("order-modal");
const orderProductDetails = document.getElementById("order-product-details");

let products = [
  { 
    name: "Laptop", 
    price: 250, 
    description: "2-year-old laptop, 8GB RAM, 256GB SSD,", 
    contact: "Kowshi@example.com", 
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHGxwrtYeMGFwDf6fLSMvFzUUxM-v92-UuYg&s"
  },
  { 
    name: "Royal Enfield Bike", 
    price: 150, 
    description: "Well-maintained, perfect for outdoor.", 
    contact: "mukil@example.com", 
    image: "https://i.ytimg.com/vi/aUuE5iocS_k/maxresdefault.jpg"
  },
  { 
    name: "Iphone", 
    price: 100, 
    description: "High quality photos.", 
    contact: "ajay@example.com", 
    image: "https://th.bing.com/th/id/OIP.joMge5QtSa2uW-6PeanhCwHaJU?rs=1&pid=ImgDetMain"  },
   { 
    name: "ladies kurta", 
    price: 30, 
    description: "well suited for summer.", 
    contact: "priya@example.com", 
    image: "https://th.bing.com/th/id/OIP.acu4qIlR6e338K7bwjomnwHaIl?rs=1&pid=ImgDetMain"  }


];

let cart = [];
let selectedProduct = null;

// Show the selected section
function showSection(section) {
  document.getElementById("home-section").style.display = section === "home" ? "block" : "none";
  document.getElementById("cart-section").style.display = section === "cart" ? "block" : "none";
  document.getElementById("profile-section").style.display = section === "profile" ? "block" : "none";
}

function filterProducts() {
  const query = document.getElementById('search').value.toLowerCase();
  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(query));
  
  productList.innerHTML = '';  // Clear the previous results
  filteredProducts.forEach(product => {
    const productElement = document.createElement('div');
    productElement.classList.add('product');
    
    productElement.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p><strong>$${product.price}</strong></p>
      <button onclick="addToCart('${product.name}')">Add to Cart</button>
    `;
    productList.appendChild(productElement);
  });
}

function addToCart(productName) {
  const product = products.find(p => p.name === productName);
  if (product) {
    const cartItem = document.createElement('div');
    cartItem.innerHTML = `
      <p>${product.name} - $${product.price}</p>
    `;
    cartList.appendChild(cartItem);
  }
}

function showSection(section) {
  const sections = ['home', 'cart', 'profile'];
  sections.forEach(sec => {
    document.getElementById(`${sec}-section`).style.display = sec === section ? 'block' : 'none';
  });
}

// Display products in Home
function displayProducts() {
  productList.innerHTML = "";
  products.forEach((product, index) => {
    const productElement = document.createElement("div");
    productElement.classList.add("product");
    productElement.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <h3>${product.name}</h3>
      <p><strong>Price:</strong> $${product.price}</p>
      <p>${product.description}</p>
      <p><strong>Contact Seller:</strong> ${product.contact}</p>
      <button onclick="addToCart(${index})"><i class="fas fa-cart-plus"></i> Add to Cart</button>
      <button onclick="orderNow(${index})"><i class="fas fa-credit-card"></i> Place Order</button>
    `;
    productList.appendChild(productElement);
  });
}

// Add a product to the cart
function addToCart(index) {
  const product = products[index];
  cart.push(product);
  displayCart();
}

// Show the order modal
function showOrderModal(product) {
  selectedProduct = product;
  orderProductDetails.innerHTML = `
    <strong>Product:</strong> ${product.name}<br>
    <strong>Price:</strong> $${product.price}
  `;
  orderModal.style.display = "flex"; // Show modal as a pop-up
}

// Close the order modal
function closeOrderModal() {
  orderModal.style.display = "none";
  selectedProduct = null;
}

// Place the order
function placeOrder() {
  const shippingAddress = document.getElementById("shipping-address").value;
  const contactNumber = document.getElementById("contact-number").value;

  if (!shippingAddress || !contactNumber) {
    alert("Please provide all the order details.");
    return;
  }

  alert(`Order placed successfully for ${selectedProduct.name}!\nShipping to: ${shippingAddress}`);
  
  cart = [];
  displayCart();
  closeOrderModal();
}


// Display cart items with Place Order option
function displayCart() {
  cartList.innerHTML = "";
  if (cart.length === 0) {
    cartList.innerHTML = "<p><i class='fas fa-info-circle'></i> No items in the cart.</p>";
  } else {
    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("product");
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="product-image">
        <h3>${item.name}</h3>
        <p><strong>Price:</strong> $${item.price}</p>
        <p>${item.description}</p>
        <p><strong>Contact Seller:</strong> ${item.contact}</p>
        <button onclick="orderProduct(${index})"><i class="fas fa-credit-card"></i> Place Order</button>
      `;
      cartList.appendChild(cartItem);
    });
  }
}

// Place order directly from Home
function orderNow(index) {
  const product = products[index];
  showOrderModal(product);
}

// Place order from the cart
function orderProduct(cartIndex) {
  const product = cart[cartIndex];
  showOrderModal(product);
}

// Add a new product in Profile section
function addProduct(event) {
  event.preventDefault();

  const name = document.getElementById('product-name').value;
  const price = parseFloat(document.getElementById('product-price').value);
  const description = document.getElementById('product-description').value;
  const contact = "jen@example.com";
 
  const image = document.getElementById('product-image').value;

  const newProduct = { name, price, description,contact, image };

  products.push(newProduct);
  alert('Product added successfully!');
  showSection('home'); // Go back to Home section
  filterProducts();    // Refresh the product list
displayProducts();
  document.getElementById("product-form").reset();

}

// Initialize
displayProducts();
showSection('home');
