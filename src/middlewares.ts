import {Request, Response, NextFunction} from "express";
import {QueryResult} from "pg";
import { client } from "./database";

const verifyId = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    const queryString: string = `
        SELECT * FROM movies
        WHERE id = $1;
    `;

    const queryResult: QueryResult = await client.query(queryString, [req.params.id]);

    if(queryResult.rowCount === 0){
        return res.status(404).json({message: "Movie not found!"});
    }

    res.locals = {...res.locals, foundMovie: queryResult.rows[0]};

    return next();
}

const verifyName = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    const queryString: string = `
        SELECT * from "movies"
        WHERE name = $1;
    `;

    const queryResult: QueryResult = await client.query(queryString, [req.body.name]);

    if(queryResult.rowCount>0){
        return res.status(409).json({message: "Name already exists"});
    }

    return next();
};

export default {verifyId, verifyName};