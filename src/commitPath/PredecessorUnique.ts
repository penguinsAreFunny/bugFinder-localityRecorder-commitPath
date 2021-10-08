import {GitFileType} from "bugfinder-localityrecorder-commit";
import {LocalityMap} from "bugfinder-framework";
import {Logger} from "ts-log";
import _ from "underscore";
import {PredecessorDelegation} from "./PredecessorDelegation";
import {CommitPath} from "./commitPath";

export class PredecessorsUnique implements PredecessorDelegation {
    // used for getNPredecessors: Performance optimization
    private orderedLocalities: Map<number, CommitPath[]> = new Map<number, CommitPath[]>()
    // used for getNPredecessors
    private minOrder: number

    constructor(private logger?: Logger) {
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
    getNPredecessorsMap(localities: CommitPath[],
                        n: number,
                        upToN: boolean,
                        allLocalities: CommitPath[])
        : LocalityMap<CommitPath, CommitPath[]> {

        //
        const preds: LocalityMap<CommitPath, CommitPath[]> = new LocalityMap<CommitPath, CommitPath[]>()
        // all localities used in predecessors are stored here with the flag that they are already used
        const allPreds: LocalityMap<CommitPath, boolean> = new LocalityMap<CommitPath, boolean>()
        let locsWithExactlyNPreds = 0

        const localitiesCopy = localities.slice()
        // order all localities by commit.order beginning with highest
        let orderedLocs = _.sortBy(localitiesCopy, (loc) => {
            return -loc.commit.order
        })

        const initLength = orderedLocs.length
        for (let i = 0; i < initLength; i++) {
            const loc = orderedLocs[i]
            // this locality is already inside a sequence
            if (allPreds.getVal(loc) != null) continue

            if (i % 50 == 0 && i != 0)
                console.log(`Calculated the ${n} predecessors from ${i} of ${localities.length} localities...`)

            let pred = []
            pred = i == 0 ? this.getNPredecessors(loc, n, upToN, allLocalities) :
                this.getNPredecessors(loc, n, upToN, allLocalities, false)

            if (pred?.length == n)
                locsWithExactlyNPreds++

            // do not take predecessors to result if one of the predecessors is already taken!
            let duplicateFound = false
            for (const p of pred) {
                if (allPreds.getVal(p) != null) {
                    duplicateFound = true
                    break
                }
            }
            if (duplicateFound) continue

            // set all used localities
            for (const p of pred) {
                allPreds.set(p, true)
            }
            preds.set(loc, pred)
        }

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
            const pred = this.getNextPredecessor(locality.path?.path, orderedLocalities, curOrder, minOrder,
                allLocalities)
            if (pred == null) return predecessors

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
                    (cp.path?.type == GitFileType.added || cp.path?.type == GitFileType.modified
                        || cp.path?.type == GitFileType.injected)
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