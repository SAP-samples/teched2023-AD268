namespace tinyworld.tinydb;

context tinyf {
   entity world {
      key continent : String(100);
   };
   entity country {
      key name   : String(100);
          partof : association[0..1] to world;
   };
};