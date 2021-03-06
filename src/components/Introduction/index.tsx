import React from "react";
import { handleNext, handlePrevious } from "../../services/Mutations/apis";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import indemity from "../../assets/files/Indemity-min.pdf";
import referenceForm from "../../assets/files/referenceForm-min.pdf";
import mandateCard from "../../assets/files/Mandate Card-min.pdf";

export default function Introduction() {
  const dispatch = useDispatch();

  return (
    <div className="tab-content p-30" id="myTabContent">
      <div className="tab-pane fade show active nib_cor_instant_tab d-flex justify-content-center">
        <div className="col-lg-8">
          <div className="row">
            {/* <!-- BASIC INFORMATION --> */}
            <div className="col-lg-12">
              <div className="panel panel-default">
                <div className="panel-heading text-center bg-gray white-text text-white font-weight-900">
                  BASIC INFORMATION
                </div>
                <div className="panel-body">
                  <div className="user_bvn_data_row1 font-12">
                    <div className="col-lg-12">
                      <div className="row">
                        <p className="font-14">
                          Welcome! Thank you for choosing SunTrust Bank Nigeria.
                          To get started, Kindly download, fill and have the
                          underlisted documents ready for uploads.
                        </p>

                        <p className="font-14" style={{ width: "100%" }}>
                          You are also required to download, fill, and upload
                          the below forms:
                        </p>
                        <ol className="font-14" style={{ width: "100%" }}>
                          <a
                            href={referenceForm}
                            download="reference.pdf"
                            target="_blank"
                          >
                            <li>Reference Forms</li>
                          </a>
                        </ol>

                        <div className="form-group col-lg-8 col-md-12 col-sm-12">
                          <div className="d-flex m-t-20  ">
                            <div
                              onClick={() => dispatch(handleNext())}
                              className="user_acct_details col-lg-6 col-md-4 col-sm-12 m-b-10"
                            >
                              <button className="btn btn-block btn-suntrust font-weight-900">
                                NEXT PAGE
                              </button>
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
      </div>
    </div>
  );
}
