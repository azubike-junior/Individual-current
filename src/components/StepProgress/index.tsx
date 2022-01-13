import React from "react";

const TabIcon = ({ className, active, title, progressClass, page }: any) => {
  const isActive = active
    ? "nav-link mb-sm-3 active"
    : "nav-link mb-sm-3 text-gray";
  // const pCLass = page == 1 ? '' : page >=4 ? "" : ""
  return (
    <li className="nav-item">
      <span
        className={isActive}
        id="home-tab"
        data-toggle="tab"
        role="tab"
        aria-controls="home"
        aria-selected="true"
      >
        {title}
      </span>
    </li>
  );
};

export default function StepProgress({ page }: any) {
  return (
    <ul
      className="nav nav-pills nav-fill flex-column flex-sm-row font-14 font-weight-900 col-lg-12 pb-10 borderbottom"
      id="myTab"
      role="tablist"
    >
      <TabIcon page={1} title="INTRODUCTION" active={page === 1} />
      <TabIcon page={1} title="BVN AUTHENTICATION" active={page === 2} />
      <TabIcon page={2} title="ACCOUNT SPECIFICATION" active={page === 3} />
      <TabIcon page={3} title="UPLOAD DOCUMENTS" active={page === 4} />
      <TabIcon page={4} title="REVIEW INFORMATION" active={page === 5} />
    </ul>
  );
}
