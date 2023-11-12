import {ERoles} from "../enums/role.enum";

class RoleMiddleware {
    public async checkRole(role: ERoles) {

    }
}

export const roleMiddleware = new RoleMiddleware();