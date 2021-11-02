import { LocalityMap } from "bugfinder-framework";
import { Logger } from "ts-log";
import { CommitPath } from "../commitPath";
import { PostdecessorsDelegation } from "./PostdecessorsDelegation";
export declare class PostdecessorsUnique implements PostdecessorsDelegation {
    private logger?;
    constructor(logger?: Logger);
    private orderedLocalities;
    private maxOrder;
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
    getNPostdecessorsMap(localities: CommitPath[], n: number, upToN: boolean, allLocalities: CommitPath[]): LocalityMap<CommitPath, CommitPath[]>;
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
    getNPostdecessors(locality: CommitPath, n: number, upToN: boolean, allLocalities: CommitPath[], initMode?: boolean): CommitPath[];
    /**
     * Returns the next postdecessor CommitPath, returns null if all localities until maxOrder were searched
     * and no match was found
     * @param path of the CommitPath of which the predecessor should be returned
     * @param orderedLocalities a map of order (of all localities: CommitPath[]) to CommitPath[] with that order
     * @param beginOrder order of the CommitPath of which the predecessor should be returned
     * @param maxOrder max order of allLocalities
     * @param allLocalities
     */
    getNextPostdecessor(path: string, orderedLocalities: Map<number, CommitPath[]>, beginOrder: number, maxOrder: number, allLocalities: CommitPath[]): CommitPath;
}
