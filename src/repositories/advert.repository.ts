import { FilterQuery } from "mongoose";

import { Advert } from "../models/Advert.model";
import { IAdvert } from "../types/advert.type";

class AdvertRepository {
  public async getAll(): Promise<IAdvert[]> {
    return await Advert.find();
  }
  public async getOneByParams(params: FilterQuery<IAdvert>): Promise<IAdvert> {
    return await Advert.findOne(params);
  }

  public async findById(id: string): Promise<IAdvert> {
    return await Advert.findById(id);
  }

  public async createAdvert(dto: IAdvert, userId: string): Promise<IAdvert> {
    return await Advert.create({ ...dto, _userId: userId });
  }

  public async updateAdvert(
    advertId: string,
    dto: Partial<IAdvert>,
  ): Promise<IAdvert> {
    return await Advert.findByIdAndUpdate(advertId, dto, {
      returnDocument: "after",
    });
  }

  public async deleteAdvert(advertId: string): Promise<void> {
    await Advert.deleteOne({ _id: advertId });
  }
}

export const advertRepository = new AdvertRepository();
