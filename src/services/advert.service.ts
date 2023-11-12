import {UploadedFile} from "express-fileupload";

import {ApiError} from "../errors/api.error";
import {advertRepository} from "../repositories/advert.repository";
import {IAdvert} from "../types/advert.type";
import {s3Service} from "./s3.service";
import {EFileTypes} from "../types/file.type";

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

  public async uploadPhoto(photo: UploadedFile, advertId: string): Promise<IAdvert> {
    const advert = await advertRepository.findById(advertId);

    const filePath = await s3Service.uploadFile(photo, EFileTypes.Car, advertId);

    const updatedAdvert = await advertRepository.updateAdvert(advertId, {photo: filePath})

    return updatedAdvert;
  }

  private async checkAbilityToManage(
    userId: string,
    manageAdvertId: string,
  ): Promise<IAdvert> {
    const advert = await advertRepository.getOneByParams({
      _userId: userId,
      _id: manageAdvertId,
    });
    if (!advert) {
      throw new ApiError("U can not manage this advert", 403);
    }
    return advert;
  }
}

export const advertService = new AdvertService();
