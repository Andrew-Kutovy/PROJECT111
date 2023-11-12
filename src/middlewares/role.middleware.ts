import {ERoles} from "../enums/role.enum";
import {Request, Response, NextFunction} from "express";
import {ApiError} from "../errors/api.error";

class RoleMiddleware {
    public async isSeller(req: Request, res: Response, next: NextFunction) {
        try {
            const { role } = req.body;

            if (role === 'buyer') {
                throw new ApiError("Access denied, must be SELLER or higher", 409);
            }

            next();
        } catch (e) {
            next(e);
        }
    }
    public async isManager(req: Request, res: Response, next: NextFunction) {
        try {
            const { role } = req.body;

            if (role !== ERoles.manager) {
                throw new ApiError("Access denied, must be MANAGER", 409);
            }

            next();
        } catch (e) {
            next(e);
        }
    }
    public async isAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const { role } = req.body;

            if (role !== ERoles.admin) {
                throw new ApiError("role must be Admin", 409);
            }

            next();
        } catch (e) {
            next(e);
        }
    }
}

export const roleMiddleware = new RoleMiddleware();