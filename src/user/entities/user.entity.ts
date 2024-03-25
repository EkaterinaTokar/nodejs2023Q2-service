import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  password?: string;

  @Column({ default: 1 })
  version: number;

  @Column({ nullable: true, type: 'bigint' })
  createdAt: number | null;

  @Column({ nullable: true, type: 'bigint' })
  updatedAt: number | null;
}
