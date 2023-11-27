import { NextFunction, Request, Response } from "express";
import { access, appendFile, constants } from "fs/promises";

import { EBrand } from "../enums/brand.enum";
import { EModel } from "../enums/model.enum";
import { EUserStatus } from "../enums/user-status.enum";
import { ApiError } from "../errors/api.error";
import { advertRepository } from "../repositories/advert.repository";
import { userRepository } from "../repositories/user.repository";

class AdvertMiddleware {
  constructor() {
    this.censorship = this.censorship.bind(this);
  }
  private censorWords: string[] = ["бля", "сука", "нахуй"];

  public async existingCars(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.res.locals.tokenPayload;

      const user = await userRepository.findById(userId);

      if (!user) {
        throw new Error("Пользователь не найден");
      }

      if (user.status === EUserStatus.base && user.Ads === 1) {
        throw new Error(
          "Только пользователи с премиум-статусом могут создавать неограниченное количество объявлений.",
        );
      }

      next();
    } catch (e) {
      next(e);
    }
  }

  public async checkStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.res.locals.tokenPayload;

      const user = await userRepository.findById(userId);

      if (!user) {
        throw new Error("Пользователь не найден");
      }

      if (user.status === EUserStatus.base) {
        throw new Error(
          "Только пользователи с премиум-статусом меют доступ к статистике.",
        );
      }

      next();
    } catch (e) {
      next(e);
    }
  }
  public async censorship(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description } = req.body;

      if (this.containsCensoredWords(title)) {
        throw new ApiError("Не прошло проверку на цензуру в заголовке", 409);
      }

      if (this.containsCensoredWords(description)) {
        throw new ApiError("Не прошло проверку на цензуру в описании", 409);
      }

      next();
    } catch (e) {
      next(e);
    }
  }

  public async checkModel(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { model } = req.body;
      const modelValues = Object.values(EModel) as string[];

      if (!modelValues.includes(model)) {
        const errorMessage = {
          error: "такой модели нет в перечне",
          message: ` '${model}' отсутствует в нашем перечне.
           Админ будет уведомлен и добавит в ближайшем времени. Please choose from: ${modelValues.join(
             ", ",
           )}`,
        };

        const jsonErrorMessage = JSON.stringify(errorMessage, null, 2);

        try {
          await access("lettersFopAdmin.json", constants.F_OK);
        } catch (fileNotFoundError) {
          // Если файла нет, создаем его
          await appendFile("lettersFopAdmin.json", "");
        }

        try {
          await appendFile("lettersFopAdmin.json", `${jsonErrorMessage}\n`);
        } catch (error) {
          console.error("Error appending error to file:", error);
        }

        const apiError = new ApiError(
          `Invalid car model ${errorMessage.message}`,
          400,
        );
        return next(apiError);
      }

      return next();
    } catch (e) {
      next(e);
    }
  }
  public async checkBrand(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { brand } = req.body;
      const brandValues = Object.values(EBrand) as string[];

      if (!brandValues.includes(brand)) {
        const errorMessage = {
          error: "такой марки нет в перечне",
          message: `марка '${brand}' отсутствует в нашем перечне, Админ будет уведомлен и добавит 
          в ближайшее время. Please choose from: ${brandValues.join(", ")}`,
        };

        const jsonErrorMessage = JSON.stringify(errorMessage, null, 2);

        try {
          await access("lettersFopAdmin.json", constants.F_OK);
        } catch (fileNotFoundError) {
          // Если файла нет, создаем его
          await appendFile("lettersFopAdmin.json", "");
        }

        try {
          await appendFile("lettersFopAdmin.json", `${jsonErrorMessage}\n`);
        } catch (error) {
          console.error("Error appending error to file:", error);
        }

        const apiError = new ApiError(
          `Invalid car model ${errorMessage.message}`,
          400,
        );
        return next(apiError);
      }

      return next();
    } catch (e) {
      next(e);
    }
  }

  public async getByIdOrThrow(req: Request, res: Response, next: NextFunction) {
    try {
      const { advertId } = req.params;

      const advert = await advertRepository.findById(advertId);
      if (!advert) {
        throw new ApiError("Advert not found", 404);
      }

      req.res.locals = advert;

      next();
    } catch (e) {
      next(e);
    }
  }

  private containsCensoredWords(text: string | undefined): boolean {
    if (!text) {
      return false;
    }

    const lowerCaseText = text.toLowerCase();
    return this.censorWords.some((word) => lowerCaseText.includes(word));
  }
}

export const advertMiddleware = new AdvertMiddleware();
