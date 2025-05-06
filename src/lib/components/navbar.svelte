<script>
    let appName = "Hackathon 2025";
</script>

<header class="navbar">
    <div class="navbar__title">{appName}</div>
    <button class="navbar__login-button">Login</button>
</header>

<style>
    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background-color: #333;
        color: #fff;
    }

    .navbar__title {
        font-size: 1.5rem;
        font-weight: bold;
    }

    .navbar__login-button {
        background-color: #007BFF;
        color: #fff;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
    }

    .navbar__login-button:hover {
        background-color: #0056b3;
    }
</style>