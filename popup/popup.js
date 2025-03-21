// Retrieve the ticket object from chrome storage
let savedTicket = "";
const sendButton = document.getElementById("send-button");
chrome.storage.local.get(["savedTicket"], function (result) {
    if (result.savedTicket) {
        console.log("Ticket data retrieved:", result.savedTicket);
        savedTicket = result.savedTicket;
        // Update the HTML elements with the ticket data
        document.getElementById("ticket-title").textContent =
            savedTicket.title || "No title available";
        document.getElementById("ticket-date").textContent =
            savedTicket.date || "No date available";
        document.getElementById("ticket-location").textContent =
            savedTicket.location || "No location available";
        document.getElementById("ticket-mobile").textContent =
            savedTicket.phoneNumbers?.mobile || "No mobile number available";
        document.getElementById("ticket-office").textContent =
            savedTicket.phoneNumbers?.office || "No office number available";
        document.getElementById("ticket-creator").textContent =
            savedTicket.creator?.name+", "+savedTicket.creator?.position || "No creator available";
        document.getElementById("ticket-text").textContent =
            savedTicket.text || "No description available";

        sendButton.style.display = "inline-block"; // Or 'block' depending on the desired layout
    } else {
        console.log("No ticket data found in storage");
        sendButton.style.display = 'none'; // Or 'block' depending on the desired layout
    }

    document.addEventListener("DOMContentLoaded", function () {
        // Access the agent dropdown element
        const agentSelector = document.getElementById("agent-selector");

        // Add an event listener to monitor when the user changes the selected agent
        agentSelector.addEventListener("change", function () {
            const selectedAgent = agentSelector.value; // Get the selected agent value
            console.log("Selected Agent:", selectedAgent);
        });
    });


    sendButton.addEventListener('click', () => {
        // Prepare data to send
        const dataToSend = {
            title: savedTicket.title,
            date: savedTicket.date,
            location: savedTicket.location,
            officeNumber: savedTicket.phoneNumbers?.office,
            mobileNumber: savedTicket.phoneNumbers?.mobile,
            personalName: savedTicket.creator.name, // You can replace this with actual user data if available
            position: savedTicket.creator.position,
            text: savedTicket.text,
            agent: document.getElementById('agent-selector').value // Get selected agent
        };

        // Send data to the API
        fetch('http://localhost:5000/api/tickets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Ticket sent successfully:', data);
            // Handle success (e.g., show a success message to the user)
            alert('Ticket sent successfully!');
        })
        .catch(error => {
            console.error('Error sending ticket:', error);
            // Handle error (e.g., show an error message to the user)
            alert('Failed to send ticket. Please try again later.');
        });
    });
});
