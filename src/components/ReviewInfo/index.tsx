import { useStateMachine } from "little-state-machine";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CsProps } from "../../interfaces";
import {
  handlePrevious,
  useOpenIndividualCurrentMutation,
} from "../../services/Mutations/apis";
import { useDispatch } from "react-redux";
import {
  useGetBankBranchQuery,
  useGetCityQuery,
  useGetLgtQuery,
  useGetStatesQuery,
  useGetUploadTypeQuery,
} from "../../services/Queries/dropDowns";
import { useHistory } from "react-router-dom";
import {
  emptyData,
  genders,
  maritalStatuses,
  titles,
} from "../../utils/constant";
import { clearData, getText, updateName } from "./../../utils/utilities";
import { religions } from "./../../utils/constant";
import Loader from "../Loader";
import AcountOpenSuccessPage from "../../pages/AccountOpenSuccessPage";
import AccountOpenSuccessPage from "../../pages/AccountOpenSuccessPage";

export default function REVIEW() {
  const { state: allData, actions } = useStateMachine({ updateName });
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch();
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };
  const [
    openIndividualCurrent,
    { isLoading, data: responseData, error, isSuccess, isError },
  ] = useOpenIndividualCurrentMutation();

  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CsProps>({
    defaultValues: {
      ...allData.data,
    },
  });

  const {
    lga,
    bvn,
    branchcode,
    nationality,
    emailAddress,
    middleName,
    dateofBirth,
    firstName,
    title,
    idNumber,
    lastName,
    gender,
    address1,
    telNumber1,
    city,
    documentType,
    dateOfIssue,
    expireDate,
    stateOfResidence,
    telNumber2,
    maritalStatus,
    motherMaidenName,
    state,
    uploadDocumentRequest,
    employmentDetialRequest,
    detailOfNextKinRequest,
    reference1,
    reference2,
    religion,
    _lga,
    _title,
    _state,
    _gender,
    _city,
    accountServicesRequest: {
      transactionAlertPreference,
      electronicBankPreference,
    },
  } = allData?.data;

  const { data: LGA } = useGetLgtQuery("");
  const { data: states } = useGetStatesQuery("");
  const { data: uploadTypes } = useGetUploadTypeQuery("");
  const { data: cities } = useGetCityQuery("");
  const { data: branches } = useGetBankBranchQuery("");

  // const docType = getText(uploadTypes, documentType);
  // const userStateOfResidence = getText(states, state);

  // const docType = uploadTypes.find((item: any) => item.value === documentType);

  console.log(">>>>>states", states);

  const userStateOfResidence = states?.find(
    (item: any) => item.value === stateOfResidence
  );

  const userReligion = religions.find(
    (item: any) => item.value === religion
  )?.text;
  const status = getText(maritalStatuses, maritalStatus);
  const userTitle = getText(titles, title);

  const submitHandler = () => {
    const {
      nationality,
      _gender,
      _city,
      _branchcode,
      _lga,
      _uploadTypes,
      _state,
      _title,
      reference1,
      reference2,
      ...rest
    } = allData.data;
    openIndividualCurrent(rest);
    console.log("rest", rest);
    localStorage.clear();
  };

  return (
    <div className="px-4">
      <div
        className="tab-pane fade show active"
        id="review_info"
        role="tabpanel"
        aria-labelledby="review_info-tab"
      >
        {!isSuccess ? (
          <div className="col-lg-12">
            <div className="row">
              {/* <!-- PERSONAL DETAILS --> */}
              <div className="m-t-20 col-lg-6 col-md-12">
                <h5>PREVIEW INFORMATION</h5>
                <div className="card col-lg-12 col-md-12 col-sm-12">
                  <div className="m-t-30 m-b-20">
                    <h6>PERSONAL DETAILS</h6>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">BVN:</label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {bvn}
                    </div>
                  </div>
                  {userTitle && (
                    <div className="d-flex m-b-10 margin_bottom font_size">
                      <label className="col-lg-4 col-md-6 col-sm-12">
                        TITLE:
                      </label>
                      <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                        {_title}
                      </div>
                    </div>
                  )}
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      FIRST NAME:
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {firstName}
                    </div>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      MIDDLE NAME:
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {middleName}
                    </div>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      LAST NAME:
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {lastName}
                    </div>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      PHONE NUMBER:
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {telNumber1}
                    </div>
                  </div>
                  {telNumber2 && (
                    <div className="d-flex m-b-10 margin_bottom font_size">
                      <label className="col-lg-4 col-md-6 col-sm-12">
                        ALTERNATE PHONE NUMBER:
                      </label>
                      <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                        {telNumber2}
                      </div>
                    </div>
                  )}
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">EMAIL</label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {emailAddress}
                    </div>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      MOTHERS MAIDEN NAME
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {motherMaidenName}
                    </div>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      DATE OF BIRTH
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {dateofBirth}
                    </div>
                  </div>
                  {_gender && (
                    <div className="d-flex m-b-10 margin_bottom font_size">
                      <label className="col-lg-4 col-md-6 col-sm-12">
                        GENDER
                      </label>
                      <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                        {_gender}
                      </div>
                    </div>
                  )}
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      MARITAL STATUS
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {status}
                    </div>
                  </div>
                  {userReligion && (
                    <div className="d-flex m-b-10 margin_bottom font_size">
                      <label className="col-lg-4 col-md-6 col-sm-12">
                        RELIGION
                      </label>
                      <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                        {userReligion}
                      </div>
                    </div>
                  )}
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      PLACE OF BIRTH
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {_city}
                    </div>
                  </div>
                  {_state && (
                    <div className="d-flex m-b-10 margin_bottom font_size">
                      <label className="col-lg-4 col-md-6 col-sm-12">
                        STATE OF ORIGIN
                      </label>
                      <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                        {_state}
                      </div>
                    </div>
                  )}
                  {_lga && (
                    <div className="d-flex m-b-10 margin_bottom font_size">
                      <label className="col-lg-4 col-md-6 col-sm-12">
                        L.G.A
                      </label>
                      <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                        {_lga}
                      </div>
                    </div>
                  )}
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      NATIONALITY
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {nationality}
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- OTHER DETAILS --> */}
              <div className="m-t-20 col-lg-6">
                <h5>OTHER INFORMATION</h5>
                <div className="card col-lg-12">
                  {/* <!-- ADDRESS DETAILS --> */}
                  <div className="m-t-30 m-b-20">
                    <h6>ADDRESS DETAILS</h6>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      RESIDENTIAL ADDRESS:
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {address1}
                    </div>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      L.G.A:
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {_lga}
                    </div>
                  </div>
                  {userStateOfResidence && (
                    <div className="d-flex m-b-10 margin_bottom font_size">
                      <label className="col-lg-4 col-md-6 col-sm-12">
                        STATE OF RESIDENCE:
                      </label>
                      <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                        {userStateOfResidence}
                      </div>
                    </div>
                  )}
                </div>
                {/* <!-- MEANS OF IDENTIFICATION --> */}
                <div className="card col-lg-12">
                  <div className="m-t-30 m-b-20">
                    <h6>MEANS OF IDENTIFICATION</h6>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      DOCUMENT UPLOADED:
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {/* {docType} */}
                    </div>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      ID NUMBER:
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {idNumber}
                    </div>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      DATE OF ISSUE
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {dateOfIssue}
                    </div>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      EXPIRY DATE
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {expireDate}
                    </div>
                  </div>
                </div>

                {/* <!-- ACCOUNT SPECIFICATIONS --> */}
                {/* <div className="card col-lg-12">
                  <div className="m-t-30 m-b-20">
                    <h6>ACCOUNT SPECIFICATIONS</h6>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      BANK BRANCH:
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {branch}
                    </div>
                  </div>
                </div> */}

                {/* <!-- NEXT OF KIN --> */}
                <div className="card col-lg-12">
                  <div className="m-t-30 m-b-20">
                    <h6>NEXT OF KIN</h6>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      SURNAME:
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {detailOfNextKinRequest?.surName}
                    </div>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      FIRST NAME:
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {detailOfNextKinRequest?.firstName}
                    </div>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      PHONE NUMBER:
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {detailOfNextKinRequest?.phone1}
                    </div>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      EMAIL:
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {detailOfNextKinRequest?.email}
                    </div>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      RELATIONSHIP:
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {detailOfNextKinRequest?.relationship}
                    </div>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      RESIDENTIAL ADDRESS:
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {detailOfNextKinRequest?.residentialAddress}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              {/* <!-- EMPLOYMENT DETAILS --> */}
              <div className="m-t-20 col-lg-6">
                <div className="card col-lg-12">
                  <div className="m-t-30 m-b-20">
                    <h6>EMPLOYMENT DETAILS</h6>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      EMPLOYMENT STATUS:
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {employmentDetialRequest?.employmentStatus}
                    </div>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      ANNUAL SALARY / EXPECTED INCOME:
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {employmentDetialRequest?.annualSalary}
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- ACCOUNT SERVICES REQUIRED --> */}
              <div className="m-t-20 col-lg-6">
                <div className="card col-lg-12">
                  <div className="m-t-30 m-b-20">
                    <h6>ACCOUNT SERVICES REQUIRED</h6>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      ELECTRONIC BANKING PREFERENCES:
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {transactionAlertPreference?.emailAlert && (
                        <span>{transactionAlertPreference?.emailAlert}</span>
                      )}

                      {transactionAlertPreference?.smsAlert && (
                        <span>{transactionAlertPreference?.smsAlert}</span>
                      )}
                    </div>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      TRANSACTION ALERT PREFERENCES:
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      <div>
                        {electronicBankPreference?.debitCard && (
                          <span>{electronicBankPreference?.debitCard}</span>
                        )}{" "}
                        {electronicBankPreference?.mobileMoney && (
                          <span>{electronicBankPreference?.mobileMoney}</span>
                        )}{" "}
                        {electronicBankPreference?.internetBanking && (
                          <span>
                            {electronicBankPreference?.internetBanking}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- REFERENCE 1 --> */}
              <div className="m-t-20 col-lg-6">
                <div className="card col-lg-12">
                  <div className="m-t-30 m-b-20">
                    <h6>REFERENCE FORM 1</h6>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      FULL NAME:
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {reference1.fullName}
                    </div>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      PHONE NUMBER:
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {reference1.phone}
                    </div>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      EMAIL:
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {reference1.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- REFERENCE 2 --> */}
              <div className="m-t-20 col-lg-6">
                <div className="card col-lg-12">
                  <div className="m-t-30 m-b-20">
                    <h6>REFERENCE FORM 2</h6>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      FULL NAME:
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {reference2.fullName}
                    </div>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      PHONE NUMBER:
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {reference2.phone}
                    </div>
                  </div>
                  <div className="d-flex m-b-10 margin_bottom font_size">
                    <label className="col-lg-4 col-md-6 col-sm-12">
                      EMAIL:
                    </label>
                    <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                      {reference2.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- ATTACHED DOCUMENTS TABLE --> */}
              <div className="form-group col-lg-6 col-md-12 col-sm-12 font-weight-700">
                <div className="header">
                  <h5>Attached Documents</h5>
                </div>
                <div className="table-responsive border">
                  <table className="table table-hover mb-0 c_list">
                    <thead style={{ backgroundColor: "#c4c4c4" }}>
                      <tr>
                        <th>S/N</th>
                        <th>TITLE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadDocumentRequest.map((item, index) => {
                        return (
                          <tr key={index + 1}>
                            <td>{index + 1}</td>
                            <td>{item.docTypeName}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* <!-- AGREEMENTS CHECKBOX --> */}
              <div className="form-group col-lg-12 col-md-12 col-sm-12 font-weight-500 m-t-20">
                <div className="form-check pl-4 form-check-inline">
                  <input
                    checked={isChecked}
                    onChange={handleCheck}
                    className="form-check-input mt-1"
                    type="checkbox"
                    name="inlineRadioOptions"
                    id="inlineRadio2"
                    value="option2"
                  />
                  <label className="pt-3 pl-1">
                    I agree to the{" "}
                    <a
                      href="#"
                      style={{ textDecoration: "underline", color: "red" }}
                    >
                      SunTrust Bank Terms and Conditions
                    </a>
                  </label>
                </div>
                <p id="error-checkbox"></p>
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
                      disabled={!isChecked}
                      type="button"
                      onClick={submitHandler}
                      className="btn btn-block btn-suntrust font-weight-900"
                    >
                      {isLoading ? <Loader /> : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <AccountOpenSuccessPage />
        )}
      </div>
    </div>
  );
}
