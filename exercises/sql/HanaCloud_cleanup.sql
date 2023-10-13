DROP TABLE "<Hana Cloud Tinyworld schema>"."TINYWORLD_TINYDB_TINYF_COUNTRY_VIR";
DROP TABLE "<Hana Cloud Tinyworld schema>"."TINYWORLD_TINYDB_TINYF_WORLD_VIR";
DROP TABLE "<Hana Cloud user schema>"."USERDATA_USER_VIR";

CREATE LOCAL TEMPORARY COLUMN TABLE #PRIVILEGES LIKE _SYS_DI.TT_SCHEMA_PRIVILEGES; 
INSERT INTO #PRIVILEGES (PRIVILEGE_NAME, PRINCIPAL_SCHEMA_NAME, PRINCIPAL_NAME) VALUES ('CREATE ANY', '', 'DBADMIN'); 
INSERT INTO #PRIVILEGES (PRIVILEGE_NAME, PRINCIPAL_SCHEMA_NAME, PRINCIPAL_NAME) VALUES ('SELECT', '', 'DBADMIN'); 
INSERT INTO #PRIVILEGES (PRIVILEGE_NAME, PRINCIPAL_SCHEMA_NAME, PRINCIPAL_NAME) VALUES ('INSERT', '', 'DBADMIN'); 
INSERT INTO #PRIVILEGES (PRIVILEGE_NAME, PRINCIPAL_SCHEMA_NAME, PRINCIPAL_NAME) VALUES ('DELETE', '', 'DBADMIN'); 
CALL <Hana Cloud Tinyworld schema>#DI.REVOKE_CONTAINER_SCHEMA_PRIVILEGES (#PRIVILEGES, _SYS_DI.T_NO_PARAMETERS,?,?,?); 
DROP TABLE #PRIVILEGES; 

CREATE LOCAL TEMPORARY COLUMN TABLE #PRIVILEGES LIKE _SYS_DI.TT_SCHEMA_PRIVILEGES; 
INSERT INTO #PRIVILEGES (PRIVILEGE_NAME, PRINCIPAL_SCHEMA_NAME, PRINCIPAL_NAME) VALUES ('CREATE ANY', '', 'DBADMIN'); 
INSERT INTO #PRIVILEGES (PRIVILEGE_NAME, PRINCIPAL_SCHEMA_NAME, PRINCIPAL_NAME) VALUES ('SELECT', '', 'DBADMIN'); 
INSERT INTO #PRIVILEGES (PRIVILEGE_NAME, PRINCIPAL_SCHEMA_NAME, PRINCIPAL_NAME) VALUES ('INSERT', '', 'DBADMIN'); 
INSERT INTO #PRIVILEGES (PRIVILEGE_NAME, PRINCIPAL_SCHEMA_NAME, PRINCIPAL_NAME) VALUES ('DELETE', '', 'DBADMIN'); 
CALL <Hana Cloud user schema>#DI.REVOKE_CONTAINER_SCHEMA_PRIVILEGES (#PRIVILEGES, _SYS_DI.T_NO_PARAMETERS,?,?,?); 
DROP TABLE #PRIVILEGES; 

CREATE LOCAL TEMPORARY COLUMN TABLE #PRIVILEGES LIKE _SYS_DI.TT_API_PRIVILEGES; 
INSERT INTO #PRIVILEGES (PRINCIPAL_NAME, PRIVILEGE_NAME, OBJECT_NAME) SELECT 'DBADMIN', PRIVILEGE_NAME, OBJECT_NAME FROM _SYS_DI.T_DEFAULT_CONTAINER_ADMIN_PRIVILEGES; 
CALL _SYS_DI#BROKER_CG.REVOKE_CONTAINER_API_PRIVILEGES('<Hana Cloud Tinyworld schema>', #PRIVILEGES, _SYS_DI.T_NO_PARAMETERS, ?, ?, ?); 
DROP TABLE #PRIVILEGES; 

CREATE LOCAL TEMPORARY COLUMN TABLE #PRIVILEGES LIKE _SYS_DI.TT_API_PRIVILEGES; 
INSERT INTO #PRIVILEGES (PRINCIPAL_NAME, PRIVILEGE_NAME, OBJECT_NAME) SELECT 'DBADMIN', PRIVILEGE_NAME, OBJECT_NAME FROM _SYS_DI.T_DEFAULT_CONTAINER_ADMIN_PRIVILEGES; 
CALL _SYS_DI#BROKER_CG.REVOKE_CONTAINER_API_PRIVILEGES('<Hana Cloud user schema>', #PRIVILEGES, _SYS_DI.T_NO_PARAMETERS, ?, ?, ?); 
DROP TABLE #PRIVILEGES; 

CREATE LOCAL TEMPORARY COLUMN TABLE #PRIVILEGES LIKE _SYS_DI.TT_API_PRIVILEGES; 
INSERT INTO #PRIVILEGES (PRINCIPAL_NAME, PRIVILEGE_NAME, OBJECT_NAME) SELECT 'DBADMIN', PRIVILEGE_NAME, OBJECT_NAME FROM _SYS_DI.T_DEFAULT_CONTAINER_GROUP_ADMIN_PRIVILEGES; 
CALL _SYS_DI.REVOKE_CONTAINER_GROUP_API_PRIVILEGES('BROKER_CG', #PRIVILEGES, _SYS_DI.T_NO_PARAMETERS, ?, ?, ?); 
DROP TABLE #PRIVILEGES; 

DROP REMOTE SOURCE REMOTE_SOURCE_TECHED_<UserID>;