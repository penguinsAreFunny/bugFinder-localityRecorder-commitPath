import {Commit} from "bugfinder-localityrecorder-commit";
import {CommitPath} from "../commitPath";

export interface CommitToCommitPathMapper {
    /**
     * Maps an array of Commits to an array of CommitPaths
     * @param commits
     */
    map(commits: Commit[]): CommitPath[];
}
