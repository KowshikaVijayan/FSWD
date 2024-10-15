const restaurants = JSON.parse(localStorage.getItem('restaurants')) || [
    {
        name: "Chinese Delight",
        description: "Authentic Chinese cuisine.",
        image: "https://via.placeholder.com/150",
        rating: 4.7,
        menu: [
            { name: "Fried Rice", price: 200, type: "Veg", description: "Delicious fried rice.", reviews: [] },
            { name: "Noodles", price: 250, type: "Non-Veg", description: "Tasty noodles with chicken.", reviews: [] }
        ]
    },
    {
        name: "Breakfast Hub",
        description: "Start your day right.",
        image: "https://via.placeholder.com/150",
        rating: 4.5,
        menu: [
            { name: "Pancakes", price: 150, type: "Veg", description: "Fluffy pancakes.", reviews: [] },
            { name: "Omelette", price: 120, type: "Non-Veg", description: "Cheese omelette.", reviews: [] }
        ]
    },
    {
        name: "Biryani Palace",
        description: "Heaven for biryani lovers.",
        image: "https://via.placeholder.com/150",
        rating: 4.9,
        menu: [
            { name: "Chicken Biryani", price: 300, type: "Non-Veg", description: "Aromatic biryani.", reviews: [] },
            { name: "Veg Biryani", price: 250, type: "Veg", description: "Spicy veg biryani.", reviews: [] }
        ]
    },
    {
        name: "Dinner Delights",
        description: "Exquisite dinner options.",
        image: "https://via.placeholder.com/150",
        rating: 4.8,
        menu: [
            { name: "Steak", price: 500, type: "Non-Veg", description: "Grilled steak.", reviews: [] },
            { name: "Vegetable Stir Fry", price: 350, type: "Veg", description: "Mixed veggies.", reviews: [] }
        ]
    }
];

let cart = [];
let users = JSON.parse(localStorage.getItem('users')) || [];

// Function to display restaurants and their menus
function displayRestaurants() {
    const restaurantContainer = document.getElementById('restaurants');
    restaurantContainer.innerHTML = '';

    restaurants.forEach((restaurant) => {
        const restaurantDiv = document.createElement('div');
        restaurantDiv.classList.add('restaurant');
        restaurantDiv.innerHTML = `
            <h3>${restaurant.name}</h3>
            <img src="${restaurant.image}" alt="${restaurant.name}" />
            <p>${restaurant.description}</p>
            <div class="star-rating">${'★'.repeat(Math.floor(restaurant.rating))}${'☆'.repeat(5 - Math.floor(restaurant.rating))} (${restaurant.rating})</div>
        `;

        restaurant.menu.forEach((item) => {
            const menuItemDiv = document.createElement('div');
            menuItemDiv.classList.add('menu-item');
            menuItemDiv.innerHTML = `
                <h4>${item.name} - ₹${item.price} (${item.type})</h4>
                <p>${item.description}</p>
                <button onclick="addToCart('${item.name}', ${item.price}, '${item.type}')">Add to Cart</button>
                <div class="review-section">
                    <input type="number" min="1" max="5" placeholder="Rating (1-5)" id="rating-${item.name}" />
                    <input type="text" placeholder="Write a review" id="review-${item.name}" />
                    <button onclick="addReview('${restaurant.name}', '${item.name}')">Submit Review</button>
                    <div id="reviews-${restaurant.name}-${item.name}"></div>
                </div>
            `;
            restaurantDiv.appendChild(menuItemDiv);
        });

        restaurantContainer.appendChild(restaurantDiv);
    });

    displayCart();
}

// Sign Up function
document.getElementById('signupButton').addEventListener('click', () => {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    if (username && password) {
        if (users.find(user => user.username === username)) {
            alert('Username already exists!');
        } else {
            users.push({ username, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Sign Up successful!');
        }
    } else {
        alert('Please fill in all fields!');
    }
});

// Sign In function
document.getElementById('signinButton').addEventListener('click', () => {
    const username = document.getElementById('signin-username').value;
    const password = document.getElementById('signin-password').value;

    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        alert('Sign In successful!');
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        document.getElementById('logoutButton').style.display = 'block';
        displayRestaurants();
    } else {
        alert('Invalid credentials!');
    }
});

// Logout function
document.getElementById('logoutButton').addEventListener('click', () => {
    document.getElementById('auth-container').style.display = 'flex';
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('logoutButton').style.display = 'none';
});

// Function to add items to cart
function addToCart(name, price, type) {
    cart.push({ name, price, type });
    alert(${name} has been added to the cart!);
    displayCart();
}

// Function to display the cart
function displayCart() {
    const cartContainer = document.getElementById('cart');
    cartContainer.innerHTML = '<h2>Your Cart</h2>';
    if (cart.length === 0) {
        cartContainer.innerHTML += '<p>No items in cart.</p>';
    } else {
        cart.forEach((item, index) => {
            cartContainer.innerHTML += `
                <p>${item.name} - ₹${item.price}</p>
                <button onclick="removeFromCart(${index})">Remove</button>
            `;
        });
    }
    document.getElementById('checkoutButton').style.display = cart.length > 0 ? 'block' : 'none';
}

// Function to remove items from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    displayCart();
}

// Function to add reviews
function addReview(restaurantName, itemName) {
    const rating = document.getElementById(   rating-${itemName}).value;
    const reviewText = document.getElementById(review-${itemName}).value;
    const restaurant = restaurants.find(r => r.name === restaurantName);
    const menuItem = restaurant.menu.find(item => item.name === itemName);

    if (rating && reviewText) {
        menuItem.reviews.push({ rating, reviewText });
        saveRestaurantsToLocalStorage();
        displayReviews(restaurantName, itemName);
    } else {
        alert('Please enter both rating and review.');
    }
}

// Function to display reviews
function displayReviews(restaurantName, itemName) {
    const restaurant = restaurants.find(r => r.name === restaurantName);
    const menuItem = restaurant.menu.find(item => item.name === itemName);
    const reviewContainer = document.getElementById(reviews-${restaurantName}-${itemName});
    reviewContainer.innerHTML = '';

    menuItem.reviews.forEach((review) => {
        reviewContainer.innerHTML += <div class="review">Rating: ${review.rating}, Review: ${review.reviewText}</div>;
    });
}

// Save updated restaurants to localStorage
function saveRestaurantsToLocalStorage() {
    localStorage.setItem('restaurants', JSON.stringify(restaurants));
}

// Checkout function
document.getElementById('checkoutButton').addEventListener('click', () => {
    document.getElementById('payment-container').style.display = 'block'; // Show payment form
});

// Payment button functionality
document.getElementById('payButton').addEventListener('click', () => {
    const cardNumber = document.getElementById('card-number').value;
    const cardName = document.getElementById('card-name').value;
    const expiryDate = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;

    if (validatePayment(cardNumber, cardName, expiryDate, cvv)) {
        alert('Payment Successful! Your order will be processed.');
        cart = []; // Reset cart
        displayCart(); // Update cart display
        document.getElementById('payment-container').style.display = 'none'; // Hide payment form

        // Simulate tracking
        trackOrder();
    } else {
        alert('Please fill in all payment details correctly.');
    }
});

// Function to validate payment information
function validatePayment(cardNumber, cardName, expiryDate, cvv) {
    return cardNumber && cardName && expiryDate && cvv && cvv.length === 3;
}

// Track Order function
function trackOrder() {
    alert('Your order is being prepared and will be delivered shortly! You can track its progress on the way.');
}

// Initial display
displayRestaurants();
