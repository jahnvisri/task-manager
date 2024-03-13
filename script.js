// Get the logout element
const logoutButton = document.getElementById("logout");

// Add click event listener to the logout button
logoutButton.addEventListener("click", () => {
    // Redirect to the login page
    window.location.href = "login.html";
});
function showDropdown() {
    var dropdown = document.getElementById("dropdown");
    dropdown.style.display = "block";
  }
  
  // Optional: Hide the dropdown when the mouse is not hovering over the button
  function hideDropdown() {
    var dropdown = document.getElementById("dropdown");
    dropdown.style.display = "none";
  }
  
  var iButton = document.querySelector(".i-button");
  iButton.addEventListener("mouseleave", hideDropdown);
  
let addBtn = document.querySelector(".add-btn");
let removeBtn = document.querySelector(".remove-btn");
let modalCont = document.querySelector(".modal-cont");
let mainCont = document.querySelector(".main-cont");
let textareaCont = document.querySelector(".text-area-cont");
let allPriorityColors = document.querySelectorAll(".priority-color");
let toolBoxColors = document.querySelectorAll(".color");

let colors = ["lightpink", "lightblue", "lightgreen", "black"];
let modalPriorityColor = colors[colors.length - 1];
// console.log(modalPriorityColor);

let addFlag = false;
let removeFlag = false;

let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";
let deleteOnIcon = "fa-trash";
let deleteOffIcon = "fa-trash-can-arrow-up";

let ticketArr = [];

//getting all the tickets from local storage when we reload a site

if (localStorage.getItem("jira_tickets")) {
    // retrive data and display it
    ticketArr = JSON.parse(localStorage.getItem("jira_tickets"));
    ticketArr.forEach((ticketObj) => {
        createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
    })
    
}


function getTicketIdx(id) {
    let ticketIdx = ticketArr.findIndex((ticketObj) => {
        return ticketObj.ticketID === id;
    })
    
    return ticketIdx;

}

// filter implementation of colors
for (let i = 0; i < toolBoxColors.length; i++){
    toolBoxColors[i].addEventListener("click", (e) => {
            let currentToolBoxColor = toolBoxColors[i].classList[1];
            let filteredTickets = ticketArr.filter((ticketObj, idx) => {
            return currentToolBoxColor === ticketObj.ticketColor;
        })
    // Remove Previous tickets
    let allTicketCont = document.querySelectorAll(".ticket-cont");
    for (let i = 0; i < allTicketCont.length; i++){
        allTicketCont[i].remove();   
    }
    
    // Display new filtered tickets
     filteredTickets.forEach((ticketObj, idx) => {
         createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
    })
    
    })   
    
    // functionality of dobule click 
    toolBoxColors[i].addEventListener("dblclick", (e) => {
    // Remove previous tickets 
        let allTicketCont = document.querySelectorAll(".ticket-cont");
      for (let i = 0; i < allTicketCont.length; i++){
        allTicketCont[i].remove();
        
        }
        
        ticketArr.forEach((ticketObj, idx) => {
        
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
        })
    })

}





// listner for modal priority coloring
allPriorityColors.forEach((colorElem, idx) =>{
    colorElem.addEventListener("click", (e) => {
        allPriorityColors.forEach((priorityColorElem, idx) => {
            priorityColorElem.classList.remove("border");
        });
        colorElem.classList.add("border");
        modalPriorityColor = colorElem.classList[0];
    });
    
});



// add button togle of diplay modale 
addBtn.addEventListener("click", (e) => {
    //Display modal
    // genrate tickets
    
    // AddFlag, if  true -> Modal Display
    // AddFlag, if false -> Modal None 
    addFlag = !addFlag;
    if (addFlag) {
        
        modalCont.style.display = "flex";
    
    } else {
    
        modalCont.style.display = "none";
    }


});


// just remove btn toogle function

removeBtn.addEventListener("click", (e) => {
    removeFlag = !removeFlag;
    console.log(removeFlag); 
    let removebtnicon = removeBtn.children[0]; 
    if (removebtnicon.classList.contains(deleteOnIcon)) {
            removebtnicon.classList.remove(deleteOnIcon);
              removebtnicon.classList.add(deleteOffIcon);
    } else {
             removebtnicon.classList.remove(deleteOffIcon);
              removebtnicon.classList.add(deleteOnIcon);
    }
})





modalCont.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key == "Shift") {
        // ticketID will auto generated 
        createTicket(modalPriorityColor , textareaCont.value );
        // modalCont.style.display = "none";
        addFlag = false;
        // textareaCont.value = "";
        setModalToDefault();
    }
})

function createTicket(ticketColor, ticketTask , ticketID) {
    let id = ticketID || shortid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `
<div class="ticket-color ${ticketColor}"></div>
            <div class="ticket-id">${id}</div>
            <div class="task-area">${ticketTask}</div>
<div class="ticket-lock">
            <i class="fas fa-lock"></i>
        </div>
`;
    mainCont.appendChild(ticketCont);
    
    // create Object of ticket it will help me of filtering implementation
    
    if (!ticketID) {
        ticketArr.push({ ticketColor, ticketTask, ticketID: id });
        localStorage.setItem("jira_tickets", JSON.stringify(ticketArr));
    }
    
    console.log(ticketArr);
    
    handleLock(ticketCont, id);
    handleRemoval(ticketCont, id);
    handleColor(ticketCont, id);

}

function handleRemoval(ticket, id) {
// if removalFlag > true -> remove ... removlFlag is handled by toogal
    ticket.addEventListener("click", (e) => {
    
        if (!removeFlag) return;
        
        let idx = getTicketIdx(id);
        
        //DB removal 
        ticketArr.splice(idx, 1);
        let strTicketArr = JSON.stringify(ticketArr);
        localStorage.setItem("jira_tickets", strTicketArr);
        
        // UI removal 
        ticket.remove();
    })
    
}

function handleLock(ticket, id) {
    let ticketLockElem = ticket.querySelector(".ticket-lock");
    let ticketLock = ticketLockElem.children[0];
    let ticketTaskArea = ticket.querySelector(".task-area");
     
    
    ticketLock.addEventListener("click", (e) => {
    
        let ticketIdx = getTicketIdx(id);
        
        if (ticketLock.classList.contains(lockClass)) {
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskArea.setAttribute("contenteditable", "true");
        } else {
        
           ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contenteditable", "false");
        }
        
        // Modify data in local Storage (ticket task)
        ticketArr[ticketIdx].ticketTask = ticketTaskArea.innerText;
        localStorage.setItem("jira_tickets", JSON.stringify(ticketArr));
    
    })

}





function handleColor(ticket, id) {
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click", (e) => {
        // get ticketIdx from Ticket Array
        
        let ticketIdx = getTicketIdx(id);
        
        let currentTicketColor = ticketColor.classList[1];
        // get ticket color index
        console.log(currentTicketColor);
        
        let currentTicketColorIdx = colors.findIndex((color) => {
            return currentTicketColor === color;
            
        }) 
        console.log(currentTicketColor, currentTicketColorIdx);
        currentTicketColorIdx++;
        let newTicketColorIdx = currentTicketColorIdx % colors.length; // for the rotation of colors 
        let newTicketColor = colors[newTicketColorIdx];
        console.log(newTicketColor);
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newTicketColor);
        
        // modify data in local storage (priority color change)
        ticketArr[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem("jira_tickets", JSON.stringify(ticketArr));
    });

} 

 function setModalToDefault() {
        modalCont.style.display = "none";
        textareaCont.value = "";
        modalPriorityColor = colors[colors.length - 1];
        allPriorityColors.forEach((priorityColorElem, idx) => {
            priorityColorElem.classList.remove("border");
            
        })
        allPriorityColors[allPriorityColors.length-1].classList.add("border")
    }