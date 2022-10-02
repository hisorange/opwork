import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WorkerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  path: string;

  @Column('text')
  code: string;
}
