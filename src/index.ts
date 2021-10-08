import {BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES} from "./TYPES";
import {CommitToCommitPathMapper, DefaultCommitPathMapper} from "./commitToCommitPath";
import {localityAContainer} from "bugfinder-framework-defaultcontainer";
import "bugfinder-localityrecorder-commit";
import {FileAndConsoleLogger, LogConfig} from "bugfinder-framework";
import {Logger} from "ts-log";

export * from "./commitPath"
export * from "./commitPathRecorder"
export * from "./commitToCommitPath"
export * from "./TYPES"


const logOptions: LogConfig = {
    debugToConsole: true,
    errorToConsole: true,
    infoToConsole: true,
    traceToConsole: true,
    warnToConsole: true,
    logFile: "./log.txt",
}

localityAContainer.bind<CommitToCommitPathMapper>(BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES.commitToCommitPathMapper).to(DefaultCommitPathMapper)
localityAContainer.bind<Logger>(BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES.logger).to(FileAndConsoleLogger)
localityAContainer.bind<LogConfig>(BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES.logConfig).toConstantValue(logOptions)
