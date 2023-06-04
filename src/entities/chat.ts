import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import User from "./user";

@Entity()
class Chat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: Number;

  @Column()
  text: String;

  @Column()
  send: Boolean;

  @CreateDateColumn({ default: new Date() })
  cratedDate: Date;

  @UpdateDateColumn({ default: new Date() })
  updatedDate: Date;

  @ManyToOne(() => User, (user) => user.chats)
  user: User;

  formattedCreatedDate: String;

  @AfterLoad()
  setFormattedDate() {
    this.formattedCreatedDate = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Asia/Baghdad",
    }).format(this.cratedDate);
  }
}

export default Chat;
