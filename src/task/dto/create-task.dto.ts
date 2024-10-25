import { IsNumber, IsString } from "class-validator";

export class CreateTaskDto {
    @IsString()
    title;

    @IsString()
    description;

    @IsString()
    status;

    @IsNumber()
    assignedTo;
}
