document.addEventListener("DOMContentLoaded", () => {
    // event listener for button
    document.getElementById("check-status-button").addEventListener("click", checkStatus);
});

async function checkStatus() {
    const reportNumber = document.getElementById("report-number").value;

    // reset all icons to inactive state (grey)
    const icons = document.querySelectorAll(".icon");
    icons.forEach(icon => {
        icon.classList.remove("active");
        icon.style.filter = "grayscale(100%)"; // make inactive icons grey
    });

    // reset description box
    const descriptionBox = document.getElementById("status-description");
    descriptionBox.innerHTML = "";

    // reset sand animation visibility
    const sandContainer = document.getElementById("sand-pour-container");
    sandContainer.style.display = "none";

    try {
        // fetch report details from the backend
        const response = await fetch(`https://sloutions-cugpega6c5efaba4.westus3-01.azurewebsites.net/api/reports/${reportNumber}`);
        if (response.ok) {
            const report = await response.json();

            // display status and details based on the report's status
            if (report.status === "unresolved") {
                const reportingIcon = document.getElementById("reporting").querySelector(".icon");
                reportingIcon.classList.add("active");
                reportingIcon.style.filter = "grayscale(0%)";
                descriptionBox.innerHTML = "<p>Your report has been received and is awaiting further action.</p>";
            } else if (report.status === "pending") {
                const checkingIcon = document.getElementById("checking").querySelector(".icon");
                checkingIcon.classList.add("active");
                checkingIcon.style.filter = "grayscale(0%)";
                descriptionBox.innerHTML = "<p>We are currently verifying your report. Please check back later.</p>";
            } else if (report.status === "resolved") {
                const resolvingIcon = document.getElementById("resolving").querySelector(".icon");
                resolvingIcon.classList.add("active");
                resolvingIcon.style.filter = "grayscale(0%)"; 
                descriptionBox.innerHTML = `
                    <p><strong>Location:</strong> ${report.location}</p>
                    <p><strong>Issue:</strong> ${report.description}</p>
                    <p>Status: Resolved!</p>
                `;
                launchConfettiInContainer(); // use confetti effect for "Resolved"
            } else {
                descriptionBox.innerHTML = "<p>Status: Unknown.</p>";
            }
        } else if (response.status === 404) {
            alert("Report not found. Please check your ID.");
        } else {
            alert("Invalid Incident Report ID");
        }
    } catch (error) {
        console.error("Error fetching report:", error);
        alert("An error occurred. Please try again.");
    }
}

function launchConfettiInContainer() {
    const descriptionBox = document.querySelector(".description-box");

    // canvas for confetti
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    descriptionBox.style.position = "relative";
    descriptionBox.appendChild(canvas);

    const confetti = window.confetti.create(canvas, {
        resize: true,
        useWorker: true,
    });

    // launch confetti
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 },
    });

    // remove canvas after the animation
    setTimeout(() => {
        descriptionBox.removeChild(canvas);
    }, 3000); 
}
