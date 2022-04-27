// Appointments is a sub-document
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const parks = mongoCollections.parks;
let { ObjectId } = require('mongodb');

module.exports = {
  async createAppointment(userOneId, parkId, activityId, year, month, day, hour, minute) {
    if (!userOneId || !parkId || !activityId || !year || !month || !day || !hour || !minute) throw 'please provide all inputs';
    if (!ObjectId.isValid(userOneId)) throw 'invalid user ID';
    if (!ObjectId.isValid(parkId)) throw 'invalid park ID';
    if (!ObjectId.isValid(activityId)) throw 'invalid park ID';
    if (typeof year !== 'string' || year.trim().length === 0 || isNaN(parseInt(year)) || parseInt(year) < new Date().getFullYear()) throw "invalid year or the year was past";
    if (typeof month !== 'string' || month.trim().length === 0 || isNaN(parseInt(month)) || parseInt(month) < new Date().getMonth()) throw "invalid month or the month was past";
    if (typeof day !== 'string' || day.trim().length === 0 || isNaN(parseInt(day)) || parseInt(day) < new Date().getDay()) throw "invalid day or the day was past";
    if (typeof hour !== 'string' || hour.trim().length === 0 || isNaN(parseInt(hour)) || parseInt(hour) < 0 || parseInt(hour) > 23) throw "invalid hour";
    if (typeof minute !== 'string' || minute.trim().length === 0 || parseInt(minute) < 0 || parseInt(minute) > 59) throw "invalid minute";

    const newId = ObjectId();
    let newAppointment = {
      appointmentId: newId,
      userOneId: userOneId,
      parkId: parkId,
      activityId: activityId,
      year: year,
      month: month,
      day: day,
      hour: hour,
      minute: minute,
      approvement: false,
      status: "Not matched"
    };

    const userCollection = await users();
    const updateUser = await userCollection.updateOne({ _id: ObjectId(userOneId) },
      { $addToSet: { appointments: newAppointment } }
    );
    if (!updateUser.matchedCount && !updateUser.modifiedCount)
      throw 'Could not add a new appintment to User';

    const parkCollection = await parks();
    const updateActivity = await parkCollection.updateOne({ "activities._id": ObjectId(activityId) },
      { $addToSet: { appointments: newAppointment } }
    );
    if (!updateActivity.matchedCount && !updateActivity.modifiedCount)
      throw 'Could not add a new appintment to Activity';
    return newAppointment;
  },

  async getUserIdbyEmail(email) {
    if (typeof email === 'undefined') throw "email is undefined!";
    if (typeof email !== 'string') throw "email is not a string!"
    if (typeof email === 'string' && email.trim().length === 0) throw "email is an empty string!";

    const userCollection = await users();
    let allappointments = await userCollection.find({ "email": email }).toArray();
    if (allappointments === null) throw 'No user with that email!';
    // for (let x of allbands){
    //     x._id = x._id.toString();
    // }
    return allappointments[0]._id;
  },

  async getParknameByParkId(ParkId) {
    if (typeof ParkId === 'undefined') throw "ParkId is undefined!";
    if (!ObjectId.isValid(ParkId) && typeof ParkId !== 'string') throw "ParkId is not a string or objectKey!"
    if (typeof ParkId === 'string' && ParkId.trim().length === 0) throw "ParkId is an empty string!";
    if (!ObjectId.isValid(ParkId)) {
      throw "ParkId doesn't exist!";
    } else {
      ParkId = ObjectId(ParkId);
    }

    const parkCollection = await parks();
    let allappointments = await parkCollection.find({ "_id": ObjectId(ParkId) }).toArray();
    // for (let x of allbands){
    //     x._id = x._id.toString();
    // }
    return allappointments[0].name;
  },

  async getActivitynameByActivityId(activityId) {
    if (typeof activityId === 'undefined') throw "activityId is undefined!";
    if (!ObjectId.isValid(activityId) && typeof activityId !== 'string') throw "activityId is not a string or objectKey!"
    if (typeof activityId === 'string' && activityId.trim().length === 0) throw "activityId is an empty string!";
    if (!ObjectId.isValid(activityId)) {
      throw "activityId doesn't exist!";
    } else {
      activityId = ObjectId(activityId);
    }

    const parkCollection = await parks();
    let allappointments = await parkCollection.find({ "activities._id": ObjectId(activityId) }).toArray();
    // for (let x of allbands){
    //     x._id = x._id.toString();
    // }
    return allappointments[0].activities[0].name;
  },

  async getParkIdbyActivityname(Activityname) {
    if (typeof Activityname === 'undefined') throw "Activityname is undefined!";
    if (typeof Activityname !== 'string') throw "Activityname is not a string!"
    if (typeof Activityname === 'string' && Activityname.trim().length === 0) throw "Activityname is an empty string!";

    const parkCollection = await parks();
    let allappointments = await parkCollection.find({ "activities.name": Activityname }).toArray();
    if (allappointments === null) throw 'No park with that activity!';
    // for (let x of allbands){
    //     x._id = x._id.toString();
    // }
    return allappointments[0]._id;
  },

  async getActivityIdbyActivityname(Activityname) {
    if (typeof Activityname === 'undefined') throw "Activityname is undefined!";
    if (typeof Activityname !== 'string') throw "Activityname is not a string!"
    if (typeof Activityname === 'string' && Activityname.trim().length === 0) throw "Activityname is an empty string!";

    const parkCollection = await parks();
    let allappointments = await parkCollection.find({ "activities.name": Activityname }).toArray();
    if (allappointments === null) throw 'No park with that activity!';
    // for (let x of allbands){
    //     x._id = x._id.toString();
    // }
    return allappointments[0].activities[0]._id;
  },

  async getAllAppointmentsByActivityId(activityId) {
    if (typeof activityId === 'undefined') throw "activityId is undefined!";
    if (!ObjectId.isValid(activityId) && typeof activityId !== 'string') throw "activityId is not a string or objectKey!"
    if (typeof activityId === 'string' && activityId.trim().length === 0) throw "activityId is an empty string!";
    if (!ObjectId.isValid(activityId)) {
      throw "activityId doesn't exist!";
    } else {
      activityId = ObjectId(activityId);
    }

    const parkCollection = await parks();
    let allappointments = await parkCollection.find({ "activities._id": ObjectId(activityId) }).toArray();
    // for (let x of allbands){
    //     x._id = x._id.toString();
    // }
    return allappointments;
  },

  async getAllAppointmentsByUserId(userId) {
    if (typeof userId === 'undefined') throw "userId is undefined!";
    if (!ObjectId.isValid(userId) && typeof userId !== 'string') throw "userId is not a string or objectKey!"
    if (typeof userId === 'string' && userId.trim().length === 0) throw "userId is an empty string!";
    if (!ObjectId.isValid(userId)) {
      throw "userId doesn't exist!";
    } else {
      userId = ObjectId(userId);
    }

    const userCollection = await users();
    let allappointments = await userCollection.find({ "_id": ObjectId(userId) }).toArray();
    if (allappointments === null) throw 'No user with that userId!';
    // for (let x of allbands){
    //     x._id = x._id.toString();
    // }
    return allappointments;
  },

  async getAllAppointmentsByCookies(email) {
    if (typeof email === 'undefined') throw "email is undefined!";
    if (typeof email !== 'string') throw "email is not a string!"
    if (typeof email === 'string' && email.trim().length === 0) throw "email is an empty string!";

    const userCollection = await users();
    let allappointments = await userCollection.find({ "email": email }).toArray();
    if (allappointments === null) throw 'No user with that email!';
    // for (let x of allbands){
    //     x._id = x._id.toString();
    // }
    return allappointments;
  },

  async getAppointmentbyappointmentId(appointmentId) {
    if (typeof appointmentId === 'undefined') throw "appointmentId is undefined!";
    if (!ObjectId.isValid(appointmentId) && typeof appointmentId !== 'string') throw "appointmentId is not a string or objectKey!"
    if (typeof appointmentId === 'string' && appointmentId.trim().length === 0) throw "appointmentId is an empty string!";
    if (!ObjectId.isValid(appointmentId)) {
      throw "appointmentId doesn't exist!";
    } else {
      appointmentId = ObjectId(appointmentId);
    }

    const userCollection = await users();
    const appointment = await userCollection.findOne({ "appointments.appointmentId": ObjectId(appointmentId) });
    if (appointment === null) throw 'No appointment with that appointmentId!';
    // return appointment;

    let result;
    for (x of appointment.appointments){
      if ((x.appointmentId).equals(appointmentId)){
        result = x;
        break;
      }
    }
    return result;
  },

  async autoMatchId(activityId, parkId, year, month, day, hour, minute) {
    if (!activityId || !parkId || !year || !month || !day || !hour || !minute) throw 'please provide all inputs';
    if (!ObjectId.isValid(activityId)) throw 'invalid acitivity ID';
    if (!ObjectId.isValid(parkId)) throw 'invalid park ID';
    if (typeof year !== 'string' || year.trim().length === 0 || isNaN(parseInt(year)) || parseInt(year) < new Date().getFullYear()) throw "invalid year or the year was past";
    if (typeof month !== 'string' || month.trim().length === 0 || isNaN(parseInt(month)) || parseInt(month) < new Date().getMonth()) throw "invalid month or the month was past";
    if (typeof day !== 'string' || day.trim().length === 0 || isNaN(parseInt(day)) || parseInt(day) < new Date().getDay()) throw "invalid day or the day was past";
    if (typeof hour !== 'string' || hour.trim().length === 0 || isNaN(parseInt(hour)) || parseInt(hour) < 0 || parseInt(hour) > 23) throw "invalid hour";
    if (typeof minute !== 'string' || minute.trim().length === 0 || parseInt(minute) < 0 || parseInt(minute) > 59) throw "invalid minute";

    activityId = ObjectId(activityId);
    parkId = ObjectId(parkId);

    const userCollection = await users();
    const avalibleappointment = await userCollection.findOne({ "appointments.activityId": activityId, "appointments.year": year, "appointments.month": month, "appointments.day": day, "appointments.approvement": false });
    if (avalibleappointment === null) throw 'No avalible appointment, you can creat a new appointment!';
    // return avalibleappointment;

    let appointmentId;
    for (x of avalibleappointment.appointments){
      if ((x.activityId).equals(activityId) && x.year == year && x.month == month && x.day == day && x.approvement == false){
        appointmentId = x.appointmentId;
      }
    }
    return appointmentId;
  },

  async updateAppointment(appointmentId, currentUserId) {
    if (typeof appointmentId === 'undefined') throw "appointmentId is undefined!";
    if (!ObjectId.isValid(appointmentId) && typeof appointmentId !== 'string') throw "appointmentId is not a string or objectKey!"
    if (typeof appointmentId === 'string' && appointmentId.trim().length === 0) throw "appointmentId is an empty string!";
    if (!ObjectId.isValid(appointmentId)) {
      throw "appointmentId doesn't exist!";
    } else {
      appointmentId = ObjectId(appointmentId);
    }
    if (typeof currentUserId === 'undefined') throw "currentUserId is undefined!";
    if (!ObjectId.isValid(currentUserId) && typeof currentUserId !== 'string') throw "currentUserId is not a string or objectKey!"
    if (typeof currentUserId === 'string' && currentUserId.trim().length === 0) throw "currentUserId is an empty string!";
    if (!ObjectId.isValid(currentUserId)) {
      throw "currentUserId doesn't exist!";
    } else {
      currentUserId = ObjectId(currentUserId);
    }

    // const userCollection = await users();
    // let user = await userCollection.findOne({ "appointments.appointmentId": ObjectId(appointmentId) });
    // if (user === null) throw 'No appointment with that appointmentId';
    // const updateInfo = await userCollection.updateOne({"appointments.appointmentId": ObjectId(appointmentId)}, {$add: {appointmens: {approvement: true, status: "Full"}}});
    // if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    //   throw 'Could register that appointment';

    const userCollection = await users();
    let user = await userCollection.findOne({ "appointments.appointmentId": ObjectId(appointmentId) });
    if (user === null) throw 'No appointment with that appointmentId';
    if (user._id.equals(currentUserId)) throw "You cannot register your own appointment!"

    userCollection.updateOne(
      { "appointments.appointmentId": ObjectId(appointmentId) },
      { $set: { "appointments.$[filter].approvement": true } },
      { arrayFilters: [{ "filter.appointmentId": ObjectId(appointmentId) }] }
    );
    userCollection.updateOne(
      { "appointments.appointmentId": ObjectId(appointmentId) },
      { $set: { "appointments.$[filter].status": "Full" } },
      { arrayFilters: [{ "filter.appointmentId": ObjectId(appointmentId) }] }
    );

    let newuser = await userCollection.findOne({ "appointments.appointmentId": ObjectId(appointmentId) });
    if (newuser === null) throw 'No appointment with that appointmentId';
    let newAppointment;
    let allAppointments = newuser.appointments;
    for (let x of allAppointments){
      if (x.appointmentId.equals(appointmentId)){
        newAppointment = x;
        break;
      }
    }
    const updatesecondUser = await userCollection.updateOne({ _id: ObjectId(currentUserId) },
      { $addToSet: { appointments: newAppointment } }
    );

    const parkCollection = await parks();
    let park = await parkCollection.findOne({ "appointments.appointmentId": ObjectId(appointmentId) });
    if (park === null) throw 'No appointment with that appointmentId';
    parkCollection.updateOne(
      { "appointments.appointmentId": ObjectId(appointmentId) },
      { $set: { "appointments.$[filter].approvement": true } },
      { arrayFilters: [{ "filter.appointmentId": ObjectId(appointmentId) }] }
    );
    parkCollection.updateOne(
      { "appointments.appointmentId": ObjectId(appointmentId) },
      { $set: { "appointments.$[filter].status": "Full" } },
      { arrayFilters: [{ "filter.appointmentId": ObjectId(appointmentId) }] }
    );
    return true;
  }

}
