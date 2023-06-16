import { Controller, Get, Post, Req, Res } from "@decorators/express";
import { Request, Response } from "express";
import User from "../entities/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { keys } from "../config/keys";

@Controller("/auth")
class UserController {
  generateToken = (user: any) => {
    const payload = {
      id: user.id,
      username: user.username,
      profileImg: user.profileImg,
      exp: Date.now() + keys.JWT_EXP,
    };

    return jwt.sign(payload, keys.JWT_SECRET);
  };

  saltRounds = 10;

  @Get("/users")
  async getAllUsers(@Req() req: Request, @Res() res: Response) {
    try {
      const users = await User.createQueryBuilder("user")
        .leftJoinAndSelect("user.chatRooms", "chatRooms")
        .leftJoinAndSelect("chatRooms.chats", "chats")
        .select([
          "user.id",
          "user.profileImg",
          "user.username",
          "chatRooms.id",
          "chats",
        ])
        .getMany();

      return res.json({ users }).status(200);
    } catch (error) {
      return res.json({ message: error }).status(500);
    }
  }

  @Post("/signup")
  async signUp(@Req() req: Request, @Res() res: Response) {
    try {
      const hashedPassword = await bcrypt.hash(
        req.body.password,
        this.saltRounds
      );

      req.body.password = hashedPassword;

      let newUser = new User();
      newUser.username = req.body.username;
      newUser.password = req.body.password;
      newUser.profileImg = req.body.profileImg;
      const createdUser = await User.save(newUser);
      const token = this.generateToken(createdUser);

      res.json({ token });
    } catch (error) {
      return res
        .status(422)
        .json({ message: `Internal server error ${error}` });
    }
  }

  @Post("/signin")
  async signin(@Req() req: Request, @Res() res: Response) {
    try {
      return passport.authenticate(
        "local",
        { session: false },
        (err: any, user: any) => {
          if (err || !user) {
            return res.status(401).json({ message: "Authentication failed" });
          }

          const token = this.generateToken(user);

          return res.status(201).json({ token });
        }
      )(req, res);
    } catch (error) {
      return res
        .status(422)
        .json({ message: `Internal server error ${error}` });
    }
  }
}
export default UserController;
