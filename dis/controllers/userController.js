"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("@decorators/express");
const user_1 = __importDefault(require("../entities/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const keys_1 = require("../config/keys");
let UserController = class UserController {
    constructor() {
        this.generateToken = (user) => {
            const payload = {
                id: user.id,
                username: user.username,
                profileImg: user.profileImg,
                exp: Date.now() + keys_1.keys.JWT_EXP,
            };
            return jsonwebtoken_1.default.sign(payload, keys_1.keys.JWT_SECRET);
        };
        this.saltRounds = 10;
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_1.default.find({
                    select: ["id", "username", "profileImg"],
                });
                return res.json({ users }).status(200);
            }
            catch (error) {
                return res.json({ message: error }).status(500);
            }
        });
    }
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPassword = yield bcrypt_1.default.hash(req.body.password, this.saltRounds);
                req.body.password = hashedPassword;
                let newUser = new user_1.default();
                newUser.username = req.body.username;
                newUser.password = req.body.password;
                newUser.profileImg = req.body.profileImg;
                const createdUser = yield user_1.default.save(newUser);
                const token = this.generateToken(createdUser);
                res.json({ token });
            }
            catch (error) {
                return res
                    .status(422)
                    .json({ message: `Internal server error ${error}` });
            }
        });
    }
    signin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return passport_1.default.authenticate("local", { session: false }, (err, user) => {
                    if (err || !user) {
                        return res.status(401).json({ message: "Authentication failed" });
                    }
                    const token = this.generateToken(user);
                    return res.status(201).json({ token });
                })(req, res);
            }
            catch (error) {
                return res
                    .status(422)
                    .json({ message: `Internal server error ${error}` });
            }
        });
    }
};
__decorate([
    (0, express_1.Get)("/users"),
    __param(0, (0, express_1.Req)()),
    __param(1, (0, express_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, express_1.Post)("/signup"),
    __param(0, (0, express_1.Req)()),
    __param(1, (0, express_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signUp", null);
__decorate([
    (0, express_1.Post)("/signin"),
    __param(0, (0, express_1.Req)()),
    __param(1, (0, express_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signin", null);
UserController = __decorate([
    (0, express_1.Controller)("/auth")
], UserController);
exports.default = UserController;
