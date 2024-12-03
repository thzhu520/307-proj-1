document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("update-status-button")) {
        console.log("Update Status button clicked!");
      const reportId = event.target.dataset.id; // Get the report ID
      const newStatus = document.querySelector(`#status-select-${reportId}`).value; // Get the selected status
      console.log("Report ID:", reportId, "New Status:", newStatus);


      try {
        const token = localStorage.getItem("token"); // Ensure token is available
  
        if (!token) {
          alert("You must log in first.");
          return;
        }
  
        // Send the updated status to the backend
        const response = await fetch(
            `https://sloutions-cugpega6c5efaba4.westus3-01.azurewebsites.net/api/reports/${reportId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            }
        );
        
  
        if (!response.ok) {
          throw new Error("Failed to update status");
        }
  
        const updatedReport = await response.json();
        console.log("Updated Report:", updatedReport);
  
        // Update the status display on the page
        event.target
          .closest(".issue-card")
          .querySelector(".current-status").textContent = updatedReport.status;
  
        alert("Status updated successfully!");
      } catch (error) {
        console.error("Error updating status:", error);
        alert("Failed to update status. Please try again.");
      }
    }
  });
  