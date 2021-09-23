import { SonarQubeConfig } from "./sonarQubeConfig";
import { LocalityMap, Quantifier } from "bugfinder-framework";
import { CommitPath } from "bugfinder-localityrecorder-commitpath";
import { Git } from "bugfinder-localityrecorder-commit";
import { SonarQubeMeasurement } from "./sonarQubeMeasurement";
export declare class SonarQubeQuantifier implements Quantifier<CommitPath, SonarQubeMeasurement> {
    sonarQubeConfig: SonarQubeConfig;
    git: Git;
    quantify(localities: CommitPath[]): Promise<LocalityMap<CommitPath, SonarQubeMeasurement>>;
    private runPreHooks;
    private checkoutCommit;
    private sonarQubeQuantify;
}
