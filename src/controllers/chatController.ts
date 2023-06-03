import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  Res,
} from "@decorators/express";
import { Request, Response } from "express";
import Chat from "../entities/chat";
import { Equal } from "typeorm";

@Controller("/chats")
class ChatController {
  @Get("/")
  async getAllChats(@Req() req: Request, @Res() res: Response) {
    try {
      const chatList = await Chat.find();
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

  @Post("/")
  async createChat(@Req() req: Request, @Res() res: Response) {
    try {
      let newChat = new Chat();
      newChat.send = req.body.send;
      newChat.text = req.body.text;
      const createdChat = await Chat.save(newChat);
      res.json({ newChat: createdChat });
    } catch (error) {
      return res.status(422);
    }
  }

  @Put("/:id")
  async updateChat(@Req() req: Request, @Res() res: Response) {
    try {
      const foundChat = await Chat.findOne({
        where: { id: Equal(Number(req.params.id)) },
      });

      if (!foundChat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      Object.assign(foundChat, req.body);

      const updatedChat = await Chat.save(foundChat);

      res.json({ chat: updatedChat }).status(200);
    } catch (error) {
      return res.status(422);
    }
  }

  @Delete("/:id")
  async deleteChat(@Req() req: Request, @Res() res: Response) {
    try {
      const foundChat = await Chat.findOne({
        where: { id: Equal(Number(req.params.id)) },
      });
      if (!foundChat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      await foundChat.remove();
      res.json({ message: "Successfully deleted" }).status(200);
    } catch (error) {
      return res.status(422);
    }
  }
}
export default ChatController;
