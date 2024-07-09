import{loginDialog,CloseSignup,CloseLogin,changeSignup,changeLogin,checkSignup,signinCheck,bookTrip}from './event.js';
loginDialog();
CloseSignup();
CloseLogin();
changeSignup();
changeLogin();
checkSignup();
signinCheck();

bookTrip();
let loading = document.querySelector(".loading_background");
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






loading.style.display = "block"

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
        
        localStorage.setItem('bookingData', JSON.stringify(data));
    } 
})
.finally(() => {
    loading.style.display = "none";
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
        
    })
    
}


//傳送刷卡資料資料


let  orderNumber = null



TPDirect.setupSDK(151738, 'app_zG069W5qdxfXHoRCvnxVpPYq5WHMxvKhLn4LM3eUDI38ACgxrQ2KJLAcl2UR', 'sandbox')

TPDirect.card.setup({
    fields: {
        number: {
            element: '.booking_payment_name_input.card-number',
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            element: document.getElementById('tappay-expiration-date'),
            placeholder: 'MM / YY'
        },
        ccv: {
            element: $('.booking_payment_name_input.ccv')[0],
            placeholder: 'CCV'
        }
    },
    styles: {
        'input': {
            'color': 'gray'
        },
        'input.ccv': {
            // 'font-size': '16px'
        },
        ':focus': {
            'color': 'black'
        },
        '.valid': {
            'color': 'green'
        },
        '.invalid': {
            'color': 'red'
        },
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    },
    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6, 
        endIndex: 11
    }
})



TPDirect.card.onUpdate(function (update) {
    
    if (update.canGetPrime) {
       
        $('button[type="submit"]').removeAttr('disabled')
    } else {
       
        $('button[type="submit"]').attr('disabled', true)
    }

    // number 欄位是錯誤的
    if (update.status.number === 2) {
        setNumberFormGroupToError('.card-number-group')
    } else if (update.status.number === 0) {
        setNumberFormGroupToSuccess('.card-number-group')
    } else {
        setNumberFormGroupToNormal('.card-number-group')
    }

    if (update.status.expiry === 2) {
        setNumberFormGroupToError('.expiration-date-group')
    } else if (update.status.expiry === 0) {
        setNumberFormGroupToSuccess('.expiration-date-group')
    } else {
        setNumberFormGroupToNormal('.expiration-date-group')
    }

    if (update.status.ccv === 2) {
        setNumberFormGroupToError('.ccv-group')
    } else if (update.status.ccv === 0) {
        setNumberFormGroupToSuccess('.ccv-group')
    } else {
        setNumberFormGroupToNormal('.ccv-group')
    }
})


document.getElementById('submit').addEventListener('click', function(event) {
    event.preventDefault();
    let bookingData = JSON.parse(localStorage.getItem('bookingData'));
    let phone = document.querySelector("#phone").value
    let name =document.querySelector("#bookingName").value
    let email =document.querySelector("#bookingEmail").value
    
    if(!phone){
        alert("請輸入完整資料")
        

    }else{
        TPDirect.card.getPrime(async function(result) {
            if (result.status !== 0) {
                alert('get prime error ' + result.msg);
                return;
            }
            
            const data = {
                prime: result.card.prime,
                order:{
                    price:bookingData["data"]["price"],
                    trip:{
                    attraction:bookingData["data"]["attraction"],
                    date:bookingData["data"]["date"],
                    time:bookingData["data"]["time"]
                    },
                    contact:{
                        name: name,
                        email: email,
                        phone: phone
                    }
                    
                }
                
                
            };
            

            try {
                
                loading.style.display = "block"
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,

                    },
                    body: JSON.stringify(data)
                });

                const responseData = await response.json();
               
                
                if(responseData["data"]["payment"]["status"] == 0){
                  
                    orderNumber = responseData["data"]["number"]
                    window.location.href = `/thankyou?number=${orderNumber}`;
                }else{
                    location.reload()
                }
                
                
                
            } catch (error) {
                console.error('Error:', error);
            }finally{
                loading.style.display = "none"
            }
        });
    }

   
   
});


function setNumberFormGroupToError(selector) {
    $(selector).addClass('has-error')
    $(selector).removeClass('has-success')
}

function setNumberFormGroupToSuccess(selector) {
    $(selector).removeClass('has-error')
    $(selector).addClass('has-success')
}

function setNumberFormGroupToNormal(selector) {
    $(selector).removeClass('has-error')
    $(selector).removeClass('has-success')
}


