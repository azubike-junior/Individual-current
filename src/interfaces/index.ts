export interface CsProps {
  _uploadTypes?: string;
  _branchcode?: string;
  _lga?: string;
  _title?: string;
  _gender?: string;
  _city?: string;
  _state?: string;
  bvn?: string;
  branchcode?: number;
  title?: number;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  telNumber1?: string;
  telNumber2?: string;
  dateofBirth?: string;
  emailAddress?: string;
  productType?: string;
  address1?: string;
  address2?: string;
  city?: number;
  motherMaidenName?: string;
  gender?: number;
  imgName?: string;
  state?: number;
  documentType?: string;
  dateOfissue?: string;
  expireDate?: string;
  idNumber?: string;
  stateOfResidence?: number;
  lga?: number;
  nationality?: string;
  religion?: number;
  maritalStatus?: number;
  detailOfNextKinRequest?: NextOfKin;
  employmentDetialRequest?: EmploymentDetails;
  uploadDocumentRequest: UploadDetails[];
  accountServicesRequest: AccountService;
  refereesRequests: Reference;
}

export interface DataProps {
  bvn: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  phoneNumber1: string;
  gender: string;
  email: string;
  nationality: string;
  surname: string;
  nin: string;
  maritalStatus: string;
  address: string;
  residentialAddress: string;
  responseCode?: string;
}

export interface AccountService {
  transactionAlertPreference?: TransactionService;
  electronicBankPreference?: ElectronicService;
  chequeConfirmation?: boolean;
}

export interface TransactionService {
  emailAlert?: string;
  smsAlert?: string;
}

export interface ElectronicService {
  internetBanking?: string;
  mobileMoney?: string;
  debitCard?: string;
}

export interface UploadDetails {
  uploadDocs: any;
  docType: string;
  imgName?: string;
  extension: string;
  docTypeName?: string;
  doc?: any;
  fileUrl?: string;
}

export interface NextOfKin {
  surName: string;
  firstName: string;
  phone1: string;
  phone2: string;
  email: string;
  gender: string;
  relationship: string;
  residentialAddress: string;
}

export interface EmploymentDetails {
  employmentStatus: string;
  annualSalary: string;
}

export interface Reference {
  fileExt?: string;
  imgName?: string;
  fileUrl?: string;
  uploadDocument?: string;
  refereesRequest: refereeRequest[];
}

interface refereeRequest {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export interface FetchArgs extends RequestInit {
  url: string;
  params?: Record<string, any>;
  body?: any;
  responseHandler?: "json" | "text" | ((response: Response) => Promise<any>);
  validateStatus?: (response: Response, body: any) => boolean;
}