const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const key = "ishant";
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const objectid = schema.ObjectId;
const { usermodel, todomodel } = require("./db");
mongoose.connect("mongodb+srv://ishant:ishant1234@cluster0.kdiuh.mongodb.net/todo_app")
app.use(express.json());


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
})



app.post("/signup", async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const hashedpassword = await bcrypt.hash(password, 10);
    const errorthrown = false;
    try {
        await usermodel.create({
            username: username,
            password: hashedpassword
        })
    }
    catch(e){
        errorthrown = true;
        res.json({
            message: "user already exists"
        })
    }
    if (errorthrown === false) {
        res.json({
            message: "user created successfulyy"
        })
    }



})




app.post("/signin", async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const user = await usermodel.findOne({ username: username });


    const compared = await bcrypt.compare(password, user.password);


    if (compared) {
        const token = await jwt.sign({ id: user._id }, key);
        res.header({
            token: token
        }).json({
            message: "successfully signed in",
            token: token


        })
    }
    else {
        res.json({
            message: "user does not exist"
        })

    }
}
)


app.post("/delete", async function (req, res) {
    const token = req.header("token");

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }
    const y = objectid()
    try {
        const decoded = jwt.verify(token, key);
        const userId = mongoose.Schema.Types.ObjectId(decoded.id); // Convert to ObjectId

        const result = await usermodel.deleteOne({ _id: userId });
        console.log("Delete result:", result);

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "User not found or already deleted" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Invalid token or unable to delete user" });
    }
});

app.post("/todo", function (req, res) {


})
app.get("/todos", function (req, res) {
    const token = req.header("token");
    if (token) {
        const decoded = jwt.verify(token, key);
        console.log(decoded.id);
        todomodel.create({

            user: decoded.id,
            task: req.body.task,

        })
    }

})

app.listen(3000);