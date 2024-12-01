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
        const response = await fetch("https://sloutions-cugpega6c5efaba4.westus3-01.azurewebsites.net/api/reports", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(report),
        });
    
        if (response.ok) {
            const responseData = await response.json(); // Parse the response
            console.log("Response Data:", responseData); // Log the response for debugging
    
            const incidentReportNumber = responseData._id; // Extract the MongoDB ID
            if (!incidentReportNumber) {
                console.error("No _id found in response:", responseData);
                alert("Unexpected server response. Please try again.");
                return;
            }
    
            // Redirect to the success page
            window.location.href = `submit-report-success.html?reportNumber=${incidentReportNumber}`;
        } else {
            alert("Failed to submit the report.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while submitting the report.");
    }
    
});
