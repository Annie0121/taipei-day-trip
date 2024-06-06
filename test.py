import mysql.connector
from mysql.connector import pooling
import config
# 定義數據庫連接信息
dbconfig = {
    "host": "localhost",
    "user": "root",
    "password": config.password,
    "database": 'Taipei_Attraction'
}

# 創建連接池
connection_pool = pooling.MySQLConnectionPool(pool_name="mypool",
                                                pool_size=5,
                                                **dbconfig)

# 從連接池中獲取連接
def get_connection():
    return connection_pool.get_connection()

# 定義一個函數來執行查詢
def query_with_pool():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM attractions")
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return result

# 使用連接池執行查詢
result = query_with_pool()
print(result)
