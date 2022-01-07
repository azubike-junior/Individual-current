import React, { useEffect } from "react";
import { StateMachineProvider, useStateMachine } from "little-state-machine";
import { RootState } from "../../store/store";
import { useDispatch } from "react-redux";
import { setPage } from "../../services/Mutations/apis";
import { emptyData } from "./../../utils/constant";
import CsHeader from "../../components/IcHeader";
import { useHistory } from "react-router-dom";

export default function AcountOpenSuccessPage({ actions }: any) {
  const goBack = () => {
    actions.updateName(emptyData);
    setPage();
    window.location.reload();
  };

  return (
    <>
      {/* <CsHeader /> */}
      <div className="col-lg-12 m-b-30">
        <div className="text-center pt-5" style={{}}>
          <h5 style={{ paddingBottom: "" }}>
            The submitted data is being reviewed for approval.
          </h5>
          <p>
            A confirmation email has been sent to your submitted referees; an
            account number will be sent to your email and phone number upon
            referees’ confirmations. For more enquiries, please call
            09087331440.
          </p>
          <h6>Thank you for choosing SunTrust Bank</h6>

          <div className="user_acct_details col-lg-2 col-md-6 col-sm-12 mx-auto mt-3 mb-5">
            <button
              type="button"
              onClick={goBack}
              className="btn btn-block btn-suntrust font-weight-900"
            >
              Go Back Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
