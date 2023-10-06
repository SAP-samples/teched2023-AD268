CREATE REMOTE SOURCE REMOTE_SOURCE_TECHED_<UserID> ADAPTER hanaodbc
CONFIGURATION 'ServerNode=<zeus.hana.prod.ap-southeast-1.whitney.dbaas.ondemand.com:22325- Hana Service/Source host:port>;driver=libodbcHDB.so;encrypt=yes;sslValidateCertificate=False' 
WITH CREDENTIAL TYPE 'PASSWORD' using 'user=REMOTE_SOURCE_USER_TECHED_<UserID>;password=Welcome1';  

/*Tiny World*/
CREATE VIRTUAL TABLE "<Hana Cloud Tinyworld schema>"."TINYWORLD_TINYDB_TINYF_COUNTRY_VIR" at "REMOTE_SOURCE_TECHED_<UserID>"."NULL"."<HaaS Tinyworld schema>"."tinyworld.tinydb::tinyf.country";
CREATE VIRTUAL TABLE "<Hana Cloud Tinyworld schema>"."TINYWORLD_TINYDB_TINYF_WORLD_VIR" at "REMOTE_SOURCE_TECHED_<UserID>"."NULL"."<HaaS Tinyworld schema>"."tinyworld.tinydb::tinyf.world";

/*User*/
CREATE VIRTUAL TABLE "<Hana Cloud user schema>"."USERDATA_USER_VIR" at "REMOTE_SOURCE_TECHED_<UserID>"."NULL"."<HaaS user schema>"."UserData.User"; 


INSERT INTO "<Hana Cloud Tinyworld schema>"."TINYWORLD_TINYDB_TINYF_COUNTRY"( 
   "NAME", 
   "PARTOF_CONTINENT"
) 
SELECT 
   "name", 
   "partof.continent"
FROM "<Hana Cloud Tinyworld schema>"."TINYWORLD_TINYDB_TINYF_COUNTRY_VIR"; 

INSERT INTO "<Hana Cloud Tinyworld schema>"."TINYWORLD_TINYDB_TINYF_WORLD"( 
   "CONTINENT"
) 
SELECT 
   "continent"
FROM "<Hana Cloud Tinyworld schema>"."TINYWORLD_TINYDB_TINYF_WORLD_VIR"; 

INSERT INTO "<Hana Cloud user schema>"."USERDATA_USER"( 
   "USERID",
   "FIRSTNAME",
   "LASTNAME",
   "EMAIL"
) 
SELECT 
   "UserId",
   "FirstName",
   "LastName",
   "Email"
FROM "<Hana Cloud user schema>"."USERDATA_USER_VIR"; 
