// Show password toggle
const account_password = document.querySelector("#account_password");
const showPasswordSpan = document.querySelector("#showPasswordSpan");

showPasswordSpan.addEventListener("click", () => {
  if (account_password.type === "password") {
    account_password.type = "text";
    showPasswordSpan.textContent = "Hide password";
  } else {
    account_password.type = "password";
    showPasswordSpan.textContent = "Show password";
  }
});
