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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJlZGVjZXNzb3JVbmlxdWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWl0UGF0aC9QcmVkZWNlc3NvclVuaXF1ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx1RkFBOEQ7QUFDOUQsMkRBQWdEO0FBRWhELDBEQUEyQjtBQUkzQjtJQU1JLDRCQUFvQixNQUFlO1FBQWYsV0FBTSxHQUFOLE1BQU0sQ0FBUztRQUxuQyxzREFBc0Q7UUFDOUMsc0JBQWlCLEdBQThCLElBQUksR0FBRyxFQUF3QixDQUFBO0lBS3RGLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7T0FXRztJQUNILGdEQUFtQixHQUFuQixVQUFvQixVQUF3QixFQUN4QixDQUFTLEVBQ1QsS0FBYyxFQUNkLGFBQTJCOztRQUczQyxFQUFFO1FBQ0YsSUFBTSxLQUFLLEdBQTBDLElBQUksaUNBQVcsRUFBNEIsQ0FBQTtRQUNoRywrRkFBK0Y7UUFDL0YsSUFBTSxRQUFRLEdBQXFDLElBQUksaUNBQVcsRUFBdUIsQ0FBQTtRQUN6RixJQUFJLHFCQUFxQixHQUFHLENBQUMsQ0FBQTtRQUU3QixJQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUE7UUFDekMsOERBQThEO1FBQzlELElBQUksV0FBVyxHQUFHLG9CQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxVQUFDLEdBQUc7WUFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFBO1FBQzVCLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQTtRQUNyQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2pDLElBQU0sR0FBRyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FB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