import {Request, Response} from "express";
import {QueryResult} from "pg";
import {client} from "./database";
import format from "pg-format";

const createMovie = async (req: Request, res: Response): Promise<Response> => {
    const queryString: string = format(
        `
        INSERT INTO movies(%I)
        VALUES(%L)
        RETURNING *;
        `,
        Object.keys(req.body),
        Object.values(req.body)
    );

    const queryResult: QueryResult = await client.query(queryString);

    return res.status(201).json(queryResult.rows[0]);
};

const readMovies = async(req: Request, res:Response): Promise<Response> => {
    const queryStringCategory = `
        SELECT * FROM "movies"
        WHERE category = $1;
    `;

    const queryResultCategory: QueryResult = await client.query(
        queryStringCategory,
        [req.query.category]
    );

    if(queryResultCategory.rowCount > 0){
        return res.status(200).json(queryResultCategory.rows);
    }

    const queryStringAll: string = `SELECT * from "movies"`;
    const queryResultAll: QueryResult = await client.query(queryStringAll);

    return res.status(200).json(queryResultAll.rows);
}

const retrieveMovie = async(req: Request, res: Response): Promise<Response> => {
    const {foundMovie} = res.locals;

    return res.status(200).json(foundMovie);
}

const updateMovie = async(req: Request, res:Response): Promise<Response> => {
    const queryFormat: string = format(
        `UPDATE "movies" SET (%I) = ROW(%L) WHERE "id" = $1 RETURNING *;`,
        Object.keys(req.body),
        Object.values(req.body)
    );

    const queryResult: QueryResult = await client.query(queryFormat, [req.params.id]);

    return res.status(200).json(queryResult.rows[0]);
}

const deleteMovie = async(req: Request, res:Response): Promise<Response> => {
    await client.query('DELETE FROM "movies" WHERE "id" = $1', [req.params.id])
    return res.status(204).json();
};

export default {createMovie, readMovies, retrieveMovie, updateMovie, deleteMovie};