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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredecessorDefault = void 0;
var bugfinder_localityrecorder_commit_1 = require("bugfinder-localityrecorder-commit");
var bugfinder_framework_1 = require("bugfinder-framework");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJlZGVjZXNzb3JEZWZhdWx0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1pdFBhdGgvUHJlZGVjZXNzb3JEZWZhdWx0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVGQUE4RDtBQUM5RCwyREFBZ0Q7QUFNaEQ7O0dBRUc7QUFDSDtJQU1JLDRCQUFvQixNQUFlO1FBQWYsV0FBTSxHQUFOLE1BQU0sQ0FBUztRQUxuQyxzREFBc0Q7UUFDOUMsc0JBQWlCLEdBQThCLElBQUksR0FBRyxFQUF3QixDQUFBO0lBS3RGLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7T0FXRztJQUNILGdEQUFtQixHQUFuQixVQUFvQixVQUF3QixFQUFFLENBQVMsRUFBRSxLQUFjLEVBQUUsYUFBMkI7O1FBR2hHLElBQU0sS0FBSyxHQUFHLElBQUksaUNBQVcsRUFBNEIsQ0FBQTtRQUN6RCxJQUFJLHFCQUFxQixHQUFHLENBQUMsQ0FBQTtRQUU3QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN4QyxJQUFNLEdBQUcsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDekIsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUM7Z0JBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBa0IsQ0FBQywyQkFBc0IsQ0FBQyxZQUFPLFVBQVUsQ0FBQyxNQUFNLG1CQUFnQixDQUFDLENBQUE7WUFFbkcsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFBO1lBQ2IsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNqRSxJQUFJLENBQUMs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