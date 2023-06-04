"use strict";
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
exports.jwtStrategy = exports.localStrategy = void 0;
const keys_1 = require("../config/keys");
const user_1 = __importDefault(require("../entities/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// Strategies
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const passport_local_1 = __importDefault(require("passport-local"));
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;
exports.localStrategy = new passport_local_1.default.Strategy({
    usernameField: "username",
    passwordField: "password",
}, (username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findOne({ where: { username: username } });
        const comparedPassword = user
            ? yield bcrypt_1.default.compare(password, user.password)
            : false;
        comparedPassword ? done(null, user) : done(null, false);
    }
    catch (error) {
        done(error);
    }
}));
exports.jwtStrategy = new passport_jwt_1.default.Strategy({
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: keys_1.keys.JWT_SECRET,
}, (jwtPayload, done) => __awaiter(void 0, void 0, void 0, function* () {
    if (Date.now() > jwtPayload.exp) {
        return done(null, false);
    }
    else {
        const user = yield user_1.default.findOneBy(jwtPayload._id);
        return done(null, user);
    }
}));
