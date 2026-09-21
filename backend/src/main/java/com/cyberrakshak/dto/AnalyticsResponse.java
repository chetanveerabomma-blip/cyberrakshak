package com.cyberrakshak.dto;

import java.util.List;
import java.util.Map;

public class AnalyticsResponse {
    private long totalIncidents;
    private long totalCases;
    private long openCases;
    private long resolvedCases;
    private long highRiskIncidents;
    private long criticalRiskIncidents;
    private double totalFinancialLoss;
    private double avgFinancialLoss;
    private double avgResponseTimeHours;

    private Map<String, Long> categoryDistribution;
    private Map<String, Long> riskDistribution;
    private Map<String, Long> statusDistribution;
    private Map<String, Long> stateDistribution;
    private List<Map<String, Object>> monthlyTrend;

    public AnalyticsResponse() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final AnalyticsResponse r = new AnalyticsResponse();

        public Builder totalIncidents(long val) { r.totalIncidents = val; return this; }
        public Builder totalCases(long val) { r.totalCases = val; return this; }
        public Builder openCases(long val) { r.openCases = val; return this; }
        public Builder resolvedCases(long val) { r.resolvedCases = val; return this; }
        public Builder highRiskIncidents(long val) { r.highRiskIncidents = val; return this; }
        public Builder criticalRiskIncidents(long val) { r.criticalRiskIncidents = val; return this; }
        public Builder totalFinancialLoss(double val) { r.totalFinancialLoss = val; return this; }
        public Builder avgFinancialLoss(double val) { r.avgFinancialLoss = val; return this; }
        public Builder avgResponseTimeHours(double val) { r.avgResponseTimeHours = val; return this; }
        public Builder categoryDistribution(Map<String, Long> val) { r.categoryDistribution = val; return this; }
        public Builder riskDistribution(Map<String, Long> val) { r.riskDistribution = val; return this; }
        public Builder statusDistribution(Map<String, Long> val) { r.statusDistribution = val; return this; }
        public Builder stateDistribution(Map<String, Long> val) { r.stateDistribution = val; return this; }
        public Builder monthlyTrend(List<Map<String, Object>> val) { r.monthlyTrend = val; return this; }

        public AnalyticsResponse build() {
            return r;
        }
    }

    public long getTotalIncidents() { return totalIncidents; }
    public void setTotalIncidents(long totalIncidents) { this.totalIncidents = totalIncidents; }
    public long getTotalCases() { return totalCases; }
    public void setTotalCases(long totalCases) { this.totalCases = totalCases; }
    public long getOpenCases() { return openCases; }
    public void setOpenCases(long openCases) { this.openCases = openCases; }
    public long getResolvedCases() { return resolvedCases; }
    public void setResolvedCases(long resolvedCases) { this.resolvedCases = resolvedCases; }
    public long getHighRiskIncidents() { return highRiskIncidents; }
    public void setHighRiskIncidents(long highRiskIncidents) { this.highRiskIncidents = highRiskIncidents; }
    public long getCriticalRiskIncidents() { return criticalRiskIncidents; }
    public void setCriticalRiskIncidents(long criticalRiskIncidents) { this.criticalRiskIncidents = criticalRiskIncidents; }
    public double getTotalFinancialLoss() { return totalFinancialLoss; }
    public void setTotalFinancialLoss(double totalFinancialLoss) { this.totalFinancialLoss = totalFinancialLoss; }
    public double getAvgFinancialLoss() { return avgFinancialLoss; }
    public void setAvgFinancialLoss(double avgFinancialLoss) { this.avgFinancialLoss = avgFinancialLoss; }
    public double getAvgResponseTimeHours() { return avgResponseTimeHours; }
    public void setAvgResponseTimeHours(double avgResponseTimeHours) { this.avgResponseTimeHours = avgResponseTimeHours; }
    public Map<String, Long> getCategoryDistribution() { return categoryDistribution; }
    public void setCategoryDistribution(Map<String, Long> categoryDistribution) { this.categoryDistribution = categoryDistribution; }
    public Map<String, Long> getRiskDistribution() { return riskDistribution; }
    public void setRiskDistribution(Map<String, Long> riskDistribution) { this.riskDistribution = riskDistribution; }
    public Map<String, Long> getStatusDistribution() { return statusDistribution; }
    public void setStatusDistribution(Map<String, Long> statusDistribution) { this.statusDistribution = statusDistribution; }
    public Map<String, Long> getStateDistribution() { return stateDistribution; }
    public void setStateDistribution(Map<String, Long> stateDistribution) { this.stateDistribution = stateDistribution; }
    public List<Map<String, Object>> getMonthlyTrend() { return monthlyTrend; }
    public void setMonthlyTrend(List<Map<String, Object>> monthlyTrend) { this.monthlyTrend = monthlyTrend; }
}
