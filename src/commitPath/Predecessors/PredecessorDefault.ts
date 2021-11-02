import {GitFileType} from "bugfinder-localityrecorder-commit";
import {LocalityMap} from "bugfinder-framework";
import {Logger} from "ts-log";
import {PredecessorDelegation} from "./PredecessorDelegation";
import {CommitPath} from "../commitPath";


/**
 * Calculates predecessors of a CommitPath.
 */
export class PredecessorDefault implements PredecessorDelegation {

    constructor(private logger?: Logger) {
    }

    // used for getNPredecessors: Performance optimization
    private orderedLocalities: Map<number, CommitPath[]> = new Map<number, CommitPath[]>()
    // used for getNPredecessors
    private minOrder: number

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
    getNPredecessorsMap(localities: CommitPath[], n: number, upToN: boolean, allLocalities: CommitPath[])
        : LocalityMap<CommitPath, CommitPath[]> {

        const preds = new LocalityMap<CommitPath, CommitPath[]>()
        let locsWithExactlyNPreds = 0

        for (let i = 0; i < localities.length; i++) {
            const loc = localities[i]
            if (i % 50 == 0)
                console.log(`Calculated the ${n} predecessors from ${i} of ${localities.length} localities...`)

            let pred = []
            pred = i == 0 ? this.getNPredecessors(loc, n, upToN, allLocalities) :
                this.getNPredecessors(loc, n, upToN, allLocalities, false)

            if (pred?.length == n)
                locsWithExactlyNPreds++
            if (pred?.length > n)
                this.logger?.error(`Error during getNPredecessorsArray: got more than ${n} predecessors.`)

            preds.set(loc, pred)
        }

        this.logger?.info(`Found ${locsWithExactlyNPreds} localities with exactly ${n} predecessors.`)
        return preds
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
    getNPredecessors(locality: CommitPath,
                     n: number,
                     upToN: boolean,
                     allLocalities: CommitPath[],
                     initMode: boolean = true)
        : CommitPath[] {

        if (allLocalities == null || allLocalities.length == 0) {
            return []
        }

        let orderedLocalities: Map<number, CommitPath[]>
        let minOrder: number
        // init: performance optimization
        if (initMode) {
            // init map from order to CommitPath[] and set minOrder
            orderedLocalities = new Map<number, CommitPath[]>()
            minOrder = allLocalities[0].commit.order

            for (const aLoc of allLocalities) {
                let cps = orderedLocalities.get(aLoc.commit.order)
                cps = cps == null ? [aLoc] : [...cps, aLoc]
                orderedLocalities.set(aLoc.commit.order, cps)

                if (aLoc.commit.order < minOrder) minOrder = aLoc.commit.order
            }
            this.orderedLocalities = orderedLocalities
            this.minOrder = minOrder
        } else {
            // get Map and minOrder from last calculations with initMode = true
            orderedLocalities = this.orderedLocalities
            minOrder = this.minOrder
        }


        // calculating predecessor CommitPaths
        let curOrder = locality.commit.order - 1
        const predecessors: CommitPath[] = [locality]

        while (predecessors.length < n) {
            const pred = this.getNextPredecessor(locality.path?.path, orderedLocalities, curOrder, minOrder, allLocalities)
            if (pred == null) break

            predecessors.push(pred)
            curOrder = pred.commit.order - 1
        }

        if (!upToN && predecessors.length < n)
            return null
        return predecessors
    }

    /**
     * Returns the next predecessor CommitPath, returns null if all localities until minOrder were searched
     * and no match was found
     * @param path of the CommitPath of which the predecessor should be returned
     * @param orderedLocalities a map of order (of all localities: CommitPath[]) to CommitPath[] with that order
     * @param beginOrder order of the CommitPath of which the predecessor should be returned
     * @param minOrder min order of allLocalities
     * @param allLocalities
     */
    getNextPredecessor(path: string, orderedLocalities: Map<number, CommitPath[]>, beginOrder: number,
                       minOrder: number, allLocalities: CommitPath[]): CommitPath {
        let curOrder = beginOrder

        while (curOrder >= minOrder) {

            const cps = orderedLocalities.get(curOrder)
            if (cps == null) {
                curOrder--
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
                    + "an error. " + "Most likely the this.getNextPredecessor function has a bug.")
            }
            curOrder--
        }
        return null
    }


}