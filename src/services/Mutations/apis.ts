import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { DataProps } from "./../../interfaces/index";

interface initState {
  page: number;
  bvn: string;
  error: any;
  loading: boolean;
  error2: any;
  bvnData: DataProps;
  isSuccessful: boolean;
}

const initialState: initState = {
  page: 1,
  error: "",
  error2: "",
  isSuccessful: false,
  loading: false,
  bvnData: <DataProps>{},
  bvn: "",
};

export const validateBvnAndOtp = createApi({
  reducerPath: "validateBvnAndOtp",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://10.11.200.97/BvnValidationsApi/Validations`,
  }),

  endpoints: (builder) => ({
    validateBvn: builder.mutation({
      query: (bvn: string) => ({
        url: "ValidateBvn",
        method: "POST",
        body: { bvn },
      }),
    }),

    validateOtp: builder.mutation({
      query: (data: any) => ({
        url: "SendSms",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const individualCurrent = createApi({
  reducerPath: "individualCurrent",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://10.11.200.97/accountopening/api/v1/AccountOpening/`,
    prepareHeaders: (headers) => {
      const token =
        "4I[PdB7l&/omZT[o.wG^v!<Nni%ANMkSW'+U^5>HepGZ9Nm1xox}#%<?Zx3/7O]";
      if (token) {
        headers.set("authorization", `${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    openIndividualCurrent: builder.mutation({
      query: (data: any) => ({
        url: "IndividualCurrentAccount",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const addBvn = createAsyncThunk(
  "addBvn",
  async (bvn: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://10.11.200.97/BvnValidationsApi/Validations/ValidateBvn`,
        { bvn }
      );
      if (response.data.responseCode === "00") {
        return response.data;
      } else {
        return rejectWithValue(response.data);
      }
    } catch (e: any) {
      return rejectWithValue(e.response.data);
    }
  }
);

export const NextAndPreviousHandler = createSlice({
  name: "NextAndPrevious",
  initialState,
  reducers: {
    handleNext(state) {
      state.page++;
    },
    handlePrevious(state) {
      state.page--;
    },
    setPage(state) {
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addBvn.rejected, (state, action) => {
      state.error = action.error;
      state.error2 = action.error.name;
      state.loading = false;
      state.isSuccessful = false;
    });
    builder.addCase(addBvn.fulfilled, (state, action) => {
      state.loading = true;
      state.bvnData = action.payload;
      state.loading = false;
      state.isSuccessful = true;
      state.error = "";
    });
    builder.addCase(addBvn.pending, (state, action) => {
      state.loading = true;
      state.error = action.payload;
    });
  },
});

export const { handleNext, handlePrevious, setPage } =
  NextAndPreviousHandler.actions;
export default NextAndPreviousHandler.reducer;
export const { useOpenIndividualCurrentMutation } = individualCurrent;
export const { useValidateBvnMutation, useValidateOtpMutation } =
  validateBvnAndOtp;

//22277557146
