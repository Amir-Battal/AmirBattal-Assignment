import { User } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @ManyToMany(() => User, user => user.tasks)
    @JoinTable()
    assignedTo: User[];

    @CreateDateColumn({ type: "timestamp without time zone", default: () => "CURRENT_TIMESTAMP" })
    createdAt: string;

    @UpdateDateColumn({ type: "timestamp without time zone", onUpdate: "CURRENT_TIMESTAMP", nullable: true })
    updatedAt: string;
}
