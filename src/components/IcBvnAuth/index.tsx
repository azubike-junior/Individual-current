import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  handleNext,
  useValidateBvnMutation,
} from "../../services/Mutations/apis";
import { HookInputField } from "../InputField";
import Loader from "../Loader";
import OtpLayer from "../IcOtpComp/index";

export default function CsBvnAuth() {
  const [bvnError, setBvnError] = useState("");
  const [bvn, setBvn] = useState("");

  const [validateBvn, { data: responseData, error, isLoading, isSuccess }] =
    useValidateBvnMutation();

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!bvn) {
      setBvnError("bvn field is required");
      return;
    }
    if (bvn.length < 11) {
      setBvnError("bvn digit should not be lesser than 11");
      return;
    }
    setBvnError("");
    validateBvn(bvn);
  };

  console.log(">>>>>response", responseData, isSuccess);

  return (
    <div className="tab-content p-30" id="myTabContent">
      <div
        className="tab-pane fade show active nib_instant_tab"
        id="bvn_verify"
        role="tabpanel"
        aria-labelledby="bvn_verify-tab"
      >
        <div className="col-lg-12 m-t-20">
          <div className="row">
            <div className="body col-lg-12 border border-radius p-30 shadow bg-body rounded">
              <form
                onSubmit={submitHandler}
                className="form-group pt-3 col-lg-12 col-md-12 col-sm-12 m-b-20"
              >
                <div className="form-group form-group-default">
                  <label htmlFor="">Bvn Number</label>
                  {bvnError && (
                    <span
                      style={{ fontSize: "10px" }}
                      className="text-danger pl-2"
                    >
                      {bvnError}
                    </span>
                  )}
                  {error && (
                    <span
                      style={{ fontSize: "10px" }}
                      className="text-danger pl-2"
                    >
                      invalid bvn input{" "}
                    </span>
                  )}
                  <input
                    type="number"
                    placeholder="Enter bvn number"
                    className="form-control"
                    name="bvn"
                     onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                              (e.target.value = e.target.value.slice(0, 11))
                            }
                    disabled={isSuccess}
                    value={bvn}
                    onChange={(e) => setBvn(e.target.value)}
                  />
                </div>
                <div className="d-flex align-items-center justify-content-center m-t-20">
                  <button
                    className="btn bvn-gray col-lg-6 col-md-3 col-sm-12 shadow-sm bg-body rounded"
                    type="submit"
                    disabled={isSuccess}
                  >
                    {isLoading ? <Loader /> : "Search"}
                  </button>
                </div>
              </form>

              {isSuccess && <OtpLayer data={responseData} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
