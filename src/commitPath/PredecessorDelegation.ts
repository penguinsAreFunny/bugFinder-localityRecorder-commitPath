import {CommitPath} from "../../../implementation/src/01-recording/01a-localities/commitPath";
import {LocalityMap} from "bugfinder-framework";

export interface PredecessorDelegation {
    getNPredecessorsMap(localities: CommitPath[], n: number, upToN: boolean, allLocalities: CommitPath[])
        : LocalityMap<CommitPath, CommitPath[]>

    getNPredecessors(locality: CommitPath,
                     n: number,
                     upToN: boolean,
                     allLocalities: CommitPath[],
                     initMode)
        : CommitPath[]

    getNextPredecessor(path: string, orderedLocalities: Map<number, CommitPath[]>, beginOrder: number,
                       minOrder: number, allLocalities: CommitPath[]): CommitPath
}