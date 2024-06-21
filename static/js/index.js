
    //mrts 
    let listLeft = document.querySelector("#left_img");
    let listRight = document.querySelector("#right_img");
    let listItem = document.querySelector(".list_item");
    let currentKeyword = '';
    
    // 向右滑動
    listRight.addEventListener("click", function() {
        let screenWidth = window.innerWidth;
        let scrollDistance;
        
        if (screenWidth <= 360) {
            scrollDistance = 150; 
        } else if (screenWidth <= 1200) {
            scrollDistance = 600; 
        } else {
            scrollDistance = 1000; 
        }
        listItem.scrollLeft += scrollDistance;
    });
    listLeft.addEventListener("click", function() {
        let screenWidth = window.innerWidth;
        let scrollDistance;
        
        if (screenWidth <= 360) {
            scrollDistance = 150; 
        } else if (screenWidth <= 1200) {
            scrollDistance = 600; 
        } else {
            scrollDistance = 1000; 
        }
        listItem.scrollLeft -= scrollDistance;
    });




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
    //localStorage.removeItem('token')
        

  

   






    //抓取input欄位
    let search = document.querySelector(".search_input")
    let input = document.querySelector(".search_img")
    input.addEventListener("click",function(){
            currentKeyword = search.value; 
            console.log(currentKeyword);
            attractions.innerHTML = ''; 
            fetchData(0, `${currentKeyword}`);
            
    })


    // attractions
    let attractions = document.querySelector(".attractions")
    let nextPage = null;
    let isLoading = false;

    fetchData();

    function fetchData(page=0,keyword=currentKeyword){
        if (isLoading || page == null) {
            if (page == null) {
                document.querySelector(".footer").style.display = "block";
            }
            return;
        }
    
        isLoading = true;
        

        fetch(`/api/attractions?page=${page}&keyword=${keyword}`,)
        .then(response => response.json())
        .then(data => {
            nextPage = data["nextPage"];
            renderAttractions(data["data"]);
            isLoading = false;
            document.querySelector(".footer").style.display = "none";
            
        
    });
    }

    /*渲染數據*/
    function renderAttractions(data){
        for(i=0;i<data.length;i++){
            image = data[i]["images"][0];
            imgname = data[i]["name"];
            mrt = data[i]["mrt"];
            cate =data[i]["category"];
            let attractionId = data[i]["id"];
            const group = document.createElement('div');
            group.className = 'attractions_group';
            group.id = attractionId;
            group.innerHTML = `
            <div class="attractions_group">
                <div class="attractions_img">
                    <img src="${image}" class="attractions_group_img">
                    <div class="attractions_name">
                        <div class="name">${imgname}</div>
                    </div>
                </div>
                <div  class="attractions_details">
                    
                    <div class="attractions_details_mrts">${mrt}</div>
                    <div class="attractions_details_category">${cate}</div>
                    
                </div>

            </div>
            `;
            attractions.appendChild(group);
            group.addEventListener('click', function() {
                window.location.href = window.location.href+'attraction/'+group.id;
                ;
            });
        }
    }
        
    //mrts
    fetch('/api/mrts')
    .then(response => response.json())
    .then(data => {
        let mrt = document.querySelector(".list_item")
        for(i=0;i<data["data"].length;i++){
            
            let div = document.createElement('div');
            div.className = 'item';
            div.textContent = data["data"][i];
            
            div.addEventListener('click', function() {
                currentKeyword = div.textContent ;
                search.value=`${currentKeyword}`
                attractions.innerHTML = ''; 
                fetchData(0,`${currentKeyword}`);
                
            });
            mrt.appendChild(div);
    }
    });

    //新增ccs按鈕
    function addPointer(elm){
        elm.addEventListener("mouseover", function() {
            elm.style.cursor = "pointer";
        });
        elm.addEventListener("mouseout", function() {
            elm.style.cursor = "auto";
        });

    }
    let searchButton = document.querySelector(".search_button")
    addPointer(searchButton);




    //螢幕滾動載入
    window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight ) {
            fetchData(nextPage,currentKeyword)
            
            }
        });

    

            



           



        
    
    
    
    