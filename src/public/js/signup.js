console.log("Signup frontend javascript file");

$(function () {});

function validateSignupForm() {
  console.log("EXECUTED");
  const memberNick = $(".member-nick").val();
  const memberPhone = $(".member-phone").val();
  const memberPassword = $(".member-password").val();
  const consfirmPassword = $(".confirm-password").val();

  if (
    memberNick === "" ||
    memberPhone === "" ||
    memberPassword === "" ||
    consfirmPassword === ""
  ) {
    alert("Please insert all required inputs!?");
    return false;
  }

  if (memberPassword !== consfirmPassword) {
    alert("Password differs, please check!");
    return false;
  }
}
