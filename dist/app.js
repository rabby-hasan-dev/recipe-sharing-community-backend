"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const globalErrorhandler_1 = __importDefault(require("./app/middlewares/globalErrorhandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const routes_1 = __importDefault(require("./app/routes"));
const config_1 = __importDefault(require("./app/config"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
//parsers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// app.use(express.json({ limit: '50mb' }))
// app.use(express.urlencoded({ limit: '50mb' }))
app.use((0, cors_1.default)({ origin: [`${config_1.default.client_url_link}`], credentials: true }));
// application routes
app.use('/api/v1', routes_1.default);
app.get('/', (req, res) => {
    res.send('Welcome  To Recipe Sharing Community Server');
});
app.use(globalErrorhandler_1.default);
//Not Found
app.use(notFound_1.default);
exports.default = app;
