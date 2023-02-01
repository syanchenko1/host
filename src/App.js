import React from "react";
// import ErrorBoundary from "./ErrorBoundary";
import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Main from "./components/Main";
import "./components/Main/Main.css";
import Layout from "./components/Layout";

const SbarRemoteApp = React.lazy(() => import("SbarRemote/SbarRemoteApp"));

export const App = () => (
  <>
    <Provider store={store}>
      <React.Suspense>
        <Layout>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/sbar/*" element={<SbarRemoteApp store={store} />} />
          </Routes>
        </Layout>
      </React.Suspense>
    </Provider>
  </>
);
export default App;
