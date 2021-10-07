import { Locality, LocalityMap } from "bugfinder-framework";
import { Commit, GitFile } from "bugfinder-localityrecorder-commit";
import { Logger } from "ts-log";
export interface PredecessorDelegation {
    getNPredecessorsMap(localities: CommitPath[], n: number, upToN: boolean, allLocalities: CommitPath[]): LocalityMap<CommitPath, CommitPath[]>;
    getNPredecessors(locality: CommitPath, n: number, upToN: boolean, allLocalities: CommitPath[], initMode: any): CommitPath[];
    getNextPredecessor(path: string, orderedLocalities: Map<number, CommitPath[]>, beginOrder: number, minOrder: number, allLocalities: CommitPath[]): CommitPath;
}
/**
 * Calculates predecessors of a CommitPath.
 */
export declare class PredecessorDefault implements PredecessorDelegation {
    private logger?;
    private orderedLocalities;
    private minOrder;
    constructor(logger?: Logger);
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
export declare class CommitPath implements Locality {
    static _logger?: Logger;
    static set logger(logger: Logger);
    static get logger(): Logger;
    /**
     * Map of Commit.key to Commit. Used to normalize CommitPaths and reduce redundancy
     * It is not a common use case to change anything in this map!
     */
    static _commitMap: Map<string, Commit>;
    /**
     * All Commits of all CommitPaths known.
     * It is not a common use case to change this array. Usually only CommitPath is using this
     * to normalize CommitPaths to Commits and the Paths of CommitPaths
     */
    static _commits: Commit[];
    /**
     * Delegation to calculate predecessors with different strategies
     * @private
     */
    private static predecessorDelegation;
    /**
     * Set the predecessorDelegation to change the method of calculating predecessors
     * @param predecessorDelegation
     */
    static setPredecessorDelegation(predecessorDelegation: PredecessorDelegation): void;
    /**
     * To change method of calculating predecessors @see CommitPath.setPredecessorDelegation
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
    static getNPredecessorsMap(localities: CommitPath[], n: number, upToN: boolean, allLocalities: CommitPath[]): LocalityMap<CommitPath, CommitPath[]>;
    /**
     * To change method of calculating predecessors @see CommitPath.setPredecessorDelegation
     * Returns up to n predecessor CommitPaths of locality. Predecessors match the path of locality
     * Returns null on finding less than n predecessors if upToN is false
     * Set initMode after first call to false to achieve performance optimization
     * @param locality
     * @param n
     * @param upToN also return predecessors if less than n predecessors are found. False: return null if less than
     *        n predecessors are found
     * @param allLocalities
     * @param initMode initializes map over allLocalities. If you want to call this function many times with same
     *                 allLocalities you can set this to false after first call!
     *                 This will achieve huge performance advantages.
     */
    static getNPredecessors(locality: CommitPath, n: number, upToN: boolean, allLocalities: CommitPath[], initMode: any): CommitPath[];
    /**
     * Returns the next predecessor CommitPath, returns null if all localities until minOrder were searched
     * and no match was found
     * @param path of the CommitPath of which the predecessor should be returned
     * @param orderedLocalities a map of order (of all localities: CommitPath[]) to CommitPath[] with that order
     * @param beginOrder order of the CommitPath of which the predecessor should be returned
     * @param minOrder min order of allLocalities
     * @param allLocalities
     */
    static getNextPredecessor(path: string, orderedLocalities: Map<number, CommitPath[]>, beginOrder: number, minOrder: number, allLocalities: CommitPath[]): CommitPath;
    /**
     * To achieve normalization und reduce redundancy commits
     * are stored static and received functional with getter method
     * of CommitPath objects. All commits need to be stored once.
     * Push every commit which is referenced in a CommitPath instance.
     * @param commit
     */
    static pushCommit(commit: Commit): void;
    /**
     * Returns all commits handled by static CommitPath
     */
    static get commits(): Commit[];
    /**
     * Returns a map of commit.key to commits. Used to normalize CommitPaths and reduce redundancy.
     */
    static get commitMap(): Map<string, Commit>;
    static removeFromMap(locality: CommitPath, map: Map<number, CommitPath[]>): void;
    /**
     * Removing locality from array
     * @param locality
     * @param array
     * @private
     */
    static removeFromCPArray(locality: CommitPath, array: CommitPath[]): CommitPath[];
    constructor(commit?: Commit, path?: GitFile);
    /**
     * Normalizes CommitPaths so that no duplicate Commits are stored.
     * All commitPaths are mapped to their commitKey and path and all unique commits are collected
     * @param commitPaths
     */
    static normalize(commitPaths: CommitPath[]): {
        commitPaths: {
            parentKey: string;
            path: GitFile;
        }[];
        commits: Commit[];
    };
    /**
     * Returns an array of all commits within the commitPaths given
     * @param commitPaths
     */
    static getCommits(commitPaths: CommitPath[]): Commit[];
    /**
     * Returns a map of commit hashes to CommitPaths which belong to that commit(-hash)
     * @param commitPaths
     */
    static getCommitsMap(commitPaths: CommitPath[]): Map<string, CommitPath[]>;
    /**
     * Return an array of Commits containing each CommitPath. Array of commits is ordered in same order as
     * commitPaths given a parameter
     * @param commitPaths
     */
    static getCommitsOrdered(commitPaths: CommitPath[]): Array<CommitPath[]>;
    /**
     * Gets the n predecessors of the cur CommitPath containing the CommitPaths which have the cur.hash.
     * If there are less than n predecessors all predecessors are returned.
     * All CommitPaths are needed to reconstruct the Commit-History.
     * Strategy: Branch-Nodes are always the nearest historic nodes. @See default: git log
     * @param cur
     * @param all
     * @param n
     */
    static getPredecessorCommitPaths(cur: CommitPath, all: CommitPath[], n: number): Array<CommitPath[]>;
    is(other: CommitPath): boolean;
    key(): string;
    setMethods(localityDTO: CommitPath): void;
    get commit(): Commit;
    set commit(commit: Commit);
    /**
     * (file)path of a commit which should be measured and annotated
     * file can be undefined if commit does not affect a file. These commitsPaths are needed to
     * reconstruct Commit-History. example for undeinfed files: certain merge commits
     */
    path?: GitFile;
    parentKey: string;
}
