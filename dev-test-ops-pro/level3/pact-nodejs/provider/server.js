const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const users = [
  { id: 1, username: "harish", email: "harish@hph.com" },
  { id: 2, username: "john", email: "john@example.com" }
];

app.get("/api/users/:id", (req, res) => {
  const user = users.find(u => u.id === Number(req.params.id));
  if (user) return res.json(user);
  res.status(404).json({ error: "User not found" });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Provider running on port ${PORT}`));
}

module.exports = app;
