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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var Predecessors_1 = require("./Predecessors");
var Postdecessors_1 = require("./Postdecessors");
/**
 * If you want logging in static methods you need to set
 * CommitPath.logger to some Logger manually as inversify does not
 * support static injections
 */
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
     * @param uniqueMode
     * @param allLocalities
     */
    CommitPath.getNPostdecessorMap = function (localities, n, upToN, uniqueMode, allLocalities) {
        var e_1, _a;
        if (n == 0) {
            var val = upToN ? [] : null;
            var ret = new bugfinder_framework_1.LocalityMap();
            try {
                for (var localities_1 = __values(localities), localities_1_1 = localities_1.next(); !localities_1_1.done; localities_1_1 = localities_1.next()) {
                    var loc = localities_1_1.value;
                    ret.set(loc, val);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (localities_1_1 && !localities_1_1.done && (_a = localities_1.return)) _a.call(localities_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return ret;
        }
        CommitPath.postdecessorDelegation = uniqueMode ?
            new Postdecessors_1.PostdecessorsUnique(this.logger) : new Postdecessors_1.PostdecessorsDefault(this.logger);
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
     * @param uniqueMode
     * @param allLocalities
     */
    CommitPath.getNPredecessorsMap = function (localities, n, upToN, uniqueMode, allLocalities) {
        var e_2, _a;
        if (n == 0) {
            var val = upToN ? [] : null;
            var ret = new bugfinder_framework_1.LocalityMap();
            try {
                for (var localities_2 = __values(localities), localities_2_1 = localities_2.next(); !localities_2_1.done; localities_2_1 = localities_2.next()) {
                    var loc = localities_2_1.value;
                    ret.set(loc, val);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (localities_2_1 && !localities_2_1.done && (_a = localities_2.return)) _a.call(localities_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return ret;
        }
        CommitPath.predecessorDelegation = uniqueMode ?
            new Predecessors_1.PredecessorsUnique(this.logger) : new Predecessors_1.PredecessorDefault(this.logger);
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
        var e_3, _a;
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
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (cps_1_1 && !cps_1_1.done && (_a = cps_1.return)) _a.call(cps_1);
            }
            finally { if (e_3) throw e_3.error; }
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
        var e_4, _a;
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
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (array_1_1 && !array_1_1.done && (_a = array_1.return)) _a.call(array_1);
            }
            finally { if (e_4) throw e_4.error; }
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
        var e_5, _a;
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
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
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
        var e_6, _a;
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
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
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
    return CommitPath;
}());
exports.CommitPath = CommitPath;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWl0UGF0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21taXRQYXRoL2NvbW1pdFBhdGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQWlDO0FBQ2pDLDJEQUF5RztBQUN6Ryx1RkFBa0U7QUFHbEUsK0NBQTZGO0FBQzdGLGlEQUFtRztBQUVuRzs7OztHQUlHO0FBQ0g7SUE4UEksb0JBQVksTUFBZSxFQUFFLElBQWM7UUFDdkMsSUFBSSxNQUFNLElBQUksSUFBSTtZQUFFLE9BQU87UUFDM0IsVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBN1BELHNCQUFXLG9CQUFNO2FBS2pCO1lBQ0ksT0FBTyxVQUFVLENBQUMsT0FBTyxDQUFBO1FBQzdCLENBQUM7YUFQRCxVQUFrQixNQUFjO1lBQzVCLFVBQVUsQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFBO1lBQzNCLFVBQVUsQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLGlDQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ3JFLENBQUM7OztPQUFBO0lBK0JEOzs7T0FHRztJQUNJLG1DQUF3QixHQUEvQixVQUFnQyxxQkFBNEM7UUFDeEUsVUFBVSxDQUFDLHFCQUFxQixHQUFHLHFCQUFxQixDQUFBO0lBQzVELENBQUM7SUFFRDs7O09BR0c7SUFDSSxvQ0FBeUIsR0FBaEMsVUFBaUMsc0JBQStDO1FBQzVFLFVBQVUsQ0FBQyxzQkFBc0IsR0FBRyxzQkFBc0IsQ0FBQTtJQUM5RCxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0ksOEJBQW1CLEdBQTFCLFVBQTJCLFVBQXdCLEVBQUUsQ0FBUyxFQUFFLEtBQWMsRUFBRSxVQUFtQixFQUFFLGFBQTJCOztRQUc1SCxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDUixJQUFNLEdBQUcsR0FBRyxLQUFLLENBQUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQSxDQUFDLENBQUMsSUFBSSxDQUFBO1lBQzNCLElBQU0sR0FBRyxHQUFHLElBQUksaUNBQVcsRUFBNEIsQ0FBQTs7Z0JBQ3ZELEtBQWtCLElBQUEsZUFBQSxTQUFBLFVBQVUsQ0FBQSxzQ0FBQSw4REFBRTtvQkFBekIsSUFBTSxHQUFHLHVCQUFBO29CQUNWLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFBO2lCQUNwQjs7Ozs7Ozs7O1lBQ0QsT0FBTyxHQUFHLENBQUE7U0FDYjtRQUVELFVBQVUsQ0FBQyxzQkFBc0IsR0FBRyxVQUFVLENBQUMsQ0FBQztZQUM1QyxJQUFJLG1DQUFtQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxvQ0FBb0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7UUFFaEYsT0FBTyxVQUFVLENBQUMsc0JBQXNCLENBQUMsb0JBQW9CLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUE7SUFDdEcsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7O09BYUc7SUFDSSw0QkFBaUIsR0FBeEIsVUFBeUIsUUFBb0IsRUFBRSxDQUFTLEVBQUUsS0FBYyxFQUFFLGFBQTJCLEVBQzVFLFFBQWE7UUFFbEMsT0FBTyxVQUFVLENBQUMsc0JBQXNCLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0lBQzNHLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNJLDhCQUFtQixHQUExQixVQUEyQixJQUFZLEVBQ1osaUJBQTRDLEVBQzVDLFVBQWtCLEVBQ2xCLFFBQWdCLEVBQ2hCLGFBQTJCO1FBRWxELE9BQU8sVUFBVSxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxVQUFVLEVBQzFGLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQTtJQUNoQyxDQUFDO0lBR0Q7Ozs7Ozs7OztPQVNHO0lBQ0ksOEJBQW1CLEdBQTFCLFVBQTJCLFVBQXdCLEVBQUUsQ0FBUyxFQUFFLEtBQWMsRUFBRSxVQUFtQixFQUN4RSxhQUEyQjs7UUFHbEQsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ1IsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFBLENBQUMsQ0FBQyxFQUFFLENBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQTtZQUMzQixJQUFNLEdBQUcsR0FBRyxJQUFJLGlDQUFXLEVBQTRCLENBQUE7O2dCQUN2RCxLQUFrQixJQUFBLGVBQUEsU0FBQSxVQUFVLENBQUEsc0NBQUEsOERBQUU7b0JBQXpCLElBQU0sR0FBRyx1QkFBQTtvQkFDVixHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQTtpQkFDcEI7Ozs7Ozs7OztZQUNELE9BQU8sR0FBRyxDQUFBO1NBQ2I7UUFFRCxVQUFVLENBQUMscUJBQXFCLEdBQUcsVUFBVSxDQUFDLENBQUM7WUFDM0MsSUFBSSxpQ0FBa0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksaUNBQWtCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBRTdFLE9BQU8sVUFBVSxDQUFDLHFCQUFxQixDQUFDLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFBO0lBQ3BHLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7OztPQWFHO0lBQ0ksMkJBQWdCLEdBQXZCLFVBQXdCLFFBQW9CLEVBQUUsQ0FBUyxFQUFFLEtBQWMsRUFBRSxhQUEyQixFQUFFLFFBQWE7UUFHL0csT0FBTyxVQUFVLENBQUMscUJBQXFCLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0lBQ3pHLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNJLDZCQUFrQixHQUF6QixVQUEwQixJQUFZLEVBQ1osaUJBQTRDLEVBQzVDLFVBQWtCLEVBQ2xCLFFBQWdCLEVBQ2hCLGFBQTJCO1FBRWpELE9BQU8sVUFBVSxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLGFBQWEsQ0FBQyxDQUFBO0lBQzVILENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxxQkFBVSxHQUFqQixVQUFrQixNQUFjO1FBQzVCLElBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUMvQixJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksRUFBRTtZQUM5QyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNqQyxVQUFVLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDaEQ7SUFDTCxDQUFDO0lBS0Qsc0JBQVcscUJBQU87UUFIbEI7O1dBRUc7YUFDSDtZQUNJLE9BQU8sVUFBVSxDQUFDLFFBQVEsQ0FBQztRQUMvQixDQUFDOzs7T0FBQTtJQUtELHNCQUFXLHVCQUFTO1FBSHBCOztXQUVHO2FBQ0g7WUFDSSxPQUFPLFVBQVUsQ0FBQyxVQUFVLENBQUM7UUFDakMsQ0FBQzs7O09BQUE7SUFHYSx3QkFBYSxHQUEzQixVQUE0QixRQUFvQixFQUFFLEdBQThCOztRQUM1RSxJQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQTtRQUN0QyxJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQzdCLElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQTs7WUFDakIsS0FBaUIsSUFBQSxRQUFBLFNBQUEsR0FBRyxDQUFBLHdCQUFBLHlDQUFFO2dCQUFqQixJQUFNLEVBQUUsZ0JBQUE7Z0JBQ1Qsb0NBQW9DO2dCQUNwQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDO29CQUFFLFNBQVE7Z0JBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7YUFDbEI7Ozs7Ozs7OztRQUVELElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDcEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUE7U0FDL0I7YUFBTTtZQUNILEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFBO1NBQzVCO0lBQ0wsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ1csNEJBQWlCLEdBQS9CLFVBQWdDLFFBQW9CLEVBQUUsS0FBbUI7O1FBQ3JFLElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQTs7WUFDakIsS0FBaUIsSUFBQSxVQUFBLFNBQUEsS0FBSyxDQUFBLDRCQUFBLCtDQUFFO2dCQUFuQixJQUFNLEVBQUUsa0JBQUE7Z0JBQ1Qsb0NBQW9DO2dCQUNwQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDO29CQUFFLFNBQVE7Z0JBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7YUFDbEI7Ozs7Ozs7OztRQUNELE9BQU8sTUFBTSxDQUFBO0lBQ2pCLENBQUM7SUFVRDs7OztPQUlHO0lBQ0ksb0JBQVMsR0FBaEIsVUFBaUIsV0FBeUI7UUFHdEMsSUFBTSxHQUFHLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEVBQUU7WUFDMUIsT0FBTyxFQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFDLENBQUE7UUFDbkQsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7UUFDN0IsSUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7UUFDNUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEVBQUU7WUFDbEIsSUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQztZQUM1QixJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksSUFBSSxFQUFFO2dCQUN4QyxPQUFPO2FBQ1Y7WUFDRCxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQTtZQUN6QyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFBO1FBRUYsT0FBTztZQUNILFdBQVcsRUFBRSxHQUFHO1lBQ2hCLE9BQU8sRUFBRSxPQUFPO1NBQ25CLENBQUE7SUFDTCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0kscUJBQVUsR0FBakIsVUFBa0IsV0FBeUI7O1FBQ3ZDLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDNUMsSUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDOztZQUM3QixLQUFrQixJQUFBLEtBQUEsU0FBQSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUEsZ0JBQUEsNEJBQUU7Z0JBQXpCLElBQU0sR0FBRyxXQUFBO2dCQUNWLElBQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLElBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7Z0JBQ2pDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDeEI7Ozs7Ozs7OztRQUNELE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFFRDs7O09BR0c7SUFDSSx3QkFBYSxHQUFwQixVQUFxQixXQUF5QjtRQUMxQyxJQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBd0IsQ0FBQztRQUU1QyxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUMsVUFBVSxFQUFFLENBQUM7WUFDOUIsSUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQy9ELElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pDLElBQU0sbUJBQW1CLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFDbkQsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3JDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQyxDQUFBO1FBRUYsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLDRCQUFpQixHQUF4QixVQUF5QixXQUF5QjtRQUM5QyxJQUFNLE9BQU8sR0FBOEIsVUFBVSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNqRixJQUFNLGNBQWMsR0FBRyxJQUFJLEtBQUssRUFBZ0IsQ0FBQztRQUNqRCxJQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBbUIsQ0FBQztRQUUzQyxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUEsVUFBVTtZQUMxQixJQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQUUsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1lBQzVFLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsQ0FBQTtRQUVGLE9BQU8sY0FBYyxDQUFDO0lBQzFCLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNJLG9DQUF5QixHQUFoQyxVQUFpQyxHQUFlLEVBQUUsR0FBaUIsRUFBRSxDQUFTOztRQUMxRSxJQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hELElBQU0sT0FBTyxHQUFhLEVBQUUsQ0FBQzs7WUFDN0IsS0FBa0IsSUFBQSxLQUFBLFNBQUEsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFBLGdCQUFBLDRCQUFFO2dCQUEvQixJQUFNLEdBQUcsV0FBQTtnQkFDVixJQUFNLFVBQVUsR0FBZSxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyRCxJQUFNLFFBQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO2dCQUNqQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQU0sQ0FBQyxDQUFDO2FBQ3hCOzs7Ozs7Ozs7UUFDRCxpQkFBaUI7UUFDakIsSUFBTSxNQUFNLEdBQTBCLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDakQsSUFBTSxhQUFhLEdBQW1CLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BFLElBQU0sWUFBWSxHQUFvQixhQUFhLENBQUMsTUFBTSxDQUFDO1FBQzNELGdCQUFnQjtRQUVoQixJQUFNLGlCQUFpQixHQUFHLDBDQUFNLENBQUMscUJBQXFCLENBQUMsWUFBWSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7YUFDM0UsR0FBRyxDQUFDLFVBQUEsV0FBVztZQUNaLE9BQU8sV0FBVyxDQUFDLElBQUksQ0FBQTtRQUMzQixDQUFDLENBQUMsQ0FBQztRQUdQLElBQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUN4QixpQkFBaUIsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO1lBQzFCLElBQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEMsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsQ0FBQTtRQUNGLE9BQU8sWUFBWSxDQUFDO0lBQ3hCLENBQUM7SUFFRCx1QkFBRSxHQUFGLFVBQUcsS0FBaUI7UUFDaEIsSUFBTSxNQUFNLEdBQVcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pFLElBQU0sV0FBVyxHQUFXLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFFekMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDZCxNQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSTtZQUM1RCxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsd0JBQUcsR0FBSDtRQUNJLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDNUUsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVELCtCQUFVLEdBQVYsVUFBVyxXQUF1QjtRQUM5Qjs7Ozs7V0FLRztRQUNILGlCQUFpQjtRQUNqQixXQUFXLENBQUMsRUFBRSxHQUFvQixVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQztRQUMxRCxXQUFXLENBQUMsR0FBRyxHQUFtQixVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQztRQUMzRCxXQUFXLENBQUMsVUFBVSxHQUFZLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO1FBQ2xFLElBQU0seUJBQXlCLEdBQUcsTUFBTSxDQUFDLHlCQUF5QixDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFFaEcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFO1lBQ3pDLEdBQUcsRUFBRSx5QkFBeUIsQ0FBQyxHQUFHO1lBQ2xDLEdBQUcsRUFBRSx5QkFBeUIsQ0FBQyxHQUFHO1NBQ3JDLENBQUMsQ0FBQztRQUNILGdCQUFnQjtJQUNwQixDQUFDO0lBRUQsc0JBQUksOEJBQU07YUFBVjtZQUNJLE9BQU8sVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3BELENBQUM7YUFFRCxVQUFXLE1BQWM7WUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDOUIsVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsQyxDQUFDOzs7T0FMQTtJQWpaRDs7O09BR0c7SUFDVyxxQkFBVSxHQUFHLElBQUksR0FBRyxFQUFrQixDQUFDO0lBRXJEOzs7O09BSUc7SUFDVyxtQkFBUSxHQUFhLEVBQUUsQ0FBQztJQUV0Qzs7O09BR0c7SUFDWSxnQ0FBcUIsR0FBMEIsSUFBSSxpQ0FBa0IsRUFBRSxDQUFBO0lBRXRGOzs7T0FHRztJQUNZLGlDQUFzQixHQUE0QixJQUFJLG9DQUFvQixFQUFFLENBQUE7SUF5WS9GLGlCQUFDO0NBQUEsQUEvYUQsSUErYUM7QUEvYVksZ0NBQVUifQ==