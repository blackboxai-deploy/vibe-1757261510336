import { Customer, RiskAssessment, PaymentSchedule } from './types';

export class LoanCalculations {
  /**
   * Calculate monthly payment using EMI formula
   * EMI = [P x R x (1+R)^N] / [(1+R)^N-1]
   */
  static calculateEMI(principal: number, annualRate: number, termInMonths: number): number {
    const monthlyRate = annualRate / 100 / 12;
    if (monthlyRate === 0) return principal / termInMonths;
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) /
                (Math.pow(1 + monthlyRate, termInMonths) - 1);
    
    return Math.round(emi * 100) / 100;
  }

  /**
   * Generate payment schedule for a loan
   */
  static generatePaymentSchedule(
    loanId: string,
    principal: number,
    annualRate: number,
    termInMonths: number,
    startDate: Date
  ): PaymentSchedule[] {
    const monthlyRate = annualRate / 100 / 12;
    const emi = this.calculateEMI(principal, annualRate, termInMonths);
    const schedule: PaymentSchedule[] = [];
    
    let remainingBalance = principal;
    
    for (let i = 1; i <= termInMonths; i++) {
      const interestAmount = remainingBalance * monthlyRate;
      const principalAmount = emi - interestAmount;
      
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);
      
      schedule.push({
        id: `${loanId}-${i}`,
        loanId,
        installmentNumber: i,
        dueDate,
        principalAmount: Math.round(principalAmount * 100) / 100,
        interestAmount: Math.round(interestAmount * 100) / 100,
        totalAmount: emi,
        status: 'pending',
        penaltyAmount: 0
      });
      
      remainingBalance -= principalAmount;
    }
    
    return schedule;
  }

  /**
   * Calculate total loan cost
   */
  static calculateTotalLoanCost(principal: number, annualRate: number, termInMonths: number): {
    totalAmount: number;
    totalInterest: number;
    monthlyPayment: number;
  } {
    const monthlyPayment = this.calculateEMI(principal, annualRate, termInMonths);
    const totalAmount = monthlyPayment * termInMonths;
    const totalInterest = totalAmount - principal;
    
    return {
      totalAmount: Math.round(totalAmount * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      monthlyPayment
    };
  }

  /**
   * Calculate penalty for overdue payment
   */
  static calculatePenalty(
    overdueAmount: number,
    daysPastDue: number,
    penaltyRate: number = 2 // 2% per month default
  ): number {
    if (daysPastDue <= 0) return 0;
    
    const monthsPastDue = daysPastDue / 30;
    const penalty = overdueAmount * (penaltyRate / 100) * monthsPastDue;
    
    return Math.round(penalty * 100) / 100;
  }

  /**
   * Assess customer credit risk
   */
  static assessCreditRisk(customer: Customer): RiskAssessment {
    const { financialInfo, employmentInfo } = customer;
    
    // Calculate debt-to-income ratio
    const monthlyIncome = employmentInfo.monthlyIncome;
    const monthlyExpenses = financialInfo.monthlyExpenses;
    const existingDebts = financialInfo.existingDebts;
    const debtToIncomeRatio = (existingDebts + monthlyExpenses) / monthlyIncome;
    
    // Risk factors
    const riskFactors: string[] = [];
    let riskScore = 0;
    
    // Credit score assessment (40% weight)
    const creditScore = financialInfo.creditScore;
    if (creditScore >= 750) riskScore += 40;
    else if (creditScore >= 700) riskScore += 30;
    else if (creditScore >= 650) riskScore += 20;
    else if (creditScore >= 600) riskScore += 10;
    else {
      riskFactors.push('Low credit score');
    }
    
    // Debt-to-income ratio (30% weight)
    if (debtToIncomeRatio <= 0.3) riskScore += 30;
    else if (debtToIncomeRatio <= 0.4) riskScore += 20;
    else if (debtToIncomeRatio <= 0.5) riskScore += 10;
    else {
      riskFactors.push('High debt-to-income ratio');
    }
    
    // Employment stability (20% weight)
    const employmentMonths = employmentInfo.employmentLength;
    if (employmentMonths >= 24) riskScore += 20;
    else if (employmentMonths >= 12) riskScore += 15;
    else if (employmentMonths >= 6) riskScore += 10;
    else {
      riskFactors.push('Short employment history');
    }
    
    // Assets and savings (10% weight)
    const assetsToIncomeRatio = financialInfo.assets / (monthlyIncome * 12);
    if (assetsToIncomeRatio >= 1) riskScore += 10;
    else if (assetsToIncomeRatio >= 0.5) riskScore += 7;
    else if (assetsToIncomeRatio >= 0.25) riskScore += 5;
    else {
      riskFactors.push('Limited assets/savings');
    }
    
    // Determine overall risk level
    let overallRisk: 'low' | 'medium' | 'high';
    if (riskScore >= 80) overallRisk = 'low';
    else if (riskScore >= 60) overallRisk = 'medium';
    else overallRisk = 'high';
    
    // Calculate recommended loan amount and interest rate
    const maxRecommendedAmount = this.calculateMaxLoanAmount(customer);
    const baseRate = this.getBaseInterestRate();
    const riskAdjustment = overallRisk === 'low' ? 0 : overallRisk === 'medium' ? 1 : 2.5;
    
    return {
      customerId: customer.id,
      creditScore,
      debtToIncomeRatio: Math.round(debtToIncomeRatio * 100) / 100,
      employmentStability: employmentMonths,
      paymentHistory: creditScore, // Simplified - would use actual payment history
      collateralValue: 0, // Would be set based on actual collateral
      overallRisk,
      recommendedAmount: maxRecommendedAmount,
      recommendedRate: baseRate + riskAdjustment,
      riskFactors
    };
  }

  /**
   * Calculate maximum recommended loan amount
   */
  static calculateMaxLoanAmount(customer: Customer): number {
    const { financialInfo, employmentInfo } = customer;
    const monthlyIncome = employmentInfo.monthlyIncome;
    const existingObligations = financialInfo.monthlyExpenses + (financialInfo.existingDebts / 12);
    
    // Conservative approach: max 40% of income for loan payments
    const availableIncome = monthlyIncome * 0.4 - existingObligations;
    
    if (availableIncome <= 0) return 0;
    
    // Assume 10% interest rate and 5-year term for calculation
    const maxLoanAmount = (availableIncome * 60) / 1.1; // Simplified calculation
    
    return Math.max(0, Math.round(maxLoanAmount));
  }

  /**
   * Get base interest rate (would come from system settings in real app)
   */
  static getBaseInterestRate(): number {
    return 8.5; // Base rate of 8.5%
  }

  /**
   * Calculate loan affordability metrics
   */
  static calculateAffordability(
    customer: Customer,
    loanAmount: number,
    termInMonths: number,
    interestRate: number
  ): {
    monthlyPayment: number;
    debtToIncomeRatio: number;
    affordabilityScore: number;
    isAffordable: boolean;
    recommendations: string[];
  } {
    const monthlyPayment = this.calculateEMI(loanAmount, interestRate, termInMonths);
    const monthlyIncome = customer.employmentInfo.monthlyIncome;
    const existingObligations = customer.financialInfo.monthlyExpenses + 
                               (customer.financialInfo.existingDebts / 12);
    
    const totalMonthlyObligations = existingObligations + monthlyPayment;
    const debtToIncomeRatio = totalMonthlyObligations / monthlyIncome;
    
    let affordabilityScore = 100;
    const recommendations: string[] = [];
    
    // Reduce score based on DTI ratio
    if (debtToIncomeRatio > 0.5) {
      affordabilityScore -= 40;
      recommendations.push('Consider reducing loan amount or extending term');
    } else if (debtToIncomeRatio > 0.4) {
      affordabilityScore -= 20;
      recommendations.push('Monitor monthly budget carefully');
    }
    
    // Consider credit score
    if (customer.financialInfo.creditScore < 650) {
      affordabilityScore -= 20;
      recommendations.push('Consider improving credit score before applying');
    }
    
    // Consider employment stability
    if (customer.employmentInfo.employmentLength < 12) {
      affordabilityScore -= 15;
      recommendations.push('Employment history is relatively short');
    }
    
    const isAffordable = affordabilityScore >= 60 && debtToIncomeRatio <= 0.5;
    
    return {
      monthlyPayment,
      debtToIncomeRatio: Math.round(debtToIncomeRatio * 100) / 100,
      affordabilityScore,
      isAffordable,
      recommendations
    };
  }
}