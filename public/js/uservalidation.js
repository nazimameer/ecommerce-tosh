
function validatingForm(scope) {

  const userName = document.getElementById("username");
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  if (userName.value === "") {
    document.getElementById("userNameError").innerHTML =
      "please enter your  user name..! ";
    userName.focus();
    return false;
  }else{
    document.getElementById("userNameError").innerHTML ="";
  }
  var regexname = /^[a-zA-Z\-]+$/;

  if (regexname.test(userName.value) === false) {
    document.getElementById("userNameError").innerHTML =
      "User name should not contain  special characters..! ";
    userName.focus();
    return false;
  }else{
    document.getElementById("userNameError").innerHTML ="";
  }

  if (email.value === "") {
    document.getElementById("emailError").innerHTML =
      "please enter your mail id..! ";
    email.focus();
    return false;
  }else{
    document.getElementById("emailError").innerHTML ="";
  }
  const re =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if (!re.test(email.value)) {
    document.getElementById("emailError").innerHTML =
      "please enter valid email..! ";
    email.focus();
    return false;
  }else{
    document.getElementById("emailError").innerHTML ="";
  }
  var regexpass = /(?=(.*?[a-zA-Z|0-9]){4})/;
  if (regexpass.test(password.value) === false) {
    document.getElementById("passwordError").innerHTML =
      "password should have atleast 4 digits..! ";
    password.focus();
    return false;
  }else{
    document.getElementById("passwordError").innerHTML ="";
  }

  if (password.value === "") {
    document.getElementById("passwordError").innerHTML =
      "please enter a password..! ";
    password.focus();
    return false;
  }else{
    document.getElementById("passwordError").innerHTML ="";
  }

  return true;
}
