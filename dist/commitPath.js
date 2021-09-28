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
var bugfinder_localityrecorder_commit_1 = require("bugfinder-localityrecorder-commit");
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
        var e_1, _a;
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
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
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
        var e_2, _a;
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
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
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
    return CommitPath;
}());
exports.CommitPath = CommitPath;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWl0UGF0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21taXRQYXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZDQUFpQztBQUVqQyx1RkFBa0U7QUFFbEU7SUE0Q0ksb0JBQVksTUFBZSxFQUFFLElBQWM7UUFDdkMsSUFBSSxNQUFNLElBQUksSUFBSTtZQUFFLE9BQU87UUFDM0IsVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBbENEOzs7Ozs7T0FNRztJQUNJLHFCQUFVLEdBQWpCLFVBQWtCLE1BQWM7UUFDNUIsSUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQy9CLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxFQUFFO1lBQzlDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2pDLFVBQVUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNoRDtJQUNMLENBQUM7SUFLRCxzQkFBVyxxQkFBTztRQUhsQjs7V0FFRzthQUNIO1lBQ0ksT0FBTyxVQUFVLENBQUMsUUFBUSxDQUFDO1FBQy9CLENBQUM7OztPQUFBO0lBS0Qsc0JBQVcsdUJBQVM7UUFIcEI7O1dBRUc7YUFDSDtZQUNJLE9BQU8sVUFBVSxDQUFDLFVBQVUsQ0FBQztRQUNqQyxDQUFDOzs7T0FBQTtJQVNEOzs7O09BSUc7SUFDSSxvQkFBUyxHQUFoQixVQUFpQixXQUF5QjtRQUd0QyxJQUFNLEdBQUcsR0FBRyxXQUFXLENBQUMsR0FB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