/**
 * This class is dependent on SonarQube version 9.0.1
 */
export declare class SonarQubeMeasurement {
    /**
     * Generates a SonarQubeMeasurements out of the response from the
     * SonarQube-webserver
     * @param response
     */
    constructor(response: any);
    qualifier: string;
    language: string;
    cognitiveComplexity: Measure<number>;
    duplicatedLinesDensity: Measure<number>;
    securityRating: Measure<number>;
    blockerViolations: Measure<number>;
    duplicatedBlocks: Measure<number>;
    vulnerabilities: Measure<number>;
    classes: Measure<number>;
    securityReviewRating: Measure<number>;
    functions: Measure<number>;
    sqaleIndex: Measure<number>;
    bugs: Measure<number>;
    infoViolations: Measure<number>;
    coverage: Measure<number>;
    generatedNcloc: Measure<number>;
    lines: Measure<number>;
    ncloc: Measure<number>;
    generatedLines: Measure<number>;
    linesToCover: Measure<number>;
    reopenedIssues: Measure<number>;
    confirmedIssues: Measure<number>;
    testSuccessDensity: Measure<number>;
    securityHotspots: Measure<number>;
    majorViolations: Measure<number>;
    violations: Measure<number>;
    uncoveredLines: Measure<number>;
    minorViolations: Measure<number>;
    criticalViolations: Measure<number>;
    falsePositiveIssues: Measure<number>;
    statements: Measure<number>;
    testFailures: Measure<number>;
    duplicatedFiles: Measure<number>;
    reliabilityRemediationEffort: Measure<number>;
    commentLinesDensity: Measure<number>;
    lineCoverage: Measure<number>;
    sqaleDebtRatio: Measure<number>;
    sqaleRating: Measure<number>;
    reliabilityRating: Measure<number>;
    files: Measure<number>;
    wontFixIssues: Measure<number>;
    skippedTests: Measure<number>;
    codeSmells: Measure<number>;
    effortToReachMaintainabilityRatingA: Measure<number>;
    complexity: Measure<number>;
    commentLines: Measure<number>;
    duplicatedLines: Measure<number>;
    securityRemediationEffort: Measure<number>;
    openIssues: Measure<number>;
    testErrors: Measure<number>;
    /**
     * Returns the object from the SonarQube-Webserver response which contains the metric
     * @param metric
     * @param measures
     * @private
     * @example return value:
     * {
     *      metric: "cognitive_complexity"
     *      value: 1346
     *      bestValue: false
     * }
     */
    private getMeasure;
    /**
     * Searches the metric in measures and parses it into the measureContainer
     * @param metric
     * @param measureContainer
     * @param measures
     * @private
     */
    private parseByRefNumber;
}
export declare class Measure<T> {
    name: string;
    value: T;
    bestValue?: boolean;
    set(name: string, value: T, bestValue?: boolean): void;
}
