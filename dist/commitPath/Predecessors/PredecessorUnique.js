"use strict";
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
exports.PredecessorsUnique = void 0;
var bugfinder_localityrecorder_commit_1 = require("bugfinder-localityrecorder-commit");
var bugfinder_framework_1 = require("bugfinder-framework");
var underscore_1 = __importDefault(require("underscore"));
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
        var e_1, _a, e_2, _b;
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
            var pred = [];
            pred = i == 0 ? this.getNPredecessors(loc, n, upToN, allLocalities) :
                this.getNPredecessors(loc, n, upToN, allLocalities, false);
            if (pred == null) {
                preds.set(loc, pred);
                continue;
            }
            if (pred.length == n)
                locsWithExactlyNPreds++;
            // do not take predecessors to result if one of the predecessors is already taken!
            var duplicateFound = false;
            try {
                for (var pred_1 = (e_1 = void 0, __values(pred)), pred_1_1 = pred_1.next(); !pred_1_1.done; pred_1_1 = pred_1.next()) {
                    var p = pred_1_1.value;
                    if (allPreds.getVal(p) != null) {
                        duplicateFound = true;
                        break;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (pred_1_1 && !pred_1_1.done && (_a = pred_1.return)) _a.call(pred_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (duplicateFound)
                continue;
            try {
                // set all used localities
                for (var pred_2 = (e_2 = void 0, __values(pred)), pred_2_1 = pred_2.next(); !pred_2_1.done; pred_2_1 = pred_2.next()) {
                    var p = pred_2_1.value;
                    allPreds.set(p, true);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (pred_2_1 && !pred_2_1.done && (_b = pred_2.return)) _b.call(pred_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            preds.set(loc, pred);
            if (i % 50 == 0)
                console.log("INFO\tCalculated the " + n + " predecessors from " + (i + 1) + " of " + localities.length + " localities...");
            if (i == localities.length - 1)
                console.log("INFO\tCalculated the " + n + " predecessors from " + (i + 1) + " of " + localities.length + " localities.");
        }
        return preds;
    };
    /**
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
        var e_3, _a;
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
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (allLocalities_1_1 && !allLocalities_1_1.done && (_a = allLocalities_1.return)) _a.call(allLocalities_1);
                }
                finally { if (e_3) throw e_3.error; }
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
                break;
            predecessors.push(pred);
            curOrder = pred.commit.order - 1;
        }
        if (!upToN && predecessors.length < n) {
            return null;
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJlZGVjZXNzb3JVbmlxdWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWl0UGF0aC9QcmVkZWNlc3NvcnMvUHJlZGVjZXNzb3JVbmlxdWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUZBQThEO0FBQzlELDJEQUE4RDtBQUU5RCwwREFBMkI7QUFJM0I7SUFFSSw0QkFBb0IsTUFBZTtRQUFmLFdBQU0sR0FBTixNQUFNLENBQVM7UUFHbkMsc0RBQXNEO1FBQzlDLHNCQUFpQixHQUE4QixJQUFJLEdBQUcsRUFBd0IsQ0FBQTtJQUh0RixDQUFDO0lBUUQ7Ozs7Ozs7Ozs7O09BV0c7SUFDSCxnREFBbUIsR0FBbkIsVUFBb0IsVUFBd0IsRUFDeEIsQ0FBUyxFQUNULEtBQWMsRUFDZCxhQUEyQjs7UUFHM0MsRUFBRTtRQUNGLElBQU0sS0FBSyxHQUEwQyxJQUFJLGlDQUFXLEVBQTRCLENBQUE7UUFDaEcsK0ZBQStGO1FBQy9GLElBQU0sUUFBUSxHQUFxQyxJQUFJLGlDQUFXLEVBQXVCLENBQUE7UUFDekYsSUFBSSxxQkFBcUIsR0FBRyxDQUFDLENBQUE7UUFFN0IsSUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFBO1FBQ3pDLDhEQUE4RDtRQUM5RCxJQUFJLFdBQVcsR0FBRyxvQkFBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsVUFBQyxHQUFHO1lBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQTtRQUM1QixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUE7UUFDckMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNqQyxJQUFNLEdBQUcsR0FBRyxXQUFXLENB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