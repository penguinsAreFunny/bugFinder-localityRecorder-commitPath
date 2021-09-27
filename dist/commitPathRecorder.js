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
        while (_) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommitPathRecorder = void 0;
var inversify_1 = require("inversify");
var TYPES_1 = require("./TYPES");
var CommitPathRecorder = /** @class */ (function () {
    function CommitPathRecorder() {
    }
    CommitPathRecorder.prototype.getLocalities = function () {
        return __awaiter(this, void 0, void 0, function () {
            var commits;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Running analysis and retrieving CommitPaths");
                        return [4 /*yield*/, this.commitType.getLocalities()];
                    case 1:
                        commits = _a.sent();
                        return [2 /*return*/, this.mapper.map(commits)];
                }
            });
        });
    };
    __decorate([
        (0, inversify_1.inject)(TYPES_1.BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES.commitRecorder),
        __metadata("design:type", Object)
    ], CommitPathRecorder.prototype, "commitType", void 0);
    __decorate([
        (0, inversify_1.inject)(TYPES_1.BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES.commitToCommitPathMapper),
        __metadata("design:type", Object)
    ], CommitPathRecorder.prototype, "mapper", void 0);
    CommitPathRecorder = __decorate([
        (0, inversify_1.injectable)()
    ], CommitPathRecorder);
    return CommitPathRecorder;
}());
exports.CommitPathRecorder = CommitPathRecorder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWl0UGF0aFJlY29yZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbW1pdFBhdGhSZWNvcmRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx1Q0FBdUQ7QUFJdkQsaUNBQW9FO0FBSXBFO0lBQUE7SUFhQSxDQUFDO0lBTlMsMENBQWEsR0FBbkI7Ozs7Ozt3QkFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7d0JBQ2pDLHFCQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLEVBQUE7O3dCQUF6RCxPQUFPLEdBQWEsU0FBcUM7d0JBQy9ELHNCQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFDOzs7O0tBQ25DO0lBVEQ7UUFEQyxJQUFBLGtCQUFNLEVBQUMsbURBQTJDLENBQUMsY0FBYyxDQUFDOzswREFDOUI7SUFHckM7UUFEQyxJQUFBLGtCQUFNLEVBQUMsbURBQTJDLENBQUMsd0JBQXdCLENBQUM7O3NEQUM1QztJQUx4QixrQkFBa0I7UUFEOUIsSUFBQSxzQkFBVSxHQUFFO09BQ0Esa0JBQWtCLENBYTlCO0lBQUQseUJBQUM7Q0FBQSxBQWJELElBYUM7QUFiWSxnREFBa0IifQ==