import {inject, injectable, optional} from "inversify";
import {LocalityRecorder} from "bugfinder-framework";
import {CommitPath, PathsHandling} from "./commitPath";
import {Commit, GitFileType} from "bugfinder-localityrecorder-commit";
import {BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES} from "./TYPES";
import {CommitToCommitPathMapper} from "./commitToCommitPath";
import {BUGFINDER_COMMITPATH_QUANTIFIER_SONARQUBE_TYPES} from "../../bugFinder-commitPath-quantifier-sonarqube/src";

@injectable()
export class CommitPathRecorder implements LocalityRecorder<CommitPath> {
    @optional() @inject(BUGFINDER_COMMITPATH_QUANTIFIER_SONARQUBE_TYPES.pathsHandling)
    pathsHandling: PathsHandling;

    @inject(BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES.commitRecorder)
    commitType: LocalityRecorder<Commit>;

    @inject(BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES.commitToCommitPathMapper)
    mapper: CommitToCommitPathMapper;

    async getLocalities(): Promise<CommitPath[]> {
        console.log(`Running analysis and retrieving CommitPaths`);
        const commits: Commit[] = await this.commitType.getLocalities();
        const commitPaths = this.mapper.map(commits);
        return this.applyPathHandling(commitPaths)
    }

    public applyPathHandling(localities: CommitPath[]): CommitPath[] {
        console.log(`Applying path handling for ${localities.length} localities.`)
        let commits: Commit[] = CommitPath.getCommits(localities);

        // pathsHandling: filter commitPath which do not comply the pathIncludes pattern
        const filterPathIncludes: (CommitPath) => boolean = (commitPath: CommitPath) => {
            if (commitPath.path) return this.pathsHandling.pathIncludes.test(commitPath.path.path);
            return true;
        }

        if (this.pathsHandling && this.pathsHandling.pathIncludes) {
            localities = localities.filter(filterPathIncludes);
            console.log("localities after filtering pathIncludes: ", localities.length)
        }

        // remove paths which are deleted
        const removeDeletedPaths: (CommitPath) => boolean = (commitPath: CommitPath) => {
            if (commitPath.path) return commitPath.path.type !== GitFileType.deleted;
            return true;
        }
        localities = localities.filter(removeDeletedPaths);
        console.log("localities after removing deleted paths: ", localities.length)

        const localityMap = new Map<string, CommitPath>();
        localities.forEach(l => {
            localityMap.set(l.commit.hash, l);
        })

        // inject paths for each unique commit
        commits.forEach(commit => {
            const commitPath = localityMap.get(commit.hash);
            if (commitPath == null || (commitPath.path == null && !this.pathsHandling?.injectOnEmptyPaths)) {
                // do not inject on empty paths
                return
            }
            this.pathsHandling?.injections?.forEach(injection => {
                const injectedCommitPath = new CommitPath();
                injectedCommitPath.commit = commit;
                injectedCommitPath.path = {
                    path: injection,
                    type: GitFileType.other
                };
                localities.push(injectedCommitPath);
                localityMap.set(commit.hash, injectedCommitPath)
            })

        });
        console.log("localities after injecting pathInjections: ", localities.length)
        console.log(`PathHandling got ${localities.length} localities from ${commits.length} commits.`)
        return localities;
    }

}