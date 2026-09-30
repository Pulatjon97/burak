// Architectural pattern: MVC = Model View Controller, Dependency Injection(DI), MVP


// Design pattern: Middleware, Decorator
import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";
import app from "./app";
mongoose.set("strictQuery", false);

console.log("Port:",process.env.PORT);
// OLD: console.log("MONGO_URL:",process.env.PORT);
console.log("MONGO_URL is set:", Boolean(process.env.MONGO_URL)); // NEW: prints true/false, not the secret

mongoose.connect(process.env.MONGO_URL as string, {}).then((data) => {
    console.log("MongoDB connection succeed");
    // NEW: shows which database you are actually connected to
    console.log("Database name:", mongoose.connection.name);
    const PORT = process.env.PORT ?? 3003;
    app.listen(PORT, function(){
        console.log(`The server is running successfully on port: ${PORT}`)
    })
})
.catch(err => console.log("ERROR on connection MongoDB", err));