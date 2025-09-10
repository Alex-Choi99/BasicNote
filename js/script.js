const backButton = document.getElementById("BackButton");

if (backButton) {
    backButton.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "index.html";
    });
}

