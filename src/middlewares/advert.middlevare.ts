import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/api.error";

class AdvertMiddleware {
    private censorWords: string[] = ["бля", "сука", "нахуй"]; // Добавьте нецензурные слова

    public Censorship(req: Request, res: Response, next: NextFunction) {
        try {
            const { title, description } = req.body;

            // Проверка цензуры в поле title
            if (this.containsCensoredWords(title)) {
                throw new ApiError("Не прошло проверку на цензуру в заголовке", 409);
            }

            // Проверка цензуры в поле description
            if (this.containsCensoredWords(description)) {
                throw new ApiError("Не прошло проверку на цензуру в описании", 409);
            }

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
