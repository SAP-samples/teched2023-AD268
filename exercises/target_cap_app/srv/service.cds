using { UserData } from '../db/cds/UserData';
using { TINYWORLD_TINYDB_MYVIEW as twview }from '../db/cds/myview';
using { tinyworld.tinydb.tinyf as tw }from '../db/cds/tinyf';

service TechedService @(requires: 'authenticated-user') @(path: '/teched') {
    entity Users as projection on UserData.User;
    @readonly entity MYVIEW @(requires: 'view') as projection on twview;
    type valuefields : {
        IM_COUNTRY : String;
        IM_CONTINENT : String;
    };
    entity country as projection on tw.country;
    entity tinyf_world as projection on tw.world;
    @(requires: 'create')
    action createcountry(ValueFields : valuefields )returns String;
}