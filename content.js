console.log("🚀 Content script loaded!");

window.addEventListener("load", () => {
    console.log("✅ Page fully loaded");


    const TicketSelectors = Object.freeze({
        TITLE: "body > title",
        DATE: "body > table:nth-child(9) > tbody > tr:nth-child(12) > td > table > tbody > tr > td:nth-child(5) > font",
        LOCATION: "body > table:nth-child(9) > tbody > tr:nth-child(13) > td",
        OFFICENUMBER:
            "body > table:nth-child(9) > tbody > tr:nth-child(12) > td > table > tbody > tr > td:nth-child(4) > font",
        MOBILENUMBER:
            "body > table:nth-child(9) > tbody > tr:nth-child(12) > td > table > tbody > tr > td:nth-child(3) > font",
        POSITION:
            "body > table:nth-child(9) > tbody > tr:nth-child(12) > td > table > tbody > tr > td:nth-child(1) > font",
        NAME: "#earth2 > font > b > u",
        TEXT: "#t_areaDescription",
    });

    // Function to extract and log the element if found
    function extractElement(selector, transform = (text) => text) {
        let element = document.querySelector(selector);
        if (element) {
            let enumKey = Object.keys(TicketSelectors).find(
                (key) => TicketSelectors[key] === selector
            );
            console.log(
                `🔹 Found element for selector "${enumKey}":`,
                element.textContent
            );
            return transform(element.textContent); // Apply the transformation function if provided
        } else {
            console.log(
                `⚠️ No matching element for selector "${selector}" found!`
            );
            return null;
        }
    }


    let ticket = ''
   
    if (window.location.href.includes("Add_Get_Tickets.asp?recid")) {
        let ticketTitle = extractElement(
            TicketSelectors.TITLE,
            (text) => text.match(/\d+/)[0]
        );
        let ticketDate = extractElement(TicketSelectors.DATE);
        let ticketLocation = extractElement(TicketSelectors.LOCATION, (text) =>
            text.slice(11)
        );
        let ticketPhoneNumbers = {
            office: extractElement(TicketSelectors.OFFICENUMBER),
            mobile: extractElement(TicketSelectors.MOBILENUMBER),
        };
        let ticketText = extractElement(TicketSelectors.TEXT);
        let ticketCreator = {
            position: extractElement(TicketSelectors.POSITION),
            name: extractElement(TicketSelectors.NAME),
        };
        
        //let ticketAgent = "";
    
        console.log("🎫 Ticket Title:", ticketTitle);
        console.log("📅 Ticket Date:", ticketDate);
        console.log("📍 Ticket Location:", ticketLocation);
        console.log("📞 Ticket Phone Numbers:", ticketPhoneNumbers);
        console.log("👤 Ticket Creator:", ticketCreator);
        console.log("📝 Ticket Text:", ticketText);
    
        ticket = {
            title: ticketTitle,
            date: ticketDate,
            location: ticketLocation,
            phoneNumbers: ticketPhoneNumbers,
            creator: ticketCreator,
            text: ticketText,
            agent: "",
        };
        console.log("🎫 Ticket:", ticket);
    }else{
        console.log("⚠️ Not a ticket page, exiting...");

    }
    

    

    chrome.storage.local.set({ savedTicket: ticket }, () => {
        console.log("📦 Ticket saved to storage!");
    });
});
