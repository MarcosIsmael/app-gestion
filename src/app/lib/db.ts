// /lib/db.ts
import mysql from 'mysql2/promise';

const connectToDatabase = async () => {
  return await mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "123456",
    database: "app-ventas-db",
  });
};

export default connectToDatabase;
