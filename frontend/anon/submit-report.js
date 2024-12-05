function setupFormListener() {
    const form = document.getElementById("reportForm");
    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            const report = {
                title: document.getElementById("title").value,
                description: document.getElementById("description").value,
                location: document.getElementById("location").value,
                createdDate: new Date().toISOString(),
                status: "unresolved",
            };

            try {
                const response = await fetch(
                    "https://sloutions-cugpega6c5efaba4.westus3-01.azurewebsites.net/api/reports",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(report),
                    }
                );

                if (response.ok) {
                    const responseData = await response.json();
                    const incidentReportNumber = responseData._id;

                    if (!incidentReportNumber) {
                        console.error(
                            "No _id found in response:",
                            responseData
                        );
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
    }
}

// Export the function for testing
module.exports = { setupFormListener };
