
export default class Realm {
  static open = async()=>new Realm();
  objects(){return[];}
  write(fn){fn();}
  create(){}
  delete(){}
  close(){}
  static UpdateMode = {Modified:'modified',All:'all'};
}

