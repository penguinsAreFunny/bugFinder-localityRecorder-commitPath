import * as crypto from "crypto";
import {Locality} from "bugfinder-framework";
import {Commit, GitFile, GitFileType} from "bugfinder-localityrecorder-commit";
import {inject, optional} from "inversify";
import {BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES} from "./TYPES";
import {Logger} from "ts-log";

export class CommitPath implements Locality {

    @optional() @inject(BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES.logger)
    static logger: Logger

    /**
     * Map of Commit.key to Commit. Used to normalize CommitPaths and reduce redundancy
     * It is not a common use case to change anything in this map!
     */
    public static _commitMap = new Map<string, Commit>();

    /**
     * All Commits of all CommitPaths known.
     * It is not a common use case to change this array. Usually only CommitPath is using this
     * to normalize CommitPaths to Commits and the Paths of CommitPaths
     */
    public static _commits: Commit[] = [];

    // used for getNPredecessors: Performance optimization
    private static orderedLocalities: Map<number, CommitPath[]> = new Map<number, CommitPath[]>()
    // used for getNPredecessors
    private static minOrder: number

    /**
     * To achieve normalization und reduce redundancy commits
     * are stored static and received functional with getter method
     * of CommitPath objects. All commits need to be stored once.
     * Push every commit which is referenced in a CommitPath instance.
     * @param commit
     */
    static pushCommit(commit: Commit) {
        const commitKey = commit.key();
        if (CommitPath._commitMap.get(commitKey) == null) {
            CommitPath._commits.push(commit);
            CommitPath._commitMap.set(commitKey, commit);
        }
    }

    /**
     * Returns all commits handled by static CommitPath
     */
    static get commits(): Commit[] {
        return CommitPath._commits;
    }

    /**
     * Returns a map of commit.key to commits. Used to normalize CommitPaths and reduce redundancy.
     */
    static get commitMap(): Map<string, Commit> {
        return CommitPath._commitMap;
    }

    /**
     * TODO: renaming of paths
     * Returns up to n predecessor CommitPaths of locality. Predecessors match the path of locality
     * @param locality
     * @param n
     * @param allLocalities
     * @param initMode initializes map over allLocalities. If you want to call this function many times with same
     *          allLocalities you can set this to false after first call! This will achieve huge performance advantages
     */
    static getNPredecessors(locality: CommitPath, n: number, allLocalities: CommitPath[], initMode: boolean = true): CommitPath[] {
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
            CommitPath.orderedLocalities = orderedLocalities
            CommitPath.minOrder = minOrder
        } else {
            // get Map and minOrder from last calculations with initMode = true
            orderedLocalities = CommitPath.orderedLocalities
            minOrder = CommitPath.minOrder
        }


        // calculating predecessor CommitPaths
        let curOrder = locality.commit.order - 1
        const predecessors: CommitPath[] = []

        while (predecessors.length < n) {
            const pred = CommitPath
                .getNextPredecessor(locality.path?.path, orderedLocalities, curOrder, minOrder, allLocalities)
            if (pred == null) return predecessors

            predecessors.push(pred)
            curOrder = pred.commit.order - 1
        }
        return predecessors
    }

    /**
     * Returns the next predecessor CommitPath, returns null if all localities until minOrder were searched and no match was found
     * @param path of the CommitPath of which the predecessor should be returned
     * @param orderedLocalities a map of order (of all localities: CommitPath[]) to CommitPath[] with that order
     * @param beginOrder order of the CommitPath of which the predecessor should be returned
     * @param minOrder min order of allLocalities
     * @param allLocalities
     */
    static getNextPredecessor(path: string, orderedLocalities: Map<number, CommitPath[]>, beginOrder: number,
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
            } else if(cpsMatched.length > 1){
                CommitPath.logger?.info("Found more than 1 matching CommitPath in one Commit. This seems to be an error."+
                    "Most likely the CommitPath.getNextPredecessor function has a bug.")
            }
            curOrder--
        }
        return null
    }


    constructor(commit?: Commit, path?: GitFile) {
        if (commit == null) return;
        CommitPath.pushCommit(commit);
        this.parentKey = commit.key();
        this.path = path;
    }

    /**
     * Normalizes CommitPaths so that no duplicate Commits are stored.
     * All commitPaths are mapped to their commitKey and path and all unique commits are collected
     * @param commitPaths
     */
    static normalize(commitPaths: CommitPath[])
        : { commitPaths: { parentKey: string, path: GitFile }[], commits: Commit[] } {

        const cps = commitPaths.map(cp => {
            return {parentKey: cp.parentKey, path: cp.path}
        })

        const commits: Commit[] = [];
        const commitMap = new Map<string, Commit>();
        commitPaths.forEach(cp => {
            const cp_commit = cp.commit;
            if (commitMap.get(cp_commit.key()) != null) {
                return;
            }
            commitMap.set(cp_commit.key(), cp_commit)
            commits.push(cp_commit);
        })

        return {
            commitPaths: cps,
            commits: commits
        }
    }

    /**
     * Returns an array of all commits within the commitPaths given
     * @param commitPaths
     */
    static getCommits(commitPaths: CommitPath[]): Commit[] {
        const map = this.getCommitsMap(commitPaths);
        const commits: Commit[] = [];
        for (const key of map.keys()) {
            const commitPath = map.get(key)[0];
            const commit = commitPath.commit;
            commits.push(commit);
        }
        return commits;
    }

    /**
     * Returns a map of commit hashes to CommitPaths which belong to that commit(-hash)
     * @param commitPaths
     */
    static getCommitsMap(commitPaths: CommitPath[]): Map<string, CommitPath[]> {
        const map = new Map<string, CommitPath[]>();

        commitPaths.forEach((commitPath, i) => {
            const commit = CommitPath._commitMap.get(commitPath.parentKey);
            const val = map.get(commit.hash);
            const commitPathsWithHash = val == null ? [] : val;
            commitPathsWithHash.push(commitPath);
            map.set(commit.hash, commitPathsWithHash);
        })

        return map;
    }

    /**
     * Return an array of Commits containing each CommitPath. Array of commits is ordered in same order as
     * commitPaths given a parameter
     * @param commitPaths
     */
    static getCommitsOrdered(commitPaths: CommitPath[]): Array<CommitPath[]> {
        const commits: Map<string, CommitPath[]> = CommitPath.getCommitsMap(commitPaths);
        const orderedCommits = new Array<CommitPath[]>();
        const visited = new Map<string, boolean>();

        commitPaths.forEach(commitPath => {
            const parent = commitPath.commit;
            if (!visited.get(parent.hash)) orderedCommits.push(commits.get(parent.hash))
            visited.set(parent.hash, true);
        })

        return orderedCommits;
    }

    /**
     * Gets the n predecessors of the cur CommitPath containing the CommitPaths which have the cur.hash.
     * If there are less than n predecessors all predecessors are returned.
     * All CommitPaths are needed to reconstruct the Commit-History.
     * Strategy: Branch-Nodes are always the nearest historic nodes. @See default: git log
     * @param cur
     * @param all
     * @param n
     */
    static getPredecessorCommitPaths(cur: CommitPath, all: CommitPath[], n: number): Array<CommitPath[]> {
        const commitMap = CommitPath.getCommitsMap(all);
        const commits: Commit[] = [];
        for (const key of commitMap.keys()) {
            const commitPath: CommitPath = commitMap.get(key)[0];
            const parent = commitPath.commit;
            commits.push(parent);
        }
        // @formatter:off
        const commit:           Commit      = cur.commit;
        const curCommitPath:    CommitPath  = commitMap.get(commit.hash)[0];
        const parentCommit:     Commit      = curCommitPath.commit;
        // @formatter:on

        const predecessorHashes = Commit.getPredecessorCommits(parentCommit, commits, n)
            .map(predecessor => {
                return predecessor.hash
            });


        const predecessors = [];
        predecessorHashes.forEach(hash => {
            const commitPaths = commitMap.get(hash);
            predecessors.push(commitPaths);
        })
        return predecessors;
    }

    is(other: CommitPath) {
        const parent: Commit = CommitPath._commitMap.get(this.parentKey);
        const otherParent: Commit = other.commit;

        return this.path ?
            parent.is(otherParent) && this.path.path === other.path.path
            : parent.is(otherParent);
    }

    key(): string {
        const string = this.path ? this.parentKey + this.path.path : this.parentKey;
        return crypto.createHash("sha1").update(string).digest("hex");
    }

    setMethods(localityDTO: CommitPath) {
        /**
         * TODO: Noch mal überlegen, ob ich nicht irgendwie doch den Konstruktor aufrufen könnte und dann Werte setzen könnte
         * So ist das extrem hacky und nicht ganz sauber, wer weiß was TypeScript sonst noch alles setzt, wenn Objekte erzeugt werden
         * evtl: leeren CommitPath erzeugen und dann über Object.keys vom DTO iterieren und alles übertragen, was bekannt ist? deepClone?
         * Nachteil: Performanz
         */
        // @formatter:off
        localityDTO.is                  = CommitPath.prototype.is;
        localityDTO.key                 = CommitPath.prototype.key;
        localityDTO.setMethods          = CommitPath.prototype.setMethods;
        const commitPropertyDescriptors = Object.getOwnPropertyDescriptors(CommitPath.prototype).commit;

        Object.defineProperty(localityDTO, "commit", {
           get: commitPropertyDescriptors.get,
           set: commitPropertyDescriptors.set
        });
        // @formatter:on
    }

    get commit(): Commit {
        return CommitPath.commitMap.get(this.parentKey);
    }

    set commit(commit: Commit) {
        // TODO: überlegen ob bisheriger Commit gelöscht werden sollte | also bisheriger parentKey
        this.parentKey = commit.key();
        CommitPath.pushCommit(commit);
    }

    /**
     * (file)path of a commit which should be measured and annotated
     * file can be undefined if commit does not affect a file. These commitsPaths are needed to reconstruct Commit-History.
     * example for undeinfed files: certain merge commits
     */
    path?: GitFile;

    parentKey: string;
}

