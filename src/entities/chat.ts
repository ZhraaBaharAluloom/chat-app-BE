import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

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
