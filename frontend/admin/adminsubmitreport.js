document.getElementById("reportForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const report = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        location: document.getElementById("location").value,
        createdDate: new Date().toISOString(), // Automatically set the current date and time
        status: "unresolved"
    };

    try {
        // Send the report data to the backend (Azure)
        const response = await fetch("https://sloutions-cugpega6c5efaba4.westus3-01.azurewebsites.net/api/reports", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(report),
        });
        
        

        if (response.ok) {
            alert("Report submitted successfully!");
            document.getElementById("reportForm").reset();
            window.location.href = "admin/adminsubmit-report.html"; // Redirect to home or another page
        } else {
            alert("Failed to submit the report.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while submitting the report.");
    }
});
