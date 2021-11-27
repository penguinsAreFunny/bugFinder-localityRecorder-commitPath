import {GitFileType} from "bugfinder-localityrecorder-commit";
import {LocalityMap} from "bugfinder-framework";
import {Logger} from "ts-log";
import _ from "underscore";
import {CommitPath} from "../commitPath";
import {PostdecessorsDelegation} from "./PostdecessorsDelegation";

export class PostdecessorsUnique implements PostdecessorsDelegation {

    constructor(private logger?: Logger) {
    }

    // used for getNPredecessors: Performance optimization
    private orderedLocalities: Map<number, CommitPath[]> = new Map<number, CommitPath[]>()
    // used for getNPredecessors
    private maxOrder: number


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
    getNPostdecessorsMap(localities: CommitPath[],
                         n: number,
                         upToN: boolean,
                         allLocalities: CommitPath[])
        : LocalityMap<CommitPath, CommitPath[]> {

        //
        const posts: LocalityMap<CommitPath, CommitPath[]> = new LocalityMap<CommitPath, CommitPath[]>()
        // all localities used in predecessors are stored here with the flag that they are already used
        const allPosts: LocalityMap<CommitPath, boolean> = new LocalityMap<CommitPath, boolean>()
        let locsWithExactlyNPosts = 0

        const localitiesCopy = localities.slice()
        // order all localities by commit.order beginning with highest
        let orderedLocs = _.sortBy(localitiesCopy, (loc) => {
            return -loc.commit.order
        })

        const initLength = orderedLocs.length
        for (let i = 0; i < initLength; i++) {
            const loc = orderedLocs[i]
            // this locality is already inside a sequence
            if (allPosts.getVal(loc) != null) continue

            let post = []
            post = i == 0 ? this.getNPostdecessors(loc, n, upToN, allLocalities) :
                this.getNPostdecessors(loc, n, upToN, allLocalities, false)

            if (post == null) {
                posts.set(loc, post)
                continue
            }

            if (post.length == n)
                locsWithExactlyNPosts++

            // do not take predecessors to result if one of the predecessors is already taken!
            let duplicateFound = false
            for (const p of post) {
                if (allPosts.getVal(p) != null) {
                    duplicateFound = true
                    break
                }
            }
            if (duplicateFound) continue

            // set all used localities
            for (const p of post) {
                allPosts.set(p, true)
            }
            posts.set(loc, post)

            if (i % 50 == 0)
                console.log(`INFO\tCalculated the ${n} postdecessors from ${i+1} of ${localities.length} localities...`)
            if (i == localities.length-1)
                console.log(`INFO\tCalculated the ${n} postdecessors from ${i+1} of ${localities.length} localities.`)
        }

        return posts
    }

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
    getNPostdecessors(locality: CommitPath,
                      n: number,
                      upToN: boolean,
                      allLocalities: CommitPath[],
                      initMode: boolean = true)
        : CommitPath[] {

        if (allLocalities == null || allLocalities.length == 0) {
            return []
        }

        let orderedLocalities: Map<number, CommitPath[]>
        let maxOrder: number
        // init: performance optimization
        if (initMode) {
            // init map from order to CommitPath[] and set minOrder
            orderedLocalities = new Map<number, CommitPath[]>()
            maxOrder = allLocalities[0].commit.order

            for (const aLoc of allLocalities) {
                let cps = orderedLocalities.get(aLoc.commit.order)
                cps = cps == null ? [aLoc] : [...cps, aLoc]
                orderedLocalities.set(aLoc.commit.order, cps)

                if (aLoc.commit.order > maxOrder) maxOrder = aLoc.commit.order
            }
            this.orderedLocalities = orderedLocalities
            this.maxOrder = maxOrder
        } else {
            // get Map and maxOrder from last calculations with initMode = true
            orderedLocalities = this.orderedLocalities
            maxOrder = this.maxOrder
        }

        // calculating postdecessor CommitPaths
        let curOrder = locality.commit.order - 1
        const postdecessors: CommitPath[] = [locality]

        while (postdecessors.length < n) {
            const post = this.getNextPostdecessor(locality.path?.path, orderedLocalities, curOrder, maxOrder,
                allLocalities)
            if (post == null) break

            postdecessors.push(post)
            curOrder = post.commit.order + 1
        }

        if (!upToN && postdecessors.length < n) {
            return null
        }

        return postdecessors
    }

    /**
     * Returns the next postdecessor CommitPath, returns null if all localities until maxOrder were searched
     * and no match was found
     * @param path of the CommitPath of which the predecessor should be returned
     * @param orderedLocalities a map of order (of all localities: CommitPath[]) to CommitPath[] with that order
     * @param beginOrder order of the CommitPath of which the predecessor should be returned
     * @param maxOrder max order of allLocalities
     * @param allLocalities
     */
    getNextPostdecessor(path: string, orderedLocalities: Map<number, CommitPath[]>, beginOrder: number,
                        maxOrder: number, allLocalities: CommitPath[]): CommitPath {
        let curOrder = beginOrder

        while (curOrder <= maxOrder) {

            const cps = orderedLocalities.get(curOrder)
            if (cps == null) {
                curOrder++
                continue
            }

            const cpsMatched = cps.filter(cp => {
                return cp.path?.path == path &&
                    (cp.path?.type == GitFileType.added || cp.path?.type == GitFileType.modified
                        || cp.path?.type == GitFileType.injected)
            })
            if (cpsMatched.length > 0) {
                return cpsMatched[0]
            } else if (cpsMatched.length > 1) {
                this.logger?.info("Found more than 1 matching CommitPath in one Commit. This seems to be"
                    + "an error. " + "Most likely the this.getNextPostdecessor function has a bug.")
            }
            curOrder++
        }
        return null
    }

}