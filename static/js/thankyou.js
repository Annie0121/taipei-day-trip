let back = document.querySelector(".header_name");
back.addEventListener("click",function(){
  window.location.href =window.location.href = "/"
})

let login = document.querySelector("#login")
let token = localStorage.getItem('token');
import{loginDialog,CloseSignup,CloseLogin,changeSignup,changeLogin,checkSignup,signinCheck, getResponse,bookTrip}from './event.js';
loginDialog();
CloseSignup();
CloseLogin();
changeSignup();
changeLogin();
checkSignup();
signinCheck();

bookTrip();
if(token){
  getResponse();
}else{
  login.style.display = "block";
  signout.style.display = "none";
}

signout.addEventListener("click", () => {
  localStorage.removeItem('token');
  window.location.reload();
});



document.querySelector("#number").innerHTML=window.location.href.split('=')[1]