import React from 'react';
import type { ServiceItem } from '../../data/services';

// Group 1: Individual Services (1 - 4)
import {
  IndividualTaxPrepHero,
  FamilyTaxPlanningHero,
  PersonalTaxConsultationHero,
  IrsAssistanceHero,
} from './IndividualServicesAnimations';

// Group 2: Business Services (5 - 10)
import {
  BusinessTaxPrepHero,
  AccountingServicesHero,
  BookkeepingHero,
  PayrollManagementHero,
  FinancialReportingHero,
  BusinessTaxPlanningHero,
} from './BusinessServicesAnimations';

// Group 3: CPA Outsourcing Part 1 (11 - 15)
import {
  TaxPrepOutsourcingHero,
  BookkeepingOutsourcingHero,
  AccountingOutsourcingHero,
  PayrollProcessingHero,
  AuditSupportHero,
} from './CpaOutsourcingPart1Animations';

// Group 4: CPA Outsourcing Part 2 (16 - 20)
import {
  FinancialStatementPrepHero,
  TaxReviewSupportHero,
  YearEndCleanupHero,
  WriteUpServicesHero,
  StaffAugmentationHero,
} from './CpaOutsourcingPart2Animations';

interface ServiceHeroAnimationRouterProps {
  service: ServiceItem;
}

export function ServiceHeroAnimationRouter({ service }: ServiceHeroAnimationRouterProps) {
  switch (service.slug) {
    // 1. Individual Tax Preparation
    case 'individual-tax-prep':
      return <IndividualTaxPrepHero />;

    // 2. Family Tax Planning
    case 'family-tax-planning':
      return <FamilyTaxPlanningHero />;

    // 3. Personal Tax Consultation
    case 'personal-tax-consultation':
      return <PersonalTaxConsultationHero />;

    // 4. IRS Assistance
    case 'irs-assistance':
      return <IrsAssistanceHero />;

    // 5. Business Tax Preparation
    case 'business-tax-preparation':
      return <BusinessTaxPrepHero />;

    // 6. Accounting Services
    case 'accounting-services':
      return <AccountingServicesHero />;

    // 7. Bookkeeping
    case 'bookkeeping':
      return <BookkeepingHero />;

    // 8. Payroll Management
    case 'payroll-management':
      return <PayrollManagementHero />;

    // 9. Financial Reporting
    case 'financial-reporting':
      return <FinancialReportingHero />;

    // 10. US Tax Planning for the year ahead
    case 'business-tax-planning':
      return <BusinessTaxPlanningHero />;

    // 11. US Tax Preparation & Outsourcing Services
    case 'tax-prep-outsourcing':
      return <TaxPrepOutsourcingHero />;

    // 12. Bookkeeping Outsourcing
    case 'bookkeeping-outsourcing':
      return <BookkeepingOutsourcingHero />;

    // 13. Accounting Outsourcing
    case 'accounting-outsourcing':
      return <AccountingOutsourcingHero />;

    // 14. Payroll Processing
    case 'payroll-processing':
      return <PayrollProcessingHero />;

    // 15. Audit Support
    case 'audit-support':
      return <AuditSupportHero />;

    // 16. Financial Statement Preparation
    case 'financial-statement-prep':
      return <FinancialStatementPrepHero />;

    // 17. Tax Review Support
    case 'tax-review-support':
      return <TaxReviewSupportHero />;

    // 18. Year-End Cleanup
    case 'year-end-cleanup':
      return <YearEndCleanupHero />;

    // 19. Write-up Services
    case 'write-up-services':
      return <WriteUpServicesHero />;

    // 20. Dedicated Staff Augmentation
    case 'dedicated-staff-augmentation':
      return <StaffAugmentationHero />;

    default:
      // Fallback for custom or unmapped services
      return <IndividualTaxPrepHero />;
  }
}
