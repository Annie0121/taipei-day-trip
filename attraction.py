import json
import mysql.connector
import config
mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password=config.password,
)
mycursor = mydb.cursor()
mycursor.execute("CREATE DATABASE `Taipei_Attraction` ;")
mycursor.execute("USE `Taipei_Attraction` ;")
mycursor.execute(
"""CREATE TABLE attractions(  
            `id`  bigint primary key AUTO_INCREMENT  comment'Unique ID',  
            `name`  varchar(30) not null comment'Name',  
            `category` varchar(30) not null  comment'Attraction Category',  
            `description` varchar(4000)  comment'Description',  
            `address` varchar(100) not null  comment'Address',  
            `transport` varchar(800) comment'Transport',
            `mrt` varchar(30),
            `lat` float  not null ,
            `lng` float  not null,
            `images` TEXT);"""
            )



"""
"_id","name","CAT","description","address","direction","MRT","latitude","longitude","file"
      "name": "平安鐘",
      "category": "公共藝術",
      "description": "平安鐘祈求大家的平安，這是為了紀念 921 地震週年的設計",
      "address": "臺北市大安區忠孝東路 4 段 1 號",
      "transport": "公車：204、212、212直",
      "mrt": "忠孝復興",
      "lat": 25.04181,
      "lng": 121.544814,
      "images": [
        "http://140.112.3.4/images/92-0.jpg"
"""

with open("data/taipei-attractions.json",mode="r",encoding="utf-8") as file:
    data = json.load(file)["result"]["results"]
    
    for info in data:
        name = info["name"]
        category = info["CAT"]
        description = info["description"]
        address = info["address"].replace(" ","")
        transport = info["direction"]
        mrt = info["MRT"]
        lat = info["latitude"]
        lng = info["longitude"]
        images = []
        for url in info["file"].split("https"):
            if url.lower().endswith(("jpg", "png")):
                images.append(f"https{url}")
        images_str = ",".join(images)
        

        #資料insert 數據到table
        sql = """INSERT INTO attractions(name, category,description,address,transport,mrt,lat,lng,images) 
                 VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);"""
        val = (name, category,description,address,transport,mrt,lat,lng,images_str)
        mycursor.execute(sql, val)



   
        
        
mycursor.close()       
mydb.commit()        	
mydb.close()