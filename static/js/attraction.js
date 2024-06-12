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
  name = data["data"]["name"];
  cate = data["data"]["category"];
  mrt = data["data"]["mrt"];
  desc = data["data"]["description"];
  address =data["data"]["address"];
  trans = data["data"]["transport"];
  imgs = data["data"]["images"];
  console.log(imgs.length);
  attname.innerHTML=name;
  attcate.innerHTML=`${cate} at ${mrt} `
  info.innerHTML = desc;
  add.innerHTML=address;
  transport.innerHTML =trans;
  img.src =imgs[0];
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