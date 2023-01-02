function primaryAddvali(scope){
    const name = document.getElementById('username')
    const mobile = document.getElementById("mobile")
    const email = document.getElementById("email")
    const zip = document.getElementById("zip")
    const area = document.getElementById('area')
    const district = document.getElementById('district')
    const state = document.getElementById('state')
    const landmark = document.getElementById('landmark')


    if (name.value === "") {
        document.getElementById("userNameError").innerHTML =
          "please enter your name..! ";
          name.focus();
        return false;
      }else{
        document.getElementById("userNameError").innerHTML = "";
      }

      if (mobile.value === "") {
        document.getElementById("mobileError").innerHTML =
          "please enter your mobile..! ";
          mobile.focus();
        return false;
      }else{
        document.getElementById("mobileError").innerHTML = "";
      }

      if (email.value === "") {
        document.getElementById("emailError").innerHTML =
          "please enter your email..! ";
          email.focus();
        return false;
      }else{
        document.getElementById("emailError").innerHTML = "";
      }

      if (zip.value === "") {
        document.getElementById("zipError").innerHTML =
          "please enter your postcode..! ";
          zip.focus();
        return false;
      }else{
        document.getElementById("zipError").innerHTML = "";
      }

      if (area.value === "") {
        document.getElementById("areaError").innerHTML =
          "please enter your area..! ";
          area.focus();
        return false;
      }else{
        document.getElementById("areaError").innerHTML = "";
      }

      if (district.value === "") {
        document.getElementById("districtError").innerHTML =
          "please enter your district..! ";
          district.focus();
        return false;
      }else{
        document.getElementById("districtError").innerHTML = "";
      }

      if (state.value === "") {
        document.getElementById("stateError").innerHTML =
          "please enter your state..! ";
          state.focus();
        return false;
      }else{
        document.getElementById("stateError").innerHTML = "";
      }

      if (landmark.value === "") {
        document.getElementById("landmarkError").innerHTML =
          "please enter your landmark..! ";
          landmark.focus();
        return false;
      }else{
        document.getElementById("landmarkError").innerHTML = "";
      }

      return true;
}


function secondaryAddvali(scope){
    const name = document.getElementById('username')
    const mobile = document.getElementById("mobile")
    const email = document.getElementById("email")
    const zip = document.getElementById("zip")
    const area = document.getElementById('area')
    const district = document.getElementById('district')
    const state = document.getElementById('state')
    const landmark = document.getElementById('landmark')


    if (name.value === "") {
        document.getElementById("userNameError").innerHTML =
          "please enter your name..! ";
          name.focus();
        return false;
      }else{
        document.getElementById("userNameError").innerHTML = "";
      }

      if (mobile.value === "") {
        document.getElementById("mobileError").innerHTML =
          "please enter your mobile..! ";
          mobile.focus();
        return false;
      }else{
        document.getElementById("mobileError").innerHTML = "";
      }

      if (email.value === "") {
        document.getElementById("emailError").innerHTML =
          "please enter your email..! ";
          email.focus();
        return false;
      }else{
        document.getElementById("emailError").innerHTML = "";
      }

      if (zip.value === "") {
        document.getElementById("zipError").innerHTML =
          "please enter your postcode..! ";
          zip.focus();
        return false;
      }else{
        document.getElementById("zipError").innerHTML = "";
      }

      if (area.value === "") {
        document.getElementById("areaError").innerHTML =
          "please enter your area..! ";
          area.focus();
        return false;
      }else{
        document.getElementById("areaError").innerHTML = "";
      }

      if (district.value === "") {
        document.getElementById("districtError").innerHTML =
          "please enter your district..! ";
          district.focus();
        return false;
      }else{
        document.getElementById("districtError").innerHTML = "";
      }

      if (state.value === "") {
        document.getElementById("stateError").innerHTML =
          "please enter your state..! ";
          state.focus();
        return false;
      }else{
        document.getElementById("stateError").innerHTML = "";
      }

      if (landmark.value === "") {
        document.getElementById("landmarkError").innerHTML =
          "please enter your landmark..! ";
          landmark.focus();
        return false;
      }else{
        document.getElementById("landmarkError").innerHTML = "";
      }

      return true;
}





