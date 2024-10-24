import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsNumber, IsString } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @IsString()
    title;

    @IsString()
    description;

    @IsString()
    status;

    @IsNumber()
    assignedTo;
    
    updatedAt;
}
