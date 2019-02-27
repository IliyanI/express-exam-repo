//Returns all rent models in db and populates the 'car' fieled
//with car object not only Objectid
Rent.find({})
  .populate("car")
  .then((response, reject) => {});
