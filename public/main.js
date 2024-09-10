window.onload = async function() {
    try {
        // Fetch posts from the /posts/feed route
        const response = await fetch('/posts/feed', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`,  // Add token if required for authorization
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch posts. Please log in.');
        }

        const posts = await response.json();
        const feed = document.getElementById('feed');

        // Clear any previous content
        feed.innerHTML = '';

        // If there are posts, display them
        if (posts.length > 0) {
            posts.forEach(post => {
                const li = document.createElement('li');
                li.textContent = `${post.content} - by ${post.user.username}`;
                feed.appendChild(li);
            });
        } else {
            feed.innerHTML = '<p>No posts to display.</p>';
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching posts: ' + error.message);
        window.location.href = '/auth/login';  // Redirect to login if not authenticated
    }
};

// Function to get JWT token from cookies/localStorage (assuming it's stored there)
function getToken() {
    // Example using localStorage (you could also use cookies)
    return localStorage.getItem('token');  // Replace this if using cookies instead
}