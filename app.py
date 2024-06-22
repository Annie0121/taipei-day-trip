from fastapi import *
from fastapi.responses import FileResponse
import  uvicorn
from pydantic import BaseModel
import mysql.connector
from typing import Optional
from fastapi.responses import JSONResponse
from mysql.connector import pooling
import config
from fastapi.staticfiles import StaticFiles

import jwt
from fastapi.security import OAuth2PasswordBearer
from jwt import PyJWTError





app=FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
dbconfig = {
    "database": 'Taipei_Attraction',
    "user": "root",
    "password": config.password,
    "host": "localhost"
}
cnxpool = pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=20,  
    **dbconfig
)
def get_connection():
    return cnxpool.get_connection()








class Attraction(BaseModel):
	id : int
	name : str
	category: str
	description:str
	address : str
	transport: str
	mrt: Optional[str]
	lat: float
	lng: float
	images: list[str]

class Response(BaseModel):
    data: list[Attraction]
    nextPage:Optional[int]

class AttractionId(BaseModel):
    data :Attraction

class AttractionIdException(Exception):
    def __init__(self, message: str):
        self.message = message



#註冊模組
class User(BaseModel):
    name: str
    email: str
    password: str

#登入模組
class Member(BaseModel):
    email: str
    password: str

#定義JWT常數
SECRET_KEY = "hkjHUEHFUIWorhjgi45645"
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

#創建JWT函數
def create_access_token(data: dict):
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

#前端訊息處理
def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except PyJWTError:
        return None
    


@app.exception_handler(Exception)
async def exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
             "error": True, 
             "message": str(exc)
            }
    )

@app.exception_handler(AttractionIdException)
async def attraction_id_exception_handler(request: Request, exc: AttractionIdException):
    return JSONResponse(
        status_code=400,
        content={"error": True, "message": exc.message}
    )



# Static Pages (Never Modify Code in this Block)
@app.get("/", include_in_schema=False)
async def index(request: Request):
	return FileResponse("./static/index.html", media_type="text/html")
@app.get("/attraction/{id}", include_in_schema=False)
async def attraction(request: Request, id: int):
	return FileResponse("./static/attraction.html", media_type="text/html")
@app.get("/booking", include_in_schema=False)
async def booking(request: Request):
	return FileResponse("./static/booking.html", media_type="text/html")
@app.get("/thankyou", include_in_schema=False)
async def thankyou(request: Request):
	return FileResponse("./static/thankyou.html", media_type="text/html")

#keyword API
@app.get("/api/attractions", response_model=Response)
async def get_attractions(page: int = Query(0, ge=0), keyword: Optional[str] = None):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        # mycursor = mydb.cursor()
        offset = page * 12
        # 執行查詢並根據 keyword 參數過濾數據
        if keyword:
                sql = "SELECT * FROM attractions WHERE name LIKE %s OR mrt = %s  LIMIT %s,13; "
                params = (f"%{keyword}%", keyword , offset)
                cursor.execute(sql, params)
        else:
            sql="SELECT * FROM attractions LIMIT %s,13; "
            params = (offset,)
            cursor.execute(sql, params)

        records = cursor.fetchall()

        # 處理查詢結果
        data = []
        for record in records[:12]:
            attraction_dict = {
                "id": record[0],
                "name": record[1],
                "category": record[2],
                "description": record[3],
                "address": record[4],
                "transport": record[5],
                "mrt": record[6],
                "lat": record[7],
                "lng": record[8],
                "images": record[9].split(",")  # 假設圖片用逗號分隔存儲
            }
            data.append(Attraction(**attraction_dict))
        
        
        
        if len(records) > 12:
            next_page = page + 1
        else:
            next_page = None
    
        response_data = Response(nextPage=next_page, data=data)
        return JSONResponse(content=response_data.model_dump())
    
    except Exception as e:
        raise Exception(str(e))
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

#景點id api
@app.get("/api/attraction/{attractionId}",response_model=AttractionId )
async def attractionId(attractionId: int ):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute('select * from attractions where id =%s', (attractionId,))
        records = cursor.fetchone()
        
        if not records:
            raise AttractionIdException("景點編號不正確")

        attraction_dict = {
                "id": records[0],
                "name": records[1],
                "category": records[2],
                "description": records[3],
                "address": records[4],
                "transport": records[5],
                "mrt": records[6],
                "lat": records[7],
                "lng": records[8],
                "images":records[9].split(",")   
            }
        data = Attraction(**attraction_dict)
        response_data = AttractionId(data=data)
        return JSONResponse(content=response_data.model_dump())   
    except AttractionIdException as e:
        raise e  # 確保自訂的 AttractionIdException 被捕捉並處理
    except Exception as e:
        raise Exception(str(e))
    
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


#捷運站

@app.get("/api/mrts")
async def get_mrts():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT mrt,count(*) FROM attractions group by  mrt order by count(*) desc ;")
        records = cursor.fetchall()
        
        mrts=[]
        for data in records:
                if data[0] is not None:  # 檢查是否為 None
                    mrts.append(data[0])
        mrts_data={
            "data":mrts
        }
        return JSONResponse(content=mrts_data)
        
    except Exception as e:
        raise Exception(str(e))     
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()  



#註冊會員

@app.post("/api/user")
async def signup(user: User):
    if not user.name or not user.email or not user.password:
        return JSONResponse(content={"error": True, "message": "請輸入完整資料"})
    try:
        
        conn = get_connection()
        cursor = conn.cursor()
        sql = "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)"
        params = (user.name, user.email, user.password)
        check_sql = "SELECT email FROM users WHERE email = %s"
        cursor.execute(check_sql, (user.email,))
        records = cursor.fetchall()
        
        if records:
            return JSONResponse(content={"error":True,"message": "Email 已註冊"})
        cursor.execute(sql, params)
        conn.commit()
        
        return JSONResponse(content={"ok":True})
    
    except Exception as e:
        raise Exception(str(e))
    
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


#驗證前端token
@app.get("/api/user/auth")
async def check_user(user: str = Depends(verify_token)):
    return {"data": user}
    
    
    




#登入會員
@app.put("/api/user/auth")
async def signin(user:Member):
    try:
        print(f"Received user:  {user.email}, {user.password}")
        conn = get_connection()
        cursor = conn.cursor()
        sql = "SELECT id,email,password from users WHERE  email = %s and password = %s;"
        params = ( user.email, user.password)
        cursor.execute(sql, params)
        records = cursor.fetchone()
        if records:
            access_token = create_access_token(
                data={
                    
                    "id": records[0],
                    "email": records[1],
                    "password": records[2],
                    
                }
            )
            return {"token": access_token}
        else:
            return {
                "error": True,
                "message": "信箱或密碼錯誤"
            }
    except Exception as e:
        raise Exception(str(e))
    
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()



if __name__ == '__main__':
    uvicorn.run(app="app:app", reload=True)