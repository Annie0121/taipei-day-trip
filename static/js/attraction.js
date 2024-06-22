//點擊價格
let btn1 = document.querySelector("#option1");
let btn2 = document.querySelector("#option2");
let total = document.querySelector(".attraction_booking_fee_total");
btn1.addEventListener("click",function(){
   total.innerHTML='新台幣 2000 元'
})
btn2.addEventListener("click",function(){
  total.innerHTML='新台幣 2500 元'
})
/*
let url = window.location.pathname;*/
attractionId =  window.location["href"].split('/')[4];


//畫面選染
let attname = document.querySelector(".attraction_profile_name");
let attcate =document.querySelector(".attraction_profile_place");
let info =document.querySelector("#att_desc");
let add = document.querySelector("#att_address");
let transport = document.querySelector("#att_mrt");
let ul =document.querySelector(".attraction_img_circle");
let left =document.querySelector(".attraction_img_button_left");
let right =document.querySelector(".attraction_img_button_right");
let img=document.querySelector(".attraction_img");

fetch(`/api/attraction/${attractionId}`)
.then(response=>response.json())
.then(data=>{
  const attraction = data["data"];
  const { name, category:cate, mrt, description:desc, address, transport:trans, images:imgs } = attraction;
  
  
  attname.innerHTML=name;
  attcate.innerHTML=`${cate} at ${mrt} `
  info.innerHTML = desc;
  add.innerHTML=address;
  transport.innerHTML =trans;
  img.src =imgs[0];
  
  //預下載圖片 創建img物件，將物件src屬性設定為url 存在瀏覽器的緩存中
  imgs.forEach(url => {
    const img = new Image();
    img.src = url;
  });



  for(let i =0;i<imgs.length;i++){
    let li = document.createElement('li');
    if (i == 0) {
      li.className = 'active';
    }
    ul.appendChild(li);
  }



  let i =0;
  right.addEventListener("click",function(){
      i++;
      i=i>=imgs.length ?0:i
      img.src =imgs[i];
      document.querySelector("ul .active").classList.remove("active");
      document.querySelector(`ul li:nth-child(${i+1}) `).classList.add("active");
  })
  
  left.addEventListener("click",function(){
    i--;
    i= i<0 ? imgs.length-1 :i
    img.src =imgs[i];
    document.querySelector("ul .active").classList.remove("active");
    document.querySelector(`ul li:nth-child(${i+1}) `).classList.add("active");
  })
  

})

//回到首頁
let back = document.querySelector(".header_name");
back.addEventListener("click",function(){
  window.location.href = window.location.origin;
})




//導向登入註冊
let login = document.querySelector("#login")
login.addEventListener("click",()=>{
   
   document.querySelector(".login_dialog_background").style.display= 'block';
})

//切換登入/註冊畫面
let signupButton = document.querySelector('.signup_button')
let loginButton =document.querySelector(".login_button")

let CloseSignup = document.querySelector("#CloseSignup")
signupButton.addEventListener("click",()=>{
    document.querySelector(".signup_dialog_background").style.display = 'block';
    document.querySelector(".login_dialog_background").style.display = " none";
    
})
CloseSignup.addEventListener("click",()=>{
    document.querySelector(".signup_dialog_background").style.display = 'none';
})

let CloseLogin = document.querySelector("#CloseLogin")
loginButton.addEventListener("click",()=>{
    document.querySelector(".signup_dialog_background").style.display = 'none';
    document.querySelector(".login_dialog_background").style.display = " block";
})
CloseLogin.addEventListener("click",()=>{
    document.querySelector(".login_dialog_background").style.display = "none";
})
 //註冊資料給後端
 let signup= document.querySelector("#signupNew");
 signup.addEventListener("click",async()=>{
     let name = document.getElementById("signupUname").value;
     let email = document.getElementById("signupEmail").value;
     let password = document.getElementById("signupPassword").value;
     
     const response = await fetch('/api/user', {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json',
         },
         body: JSON.stringify({ name, email, password }),
     });
 
     const result = await response.json();
     console.log(result);
     //註冊成功導向登入
     document.getElementById("signupUname").value=""
     document.getElementById("signupEmail").value =""
     document.getElementById("signupPassword").value=""
     let failSignup = document.querySelector(".fail_signup");
     if (failSignup) {
         failSignup.remove();
     }

     failSignup = document.createElement("div");
     failSignup.className = "fail_signup";
     failSignup.textContent = result.message;
     signup.insertAdjacentElement('afterend', failSignup);


     if (result.ok == true) {
         failSignup.style.color = "green";
         failSignup.textContent = "會員註冊成功";
         
     }else {
         failSignup.textContent = result.message;
     }
 })  


 //會員登入給後端
 let singin = document.querySelector("#singin");
 singin.addEventListener("click",async()=>{
     let email = document.querySelector("#signinEmail").value;
     let password = document.querySelector("#signinPassword").value;
     const response = await fetch('/api/user/auth', {
         method: 'PUT',
         headers: {
             'Content-Type': 'application/json',
         },
         body: JSON.stringify({ email, password }),
     });
 
     const result = await response.json();
     console.log(result);
     
     if(!result.token){
         document.getElementById("signinEmail").value =""
         document.getElementById("signinPassword").value=""
         let failSignin = document.querySelector(".fail_signup");
         if (failSignin) {
             failSignin.remove();
         }
         failSignin = document.createElement("div");
         failSignin.className = "fail_signup";
         failSignin.textContent = result.message;
         singin.insertAdjacentElement('afterend', failSignin);
         
     }else{
         localStorage.setItem('token',result.token );
         window.location.reload();
     }
 })



 

 
let token = localStorage.getItem('token');
let signout = document.querySelector('#signout');

if (token) {
  fetch("/api/user/auth", {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
      },
  }).then(response => {
      // 將後端的響應印出
      if (response.ok) {  // 如果後端的響應存在
          login.style.display = "none";
          signout.style.display = "block";
      }else{
          login.style.display = "block";
          signout.style.display = "none";
      }
      signout.addEventListener("click", () => {
          localStorage.removeItem('token');
          window.location.reload();
      });
      
  })
}else{
    login.style.display = "block";
    signout.style.display = "none";
}
