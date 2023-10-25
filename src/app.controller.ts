import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";

@Controller()
export class AppController {
    @Get()
    root(@Res() res: Response) {
        res.send("<h1>Hello World!</h1>");
    }
}
