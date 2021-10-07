import {injectable} from "inversify";
import {CommitToCommitPathMapper} from "./commitToCommitPathMapper";
import {Commit} from "bugfinder-localityrecorder-commit";
import {CommitPath} from "../commitPath";

/**
 * Maps an array of Commits to an array of CommitPaths using optional pathsHandling.
 * Strategy: Each file in commit will generate a new CommitPath-Object. CommitPath-Objects
 * are then filtered and injected with pathHandling-options, deleted files are dismissed
 */
@injectable()
export class DefaultCommitPathMapper implements CommitToCommitPathMapper {

    map(commits: Commit[]): CommitPath[] {


        let   localities: CommitPath[]    = [];
        // @formatter:on
        console.log("Total commits: ", commits.length)

        // create single 0-localities from each file of each commit
        commits.forEach((commit: Commit) => {
            // create locality for empty files. Needed for commit history reconstruction!
            if (commit.files.files.length === 0) {
                const locality = new CommitPath(commit);
                localities.push(locality);
                return;
            }

            commit.files.files.forEach((file) => {
                // copy content of Commit to CommitPath
                const locality = new CommitPath(commit, file);
                localities.push(locality);
            })
        });
        console.log("localities for each file of each commit: ", localities.length)

        return localities;
    }
}