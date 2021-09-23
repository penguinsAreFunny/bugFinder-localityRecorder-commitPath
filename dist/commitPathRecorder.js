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
var commitPath_1 = require("./commitPath");
var bugfinder_localityrecorder_commit_1 = require("bugfinder-localityrecorder-commit");
var TYPES_1 = require("./TYPES");
var CommitPathRecorder = /** @class */ (function () {
    function CommitPathRecorder() {
    }
    CommitPathRecorder.prototype.getLocalities = function () {
        return __awaiter(this, void 0, void 0, function () {
            var commits, commitPaths;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Running analysis and retrieving CommitPaths");
                        return [4 /*yield*/, this.commitType.getLocalities()];
                    case 1:
                        commits = _a.sent();
                        commitPaths = this.mapper.map(commits);
                        return [2 /*return*/, this.applyPathHandling(commitPaths)];
                }
            });
        });
    };
    CommitPathRecorder.prototype.applyPathHandling = function (localities) {
        var _this = this;
        console.log("Applying path handling for " + localities.length + " localities.");
        var commits = commitPath_1.CommitPath.getCommits(localities);
        // pathsHandling: filter commitPath which do not comply the pathIncludes pattern
        var filterPathIncludes = function (commitPath) {
            if (commitPath.path)
                return _this.pathsHandling.pathIncludes.test(commitPath.path.path);
            return true;
        };
        if (this.pathsHandling && this.pathsHandling.pathIncludes) {
            localities = localities.filter(filterPathIncludes);
            console.log("localities after filtering pathIncludes: ", localities.length);
        }
        // remove paths which are deleted
        var removeDeletedPaths = function (commitPath) {
            if (commitPath.path)
                return commitPath.path.type !== bugfinder_localityrecorder_commit_1.GitFileType.deleted;
            return true;
        };
        localities = localities.filter(removeDeletedPaths);
        console.log("localities after removing deleted paths: ", localities.length);
        var localityMap = new Map();
        localities.forEach(function (l) {
            localityMap.set(l.commit.hash, l);
        });
        // inject paths for each unique commit
        commits.forEach(function (commit) {
            var _a, _b, _c;
            var commitPath = localityMap.get(commit.hash);
            if (commitPath == null || (commitPath.path == null && !((_a = _this.pathsHandling) === null || _a === void 0 ? void 0 : _a.injectOnEmptyPaths))) {
                // do not inject on empty paths
                return;
            }
            (_c = (_b = _this.pathsHandling) === null || _b === void 0 ? void 0 : _b.injections) === null || _c === void 0 ? void 0 : _c.forEach(function (injection) {
                var injectedCommitPath = new commitPath_1.CommitPath();
                injectedCommitPath.commit = commit;
                injectedCommitPath.path = {
                    path: injection,
                    type: bugfinder_localityrecorder_commit_1.GitFileType.other
                };
                localities.push(injectedCommitPath);
                localityMap.set(commit.hash, injectedCommitPath);
            });
        });
        console.log("localities after injecting pathInjections: ", localities.length);
        console.log("PathHandling got " + localities.length + " localities from " + commits.length + " commits.");
        return localities;
    };
    __decorate([
        (0, inversify_1.optional)(),
        (0, inversify_1.inject)(TYPES_1.BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES.pathsHandling),
        __metadata("design:type", Object)
    ], CommitPathRecorder.prototype, "pathsHandling", void 0);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWl0UGF0aFJlY29yZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbW1pdFBhdGhSZWNvcmRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx1Q0FBdUQ7QUFFdkQsMkNBQXVEO0FBQ3ZELHVGQUFzRTtBQUN0RSxpQ0FBb0U7QUFJcEU7SUFBQTtJQXFFQSxDQUFDO0lBM0RTLDBDQUFhLEdBQW5COzs7Ozs7d0JBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO3dCQUNqQyxxQkFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxFQUFBOzt3QkFBekQsT0FBTyxHQUFhLFNBQXFDO3dCQUN6RCxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQzdDLHNCQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsRUFBQTs7OztLQUM3QztJQUVNLDhDQUFpQixHQUF4QixVQUF5QixVQUF3QjtRQUFqRCxpQkFrREM7UUFqREcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBOEIsVUFBVSxDQUFDLE1BQU0saUJBQWMsQ0FBQyxDQUFBO1FBQzFFLElBQUksT0FBTyxHQUFhLHVCQUFVLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRTFELGdGQUFnRjtRQUNoRixJQUFNLGtCQUFrQixHQUE0QixVQUFDLFVBQXNCO1lBQ3ZFLElBQUksVUFBVSxDQUFDLElBQUk7Z0JBQUUsT0FBTyxLQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2RixPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDLENBQUE7UUFFRCxJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksSUFB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