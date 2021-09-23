import { LocalityRecorder } from "bugfinder-framework";
import { CommitPath, PathsHandling } from "./commitPath";
import { Commit } from "bugfinder-localityrecorder-commit";
import { CommitToCommitPathMapper } from "./commitToCommitPath";
export declare class CommitPathRecorder implements LocalityRecorder<CommitPath> {
    pathsHandling: PathsHandling;
    commitType: LocalityRecorder<Commit>;
    mapper: CommitToCommitPathMapper;
    getLocalities(): Promise<CommitPath[]>;
    applyPathHandling(localities: CommitPath[]): CommitPath[];
}
