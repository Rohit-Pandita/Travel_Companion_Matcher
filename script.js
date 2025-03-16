document.addEventListener("DOMContentLoaded", function () {
    // Utility function to show/hide sections
    function showSection(showId) {
        document.querySelectorAll("section").forEach(section => {
            section.classList.add("hidden"); // Hide all sections
            section.classList.remove("active"); // Remove active class from all sections
        });
        const sectionToShow = document.getElementById(showId);
        sectionToShow.classList.remove("hidden"); // Show the selected section
        
        // Add active class with a slight delay for animation effect
        setTimeout(() => {
            sectionToShow.classList.add("active");
        }, 50);

        // Show/hide navigation based on section
        const nav = document.getElementById("main-nav");
        if (showId !== "home" && showId !== "login-section") {
            nav.classList.remove("hidden");
        } else {
            nav.classList.add("hidden");
        }

        // Scroll to top when changing sections
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // Initialize interest tags
    function initInterestTags() {
        document.querySelectorAll('.interest-tag').forEach(tag => {
            tag.addEventListener('click', function() {
                this.classList.toggle('selected');
                updateInterestsValue();
            });
        });
    }

    // Update interests hidden input value
    function updateInterestsValue() {
        const selectedInterests = Array.from(document.querySelectorAll('.interest-tag.selected'))
            .map(tag => tag.textContent)
            .join(', ');
        document.getElementById('interests').value = selectedInterests;
    }

    // Function to simulate typing effect
    function typeWriter(element, text, i = 0, speed = 50) {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(() => typeWriter(element, text, i, speed), speed);
        }
    }

    // Initialize floating elements animation
    function initFloatingElements() {
        const elements = document.querySelectorAll('.floating-element');
        elements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.5}s`;
        });
    }

    // Add message to chat
    function addMessage(text, isSent = true) {
        const chatBox = document.getElementById("chat-box");
        const messageContainer = document.createElement("div");
        messageContainer.className = "message-container";
        
        const message = document.createElement("div");
        message.className = isSent ? "message sent" : "message received";
        
        const messageText = document.createElement("p");
        messageText.textContent = text;
        
        const messageTime = document.createElement("span");
        messageTime.className = "message-time";
        messageTime.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        message.appendChild(messageText);
        message.appendChild(messageTime);
        messageContainer.appendChild(message);
        chatBox.appendChild(messageContainer);
        
        // Scroll to bottom of chat
        chatBox.scrollTop = chatBox.scrollHeight;
        
        // Animate the new message
        message.style.opacity = "0";
        message.style.transform = "translateY(20px)";
        
        setTimeout(() => {
            message.style.opacity = "1";
            message.style.transform = "translateY(0)";
        }, 100);
    }

    // Set up loading effect
    function setupLoadingEffect(button, callback, delay = 1000) {
        button.addEventListener("click", function() {
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            button.disabled = true;
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                callback();
            }, delay);
        });
    }

    // Save profile data to local storage
    function saveProfileData() {
        const profileData = {
            name: document.getElementById("name").value.trim(),
            age: document.getElementById("age").value.trim(),
            gender: document.getElementById("gender").value,
            destination: document.getElementById("destination").value.trim(),
            companion: document.getElementById("companion-gender").value,
            budget: document.getElementById("budget").value.trim(),
            bio: document.getElementById("bio").value.trim(),
            interests: document.getElementById("interests").value
        };

        // Validate all required fields
        const requiredFields = ["name", "age", "gender", "destination", "companion", "budget"];
        const missingFields = requiredFields.filter(field => !profileData[field]);
        
        if (missingFields.length > 0) {
            showNotification("Please fill all required fields", "error");
            return false;
        }

        // Save to localStorage
        localStorage.setItem("profile", JSON.stringify(profileData));
        return true;
    }

    // Display profile data
    function displayProfile() {
        const profile = JSON.parse(localStorage.getItem("profile"));

        if (profile) {
            document.getElementById("profile-name").innerText = profile.name;
            document.getElementById("profile-age").innerText = profile.age;
            document.getElementById("profile-gender").innerText = profile.gender;
            document.getElementById("profile-destination").innerText = profile.destination;
            document.getElementById("profile-companion").innerText = profile.companion;
            document.getElementById("profile-budget").innerText = profile.budget;
            document.getElementById("profile-bio").innerText = profile.bio || "No bio provided";
            document.getElementById("profile-interests").innerText = profile.interests || "None specified";

            showSection("profile-section");
            return true;
        } else {
            showNotification("No profile found! Please complete your profile.", "error");
            return false;
        }
    }

    // Show notification
    function showNotification(message, type = "success") {
        // Create notification element if it doesn't exist
        let notification = document.querySelector(".notification");
        if (!notification) {
            notification = document.createElement("div");
            notification.className = "notification";
            document.body.appendChild(notification);
        }
        
        // Set type and message
        notification.className = `notification ${type}`;
        notification.innerHTML = `<p>${message}</p>`;
        notification.style.display = "block";
        
        // Slide in from top
        notification.style.top = "-50px";
        setTimeout(() => {
            notification.style.top = "20px";
        }, 10);
        
        // Disappear after 3 seconds
        setTimeout(() => {
            notification.style.top = "-50px";
            setTimeout(() => {
                notification.style.display = "none";
            }, 500);
        }, 3000);
    }

    // Load profile data into edit form
    function loadProfileForEdit() {
        const profile = JSON.parse(localStorage.getItem("profile"));
        if (profile) {
            document.getElementById("name").value = profile.name || "";
            document.getElementById("age").value = profile.age || "";
            document.getElementById("gender").value = profile.gender || "";
            document.getElementById("destination").value = profile.destination || "";
            document.getElementById("companion-gender").value = profile.companion || "";
            document.getElementById("budget").value = profile.budget || "";
            document.getElementById("bio").value = profile.bio || "";
            
            // Set interest tags
            if (profile.interests) {
                const interests = profile.interests.split(', ');
                document.querySelectorAll('.interest-tag').forEach(tag => {
                    if (interests.includes(tag.textContent)) {
                        tag.classList.add('selected');
                    } else {
                        tag.classList.remove('selected');
                    }
                });
            }
        }
    }

    // Get all navigation and action buttons
    const getStartedBtn = document.getElementById("get-started");
    const loginBtn = document.getElementById("login-btn");
    const saveProfileBtn = document.getElementById("save-profile");
    const viewProfileBtn = document.getElementById("view-profile");
    const editProfileBtn = document.getElementById("edit-profile");
    const findMatchesBtn = document.getElementById("find-matches");
    const chatBtn = document.getElementById("open-chat");
    const sendMessageBtn = document.getElementById("send-message");
    const navLinks = document.querySelectorAll("#main-nav a");

    // Set up navigation
    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.id.replace("nav-", "");
            
            switch(targetId) {
                case "home":
                    showSection("home");
                    break;
                case "profile":
                    if (localStorage.getItem("profile")) {
                        displayProfile();
                    } else {
                        showSection("dashboard");
                    }
                    break;
                case "matches":
                    showSection("matches-section");
                    break;
                case "chat":
                    showSection("chat-section");
                    break;
                case "logout":
                    showNotification("You have been logged out", "success");
                    setTimeout(() => {
                        showSection("home");
                    }, 1000);
                    break;
            }
        });
    });

    // Set up chat contacts
    document.querySelectorAll(".chat-contact").forEach(contact => {
        contact.addEventListener("click", function() {
            document.querySelectorAll(".chat-contact").forEach(c => c.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // Handle "Get Started" button
    if (getStartedBtn) {
        getStartedBtn.addEventListener("click", function () {
            showSection("login-section");
        });
    }

    // Handle "Login" button with loading effect
    if (loginBtn) {
        setupLoadingEffect(loginBtn, function() {
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (email === "" && password === "123456") {
                showNotification("Login successful!", "success");
                setTimeout(() => {
                    showSection("dashboard");
                }, 500);
            } else {
                document.getElementById("login-error").innerText = "Invalid credentials!";
                document.getElementById("login-error").style.opacity = "0";
                setTimeout(() => {
                    document.getElementById("login-error").style.opacity = "1";
                }, 100);
            }
        });
    }

    // Handle "Save Profile" with loading effect
    if (saveProfileBtn) {
        setupLoadingEffect(saveProfileBtn, function() {
            if (saveProfileData()) {
                showNotification("Profile saved successfully!", "success");
                setTimeout(() => {
                    displayProfile();
                }, 500);
            }
        });
    }

    // Handle "View Profile"
    if (viewProfileBtn) {
        viewProfileBtn.addEventListener("click", displayProfile);
    }

    // Handle "Edit Profile"
    if (editProfileBtn) {
        editProfileBtn.addEventListener("click", function () {
            loadProfileForEdit();
            showSection("dashboard");
        });
    }

    // Handle "Find Matches"
    if (findMatchesBtn) {
        findMatchesBtn.addEventListener("click", function () {
            showSection("matches-section");
        });
    }

    // Handle "Chat with Users"
    if (chatBtn) {
        chatBtn.addEventListener("click", function () {
            showSection("chat-section");
        });
    }

    // Handle "Send Message" with animation
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener("click", function () {
            const messageInput = document.getElementById("chat-message");
            const messageText = messageInput.value.trim();

            if (messageText === "") {
                messageInput.classList.add("shake");
                setTimeout(() => messageInput.classList.remove("shake"), 500);
                return;
            }

            // Add message to chat
            addMessage(messageText, true);
            
            // Clear input
            messageInput.value = "";
            
            // Simulate response after 1-2 seconds
            setTimeout(() => {
                const responses = [
                    "That sounds great! When are you planning to travel?",
                    "I've been to that place before, it's amazing!",
                    "Have you booked your accommodation yet?",
                    "What activities are you interested in doing there?",
                    "Would you like to meet for coffee to discuss travel plans?"
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomResponse, false);
            }, 1000 + Math.random() * 1000);
        });
        
        // Allow Enter key to send messages
        document.getElementById("chat-message").addEventListener("keypress", function(e) {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessageBtn.click();
            }
        });
    }
    
    // Initialize components
    initInterestTags();
    initFloatingElements();
    
    // Check for existing profile and show appropriate section
    // For demo purposes, we always start at home
    showSection("home");
});
