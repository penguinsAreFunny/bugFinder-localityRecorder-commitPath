import {GitFileType} from "bugfinder-localityrecorder-commit";
import {LocalityMap} from "bugfinder-framework";
import {Logger} from "ts-log";
import {CommitPath} from "../commitPath";
import {PostdecessorsDelegation} from "./PostdecessorsDelegation";


/**
 * Calculates predecessors of a CommitPath.
 */
export class PostdecessorsDefault implements PostdecessorsDelegation {

    constructor(private logger?: Logger) {
    }

    // used for getNPredecessors: Performance optimization
    private orderedLocalities: Map<number, CommitPath[]> = new Map<number, CommitPath[]>()
    // used for getNPredecessors
    private maxOrder: number

    /**
     * Performance optimizes wrapper call to CommitPath.getNPostdecessors
     * Returns up to n postdecessors for each CommitPath of localities
     * @param localities
     * @param n
     * @param upToN
     * @param allLocalities
     */
    getNPostdecessorsMap(localities: CommitPath[], n: number, upToN: boolean, allLocalities: CommitPath[])
        : LocalityMap<CommitPath, CommitPath[]> {

        const posts = new LocalityMap<CommitPath, CommitPath[]>()
        let locsWithExactlyNPosts = 0

        for (let i = 0; i < localities.length; i++) {
            const loc = localities[i]
            if (i % 50 == 0)
                this.logger?.info(`Calculated the ${n} postdecessors from ${i} ` +
                    `of ${localities.length} localities...`)

            let post = []
            post = i == 0 ? this.getNPostdecessors(loc, n, upToN, allLocalities) :
                this.getNPostdecessors(loc, n, upToN, allLocalities, false)

            if (post?.length == n)
                locsWithExactlyNPosts++
            if (post?.length > n)
                this.logger?.error(`Error during getNPostdecessorsArray: got more than ${n} postdecessors.`)

            posts.set(loc, post)
        }

        this.logger?.info(`Found ${locsWithExactlyNPosts} localities with exactly ${n} postdecessors.`)
        return posts
    }

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
            // get Map and minOrder from last calculations with initMode = true
            orderedLocalities = this.orderedLocalities
            maxOrder = this.maxOrder
        }


        // calculating predecessor CommitPaths
        let curOrder = locality.commit.order + 1
        const postdecessors: CommitPath[] = [locality]

        while (postdecessors.length < n) {
            const post = this.getNextPostdecessor(locality.path?.path, orderedLocalities,
                curOrder, maxOrder, allLocalities)
            if (post == null) break

            postdecessors.push(post)
            curOrder = post.commit.order + 1
        }

        if (!upToN && postdecessors.length < n)
            return null
        return postdecessors
    }

    /**
     * Returns the next predecessor CommitPath, returns null if all localities until minOrder were searched
     * and no match was found
     * @param path of the CommitPath of which the predecessor should be returned
     * @param orderedLocalities a map of order (of all localities: CommitPath[]) to CommitPath[] with that order
     * @param beginOrder order of the CommitPath of which the predecessor should be returned
     * @param maxOrder min order of allLocalities
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
                    (cp.path?.type == GitFileType.added || cp.path?.type == GitFileType.modified)
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