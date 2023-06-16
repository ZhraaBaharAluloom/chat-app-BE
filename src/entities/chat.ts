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
import ChatRoom from "./chatRoom";

@Entity()
class Chat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: Number;

  @Column()
  text: String;

  @CreateDateColumn()
  cratedDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToOne(() => User, (user) => user.chats)
  user: User;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.chats)
  room: ChatRoom;

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
