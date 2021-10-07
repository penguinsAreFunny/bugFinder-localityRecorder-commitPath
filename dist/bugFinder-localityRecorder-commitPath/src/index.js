"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
var TYPES_1 = require("./TYPES");
var commitToCommitPath_1 = require("./commitToCommitPath");
var bugfinder_framework_defaultcontainer_1 = require("bugfinder-framework-defaultcontainer");
require("bugfinder-localityrecorder-commit"); // TODO: delete me and test if DI is still working for localityAContainer
var bugfinder_framework_1 = require("bugfinder-framework");
__exportStar(require("./commitPath"), exports);
__exportStar(require("./commitPathRecorder"), exports);
__exportStar(require("./commitToCommitPath"), exports);
__exportStar(require("./TYPES"), exports);
var logOptions = {
    debugToConsole: true,
    errorToConsole: true,
    infoToConsole: true,
    traceToConsole: true,
    warnToConsole: true,
    logFile: "./log.txt",
};
bugfinder_framework_defaultcontainer_1.localityAContainer.bind(TYPES_1.BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES.commitToCommitPathMapper).to(commitToCommitPath_1.DefaultCommitPathMapper);
bugfinder_framework_defaultcontainer_1.localityAContainer.bind(TYPES_1.BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES.logger).to(bugfinder_framework_1.FileAndConsoleLogger);
bugfinder_framework_defaultcontainer_1.localityAContainer.bind(TYPES_1.BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES.logConfig).toConstantValue(logOptions);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsaUNBQW9FO0FBQ3BFLDJEQUF1RjtBQUN2Riw2RkFBd0U7QUFDeEUsNkNBQTJDLENBQUEseUVBQXlFO0FBQ3BILDJEQUFvRTtBQUdwRSwrQ0FBNEI7QUFDNUIsdURBQW9DO0FBQ3BDLHVEQUFvQztBQUNwQywwQ0FBdUI7QUFHdkIsSUFBTSxVQUFVLEdBQWM7SUFDMUIsY0FBYyxFQUFFLElBQUk7SUFDcEIsY0FBYyxFQUFFLElBQUk7SUFDcEIsYUFBYSxFQUFFLElBQUk7SUFDbkIsY0FBYyxFQUFFLElBQUk7SUFDcEIsYUFBYSxFQUFFLElBQUk7SUFDbkIsT0FBTyxFQUFFLFdBQVc7Q0FDdkIsQ0FBQTtBQUVELHlEQUFrQixDQUFDLElBQUksQ0FBMkIsbURBQTJDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxFQUFFLENBQUMsNENBQXVCLENBQUMsQ0FBQTtBQUNuSix5REFBa0IsQ0FBQyxJQUFJLENBQVMsbURBQTJDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLDBDQUFvQixDQUFDLENBQUE7QUFDNUcseURBQWtCLENBQUMsSUFBSSxDQUFZLG1EQUEyQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQSJ9