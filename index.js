const express = require("express");
require("dotenv").config()
const cors = require("cors");
const { default: axios } = require("axios");

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

console.log("Server running ...")

app.post("/authenticate", async (req, res) => {
    const { username, password }= req.body;
    console.log("Authenticate request")
    try {
        // Check username is exist
        const r = await axios.put("https://api.chatengine.io/users/",
        {username: username},
        {headers: {"PRIVATE-KEY": process.env.CHAT_ENGINE_PRIVATE_KEY}})
        .then(async () => {
            // If exist then get user by username and secret
            console.log("check username ", username)
            const user = await axios.get("https://api.chatengine.io/users/me/",
            {headers: {
                "Project-ID": process.env.CHAT_ENGINE_PUBLIC_KEY,
                "User-Name": username,
                "User-Secret": password
            }})
            .then(data => {
                // Return user
                return res.status(data.status).json(data.data)
            })
            .catch(error => {
                // Return errro username or password
                return res.status(error.response.status).json(error.response.data)
            })
        })
        .catch(async () => {
            // If not exist then create user
            const createUser = await axios.post("https://api.chatengine.io/users/",
            {username, secret: password},
            {headers: {"PRIVATE-KEY": process.env.CHAT_ENGINE_PRIVATE_KEY}})
            .then((data) => {
                // Return user
                return res.status(data.status).json(data.data)
            })
        })

        // console.log(r.data)
        // return res.status(r.status).json(r.data)
    } catch (error) {
        return res.status(error.response.status).json(error.response.data)
    }
})

app.listen(3001)