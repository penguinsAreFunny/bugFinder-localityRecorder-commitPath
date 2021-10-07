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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommitPath = exports.PredecessorsUnique = exports.PredecessorDefault = void 0;
var crypto = __importStar(require("crypto"));
var bugfinder_framework_1 = require("bugfinder-framework");
var bugfinder_localityrecorder_commit_1 = require("bugfinder-localityrecorder-commit");
var underscore_1 = __importDefault(require("underscore"));
/**
 * Calculates predecessors of a CommitPath.
 */
var PredecessorDefault = /** @class */ (function () {
    function PredecessorDefault(logger) {
        this.logger = logger;
        // used for getNPredecessors: Performance optimization
        this.orderedLocalities = new Map();
    }
    /**
     * Performance optimizes wrapper call to CommitPath.getNPredecessors
     * Returns up to n predecessors for each CommitPath of localities
     * Returned array is in same order as localities and has same length. return[i] has the predecessor CommitPaths
     * of localities[i].
     * return[i] is null if upToN is false (exactly n predecessors should be returned) and there were less than n
     * predecessors in allLocalities
     * @param localities
     * @param n
     * @param upToN
     * @param allLocalities
     */
    PredecessorDefault.prototype.getNPredecessorsMap = function (localities, n, upToN, allLocalities) {
        var _a, _b;
        var preds = new bugfinder_framework_1.LocalityMap();
        var locsWithExactlyNPreds = 0;
        for (var i = 0; i < localities.length; i++) {
            var loc = localities[i];
            if (i % 50 == 0)
                console.log("Calculated the " + n + " predecessors from " + i + " of " + localities.length + " localities...");
            var pred = [];
            pred = i == 0 ? this.getNPredecessors(loc, n, upToN, allLocalities) :
                this.getNPredecessors(loc, n, upToN, allLocalities, false);
            if ((pred === null || pred === void 0 ? void 0 : pred.length) == n)
                locsWithExactlyNPreds++;
            if ((pred === null || pred === void 0 ? void 0 : pred.length) > n)
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.error("Error during getNPredecessorsArray: got more than " + n + " predecessors.");
            preds.set(loc, pred);
        }
        (_b = this.logger) === null || _b === void 0 ? void 0 : _b.info("Found " + locsWithExactlyNPreds + " localities with exactly " + n + " predecessors.");
        return preds;
    };
    /**
     * TODO: renaming of paths
     * Returns up to n predecessor CommitPaths of locality including locality. Predecessors match the path of locality
     * Returns null on finding less than n predecessors if upToN is false
     * @param locality
     * @param n
     * @param upToN also return predecessors if less than n predecessors are found. False: return null if less than
     *        n predecessors are found
     * @param allLocalities
     * @param initMode initializes map over allLocalities. If you want to call this function many times with same
     *          allLocalities you can set this to false after first call! This will achieve huge performance advantages
     */
    PredecessorDefault.prototype.getNPredecessors = function (locality, n, upToN, allLocalities, initMode) {
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
            this.orderedLocalities = orderedLocalities;
            this.minOrder = minOrder;
        }
        else {
            // get Map and minOrder from last calculations with initMode = true
            orderedLocalities = this.orderedLocalities;
            minOrder = this.minOrder;
        }
        // calculating predecessor CommitPaths
        var curOrder = locality.commit.order - 1;
        var predecessors = [locality];
        while (predecessors.length < n) {
            var pred = this.getNextPredecessor((_b = locality.path) === null || _b === void 0 ? void 0 : _b.path, orderedLocalities, curOrder, minOrder, allLocalities);
            if (pred == null)
                return predecessors;
            predecessors.push(pred);
            curOrder = pred.commit.order - 1;
        }
        if (!upToN && predecessors.length < n)
            return null;
        return predecessors;
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
    PredecessorDefault.prototype.getNextPredecessor = function (path, orderedLocalities, beginOrder, minOrder, allLocalities) {
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
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info("Found more than 1 matching CommitPath in one Commit. This seems to be"
                    + "an error. " + "Most likely the this.getNextPredecessor function has a bug.");
            }
            curOrder--;
        }
        return null;
    };
    return PredecessorDefault;
}());
exports.PredecessorDefault = PredecessorDefault;
var PredecessorsUnique = /** @class */ (function () {
    function PredecessorsUnique(logger) {
        this.logger = logger;
        // used for getNPredecessors: Performance optimization
        this.orderedLocalities = new Map();
    }
    /**
     * Performance optimizes wrapper call to this.getNPredecessorsUnique
     * Returns up to n predecessors for each CommitPath of localities including the CommitPath itself
     * Returned array is in same order as localities and has same length. return[i] has the predecessor CommitPaths
     * of localities[i].
     * return[i] is null if upToN is false (exactly n predecessors should be returned) and there were less than n
     * predecessors in allLocalities
     * @param localities
     * @param n
     * @param upToN
     * @param allLocalities
     */
    PredecessorsUnique.prototype.getNPredecessorsMap = function (localities, n, upToN, allLocalities) {
        var e_2, _a, e_3, _b, e_4, _c;
        //
        var preds = new bugfinder_framework_1.LocalityMap();
        // all localities used in predecessors are stored here with the flag that they are already used
        var allPreds = new bugfinder_framework_1.LocalityMap();
        var locsWithExactlyNPreds = 0;
        var localitiesCopy = localities.slice();
        // order all localities by commit.order beginning with highest
        var orderedLocs = underscore_1.default.sortBy(localitiesCopy, function (loc) {
            return -loc.commit.order;
        });
        var initLength = orderedLocs.length;
        for (var i = 0; i < initLength; i++) {
            var loc = orderedLocs[i];
            // this locality is already inside a sequence
            if (allPreds.getVal(loc) != null)
                continue;
            if (i % 50 == 0 && i != 0)
                console.log("Calculated the " + n + " predecessors from " + i + " of " + localities.length + " localities...");
            var pred = [];
            pred = i == 0 ? this.getNPredecessors(loc, n, upToN, allLocalities) :
                this.getNPredecessors(loc, n, upToN, allLocalities, false);
            if ((pred === null || pred === void 0 ? void 0 : pred.length) == n)
                locsWithExactlyNPreds++;
            // do not take predecessors to result if one of the predecessors is already taken!
            var duplicateFound = false;
            try {
                for (var pred_1 = (e_2 = void 0, __values(pred)), pred_1_1 = pred_1.next(); !pred_1_1.done; pred_1_1 = pred_1.next()) {
                    var p = pred_1_1.value;
                    if (allPreds.getVal(p) != null) {
                        duplicateFound = true;
                        break;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (pred_1_1 && !pred_1_1.done && (_a = pred_1.return)) _a.call(pred_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            if (duplicateFound)
                continue;
            try {
                // set all used localities
                for (var pred_2 = (e_3 = void 0, __values(pred)), pred_2_1 = pred_2.next(); !pred_2_1.done; pred_2_1 = pred_2.next()) {
                    var p = pred_2_1.value;
                    allPreds.set(p, true);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (pred_2_1 && !pred_2_1.done && (_b = pred_2.return)) _b.call(pred_2);
                }
                finally { if (e_3) throw e_3.error; }
            }
            preds.set(loc, pred);
            try {
                //console.log("\nPred of ", loc.commit.order + " " + loc.path.path)
                for (var pred_3 = (e_4 = void 0, __values(pred)), pred_3_1 = pred_3.next(); !pred_3_1.done; pred_3_1 = pred_3.next()) {
                    var p = pred_3_1.value;
                    //   console.log("\t" + p.commit.order + " " + p.path.path)
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (pred_3_1 && !pred_3_1.done && (_c = pred_3.return)) _c.call(pred_3);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
        return preds;
    };
    /**
     * TODO: renaming of paths
     * Returns up to n predecessor CommitPaths of locality including locality. Predecessors match the path of locality
     * Returns null on finding less than n predecessors if upToN is false
     * @param locality
     * @param n
     * @param upToN also return predecessors if less than n predecessors are found. False: return null if less than
     *        n predecessors are found
     * @param allLocalities
     * @param initMode initializes map over allLocalities. If you want to call this function many times with same
     *          allLocalities you can set this to false after first call! This will achieve huge performance advantages
     */
    PredecessorsUnique.prototype.getNPredecessors = function (locality, n, upToN, allLocalities, initMode) {
        var e_5, _a;
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
                for (var allLocalities_2 = __values(allLocalities), allLocalities_2_1 = allLocalities_2.next(); !allLocalities_2_1.done; allLocalities_2_1 = allLocalities_2.next()) {
                    var aLoc = allLocalities_2_1.value;
                    var cps = orderedLocalities.get(aLoc.commit.order);
                    cps = cps == null ? [aLoc] : __spreadArray(__spreadArray([], __read(cps), false), [aLoc], false);
                    orderedLocalities.set(aLoc.commit.order, cps);
                    if (aLoc.commit.order < minOrder)
                        minOrder = aLoc.commit.order;
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (allLocalities_2_1 && !allLocalities_2_1.done && (_a = allLocalities_2.return)) _a.call(allLocalities_2);
                }
                finally { if (e_5) throw e_5.error; }
            }
            this.orderedLocalities = orderedLocalities;
            this.minOrder = minOrder;
        }
        else {
            // get Map and minOrder from last calculations with initMode = true
            orderedLocalities = this.orderedLocalities;
            minOrder = this.minOrder;
        }
        // calculating predecessor CommitPaths
        var curOrder = locality.commit.order - 1;
        var predecessors = [locality];
        while (predecessors.length < n) {
            var pred = this.getNextPredecessor((_b = locality.path) === null || _b === void 0 ? void 0 : _b.path, orderedLocalities, curOrder, minOrder, allLocalities);
            if (pred == null)
                return predecessors;
            predecessors.push(pred);
            curOrder = pred.commit.order - 1;
        }
        if (!upToN && predecessors.length < n)
            return null;
        return predecessors;
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
    PredecessorsUnique.prototype.getNextPredecessor = function (path, orderedLocalities, beginOrder, minOrder, allLocalities) {
        var _a;
        var curOrder = beginOrder;
        while (curOrder >= minOrder) {
            var cps = orderedLocalities.get(curOrder);
            if (cps == null) {
                curOrder--;
                continue;
            }
            var cpsMatched = cps.filter(function (cp) {
                // TODO: src wird im folgenden weggefiltert! weil localityPreprocessor src mit GitFileType.other injected
                // TODO: entweder src anders injecten oder das folgende parametrieren oder GitFileType.injected hinzufügen!
                var _a, _b, _c, _d;
                return ((_a = cp.path) === null || _a === void 0 ? void 0 : _a.path) == path &&
                    (((_b = cp.path) === null || _b === void 0 ? void 0 : _b.type) == bugfinder_localityrecorder_commit_1.GitFileType.added || ((_c = cp.path) === null || _c === void 0 ? void 0 : _c.type) == bugfinder_localityrecorder_commit_1.GitFileType.modified
                        || ((_d = cp.path) === null || _d === void 0 ? void 0 : _d.type) == bugfinder_localityrecorder_commit_1.GitFileType.injected);
            });
            if (cpsMatched.length > 0) {
                return cpsMatched[0];
            }
            else if (cpsMatched.length > 1) {
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info("Found more than 1 matching CommitPath in one Commit. This seems to be"
                    + "an error. " + "Most likely the this.getNextPredecessor function has a bug.");
            }
            curOrder--;
        }
        return null;
    };
    return PredecessorsUnique;
}());
exports.PredecessorsUnique = PredecessorsUnique;
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
            CommitPath.predecessorDelegation = new PredecessorDefault(logger);
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
     * To change method of calculating predecessors @see CommitPath.setPredecessorDelegation
     * Performance optimizes wrapper call to CommitPath.getNPredecessors
     * Returns up to n predecessors for each CommitPath of localities
     * Returned array is in same order as localities and has same length. return[i] has the predecessor CommitPaths
     * of localities[i].
     * return[i] is null if upToN is false (exactly n predecessors should be returned) and there were less than n
     * predecessors in allLocalities
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
        return CommitPath.getNPredecessors(locality, n, upToN, allLocalities, initMode);
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
        return CommitPath.getNextPredecessor(path, orderedLocalities, beginOrder, minOrder, allLocalities);
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
        var e_6, _a;
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
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (cps_1_1 && !cps_1_1.done && (_a = cps_1.return)) _a.call(cps_1);
            }
            finally { if (e_6) throw e_6.error; }
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
        var e_7, _a;
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
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (array_1_1 && !array_1_1.done && (_a = array_1.return)) _a.call(array_1);
            }
            finally { if (e_7) throw e_7.error; }
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
        var e_8, _a;
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
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_8) throw e_8.error; }
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
        var e_9, _a;
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
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_9) throw e_9.error; }
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
    /**
     * Delegation to calculate predecessors with different strategies
     * @private
     */
    CommitPath.predecessorDelegation = new PredecessorDefault();
    return CommitPath;
}());
exports.CommitPath = CommitPath;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWl0UGF0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2ltcGxlbWVudGF0aW9uL3NyYy8wMS1yZWNvcmRpbmcvMDFhLWxvY2FsaXRpZXMvY29tbWl0UGF0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQWlDO0FBQ2pDLDJEQUEwRDtBQUMxRCx1RkFBK0U7QUFFL0UsMERBQTJCO0FBa0IzQjs7R0FFRztBQUNIO0lBTUksNEJBQW9CLE1BQWU7UUFBZixXQUFNLEdBQU4sTUFBTSxDQUFTO1FBTG5DLHNEQUFzRDtRQUM5QyxzQkFBaUIsR0FBOEIsSUFBSSxHQUFHLEVBQXdCLENBQUE7SUFLdEYsQ0FBQztJQUVEOzs7Ozs7Ozs7OztPQVdHO0lBQ0gsZ0RBQW1CLEdBQW5CLFVBQW9CLFVBQXdCLEVBQUUsQ0FBUyxFQUFFLEtBQWMsRUFBRSxhQUEyQjs7UUFHaEcsSUFBTSxLQUFLLEdBQUcsSUFBSSxpQ0FBVyxFQUE0QixDQUFBO1FBQ3pELElBQUkscUJBQXFCLEdBQUcsQ0FBQyxDQUFBO1FBRTdCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3hDLElBQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUN6QixJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQztnQkFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFrQixDQUFDLDJCQUFzQixDQUFDLFlBQU8sVUFBVSxDQUFDLE1BQU0sbUJBQWdCLENBQUMsQ0FBQTtZQUVuRyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUE7WUFDYixJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdC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