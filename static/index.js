
async function copyResponse() {
  const response = document.getElementById("response");
  const copyButton = document.getElementById("copyButton");

  try {
    await navigator.clipboard.writeText(response.textContent);
    // Provide visual feedback
    const originalText = copyButton.textContent;
    copyButton.textContent = "Copied!";
    setTimeout(() => {
      copyButton.textContent = originalText;
    }, 2000);
  } catch (err) {
    // Fallback for browsers that don't support clipboard API
    const textarea = document.createElement("textarea");
    textarea.value = response.textContent;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      copyButton.textContent = "Copied!";
      setTimeout(() => {
        copyButton.textContent = "Copy";
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
      showError("Failed to copy text to clipboard");
    }
    document.body.removeChild(textarea);
  }
}

async function generateResponse() {
  const prompt = document.getElementById("prompt").value;
  const model = "llama3.2:latest";
  const responseDiv = document.getElementById("response");
  const errorDiv = document.getElementById("error");

  if (!prompt) {
    showError("Please enter a prompt");
    return;
  }

  try {
    responseDiv.textContent = "Generating...";
    errorDiv.style.display = "none";

    const response = await fetch("/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        model: model,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    responseDiv.textContent = data.response;
  } catch (error) {
    showError("Error generating response: " + error.message);
    responseDiv.textContent = "";
  }
}

function showError(message) {
  const errorDiv = document.getElementById("error");
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
}
