import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import SendMailServices from '../services/SendMailServices';
import { resolve } from 'path';
import { AppError } from '../errors/AppError';
class SendEmailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;
    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({ email });

    if (!user) {
      throw new AppError('User does not exists!');
    }
    const survey = await surveysRepository.findOne({ id: survey_id });

    if (!survey) {
      throw new AppError('Survey does not exists!');
    }
    const surveyUser = await surveysUsersRepository.findOne({
      where: { user_id: user.id, value: null },
      relations: ['user', 'survey'],
    });

    let variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: '',
      link: `${process.env.URL_HOST}:${
        process.env.PORT || process.env.PORT_DEFAULT
      }${process.env.URL_MAIL_ROUTE}`,
    };

    const npsEmailPath = resolve(__dirname, '../views/emails/npsMail.hbs');

    if (surveyUser) {
      variables.id = surveyUser.id;
      const { mailUrl } = await SendMailServices.execute(
        email,
        survey.title,
        variables,
        npsEmailPath,
      );
      return response.status(200).json({ ...surveyUser, mailUrl });
    }

    const newSurveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id,
    });

    surveysUsersRepository.save(newSurveyUser);

    variables.id = newSurveyUser.id;

    const { mailUrl } = await SendMailServices.execute(
      email,
      survey.title,
      variables,
      npsEmailPath,
    );
    return response.status(201).json({ ...newSurveyUser, mailUrl });
  }
}

export { SendEmailController };
