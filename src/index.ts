import {localityBContainer} from "bugfinder-framework";
import {BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES} from "./TYPES";
import {CommitToCommitPathMapper, DefaultCommitPathMapper} from "./commitToCommitPath";
import {CommitRecorder} from "bugfinder-localityrecorder-commit";

export * from "./commitPath"
export * from "./commitPathRecorder"
export * from "./commitToCommitPath"
export * from "./TYPES"

localityBContainer.bind<CommitToCommitPathMapper>(BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES.commitToCommitPathMapper).to(DefaultCommitPathMapper)
localityBContainer.bind<CommitRecorder>(BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES.commitRecorder).to(CommitRecorder)