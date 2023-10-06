@cds.persistence.exists 
@cds.persistence.calcview 
Entity TINYWORLD_TINYDB_MYVIEW {
key     NAME: String(100)  @title: 'NAME: name';
        PARTOF_CONTINENT: String(100) @title: 'PARTOF_CONTINENT: partof_continent';
}