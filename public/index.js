document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".converter");
  const input = document.querySelector(".input");
  const output = document.querySelector(".output");

  const sendToServer = (message) => {
    const xhttp = new XMLHttpRequest();

    xhttp.onload = function () {
      const contentType = this.getResponseHeader("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        try {
          const response = JSON.parse(this.responseText);
          if (response.success) {
            output.setAttribute("value", response.message);
            output.value = response.message;
          } else {
            output.setAttribute("value", "Error, the API key is expired");
            output.value = "Error, the API key is expired.";
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
          output.setAttribute("value", "Invalid JSON response.");
          output.value = "Invalid JSON response.";
        }
      } else {
        console.error("Expected JSON, but got:", contentType);
        output.setAttribute("value", "Unexpected response format.");
        output.value = "Unexpected response format.";
      }
    };

    xhttp.open("GET", `/api/messages/${message.split(" ").join("&")}`, true);
    xhttp.send();
  };

  button.addEventListener("click", () => {
    if (input.value.length > 2) {
      output.setAttribute("value", "Converting...");
      output.value = "Converting...";
      sendToServer(input.value);
    }
  });
  document.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      output.setAttribute("value", "Converting...");
      output.value = "Converting...";
      sendToServer(input.value);
    }
  });
});
