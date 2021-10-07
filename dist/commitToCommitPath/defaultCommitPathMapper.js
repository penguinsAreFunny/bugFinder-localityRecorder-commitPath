"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultCommitPathMapper = void 0;
var inversify_1 = require("inversify");
var commitPath_1 = require("../commitPath");
/**
 * Maps an array of Commits to an array of CommitPaths using optional pathsHandling.
 * Strategy: Each file in commit will generate a new CommitPath-Object. CommitPath-Objects
 * are then filtered and injected with pathHandling-options, deleted files are dismissed
 */
var DefaultCommitPathMapper = /** @class */ (function () {
    function DefaultCommitPathMapper() {
    }
    DefaultCommitPathMapper.prototype.map = function (commits) {
        var localities = [];
        // @formatter:on
        console.log("Total commits: ", commits.length);
        // create single 0-localities from each file of each commit
        commits.forEach(function (commit) {
            // create locality for empty files. Needed for commit history reconstruction!
            if (commit.files.files.length === 0) {
                var locality = new commitPath_1.CommitPath(commit);
                localities.push(locality);
                return;
            }
            commit.files.files.forEach(function (file) {
                // copy content of Commit to CommitPath
                var locality = new commitPath_1.CommitPath(commit, file);
                localities.push(locality);
            });
        });
        console.log("localities for each file of each commit: ", localities.length);
        return localities;
    };
    DefaultCommitPathMapper = __decorate([
        (0, inversify_1.injectable)()
    ], DefaultCommitPathMapper);
    return DefaultCommitPathMapper;
}());
exports.DefaultCommitPathMapper = DefaultCommitPathMapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdENvbW1pdFBhdGhNYXBwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWl0VG9Db21taXRQYXRoL2RlZmF1bHRDb21taXRQYXRoTWFwcGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLHVDQUFxQztBQUdyQyw0Q0FBeUM7QUFFekM7Ozs7R0FJRztBQUVIO0lBQUE7SUE0QkEsQ0FBQztJQTFCRyxxQ0FBRyxHQUFILFVBQUksT0FBaUI7UUFHakIsSUFBTSxVQUFVLEdBQW9CLEVBQUUsQ0FBQztRQUN2QyxnQkFBZ0I7UUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7UUFFOUMsMkRBQTJEO1FBQzNELE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFjO1lBQzNCLDZFQUE2RTtZQUM3RSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQ2pDLElBQU0sUUFBUSxHQUFHLElBQUksdUJBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDeEMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDMUIsT0FBTzthQUNWO1lBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtnQkFDNUIsdUNBQXVDO2dCQUN2QyxJQUFNLFFBQVEsR0FBRyxJQUFJLHVCQUFVLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUM5QyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FBQyxDQUFBO1FBQ04sQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLDJDQUEyQyxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUUzRSxPQUFPLFVBQVUsQ0FBQztJQUN0QixDQUFDO0lBM0JRLHVCQUF1QjtRQURuQyxJQUFBLHNCQUFVLEdBQUU7T0FDQSx1QkFBdUIsQ0E0Qm5DO0lBQUQsOEJBQUM7Q0FBQSxBQTVCRCxJQTRCQztBQTVCWSwwREFBdUIifQ==