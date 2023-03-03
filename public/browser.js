document.addEventListener("click", function(e) {
    if(e.target.classList.contains("edit-me")){
      const userInput = prompt("Please enter the new text: ",
      // statement below populates the "edit" window with default text 
      e.target.parentElement.parentElement.querySelector(".item-text").innerHTML);
      console.log(userInput);
      // why newText? whenever you send data, always send in the form of an object [key, value]
      /* Sending a post request to the server with the new text and the id of the item. */
      // if statement only activates axios if user input entered; else no data scrubbed
      if (userInput) {
        axios.post("/edit", {
          newText: userInput, 
          id: e.target.getAttribute("id")
        })
        /* Changing the text of the item to the user input. */
        .then(function() {
          e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput;
        })
        /* A function that is called when the promise is rejected. */
        .catch(function() {
          console.log("Please try again later!");
        })
      }  
    }
});

document.addEventListener("click", function(e) {
  if(e.target.classList.contains("delete-me")) {
    /* Sending a post request to the server with the id of the item. */
    if (confirm("Are you sure you want to delete")) {
      axios.post("/delete", {
        id: e.target.getAttribute("id")
      })
      /* Removing the item from the list. */
      .then(function() {
        e.target.parentElement.parentElement.remove();
      })
      /* A function that is called when the promise is rejected. */
      .catch(function() {
        console.log("Please try again later.");
      });
    }
  }
});