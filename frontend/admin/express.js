app.put("/api/reports/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Unresolved", "Pending", "Resolved"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
    }

    try {
        const updatedReport = await Report.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedReport) {
            return res.status(404).json({ message: "Report not found" });
        }

        res.json(updatedReport);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
