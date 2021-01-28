import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('user')
export class User {

    @PrimaryGeneratedColumn()
    id = undefined;

    @Column("varchar")
    firstname = "";

    @Column("varchar")
    lastname = "";

    @Column({ name: "email", unique: true, type: "varchar" })
    email = "";

    @Column({ type: "varchar", default: null })
    password = "";

    @Column("int", { nullable: true })
    role = "";

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt = null;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt = null;

    @Column({ type: "boolean", default: true, nullable: true })
    isEnabled = true;   

}