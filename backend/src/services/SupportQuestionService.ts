// src/services/SupportQuestionService

import SupportQuestionModel from "../models/SupportQuestionModel";
import logger from "../config/Logger";
import UserModel from "../models/UserModel";

const className = "SupportQuestionService";

class SupportQuestionService{

    async createSupportQuestion(publicKey: string, title: string, description: string): Promise<void>{
        logger.info("Called createSupportQuestion method", {className});

        try{
            const user = await UserModel.findUserByField("publicKey", publicKey);
            if(!user){
                throw new Error("User not found");
            }
            await SupportQuestionModel.createSupportQuestion(user.id, title, description);
        }catch (err){
            logger.error('Error creating support question', { error: err, className });
            throw err;
        }
    }

    async answerSupportQuestion(questionId: number, answer: string): Promise<void>{
        logger.info("Called answerSupportQuestion method", {className});

        try{
            await SupportQuestionModel.answerSupportQuestion(questionId, answer);
        }catch (err){
            logger.error('Error answering support question', { error: err, className });
            throw err;
        }
    }

    async fetchSupportQuestionByField(field: string, value: string): Promise<any>{
        logger.info("Called getSupportQuestionByField method", {className});

        try{
            const responses = await SupportQuestionModel.fetchSupportQuestionByField(field, value);

            const result = await Promise.all(responses.map(async (response: any) => {
                const user = await UserModel.findUserByField("id", response.userId);
                if (!user) {
                    logger.error('User not found', { className });
                    throw new Error("User not found");
                }

                return {
                    title: response.title,
                    description: response.description,
                    answer: response.answer,
                    user: {
                        imageUrl: user.imageUrl
                    }
                };
            }));

            return result;
        }catch (err){
            logger.error('Error getting support question', { error: err, className });
            throw err;
        }
    }

    async fetchAllSupportQuestions(){
        logger.info("Called fetchAllSupportQuestions method", {className});

        try{
            return await SupportQuestionModel.fetchAllSupportQuestions();
        }catch (err){
            logger.error('Error fetching support questions', { error: err, className });
            throw err;
        }
    }

}

export default new SupportQuestionService();
