import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Board } from "./scenes";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import VoiceRecord from "./components/VoiceRecord";

function App() {
  return (
    <div className="app">
      <Provider store={appStore}>
        <BrowserRouter>
          <Routes>
            <Route path="/board" element={<Board />} />
            {/* <Route path="/record" element={<VoiceRecord />} /> */}
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
