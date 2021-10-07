import { LocalityMap } from "bugfinder-framework";
import { Logger } from "ts-log";
import { PredecessorDelegation } from "./PredecessorDelegation";
import { CommitPath } from "./commitPath";
export declare class PredecessorsUnique implements PredecessorDelegation {
    private logger?;
    private orderedLocalities;
    private minOrder;
    constructor(logger?: Logger);
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
    getNPredecessorsMap(localities: CommitPath[], n: number, upToN: boolean, allLocalities: CommitPath[]): LocalityMap<CommitPath, CommitPath[]>;
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
    getNPredecessors(locality: CommitPath, n: number, upToN: boolean, allLocalities: CommitPath[], initMode?: boolean): CommitPath[];
    /**
     * Returns the next predecessor CommitPath, returns null if all localities until minOrder were searched
     * and no match was found
     * @param path of the CommitPath of which the predecessor should be returned
     * @param orderedLocalities a map of order (of all localities: CommitPath[]) to CommitPath[] with that order
     * @param beginOrder order of the CommitPath of which the predecessor should be returned
     * @param minOrder min order of allLocalities
     * @param allLocalities
     */
    getNextPredecessor(path: string, orderedLocalities: Map<number, CommitPath[]>, beginOrder: number, minOrder: number, allLocalities: CommitPath[]): CommitPath;
}
