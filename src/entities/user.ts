import {
  Column,
  Entity,
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

import Chat from "./chat";

@Entity()
class User extends BaseEntity {
  [x: string]: any;
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: String;

  @Column()
  password: String;

  @Column()
  profileImg: String;

  @OneToMany(() => Chat, (chat) => chat.user, { cascade: true })
  chats: Chat[];

  @CreateDateColumn({ default: new Date() })
  cratedDate: Date;

  @UpdateDateColumn({ default: new Date() })
  updatedDate: Date;
}

export default User;
