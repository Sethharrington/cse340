// Show password toggle
const passwordInput = document.querySelector("#account_password");
const showPasswordSpan = document.querySelector("#showPasswordSpan");

showPasswordSpan.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    showPasswordSpan.textContent = "Hide password";
  } else {
    passwordInput.type = "password";
    showPasswordSpan.textContent = "Show password";
  }
});
