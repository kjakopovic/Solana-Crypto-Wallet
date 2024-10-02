// src/services/SupportQuestionService

import SupportQuestionModel from "../models/SupportQuestionModel";
import logger from "../config/Logger";
import UserModel from "../models/UserModel";

const className = "SupportQuestionService";

class SupportQuestionService{

    async createSupportQuestion(publicKey: string, question: string): Promise<void>{
        logger.info("Called createSupportQuestion method", {className});

        try{
            const user = await UserModel.findUserByField("publicKey", publicKey);
            if(!user){
                throw new Error("User not found");
            }
            await SupportQuestionModel.createSupportQuestion(user.id, publicKey, question);
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
            return await SupportQuestionModel.fetchSupportQuestionByField(field, value);
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
