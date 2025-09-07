import { Customer, LoanApplication, Loan, DashboardStats, LoanPerformance, ActivityLog } from './types';

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: 'cust-001',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0101',
    dateOfBirth: new Date('1985-03-15'),
    ssn: '123-45-6789',
    address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    employmentInfo: {
      employer: 'Tech Solutions Inc',
      position: 'Software Engineer',
      monthlyIncome: 8500,
      employmentLength: 36,
      employmentType: 'full_time'
    },
    financialInfo: {
      creditScore: 750,
      bankBalance: 25000,
      monthlyExpenses: 3200,
      existingDebts: 15000,
      assets: 85000
    },
    documents: [
      {
        id: 'doc-001',
        type: 'id',
        name: 'Drivers License',
        url: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/7f661f63-b93d-4467-a34e-81f164a63fd1.png',
        uploadDate: new Date('2024-01-15'),
        verified: true
      }
    ],
    riskRating: 'low',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'cust-002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0102',
    dateOfBirth: new Date('1990-07-22'),
    ssn: '987-65-4321',
    address: {
      street: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    employmentInfo: {
      employer: 'Marketing Pro LLC',
      position: 'Marketing Manager',
      monthlyIncome: 6500,
      employmentLength: 24,
      employmentType: 'full_time'
    },
    financialInfo: {
      creditScore: 720,
      bankBalance: 18000,
      monthlyExpenses: 2800,
      existingDebts: 8000,
      assets: 45000
    },
    documents: [
      {
        id: 'doc-002',
        type: 'income_proof',
        name: 'Pay Stubs',
        url: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/70dbf292-1265-4f11-882f-a8e928301b86.png',
        uploadDate: new Date('2024-02-01'),
        verified: true
      }
    ],
    riskRating: 'low',
    status: 'active',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: 'cust-003',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@email.com',
    phone: '+1-555-0103',
    dateOfBirth: new Date('1978-11-08'),
    ssn: '456-78-9123',
    address: {
      street: '789 Pine Road',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    employmentInfo: {
      employer: 'Construction Co',
      position: 'Project Manager',
      monthlyIncome: 5200,
      employmentLength: 18,
      employmentType: 'full_time'
    },
    financialInfo: {
      creditScore: 650,
      bankBalance: 8500,
      monthlyExpenses: 2400,
      existingDebts: 12000,
      assets: 28000
    },
    documents: [
      {
        id: 'doc-003',
        type: 'bank_statement',
        name: 'Bank Statement',
        url: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/6b957b05-ab84-4401-8138-ec1d7ea16853.png',
        uploadDate: new Date('2024-02-10'),
        verified: false
      }
    ],
    riskRating: 'medium',
    status: 'active',
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: 'cust-004',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@email.com',
    phone: '+1-555-0104',
    dateOfBirth: new Date('1992-05-18'),
    ssn: '789-12-3456',
    address: {
      street: '321 Elm Street',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA'
    },
    employmentInfo: {
      employer: 'Design Studio',
      position: 'Graphic Designer',
      monthlyIncome: 4800,
      employmentLength: 8,
      employmentType: 'full_time'
    },
    financialInfo: {
      creditScore: 680,
      bankBalance: 12000,
      monthlyExpenses: 2100,
      existingDebts: 5000,
      assets: 22000
    },
    documents: [],
    riskRating: 'medium',
    status: 'active',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: 'cust-005',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@email.com',
    phone: '+1-555-0105',
    dateOfBirth: new Date('1988-09-30'),
    ssn: '321-54-7890',
    address: {
      street: '654 Maple Drive',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA'
    },
    employmentInfo: {
      employer: 'Retail Chain',
      position: 'Store Manager',
      monthlyIncome: 5800,
      employmentLength: 42,
      employmentType: 'full_time'
    },
    financialInfo: {
      creditScore: 700,
      bankBalance: 16500,
      monthlyExpenses: 2600,
      existingDebts: 9500,
      assets: 38000
    },
    documents: [
      {
        id: 'doc-004',
        type: 'employment_letter',
        name: 'Employment Letter',
        url: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/90b4d925-95a9-4c26-8b41-1c16b36c164a.png',
        uploadDate: new Date('2024-02-20'),
        verified: true
      }
    ],
    riskRating: 'low',
    status: 'active',
    createdAt: new Date('2024-02-18'),
    updatedAt: new Date('2024-02-20')
  }
];

// Mock Loan Applications
export const mockLoanApplications: LoanApplication[] = [
  {
    id: 'app-001',
    customerId: 'cust-001',
    loanType: 'personal',
    requestedAmount: 25000,
    purpose: 'Home renovation',
    term: 60,
    status: 'approved',
    applicationDate: new Date('2024-01-15'),
    reviewDate: new Date('2024-01-18'),
    approvalDate: new Date('2024-01-20'),
    reviewedBy: 'Jane Officer',
    approvedBy: 'John Admin',
    documents: [
      {
        id: 'doc-app-001',
        type: 'income_proof',
        name: 'Income Documents',
        url: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5fbb25e7-483d-40e1-9b6e-0a9d635086ad.png',
        uploadDate: new Date('2024-01-15'),
        verified: true
      }
    ],
    interestRate: 8.5
  },
  {
    id: 'app-002',
    customerId: 'cust-002',
    loanType: 'auto',
    requestedAmount: 35000,
    purpose: 'Vehicle purchase',
    term: 72,
    status: 'under_review',
    applicationDate: new Date('2024-02-01'),
    reviewDate: new Date('2024-02-03'),
    reviewedBy: 'Jane Officer',
    documents: [
      {
        id: 'doc-app-002',
        type: 'other',
        name: 'Vehicle Information',
        url: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/0578fc8e-9f26-4a86-8134-2fa1ef03ff3a.png',
        uploadDate: new Date('2024-02-01'),
        verified: true
      }
    ]
  },
  {
    id: 'app-003',
    customerId: 'cust-003',
    loanType: 'home',
    requestedAmount: 150000,
    purpose: 'Home purchase',
    term: 360,
    status: 'pending',
    applicationDate: new Date('2024-02-10'),
    documents: [
      {
        id: 'doc-app-003',
        type: 'other',
        name: 'Property Documents',
        url: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d5568493-48bf-4f60-ba6b-716e3d8386c1.png',
        uploadDate: new Date('2024-02-10'),
        verified: false
      }
    ],
    collateral: {
      type: 'Real Estate',
      value: 180000,
      description: '3BR house in Chicago suburbs'
    }
  }
];

// Mock Active Loans
export const mockLoans: Loan[] = [
  {
    id: 'loan-001',
    applicationId: 'app-001',
    customerId: 'cust-001',
    loanType: 'personal',
    principalAmount: 25000,
    currentBalance: 22500,
    interestRate: 8.5,
    term: 60,
    monthlyPayment: 513.75,
    startDate: new Date('2024-01-25'),
    endDate: new Date('2029-01-25'),
    nextPaymentDate: new Date('2024-04-25'),
    status: 'active',
    paymentSchedule: [],
    payments: [
      {
        id: 'pay-001',
        loanId: 'loan-001',
        customerId: 'cust-001',
        amount: 513.75,
        paymentDate: new Date('2024-01-25'),
        paymentMethod: 'online',
        referenceNumber: 'REF-001',
        status: 'successful',
        processedBy: 'System'
      }
    ],
    penaltyAmount: 0,
    totalPaid: 2568.75,
    createdAt: new Date('2024-01-25')
  }
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalCustomers: 156,
  totalLoans: 89,
  totalLoanAmount: 2850000,
  activeLoans: 76,
  pendingApplications: 12,
  overdueLoans: 8,
  totalCollected: 1250000,
  defaultRate: 2.3,
  averageLoanAmount: 32000,
  monthlyDisbursements: 485000
};

// Mock Loan Performance Data
export const mockLoanPerformance: LoanPerformance[] = [
  { month: 'Jan 2024', disbursed: 450000, collected: 285000, overdue: 15000, newApplications: 15 },
  { month: 'Feb 2024', disbursed: 520000, collected: 310000, overdue: 18000, newApplications: 18 },
  { month: 'Mar 2024', disbursed: 485000, collected: 295000, overdue: 12000, newApplications: 22 },
  { month: 'Apr 2024', disbursed: 610000, collected: 340000, overdue: 20000, newApplications: 25 },
  { month: 'May 2024', disbursed: 580000, collected: 385000, overdue: 16000, newApplications: 20 },
  { month: 'Jun 2024', disbursed: 540000, collected: 420000, overdue: 14000, newApplications: 19 }
];

// Mock Recent Activities
export const mockRecentActivities: ActivityLog[] = [
  {
    id: 'act-001',
    userId: '2',
    userName: 'Jane Officer',
    action: 'Approved loan application',
    entity: 'loan',
    entityId: 'app-001',
    details: 'Personal loan for $25,000 approved',
    timestamp: new Date('2024-02-20T10:30:00'),
    ipAddress: '192.168.1.100'
  },
  {
    id: 'act-002',
    userId: '3',
    userName: 'Mike Service',
    action: 'Updated customer information',
    entity: 'customer',
    entityId: 'cust-002',
    details: 'Updated phone number and address',
    timestamp: new Date('2024-02-20T09:15:00'),
    ipAddress: '192.168.1.105'
  },
  {
    id: 'act-003',
    userId: '2',
    userName: 'Jane Officer',
    action: 'Processed payment',
    entity: 'payment',
    entityId: 'pay-001',
    details: 'Payment of $513.75 processed successfully',
    timestamp: new Date('2024-02-19T16:45:00'),
    ipAddress: '192.168.1.100'
  },
  {
    id: 'act-004',
    userId: '1',
    userName: 'John Admin',
    action: 'Created new user account',
    entity: 'user',
    entityId: 'user-004',
    details: 'New loan officer account created',
    timestamp: new Date('2024-02-19T14:20:00'),
    ipAddress: '192.168.1.1'
  },
  {
    id: 'act-005',
    userId: '2',
    userName: 'Jane Officer',
    action: 'Rejected loan application',
    entity: 'loan',
    entityId: 'app-004',
    details: 'Auto loan application rejected - insufficient income',
    timestamp: new Date('2024-02-19T11:30:00'),
    ipAddress: '192.168.1.100'
  }
];