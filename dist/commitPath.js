"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommitPath = void 0;
var crypto = __importStar(require("crypto"));
var bugfinder_localityrecorder_commit_1 = require("bugfinder-localityrecorder-commit");
var inversify_1 = require("inversify");
var TYPES_1 = require("./TYPES");
var CommitPath = /** @class */ (function () {
    function CommitPath(commit, path) {
        if (commit == null)
            return;
        CommitPath.pushCommit(commit);
        this.parentKey = commit.key();
        this.path = path;
    }
    /**
     * To achieve normalization und reduce redundancy commits
     * are stored static and received functional with getter method
     * of CommitPath objects. All commits need to be stored once.
     * Push every commit which is referenced in a CommitPath instance.
     * @param commit
     */
    CommitPath.pushCommit = function (commit) {
        var commitKey = commit.key();
        if (CommitPath._commitMap.get(commitKey) == null) {
            CommitPath._commits.push(commit);
            CommitPath._commitMap.set(commitKey, commit);
        }
    };
    Object.defineProperty(CommitPath, "commits", {
        /**
         * Returns all commits handled by static CommitPath
         */
        get: function () {
            return CommitPath._commits;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CommitPath, "commitMap", {
        /**
         * Returns a map of commit.key to commits. Used to normalize CommitPaths and reduce redundancy.
         */
        get: function () {
            return CommitPath._commitMap;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * TODO: renaming of paths
     * Returns up to n predecessor CommitPaths of locality. Predecessors match the path of locality
     * @param locality
     * @param n
     * @param allLocalities
     * @param initMode initializes map over allLocalities. If you want to call this function many times with same
     *          allLocalities you can set this to false after first call! This will achieve huge performance advantages
     */
    CommitPath.getNPredecessors = function (locality, n, allLocalities, initMode) {
        var e_1, _a;
        var _b;
        if (initMode === void 0) { initMode = true; }
        if (allLocalities == null || allLocalities.length == 0) {
            return [];
        }
        var orderedLocalities;
        var minOrder;
        // init: performance optimization
        if (initMode) {
            // init map from order to CommitPath[] and set minOrder
            orderedLocalities = new Map();
            minOrder = allLocalities[0].commit.order;
            try {
                for (var allLocalities_1 = __values(allLocalities), allLocalities_1_1 = allLocalities_1.next(); !allLocalities_1_1.done; allLocalities_1_1 = allLocalities_1.next()) {
                    var aLoc = allLocalities_1_1.value;
                    var cps = orderedLocalities.get(aLoc.commit.order);
                    cps = cps == null ? [aLoc] : __spreadArray(__spreadArray([], __read(cps), false), [aLoc], false);
                    orderedLocalities.set(aLoc.commit.order, cps);
                    if (aLoc.commit.order < minOrder)
                        minOrder = aLoc.commit.order;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (allLocalities_1_1 && !allLocalities_1_1.done && (_a = allLocalities_1.return)) _a.call(allLocalities_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            CommitPath.orderedLocalities = orderedLocalities;
            CommitPath.minOrder = minOrder;
        }
        else {
            // get Map and minOrder from last calculations with initMode = true
            orderedLocalities = CommitPath.orderedLocalities;
            minOrder = CommitPath.minOrder;
        }
        // calculating predecessor CommitPaths
        var curOrder = locality.commit.order - 1;
        var predecessors = [];
        while (predecessors.length < n) {
            var pred = CommitPath
                .getNextPredecessor((_b = locality.path) === null || _b === void 0 ? void 0 : _b.path, orderedLocalities, curOrder, minOrder, allLocalities);
            if (pred == null)
                return predecessors;
            predecessors.push(pred);
            curOrder = pred.commit.order - 1;
        }
        return predecessors;
    };
    /**
     * Returns the next predecessor CommitPath, returns null if all localities until minOrder were searched and no match was found
     * @param path of the CommitPath of which the predecessor should be returned
     * @param orderedLocalities a map of order (of all localities: CommitPath[]) to CommitPath[] with that order
     * @param beginOrder order of the CommitPath of which the predecessor should be returned
     * @param minOrder min order of allLocalities
     * @param allLocalities
     */
    CommitPath.getNextPredecessor = function (path, orderedLocalities, beginOrder, minOrder, allLocalities) {
        var _a;
        var curOrder = beginOrder;
        while (curOrder >= minOrder) {
            var cps = orderedLocalities.get(curOrder);
            if (cps == null) {
                curOrder--;
                continue;
            }
            var cpsMatched = cps.filter(function (cp) {
                var _a, _b, _c;
                return ((_a = cp.path) === null || _a === void 0 ? void 0 : _a.path) == path &&
                    (((_b = cp.path) === null || _b === void 0 ? void 0 : _b.type) == bugfinder_localityrecorder_commit_1.GitFileType.added || ((_c = cp.path) === null || _c === void 0 ? void 0 : _c.type) == bugfinder_localityrecorder_commit_1.GitFileType.modified);
            });
            if (cpsMatched.length > 0) {
                return cpsMatched[0];
            }
            else if (cpsMatched.length > 1) {
                (_a = CommitPath.logger) === null || _a === void 0 ? void 0 : _a.info("Found more than 1 matching CommitPath in one Commit. This seems to be an error." +
                    "Most likely the CommitPath.getNextPredecessor function has a bug.");
            }
            curOrder--;
        }
        return null;
    };
    /**
     * Normalizes CommitPaths so that no duplicate Commits are stored.
     * All commitPaths are mapped to their commitKey and path and all unique commits are collected
     * @param commitPaths
     */
    CommitPath.normalize = function (commitPaths) {
        var cps = commitPaths.map(function (cp) {
            return { parentKey: cp.parentKey, path: cp.path };
        });
        var commits = [];
        var commitMap = new Map();
        commitPaths.forEach(function (cp) {
            var cp_commit = cp.commit;
            if (commitMap.get(cp_commit.key()) != null) {
                return;
            }
            commitMap.set(cp_commit.key(), cp_commit);
            commits.push(cp_commit);
        });
        return {
            commitPaths: cps,
            commits: commits
        };
    };
    /**
     * Returns an array of all commits within the commitPaths given
     * @param commitPaths
     */
    CommitPath.getCommits = function (commitPaths) {
        var e_2, _a;
        var map = this.getCommitsMap(commitPaths);
        var commits = [];
        try {
            for (var _b = __values(map.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                var commitPath = map.get(key)[0];
                var commit = commitPath.commit;
                commits.push(commit);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return commits;
    };
    /**
     * Returns a map of commit hashes to CommitPaths which belong to that commit(-hash)
     * @param commitPaths
     */
    CommitPath.getCommitsMap = function (commitPaths) {
        var map = new Map();
        commitPaths.forEach(function (commitPath, i) {
            var commit = CommitPath._commitMap.get(commitPath.parentKey);
            var val = map.get(commit.hash);
            var commitPathsWithHash = val == null ? [] : val;
            commitPathsWithHash.push(commitPath);
            map.set(commit.hash, commitPathsWithHash);
        });
        return map;
    };
    /**
     * Return an array of Commits containing each CommitPath. Array of commits is ordered in same order as
     * commitPaths given a parameter
     * @param commitPaths
     */
    CommitPath.getCommitsOrdered = function (commitPaths) {
        var commits = CommitPath.getCommitsMap(commitPaths);
        var orderedCommits = new Array();
        var visited = new Map();
        commitPaths.forEach(function (commitPath) {
            var parent = commitPath.commit;
            if (!visited.get(parent.hash))
                orderedCommits.push(commits.get(parent.hash));
            visited.set(parent.hash, true);
        });
        return orderedCommits;
    };
    /**
     * Gets the n predecessors of the cur CommitPath containing the CommitPaths which have the cur.hash.
     * If there are less than n predecessors all predecessors are returned.
     * All CommitPaths are needed to reconstruct the Commit-History.
     * Strategy: Branch-Nodes are always the nearest historic nodes. @See default: git log
     * @param cur
     * @param all
     * @param n
     */
    CommitPath.getPredecessorCommitPaths = function (cur, all, n) {
        var e_3, _a;
        var commitMap = CommitPath.getCommitsMap(all);
        var commits = [];
        try {
            for (var _b = __values(commitMap.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                var commitPath = commitMap.get(key)[0];
                var parent_1 = commitPath.commit;
                commits.push(parent_1);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        // @formatter:off
        var commit = cur.commit;
        var curCommitPath = commitMap.get(commit.hash)[0];
        var parentCommit = curCommitPath.commit;
        // @formatter:on
        var predecessorHashes = bugfinder_localityrecorder_commit_1.Commit.getPredecessorCommits(parentCommit, commits, n)
            .map(function (predecessor) {
            return predecessor.hash;
        });
        var predecessors = [];
        predecessorHashes.forEach(function (hash) {
            var commitPaths = commitMap.get(hash);
            predecessors.push(commitPaths);
        });
        return predecessors;
    };
    CommitPath.prototype.is = function (other) {
        var parent = CommitPath._commitMap.get(this.parentKey);
        var otherParent = other.commit;
        return this.path ?
            parent.is(otherParent) && this.path.path === other.path.path
            : parent.is(otherParent);
    };
    CommitPath.prototype.key = function () {
        var string = this.path ? this.parentKey + this.path.path : this.parentKey;
        return crypto.createHash("sha1").update(string).digest("hex");
    };
    CommitPath.prototype.setMethods = function (localityDTO) {
        /**
         * TODO: Noch mal überlegen, ob ich nicht irgendwie doch den Konstruktor aufrufen könnte und dann Werte setzen könnte
         * So ist das extrem hacky und nicht ganz sauber, wer weiß was TypeScript sonst noch alles setzt, wenn Objekte erzeugt werden
         * evtl: leeren CommitPath erzeugen und dann über Object.keys vom DTO iterieren und alles übertragen, was bekannt ist? deepClone?
         * Nachteil: Performanz
         */
        // @formatter:off
        localityDTO.is = CommitPath.prototype.is;
        localityDTO.key = CommitPath.prototype.key;
        localityDTO.setMethods = CommitPath.prototype.setMethods;
        var commitPropertyDescriptors = Object.getOwnPropertyDescriptors(CommitPath.prototype).commit;
        Object.defineProperty(localityDTO, "commit", {
            get: commitPropertyDescriptors.get,
            set: commitPropertyDescriptors.set
        });
        // @formatter:on
    };
    Object.defineProperty(CommitPath.prototype, "commit", {
        get: function () {
            return CommitPath.commitMap.get(this.parentKey);
        },
        set: function (commit) {
            // TODO: überlegen ob bisheriger Commit gelöscht werden sollte | also bisheriger parentKey
            this.parentKey = commit.key();
            CommitPath.pushCommit(commit);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Map of Commit.key to Commit. Used to normalize CommitPaths and reduce redundancy
     * It is not a common use case to change anything in this map!
     */
    CommitPath._commitMap = new Map();
    /**
     * All Commits of all CommitPaths known.
     * It is not a common use case to change this array. Usually only CommitPath is using this
     * to normalize CommitPaths to Commits and the Paths of CommitPaths
     */
    CommitPath._commits = [];
    // used for getNPredecessors: Performance optimization
    CommitPath.orderedLocalities = new Map();
    __decorate([
        (0, inversify_1.optional)(),
        (0, inversify_1.inject)(TYPES_1.BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES.logger),
        __metadata("design:type", Object)
    ], CommitPath, "logger", void 0);
    return CommitPath;
}());
exports.CommitPath = CommitPath;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWl0UGF0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21taXRQYXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBaUM7QUFFakMsdUZBQStFO0FBQy9FLHVDQUEyQztBQUMzQyxpQ0FBb0U7QUFHcEU7SUE2SUksb0JBQVksTUFBZSxFQUFFLElBQWM7UUFDdkMsSUFBSSxNQUFNLElBQUksSUFBSTtZQUFFLE9BQU87UUFDM0IsVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBM0hEOzs7Ozs7T0FNRztJQUNJLHFCQUFVLEdBQWpCLFVBQWtCLE1BQWM7UUFDNUIsSUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQy9CLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxFQUFFO1lBQzlDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2pDLFVBQVUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNoRDtJQUNMLENBQUM7SUFLRCxzQkFBVyxxQkFBTztRQUhsQjs7V0FFRzthQUNIO1lBQ0ksT0FBTyxVQUFVLENBQUMsUUFBUSxDQUFDO1FBQy9CLENBQUM7OztPQUFBO0lBS0Qsc0JBQVcsdUJBQVM7UUFIcEI7O1dBRUc7YUFDSDtZQUNJLE9BQU8sVUFBVSxDQUFDLFVBQVUsQ0FBQztRQUNqQyxDQUFDOzs7T0FBQTtJQUVEOzs7Ozs7OztPQVFH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