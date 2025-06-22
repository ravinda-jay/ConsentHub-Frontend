export interface TermOrCondition {
  id?: string;
  description?: string;
  validFor?: {
    startDateTime?: Date;
    endDateTime?: Date;
  };
}

export interface AgreementItem {
  productOffering: Array<{
    id: string;
    name: string;
    href: string;
    '@referredType'?: string;
  }>;
  termOrCondition?: TermOrCondition[];
}

export interface RelatedParty {
  id: string;
  name: string;
  role: string;
  href?: string;
  '@referredType'?: string;
}

export interface AgreementSpecification {
  id: string;
  name: string;
  href: string;
  '@referredType'?: string;
}

export interface AgreementPeriod {
  startDateTime: Date;
  endDateTime?: Date;
}

export interface Agreement {
  id: string;
  name: string;
  agreementType: string;
  description?: string;
  statementOfIntent?: string;
  documentNumber?: number;
  agreementItem: AgreementItem[];
  agreementPeriod?: AgreementPeriod;
  agreementSpecification?: AgreementSpecification;
  engagedParty: RelatedParty[];
  relatedParty: RelatedParty[];
  '@type'?: string;
  '@baseType'?: string;
  '@schemaLocation'?: string;
  href?: string;
  createdDate: Date;
  updatedDate?: Date;
  status?: string;
  audit?: Array<{
    timestamp: Date;
    action: string;
    by: string;
  }>;
}