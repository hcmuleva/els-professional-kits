const express = require("express");
const app = express();
const PORT = 4000;
const users = [{ id: 1, username: "Harish", email: "harish@gds.ey.com" }
    , { id: 2, username: "Sean", email: "sean@gds.ey.com" }
];

app.get("/api/users/:id", (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: "User not found" });
    }

});
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Pact Provider running on http://localhost:${PORT}`);
    });
}

module.exports = app;