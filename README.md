```
// @see bugFinder-localityRecorder-commit
const projectRoot = "../projectroot/"
const gitOptions: GitOptions = {
    baseDir: projectRoot,
    maxConcurrentProcesses: 4
}

container.bind<GitOptions>          (BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES.gitOptions).toConstantValue(gitOptions)
container.bind<Git>                 (BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES.git).to(GitImpl)
container.bind<FormatParser>        (BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES.gitCommitParser).to(FormatParser)
container.bind<MADFilesFromCommit>  (BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES.madFilesFromCommitParser).to(MADFilesFromLogImpl)

// here you need the CommitRecorder from bugFinder-localityRecorder-commit | configure it as documented in its repository
container.bind<LocalityRecorder>          (BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES.commitRecorder).to(CommitRecorder)
container.bind<CommitToCommitPathMapper>  (BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES.commitToCommitPathMapper).to(DefaultCommitPathMapper)
```
