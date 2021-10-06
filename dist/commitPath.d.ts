import { Locality } from "bugfinder-framework";
import { Commit, GitFile } from "bugfinder-localityrecorder-commit";
export declare class CommitPath implements Locality {
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
    /**
     * TODO: renaming of paths
     * Returns up to n predecessor CommitPaths of locality
     * @param locality
     * @param n
     * @param allLocalities
     */
    static getNPredecessors(locality: CommitPath, n: number, allLocalities: CommitPath[]): CommitPath[];
    /**
     * Returns the next predecessor CommitPath, returns null if all localities until minOrder were searched and no match was found
     * @param path of the CommitPath of which the predecessor should be returned
     * @param orderedLocalities a map of order (of all localities: CommitPath[]) to CommitPath[] with that order
     * @param beginOrder order of the CommitPath of which the predecessor should be returned
     * @param minOrder min order of allLocalities
     * @param allLocalities
     */
    static getNextPredecessor(path: string, orderedLocalities: Map<number, CommitPath[]>, beginOrder: number, minOrder: number, allLocalities: CommitPath[]): CommitPath;
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
     * file can be undefined if commit does not affect a file. These commitsPaths are needed to reconstruct Commit-History.
     * example for undeinfed files: certain merge commits
     */
    path?: GitFile;
    parentKey: string;
}
