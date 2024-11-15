document.getElementById("reportForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const report = {
        id: generateUniqueId(),
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        location: document.getElementById("location").value,
        createdDate: document.getElementById("createdDate").value,
        status: "unresolved"
    };

    try {
        // Send the report data to the backend (Azure)
        const response = await fetch("https://sloutions-cugpega6c5efaba4.westus3-01.azurewebsites.net/reports", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(report)
        });

        if (response.ok) {
            alert("Report submitted successfully!");
            document.getElementById("reportForm").reset();
            window.location.href = "index.html"; // Redirect to home or another page
        } else {
            alert("Failed to submit the report.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while submitting the report.");
    }
});

// Function to generate a unique ID (simple example)
function generateUniqueId() {
    return 'id-' + Math.random().toString(36).substr(2, 9);
}
