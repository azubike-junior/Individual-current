import { useStateMachine } from "little-state-machine";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CsProps } from "../../interfaces";
import {
  useGetBankBranchQuery,
  useGetCityQuery,
  useGetLgtQuery,
  useGetStatesQuery,
  useGetUploadTypeQuery,
} from "../../services/Queries/dropDowns";
import {
  annualSalary,
  employmentStatus,
  genders,
  maritalStatuses,
  titles,
} from "../../utils/constant";
import { CheckInput, HookInputField, SelectInput } from "../InputField";
import { getText, getValues, updateName } from "../../utils/utilities";
import { religions } from "../../utils/constant";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import {
  handleNext,
  handlePrevious,
  useValidateBvnMutation,
} from "../../services/Mutations/apis";
import Loader from "../Loader";

export default function AccountSpecifications() {
  const dispatch = useDispatch();
  const [iB, setIb] = useState("");
  const [dC, setDc] = useState("");
  const [mobileM, setMobileM] = useState("");
  const [emailAlert, setEmailAlert] = useState("");
  const [smsAlert, setSmsAlert] = useState("");
  const [internetBankingChecked, setIbChecked] = useState(false);
  const [debitCardChecked, setDcChecked] = useState(false);
  const [mobileMoneyChecked, setMobileMoneyChecked] = useState(false);
  const [emailAlertChecked, setEmailAlertChecked] = useState(false);
  const [smsAlertChecked, setSmsAlertChecked] = useState(false);

  const { state, actions } = useStateMachine({ updateName });
  const handleEmailAlert = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailAlertChecked(e.target.checked);
    setEmailAlert(e.target.value);
  };
  const handleSmsAlert = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSmsAlertChecked(e.target.checked);
    setSmsAlert(e.target.value);
  };
  const handleIb = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIb(e.target.value);
    setIbChecked(e.target.checked);
  };
  const handleDc = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDc(e.target.value);
    setDcChecked(e.target.checked);
  };

  const handleMobileM = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobileM(e.target.value);
    setMobileMoneyChecked(e.target.checked);
  };

  const [validateBvn, { data: response, isLoading }] = useValidateBvnMutation();

  const { data: states } = useGetStatesQuery("");
  const { data: LGA } = useGetLgtQuery("");
  const { data: uploadTypes } = useGetUploadTypeQuery("");
  const { data: cities } = useGetCityQuery("");
  const { data: branches } = useGetBankBranchQuery("");
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

    // data.firstName = "Azubike";
    // data.bvn = "6533738383";
    // data.lastName = "Sean";
    // data.telNumber1 = "6363737373";
    // data.middleName = "sean";
    // data.dateofBirth = "20-12-2021";
    // data.nationality = "Nigeria";

    // data.refereesRequests?.push(data?.reference1, data.reference2)
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

    state.data = {
      ...data,
      refereesRequests: [data.reference1, data.reference2],
      accountServicesRequest: {
        transactionAlertPreference: { emailAlert, smsAlert },
        electronicBankPreference: {
          internetBanking: iB,
          mobileMoney: mobileM,
          debitCard: dC,
        },
        chequeConfirmation: false,
      },
    };

    actions.updateName(state.data);
    console.log(">>>>state", state.data);
    dispatch(handleNext());
  };

  useEffect(() => {
    const bvn = JSON.parse(localStorage.getItem("userBvn") || "{}");
    if (bvn) {
      validateBvn(bvn);
    }
  }, []);

  return (
    <div
      className="tab-pane fade show active"
      id="account_spec"
      role="tabpanel"
      aria-labelledby="account_spec-tab"
    >
      {Object.keys(errors).length > 0 && (
        <span className="text-danger d-flex justify-content-center">
          All fields with Asteric are required
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
                          message="title field is required"
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
                          message="gender field is required"
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
                            message="email address is required"
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
                          message="place of birth is required"
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
                          message="state of origin is required"
                        />

                        <SelectInput
                          className="form-group col-lg-4 col-md-6 col-sm-12 font-weight-700"
                          name="lga"
                          label="L.G.A"
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
                <div className="panel-body">
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
                <div className="panel-body">
                  <div className="user_bvn_data_row1 font-12">
                    <div className="col-lg-12">
                      <div className="row">
                        <SelectInput
                          className="form-group col-lg-12 col-md-6 col-sm-12 font-weight-700"
                          name="documentType"
                          label="DOCUMENT UPLOAD"
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
                            type="number"
                            minLength={11}
                            register={register}
                            errors={errors.idNumber}
                            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                              (e.target.value = e.target.value.slice(0, 11))
                            }
                            required
                            placeholder="id Number"
                            name="idNumber"
                            message="id number must be 12 digit"
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
                <div className="panel-body">
                  <div className="user_bvn_data_row1 font-12">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="form-group col-lg-12 col-md-6 col-sm-12 font-weight-700">
                          <HookInputField
                            label="PRODUCT TYPE"
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
                <div className="panel-body">
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
                <div className="panel-body">
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
            <div className="col-lg-6">
              <div className="panel panel-default">
                <div className="panel-heading text-center bg-gray white-text text-white font-weight-900">
                  REFERENCE 1
                </div>
                <div className="panel-body">
                  <div className="user_bvn_data_row1 font-12">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="form-group col-lg-12 col-md-12 col-sm-12 font-weight-700">
                          {/* <label>FULL NAME</label>
                          <input name="" type="text" className="form-control m-b-10" /> */}
                          <HookInputField
                            name="reference1.fullName"
                            type="text"
                            label="FULL NAME"
                            register={register}
                            required
                          />
                        </div>

                        <div className="form-group col-lg-12 col-md-12 col-sm-12 font-weight-700">
                          {/* <label>PHONE NUMBER</label>
                          <input type="text" className="form-control m-b-10" /> */}
                          <HookInputField
                            name="reference1.phone"
                            type="number"
                            label="PHONE NUMBER"
                            maxLength={11}
                            register={register}
                            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                              (e.target.value = e.target.value.slice(0, 11))
                            }
                            errors={errors.reference1?.phone}
                            required
                            message="phone number as to be 11 digit"
                          />
                        </div>

                        <div className="form-group col-lg-12 col-md-12 col-sm-12 font-weight-700 m-b-50">
                          {/* <label>EMAIL</label>
                          <input type="text" className="form-control" /> */}
                          <HookInputField
                            name="reference1.email"
                            type="text"
                            label="EMAIL"
                            pattern={pattern2}
                            register={register}
                            required
                            errors={errors.reference1?.email}
                            message="email address is required"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- REFERENCE 2 DETAILS --> */}
            <div className="col-lg-6">
              <div className="panel panel-default">
                <div className="panel-heading text-center bg-gray white-text text-white font-weight-900">
                  REFERENCE 2
                </div>
                <div className="panel-body">
                  <div className="user_bvn_data_row1 font-12">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="form-group col-lg-12 col-md-12 col-sm-12 font-weight-700">
                          <HookInputField
                            name="reference2.fullName"
                            type="text"
                            label="FULL NAME"
                            register={register}
                            required
                          />
                        </div>

                        <div className="form-group col-lg-12 col-md-12 col-sm-12 font-weight-700">
                          <HookInputField
                            name="reference2.phone"
                            type="number"
                            label="PHONE NUMBER"
                            register={register}
                            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                              (e.target.value = e.target.value.slice(0, 11))
                            }
                            maxLength={11}
                            message="phone number as to be 11 digit"
                            required
                            errors={errors.reference2?.phone}
                          />
                        </div>

                        <div className="form-group col-lg-12 col-md-12 col-sm-12 font-weight-700 m-b-50">
                          <HookInputField
                            name="reference2.email"
                            type="text"
                            label="EMAIL "
                            register={register}
                            pattern={pattern2}
                            required
                            errors={errors.reference2?.email}
                            message="email address is required"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- ACCOUNT SERVICES REQUIRED --> */}
        <div className="col-lg-6">
          <div className="panel panel-default">
            <div className="panel-heading text-center bg-gray white-text text-white font-weight-900">
              ACCOUNT SERVICES REQUIRED (fees may apply)
            </div>
            <div className="panel-body">
              <div className="user_bvn_data_row1">
                <div className="col-lg-12">
                  <div className="row">
                    <div className="form-group col-lg-12 col-md-6 col-sm-12 font-weight-700">
                      <label>ELECTRONIC BANKING PREFERENCES</label>

                      <div className="eb_pref font-12 form-group col-lg-12 col-md-6 col-sm-12">
                        <div className=" pl-4 form-check-inline flex justify-center">
                          <input
                            checked={internetBankingChecked}
                            // {...register(name)}
                            name="accountServiceRequest.electronicBankPreference.internetBanking"
                            value="internetBanking"
                            type="checkbox"
                            className="form-check-input mt-1"
                            onChange={handleIb}
                            data-parsley-errors-container="#error-checkbox"
                          />
                          <label className="pt-3">INTERNET BANKING</label>
                        </div>
                        <div className=" pl-4 form-check-inline flex justify-center">
                          <input
                            checked={debitCardChecked}
                            // {...register(name)}
                            name="accountServiceRequest.electronicBankPreference.debitCard"
                            value="debitCard"
                            type="checkbox"
                            className="form-check-input mt-1"
                            onChange={handleDc}
                            data-parsley-errors-container="#error-checkbox"
                          />
                          <label className="pt-3">DEBIT CARD</label>
                        </div>
                        <div className=" pl-4 form-check-inline flex justify-center">
                          <input
                            name="accountServiceRequest.electronicBankPreference.mobileMoney"
                            checked={mobileMoneyChecked}
                            value="mobileMoney"
                            type="checkbox"
                            className="form-check-input mt-1"
                            onChange={handleMobileM}
                            data-parsley-errors-container="#error-checkbox"
                          />
                          <label className="pt-3">MOBILE MONEY</label>
                        </div>

                        <p id="error-checkbox"></p>
                      </div>
                    </div>

                    <div className="form-group col-lg-12 col-md-6 col-sm-12 font-weight-700">
                      <label>TRANSACTION ALERT PREFERENCES</label>

                      <div className="eb_pref font-12 form-group col-lg-12 col-md-6 col-sm-12">
                        <div className=" pl-4 form-check-inline flex justify-center">
                          <input
                            name="accountServiceRequest.transactionAlertPreference.emailAlert"
                            checked={emailAlertChecked}
                            value="emailAlert"
                            type="checkbox"
                            className="form-check-input mt-1"
                            onChange={handleEmailAlert}
                            data-parsley-errors-container="#error-checkbox"
                          />
                          <label className="pt-3">EMAIL ALERT</label>
                        </div>
                        <div className=" pl-4 form-check-inline flex justify-center">
                          <input
                            name="accountServiceRequest.transactionAlertPreference.smsAlert"
                            checked={smsAlertChecked}
                            value="smsAlert"
                            type="checkbox"
                            className="form-check-input mt-1"
                            onChange={handleSmsAlert}
                            data-parsley-errors-container="#error-checkbox"
                          />
                          <label className="pt-3">EMAIL ALERT</label>
                        </div>

                        <p id="error-checkbox"></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-group col-lg-12 col-md-12 col-sm-12 m-b-20">
          <div className="d-flex align-items-center justify-content-center m-t-20">
            <div className="user_acct_details col-lg-2 col-md-6 col-sm-12">
              <button
                type="button"
                onClick={() => dispatch(handlePrevious())}
                className="btn btn-block btn-suntrust font-weight-900"
              >
                PREVIOUS PAGE
              </button>
            </div>

            <div className="user_acct_details col-lg-2 col-md-6 col-sm-12">
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
