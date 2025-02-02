document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".converter");
  const input = document.querySelector(".input");
  const output = document.querySelector(".output");

  const sendToServer = async (message) => {
    try {
      const response = await fetch(
        `/api/messages/${message.split(" ").join("&")}`
      );
      const data = await response.json();

      if (data.success) {
        output.value = data.message;
      } else {
        output.value = "Error, the API key is expired";
      }
    } catch (error) {
      console.error("Error during API call:", error);
      output.value = "Error communicating with the server.";
    }
  };

  button.addEventListener("click", () => {
    if (input.value.length > 2) {
      output.value = "Converting...";
      sendToServer(input.value);
    }
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      output.value = "Converting...";
      sendToServer(input.value);
    }
  });
});
