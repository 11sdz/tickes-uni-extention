document.addEventListener("DOMContentLoaded", async function () {
    const agentSelector = document.getElementById("agent-selector");
    const sendButton = document.getElementById("send-button");

    // Load saved ticket from Chrome storage
    let savedTicket = null;
    chrome.storage.local.get(["savedTicket"], async function (result) {
        if (result.savedTicket) {
            savedTicket = result.savedTicket;
            console.log("Ticket data retrieved:", savedTicket);

            // Populate UI
            document.getElementById("ticket-title").textContent = savedTicket.title || "No title available";
            document.getElementById("ticket-date").textContent = savedTicket.date || "No date available";
            document.getElementById("ticket-location").textContent = savedTicket.location || "No location available";
            document.getElementById("ticket-mobile").textContent = savedTicket.phoneNumbers?.mobile || "No mobile number available";
            document.getElementById("ticket-office").textContent = savedTicket.phoneNumbers?.office || "No office number available";
            document.getElementById("ticket-creator").textContent =
                `${savedTicket.creator?.name || ""}, ${savedTicket.creator?.position || ""}` || "No creator available";
            document.getElementById("ticket-text").textContent = savedTicket.text || "No description available";

            sendButton.style.display = "inline-block";
        } else {
            console.log("No ticket data found in storage");
            sendButton.style.display = "none";
        }

        // Fetch agents
        try {
            const response = await fetch("http://localhost:5000/api/userStatus");
            const agents = await response.json();

            agentSelector.innerHTML = "";

            const defaultOption = document.createElement("option");
            defaultOption.textContent = "בחר סוכן";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            agentSelector.appendChild(defaultOption);

            agents.forEach(agent => {
                const option = document.createElement("option");
                option.value = agent.userId;
                option.textContent = `${agent.firstName} ${agent.lastName}`;
                agentSelector.appendChild(option);
            });
        } catch (error) {
            console.error("Error fetching agents:", error);
        }
    });

    agentSelector.addEventListener("change", function () {
        const selectedAgentId = agentSelector.value;
        const selectedAgentName = agentSelector.options[agentSelector.selectedIndex].textContent;
        console.log("Selected Agent ID:", selectedAgentId);
        console.log("Selected Agent Name:", selectedAgentName);
    });

    sendButton.addEventListener("click", () => {
        if (!savedTicket) {
            alert("אין פנייה לשליחה");
            return;
        }

        const selectedAgent = agentSelector.value;
        if (!selectedAgent) {
            alert("אנא בחר סוכן לפני השליחה");
            return;
        }

        const dataToSend = {
            title: savedTicket.title,
            date: savedTicket.date,
            location: savedTicket.location,
            officeNumber: savedTicket.phoneNumbers?.office,
            mobileNumber: savedTicket.phoneNumbers?.mobile,
            personalName: savedTicket.creator.name,
            position: savedTicket.creator.position,
            text: savedTicket.text,
            agent: selectedAgent,
        };

        fetch("http://localhost:5000/api/tickets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        })
            .then(response => response.json())
            .then(data => {
                console.log("Ticket sent successfully:", data);
                alert("הפנייה נשלחה בהצלחה!");
            })
            .catch(error => {
                console.error("Error sending ticket:", error);
                alert("שליחת הפנייה נכשלה. נסה שוב מאוחר יותר.");
            });
    });
});
