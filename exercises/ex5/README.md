# Exercise 5 - Perform the Clean Up Operations

In this exercise, we will perform the clean up operations.

## Exercise 5.1 - Clean Up in Database Explorer

As a First step in this exercise, Run SQL commands in the Database explorer to delete the virtual tables, Remote sources and so on.

1. In the Database Explorer, Run the below SQL script in the Hana Cloud console to delete the virtual tables, remote source and to remove privileges. Replace the respective place holders.
   ```
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
   ```

2. Next, Run the below SQL script in the Hana Service SQL console to remove the remote source user and privileges. Replace the respective place holders.
   ```
   CREATE LOCAL TEMPORARY COLUMN TABLE #PRIVILEGES LIKE _SYS_DI.TT_SCHEMA_PRIVILEGES; 
   INSERT INTO #PRIVILEGES ( PRIVILEGE_NAME, PRINCIPAL_SCHEMA_NAME, PRINCIPAL_NAME ) VALUES ( 'SELECT', '', 'REMOTE_SOURCE_USER_TECHED_<UserID>' ); 
   CALL _SYS_DI.REVOKE_CONTAINER_SCHEMA_PRIVILEGES('<HaaS Tinyworld schema>', #PRIVILEGES, _SYS_DI.T_NO_PARAMETERS, ?, ?, ?); 
   DROP TABLE #PRIVILEGES; 

   CREATE LOCAL TEMPORARY COLUMN TABLE #PRIVILEGES LIKE _SYS_DI.TT_SCHEMA_PRIVILEGES; 
   INSERT INTO #PRIVILEGES ( PRIVILEGE_NAME, PRINCIPAL_SCHEMA_NAME, PRINCIPAL_NAME ) VALUES ( 'SELECT', '', 'REMOTE_SOURCE_USER_TECHED_<UserID>' ); 
   CALL _SYS_DI.REVOKE_CONTAINER_SCHEMA_PRIVILEGES('<HaaS user schema>', #PRIVILEGES, _SYS_DI.T_NO_PARAMETERS, ?, ?, ?); 
   DROP TABLE #PRIVILEGES; 

   DROP USER REMOTE_SOURCE_USER_TECHED_<UserID>;
   ```

3. Remove the database by Right clicking on the database and then selecting Remove Database option. Repeat this step for the remaining databases untill all are removed.
<br>![](/exercises/ex2/images/RemoveDB.png)

## Exercise 5.2 - Clean Up in Business Application Studio

In this step, we will undeploy the mta application and delete the Business Application Studio Dev space.

1. In the Business Application studio terminal, Run the below command to get the mta id of the CAP application.
   ```
   cf mtas
   ```

   **Note**: Make sure to copy only the mta id of the CAP application deployed by you.

2. Run the below command to undeploy the mta application and to delete all the service instance and keys associated with the application. 
   ```
   cf undeploy < mta id > --delete-service-keys --delete-services
   ```
   Replace ` < mta id > ` with the value copied in the previous step.

3. Remove the workspace id from the Business application studio URL in the browser and press Enter to come out of the Dev space.
<br>![](/exercises/ex2/images/DevId.png)

4. Click on the Delete button and Confirm the deletion by click on Delete in the popup. The dev space will be deleted.

## Exercise 5.3 - Clean Up in SAP BTP Subaccount Cockpit (Optional)

Last step of this exercise is to delete the Role collection.

1. Go back to the SAP BTP Subaccount Cockpit.

2. Navigate to the Role Collections under Security and Select your created Role Collection.

3. In the Role Collection Detail page, Click on the Delete Button.

4. Confirm the deletion by clicking on Delete again. Role Collection will be deleted.
<br>![](/exercises/ex2/images/RCDelete.png)

## Summary

You've now reached the end of this hands-on exercise. You have successfully converted an XSA application to a CAP application and migrated the data from SAP Hana as a Service container to SAP Hana Cloud container.

You can find more information on how to do this with Self-Service Migration tool on our [SAP Samples Repository](https://github.com/SAP-samples/xsa-cap-migration.git) and you can also find the different migration paths in our [SAP help portal](https://help.sap.com/docs/SAP_HANA_PLATFORM/58d81eb4c9bc4899ba972c9fe7a1a115/2aa5aa246a704e199cd06ca5c84d1155.html).

Congratulations!
