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
exports.PostdecessorsDefault = void 0;
var bugfinder_localityrecorder_commit_1 = require("bugfinder-localityrecorder-commit");
var bugfinder_framework_1 = require("bugfinder-framework");
/**
 * Calculates predecessors of a CommitPath.
 */
var PostdecessorsDefault = /** @class */ (function () {
    function PostdecessorsDefault(logger) {
        this.logger = logger;
        // used for getNPredecessors: Performance optimization
        this.orderedLocalities = new Map();
    }
    /**
     * Performance optimizes wrapper call to CommitPath.getNPostdecessors
     * Returns up to n postdecessors for each CommitPath of localities
     * @param localities
     * @param n
     * @param upToN
     * @param allLocalities
     */
    PostdecessorsDefault.prototype.getNPostdecessorsMap = function (localities, n, upToN, allLocalities) {
        var _a, _b;
        var posts = new bugfinder_framework_1.LocalityMap();
        var locsWithExactlyNPosts = 0;
        for (var i = 0; i < localities.length; i++) {
            var loc = localities[i];
            var post = [];
            post = i == 0 ? this.getNPostdecessors(loc, n, upToN, allLocalities) :
                this.getNPostdecessors(loc, n, upToN, allLocalities, false);
            if ((post === null || post === void 0 ? void 0 : post.length) == n)
                locsWithExactlyNPosts++;
            if ((post === null || post === void 0 ? void 0 : post.length) > n)
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.error("Error during getNPostdecessorsArray: got more than " + n + " postdecessors.");
            posts.set(loc, post);
            if (i % 50 == 0)
                console.log("INFO\tCalculated the " + n + " postdecessors from " + (i + 1) + " of " + localities.length + " localities...");
            if (i == localities.length - 1)
                console.log("INFO\tCalculated the " + n + " postdecessors from " + (i + 1) + " of " + localities.length + " localities.");
        }
        (_b = this.logger) === null || _b === void 0 ? void 0 : _b.info("Found " + locsWithExactlyNPosts + " localities with exactly " + n + " postdecessors.");
        return posts;
    };
    /**
     * Returns up to n postdecessors CommitPaths of locality including locality.
     * Postdecessors match the path of locality
     * Returns null on finding less than n postdecessors if upToN is false
     * @param locality
     * @param n
     * @param upToN also return postdecessors if less than n postdecessors are found. False: return null if less than
     *        n postdecessors are found
     * @param allLocalities
     * @param initMode initializes map over allLocalities. If you want to call this function many times with same
     *          allLocalities you can set this to false after first call! This will achieve huge performance advantages
     */
    PostdecessorsDefault.prototype.getNPostdecessors = function (locality, n, upToN, allLocalities, initMode) {
        var e_1, _a;
        var _b;
        if (initMode === void 0) { initMode = true; }
        if (allLocalities == null || allLocalities.length == 0) {
            return [];
        }
        var orderedLocalities;
        var maxOrder;
        // init: performance optimization
        if (initMode) {
            // init map from order to CommitPath[] and set minOrder
            orderedLocalities = new Map();
            maxOrder = allLocalities[0].commit.order;
            try {
                for (var allLocalities_1 = __values(allLocalities), allLocalities_1_1 = allLocalities_1.next(); !allLocalities_1_1.done; allLocalities_1_1 = allLocalities_1.next()) {
                    var aLoc = allLocalities_1_1.value;
                    var cps = orderedLocalities.get(aLoc.commit.order);
                    cps = cps == null ? [aLoc] : __spreadArray(__spreadArray([], __read(cps), false), [aLoc], false);
                    orderedLocalities.set(aLoc.commit.order, cps);
                    if (aLoc.commit.order > maxOrder)
                        maxOrder = aLoc.commit.order;
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
            this.maxOrder = maxOrder;
        }
        else {
            // get Map and minOrder from last calculations with initMode = true
            orderedLocalities = this.orderedLocalities;
            maxOrder = this.maxOrder;
        }
        // calculating predecessor CommitPaths
        var curOrder = locality.commit.order + 1;
        var postdecessors = [locality];
        while (postdecessors.length < n) {
            var post = this.getNextPostdecessor((_b = locality.path) === null || _b === void 0 ? void 0 : _b.path, orderedLocalities, curOrder, maxOrder, allLocalities);
            if (post == null)
                break;
            postdecessors.push(post);
            curOrder = post.commit.order + 1;
        }
        if (!upToN && postdecessors.length < n)
            return null;
        return postdecessors;
    };
    /**
     * Returns the next predecessor CommitPath, returns null if all localities until minOrder were searched
     * and no match was found
     * @param path of the CommitPath of which the predecessor should be returned
     * @param orderedLocalities a map of order (of all localities: CommitPath[]) to CommitPath[] with that order
     * @param beginOrder order of the CommitPath of which the predecessor should be returned
     * @param maxOrder min order of allLocalities
     * @param allLocalities
     */
    PostdecessorsDefault.prototype.getNextPostdecessor = function (path, orderedLocalities, beginOrder, maxOrder, allLocalities) {
        var _a;
        var curOrder = beginOrder;
        while (curOrder <= maxOrder) {
            var cps = orderedLocalities.get(curOrder);
            if (cps == null) {
                curOrder++;
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
                    + "an error. " + "Most likely the this.getNextPostdecessor function has a bug.");
            }
            curOrder++;
        }
        return null;
    };
    return PostdecessorsDefault;
}());
exports.PostdecessorsDefault = PostdecessorsDefault;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUG9zdGRlY2Vzc29yc0RlZmF1bHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWl0UGF0aC9Qb3N0ZGVjZXNzb3JzL1Bvc3RkZWNlc3NvcnNEZWZhdWx0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVGQUE4RDtBQUM5RCwyREFBZ0Q7QUFNaEQ7O0dBRUc7QUFDSDtJQUVJLDhCQUFvQixNQUFlO1FBQWYsV0FBTSxHQUFOLE1BQU0sQ0FBUztRQUduQyxzREFBc0Q7UUFDOUMsc0JBQWlCLEdBQThCLElBQUksR0FBRyxFQUF3QixDQUFBO0lBSHRGLENBQUM7SUFPRDs7Ozs7OztPQU9HO0lBQ0gsbURBQW9CLEdBQXBCLFVBQXFCLFVBQXdCLEVBQUUsQ0FBUyxFQUFFLEtBQWMsRUFBRSxhQUEyQjs7UUFHakcsSUFBTSxLQUFLLEdBQUcsSUFBSSxpQ0FBVyxFQUE0QixDQUFBO1FBQ3pELElBQUkscUJBQXFCLEdBQUcsQ0FBQyxDQUFBO1FBRTdCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3hDLElBQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUV6QixJQUFJLElBQUksR0FBRyxFQUFFLENBQUE7WUFDYixJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFFL0QsSUFBSSxDQUFBLElBQUksYUFBSixJQUFJLHVCQUFKLElB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