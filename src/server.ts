// Architectural pattern: MVC = Model View Controller, Dependency Injection(DI), MVP


// Design pattern: Middleware, Decorator
import dotenv from 'dotenv'
dotenv.config();

console.log("Port:",process.env.PORT);
console.log("MONGO_URL:",process.env.PORT);
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URL as string, {}).then((data) => {
    console.log("MongoDB connection succeed");
    const PORT = process.env.PORT ?? 3003;
})
.catch(err => console.log("ERROR on connection MongoDB", err));
