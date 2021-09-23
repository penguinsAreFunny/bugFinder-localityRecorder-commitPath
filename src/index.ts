import {BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES} from "./TYPES";
import {CommitToCommitPathMapper, DefaultCommitPathMapper} from "./commitToCommitPath";
import {localityAContainer} from "bugfinder-framework-defaultcontainer";
import "bugfinder-localityrecorder-commit";

export * from "./commitPath"
export * from "./commitPathRecorder"
export * from "./commitToCommitPath"
export * from "./TYPES"

localityAContainer.bind<CommitToCommitPathMapper>(BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES.commitToCommitPathMapper).to(DefaultCommitPathMapper)
