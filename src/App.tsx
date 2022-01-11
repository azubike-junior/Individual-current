import React, { Suspense, lazy, useEffect } from "react";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Loader from "./components/Loader/index";
import PrivateRoute from "./components/Routes/PrivateRoute/index";
// import AccountOpenSuccessPage from "./pages/AccountOpenSuccessPage"

const CompleteSavingsPage = lazy(
  () => import("./pages/IndividualCurrentAccount")
);
const AccountOpenSuccessPage = lazy(
  () => import("./pages/AccountOpenSuccessPage")
);

function App() {
  return (
    <div className="hero-anime">
      <Router>
        <Switch>
          <Suspense fallback={Loader}>
            {/* <Route path="/savings_success" exact component={AccountOpenSuccessPage} /> */}
            <Route path="/OpenIndividualCurrentAccount" exact component={CompleteSavingsPage} />
          </Suspense>
        </Switch>
        {/* <Footer /> */}
      </Router>
    </div>
  );
}

export default App;
