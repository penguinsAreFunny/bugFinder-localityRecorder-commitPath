import { LocalityRecorder } from "bugfinder-framework";
import { CommitPath } from "./commitPath";
import { Commit } from "bugfinder-localityrecorder-commit";
import { CommitToCommitPathMapper } from "./commitToCommitPath";
export declare class CommitPathRecorder implements LocalityRecorder<CommitPath> {
    commitType: LocalityRecorder<Commit>;
    mapper: CommitToCommitPathMapper;
    getLocalities(): Promise<CommitPath[]>;
}
