import { Controller, Delete, Get, Post, Req, Res } from "@decorators/express";
import { Request, Response } from "express";
import ChatRoom from "../entities/chatRoom";
import { Equal } from "typeorm";
import passport from "passport";
import User from "../entities/user";
import Chat from "../entities/chat";

@Controller("/rooms")
class ChatRoomController {
  @Get("/")
  async getAllChatRooms(@Req() req: Request, @Res() res: Response) {
    try {
      const roomList = await ChatRoom.find();

      return res.json(roomList);
    } catch (error) {
      console.log(
        "🚀 ~ file: roomController.ts:30 ~ ChatRoomController ~ getAllChatRooms ~ error:",
        error
      );
      return res.status(500);
    }
  }

  @Post("/:id/chats")
  async createChat(@Req() req: Request, @Res() res: Response) {
    try {
      return passport.authenticate(
        "jwt",
        { session: false },
        async (err: any, user: any) => {
          if (err || !user) {
            return res.status(401).json({ message: "Authentication failed" });
          }

          const userId: any = {
            id: user.id,
          };
          const roomId: any = {
            id: Number(req.params.id),
          };

          const foundUser = await User.findOne({
            where: {
              id: user.id,
            },
            relations: ["chatRooms"],
          });

          let newChat = new Chat();
          newChat.text = req.body.text;
          newChat.user = userId;

          if (req.params.id) {
            newChat.room = roomId;
          } else {
            let newRoom = new ChatRoom();

            const room = await ChatRoom.save(newRoom);

            newChat.room = room.id as any;
          }

          foundUser?.chatRooms.push(newChat.room as any);

          await User.save(foundUser!);

          const createdChat = await Chat.save(newChat);

          return res.json({ newChat: createdChat });
        }
      )(req, res);
    } catch (error) {
      console.log(
        "🚀 ~ file: chatController.ts:102 ~ ChatController ~ createChat ~ error:",
        error
      );
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  @Post("/")
  async createChatRoom(@Req() req: Request, @Res() res: Response) {
    try {
      return passport.authenticate(
        "jwt",
        { session: false },
        async (err: any, user: any) => {
          if (err || !user) {
            return res.status(401).json({ message: "Authentication failed" });
          }

          const foundUser = await User.findOne({
            where: {
              id: user.id,
            },
            relations: ["chatRooms"],
          });
          const foundUserTwo = await User.findOne({
            where: {
              id: req.body.userTwoId,
            },
            relations: ["chatRooms"],
          });

          let newChatRoom = new ChatRoom();

          const createdChatRoom = await ChatRoom.save(newChatRoom);

          foundUser?.chatRooms.push(createdChatRoom);
          foundUserTwo?.chatRooms.push(createdChatRoom);

          await User.save(foundUser!);
          await User.save(foundUserTwo!);

          return res.json({ newChatRoom: createdChatRoom });
        }
      )(req, res);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
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

          const foundRoom = await ChatRoom.findOne({
            where: { id: Equal(Number(req.params.id)) },
          });

          if (!foundRoom) {
            return res.status(404).json({ message: "Room not found" });
          }

          const foundUser = await User.findOne({
            where: {
              id: user.id,
            },
            relations: ["chatRooms"],
          });

          const foundRoomIndex = foundUser?.chatRooms.findIndex(
            (room) => room.id === foundRoom.id
          );

          if (foundRoomIndex) {
            foundUser?.chatRooms.splice(foundRoomIndex, 1);
            await foundUser?.save();
            res
              .json({
                message: `Room has successfully deleted for user: ${
                  foundUser!.id
                }`,
              })
              .status(200);
          } else {
            res
              .json({
                message: `Please make sure that the user: ${
                  foundUser!.id
                } owns the room: ${foundRoom.id}`,
              })
              .status(404);
          }
        }
      )(req, res);
    } catch (error) {
      return res.status(422);
    }
  }
}
export default ChatRoomController;
