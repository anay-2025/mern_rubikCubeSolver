const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors');
const Cube = require('cubejs');
const PORT = 7000;

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use("/api/auth", require("./routes/authRoutes"));

console.log("Initializing Solver Tables...\n");
Cube.initSolver();
console.log("Solver Ready!\n");

app.get("/", (req, res) => {
    res.send("<h1>hey<h1>");
});

let currCube = {
    U: null, R: null, F: null, D: null, L: null, B: null
};

app.post("/capture_face", (req, res) => {
    console.log("BODY RECEIVED:", req.body);

    const { face, colors } = req.body;

    if (!face || !colors) {
        return res.status(400).json({ error: "Missing face or colors" });
    }

    currCube[face] = colors;
    console.log("CURRENT CUBE STATE:", currCube);

    return res.json({ message: "Captured successfully" });
});

app.delete("/erase_face/:face", (req, res) => {
    const { face } = req.params;
    if (!currCube[face]) {
        return res.status(400).json({ error: "Already empty face side\n" });
    }
    currCube[face] = null;
    res.json({ message: `face side erased successfully -> ${face}\n` });
});

app.delete("/reset_faces", (req, res) => {
    currCube = { U: null, R: null, F: null, D: null, L: null, B: null };
    res.json({ message: "Cube is reset successfully" });
});

app.post("/solve", (req, res) => {
    try {
        // 1. Validate all faces are captured
        const missing = ["U", "R", "F", "D", "L", "B"].filter(f => !currCube[f]);
        if (missing.length > 0) {
            return res.status(400).json({ error: `Missing faces: ${missing.join(", ")}` });
        }

        // 2. Build color-letter → face-letter map using each face's center (index 4)
        //    e.g. center of U face is 'W' → W maps to U
        //         center of R face is 'R' → R maps to R
        //         center of F face is 'G' → G maps to F  etc.
        const colorToFace = {};
        for (const face of ["U", "R", "F", "D", "L", "B"]) {
            const centerColor = currCube[face][4]; // center is always index 4
            colorToFace[centerColor] = face;
        }
        console.log("Color→Face map:", colorToFace);
        // e.g. { W:'U', R:'R', G:'F', Y:'D', O:'L', B:'B' }

        // 3. Remap all 54 cells from color letters to face letters
        const normalized = {};
        for (const face of ["U", "R", "F", "D", "L", "B"]) {
            normalized[face] = currCube[face].map(color => {
                const letter = colorToFace[color];
                if (!letter) throw new Error(`Unknown color "${color}" — not found in any face center`);
                return letter;
            });
        }

        // 4. Build the 54-character string (order: U R F D L B)
        const cubeString = ["U", "R", "F", "D", "L", "B"]
            .map(face => normalized[face].join(""))
            .join("");

        console.log("Cube string:", cubeString);

        const cube = Cube.fromString(cubeString);

        // 5. Early exit if already solved
        if (cube.isSolved()) {
            return res.json({ success: true, solution: "Already solved!", moveCount: 0 });
        }

        // 6. Solve
        const solution = cube.solve();

        res.json({
            success: true,
            solution: solution,
            moveCount: solution.trim().split(/\s+/).filter(Boolean).length
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message || "Invalid cube state. Make sure all 54 stickers are correct with no duplicate/missing colors."
        });
    }
});

app.listen(PORT, () => {
    console.log("Backend is running on port 7000\n");
});