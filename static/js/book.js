import{loginDialog,CloseSignup,CloseLogin,changeSignup,changeLogin,checkSignup,signinCheck,bookTrip}from './event.js';
loginDialog();
CloseSignup();
CloseLogin();
changeSignup();
changeLogin();
checkSignup();
signinCheck();

bookTrip();

//回到首頁
let back = document.querySelector(".header_name");
back.addEventListener("click",function(){
  window.location.href =window.location.href = "/"
})

//渲染畫面
let token = localStorage.getItem("token")
let booking_nodata= document.querySelector(".booking_nodata")
let booking = document.querySelector("#booking")
let bookingimg=document.querySelector("#bookingimg")
let date = document.querySelector("#date")
let time =document.querySelector("#time")
let price =document.querySelector("#fee")
let address =document.querySelector("#address")
let total=document.querySelector(".booking_total_price")
let footer = document.querySelector(".footer")
let name =document.querySelector("#name")


if(!token){
    window.location.href =window.location.href = "/"
}








fetch("/api/booking", {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    },
})
.then(response => response.json())
.then(data => {
    // 使用 data 來渲染畫面
    if(!data){
        booking_nodata.style.display="block";
        footer.style.height = "67.5vh"
    }else{
        
        booking.style.display="block";
        bookingimg.src=data["data"]["attraction"]["image"]
        name.textContent=data["data"]["attraction"]["name"]
        date.textContent=data["data"]["date"]
        time.textContent=data["data"]["time"]
        price.textContent=data["data"]["price"]
        address.textContent=data["data"]["attraction"]["address"]
        total.textContent=`總價：新台幣 ${data["data"]["price"]} 元`
    } 
})







/*測試*/ 
let login = document.querySelector("#login")
let deleteBooking = document.querySelector("#deleteBooking");
let headline=document.querySelector(".headline")
let signout = document.querySelector('#signout');
function fetchAuth(){
    return fetch("/api/user/auth",{
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${token}`
        },
    })
}

function getResponse(){
    return fetchAuth().then(response=>{
        
        if(response.ok){
            login.style.display = "none";
            signout.style.display = "block";
            return response.json();
        }else{
            login.style.display = "block";
            signout.style.display = "none";
            return null;
        }
       
    })
}


function getData(){
    getResponse().then(data=>{
        headline.textContent=`您好，${data["data"]["name"]}，待預訂的行程如下：`
        document.querySelector("#bookingName").value=data["data"]["name"]
        document.querySelector('#bookingEmail').value=data["data"]["email"]
        let userID=data["data"]["id"]
        deleteBooking.addEventListener("click",()=>{
            deleteBookingAPI(userID, token);
        })
    })
}



if(token){
    getData();
}else{
    login.style.display = "block";
    signout.style.display = "none";
}

signout.addEventListener("click", () => {
    localStorage.removeItem('token');
    window.location.reload();
});











/*全部代碼
let login = document.querySelector("#login")
let deleteBooking = document.querySelector("#deleteBooking");
let headline=document.querySelector(".headline")

if (token) {
    fetch("/api/user/auth", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    }).then(response => {
        if (response.ok) {  
            login.style.display = "none";
            signout.style.display = "block";
            return response.json();
        }else{
            login.style.display = "block";
            signout.style.display = "none";
        }
        signout.addEventListener("click", () => {
            localStorage.removeItem('token');
            window.location.reload();
        });
    }).then(data=>{
        headline.textContent=`您好，${data["data"]["name"]}，待預訂的行程如下：`
        document.querySelector("#bookingName").value=data["data"]["name"]
        document.querySelector('#bookingEmail').value=data["data"]["email"]
        console.log(data);
        //刪除訂單
        let userID=data["data"]["id"]
        deleteBooking.addEventListener("click",()=>{
            deleteBookingAPI(userID, token);
        })
    
    
    })
}else{
    login.style.display = "block";
    signout.style.display = "none";
}
*/




/*部分代碼
let deleteBooking = document.querySelector("#deleteBooking");
let headline=document.querySelector(".headline")
fetch("/api/user/auth", {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    },
}).then(response =>{
    console.log(response);
    return response.json();
}).then(data=>{
    headline.textContent=`您好，${data["data"]["name"]}，待預訂的行程如下：`
    document.querySelector("#bookingName").value=data["data"]["name"]
    document.querySelector('#bookingEmail').value=data["data"]["email"]
    console.log(data);
    //刪除訂單
    let userID=data["data"]["id"]
    deleteBooking.addEventListener("click",()=>{
        deleteBookingAPI(userID, token);
    })


})

*/





//刪除訂單
function deleteBookingAPI(userID,token){
    fetch("/api/booking",{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        
    }).then(response=>{
        if(response.ok){
            window.location.reload();
        }
        return response.json();
    }).then(data=>{
        console.log(data);
        console.log(userID);
    })
    
}

