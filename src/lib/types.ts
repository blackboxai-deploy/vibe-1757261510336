export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'loan_officer' | 'customer_service';
  department: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  ssn: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  employmentInfo: {
    employer: string;
    position: string;
    monthlyIncome: number;
    employmentLength: number; // in months
    employmentType: 'full_time' | 'part_time' | 'contract' | 'self_employed';
  };
  financialInfo: {
    creditScore: number;
    bankBalance: number;
    monthlyExpenses: number;
    existingDebts: number;
    assets: number;
  };
  documents: Document[];
  riskRating: 'low' | 'medium' | 'high';
  status: 'active' | 'inactive' | 'blacklisted';
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  type: 'id' | 'income_proof' | 'bank_statement' | 'employment_letter' | 'other';
  name: string;
  url: string;
  uploadDate: Date;
  verified: boolean;
}

export interface LoanApplication {
  id: string;
  customerId: string;
  customer?: Customer;
  loanType: 'personal' | 'home' | 'auto' | 'business';
  requestedAmount: number;
  purpose: string;
  term: number; // in months
  interestRate?: number;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'disbursed';
  applicationDate: Date;
  reviewDate?: Date;
  approvalDate?: Date;
  rejectionReason?: string;
  reviewedBy?: string;
  approvedBy?: string;
  documents: Document[];
  collateral?: {
    type: string;
    value: number;
    description: string;
  };
}

export interface Loan {
  id: string;
  applicationId: string;
  customerId: string;
  customer?: Customer;
  loanType: 'personal' | 'home' | 'auto' | 'business';
  principalAmount: number;
  currentBalance: number;
  interestRate: number;
  term: number; // in months
  monthlyPayment: number;
  startDate: Date;
  endDate: Date;
  nextPaymentDate: Date;
  status: 'active' | 'completed' | 'defaulted' | 'restructured';
  paymentSchedule: PaymentSchedule[];
  payments: Payment[];
  penaltyAmount: number;
  totalPaid: number;
  createdAt: Date;
}

export interface PaymentSchedule {
  id: string;
  loanId: string;
  installmentNumber: number;
  dueDate: Date;
  principalAmount: number;
  interestAmount: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  paidAmount?: number;
  paidDate?: Date;
  penaltyAmount: number;
}

export interface Payment {
  id: string;
  loanId: string;
  customerId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: 'cash' | 'check' | 'bank_transfer' | 'online' | 'auto_debit';
  referenceNumber: string;
  status: 'successful' | 'pending' | 'failed' | 'reversed';
  processedBy?: string;
  notes?: string;
  receiptUrl?: string;
}

export interface DashboardStats {
  totalCustomers: number;
  totalLoans: number;
  totalLoanAmount: number;
  activeLoans: number;
  pendingApplications: number;
  overdueLoans: number;
  totalCollected: number;
  defaultRate: number;
  averageLoanAmount: number;
  monthlyDisbursements: number;
}

export interface LoanPerformance {
  month: string;
  disbursed: number;
  collected: number;
  overdue: number;
  newApplications: number;
}

export interface RiskAssessment {
  customerId: string;
  creditScore: number;
  debtToIncomeRatio: number;
  employmentStability: number;
  paymentHistory: number;
  collateralValue: number;
  overallRisk: 'low' | 'medium' | 'high';
  recommendedAmount: number;
  recommendedRate: number;
  riskFactors: string[];
}

export interface NotificationSettings {
  paymentReminders: boolean;
  overdueAlerts: boolean;
  applicationUpdates: boolean;
  systemAlerts: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export interface SystemSettings {
  interestRates: {
    personal: number;
    home: number;
    auto: number;
    business: number;
  };
  maxLoanAmounts: {
    personal: number;
    home: number;
    auto: number;
    business: number;
  };
  gracePeriodDays: number;
  penaltyRate: number;
  minCreditScore: number;
  maxDebtToIncomeRatio: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: 'customer' | 'loan' | 'payment' | 'user' | 'system';
  entityId: string;
  details: string;
  timestamp: Date;
  ipAddress?: string;
}