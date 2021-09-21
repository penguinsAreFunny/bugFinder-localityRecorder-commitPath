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
var bugfinder_framework_1 = require("bugfinder-framework");
var TYPES_1 = require("./TYPES");
var commitToCommitPath_1 = require("./commitToCommitPath");
var bugfinder_localityrecorder_commit_1 = require("bugfinder-localityrecorder-commit");
__exportStar(require("./commitPath"), exports);
__exportStar(require("./commitPathRecorder"), exports);
__exportStar(require("./commitToCommitPath"), exports);
__exportStar(require("./TYPES"), exports);
bugfinder_framework_1.localityBContainer.bind(TYPES_1.BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES.commitToCommitPathMapper).to(commitToCommitPath_1.DefaultCommitPathMapper);
bugfinder_framework_1.localityBContainer.bind(TYPES_1.BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES.commitRecorder).to(bugfinder_localityrecorder_commit_1.CommitRecorder);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsMkRBQXVEO0FBQ3ZELGlDQUFvRTtBQUNwRSwyREFBdUY7QUFDdkYsdUZBQWlFO0FBRWpFLCtDQUE0QjtBQUM1Qix1REFBb0M7QUFDcEMsdURBQW9DO0FBQ3BDLDBDQUF1QjtBQUV2Qix3Q0FBa0IsQ0FBQyxJQUFJLENBQTJCLG1EQUEyQyxDQUFDLHdCQUF3QixDQUFDLENBQUMsRUFBRSxDQUFDLDRDQUF1QixDQUFDLENBQUE7QUFDbkosd0NBQWtCLENBQUMsSUFBSSxDQUFpQixtREFBMkMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsa0RBQWMsQ0FBQyxDQUFBIn0=