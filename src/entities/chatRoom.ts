import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import Chat from "./chat";

@Entity()
class ChatRoom extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: Number;

  @CreateDateColumn({ default: new Date() })
  cratedDate: Date;

  @UpdateDateColumn({ default: new Date() })
  updatedDate: Date;

  @OneToMany(() => Chat, (chat) => chat.room)
  chats: Chat[];
}

export default ChatRoom;
