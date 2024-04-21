const eventDao = require("../../dao/event-dao.js");

async function ListAbl(req, res) {
  try {
    const eventList = eventDao.list();

    // const attendanceMap = attendanceDao.eventMap();
    //
    // eventList.forEach((event) => {
    //   event.userMap = attendanceMap[event.id] || {};
    // });

    res.json(eventList);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl;
