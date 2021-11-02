import { LocalityMap } from "bugfinder-framework";
import { Logger } from "ts-log";
import { CommitPath } from "../commitPath";
import { PostdecessorsDelegation } from "./PostdecessorsDelegation";
/**
 * Calculates predecessors of a CommitPath.
 */
export declare class PostdecessorsDefault implements PostdecessorsDelegation {
    private logger?;
    constructor(logger?: Logger);
    private orderedLocalities;
    private maxOrder;
    /**
     * Performance optimizes wrapper call to CommitPath.getNPostdecessors
     * Returns up to n postdecessors for each CommitPath of localities
     * @param localities
     * @param n
     * @param upToN
     * @param allLocalities
     */
    getNPostdecessorsMap(localities: CommitPath[], n: number, upToN: boolean, allLocalities: CommitPath[]): LocalityMap<CommitPath, CommitPath[]>;
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
    getNPostdecessors(locality: CommitPath, n: number, upToN: boolean, allLocalities: CommitPath[], initMode?: boolean): CommitPath[];
    /**
     * Returns the next predecessor CommitPath, returns null if all localities until minOrder were searched
     * and no match was found
     * @param path of the CommitPath of which the predecessor should be returned
     * @param orderedLocalities a map of order (of all localities: CommitPath[]) to CommitPath[] with that order
     * @param beginOrder order of the CommitPath of which the predecessor should be returned
     * @param maxOrder min order of allLocalities
     * @param allLocalities
     */
    getNextPostdecessor(path: string, orderedLocalities: Map<number, CommitPath[]>, beginOrder: number, maxOrder: number, allLocalities: CommitPath[]): CommitPath;
}
