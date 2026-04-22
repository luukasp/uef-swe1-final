import express from "express";

declare global {
    namespace Express {
        export interface Request {
            session?: any;
        }
    }
}

export interface Request extends express.Request {
    session?: any;
}

export {}