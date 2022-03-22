import express, { Request, Response, Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFound";
import pokemonController from "./controllers/pokemonController";

// //Initial configuration
dotenv.config();
const app: Application = express();

const PORT: number = Number(process.env.PORT) || 5001;

// //Middleware
app.use(helmet()); //Helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
app.use(cors()); //enables cors
app.use(morgan("dev")); //logger for the request
app.use(express.json()); // parse and convert request body to JSON (for PUT/PATCH and POST method)
app.use(express.urlencoded({ extended: true })); // the same as express.json(), but, it also converts FORM-DATA to JSON

//SERVER
app.get("/", (req: Request, res: Response): void => {
  res.send("Hello World");
});

//CONTROLLERS
app.use("/api/pokemon", pokemonController);
app.use(errorHandler); //Error handling
app.use(notFoundHandler); //404

app.listen(PORT, (): void => {
  console.log(`Server Running here 👉 http://localhost:${PORT}`);
});
