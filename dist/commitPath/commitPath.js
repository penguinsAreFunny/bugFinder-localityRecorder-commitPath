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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommitPath = void 0;
var crypto = __importStar(require("crypto"));
var bugfinder_framework_1 = require("bugfinder-framework");
var bugfinder_localityrecorder_commit_1 = require("bugfinder-localityrecorder-commit");
var inversify_1 = require("inversify");
var Predecessors_1 = require("./Predecessors");
var Postdecessors_1 = require("./Postdecessors");
var CommitPath = /** @class */ (function () {
    function CommitPath(commit, path) {
        if (commit == null)
            return;
        CommitPath.pushCommit(commit);
        this.parentKey = commit.key();
        this.path = path;
    }
    Object.defineProperty(CommitPath, "logger", {
        get: function () {
            return CommitPath._logger;
        },
        set: function (logger) {
            CommitPath._logger = logger;
            CommitPath.predecessorDelegation = new Predecessors_1.PredecessorDefault(logger);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Set the predecessorDelegation to change the method of calculating predecessors
     * @param predecessorDelegation
     */
    CommitPath.setPredecessorDelegation = function (predecessorDelegation) {
        CommitPath.predecessorDelegation = predecessorDelegation;
    };
    /**
     * Set the postdecessorDelegation to change the method of calculating postdecessors alias progeny
     * @param postdecessorDelegation
     */
    CommitPath.setPostdecessorDelegation = function (postdecessorDelegation) {
        CommitPath.postdecessorDelegation = postdecessorDelegation;
    };
    /**
     * To change method of calculating predecessors @see CommitPath.setPredecessorDelegation
     * Performance optimizes wrapper call to CommitPath.getNPostdecessors
     * Returns up to n postdecessors (progeny CommitPaths) for each CommitPath of localities
     * @param localities
     * @param n
     * @param upToN
     * @param allLocalities
     */
    CommitPath.getNPostdecessorMap = function (localities, n, upToN, allLocalities) {
        return CommitPath.postdecessorDelegation.getNPostdecessorsMap(localities, n, upToN, allLocalities);
    };
    /**
     * To change method of calculating predecessors @see CommitPath.setPredecessorDelegation
     * Returns up to n postdecessors CommitPaths of locality. Postdecessors match the path of locality
     * Returns null on finding less than n predecessors if upToN is false
     * Set initMode after first call to false to achieve performance optimization
     * @param locality
     * @param n
     * @param upToN also return predecessors if less than n predecessors are found. False: return null if less than
     *        n predecessors are found
     * @param allLocalities
     * @param initMode initializes map over allLocalities. If you want to call this function many times with same
     *                 allLocalities you can set this to false after first call!
     *                 This will achieve huge performance advantages.
     */
    CommitPath.getNPostdecessors = function (locality, n, upToN, allLocalities, initMode) {
        return CommitPath.postdecessorDelegation.getNPostdecessors(locality, n, upToN, allLocalities, initMode);
    };
    /**
     * Returns the next postdecessor CommitPath, returns null if all localities until maxOrder were searched
     * and no match was found
     * @param path of the CommitPath of which the predecessor should be returned
     * @param orderedLocalities a map of order (of all localities: CommitPath[]) to CommitPath[] with that order
     * @param beginOrder order of the CommitPath of which the predecessor should be returned
     * @param maxOrder min order of allLocalities
     * @param allLocalities
     */
    CommitPath.getNextPostdecessor = function (path, orderedLocalities, beginOrder, maxOrder, allLocalities) {
        return CommitPath.predecessorDelegation.getNextPredecessor(path, orderedLocalities, beginOrder, maxOrder, allLocalities);
    };
    /**
     * To change method of calculating predecessors @see CommitPath.setPredecessorDelegation
     * Performance optimizes wrapper call to CommitPath.getNPredecessors
     * Returns up to n predecessors for each CommitPath of localities
     * @param localities
     * @param n
     * @param upToN
     * @param allLocalities
     */
    CommitPath.getNPredecessorsMap = function (localities, n, upToN, allLocalities) {
        return CommitPath.predecessorDelegation.getNPredecessorsMap(localities, n, upToN, allLocalities);
    };
    /**
     * To change method of calculating predecessors @see CommitPath.setPredecessorDelegation
     * Returns up to n predecessor CommitPaths of locality. Predecessors match the path of locality
     * Returns null on finding less than n predecessors if upToN is false
     * Set initMode after first call to false to achieve performance optimization
     * @param locality
     * @param n
     * @param upToN also return predecessors if less than n predecessors are found. False: return null if less than
     *        n predecessors are found
     * @param allLocalities
     * @param initMode initializes map over allLocalities. If you want to call this function many times with same
     *                 allLocalities you can set this to false after first call!
     *                 This will achieve huge performance advantages.
     */
    CommitPath.getNPredecessors = function (locality, n, upToN, allLocalities, initMode) {
        return CommitPath.predecessorDelegation.getNPredecessors(locality, n, upToN, allLocalities, initMode);
    };
    /**
     * Returns the next predecessor CommitPath, returns null if all localities until minOrder were searched
     * and no match was found
     * @param path of the CommitPath of which the predecessor should be returned
     * @param orderedLocalities a map of order (of all localities: CommitPath[]) to CommitPath[] with that order
     * @param beginOrder order of the CommitPath of which the predecessor should be returned
     * @param minOrder min order of allLocalities
     * @param allLocalities
     */
    CommitPath.getNextPredecessor = function (path, orderedLocalities, beginOrder, minOrder, allLocalities) {
        return CommitPath.predecessorDelegation.getNextPredecessor(path, orderedLocalities, beginOrder, minOrder, allLocalities);
    };
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
    CommitPath.removeFromMap = function (locality, map) {
        var e_1, _a;
        var curOrder = locality.commit.order;
        var cps = map.get(curOrder);
        var newCPs = [];
        try {
            for (var cps_1 = __values(cps), cps_1_1 = cps_1.next(); !cps_1_1.done; cps_1_1 = cps_1.next()) {
                var cp = cps_1_1.value;
                // dont push pred -> will be removed
                if (cp.is(locality))
                    continue;
                newCPs.push(cp);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (cps_1_1 && !cps_1_1.done && (_a = cps_1.return)) _a.call(cps_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (newCPs.length == 0) {
            map.set(curOrder, undefined);
        }
        else {
            map.set(curOrder, newCPs);
        }
    };
    /**
     * Removing locality from array
     * @param locality
     * @param array
     * @private
     */
    CommitPath.removeFromCPArray = function (locality, array) {
        var e_2, _a;
        var newCPs = [];
        try {
            for (var array_1 = __values(array), array_1_1 = array_1.next(); !array_1_1.done; array_1_1 = array_1.next()) {
                var cp = array_1_1.value;
                // dont push pred -> will be removed
                if (cp.is(locality))
                    continue;
                newCPs.push(cp);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (array_1_1 && !array_1_1.done && (_a = array_1.return)) _a.call(array_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return newCPs;
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
        var e_3, _a;
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
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
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
        var e_4, _a;
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
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
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
    /**
     * Delegation to calculate predecessors with different strategies
     * @private
     */
    CommitPath.predecessorDelegation = new Predecessors_1.PredecessorDefault();
    /**
     * Delegation to calculate postdecessors with different strategies
     * @private
     */
    CommitPath.postdecessorDelegation = new Postdecessors_1.PostdecessorsDefault();
    __decorate([
        (0, inversify_1.optional)(),
        (0, inversify_1.inject)(bugfinder_framework_1.SHARED_TYPES.logger),
        __metadata("design:type", Object)
    ], CommitPath, "_logger", void 0);
    return CommitPath;
}());
exports.CommitPath = CommitPath;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWl0UGF0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21taXRQYXRoL2NvbW1pdFBhdGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQWlDO0FBQ2pDLDJEQUF3RTtBQUN4RSx1RkFBa0U7QUFDbEUsdUNBQTJDO0FBRTNDLCtDQUF5RTtBQUN6RSxpREFBOEU7QUFFOUU7SUFpT0ksb0JBQVksTUFBZSxFQUFFLElBQWM7UUFDdkMsSUFBSSxNQUFNLElBQUksSUFBSTtZQUFFLE9BQU87UUFDM0IsVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBak9ELHNCQUFXLG9CQUFNO2FBS2pCO1lBQ0ksT0FBTyxVQUFVLENBQUMsT0FBTyxDQUFBO1FBQzdCLENBQUM7YUFQRCxVQUFrQixNQUFjO1lBQzVCLFVBQVUsQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFBO1lBQzNCLFVBQVUsQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLGlDQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ3JFLENBQUM7OztPQUFBO0lBK0JEOzs7T0FHRztJQUNJLG1DQUF3QixHQUEvQixVQUFnQyxxQkFBNEM7UUFDeEUsVUFBVSxDQUFDLHFCQUFxQixHQUFHLHFCQUFxQixDQUFBO0lBQzVELENBQUM7SUFFRDs7O09BR0c7SUFDSSxvQ0FBeUIsR0FBaEMsVUFBaUMsc0JBQStDO1FBQzVFLFVBQVUsQ0FBQyxzQkFBc0IsR0FBRyxzQkFBc0IsQ0FBQTtJQUM5RCxDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSSw4QkFBbUIsR0FBMUIsVUFBMkIsVUFBd0IsRUFBRSxDQUFTLEVBQUUsS0FB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