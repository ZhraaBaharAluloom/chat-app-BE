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
const chat_1 = __importDefault(require("../entities/chat"));
const typeorm_1 = require("typeorm");
const passport_1 = __importDefault(require("passport"));
let ChatController = class ChatController {
    getAllChats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatList = yield chat_1.default.createQueryBuilder("chat")
                    .leftJoinAndSelect("chat.user", "user")
                    .select(["chat.id", "chat.text", "chat.send", "user.id"])
                    .getMany();
                return res.json({ Chats: chatList });
            }
            catch (error) {
                return res.status(500);
            }
        });
    }
    getChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const foundChat = yield chat_1.default.findOne({
                    where: { id: (0, typeorm_1.Equal)(Number(req.params.id)) },
                });
                return res.json({ chat: foundChat });
            }
            catch (error) {
                return res.status(500);
            }
        });
    }
    createChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return passport_1.default.authenticate("jwt", { session: false }, (err, user) => __awaiter(this, void 0, void 0, function* () {
                    if (err || !user) {
                        return res.status(401).json({ message: "Authentication failed" });
                    }
                    const userId = {
                        id: user.id,
                    };
                    let newChat = new chat_1.default();
                    newChat.send = req.body.send;
                    newChat.text = req.body.text;
                    newChat.user = userId;
                    const createdChat = yield chat_1.default.save(newChat);
                    return res.json({ newChat: createdChat });
                }))(req, res);
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    updateChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return passport_1.default.authenticate("jwt", { session: false }, (err, user) => __awaiter(this, void 0, void 0, function* () {
                    if (err || !user) {
                        return res.status(401).json({ message: "Authentication failed" });
                    }
                    const foundChat = yield chat_1.default.findOne({
                        where: { id: (0, typeorm_1.Equal)(Number(req.params.id)) },
                        relations: ["user"],
                    });
                    if (!foundChat) {
                        return res.status(404).json({ message: "Chat not found" });
                    }
                    if (user.id === (foundChat === null || foundChat === void 0 ? void 0 : foundChat.user.id)) {
                        Object.assign(foundChat, req.body);
                        const updatedChat = yield chat_1.default.save(foundChat);
                        res.json({ chat: updatedChat }).status(200);
                    }
                    else {
                        res
                            .json({
                            message: "Sorry, you don't have permission to update others messages",
                        })
                            .status(401);
                    }
                }))(req, res);
            }
            catch (error) {
                return res.status(422);
            }
        });
    }
    deleteChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return passport_1.default.authenticate("jwt", { session: false }, (err, user) => __awaiter(this, void 0, void 0, function* () {
                    if (err || !user) {
                        return res.status(401).json({ message: "Authentication failed" });
                    }
                    const foundChat = yield chat_1.default.findOne({
                        where: { id: (0, typeorm_1.Equal)(Number(req.params.id)) },
                        relations: ["user"],
                    });
                    if (!foundChat) {
                        return res.status(404).json({ message: "Chat not found" });
                    }
                    if (user.id === (foundChat === null || foundChat === void 0 ? void 0 : foundChat.user.id)) {
                        yield foundChat.remove();
                        res.json({ message: "Successfully deleted" }).status(200);
                    }
                    else {
                        res
                            .json({
                            message: "Sorry, you don't have permission to delete others messages",
                        })
                            .status(401);
                    }
                }))(req, res);
            }
            catch (error) {
                return res.status(422);
            }
        });
    }
};
__decorate([
    (0, express_1.Get)("/"),
    __param(0, (0, express_1.Req)()),
    __param(1, (0, express_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getAllChats", null);
__decorate([
    (0, express_1.Get)("/:id"),
    __param(0, (0, express_1.Req)()),
    __param(1, (0, express_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChat", null);
__decorate([
    (0, express_1.Post)("/"),
    __param(0, (0, express_1.Req)()),
    __param(1, (0, express_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createChat", null);
__decorate([
    (0, express_1.Put)("/:id"),
    __param(0, (0, express_1.Req)()),
    __param(1, (0, express_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "updateChat", null);
__decorate([
    (0, express_1.Delete)("/:id"),
    __param(0, (0, express_1.Req)()),
    __param(1, (0, express_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "deleteChat", null);
ChatController = __decorate([
    (0, express_1.Controller)("/chats")
], ChatController);
exports.default = ChatController;
