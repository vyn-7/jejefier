document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".converter");
  const input = document.querySelector(".input");
  const output = document.querySelector(".output");

  const sendToServer = (message) => {
    const xhttp = new XMLHttpRequest();

    xhttp.onload = function () {
      const response = JSON.parse(String(this.responseText));
      if (response.success) {
        output.setAttribute("value", response.message);
        output.value = response.message;
      } else {
        output.setAttribute(
          "value",
          "Error, the API key that the creator used must have expired."
        );
        output.value =
          "Error, the API key that the creator used must have expired.";
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
