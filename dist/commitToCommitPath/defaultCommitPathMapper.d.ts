import { CommitToCommitPathMapper } from "./commitToCommitPathMapper";
import { Commit } from "bugfinder-localityrecorder-commit";
import { CommitPath } from "../commitPath";
/**
 * Maps an array of Commits to an array of CommitPaths using optional pathsHandling.
 * Strategy: Each file in commit will generate a new CommitPath-Object. CommitPath-Objects
 * are then filtered and injected with pathHandling-options, deleted files are dismissed
 */
export declare class DefaultCommitPathMapper implements CommitToCommitPathMapper {
    map(commits: Commit[]): CommitPath[];
}
