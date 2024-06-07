
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
            scrollDistance = 200; 
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
            scrollDistance = 200; 
        } else if (screenWidth <= 1200) {
            scrollDistance = 600; 
        } else {
            scrollDistance = 1000; 
        }
        listItem.scrollLeft -= scrollDistance;
    });










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
            document.querySelector(".footer").style.display = "block";
            return;
        }
    
        isLoading = true;
        

        fetch(`/api/attractions?page=${page}&keyword=${keyword}`)
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
            const group = document.createElement('div');
            group.className = 'attractions_group';
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


            



           



        
    
    
    
    