export const employmentStatus = [
  { value: "SELF EMPLOYED", text: "SELF EMPLOYED" },
  { value: "EMPLOYED", text: "EMPLOYED" },
  { value: "RETIRED", text: "RETIRED" },
  { value: "STUDENT", text: "STUDENT" },
  { value: "UNEMPLOYED", text: "UNEMPLOYED" },
  { value: "OTHERS", text: "OTHERS" },
];

export const uploadTypes = [
  {}
]

export const annualSalary = [
  { value: "50000", text: "50000" },
  { value: "51000-250000", text: "51000-250000" },
  { value: "251000-500000", text: "251000-500000" },
  { value: "501000-LESS THAN 1 MILLION", text: "501000-LESS THAN 1 MILLION" },
  {
    value: "1 MILLION-LESS THAN 5 MILLION",
    text: "1 MILLION-LESS THAN 5 MILLION",
  },
  {
    value: "5 MILLION-LESS THAN 10 MILLION",
    text: "5 MILLION-LESS THAN 10 MILLION",
  },
  {
    value: "10 MILLION-LESS THAN 20 MILLION",
    text: "10 MILLION-LESS THAN 20 MILLION",
  },
  { value: "ABOVE 20 MILLION", text: "ABOVE 20 MILLION" },
];

export const religions = [
  { text: "CHRISTIAN", value: 2 },
  { text: "MUSLIM", value: 1 },
];

export const maritalStatuses = [
  { value: 1, text: "SINGLE" },
  { value: 2, text: "MARRIED" },
  { value: 3, text: "DIVORCED" },
  { value: 4, text: "WIDOWED" },
];

export const titles = [
  { value: 1, text: "MR." },
  { value: 2, text: "MRS." },
  { value: 4, text: "MISS" },
  { value: 5, text: "MS" },
  { value: 6, text: "CHIEF" },
  { value: 9, text: "DR" },
  { value: 11, text: "ENGR" },
  { value: 12, text: "ALHAJI" },
  { value: 13, text: "ALHAJA" },
  { value: 16, text: "PASTOR" },
  { value: 35, text: "HIS MAJESTY" },
  { value: 36, text: "HER MAJESTY" },
];

export const genders = [
  { value: 1, text: "Male" },
  { value: 2, text: "Female" },
];

export const emptyData = {
  _branchcode: "",
  _lga: "",
  _title: "",
  _gender: "",
  _city: "",
  _state: "",
  _uploadTypes: "",
  bvn: "",
  branchcode: 0,
  title: 0,
  firstName: "",
  lastName: "",
  middleName: "",
  telNumber1: "",
  telNumber2: "",
  emailAddress: "",
  city: 0,
  lga: 0,
  motherMaidenName: "",
  dateofBirth: "",
  documentType: "",
  dateOfIssue: "",
  expireDate: "",
  gender: 0,
  state: 0,
  nationality: "",
  residentPermitNumber: "",
  placeOfPermitIssue: "",
  permitIssueDate: "",
  permitExpiryDate: "",
  religion: 1,
  address1: "",
  maritalStatus: 1,
  reference1: {
    fullName: "",
    email: "",
    phone: "",
  },
  reference2: {
    fullName: "",
    email: "",
    phone: "",
  },
  refereesRequests: [],
  idNumber: "",
  uploadDocumentRequest: [],
  detailOfNextKinRequest: {
    surName: "",
    firstName: "",
    phone1: "",
    phone2: "",
    email: "",
    gender: "",
    relationship: "",
    residentialAddress: "",
  },
  accountServicesRequest: {
    transactionAlertPreference: {
      emailAlert: "",
      smsAlert: "",
    },
    electronicBankPreference: {
      internetBanking: "",
      mobileMoney: "",
      debitCard: "",
    },
    chequeConfirmation: false,
  },
};
