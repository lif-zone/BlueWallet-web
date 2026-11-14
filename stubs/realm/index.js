
class Results extends Array {
  filtered(){return new Results();}
  sorted(){return new Results();}
  snapshot(){return new Results();}
}

export default class Realm {
  static open = async()=>new Realm();
  objects(){return new Results();}
  write(fn){fn();}
  create(){}
  delete(){}
  close(){}
  objectForPrimaryKey(){return null;}
  static UpdateMode = {Modified:'modified',All:'all'};
}

