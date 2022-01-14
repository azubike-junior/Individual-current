import React, { SyntheticEvent, useState, useRef } from "react";
import { CsProps, UploadDetails } from "../../interfaces";
import { useForm } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import { updateName, getBase64, getValues } from "./../../utils/utilities";
import { Form } from "react-bootstrap";
import {
  validateFileSize,
  FileService,
  validateFileType,
} from "../../utils/validator";
import { handleNext, handlePrevious } from "../../services/Mutations/apis";
import { useDispatch } from "react-redux";
import imageToBase64 from "image-to-base64/browser";
import {
  useGetBankBranchQuery,
  useGetCityQuery,
  useGetLgtQuery,
  useGetStatesQuery,
  useGetUploadTypeQuery,
} from "../../services/Queries/dropDowns";
import { titles } from "../../utils/constant";
import { Link } from "react-router-dom";

export default function UploadDocuments() {
  const { state, actions } = useStateMachine({ updateName });
  const [doc, setDoc] = useState<File>();
  const [uploadDocError, setUploadDocError] = useState("");
  const [docTypeError, setDocTypeError] = useState("");
  const [docType, setDocType] = useState("");
  const dispatch = useDispatch();
  const [fileType, setFileType] = useState("");
  const [fileBase64, setFileBase64] = useState<any>();
  const [imgName, setImageName] = useState("");
  const [docTypeName, setDocTypeName] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const { data: documentTypes } = useGetUploadTypeQuery("");

  const newValue = { value: "", text: "" };

  const uploadTypes = getValues(documentTypes, newValue);

  const handleFiles = async (e: HTMLInputElement) => {
    const file = e.files;

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

    // if (validFileSize.isValid) {
    //   return setUploadDocError("image size must not be more 500kb");
    // }
    const imageUrl = URL.createObjectURL(file[0]);

    setFileUrl(imageUrl);
    setDoc(file[0]);
    setFileType(file[0].type);
    setImageName(file[0].name);

    getBase64(file).then((result) => {
      setFileBase64(result);
    });
    setUploadDocError("");
  };

  //for handling file type array
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const docTypeName = uploadTypes.find(
      (item: any) => item.value === value
    )?.text;

    setDocTypeError("");
    setDocTypeName(docTypeName);
    return setDocType(value);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CsProps>({
    defaultValues: {
      ...state.data,
    },
  });

  //submit function
  const submitDocuments = () => {
    if (docTypeName === "") {
      return setDocTypeError("you need to choose a document type to continue");
    }

    if (fileBase64 === "") {
      return setUploadDocError("you need to choose a file ");
    }

    const docTypes = state.data.uploadDocumentRequest.map(
      (item) => item.docType
    );

    if (docTypes.includes(docType)) {
      return setDocTypeError("You cant upload the same document twice");
    }

    if (uploadDocError) {
      return;
    }

    setDocTypeError("");

    const newData = {
      uploadDocs: fileBase64,
      docType,
      imgName,
      extension: fileType,
      docTypeName,
      doc,
      fileUrl,
    };

    const docArray = state.data.uploadDocumentRequest;
    actions.updateName({
      ...state.data,
      uploadDocumentRequest: [...docArray, newData],
    });
    console.log(">>>>>", state.data.uploadDocumentRequest);
    inputRef.current.value = "";
  };

  const confirmAndContinue = () => {
    if (state.data.uploadDocumentRequest.length === 0) {
      return setDocTypeError(
        "You need to upload required document to continue"
      );
    }
    dispatch(handleNext());
    console.log(">>>>>data", state.data);
  };

  const deleteDocument = (docType: string) => {
    const newFiles = state.data.uploadDocumentRequest.filter(
      (item) => item.docType !== docType
    );
    actions.updateName({
      ...state.data,
      uploadDocumentRequest: [...newFiles],
    });
  };

  return (
    <div className="px-4">
      <form onSubmit={handleSubmit(submitDocuments)}>
        <div
          className="tab-pane fade show active"
          id="contact"
          role="tabpanel"
          aria-labelledby="contact-tab"
        >
          <div className="col-lg-12 m-t-20">
            <div className="row">
              {/* <!-- UPLOAD DOCUMENTS --> */}
              <div className="col-lg-12">
                <div className="panel panel-default">
                  <div className="panel-heading text-center bg-gray white-text text-white font-weight-900">
                    UPLOAD DOCUMENTS
                  </div>
                  {docTypeError ? (
                    <span className="text-danger d-flex pt-2 justify-content-center pl-2">
                      {docTypeError}
                    </span>
                  ) : (
                    ""
                  )}
                  <div className="panel-body">
                    <div className="user_bvn_data_row1">
                      <div className="col-lg-12">
                        <div className="row">
                          <div className="form-group col-lg-12 col-md-12 col-sm-12 font-weight-700 m-b-30">
                            To confirm your identity, please upload copies of
                            your preffered documents. You must upload Utility
                            Bill with a valid address and 2 other preffered
                            documents.
                          </div>
                          <div className="form-group col-lg-4 col-md-6 col-sm-12 font-weight-700">
                            <label>SELECT A DOCUMENT TO UPLOAD</label>
                            <span className="text-danger">*</span>

                            <select
                              className="form-control"
                              value={docType}
                              onChange={(e) => handleChange(e)}
                            >
                              {uploadTypes.map((item: any, index: number) => {
                                return (
                                  <option value={item.value}>
                                    {item.text}
                                  </option>
                                );
                              })}
                            </select>
                          </div>

                          <div className="form-group col-lg-4 pt-1 col-md-6 col-sm-12 font-weight-700">
                            <label>
                              UPLOAD A DOCUMENT
                              <span className="text-danger">*</span>
                            </label>
                            {uploadDocError && (
                              <span className="text-danger pl-2">
                                {uploadDocError}
                              </span>
                            )}
                            <br />
                            <div className="border py-1 pl-2">
                              <input
                                ref={inputRef}
                                type="file"
                                onChange={(e: SyntheticEvent) =>
                                  handleFiles(
                                    e.currentTarget as HTMLInputElement
                                  )
                                }
                                className=""
                              />
                            </div>
                          </div>

                          <div className="form-group col-lg-4 col-md-12 col-sm-12 font-weight-700">
                            <label> &nbsp; </label>
                            <div className="form-group col-lg-6 col-md-12 col-sm-12">
                              <button
                                type="submit"
                                className="btn btn-block btn-suntrust"
                              >
                                SUBMIT
                              </button>
                            </div>
                          </div>

                          <div className="form-group col-lg-12 col-md-12 col-sm-12 font-weight-700">
                            <div className="header">
                              <h5>Uploaded Documents</h5>
                            </div>
                            <div className="table-responsive border">
                              <table className="table table-hover mb-0 c_list">
                                <thead style={{ backgroundColor: "#c4c4c4" }}>
                                  <tr>
                                    <th>S/N</th>
                                    <th>TITLE</th>
                                    <th>ATTACHMENT</th>
                                    <th>ACTION</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {state.data.uploadDocumentRequest?.map(
                                    (item, index) => {
                                      const {
                                        docType,
                                        imgName,
                                        docTypeName,
                                        uploadDocs,
                                        doc,
                                        fileUrl,
                                      } = item;
                                      return (
                                        <tr key={index + 1}>
                                          <td>{index + 1}</td>
                                          <td>{docTypeName}</td>
                                          <td>{imgName}</td>
                                          <td>
                                            <button
                                              type="button"
                                              className="btn btn-suntrust btn-sm m-b-5 mr-4"
                                              data-toggle="modal"
                                              data-target="#exampleModal"
                                            >
                                              <a
                                                href={fileUrl}
                                                target="_blank"
                                                style={{ color: "#fff" }}
                                                className="px-2"
                                              >
                                                view
                                              </a>
                                            </button>
                                            <button
                                              type="button"
                                              className="btn btn-danger btn-sm m-b-5"
                                              title="Delete"
                                              onClick={() =>
                                                deleteDocument(docType)
                                              }
                                            >
                                              Delete
                                            </button>
                                          </td>
                                        </tr>
                                      );
                                    }
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group col-lg-12 col-md-12 col-sm-12 m-b-20">
          <div className="block d-md-flex d-lg-flex align-items-center justify-content-center m-t-20">
            <div className="user_acct_details col-lg-2 mt-3 col-md-6 col-sm-12">
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
                onClick={confirmAndContinue}
                className="btn btn-block btn-suntrust font-weight-900"
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
