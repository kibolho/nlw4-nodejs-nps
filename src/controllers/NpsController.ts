import { getCustomRepository, IsNull, Not } from 'typeorm';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { Request, Response } from 'express';
import { AppError } from '../errors/AppError';

class NpsController {
  /**
   *
   * Cálculo de NPS
   * Detratores => 0 - 6
   * Passivos => 7 - 8
   * Promotores => 9 - 10
   * (Número de promotores - número de detratores) / (número de respondentes) x 100
   */

  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
    const surveyUser = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull()),
    });
    if (!surveyUser) {
      throw new AppError("Survey User does not exists!");
    }
    const detractor = surveyUser.filter(
      survey => survey.value >= 0 && survey.value <= 6,
    ).length;
    const promoters = surveyUser.filter(survey => survey.value >= 9).length;
    const passive = surveyUser.filter(
      survey => survey.value >= 7 && survey.value <= 8,
    ).length;
    const totalAnwers = surveyUser.length;
    const nps = Number((((promoters - detractor) / totalAnwers) * 100).toFixed(2));

    return response.json({
      detractor,
      promoters,
      passive,
      totalAnwers,
      nps,
    });
  }
}

export { NpsController };
