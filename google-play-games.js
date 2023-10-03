// Load the Google Play Games Services API
gapi.load('auth2', () => {
    // Initialize the API with your client ID
    gapi.auth2.init({
        client_id: '193881350134-jrcddddql6tkj33e2rg5q58s9ie395i7.apps.googleusercontent.com'
    }).then(() => {
        // Listen for sign-in state changes
        const auth2 = gapi.auth2.getAuthInstance();
        auth2.isSignedIn.listen(updateSignInStatus);

        // Check the initial sign-in state
        updateSignInStatus(auth2.isSignedIn.get());

        // Handle sign-in button click
        const signInButton = document.getElementById('sign-in-button');
        signInButton.addEventListener('click', () => {
            if (!auth2.isSignedIn.get()) {
                auth2.signIn();
            }
        });

        // Handle sign-out button click
        const signOutButton = document.getElementById('sign-out-button');
        signOutButton.addEventListener('click', () => {
            if (auth2.isSignedIn.get()) {
                auth2.signOut();
            }
        });

        // Function to update UI based on sign-in status
        function updateSignInStatus(isSignedIn) {
            if (isSignedIn) {
                // Player is signed in, enable game features
                // You can also submit scores and unlock achievements here
            } else {
                // Player is signed out, disable game features
            }
        }
    });
});

// Function to submit a score to a leaderboard
function submitScoreToLeaderboard(score) {
    gapi.client.games.scores.submit({
        leaderboardId: 'CgkI9r_qodIFEAIQAg', // Replace with your leaderboard ID
        score: score
    }).then((response) => {
        console.log('Score submitted:', response);
    });
}

// Function to unlock an achievement
function unlockAchievement() {
    gapi.client.games.achievements.unlock({
        achievementId: 'CgkI9r_qodIFEAIQAQ' // Replace with your achievement ID
    }).then((response) => {
        console.log('Achievement unlocked:', response);
    });
}
