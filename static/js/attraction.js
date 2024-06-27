//點擊價格
let btn1 = document.querySelector("#morning");
let btn2 = document.querySelector("#afternoon");
let total = document.querySelector(".attraction_booking_fee_total");
btn1.addEventListener("click",function(){
   total.innerHTML='新台幣 2000 元'
})
btn2.addEventListener("click",function(){
  total.innerHTML='新台幣 2500 元'
})
/*
let url = window.location.pathname;*/
const attractionId =  window.location["href"].split('/')[4];


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

//開始預訂行程

let booking = document.querySelector(".attraction_booking_button");

booking.addEventListener("click",()=>{
  
  let date = document.querySelector(".attraction_booking_date_input").value;
  let time = document.querySelector('input[name="option"]:checked') ? document.querySelector('input[name="option"]:checked').id : null;
  let price = total?  total.textContent.split(" ")[1] :null
  
  if (!date || !time || !price) {
    alert("請輸入完整資料");
    return; // 如果有一個沒有填寫，不執行後續操作
  }

  //給後端預約的格式
  let bookinginfo={
    "attractionId": attractionId,
    "date": date,
    "time": time,
    "price": price
  }
  //確認預定資料
  fetch("/api/booking",{
    method:"POST",
    headers:{
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    },
    body:JSON.stringify(bookinginfo)
  }).then(
    response=>response.json()
  ).then(data=>{
    //未授權跳出登入畫面
    if(data.message=="未授權"){
      document.querySelector(".login_dialog_background").style.display= 'block';
    }else if(data.ok){
      window.location.href = "/booking";
    }else{
      console.log(data.message);
    }
    
  })
})
