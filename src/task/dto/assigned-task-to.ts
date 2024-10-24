import { IsNumber } from "class-validator";

export class AssignedTaskTo {
    @IsNumber()
    taskId;

    @IsNumber()
    to;
}