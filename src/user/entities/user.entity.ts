import { Role } from "src/user/enum/role.enum";
import { Task } from "src/task/entities/task.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @OneToMany(type => Task, task => task.assignedTo)
    tasks: Task[];
}
