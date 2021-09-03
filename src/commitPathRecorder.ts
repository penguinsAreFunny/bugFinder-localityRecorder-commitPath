import {inject, injectable, optional} from "inversify";
import {LocalityRecorder} from "bugfinder-framework";
import {CommitPath} from "./commitPath";
import {Commit} from "bugfinder-localityrecorder-commit";
import {BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES} from "./TYPES";
import {CommitToCommitPathMapper} from "./commitToCommitPath";

@injectable()
export class CommitPathRecorder implements LocalityRecorder<CommitPath> {

    @inject(BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES.commitRecorder)
    commitType: LocalityRecorder<Commit>;

    @inject(BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES.commitToCommitPathMapper)
    mapper: CommitToCommitPathMapper;

    async getLocalities(): Promise<CommitPath[]> {
        console.log(`Running analysis and retrieving CommitPaths`);
        const commits: Commit[] = await this.commitType.getLocalities();
        return this.mapper.map(commits);
    }

}