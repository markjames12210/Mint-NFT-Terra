import "./App.css";

import DropFileInput from "./components/drop-file-input/DropFileInput";
import Mint from "./components/mint";
function App() {
  const onFileChange = (files) => {
    console.log(files);
  };

  return (
    <div className="box">
      <Mint />
    </div>
  );
}

export default App;
