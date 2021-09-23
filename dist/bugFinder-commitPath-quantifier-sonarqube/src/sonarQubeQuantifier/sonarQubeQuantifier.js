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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SonarQubeQuantifier = void 0;
var inversify_1 = require("inversify");
var child_process_1 = require("child_process");
var sonarQubeMetrics_1 = require("./sonarQubeMetrics");
// eslint-disable-next-line @typescript-eslint/no-var-requires
var axios = require("axios");
// eslint-disable-next-line @typescript-eslint/no-var-requires
var propertiesReader = require("properties-reader");
var bugfinder_framework_1 = require("bugfinder-framework");
var TYPES_1 = require("../TYPES");
var sonarQubeMeasurement_1 = require("./sonarQubeMeasurement");
var moment_1 = __importDefault(require("moment"));
var SonarQubeQuantifier = /** @class */ (function () {
    function SonarQubeQuantifier() {
    }
    SonarQubeQuantifier.prototype.quantify = function (localities) {
        return __awaiter(this, void 0, void 0, function () {
            var hashes, commits, _loop_1, localities_1, localities_1_1, locality, quantifications, commitsLeft, commitsLength, _loop_2, this_1, i;
            var e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        /**
                         * merge all CommitPaths which are in the same commit
                         * performance optimization
                         * git checkout and SonarQube-quantification is costly therefore only run this process once
                         * for each commit
                         */
                        console.log("SonarQubeQuantifier starting...");
                        hashes = new Map();
                        commits = [];
                        _loop_1 = function (locality) {
                            if (hashes.get(locality.commit.hash) === 1)
                                return "continue";
                            hashes.set(locality.commit.hash, 1);
                            var commitPaths = localities.filter(function (loc) {
                                return loc.commit.hash === locality.commit.hash;
                            });
                            var paths = commitPaths.map(function (commitPath) {
                                var _a;
                                return (_a = commitPath.path) === null || _a === void 0 ? void 0 : _a.path;
                            });
                            commits.push({
                                hash: locality.commit.hash,
                                localities: commitPaths,
                                paths: paths
                            });
                        };
                        try {
                            for (localities_1 = __values(localities), localities_1_1 = localities_1.next(); !localities_1_1.done; localities_1_1 = localities_1.next()) {
                                locality = localities_1_1.value;
                                _loop_1(locality);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (localities_1_1 && !localities_1_1.done && (_a = localities_1.return)) _a.call(localities_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        quantifications = new bugfinder_framework_1.LocalityMap();
                        // TODO: Total commits und Total commits with paths to quantify sollte inzwischen identisch sein!
                        console.log("Total commits: ", commits.length);
                        commitsLeft = commits.filter(function (commit) {
                            return commit.paths.length > 0 && commit.paths[0] != undefined;
                        });
                        commitsLength = commitsLeft.length;
                        console.log("Total commits with paths to quantify: ", commitsLength);
                        _loop_2 = function (i) {
                            var commit, beforePreHooks, afterPreHooks, beforeCheckout, afterCheckout, beforeSonarQube, measurements, afterSonarQube, preHooksTime, checkoutTime, sonarQubeTime, totalTime, estimatedTimeS, estimatedTimeM, estimatedTimeH, estimatedTimeD;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        commit = commits[i];
                                        console.log("Quantifying commit " + (i + 1) + " of " + commits.length + ". Hash: " + commit.hash);
                                        if (commit.paths.length == 0 || commit.paths[0] == undefined) {
                                            console.log("ignoring commit as no paths are left to quantify for this commit. If you like", "to inject on empty paths see pathsHandling-injections");
                                            return [2 /*return*/, "continue"];
                                        }
                                        beforePreHooks = (0, moment_1.default)();
                                        this_1.runPreHooks();
                                        afterPreHooks = (0, moment_1.default)();
                                        beforeCheckout = (0, moment_1.default)();
                                        return [4 /*yield*/, this_1.checkoutCommit(commit.hash)];
                                    case 1:
                                        _c.sent();
                                        afterCheckout = (0, moment_1.default)();
                                        beforeSonarQube = (0, moment_1.default)();
                                        return [4 /*yield*/, this_1.sonarQubeQuantify(commit.paths)];
                                    case 2:
                                        measurements = _c.sent();
                                        afterSonarQube = (0, moment_1.default)();
                                        if (measurements.length != commit.localities.length) {
                                            console.error("ERROR: SonarQubeQuantifier failed for commit " + commit.hash + ".");
                                            return [2 /*return*/, "continue"];
                                        }
                                        commit.localities.forEach(function (locality, x) {
                                            var parsedMeasurement = undefined;
                                            if (measurements[x] != null) {
                                                parsedMeasurement = new sonarQubeMeasurement_1.SonarQubeMeasurement(measurements[x]);
                                            }
                                            quantifications.set(locality, parsedMeasurement);
                                        });
                                        preHooksTime = afterPreHooks.diff(beforePreHooks, "seconds");
                                        checkoutTime = afterCheckout.diff(beforeCheckout, "seconds");
                                        sonarQubeTime = afterSonarQube.diff(beforeSonarQube, "seconds");
                                        totalTime = preHooksTime + checkoutTime + sonarQubeTime;
                                        estimatedTimeS = totalTime * (commitsLength - i);
                                        estimatedTimeM = Math.round((estimatedTimeS / 60) * 100) / 100;
                                        estimatedTimeH = Math.round((estimatedTimeS / (60 * 60)) * 100) / 100;
                                        estimatedTimeD = Math.round((estimatedTimeS / (60 * 60 * 24)) * 100) / 100;
                                        console.log("\tPrehooks time:\t", preHooksTime);
                                        console.log("\tCheckout time:\t", checkoutTime);
                                        console.log("\tSonarQube time:\t", sonarQubeTime);
                                        console.log("\tTotal time:\t", totalTime);
                                        console.log("\tEstimated time for next ", commitsLength - i, " commits: with ", totalTime, "s time per commit: ", estimatedTimeS, "s = ", estimatedTimeM, "m = ", estimatedTimeH, "h  = ", estimatedTimeD, "d");
                                        console.log("\n\n\n");
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        i = 0;
                        _b.label = 1;
                    case 1:
                        if (!(i < commitsLength)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_2(i)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, quantifications];
                }
            });
        });
    };
    SonarQubeQuantifier.prototype.runPreHooks = function () {
        if (this.sonarQubeConfig.preHooks) {
            this.sonarQubeConfig.preHooks.forEach(function (hook) {
                hook();
            });
        }
    };
    SonarQubeQuantifier.prototype.checkoutCommit = function (hash) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1, err2_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 7]);
                        return [4 /*yield*/, this.git.checkout(hash, true)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 2:
                        err_1 = _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        // retry
                        return [4 /*yield*/, this.git.checkout(hash, true)];
                    case 4:
                        // retry
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        err2_1 = _a.sent();
                        throw new Error("SonarQubeQuantifier: git checkout retry failed with msg: " + err2_1 + "." +
                            (" Aborting quantification for commit " + hash));
                    case 6: return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    SonarQubeQuantifier.prototype.sonarQubeQuantify = function (paths) {
        return __awaiter(this, void 0, void 0, function () {
            var runSonarScanner, webServerIsUpdated, retrieveMeasurements, waitUntilWebserverIsUpdated, timeBeforeScanning, beforeScanning, afterScanning, error_1, beforeRetrieving, measurements, paths_1, paths_1_1, path, measurement, error_2, e_2_1, afterRetrieving;
            var e_2, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        runSonarScanner = function () {
                            // @formatter:off
                            var args = "-Dproject.settings=" + _this.sonarQubeConfig.propertiesPath;
                            var command = "sonar-scanner.bat " + args;
                            console.log(command);
                            console.log("\n\n");
                            console.log("\tScanning might take a few minutes: Command: ", command);
                            (0, child_process_1.execSync)(command).toString();
                            console.log("\tFinished scan");
                            //@formatter:on
                        };
                        webServerIsUpdated = function (time) { return __awaiter(_this, void 0, void 0, function () {
                            var config, response, tasks, newestTask, newestTaskTime, error_3;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        config = {
                                            baseURL: this.sonarQubeConfig.sonarQubeURL,
                                            url: "api/ce/activity",
                                            // using base64 auth
                                            auth: {
                                                username: this.sonarQubeConfig.id,
                                                password: this.sonarQubeConfig.pw,
                                            }
                                        };
                                        _b.label = 1;
                                    case 1:
                                        _b.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, axios(config)];
                                    case 2:
                                        response = _b.sent();
                                        tasks = (_a = response.data) === null || _a === void 0 ? void 0 : _a.tasks;
                                        if (tasks.length <= 0) {
                                            return [2 /*return*/, false];
                                        }
                                        newestTask = tasks[0];
                                        newestTaskTime = Date.parse(newestTask.startedAt);
                                        return [2 /*return*/, newestTask.status == "SUCCESS" && newestTaskTime >= time];
                                    case 3:
                                        error_3 = _b.sent();
                                        console.log("\tHttp GET to SonarQube-WebApi with path: \"api/ce/activity\" failed with error: \n                    " + error_3.statusCode + ". Error message: " + error_3.message);
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); };
                        retrieveMeasurements = function (path) { return __awaiter(_this, void 0, void 0, function () {
                            var properties, sonarProjectKey, metricsUrlString, webPath, config, response, error_4, msg;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (path == null)
                                            return [2 /*return*/, null];
                                        properties = propertiesReader(this.sonarQubeConfig.propertiesPath);
                                        sonarProjectKey = properties.get("sonar.projectKey");
                                        metricsUrlString = sonarQubeMetrics_1.SONARQUBE_METRICS.join("%2C");
                                        webPath = path.split("/").join("%2F");
                                        config = {
                                            baseURL: this.sonarQubeConfig.sonarQubeURL,
                                            //url: "/api/measures/component?component=" + sonarProjectKey + "&metricKeys=" +
                                            //    metricsUrlString,
                                            url: "/api/measures/component?component=" + sonarProjectKey + "%3A" + webPath + "&metricKeys=" +
                                                metricsUrlString,
                                            // using base64 auth
                                            auth: {
                                                username: this.sonarQubeConfig.id,
                                                password: this.sonarQubeConfig.pw,
                                            }
                                        };
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, axios(config)];
                                    case 2:
                                        response = _a.sent();
                                        console.log("\tSuccessfully retrieved measurements for path: " + webPath);
                                        return [2 /*return*/, response.data];
                                    case 3:
                                        error_4 = _a.sent();
                                        msg = "\"\tFailed to retrieve measurements from sonarQubeServer for path " + webPath + "." +
                                            ("Error message: " + error_4.message);
                                        throw new Error(msg);
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); };
                        waitUntilWebserverIsUpdated = function (timeBeforeScanning) { return __awaiter(_this, void 0, void 0, function () {
                            var now, minutesWaiting;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, webServerIsUpdated(timeBeforeScanning)];
                                    case 1:
                                        if (!!(_a.sent())) return [3 /*break*/, 3];
                                        now = Date.now().valueOf();
                                        minutesWaiting = (now - timeBeforeScanning.valueOf()) / (1000 * 60);
                                        if (minutesWaiting > 15)
                                            throw new Error("Timeout: SonarQube-Webserver has not updated for 15 minutes");
                                        // sleep 1000ms
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                                    case 2:
                                        // sleep 1000ms
                                        _a.sent();
                                        return [3 /*break*/, 0];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); };
                        timeBeforeScanning = Date.now();
                        beforeScanning = (0, moment_1.default)();
                        runSonarScanner();
                        afterScanning = (0, moment_1.default)();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, waitUntilWebserverIsUpdated(timeBeforeScanning)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        console.log(error_1);
                        return [2 /*return*/, null];
                    case 4:
                        beforeRetrieving = (0, moment_1.default)();
                        measurements = [];
                        _b.label = 5;
                    case 5:
                        _b.trys.push([5, 12, 13, 14]);
                        paths_1 = __values(paths), paths_1_1 = paths_1.next();
                        _b.label = 6;
                    case 6:
                        if (!!paths_1_1.done) return [3 /*break*/, 11];
                        path = paths_1_1.value;
                        _b.label = 7;
                    case 7:
                        _b.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, retrieveMeasurements(path)];
                    case 8:
                        measurement = _b.sent();
                        measurements.push(measurement);
                        return [3 /*break*/, 10];
                    case 9:
                        error_2 = _b.sent();
                        console.log("Error: Retrieving of measurements for path: ", path, "\nMessage: ", error_2.message);
                        return [3 /*break*/, 10];
                    case 10:
                        paths_1_1 = paths_1.next();
                        return [3 /*break*/, 6];
                    case 11: return [3 /*break*/, 14];
                    case 12:
                        e_2_1 = _b.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 14];
                    case 13:
                        try {
                            if (paths_1_1 && !paths_1_1.done && (_a = paths_1.return)) _a.call(paths_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 14:
                        afterRetrieving = (0, moment_1.default)();
                        console.log("\tScanning time: ", afterScanning.diff(beforeScanning, "seconds"));
                        console.log("\tRetrieving time: ", afterRetrieving.diff(beforeRetrieving, "seconds"));
                        return [2 /*return*/, measurements];
                }
            });
        });
    };
    __decorate([
        (0, inversify_1.inject)(TYPES_1.BUGFINDER_COMMITPATH_QUANTIFIER_SONARQUBE_TYPES.sonarQubeConfig),
        __metadata("design:type", Object)
    ], SonarQubeQuantifier.prototype, "sonarQubeConfig", void 0);
    __decorate([
        (0, inversify_1.inject)(TYPES_1.BUGFINDER_COMMITPATH_QUANTIFIER_SONARQUBE_TYPES.git),
        __metadata("design:type", Object)
    ], SonarQubeQuantifier.prototype, "git", void 0);
    SonarQubeQuantifier = __decorate([
        (0, inversify_1.injectable)()
    ], SonarQubeQuantifier);
    return SonarQubeQuantifier;
}());
exports.SonarQubeQuantifier = SonarQubeQuantifier;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29uYXJRdWJlUXVhbnRpZmllci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2J1Z0ZpbmRlci1jb21taXRQYXRoLXF1YW50aWZpZXItc29uYXJxdWJlL3NyYy9zb25hclF1YmVRdWFudGlmaWVyL3NvbmFyUXViZVF1YW50aWZpZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx1Q0FBNkM7QUFDN0MsK0NBQXVDO0FBRXZDLHVEQUFxRDtBQUVyRCw4REFBOEQ7QUFDOUQsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9CLDhEQUE4RDtBQUM5RCxJQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ3RELDJEQUE0RDtBQUU1RCxrQ0FBeUU7QUFFekUsK0RBQTREO0FBQzVELGtEQUE0QjtBQUc1QjtJQUFBO0lBb1BBLENBQUM7SUE1T1Msc0NBQVEsR0FBZCxVQUFlLFVBQXdCOzs7Ozs7O3dCQUNuQzs7Ozs7MkJBS0c7d0JBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFBO3dCQUN4QyxNQUFNLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7d0JBQ3JDLE9BQU8sR0FBa0UsRUFBRSxDQUFBOzRDQUNwRSxRQUFROzRCQUNmLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7a0RBQVc7NEJBQ3JELE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBRXBDLElBQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQSxHQUFHO2dDQUNyQyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENB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