export interface SonarQubeConfig {
    /**
     * Path to the *.properties-file used by sonarScanner
     * @See https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/
     */
    propertiesPath: string;
    /**
     * URL of the SonarQube-Server. Running by default (v8.5): localhost:9000
     */
    sonarQubeURL: string;
    /**
     * The ID needed to login in SonarQube Webinterface.
     * Default value in SonarQube-Server installation (v8.5): admin
     */
    id: string;
    /**
     * The password needed to login in SonarQube Webinterface.
     * Default value in SonarQube-Server installation (v8.5): admin
     */
    pw: string;
    /**
     * A prehook function called before each analysis by sonar scanner.
     * This prehook will be called after each checkout of a commit.
     * This function can f.e. be install needed libraries. F.e.: npm install
     */
    preHooks?: (() => void)[];
}
