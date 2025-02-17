import React, { Suspense } from "react";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DefaultLayout from "./layout/DefaultLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import DBCandidatesTable from "./pages/bdCandidates/BdCandidatesTable";
import AddUser from "./pages/adduser/AddUser";
import BdCandidateView from "./pages/bdCandidates/BdCanditateView";
import Form from "./pages/bdCandidates/Form";
import TimelineComponent from "./pages/TimelineComponent";
import Summary from "./pages/summary/Summary";
import { PaymentProvider } from "./context/PaymentContext";

function App() {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const FormWrapper = () => {
    const location = useLocation();
    // Use the pathname as part of the key to force remount
    return <Form key={location.key} mode="create" />;
  };

  const PrivateRoute = ({ children }: any) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <div className="App">
      <PaymentProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <DefaultLayout>
                    <Dashboard />
                  </DefaultLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/bdcandidates"
              element={
                <PrivateRoute>
                  <DefaultLayout>
                    <DBCandidatesTable />
                  </DefaultLayout>
                </PrivateRoute>
              }
            />
            {/* <Route path="/backdoor-candidates/add" element={<PrivateRoute><DefaultLayout><Form mode='create'/></DefaultLayout></PrivateRoute>} /> */}
            <Route
              path="/backdoor-candidates/add"
              element={
                <PrivateRoute>
                  <DefaultLayout>
                    {" "}
                    <FormWrapper />
                  </DefaultLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/backdoor-candidates/edit/:id"
              element={
                <PrivateRoute>
                  <DefaultLayout>
                    <Form mode="edit" />{" "}
                  </DefaultLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="bdcandidates/candidates/timeline/:id"
              element={
                <PrivateRoute>
                  <DefaultLayout>
                    <TimelineComponent />
                  </DefaultLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="bdcandidates/candidates/summary/:id"
              element={
                <PrivateRoute>
                  <DefaultLayout>
                    <Summary />
                  </DefaultLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/adduser"
              element={
                <PrivateRoute>
                  <DefaultLayout>
                    <AddUser />
                  </DefaultLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/candidates/view/:id"
              element={
                <PrivateRoute>
                  <DefaultLayout>
                    <BdCandidateView />
                  </DefaultLayout>
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </PaymentProvider>
    </div>
  );
}

export default App;
