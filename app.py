from fastapi import *
from fastapi.responses import FileResponse
import  uvicorn
from pydantic import BaseModel
import mysql.connector
from typing import Optional
from fastapi.responses import JSONResponse

import config
app=FastAPI()


mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password= config.password,
  database='Taipei_Attraction'
)
mycursor = mydb.cursor()

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
        mycursor = mydb.cursor()

        # 執行查詢並根據 keyword 參數過濾數據
        if keyword:
                sql = "SELECT * FROM attractions WHERE name LIKE %s OR mrt = %s "
                params = (f"%{keyword}%", keyword)
                mycursor.execute(sql, params)
        else:
            mycursor.execute("SELECT * FROM attractions ")

        records = mycursor.fetchall()

        # 處理查詢結果
        data = []
        for record in records:
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
        
        #一頁取12筆
        
        if len(data)%12 == 0: 
            page_sixe = len(data)//12-1
            if page_sixe > page:
                    data_size = data[page*12:page*12+12]
                    next_page = page+1
            else:
                data_size = data[page*12:page*12+12]
                next_page = None  
        elif len(data)%12 != 0: 
            page_sixe = len(data)//12
            if page_sixe > page:
                data_size = data[page*12:page*12+12]
                next_page = page+1  
            else:
                data_size = data[page*12:page*12+12]
                next_page = None

    
        response_data = Response(nextPage=next_page, data=data_size)
        return JSONResponse(content=response_data.model_dump())
    
    except Exception as e:
        raise Exception(str(e))

#景點id api
@app.get("/api/attraction/{attractionId}",response_model=AttractionId )
async def attractionId(attractionId: int ):
    try:
        mycursor.execute('select * from attractions where id =%s', (attractionId,))
        records = mycursor.records = mycursor.fetchone() 
        
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




#捷運站

@app.get("/api/mrts")
async def get_mrts():
    try:
        mycursor.execute("SELECT mrt,count(*) FROM attractions group by  mrt order by count(*) desc ;")
        records = mycursor.fetchall()
        
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

if __name__ == '__main__':
    uvicorn.run(app="app:app", reload=True)