import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { Request, Response } from 'express';
import { AppError } from "../errors/AppError";

class AnswerController{

  // http://localhost:3333/answers/1?id=b9ec7023-10c5-4db5-9e61-ac7043642dc6
  /**
    *
    Route Params => Parametros que compoe a rota
    router.get('/answer/:value')

    Query Params => Busca, Paginação, não obrigatórios
    ?
    chave=valor
   */
  async execute(request: Request, response: Response) {

    const { value } = request.params;
    const { id } = request.query;
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
    const surveyUser = await surveysUsersRepository.findOne({
      id: String(id)
    })
    if (!surveyUser) {
      throw new AppError("Survey User does not exists!");
    }
    surveyUser.value = Number(value);
    await surveysUsersRepository.save(surveyUser);
    return response.json(surveyUser)

  }
}

export {AnswerController}
