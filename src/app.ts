import "dotenv/config";
import express, {Application} from "express";
import {startDatabase} from "./database";
import logics from "./logics";
import middlewares from "./middlewares";

const app: Application = express();
app.use(express.json());

app.post("/movies", middlewares.verifyName, logics.createMovie);

app.get("/movies", logics.readMovies);

app.get("/movies/:id", middlewares.verifyId, logics.retrieveMovie)

app.patch("/movies/:id", middlewares.verifyId, middlewares.verifyName, logics.updateMovie);

app.delete("/movies/:id", middlewares.verifyId, logics.deleteMovie);

const PORT: number = 3000;
app.listen(PORT, async(): Promise<void> => {
    await startDatabase();
    console.log(`App is running on port ${PORT}`);
})
