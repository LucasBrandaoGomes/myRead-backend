import dotenv from "dotenv";
import app from './app';

dotenv.config();

const PORT : number = Number(process.env.PORT)

console.log(`está rodando ${process.env.DATABASE_URL}`)

app.listen(PORT,() => {console.log(`Server runing on port ${PORT}`);});