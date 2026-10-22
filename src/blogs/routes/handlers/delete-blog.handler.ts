import { RequestWithParams } from "../../../core/types/request_types";
import {  Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { BlogServices } from "../../application/blogs.servise";
import { errorsHandler } from "../../../core/exceptions/errors-handler";

export async function deleteBlogHandler (req: RequestWithParams<{id:string}>,
    res: Response){
   try{
           
        const isBlogDeleted = await BlogServices.deleteBlogService(req.params.id)
        res.sendStatus(HttpStatus.NoContent)
       }catch (e: unknown) {
               errorsHandler(e, res);
       }
}