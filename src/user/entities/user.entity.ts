import { Task } from "../../task/entities/task.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../../enum/role.enum";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({
        type: "enum",
        enum: Role,
        default: Role.User
    })
    role: Role;

    @ManyToMany(() => Task, task => task.assignedTo)
    tasks: Task[];
}
