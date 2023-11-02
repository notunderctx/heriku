var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as nodemailer from 'nodemailer';
import OpenAI from 'openai';
import { simpleParser } from 'mailparser';
import Imap from 'imap';
var GptMail = /** @class */ (function () {
    function GptMail(apikey) {
        this.apiKey = apikey;
        this.openai = new OpenAI({
            apiKey: "".concat(apikey),
        });
    }
    GptMail.prototype.setGptType = function (m_gpt_cfg) {
        this.gptc = m_gpt_cfg;
    };
    GptMail.prototype.gptSendReply = function (emailConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var transporter, emails, _i, emails_1, email, parsedEmail, content, params, chatCompletion, reply, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transporter = nodemailer.createTransport(emailConfig);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        return [4 /*yield*/, fetchEmails(emailConfig)];
                    case 2:
                        emails = _a.sent();
                        _i = 0, emails_1 = emails;
                        _a.label = 3;
                    case 3:
                        if (!(_i < emails_1.length)) return [3 /*break*/, 8];
                        email = emails_1[_i];
                        return [4 /*yield*/, simpleParser(email)];
                    case 4:
                        parsedEmail = _a.sent();
                        content = parsedEmail.text;
                        params = {
                            messages: [
                                { role: 'system', content: 'You are a helpful assistant.' },
                                { role: 'user', content: this.gptc },
                                { role: 'assistant', content: content },
                            ],
                            model: 'gpt-3.5-turbo',
                        };
                        return [4 /*yield*/, this.openai.chat.completions.create(params)];
                    case 5:
                        chatCompletion = _a.sent();
                        reply = chatCompletion.choices[0].message.content;
                        return [4 /*yield*/, transporter.sendMail({
                                from: emailConfig.auth.user,
                                to: parsedEmail.from.value[0].address,
                                subject: "Re: ".concat(parsedEmail.subject),
                                text: reply,
                            })];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 3];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_1 = _a.sent();
                        console.error('Error fetching or sending emails:', error_1);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    return GptMail;
}());
export { GptMail };
function fetchEmails(emailConfig) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var imap = new Imap(emailConfig);
                    imap.once('ready', function () {
                        imap.openBox('INBOX', false, function (err, box) {
                            if (err) {
                                imap.end();
                                reject(err);
                            }
                            else {
                                var searchCriteria = ['UNSEEN'];
                                imap.search(searchCriteria, function (searchError, results) {
                                    if (searchError) {
                                        imap.end();
                                        reject(searchError);
                                    }
                                    else {
                                        var emailMessages_1 = [];
                                        var f = imap.fetch(results, { bodies: '' });
                                        f.on('message', function (msg) {
                                            var emailData = '';
                                            msg.on('body', function (stream, info) {
                                                stream.on('data', function (chunk) {
                                                    emailData += chunk.toString('utf8');
                                                });
                                            });
                                            msg.on('end', function () {
                                                emailMessages_1.push(emailData);
                                            });
                                        });
                                        f.on('end', function () {
                                            imap.end();
                                            resolve(emailMessages_1);
                                        });
                                    }
                                });
                            }
                        });
                    });
                    imap.once('error', function (err) {
                        reject(err);
                    });
                    imap.connect();
                })];
        });
    });
}
