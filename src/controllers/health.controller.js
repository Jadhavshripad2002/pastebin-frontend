const { checkDbConnection } = require("../config/db");

async function healthCheck(req, res) {
  try {
    await checkDbConnection();
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false });
  }
}

module.exports = {
  healthCheck,
};
