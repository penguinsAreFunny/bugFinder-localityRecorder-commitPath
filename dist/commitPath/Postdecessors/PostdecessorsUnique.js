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
exports.PostdecessorsUnique = void 0;
var bugfinder_localityrecorder_commit_1 = require("bugfinder-localityrecorder-commit");
var bugfinder_framework_1 = require("bugfinder-framework");
var underscore_1 = __importDefault(require("underscore"));
var PostdecessorsUnique = /** @class */ (function () {
    function PostdecessorsUnique(logger) {
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
    PostdecessorsUnique.prototype.getNPostdecessorsMap = function (localities, n, upToN, allLocalities) {
        var e_1, _a, e_2, _b;
        //
        var posts = new bugfinder_framework_1.LocalityMap();
        // all localities used in predecessors are stored here with the flag that they are already used
        var allPosts = new bugfinder_framework_1.LocalityMap();
        var locsWithExactlyNPosts = 0;
        var localitiesCopy = localities.slice();
        // order all localities by commit.order beginning with highest
        var orderedLocs = underscore_1.default.sortBy(localitiesCopy, function (loc) {
            return -loc.commit.order;
        });
        var initLength = orderedLocs.length;
        for (var i = 0; i < initLength; i++) {
            var loc = orderedLocs[i];
            // this locality is already inside a sequence
            if (allPosts.getVal(loc) != null)
                continue;
            var post = [];
            post = i == 0 ? this.getNPostdecessors(loc, n, upToN, allLocalities) :
                this.getNPostdecessors(loc, n, upToN, allLocalities, false);
            if (post == null) {
                posts.set(loc, post);
                continue;
            }
            if (post.length == n)
                locsWithExactlyNPosts++;
            // do not take predecessors to result if one of the predecessors is already taken!
            var duplicateFound = false;
            try {
                for (var post_1 = (e_1 = void 0, __values(post)), post_1_1 = post_1.next(); !post_1_1.done; post_1_1 = post_1.next()) {
                    var p = post_1_1.value;
                    if (allPosts.getVal(p) != null) {
                        duplicateFound = true;
                        break;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (post_1_1 && !post_1_1.done && (_a = post_1.return)) _a.call(post_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (duplicateFound)
                continue;
            try {
                // set all used localities
                for (var post_2 = (e_2 = void 0, __values(post)), post_2_1 = post_2.next(); !post_2_1.done; post_2_1 = post_2.next()) {
                    var p = post_2_1.value;
                    allPosts.set(p, true);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (post_2_1 && !post_2_1.done && (_b = post_2.return)) _b.call(post_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            posts.set(loc, post);
            if (i % 50 == 0)
                console.log("INFO\tCalculated the " + n + " postdecessors from " + (i + 1) + " of " + localities.length + " localities...");
            if (i == localities.length - 1)
                console.log("INFO\tCalculated the " + n + " postdecessors from " + (i + 1) + " of " + localities.length + " localities.");
        }
        return posts;
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
    PostdecessorsUnique.prototype.getNPostdecessors = function (locality, n, upToN, allLocalities, initMode) {
        var e_3, _a;
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
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (allLocalities_1_1 && !allLocalities_1_1.done && (_a = allLocalities_1.return)) _a.call(allLocalities_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            this.orderedLocalities = orderedLocalities;
            this.maxOrder = maxOrder;
        }
        else {
            // get Map and maxOrder from last calculations with initMode = true
            orderedLocalities = this.orderedLocalities;
            maxOrder = this.maxOrder;
        }
        // calculating postdecessor CommitPaths
        var curOrder = locality.commit.order - 1;
        var postdecessors = [locality];
        while (postdecessors.length < n) {
            var post = this.getNextPostdecessor((_b = locality.path) === null || _b === void 0 ? void 0 : _b.path, orderedLocalities, curOrder, maxOrder, allLocalities);
            if (post == null)
                break;
            postdecessors.push(post);
            curOrder = post.commit.order + 1;
        }
        if (!upToN && postdecessors.length < n) {
            return null;
        }
        return postdecessors;
    };
    /**
     * Returns the next postdecessor CommitPath, returns null if all localities until maxOrder were searched
     * and no match was found
     * @param path of the CommitPath of which the predecessor should be returned
     * @param orderedLocalities a map of order (of all localities: CommitPath[]) to CommitPath[] with that order
     * @param beginOrder order of the CommitPath of which the predecessor should be returned
     * @param maxOrder max order of allLocalities
     * @param allLocalities
     */
    PostdecessorsUnique.prototype.getNextPostdecessor = function (path, orderedLocalities, beginOrder, maxOrder, allLocalities) {
        var _a;
        var curOrder = beginOrder;
        while (curOrder <= maxOrder) {
            var cps = orderedLocalities.get(curOrder);
            if (cps == null) {
                curOrder++;
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
                    + "an error. " + "Most likely the this.getNextPostdecessor function has a bug.");
            }
            curOrder++;
        }
        return null;
    };
    return PostdecessorsUnique;
}());
exports.PostdecessorsUnique = PostdecessorsUnique;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUG9zdGRlY2Vzc29yc1VuaXF1ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21taXRQYXRoL1Bvc3RkZWNlc3NvcnMvUG9zdGRlY2Vzc29yc1VuaXF1ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx1RkFBOEQ7QUFDOUQsMkRBQWdEO0FBRWhELDBEQUEyQjtBQUkzQjtJQUVJLDZCQUFvQixNQUFlO1FBQWYsV0FBTSxHQUFOLE1BQU0sQ0FBUztRQUduQyxzREFBc0Q7UUFDOUMsc0JBQWlCLEdBQThCLElBQUksR0FBRyxFQUF3QixDQUFBO0lBSHRGLENBQUM7SUFRRDs7Ozs7Ozs7Ozs7T0FXRztJQUNILGtEQUFvQixHQUFwQixVQUFxQixVQUF3QixFQUN4QixDQUFTLEVBQ1QsS0FBYyxFQUNkLGFBQTJCOztRQUc1QyxFQUFFO1FBQ0YsSUFBTSxLQUFLLEdBQTBDLElBQUksaUNBQVcsRUFBNEIsQ0FBQTtRQUNoRywrRkFBK0Y7UUFDL0YsSUFBTSxRQUFRLEdBQXFDLElBQUksaUNBQVcsRUFBdUIsQ0FBQTtRQUN6RixJQUFJLHFCQUFxQixHQUFHLENBQUMsQ0FBQTtRQUU3QixJQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUE7UUFDekMsOERBQThEO1FBQzlELElBQUksV0FBVyxHQUFHLG9CQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxVQUFDLEdBQUc7WUFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFBO1FBQzVCLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQTtRQUNyQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2pDLElBQU0sR0FBRyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMxQiw2Q0FBNkM7WUFDN0MsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUk7Z0JBQUUsU0FBUTtZQUUxQyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUE7WUFDYixJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFFL0QsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO2dCQUNkLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFBO2dCQUNwQixTQUFRO2FBQ1g7WUFFRCxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQztnQkFDaEIscUJBQXFCLEVBQUUsQ0FBQTtZQUUzQixrRkFBa0Y7WUFDbEYsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFBOztnQkFDMUIsS0FBZ0IsSUFBQSx3QkFBQSxTQUFBLElBQUksQ0FBQSxDQUFBLDBCQUFBLDRDQUFFO29CQUFqQixJQUFNLENBQUMsaUJBQUE7b0JBQ1IsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRTt3QkFDNUIsY0FBYyxHQUFHLElBQUksQ0FBQTt3QkFDckIsTUFBSztxQkFDUjtpQkFDSjs7Ozs7Ozs7O1lBQ0QsSUFBSSxjQUFjO2dCQUFFLFNBQVE7O2dCQUU1QiwwQkFBMEI7Z0JBQzFCLEtBQWdCLElBQUEsd0JBQUEsU0FBQSxJQUFJLENBQUEsQ0FBQSwwQkFBQSw0Q0FBRTtvQkFBakIsSUFBTSxDQUFDLGlCQUFBO29CQUNSLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO2lCQUN4Qjs7Ozs7Ozs7O1lBQ0QsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUE7WUFFcEIsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUM7Z0JBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBd0IsQ0FBQyw2QkFBdUIsQ0FBQyxHQUFDLENBQUMsYUFBTyxVQUFVLENBQUMsTUFBTSxtQkFBZ0IsQ0FBQyxDQUFBO1lBQzVHLElBQUksQ0FBQyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEdBQUMsQ0FBQztnQkFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBd0IsQ0FBQyw2QkFBdUIsQ0FBQyxHQUFDLENBQUMsYUFBTyxVQUFVLENBQUMsTUFBTSxpQkFBYyxDQUFDLENBQUE7U0FDN0c7UUFFRCxPQUFPLEtBQUssQ0FBQTtJQUNoQixDQUFDO0lBRUQ7Ozs7Ozs7Ozs7T0FVRztJQUNILCtDQUFpQixHQUFqQixVQUFrQixRQUFvQixFQUNwQixDQUFTLEVBQ1QsS0FBYyxFQUNkLGFBQTJCLEVBQzNCLFFBQXdCOzs7UUFBeEIseUJBQUEsRUFBQSxlQUF3QjtRQUd0QyxJQUFJLGFBQWEsSUFBSSxJQUFJLElBQUksYUFBYSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDcEQsT0FBTyxFQUFFLENBQUE7U0FDWjtRQUVELElBQUksaUJBQTRDLENBQUE7UUFDaEQsSUFBSSxRQUFnQixDQUFBO1FBQ3BCLGlDQUFpQztRQUNqQyxJQUFJLFFBQVEsRUFBRTtZQUNWLHVEQUF1RDtZQUN2RCxpQkFBaUIsR0FBRyxJQUFJLEdBQUcsRUFBd0IsQ0FBQTtZQUNuRCxRQUFRLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUE7O2dCQUV4QyxLQUFtQixJQUFBLGtCQUFBLFNBQUEsYUFBYSxDQUFBLDRDQUFBLHVFQUFFO29CQUE3QixJQUFNLElBQUksMEJBQUE7b0JBQ1gsSUFBSSxHQUFHLEdBQUcsaUJBQWlCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7b0JBQ2xELEdBQUcsR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsd0NBQUssR0FBRyxZQUFFLElBQUksU0FBQyxDQUFBO29CQUMzQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUE7b0JBRTdDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsUUFBUTt3QkFBRSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUE7aUJBQ2pFOzs7Ozs7Ozs7WUFDRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUE7WUFDMUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7U0FDM0I7YUFBTTtZQUNILG1FQUFtRTtZQUNuRSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUE7WUFDMUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUE7U0FDM0I7UUFFRCx1Q0FBdUM7UUFDdkMsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFBO1FBQ3hDLElBQU0sYUFBYSxHQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBRTlDLE9BQU8sYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDN0IsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQUEsUUFBUSxDQUFDLElBQUksMENBQUUsSUFBSSxFQUFFLGlCQUFpQixFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQzVGLGFBQWEsQ0FBQyxDQUFBO1lBQ2xCLElBQUksSUFBSSxJQUFJLElBQUk7Z0JBQUUsTUFBSztZQUV2QixhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ3hCLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUE7U0FDbkM7UUFFRCxJQUFJLENBQUMsS0FBSyxJQUFJLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3BDLE9BQU8sSUFBSSxDQUFBO1NBQ2Q7UUFFRCxPQUFPLGFBQWEsQ0FBQTtJQUN4QixDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSCxpREFBbUIsR0FBbkIsVUFBb0IsSUFBWSxFQUFFLGlCQUE0QyxFQUFFLFVBQWtCLEVBQzlFLFFBQWdCLEVBQUUsYUFBMkI7O1FBQzdELElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQTtRQUV6QixPQUFPLFFBQVEsSUFBSSxRQUFRLEVBQUU7WUFFekIsSUFBTSxHQUFHLEdBQUcsaUJBQWlCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQzNDLElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtnQkFDYixRQUFRLEVBQUUsQ0FBQTtnQkFDVixTQUFRO2FBQ1g7WUFFRCxJQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQUEsRUFBRTs7Z0JBQzVCLE9BQU8sQ0FBQSxNQUFBLEVBQUUsQ0FBQyxJQUFJLDBDQUFFLElBQUksS0FBSSxJQUFJO29CQUN4QixDQUFDLENBQUEsTUFBQSxFQUFFLENBQUMsSUFBSSwwQ0FBRSxJQUFJLEtBQUksK0NBQVcsQ0FBQyxLQUFLLElBQUksQ0FBQSxNQUFBLEVBQUUsQ0FBQyxJQUFJLDBDQUFFLElBQUksS0FBSSwrQ0FBVyxDQUFDLFFBQVE7MkJBQ3JFLENBQUEsTUFBQSxFQUFFLENBQUMsSUFBSSwwQ0FBRSxJQUFJLEtBQUksK0NBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUNyRCxDQUFDLENBQUMsQ0FBQTtZQUNGLElBQUksVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3ZCLE9BQU8sVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFBO2FBQ3ZCO2lCQUFNLElBQUksVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQzlCLE1BQUEsSUFBSSxDQUFDLE1BQU0sMENBQUUsSUFBSSxDQUFDLHVFQUF1RTtzQkFDbkYsWUFBWSxHQUFHLDhEQUE4RCxDQUFDLENBQUE7YUFDdkY7WUFDRCxRQUFRLEVBQUUsQ0FBQTtTQUNiO1FBQ0QsT0FBTyxJQUFJLENBQUE7SUFDZixDQUFDO0lBRUwsMEJBQUM7QUFBRCxDQUFDLEFBMUxELElBMExDO0FBMUxZLGtEQUFtQiJ9