//切換登入/註冊畫面

//導向註冊畫面
let login = document.querySelector("#login")
export const loginDialog=()=>{
    login.addEventListener("click",()=>{
        document.querySelector(".login_dialog_background").style.display= 'block';
    })
}






//關閉註冊彈跳視窗
export const CloseSignup=()=>{
    let CloseSignup = document.querySelector("#CloseSignup")
    CloseSignup.addEventListener("click",()=>{
        document.querySelector(".signup_dialog_background").style.display = 'none';
    })
}

//關閉登入彈跳視窗
export const CloseLogin=()=>{
    let CloseLogin = document.querySelector("#CloseLogin");
    CloseLogin.addEventListener("click",()=>{
        document.querySelector(".login_dialog_background").style.display = "none";
    })
}


let signupButton = document.querySelector('.signup_button')
let loginButton =document.querySelector(".login_button")

//換成註冊按鈕
export const changeSignup=()=>{
    signupButton.addEventListener("click",()=>{
    document.querySelector(".signup_dialog_background").style.display = 'block';
    document.querySelector(".login_dialog_background").style.display = " none";
    
})
}

//換成登入按鈕
export const changeLogin=()=>{
    loginButton.addEventListener("click",()=>{
        document.querySelector(".signup_dialog_background").style.display = 'none';
        document.querySelector(".login_dialog_background").style.display = " block";
    })
}

//註冊資料給後端
let signup= document.querySelector("#signupNew");
export const checkSignup=()=>{
    signup.addEventListener("click",async()=>{
        let name = document.getElementById("signupUname").value;
        let email = document.getElementById("signupEmail").value;
        let password = document.getElementById("signupPassword").value;
        let response = await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });
        let result = await response.json();
    
        //註冊成功清空資料
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
}
 
//會員登入給後端
let singin = document.querySelector("#singin");
export const signinCheck=()=>{
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
}


//確認token渲染畫面
let signout = document.querySelector('#signout');
export const fetchAuth=()=>{
    return fetch('/api/user/auth',{
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${token}`
        },
    })
}

export const getResponse=()=>{
    return fetchAuth().then(response=>{
        console.log(response);
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



let token = localStorage.getItem('token');
/*
export const checkToken=()=>{
    let token = localStorage.getItem('token');
    
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
}*/

//預定行程
let reservation = document.querySelector("#reservation");
export const bookTrip=()=>{
    reservation.addEventListener("click",()=>{
        let token = localStorage.getItem('token');
        if(!token){
            document.querySelector(".login_dialog_background").style.display= 'block'; 
        }else{
            window.location.href =window.location.href = "/booking"
        }
        
    })

}
