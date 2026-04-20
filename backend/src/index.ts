import dotenv from "dotenv";
dotenv.config();
import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import v1 from "./routes/v1.router";
import {auth} from "./lib/auth";
import {toNodeHandler} from "better-auth/node";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
    origin: process.env.FRONTEND_URL, // Replace with your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(helmet());

app.use('/api/v1', v1);

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.all('/{*splat}', async (req: Request, res: Response) => {
    res.status(404).send({
        message: "The route or resource you were looking for does not exist or could not be found",
        time: new Date().toISOString(),
        status: 'not_found',
    });
});

app.listen(process.env.PORT || 3306, () => {
    console.error(`Fuck you. It's alive`);
});