document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("search-btn");
    const usernameInput = document.getElementById("username");
    const profileCard = document.getElementById("profile-card");
    const loading = document.getElementById("loading");
    const recentRepos = document.getElementById("recent-repos");

    searchBtn.addEventListener("click", () => {
        const username = usernameInput.value.trim();
        if (username === "") {
            showError("Please enter a GitHub username");
            return;
        }
        fetchGitHubProfile(username);
    });

    async function fetchGitHubProfile(username) {
        const url = `https://api.github.com/users/${username}`;
        const reposUrl = `https://api.github.com/users/${username}/repos?sort=created&per_page=5`;

        try {
            loading.style.display = "block";
            console.log("Fetching profile data...");
            
            const [profileResponse, reposResponse] = await Promise.all([
                fetch(url),
                fetch(reposUrl)
            ]);
        
            // Check if the responses are OK
            if (!profileResponse.ok) {
                throw new Error("User not found");
            }
            if (!reposResponse.ok) {
                throw new Error("Could not fetch repositories");
            }
        
            console.log("Data fetched successfully");
        
            const profileData = await profileResponse.json();
            const reposData = await reposResponse.json();
        
            // Check if data is received correctly
            console.log("Profile Data:", profileData);
            console.log("Repositories Data:", reposData);
        
            displayProfile(profileData);
            displayRecentRepos(reposData);
        
        } catch (error) {
            console.error("Error:", error.message);  // Log error for debugging
            showError(error.message);
        } finally {
            loading.style.display = "none";
        }
    }

    function displayProfile(user) {
        const userName = user.name || "No Name Provided";  // Ensure it handles null or undefined values
        profileCard.innerHTML = `
            <div class="profile">
                <img class="profile-img" src="${user.avatar_url}" alt="Profile Picture">
                <h2 class="profile-name">${userName}</h2>
                <p class="profile-bio">${user.bio || "No bio available."}</p>
                <p class="profile-stats">Public Repos: <span>${user.public_repos}</span></p>
                <p class="profile-stats">Followers: <span>${user.followers}</span> | Following: <span>${user.following}</span></p>
                <p class="profile-location">${user.location || "Not Available"}</p>
                <a class="profile-link" href="${user.html_url}" target="_blank">View GitHub Profile</a>
            </div>
        `;
    }

    function displayRecentRepos(repos) {
        if (repos.length === 0) {
            recentRepos.style.display = "none";
            return;
        }

        recentRepos.style.display = "block";
        recentRepos.innerHTML = `
            <h3>Recent Repositories</h3>
            <ul>
                ${repos.map(repo => `<li><a href="${repo.html_url}" target="_blank">${repo.name}</a></li>`).join('')}
            </ul>
        `;
    }

    function showError(message) {
        profileCard.innerHTML = `<p class="error">${message}</p>`;
        recentRepos.innerHTML = "";
        recentRepos.style.display = "none";
    }

    function triggerButtonClick() {
        document.getElementById('search-btn').click();
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            triggerButtonClick();
        }
    });
});
