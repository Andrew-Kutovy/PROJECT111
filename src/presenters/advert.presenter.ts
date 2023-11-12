import {IAdvert} from "../types/advert.type";
import {ECurrency} from "../enums/currency.enum";
import {configs} from "../configs/configs";

interface IPresenter<I, O> {
    present(payload: I): O;
}
class AdvertPresenter implements IPresenter<IAdvert, Partial<IAdvert>>{
    present(data: IAdvert): Partial<IAdvert> {
        return {
            _id: data._id,
            title: data.title,
            description: data.description,
            price: data.price,
            currency: data.currency,
            region: data.region,
            brand: data.brand,
            model: data.model,
            priceInEUR: data.priceInEUR,
            priceInUSD: data.priceInUSD,
            priceInUAH: data.priceInUAH,
            convertedPrice: data.convertedPrice,
            exchangeRate: data.exchangeRate,
            lastPriceUpdate: data.lastPriceUpdate,
            photo: `${configs.AWS_S3_URL}${data.photo}`,
        }
    }
}
export const advertPresenter = new AdvertPresenter();