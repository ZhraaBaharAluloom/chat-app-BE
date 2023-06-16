import { Controller, Delete, Get, Put, Req, Res } from "@decorators/express";
import { Request, Response } from "express";
import Chat from "../entities/chat";
import { Equal } from "typeorm";
import passport from "passport";

@Controller("/chats")
class ChatController {
  @Get("/")
  async getAllChats(@Req() req: Request, @Res() res: Response) {
    try {
      const chatList = await Chat.createQueryBuilder("chat")
        .leftJoinAndSelect("chat.user", "user")
        .leftJoinAndSelect("chat.room", "room")
        .select([
          "chat.id",
          "chat.text",
          "user.id",
          "user.profileImg",
          "user.username",
          "room.id",
        ])
        .getMany();

      return res.json({ Chats: chatList });
    } catch (error) {
      return res.status(500);
    }
  }
  @Get("/:id")
  async getChat(@Req() req: Request, @Res() res: Response) {
    try {
      const foundChat = await Chat.findOne({
        where: { id: Equal(Number(req.params.id)) },
      });
      return res.json({ chat: foundChat });
    } catch (error) {
      return res.status(500);
    }
  }

  @Put("/:id")
  async updateChat(@Req() req: Request, @Res() res: Response) {
    try {
      return passport.authenticate(
        "jwt",
        { session: false },
        async (err: any, user: any) => {
          if (err || !user) {
            return res.status(401).json({ message: "Authentication failed" });
          }
          const foundChat = await Chat.findOne({
            where: { id: Equal(Number(req.params.id)) },
            relations: ["user"],
          });

          if (!foundChat) {
            return res.status(404).json({ message: "Chat not found" });
          }

          if (user.id === foundChat?.user.id) {
            Object.assign(foundChat, req.body);

            const updatedChat = await Chat.save(foundChat);

            res.json({ chat: updatedChat }).status(200);
          } else {
            res
              .json({
                message:
                  "Sorry, you don't have permission to update others messages",
              })
              .status(401);
          }
        }
      )(req, res);
    } catch (error) {
      return res.status(422);
    }
  }

  @Delete("/:id")
  async deleteChat(@Req() req: Request, @Res() res: Response) {
    try {
      return passport.authenticate(
        "jwt",
        { session: false },
        async (err: any, user: any) => {
          if (err || !user) {
            return res.status(401).json({ message: "Authentication failed" });
          }

          const foundChat = await Chat.findOne({
            where: { id: Equal(Number(req.params.id)) },
            relations: ["user"],
          });
          if (!foundChat) {
            return res.status(404).json({ message: "Chat not found" });
          }
          if (user.id === foundChat?.user.id) {
            await foundChat.remove();
            res.json({ message: "Successfully deleted" }).status(200);
          } else {
            res
              .json({
                message:
                  "Sorry, you don't have permission to delete others messages",
              })
              .status(401);
          }
        }
      )(req, res);
    } catch (error) {
      return res.status(422);
    }
  }
}
export default ChatController;
