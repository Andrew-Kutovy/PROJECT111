import { UploadedFile } from "express-fileupload";

import { ERoles } from "../enums/role.enum";
import { ApiError } from "../errors/api.error";
import { User } from "../models/User.model";
import { advertRepository } from "../repositories/advert.repository";
import { IAdvert } from "../types/advert.type";
import { EFileTypes } from "../types/file.type";
import { s3Service } from "./s3.service";

class AdvertService {
  public async getAll(): Promise<IAdvert[]> {
    return await advertRepository.getAll();
  }

  public async createAdvert(dto: IAdvert, userId: string): Promise<IAdvert> {
    return await advertRepository.createAdvert(dto, userId);
  }

  public async updateAdvert(
    advertId: string,
    dto: Partial<IAdvert>,
    userId: string,
  ): Promise<IAdvert> {
    await this.checkAbilityToManage(userId, advertId);
    return await advertRepository.updateAdvert(advertId, dto);
  }

  public async deleteAdvert(advertId: string, userId: string): Promise<void> {
    await this.checkAbilityToManage(userId, advertId);
    await advertRepository.deleteAdvert(advertId);
  }

  public async uploadPhoto(
    photo: UploadedFile,
    advertId: string,
  ): Promise<IAdvert> {
    const filePath = await s3Service.uploadFile(
      photo,
      EFileTypes.Car,
      advertId,
    );

    const updatedAdvert = await advertRepository.updateAdvert(advertId, {
      photo: filePath,
    });

    return updatedAdvert;
  }

  private async checkAbilityToManage(
    userId: string,
    manageAdvertId: string,
  ): Promise<IAdvert> {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new ApiError("User not found", 404);
      }

      const userRole = user.role;

      const allowedRoles: ERoles[] = [ERoles.admin, ERoles.manager];

      const advert = await advertRepository.getOneByParams({
        _userId: userId,
        _id: manageAdvertId,
      });

      if (!advert && !allowedRoles.includes(userRole)) {
        throw new ApiError("You cannot manage this advert", 403);
      }

      return advert;
    } catch (error) {
      throw new ApiError("Error checking ability to manage", 500);
    }
  }
}

export const advertService = new AdvertService();
