import { useStateMachine } from "little-state-machine";
import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { CsProps } from "../../interfaces";
import { useReactToPrint } from "react-to-print";
import {
  handlePrevious,
  useOpenIndividualCurrentMutation,
} from "../../services/Mutations/apis";
import { useDispatch } from "react-redux";
import {
  useGetBankBranchQuery,
  useGetBankNameQuery,
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
import { setPage } from "../../services/Mutations/apis";
import {
  clearData,
  convertDateToNum,
  getText,
  updateName,
} from "./../../utils/utilities";
import { religions } from "./../../utils/constant";
import Loader from "../Loader";
import AccountOpenSuccessPage from "../../pages/AccountOpenSuccessPage";
import { classNames } from "./../../utils/classNames";

export default function REVIEW() {
  const { state: allData, actions } = useStateMachine({ updateName });
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch();
  const componentRef =
    React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };
  const [
    openIndividualCurrent,
    { isLoading, data: responseData, error, isSuccess, isError },
  ] = useOpenIndividualCurrentMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CsProps>({
    defaultValues: {
      ...allData.data,
    },
  });

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
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
    addressLga,
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
    refereesRequests,
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
  const { data: banks } = useGetBankNameQuery("");

  const userStateOfResidence = states?.find(
    (item: any) => item.value === stateOfResidence
  );

  const userReligion = religions.find(
    (item: any) => item.value === religion
  )?.text;
  const status = getText(maritalStatuses, maritalStatus);
  const userTitle = getText(titles, title);

  const userLga = LGA?.find(
    (item: { text: string; value: string }) => Number(item.value) === lga
  )?.text;

  const userAddressLga = LGA?.find(
    (item: { text: string; value: string }) => Number(item.value) === addressLga
  )?.text;

  const userCity = cities?.find(
    (item: { text: string; value: string }) => Number(item.value) === city
  )?.text;

  const refBank1 = banks?.find(
    (item: any) => item.value === refereesRequests.refereesRequest[0].bankName
  )?.text;

  const refBank2 = banks?.find(
    (item: any) => item.value === refereesRequests.refereesRequest[1].bankName
  )?.text;

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
      dateofBirth,
      ...rest
    } = allData.data;

    const newData = {
      religion: rest.religion + " " + userReligion,
      state: rest.state + " " + _state,
      lga: rest.lga + " " + _lga,
      city: rest.city + " " + _city,
      dateofBirth: convertDateToNum(dateofBirth ? dateofBirth : ""),
      gender: rest.gender?.toLowerCase() === "male" ? 1 : 2,
    };

    const { state, lga, city, religion, gender, ...remainingData } = rest;
    const dataToSubmit = { ...remainingData, ...newData };
    openIndividualCurrent(dataToSubmit);
    localStorage.clear();
  };

  return (
    <>
      {responseData?.responseCode === "00" && (
        <AccountOpenSuccessPage actions={actions} />
      )}
      <div className="px-4">
        <div
          className="tab-pane fade show active"
          id="review_info"
          role="tabpanel"
          aria-labelledby="review_info-tab"
        >
          {responseData?.responseCode === "96" && (
            <span className="text-danger d-flex justify-content-center">
              This BVN has been used to create an Account.
            </span>
          )}

          {isError && (
            <span className="text-danger d-flex justify-content-center">
              sorry, something went wrong
            </span>
          )}

          {responseData?.responseCode !== "00" ? (
            <div className="col-lg-12">
              <div className="" ref={componentRef}>
                <div className="row">
                  {/* <!-- PERSONAL DETAILS --> */}
                  <div className="m-t-20 col-lg-6 col-md-12">
                    <h5>PREVIEW INFORMATION</h5>
                    <div className="card col-lg-12 col-md-12 col-sm-12">
                      <div className="m-t-30 m-b-20">
                        <h6>PERSONAL DETAILS</h6>
                      </div>
                      <div className="d-flex m-b-10 margin_bottom font_size">
                        <label className="col-lg-4 col-md-6 col-sm-12">
                          BVN:
                        </label>
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
                        <label className="col-lg-4 col-md-6 col-sm-12">
                          EMAIL
                        </label>
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
                            {gender}
                          </div>
                        </div>
                      )}
                      {/* <div className="d-flex m-b-10 margin_bottom font_size">
                      <label className="col-lg-4 col-md-6 col-sm-12">
                        MARITAL STATUS
                      </label>
                      <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                        {status}
                      </div>
                    </div> */}
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
                      {userLga && (
                        <div className="d-flex m-b-10 margin_bottom font_size">
                          <label className="col-lg-4 col-md-6 col-sm-12">
                            L.G.A
                          </label>
                          <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                            {userLga}
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
                          {userAddressLga}
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
                      {/* <div className="d-flex m-b-10 margin_bottom font_size">
                      <label className="col-lg-4 col-md-6 col-sm-12">
                        DOCUMENT UPLOADED:
                      </label>
                      <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                        {docType}
                      </div>
                    </div> */}
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
                  {/* <div className="m-t-20 col-lg-6">
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
                </div> */}

                  {/* <!-- REFERENCE 1 --> */}
                  <div className="m-t-20 col-lg-6">
                    <div className="card col-lg-12">
                      <div className="m-t-30 m-b-20">
                        <h6>REFERENCE 1</h6>
                      </div>
                      <div className="d-flex m-b-10 margin_bottom font_size">
                        <label className="col-lg-4 col-md-6 col-sm-12">
                          Account NAME:
                        </label>
                        <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                          {refereesRequests.refereesRequest[0].accountName}
                        </div>
                      </div>
                      <div className="d-flex m-b-10 margin_bottom font_size">
                        <label className="col-lg-4 col-md-6 col-sm-12">
                          Account NUMBER:
                        </label>
                        <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                          {refereesRequests.refereesRequest[0].accountNumber}
                        </div>
                      </div>
                      <div className="d-flex m-b-10 margin_bottom font_size">
                        <label className="col-lg-4 col-md-6 col-sm-12">
                          Bank Name:
                        </label>
                        <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                          {refBank1}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <!-- REFERENCE 2 --> */}
                  <div className="m-t-20 col-lg-6">
                    <div className="card col-lg-12">
                      <div className="m-t-30 m-b-20">
                        <h6>REFERENCE 2</h6>
                      </div>
                      <div className="d-flex m-b-10 margin_bottom font_size">
                        <label className="col-lg-4 col-md-6 col-sm-12">
                          ACCOUNT NAME:
                        </label>
                        <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                          {refereesRequests.refereesRequest[1].accountName}
                        </div>
                      </div>
                      <div className="d-flex m-b-10 margin_bottom font_size">
                        <label className="col-lg-4 col-md-6 col-sm-12">
                          ACCOUNT NUMBER:
                        </label>
                        <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                          {refereesRequests.refereesRequest[1].accountNumber}
                        </div>
                      </div>
                      <div className="d-flex m-b-10 margin_bottom font_size">
                        <label className="col-lg-4 col-md-6 col-sm-12">
                          BANK NAME:
                        </label>
                        <div className="col-lg-8 col-md-6 col-sm-12 font-weight-700">
                          {refBank2}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group col-lg-6 col-md-12 col-sm-12 font-weight-700">
                    <div className="header">
                      <h5>Reference Form</h5>
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
                          <tr>
                            {refereesRequests.imgName && <td>1</td>}
                            <td>{refereesRequests.imgName}</td>
                          </tr>
                        </tbody>
                      </table>
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
                      href="https://suntrustng.com/terms-of-use/"
                      style={{ textDecoration: "underline", color: "red" }}
                    >
                      SunTrust Bank Terms and Conditions
                    </a>
                  </label>
                </div>
                <p id="error-checkbox"></p>
              </div>

              <div className="form-group col-lg-12 col-md-12 col-sm-12 m-b-20">
                {responseData?.responseCode === "96" && (
                  <span className="text-danger ml-3 d-flex justify-content-center">
                    This BVN has been used to create an Account.
                  </span>
                )}

                {isError && (
                  <span className="text-danger ml-3 d-flex justify-content-center">
                    sorry, something went wrong
                  </span>
                )}
                <div className="block d-md-flex d-lg-flex align-items-center justify-content-center m-t-20">
                  <div className="user_acct_details mt-3   col-lg-2 col-md-6 col-sm-12">
                    <button
                      type="button"
                      onClick={() => dispatch(handlePrevious())}
                      className="btn btn-block btn-suntrust font-weight-900"
                    >
                      PREVIOUS PAGE
                    </button>
                  </div>

                  <div className="user_acct_details col-lg-2 mt-3 col-md-6 col-sm-12">
                    <button
                      disabled={!isChecked}
                      type="button"
                      onClick={submitHandler}
                      className="btn btn-block btn-suntrust font-weight-900"
                    >
                      {isLoading ? <Loader /> : "SUBMIT"}
                    </button>
                  </div>
                </div>

                <div className="form-group col-lg-12 col-md-12 col-sm-12 m-b-20 m-t-50">
                  <div className="col-lg-12 block d-md-flex d-lg-flex align-items-center justify-content-center m-t-20">
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="col-lg-2 btn btn-light btn-block btn-suntrust font-weight-900"
                    >
                      PRINT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}
