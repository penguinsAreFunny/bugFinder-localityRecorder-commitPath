"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Measure = exports.SonarQubeMeasurement = void 0;
/**
 * This class is dependent on SonarQube version 9.0.1
 */
var SonarQubeMeasurement = /** @class */ (function () {
    /**
     * Generates a SonarQubeMeasurements out of the response from the
     * SonarQube-webserver
     * @param response
     */
    function SonarQubeMeasurement(response) {
        this.cognitiveComplexity = new Measure();
        this.duplicatedLinesDensity = new Measure();
        this.securityRating = new Measure();
        this.blockerViolations = new Measure();
        this.duplicatedBlocks = new Measure();
        this.vulnerabilities = new Measure();
        this.classes = new Measure();
        this.securityReviewRating = new Measure();
        this.functions = new Measure();
        this.sqaleIndex = new Measure();
        this.bugs = new Measure();
        this.infoViolations = new Measure();
        this.coverage = new Measure();
        this.generatedNcloc = new Measure();
        this.lines = new Measure();
        this.ncloc = new Measure();
        this.generatedLines = new Measure();
        this.linesToCover = new Measure();
        this.reopenedIssues = new Measure();
        this.confirmedIssues = new Measure();
        this.testSuccessDensity = new Measure();
        this.securityHotspots = new Measure();
        this.majorViolations = new Measure();
        this.violations = new Measure();
        this.uncoveredLines = new Measure();
        this.minorViolations = new Measure();
        this.criticalViolations = new Measure();
        this.falsePositiveIssues = new Measure();
        this.statements = new Measure();
        this.testFailures = new Measure();
        this.duplicatedFiles = new Measure();
        this.reliabilityRemediationEffort = new Measure();
        this.commentLinesDensity = new Measure();
        this.lineCoverage = new Measure();
        this.sqaleDebtRatio = new Measure();
        this.sqaleRating = new Measure();
        this.reliabilityRating = new Measure();
        this.files = new Measure();
        this.wontFixIssues = new Measure();
        this.skippedTests = new Measure();
        this.codeSmells = new Measure();
        this.effortToReachMaintainabilityRatingA = new Measure();
        this.complexity = new Measure();
        this.commentLines = new Measure();
        this.duplicatedLines = new Measure();
        this.securityRemediationEffort = new Measure();
        this.openIssues = new Measure();
        this.testErrors = new Measure();
        var component = response.component;
        var measures = component.measures;
        this.qualifier = component.qualifier;
        this.language = component.language;
        this.parseByRefNumber("cognitive_complexity", this.cognitiveComplexity, measures);
        this.parseByRefNumber("duplicated_lines_density", this.duplicatedLinesDensity, measures);
        this.parseByRefNumber("security_rating", this.securityRating, measures);
        this.parseByRefNumber("blocker_violations", this.blockerViolations, measures);
        this.parseByRefNumber("duplicated_blocks", this.duplicatedBlocks, measures);
        this.parseByRefNumber("vulnerabilities", this.vulnerabilities, measures);
        this.parseByRefNumber("classes", this.classes, measures);
        this.parseByRefNumber("security_review_rating", this.securityReviewRating, measures);
        this.parseByRefNumber("functions", this.functions, measures);
        this.parseByRefNumber("sqale_index", this.sqaleIndex, measures);
        this.parseByRefNumber("bugs", this.bugs, measures);
        this.parseByRefNumber("info_violations", this.infoViolations, measures);
        this.parseByRefNumber("coverage", this.coverage, measures);
        this.parseByRefNumber("generated_ncloc", this.generatedNcloc, measures);
        this.parseByRefNumber("lines", this.lines, measures);
        this.parseByRefNumber("ncloc", this.ncloc, measures);
        this.parseByRefNumber("generated_lines", this.generatedLines, measures);
        this.parseByRefNumber("lines_to_cover", this.linesToCover, measures);
        this.parseByRefNumber("reopened_issues", this.reopenedIssues, measures);
        this.parseByRefNumber("confirmed_issues", this.confirmedIssues, measures);
        this.parseByRefNumber("test_success_density", this.testSuccessDensity, measures);
        this.parseByRefNumber("security_hotspots", this.securityHotspots, measures);
        this.parseByRefNumber("major_violations", this.majorViolations, measures);
        this.parseByRefNumber("violations", this.violations, measures);
        this.parseByRefNumber("uncovered_lines", this.uncoveredLines, measures);
        this.parseByRefNumber("minor_violations", this.minorViolations, measures);
        this.parseByRefNumber("critical_violations", this.criticalViolations, measures);
        this.parseByRefNumber("false_positive_issues", this.falsePositiveIssues, measures);
        this.parseByRefNumber("statements", this.statements, measures);
        this.parseByRefNumber("test_failures", this.testFailures, measures);
        this.parseByRefNumber("duplicated_files", this.duplicatedFiles, measures);
        this.parseByRefNumber("reliability_remediation_effort", this.reliabilityRemediationEffort, measures);
        this.parseByRefNumber("comment_lines_density", this.commentLines, measures);
        this.parseByRefNumber("line_coverage", this.lineCoverage, measures);
        this.parseByRefNumber("sqale_debt_ratio", this.sqaleDebtRatio, measures);
        this.parseByRefNumber("sqale_rating", this.sqaleRating, measures);
        this.parseByRefNumber("reliability_rating", this.reliabilityRating, measures);
        this.parseByRefNumber("files", this.files, measures);
        this.parseByRefNumber("wont_fix_issues", this.wontFixIssues, measures);
        this.parseByRefNumber("skipped_tests", this.skippedTests, measures);
        this.parseByRefNumber("code_smells", this.codeSmells, measures);
        this.parseByRefNumber("effort_to_reach_maintainability_rating_a", this.effortToReachMaintainabilityRatingA, measures);
        this.parseByRefNumber("complexity", this.complexity, measures);
        this.parseByRefNumber("comment_lines", this.commentLines, measures);
        this.parseByRefNumber("duplicated_lines", this.duplicatedLines, measures);
        this.parseByRefNumber("security_remediation_effort", this.securityRemediationEffort, measures);
        this.parseByRefNumber("open_issues", this.openIssues, measures);
        this.parseByRefNumber("test_errors", this.testErrors, measures);
    }
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
    SonarQubeMeasurement.prototype.getMeasure = function (metric, measures) {
        var measuresFromWebserver = measures.filter(function (measure) {
            return measure.metric === metric;
        });
        return measuresFromWebserver == null ? null : measuresFromWebserver[0];
    };
    /**
     * Searches the metric in measures and parses it into the measureContainer
     * @param metric
     * @param measureContainer
     * @param measures
     * @private
     */
    SonarQubeMeasurement.prototype.parseByRefNumber = function (metric, measureContainer, measures) {
        var measure = this.getMeasure(metric, measures);
        if (measure != null) {
            measureContainer.set(metric, parseFloat(measure.value), measure.bestValue);
        }
        else {
            measureContainer.set(metric, undefined, undefined);
        }
    };
    return SonarQubeMeasurement;
}());
exports.SonarQubeMeasurement = SonarQubeMeasurement;
var Measure = /** @class */ (function () {
    function Measure() {
    }
    Measure.prototype.set = function (name, value, bestValue) {
        this.name = name;
        this.value = value;
        this.bestValue = bestValue;
    };
    return Measure;
}());
exports.Measure = Measure;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29uYXJRdWJlTWVhc3VyZW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9idWdGaW5kZXItY29tbWl0UGF0aC1xdWFudGlmaWVyLXNvbmFycXViZS9zcmMvc29uYXJRdWJlUXVhbnRpZmllci9zb25hclF1YmVNZWFzdXJlbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7R0FFRztBQUNIO0lBRUk7Ozs7T0FJRztJQUNILDhCQUFZLFFBQWE7UUE2RHpCLHdCQUFtQixHQUFHLElBQUksT0FBTyxFQUFVLENBQUE7UUFDM0MsMkJBQXNCLEdBQUcsSUFBSSxPQUFPLEVBQVUsQ0FBQTtRQUM5QyxtQkFBYyxHQUFHLElBQUksT0FBTyxFQUFVLENBQUE7UUFDdEMsc0JBQWlCLEdBQUcsSUFBSSxPQUFPLEVBQVUsQ0FBQTtRQUN6QyxxQkFBZ0IsR0FBRyxJQUFJLE9BQU8sRUFBVSxDQUFBO1FBQ3hDLG9CQUFlLEdBQUcsSUFBSSxPQUFPLEVBQVUsQ0FBQTtRQUN2QyxZQUFPLEdBQUcsSUFBSSxPQUFPLEVBQVUsQ0FBQTtRQUMvQix5QkFBb0IsR0FBRyxJQUFJLE9BQU8sRUFBVSxDQUFBO1FBQzVDLGNBQVMsR0FBRyxJQUFJLE9BQU8sRUFBVSxDQUFBO1FBQ2pDLGVBQVUsR0FBRyxJQUFJLE9BQU8sRUFBVSxDQUFBO1FBQ2xDLFNBQUksR0FBRyxJQUFJLE9BQU8sRUFBVSxDQUFBO1FBQzVCLG1CQUFjLEdBQUcsSUFBSSxPQUFPLEVBQVUsQ0FBQTtRQUN0QyxhQUFRLEdBQUcsSUFBSSxPQUFPLEVBQVUsQ0FBQTtRQUNoQyxtQkFBYyxHQUFHLElBQUksT0FBTyxFQUFVLENBQUE7UUFDdEMsVUFBSyxHQUFHLElBQUksT0FBTyxFQUFVLENBQUE7UUFDN0IsVUFBSyxHQUFHLElBQUksT0FBTyxFQUFVLENBQUE7UUFDN0IsbUJBQWMsR0FBRyxJQUFJLE9BQU8sRUFBVSxDQUFBO1FBQ3RDLGlCQUFZLEdBQUcsSUFB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