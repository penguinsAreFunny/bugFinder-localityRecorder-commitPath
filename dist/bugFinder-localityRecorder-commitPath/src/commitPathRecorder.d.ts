import { LocalityRecorder } from "bugfinder-framework";
import { Commit } from "bugfinder-localityrecorder-commit";
import { CommitToCommitPathMapper } from "./commitToCommitPath";
import { CommitPath } from "./commitPath";
export declare class CommitPathRecorder implements LocalityRecorder<CommitPath> {
    commitType: LocalityRecorder<Commit>;
    mapper: CommitToCommitPathMapper;
    getLocalities(): Promise<CommitPath[]>;
}
