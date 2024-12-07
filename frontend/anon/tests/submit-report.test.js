const { setupFormListener } = require("../submit-report.js");

global.fetch = jest.fn();

beforeEach(() => {
    // clear previous mocks
    fetch.mockClear();

    // mock the DOM
    document.body.innerHTML = `
        <form id="reportForm">
            <input id="title" value="Broken Window" />
            <input id="location" value="Building A, Room 101" />
            <textarea id="description">Glass shattered</textarea>
        </form>
    `;

    // mock window.location like how we do in the html file
    delete window.location;
    window.location = { href: "" };


    setupFormListener();
});


test("calls the API with the correct data", async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _id: "mockReportId" }),
    });

    const form = document.getElementById("reportForm");
    form.dispatchEvent(new Event("submit"));

    await new Promise(process.nextTick); 


    const fetchCallBody = JSON.parse(fetch.mock.calls[0][1].body);

    // assert everything
    expect(fetchCallBody.title).toBe("Broken Window");
    expect(fetchCallBody.description).toBe("Glass shattered");
    expect(fetchCallBody.location).toBe("Building A, Room 101");
    expect(fetchCallBody.status).toBe("unresolved");

    // createdDate is valid 
    expect(new Date(fetchCallBody.createdDate).toISOString()).toBe(fetchCallBody.createdDate);

    // verify fetch was called with correct URL and method
    expect(fetch).toHaveBeenCalledWith(
        "https://sloutions-cugpega6c5efaba4.westus3-01.azurewebsites.net/api/reports",
        expect.objectContaining({
            method: "POST",
            headers: { "Content-Type": "application/json" },
        })
    );
});



test("redirects to success page with report number on success", async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _id: "mockReportId" }),
    });

    delete window.location;
    window.location = { href: "" }; 

    const form = document.getElementById("reportForm");
    form.dispatchEvent(new Event("submit"));

    await new Promise(process.nextTick); 

    expect(window.location.href).toBe(
        "submit-report-success.html?reportNumber=mockReportId"
    );
});

test("shows an alert on API failure", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    window.alert = jest.fn(); 

    const form = document.getElementById("reportForm");
    form.dispatchEvent(new Event("submit"));

    await new Promise(process.nextTick);

    expect(window.alert).toHaveBeenCalledWith("Failed to submit the report.");
});
