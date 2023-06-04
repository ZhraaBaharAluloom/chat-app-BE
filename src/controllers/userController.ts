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
import User from "../entities/user";
import { Equal } from "typeorm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import passport from "passport";
import { keys } from "../config/keys";

@Controller("/auth")
class UserController {
  generateToken = (user: any) => {
    const payload = {
      _id: user._id,
      username: user.username,
      exp: Date.now() + keys.JWT_EXP,
    };

    return jwt.sign(payload, keys.JWT_SECRET);
  };

  saltRounds = 10;

  @Get("/")
  //   async getAllUsers(@Req() req: Request, @Res() res: Response) {
  //     try {
  //       const userList = await User.find();
  //       return res.json({ Users: userList });
  //     } catch (error) {
  //       return res.status(500);
  //     }
  //   }
  //   @Get("/:id")
  //   async getUser(@Req() req: Request, @Res() res: Response) {
  //     try {
  //       const foundUser = await User.findOne({
  //         where: { id: Equal(Number(req.params.id)) },
  //       });
  //       return res.json({ user: foundUser });
  //     } catch (error) {
  //       return res.status(500);
  //     }
  //   }
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

      res.json({ userToken: token });
    } catch (error) {
      return res.status(422);
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
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
export default UserController;
