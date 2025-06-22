export interface ValidFor {
  startDateTime: string;
  endDateTime: string;
}

export interface PlaceRef {
  '@type': string;
  '@referredType': string;
  id: string;
  href: string;
  name: string;
}

export interface ProductSpecificationRef {
  '@type': string;
  '@referredType': string;
  id: string;
  href: string;
  version: string;
  name: string;
}

export interface CategoryRef {
  '@type': string;
  '@referredType': string;
  id: string;
  href: string;
  version: string;
  name: string;
}

export interface ProductOffering {
  '@type': string;
  id: string;
  href: string;
  name: string;
  description: string;
  version: string;
  validFor: ValidFor;
  lastUpdate: string;
  lifecycleStatus: string;
  isBundle: boolean;
  isSellable: boolean;
  statusReason: string;
  place: PlaceRef[];
  productSpecification: ProductSpecificationRef;
  category: CategoryRef[];
}