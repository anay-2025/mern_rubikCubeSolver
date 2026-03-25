import axios from "axios";
import { useState } from "react";
import "./App.css";

function Home() {

  const [Face, setFace] = useState("U");
  const [solution, setSolution] = useState(null);
  const [solving, setSolving] = useState(false);
  const [error, setError] = useState(null);

  const [cube, setCube] = useState({
    U: Array(9).fill(null),
    R: Array(9).fill(null),
    F: Array(9).fill(null),
    D: Array(9).fill(null),
    L: Array(9).fill(null),
    B: Array(9).fill(null)
  });

  const colorMap = {
    W: "white",
    R: "red",
    G: "green",
    Y: "yellow",
    O: "orange",
    B: "blue"
  };

  const letterToFace = {
    w: "W",
    r: "R",
    g: "G",
    y: "Y",
    o: "O",
    b: "B"
  };

  const handleManualInput = (index, value) => {
    const letter = value.toLowerCase();
    if (!letterToFace[letter]) return;
    const newFace = [...cube[Face]];
    newFace[index] = letterToFace[letter];
    setCube(prev => ({ ...prev, [Face]: newFace }));
  };

  const captureFace = async () => {
    if (cube[Face].includes(null)) {
      alert("Please fill all 9 squares for this face first!");
      return;
    }
    try {
      const res = await axios.post("http://localhost:7000/capture_face", {
        face: Face,
        colors: cube[Face]
      });
      alert(res.data.message);
    } catch (err) {
      console.error(err.response?.data?.error || "Capture failed");
      alert("Error: " + (err.response?.data?.error || "Capture failed"));
    }
  };

  const resetCube = async () => {
    try {
      await axios.delete("http://localhost:7000/reset_faces");
      setCube({
        U: Array(9).fill(null),
        R: Array(9).fill(null),
        F: Array(9).fill(null),
        D: Array(9).fill(null),
        L: Array(9).fill(null),
        B: Array(9).fill(null)
      });
      setSolution(null);
      setError(null);
    } catch (err) {
      console.error(err);
    }
  };

  const eraseFace = async () => {
    try {
      await axios.delete(`http://localhost:7000/erase_face/${Face}`);
      setCube(prev => ({ ...prev, [Face]: Array(9).fill(null) }));
    } catch (err) {
      console.error(err);
    }
  };

  const solveCube = async () => {
    setSolving(true);
    setSolution(null);
    setError(null);
    try {
      const res = await axios.post("http://localhost:7000/solve");
      console.log("Solution:", res.data);
      setSolution(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.error || "Solve failed");
    } finally {
      setSolving(false);
    }
  };

  return (
    <div className="container">

      <h1 className="title">Rubik Cube Solver</h1>

      <div className="face-selector">
        {["U","R","F","D","L","B"].map(f => (
          <button
            key={f}
            onClick={() => setFace(f)}
            style={{ background: Face === f ? "#ffd700" : "", color: Face === f ? "black" : "" }}
          >{f}</button>
        ))}
      </div>

      <div className="grid">
        {[...Array(9)].map((_, i) => (
          <input
            key={i}
            maxLength={1}
            className="cell"
            onChange={(e) => handleManualInput(i, e.target.value)}
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "20px",
              backgroundColor: cube[Face][i] ? colorMap[cube[Face][i]] : "#333",
              color: "black"
            }}
          />
        ))}
      </div>

      <div className="button-group">
        <button className="btn capture" onClick={captureFace}>Capture Face</button>
        <button className="btn erase" onClick={resetCube}>Reset Cube</button>
        <button className="btn erase1" onClick={eraseFace}>Erase Face</button>
        <button className="btn solve" onClick={solveCube} disabled={solving}>
          {solving ? "Solving..." : "Solve Cube"}
        </button>
      </div>

      {solution && (
        <div className="solution-box">
          <div className="solution-header">
            <span>✅ Solution Found</span>
            <span className="move-count">{solution.moveCount} move{solution.moveCount !== 1 ? "s" : ""}</span>
          </div>
          {solution.moveCount === 0 ? (
            <p className="already-solved">Already Solved!</p>
          ) : (
            <div className="moves">
              {solution.solution.trim().split(/\s+/).map((move, i) => (
                <span key={i} className="move-chip">{move}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="error-box">
          ❌ {error}
        </div>
      )}

      <div className="cube-2d">
        <div className="face U">
          {cube.U.map((c, i) => (
            <div key={i} className="square" style={{ backgroundColor: c ? colorMap[c] : "#333" }}></div>
          ))}
        </div>
        <div className="middle-row">
          {["L","F","R","B"].map(f => (
            <div key={f} className={`face ${f}`}>
              {cube[f].map((c, i) => (
                <div key={i} className="square" style={{ backgroundColor: c ? colorMap[c] : "#333" }}></div>
              ))}
            </div>
          ))}
        </div>
        <div className="face D">
          {cube.D.map((c, i) => (
            <div key={i} className="square" style={{ backgroundColor: c ? colorMap[c] : "#333" }}></div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Home;