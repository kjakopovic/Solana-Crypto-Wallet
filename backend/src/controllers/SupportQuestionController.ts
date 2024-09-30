// src/controllers/SupportQuestionController

import { Request, Response} from "express";
import logger from "../config/Logger";
import SupportQuestionService from "../services/SupportQuestionService";

const className = "SupportQuestionController";

class SupportQuestionController{

    async createSupportQuestion(req: Request, res: Response): Promise<Response>{
        logger.info("Creating a new support question", {className});
        const { publicKey, question } = req.body;

        if(!publicKey || !question){
            logger.error("Invalid input, publicKey or question is missing", {className});
            return res.status(400).json({message: "Invalid input, publicKey or question is missing"});
        }

        try{
            await SupportQuestionService.createSupportQuestion(publicKey, question);
            logger.info("Support question created successfully", {className});
            return res.status(201).json({message: "Support question created successfully"});
        }catch (error){
            logger.error({message: "Error creating support question", error, className});
            return res.status(500).json({message: "Error creating support question"});
        }
    }

    async answerSupportQuestion(req: Request, res: Response): Promise<Response>{
        logger.info("Answering a support question", {className});
        const { questionId, answer } = req.body;

        if(!questionId || !answer){
            logger.error("Invalid input, questionId or answer is missing", {className});
            return res.status(400).json({message: "Invalid input, questionId or answer is missing"});
        }

        try{
            await SupportQuestionService.answerSupportQuestion(questionId, answer);
            logger.info("Support question answered successfully", {className});
            return res.status(200).json({message: "Support question answered successfully"});
        }catch (error){
            logger.error({message: "Error answering support question", error, className});
            return res.status(500).json({message: "Error answering support question"});
        }
    }

    async fetchSupportQuestionByField(req: Request, res: Response): Promise<Response>{
        logger.info("Fetching a support question by field", {className});
        const { field, value } = req.body;

        if(!field || !value){
            logger.error("Invalid input, field or value is missing", {className});
            return res.status(400).json({message: "Invalid input, field or value is missing"});
        }

        try{
            const supportQuestion = await SupportQuestionService.fetchSupportQuestionByField(field, value);
            logger.info("Support question fetched successfully", {className});
            return res.status(200).json({supportQuestion});
        }catch (error){
            logger.error({message: "Error fetching support question", error, className});
            return res.status(500).json({message: "Error fetching support question"});
        }
    }

    async fetchAllSupportQuestions(req: Request, res: Response): Promise<Response>{
        logger.info("Fetching all support questions", {className});

        try{
            const supportQuestions = await SupportQuestionService.fetchAllSupportQuestions();
            logger.info("Support questions fetched successfully", {className});
            return res.status(200).json({supportQuestions});
        }catch (error){
            logger.error({message: "Error fetching support questions", error, className});
            return res.status(500).json({
                message: "Error fetching support questions"});
        }
    }

}

export default new SupportQuestionController();