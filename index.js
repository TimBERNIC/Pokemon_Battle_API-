import express, {} from "express";
// import { pool } from "pg";
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    res
        .status(200)
        .json({ message: "Welcome to Pokemon Battle API 🔥💦⚡🌱 !!!" });
});
app.all(/.*/, (req, res) => {
    res.status(404).json({ message: "No route found" });
});
app.listen(3000, () => {
    console.log(" Pokemon Battle API 🔥💦⚡🌱 is running!!!");
});
//# sourceMappingURL=index.js.map