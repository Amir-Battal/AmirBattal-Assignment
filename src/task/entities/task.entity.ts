import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('task')
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: string;

    @Column()
    assignedTo: string;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;
}
