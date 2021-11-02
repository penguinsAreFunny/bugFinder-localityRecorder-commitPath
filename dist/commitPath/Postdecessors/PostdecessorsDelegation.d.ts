import { LocalityMap } from "bugfinder-framework";
import { CommitPath } from "../commitPath";
/**
 * PostdecessorDelegation alias progeny delegation
 */
export interface PostdecessorsDelegation {
    getNPostdecessorsMap(localities: CommitPath[], n: number, upToN: boolean, allLocalities: CommitPath[]): LocalityMap<CommitPath, CommitPath[]>;
    getNPostdecessors(locality: CommitPath, n: number, upToN: boolean, allLocalities: CommitPath[], initMode: any): CommitPath[];
    getNextPostdecessor(path: string, orderedLocalities: Map<number, CommitPath[]>, beginOrder: number, maxOrder: number, allLocalities: CommitPath[]): CommitPath;
}
