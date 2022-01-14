import { useStateMachine } from "little-state-machine";
import React, { SyntheticEvent, useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { CsProps } from "../../interfaces";
import {
  useGetBankBranchQuery,
  useGetBankNameQuery,
  useGetCityQuery,
  useGetLgtQuery,
  useGetStatesQuery,
  useGetUploadTypeQuery,
} from "../../services/Queries/dropDowns";
import {
  annualSalary,
  employmentStatus,
  emptyData,
  genders,
  maritalStatuses,
  titles,
} from "../../utils/constant";
import { CheckInput, HookInputField, SelectInput } from "../InputField";
import {
  convertDateToNum,
  getBase64,
  getText,
  getValues,
  updateName,
} from "../../utils/utilities";
import { religions } from "../../utils/constant";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import {
  handleNext,
  handlePrevious,
  useValidateBvnMutation,
} from "../../services/Mutations/apis";
import Loader from "../Loader";
import { TransactionService } from "./../../interfaces/index";
import {
  FileService,
  validateFileSize,
  validateFileType,
} from "../../utils/validator";

export default function AccountSpecifications() {
  const dispatch = useDispatch();
  const [fileType, setFileType] = useState("");
  const [fileBase64, setFileBase64] = useState("");
  const [imgName, setImageName] = useState("");
  const [docTypeName, setDocTypeName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [refData, setRefData] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
  });
  const [doc, setDoc] = useState<File>();
  const [refError, setRefError] = useState("");
  const [uploadDocError, setUploadDocError] = useState("");
  const [referenceFile, setReferenceFile] = useState<any>([]);
  const [internetbanking, setInternetBanking] = useState("");
  const [debitCard, setDebitCard] = useState("");
  const [mobileMoney, setMobileMoney] = useState("");
  const [emailAlert, setEmailAlert] = useState("");
  const [smsAlert, setSmsAlert] = useState("");
  const [internetBankingChecked, setInternetBankingChecked] = useState(false);
  const [debitCardChecked, setDebitCardChecked] = useState(false);
  const [mobileMoneyChecked, setMobileMoneyChecked] = useState(false);
  const [emailAlertChecked, setEmailAlertChecked] = useState(false);
  const [smsAlertChecked, setSmsAlertChecked] = useState(false);

  const inputRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;

  const { state, actions } = useStateMachine({ updateName });

  const { transactionAlertPreference, electronicBankPreference } =
    state.data.accountServicesRequest;

  const handleEmailAlert = (e: React.ChangeEvent<HTMLInputElement>) => {
    actions.updateName({
      ...state.data,
      accountServicesRequest: {
        transactionAlertPreference: {
          smsAlert: transactionAlertPreference?.smsAlert,
          emailAlert: e.target.checked ? e.target.value : "",
        },
        electronicBankPreference: {
          internetBanking: electronicBankPreference?.internetBanking,
          debitCard: electronicBankPreference?.debitCard,
          mobileMoney: electronicBankPreference?.mobileMoney,
        },
      },
    });
    setEmailAlertChecked(e.target.checked);
  };
  const handleSmsAlert = (e: React.ChangeEvent<HTMLInputElement>) => {
    actions.updateName({
      ...state.data,
      accountServicesRequest: {
        transactionAlertPreference: {
          smsAlert: e.target.checked ? e.target.value : "",
          emailAlert: transactionAlertPreference?.emailAlert,
        },
        electronicBankPreference: {
          internetBanking: electronicBankPreference?.internetBanking,
          debitCard: electronicBankPreference?.debitCard,
          mobileMoney: electronicBankPreference?.mobileMoney,
        },
      },
    });
    setSmsAlertChecked(e.target.checked);
  };

  const handleInternetBanking = (e: React.ChangeEvent<HTMLInputElement>) => {
    actions.updateName({
      ...state.data,
      accountServicesRequest: {
        transactionAlertPreference: {
          smsAlert: transactionAlertPreference?.smsAlert,
          emailAlert: transactionAlertPreference?.emailAlert,
        },
        electronicBankPreference: {
          internetBanking: e.target.checked ? e.target.value : "",
          debitCard: electronicBankPreference?.debitCard,
          mobileMoney: electronicBankPreference?.mobileMoney,
        },
      },
    });
    setInternetBankingChecked(e.target.checked);
  };

  const handleDebitCard = (e: React.ChangeEvent<HTMLInputElement>) => {
    actions.updateName({
      ...state.data,
      accountServicesRequest: {
        transactionAlertPreference: {
          smsAlert: transactionAlertPreference?.smsAlert,
          emailAlert: transactionAlertPreference?.emailAlert,
        },
        electronicBankPreference: {
          debitCard: e.target.checked ? e.target.value : "",
          mobileMoney: electronicBankPreference?.mobileMoney,
          internetBanking: electronicBankPreference?.internetBanking,
        },
      },
    });
    setDebitCardChecked(e.target.checked);
  };

  const handleMobileMoney = (e: React.ChangeEvent<HTMLInputElement>) => {
    actions.updateName({
      ...state.data,
      accountServicesRequest: {
        transactionAlertPreference: {
          smsAlert: transactionAlertPreference?.smsAlert,
          emailAlert: transactionAlertPreference?.emailAlert,
        },
        electronicBankPreference: {
          mobileMoney: e.target.checked ? e.target.value : "",
          internetBanking: electronicBankPreference?.internetBanking,
          debitCard: electronicBankPreference?.debitCard,
        },
      },
    });
    setMobileMoneyChecked(e.target.checked);
  };

  const [validateBvn, { data: response, isLoading }] = useValidateBvnMutation();

  const { data: states } = useGetStatesQuery("");
  const { data: LGA } = useGetLgtQuery("");
  const { data: uploadTypes } = useGetUploadTypeQuery("");
  const { data: cities } = useGetCityQuery("");
  const { data: branches } = useGetBankBranchQuery("");
  const { data: banks } = useGetBankNameQuery("");
  const newValue = { value: "", text: "-select-" };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CsProps>({
    defaultValues: {
      ...state.data,
    },
  });

  const pattern2 = {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "invalid email address",
  };

  const submitHandler = (data: CsProps) => {
    data.firstName = response?.firstName;
    data.bvn = response?.bvn;
    data.lastName = response?.lastName;
    data.telNumber1 = response?.phoneNumber1;
    data.middleName = response?.middleName;
    data.dateofBirth = response?.dateOfBirth;
    data.nationality = response?.nationality;
    data.city = Number(data.city);
    data.gender = Number(data.gender);
    data.title = Number(data.title);
    data.lga = Number(data.lga);
    data.state = Number(data.state);
    data.branchcode = Number(data.branchcode);
    data.maritalStatus = Number(data.maritalStatus);
    data.religion = Number(data.religion);
    data.stateOfResidence = Number(data.stateOfResidence);
    data._city = getText(cities, data?.city);
    data._gender = getText(genders, data?.gender);
    data._lga = getText(LGA, data.lga);
    data._state = getText(states, data.state);
    data._title = getText(titles, data.title);
    data._branchcode = getText(branches, data.branchcode);

    const docsArray = data.refereesRequests.refereesRequest;

    //To be done later
    // const bankText = banks?.find(
    //   (bankItem: any) =>
    //     bankItem.value === data.refereesRequests.refereesRequest[0].bankName)?.text;

    // console.log("====================================");
    // console.log(bankText);
    // console.log("====================================");

    data.refereesRequests.refereesRequest.map((item) => {
      setRefData({
        accountName: item.accountName,
        accountNumber: item.accountNumber,
        bankName: item.bankName,
      });
    });

    state.data = {
      ...data,
      refereesRequests: {
        ...state.data.refereesRequests,
        refereesRequest: [...docsArray, refData],
      },
      accountServicesRequest: {
        transactionAlertPreference: {
          emailAlert: transactionAlertPreference?.emailAlert,
          smsAlert: transactionAlertPreference?.smsAlert,
        },
        electronicBankPreference: {
          internetBanking: electronicBankPreference?.internetBanking,
          mobileMoney: electronicBankPreference?.mobileMoney,
          debitCard: electronicBankPreference?.debitCard,
        },
        chequeConfirmation: false,
      },
    };

    if (!state.data.refereesRequests.fileExt) {
      return setRefError(
        "You need to upload the filled Reference Form to continue"
      );
    }

    actions.updateName(state.data);
    dispatch(handleNext());

    console.log("data", data);
  };

  const goBack = () => {
    window.location.reload();
    localStorage.clear();
  };

  const handleFiles = async (e: HTMLInputElement) => {
    const file = e.files;

    // console.log(">>>>file", file);

    if (!file) {
      return setUploadDocError("an image is required");
    }
    const validFileSize = await validateFileSize(file[0]?.size);

    const validFileType = await validateFileType(
      FileService.getFileExtension(file[0]?.name)
    );

    if (!validFileSize.isValid) {
      setUploadDocError(validFileSize.errorMessage);
      return;
    }

    if (!validFileType.isValid) {
      setUploadDocError(validFileType.errorMessage);
      return;
    }
    const imageUrl = URL.createObjectURL(file[0]);

    setFileUrl(imageUrl);
    setDoc(file[0]);
    setFileType(file[0].type);
    setImageName(file[0].name);
    getBase64(file).then((result: any) => {
      setFileBase64(result);
    });
    setUploadDocError("");
  };

  useEffect(() => {
    const bvn = JSON.parse(localStorage.getItem("userBvn") || "{}");
    if (bvn) {
      validateBvn(bvn);
    }
  }, []);

  //submit function
  const submitFilledReferenceForm = () => {
    if (fileBase64 === "") {
      return setUploadDocError("You need to choose a file ");
    }

    // if (uploadDocError) {
    //   return;
    // }

    actions.updateName({
      ...state.data,
      refereesRequests: {
        ...state.data.refereesRequests,
        fileUrl,
        fileExt: fileType,
        imgName,
        uploadDocument: fileBase64,
      },
    });

    inputRef.current.value = "";
  };

  // console.log(">>>>>state", state.data.refereesRequests, fileType, imgName);

  return (
    <div
      className="tab-pane fade show active"
      id="account_spec"
      role="tabpanel"
      aria-labelledby="account_spec-tab"
    >
      {Object.keys(errors).length > 0 && (
        <span className="text-danger d-flex justify-content-center">
          Please fill all required fields
        </span>
      )}
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="col-lg-12 m-t-20">
          <div className="row">
            {/* <!-- PERSONAL DETAILS --> */}
            <div className="col-lg-12">
              <div className="panel panel-default">
                <div className="panel-heading text-center bg-gray white-text text-white font-weight-900">
                  PERSONAL DETAILS
                </div>
                <div className="panel-body">
                  <div className="user_bvn_data_row1 font-12">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="form-group col-lg-4 col-md-6 col-sm-12 font-weight-700">
                          <HookInputField
                            label="BANK VERIFICATION NUMBER (BVN)"
                            type="text"
                            readOnly
                            value={response?.bvn}
                            // value="76339393993"
                            register={register}
                            name="bvn"
                          />
                        </div>

                        <SelectInput
                          className="form-group col-lg-4 col-md-6 col-sm-12 font-weight-700"
                          required
                          name="title"
                          label="TITLE"
                          register={register}
                          selectArray={getValues(titles, newValue)}
                          // selectArray={titles}
                          // errors={errors?.title}
                          type="text"
                          message="Title is required"
                        />

                        <SelectInput
                          className="form-group col-lg-4 col-md-6 col-sm-12 font-weight-700"
                          required
                          name="gender"
                          label="GENDER"
                          register={register}
                          selectArray={getValues(genders, newValue)}
                          // selectArray={genders}
                          // errors={errors.gender}
                          type="text"
                          message="Gender is required"
                        />

                        <div className="form-group col-lg-4 col-md-6 col-sm-12 font-weight-700">
                          <HookInputField
                            label="FIRST NAME"
                            type="text"
                            readOnly
                            register={register}
                            name="firstName"
                            value={response?.firstName}
                            // value="sean"
                            // errors={""}
                          />
                        </div>
                        <div className="form-group col-lg-4 col-md-6 col-sm-12 font-weight-700">
                          <HookInputField
                            optional
                            label="MIDDLE NAME"
                            type="text"
                            readOnly
                            register={register}
                            value={response?.middleName}
                            // value="azu"
                            name="middleName"
                            // errors={""}
                          />
                        </div>
                        <div className="form-group col-lg-4 col-md-6 col-sm-12 font-weight-700">
                          <HookInputField
                            label="LAST NAME"
                            type="text"
                            readOnly
                            value={response?.lastName}
                            // value="saan"
                            register={register}
                            name="lastName"
                            // errors={""}
                          />
                        </div>
                        <div className="form-group col-lg-4 col-m d-6 col-sm-12 font-weight-700">
                          <HookInputField
                            label="PHONE 1"
                            type="number"
                            value={response?.phoneNumber1}
                            // value="63733838"
                            readOnly
                            maxLength={11}
                            register={register}
                            name="telNumber1"
                            // errors={""}
                          />
                        </div>
                        <div className="form-group col-lg-4 col-md-6 col-sm-12 font-weight-700">
                          <HookInputField
                            optional
                            type="number"
                            label="PHONE 2"
                            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                              (e.target.value = e.target.value.slice(0, 11))
                            }
                            name="telNumber2"
                            register={register}
                            placeholder="Enter a second Phone Number"
                          />
                        </div>
                        <div className="form-group col-lg-4 col-md-6 col-sm-12 font-weight-700">
                          <HookInputField
                            errors={errors.emailAddress}
                            type="text"
                            label="Email"
                            name="emailAddress"
                            pattern={pattern2}
                            placeholder="Enter your email address"
                            register={register}
                            required
                            message="Email is required"
                          />
                        </div>
                        <div className="form-group col-lg-4 col-md-6 col-sm-12 font-weight-700">
                          <HookInputField
                            message="Mother maiden name is required"
                            type="text"
                            label="MOTHERS MAIDEN NAME"
                            // onChange={handleChange}
                            required
                            name="motherMaidenName"
                            register={register}
                            // errors={errors.motherMaidenName}
                          />
                        </div>
                        <div className="form-group col-lg-4 col-md-6 col-sm-12 font-weight-700">
                          <HookInputField
                            type="text"
                            name="dateofBirth"
                            value={response?.dateOfBirth}
                            readOnly
                            label="DATE OF BIRTH"
                            register={register}
                            // errors={""}
                          />
                        </div>

                        <SelectInput
                          className="form-group col-lg-4 col-md-6 col-sm-12 font-weight-700"
                          name="city"
                          label="PLACE OF BIRTH"
                          register={register}
                          selectArray={getValues(states, newValue)}
                          // selectArray={cities}
                          required
                          // errors={errors.city}
                          type="text"
                          message="Place of birth is required"
                        />
                        <SelectInput
                          className="form-group col-lg-4 col-md-6 col-sm-12 font-weight-700"
                          name="state"
                          label="STATE OF ORIGIN"
                          register={register}
                          selectArray={getValues(states, newValue)}
                          // selectArray={states}
                          required
                          // errors={errors.state}
                          type="text"
                          message="State of origin is required"
                        />

                        <SelectInput
                          className="form-group col-lg-4 col-md-6 col-sm-12 font-weight-700"
                          name="lga"
                          label="LGA"
                          register={register}
                          selectArray={getValues(LGA, newValue)}
                          // selectArray={LGA}
                          required
                          // errors={errors.lga}
                          type="text"
                          message="LGA is required"
                        />

                        <div className="form-group col-lg-4 col-md-6 col-sm-12 font-weight-700">
                          <HookInputField
                            type="text"
                            name="nationality"
                            readOnly
                            label="NATIONALITY"
                            register={register}
                            // errors={""}
                            // value={response?.nationality}
                            value="Nigeria"
                          />
                        </div>
                        <SelectInput
                          className="form-group col-lg-4 col-md-6 col-sm-12 font-weight-700"
                          name="religion"
                          label="RELIGION"
                          register={register}
                          selectArray={getValues(religions, newValue)}
                          required
                          placeholder="Select"
                          // errors={errors.religion}
                          type="text"
                          message="religion is required"
                        />

                        <SelectInput
                          className="form-group col-lg-4 col-md-6 col-sm-12 font-weight-700"
                          name="maritalStatus"
                          label="MARITAL STATUS"
                          readOnly
                          register={register}
                          selectArray={getValues(maritalStatuses, newValue)}
                          required
                          // errors={errors.maritalStatus}
                          type="text"
                          message="marital status is required"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- ADDRESS DETAILS --> */}
            <div className="col-lg-4">
              <div className="panel panel-default">
                <div className="panel-heading text-center bg-gray white-text text-white font-weight-900">
                  ADDRESS DETAILS
                </div>
                <div className="panel-body panel-height">
                  <div className="user_bvn_data_row1 font-12">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="form-group col-lg-12 col-md-6 col-sm-12 font-weight-700">
                          <HookInputField
                            label="RESIDENTIAL ADDRESS"
                            type="text"
                            register={register}
                            // errors={errors.address1}
                            required
                            placeholder="Enter address"
                            name="address1"
                            message="residential address is required"
                          />
                        </div>

                        <SelectInput
                          className="form-group col-lg-12 col-md-6 col-sm-12 font-weight-700"
                          name="lga"
                          label="LGA"
                          register={register}
                          selectArray={getValues(LGA, newValue)}
                          required
                          // errors={errors.lga}
                          type="text"
                          message="local govt is required"
                        />

                        <SelectInput
                          className="form-group col-lg-12 col-md-6 col-sm-12 font-weight-700"
                          name="stateOfResidence"
                          label="STATE OF RESIDENCE"
                          register={register}
                          selectArray={getValues(states, newValue)}
                          required
                          // errors={errors.state}
                          type="text"
                          message="state of residence is required"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- MEANS OF IDENTIFICATION DETAILS --> */}
            <div className="col-lg-4">
              <div className="panel panel-default">
                <div className="panel-heading text-center bg-gray white-text text-white font-weight-900">
                  MEANS OF IDENTIFICATION
                </div>
                <div className="panel-body panel-height">
                  <div className="user_bvn_data_row1 font-12">
                    <div className="col-lg-12">
                      <div className="row">
                        <SelectInput
                          className="form-group col-lg-12 col-md-6 col-sm-12 font-weight-700"
                          name="documentType"
                          label="DOCUMENT TYPE"
                          register={register}
                          selectArray={getValues(uploadTypes, newValue)}
                          // selectArray={uploadTypes}
                          required
                          // errors={errors.documentType}
                          type="text"
                          message="document upload is required"
                        />

                        <div className="form-group col-lg-12 col-md-6 col-sm-12 font-weight-700">
                          <HookInputField
                            label="ID NUMBER"
                            type="text"
                            // minLength={11}
                            register={register}
                            errors={errors.idNumber}
                            // onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                            //   (e.target.value = e.target.value.slice(0, 11))
                            // }
                            required
                            placeholder="ID Number"
                            name="idNumber"
                            message="ID number must be 12 digit"
                          />
                        </div>

                        <div className="form-group col-lg-6 col-md-6 col-sm-12 font-weight-700">
                          <HookInputField
                            label="DATE OF ISSUE"
                            type="date"
                            register={register}
                            errors={errors?.dateOfissue}
                            required
                            placeholder="enter date of issuance"
                            name="dateOfIssue"
                            message="date of issuance is required"
                          />
                        </div>

                        <div className="form-group col-lg-6 col-md-6 col-sm-12 font-weight-700">
                          <HookInputField
                            label="EXPIRY DATE"
                            type="date"
                            register={register}
                            // errors={errors.expireDate}
                            required
                            placeholder="enter expiry date"
                            name="expireDate"
                            message="expiry date is required"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- ACCOUNT SPECIFICATIONS --> */}
            <div className="col-lg-4">
              <div className="panel panel-default">
                <div className="panel-heading text-center bg-gray white-text text-white font-weight-900">
                  ACCOUNT SPECIFICATIONS
                </div>
                <div className="panel-body panel-height">
                  <div className="user_bvn_data_row1 font-12">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="form-group col-lg-12 col-md-6 col-sm-12 font-weight-700">
                          <HookInputField
                            label="ACCOUNT TYPE"
                            type="text"
                            register={register}
                            // errors={errors.accountSpecification?.productType}
                            required
                            // placeholder="id Number"
                            name="productType"
                            // message="product type is required"
                            productInfo
                            value="Savings"
                            readOnly
                          />
                        </div>

                        <SelectInput
                          className="form-group col-lg-12 col-md-6 col-sm-12 font-weight-700"
                          name="branchcode"
                          label="BANK BRANCH"
                          register={register}
                          selectArray={getValues(branches, newValue)}
                          required
                          // errors={errors.branchcode}
                          type="text"
                          message="bank branch is required"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- DETAILS NEXT OF KIN --> */}

            <div className="col-lg-6">
              <div className="panel panel-default">
                <div className="panel-heading text-center bg-gray white-text text-white font-weight-900">
                  NEXT OF KIN
                </div>
                <div className="panel-body panel-height-2">
                  <div className="user_bvn_data_row1 font-12">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="form-group col-lg-6 col-md-6 col-sm-12 font-weight-700">
                          <HookInputField
                            label="SURNAME"
                            type="text"
                            register={register}
                            name="detailOfNextKinRequest.surName"
                            // errors={errors.detailOfNextKinRequest?.surName}
                            required
                            message="next of kin surname is required"
                          />
                        </div>
                        <div className="form-group col-lg-6 col-md-6 col-sm-12 font-weight-700">
                          <HookInputField
                            label="FIRST NAME"
                            type="text"
                            register={register}
                            name="detailOfNextKinRequest.firstName"
                            // errors={errors.detailOfNextKinRequest?.firstName}
                            required
                            message="next of kin first name is required"
                          />
                        </div>
                        <div className="form-group col-lg-6 col-md-6 col-sm-12 font-weight-700">
                          <HookInputField
                            label="PHONE NUMBER"
                            type="number"
                            register={register}
                            minLength={11}
                            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                              (e.target.value = e.target.value.slice(0, 11))
                            }
                            name="detailOfNextKinRequest.phone1"
                            errors={errors.detailOfNextKinRequest?.phone1}
                            required
                            message="a valid phone number is required"
                          />
                        </div>

                        <div className="form-group col-lg-6 col-md-6 col-sm-12 font-weight-700">
                          <HookInputField
                            label="RELATIONSHIP"
                            type="text"
                            register={register}
                            name="detailOfNextKinRequest.relationship"
                            // errors={errors.detailOfNextKinRequest?.relationship}
                            required
                            message="relationship is required"
                          />
                        </div>

                        <div className="form-group col-lg-12 col-md-6 col-sm-12 font-weight-700">
                          <HookInputField
                            label="EMAIL"
                            type="text"
                            pattern={pattern2}
                            register={register}
                            name="detailOfNextKinRequest.email"
                            errors={errors.detailOfNextKinRequest?.email}
                            required
                            message="invalid email address"
                          />
                        </div>

                        <div className="form-group col-lg-12 col-md-12 col-sm-12 font-weight-700">
                          <label>RESIDENTIAL ADDRESS</label>
                          <span className="text-danger pl-2">*</span>
                          {/* {errors.detailOfNextKinRequest
                            ?.residentialAddress && (
                            <span className="pl-2 text-danger">
                              residential address is required
                            </span>
                          )} */}
                          <textarea
                            {...register(
                              "detailOfNextKinRequest.residentialAddress",
                              {
                                required: true,
                              }
                            )}
                            className="form-control"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- EMPLOYMENT DETAILS --> */}
            <div className="col-lg-6">
              <div className="panel panel-default">
                <div className="panel-heading text-center bg-gray white-text text-white font-weight-900">
                  EMPLOYMENT DETAILS
                </div>
                <div className="panel-body panel-height-3">
                  <div className="user_bvn_data_row1 font-12">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="align-items-center justify-content-center col-lg-12 m-t-20">
                          <SelectInput
                            className="form-group col-lg-12 col-md-6 col-sm-12 font-weight-700"
                            name="employmentDetialRequest.employmentStatus"
                            label="EMPLOYMENT STATUS"
                            register={register}
                            selectArray={getValues(employmentStatus, newValue)}
                            required
                            type="text"
                            message="employment details is required"
                          />
                          <SelectInput
                            className="form-group col-lg-12 col-md-6 col-sm-12 font-weight-700"
                            name="employmentDetialRequest.annualSalary"
                            label="ANNUAL SALARY / EXPECTED INCOME (LESS THAN)"
                            register={register}
                            selectArray={getValues(annualSalary, newValue)}
                            required
                            type="text"
                            message="expected income is required"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- REFERENCE 1 DETAILS --> */}
            <div className="col-lg-12">
              <div className="panel panel-default">
                <div className="panel-heading text-center bg-gray white-text text-white font-weight-900">
                  REFERENCES
                </div>
                <div className="block d-lg-flex">
                  <div className="panel-body">
                    <div className="user_bvn_data_row1 font-12">
                      <div className="col-lg-12">
                        <div className="row">
                          <p className="pl-3 font-weight-900">REFEREE 1</p>

                          <SelectInput
                            className="form-group col-lg-12 col-md-6 col-sm-12 font-weight-700"
                            name="refereesRequests.refereesRequest[0].bankName"
                            type="text"
                            label="BANK NAME"
                            selectArray={getValues(banks, newValue)}
                            register={register}
                            required
                          />

                          <div className="form-group col-lg-12 col-md-12 col-sm-12 font-weight-700">
                            <HookInputField
                              name="refereesRequests.refereesRequest[0].accountNumber"
                              type="number"
                              label="ACCOUNT NUMBER"
                              maxLength={11}
                              register={register}
                              onInput={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) =>
                                (e.target.value = e.target.value.slice(0, 10))
                              }
                              // errors={errors.reference1?.phone}
                              required
                              message="Account Number as to be 11 digit"
                            />
                          </div>

                          <div className="form-group col-lg-12 col-md-12 col-sm-12 font-weight-700 m-b-50">
                            <HookInputField
                              name="refereesRequests.refereesRequest[0].accountName"
                              type="text"
                              label="ACCOUNT NAME"
                              // pattern={pattern2}
                              register={register}
                              required
                              // errors={errors.reference1?.email}
                              message="Account Name is required"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="panel-body">
                    <div className="user_bvn_data_row1 font-12">
                      <div className="col-lg-12">
                        <div className="row">
                          <p className="pl-3 font-weight-900">REFEREE 2</p>
                          <SelectInput
                            name="refereesRequests.refereesRequest[1].bankName"
                            className="form-group col-lg-12 col-md-6 col-sm-12 font-weight-700"
                            type="text"
                            label="BANK NAME"
                            register={register}
                            selectArray={getValues(banks, newValue)}
                            required
                          />

                          <div className="form-group col-lg-12 col-md-12 col-sm-12 font-weight-700">
                            <HookInputField
                              name="refereesRequests.refereesRequest[1].accountNumber"
                              type="number"
                              label="ACCOUNT NUMBER"
                              register={register}
                              onInput={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) =>
                                (e.target.value = e.target.value.slice(0, 10))
                              }
                              maxLength={11}
                              message="Account Number as to be 11 digits"
                              required
                              // errors={errors.reference2?.phone}
                            />
                          </div>

                          <div className="form-group col-lg-12 col-md-12 col-sm-12 font-weight-700 m-b-50">
                            <HookInputField
                              name="refereesRequests.refereesRequest[1].accountName"
                              type="text"
                              label="ACCOUNT NAME"
                              register={register}
                              // pattern={pattern2}
                              required
                              // errors={
                              //   errors.refereesRequests?.refereesRequest[1]
                              //     .accountName
                              // }
                              message="referees Account Name is required"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {refError && (
                  <span className="text-danger d-flex py-4 justify-content-center pl-2">
                    {refError}
                  </span>
                )}
                <div className="form-group col-lg-12 font-weight-700 block d-lg-flex justify-content-center ">
                  <label className="text-center pr-4 pt-1">
                    UPLOAD FILLED REFERENCE FORM
                  </label>

                  <div className="border py-2 px-2 mb-4">
                    <input
                      ref={inputRef}
                      type="file"
                      onChange={(e: SyntheticEvent) =>
                        handleFiles(e.currentTarget as HTMLInputElement)
                      }
                      className=""
                    />
                  </div>

                  <div className="form-group col-lg-2">
                    <div
                      className="btn btn-block btn-suntrust"
                      onClick={submitFilledReferenceForm}
                    >
                      SUBMIT
                    </div>
                  </div>
                </div>

                <div className="form-group col-lg-12 font-weight-700 d-flex justify-content-center">
                  <div className="col-lg-7">
                    <div className="header">
                      <h5>Uploaded Documents</h5>
                    </div>
                    <div className="table-responsive border">
                      <table className="table table-hover mb-0 c_list">
                        <thead style={{ backgroundColor: "#c4c4c4" }}>
                          <tr>
                            <th>ATTACHMENT</th>
                            <th>ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* {state.data.ref?.map((item: any, index: number) => {
                            const {
                              imgName,

                              fileUrl,
                            } = item;
                            return ( */}
                          <tr key={1}>
                            <td>{state.data.refereesRequests.imgName}</td>
                            <td>
                              {state.data.refereesRequests.fileUrl && (
                                <button
                                  type="button"
                                  className="btn btn-suntrust btn-sm m-b-5 mr-4"
                                  data-toggle="modal"
                                  data-target="#exampleModal"
                                >
                                  <a
                                    href={state.data.refereesRequests.fileUrl}
                                    target="_blank"
                                    style={{ color: "#fff" }}
                                    className="px-2"
                                  >
                                    view
                                  </a>
                                </button>
                              )}
                              {/* {state.data.refereesRequests.imgName && (
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm m-b-5"
                                  title="Delete"
                                  // onClick={() => deleteDocument(docType)}
                                >
                                  Delete
                                </button>
                              )} */}
                            </td>
                          </tr>
                          {/* );
                          })} */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- ACCOUNT SERVICES REQUIRED --> */}
        <div className="col-lg-12">
          <div className="panel panel-default">
            <div className="panel-heading text-center bg-gray white-text text-white font-weight-900">
              ACCOUNT SERVICES REQUIRED (fees may apply)
            </div>
            <div className="panel-body block d-md-flex d-lg-flex">
              <div className="form-group col-md-6">
                <label className="ml-3">ELECTRONIC BANKING PREFERENCES</label>
                <div className="eb_pref font-12 form-group col-lg-12 col-md-6 col-sm-12">
                  <div className="form-check-inline flex justify-center">
                    <input
                      checked={
                        state.data.accountServicesRequest
                          .electronicBankPreference?.internetBanking
                          ? true
                          : false
                      }
                      name="accountServiceRequest.electronicBankPreference.internetBanking"
                      value="internetBanking"
                      type="checkbox"
                      className="form-check-input mt-1"
                      onChange={handleInternetBanking}
                      data-parsley-errors-container="#error-checkbox"
                    />
                    <label className="pt-3">INTERNET BANKING</label>
                  </div>
                  <div className="form-check-inline flex justify-center">
                    <input
                      checked={
                        state.data.accountServicesRequest
                          .electronicBankPreference?.debitCard
                          ? true
                          : false
                      }
                      name="accountServiceRequest.electronicBankPreference.debitCard"
                      value="debitCard"
                      type="checkbox"
                      className="form-check-input mt-1"
                      onChange={handleDebitCard}
                      data-parsley-errors-container="#error-checkbox"
                    />
                    <label className="pt-3">DEBIT CARD</label>
                  </div>
                  <div className="form-check-inline flex justify-center">
                    <input
                      name="accountServiceRequest.electronicBankPreference.mobileMoney"
                      checked={
                        state.data.accountServicesRequest
                          .electronicBankPreference?.mobileMoney
                          ? true
                          : false
                      }
                      value="mobileMoney"
                      type="checkbox"
                      className="form-check-input mt-1"
                      onChange={handleMobileMoney}
                      data-parsley-errors-container="#error-checkbox"
                    />
                    <label className="pt-3">MOBILE MONEY</label>
                  </div>

                  <p id="error-checkbox"></p>
                </div>
              </div>

              <div className="form-group col-lg-12 col-md-6 col-sm-12">
                <label className="ml-3">TRANSACTION ALERT PREFERENCES</label>
                <div className="eb_pref font-12 form-group col-lg-12 col-md-6 col-sm-12">
                  <div className="form-check-inline flex justify-center">
                    <input
                      name="accountServiceRequest.transactionAlertPreference.emailAlert"
                      checked={
                        state.data.accountServicesRequest
                          .transactionAlertPreference?.emailAlert
                          ? true
                          : false
                      }
                      value="emailAlert"
                      type="checkbox"
                      className="form-check-input mt-1"
                      onChange={handleEmailAlert}
                      data-parsley-errors-container="#error-checkbox"
                    />
                    <label className="pt-3">EMAIL ALERT</label>
                  </div>
                  <div className="form-check-inline flex justify-center">
                    <input
                      name="accountServiceRequest.transactionAlertPreference.smsAlert"
                      checked={
                        state.data.accountServicesRequest
                          .transactionAlertPreference?.smsAlert
                          ? true
                          : false
                      }
                      value="smsAlert"
                      type="checkbox"
                      className="form-check-input mt-1"
                      onChange={handleSmsAlert}
                      data-parsley-errors-container="#error-checkbox"
                    />
                    <label className="pt-3">SMS ALERT</label>
                  </div>

                  <p id="error-checkbox"></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {Object.keys(errors).length > 0 && (
          <span className="text-danger d-flex justify-content-center">
            Please fill all required fields
          </span>
        )}

        <div className="form-group col-lg-12 col-md-12 col-sm-12 m-b-20">
          <div className="block d-md-flex d-lg-flex align-items-center justify-content-center m-t-20">
            <div className="user_acct_details mt-3 col-lg-2 col-md-6 col-sm-12">
              <button
                type="button"
                onClick={goBack}
                className="btn btn-block btn-suntrust font-weight-900"
              >
                PREVIOUS PAGE
              </button>
            </div>

            <div className="user_acct_details mt-3 col-lg-2 col-md-6 col-sm-12">
              <button
                type="submit"
                // onClick={handleNext}
                className="btn btn-block btn-suntrust font-weight-900"
              >
                NEXT PAGE
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
