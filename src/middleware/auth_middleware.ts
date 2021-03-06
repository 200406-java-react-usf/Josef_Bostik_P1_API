//not yet used

import { Request, Response } from 'express';
import { AuthenticationError, AuthorizationError } from '../errors/errors';

export const adminGuard = (req: Request, resp: Response, next) => {

    if (!req.session.principal) {
        resp.status(401).json(new AuthenticationError('No session found! Please login.'));
    } else if (req.session.principal.role === 'Admin') {
        next();
    } else {
        resp.status(403).json(new AuthorizationError());
    }

};

export const managerGuard = (req: Request, resp: Response, next) => {

    if (!req.session.principal) {
        resp.status(401).json(new AuthenticationError('No session found! Please login.'));
    } else if (req.session.principal.role === 'Manager' || 'Admin') {
        next();
    } else {
        resp.status(403).json(new AuthorizationError());
    }

};

export const userGuard = (req: Request, resp: Response, next) => {

    if (!req.session.principal) {
        resp.status(401).json(new AuthenticationError('No session found! Please login.'));
    } else if (req.session.principal.role === 'User' || 'Manager' || 'Admin') {
        next();
    } else {
        resp.status(403).json(new AuthorizationError());
    }

};