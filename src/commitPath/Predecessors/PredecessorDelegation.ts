import {LocalityMap} from "bugfinder-framework";
import {CommitPath} from "../commitPath";

export interface PredecessorDelegation {
    getNPredecessorsMap(localities: CommitPath[], n: number, upToN: boolean, allLocalities: CommitPath[])
        : LocalityMap<CommitPath, CommitPath[]>

    // TODO: Path renaming missing yet
    getNPredecessors(locality: CommitPath,
                     n: number,
                     upToN: boolean,
                     allLocalities: CommitPath[],
                     initMode)
        : CommitPath[]

    getNextPredecessor(path: string, orderedLocalities: Map<number, CommitPath[]>, beginOrder: number,
                       minOrder: number, allLocalities: CommitPath[]): CommitPath
}