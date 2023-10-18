# Exercise 4 - Manually migrate the Data from Source HDI Container to target HDI Container

In this exercise, we will manually migrate the data from the SAP Hana as a Service (Source) container to SAP Hana Cloud (Target) container. The manual migration of a Cloud Foundry multitarget application's data from SAP HANA Service to SAP HANA Cloud must be performed for each multitarget application individually. The method described here is for multitarget applications that have an HDI container, and the catalog objects are defined within the multitarget application's database module. Catalog objects can include tables, views, roles, privileges, functions, stored procedures, etc.

## Exercise 4.1 - Add the Databases and HDI containers in the Database Explorer

The First step of the exercise is to add the Databases and HDI containers in the Database Explorer.

1. Launch the [Database Explorer](https://hana-cockpit.cfapps.ap11.hana.ondemand.com/hrtt/sap/hana/cst/catalog/cockpit-index.html).

2. Enter `tdct3ched1-platform` and Select the alternate IDP.
<br>![](/exercises/ex4/images/DBIDP.png)

3. Click on + button. Select the Instance Type as `SAP HANA Database`. Enter the Host as `zeus.hana.prod.ap-southeast-1.whitney.dbaas.ondemand.com`, Select the Identifier as Port number and enter the value `22325` for SAP Hana Service Database. Enter the SAP Hana Service Database username and password. Slect the checkbox for `Save password (stored in the SAP HANA secure store)` and `Connect to the database securely using TLS/SSL (prevents data eavesdropping)` and Uncheck the `Verify the server's certificate using the trusted certificate below` checkbox. Change the Display name to 'HanaService' and Click on OK.
<br>![](/exercises/ex4/images/HaaSDB.png)

4. Click on + button again. Select the Instance Type as `SAP HANA Database`. Enter the Host as `aff1e6fd-3b13-4882-8c68-4fc9077e9976.hana.prod-ap11.hanacloud.ondemand.com`, Select the Identifier as Port number and enter the value `443` for SAP Hana Cloud Database. Enter the SAP Hana Cloud Database username and password. Slect the checkbox for `Save password (stored in the SAP HANA secure store)` and `Connect to the database securely using TLS/SSL (prevents data eavesdropping)` and Uncheck the `Verify the server's certificate using the trusted certificate below` checkbox. Change the Display name to 'HanaCloud' and Click on OK.
<br>![](/exercises/ex4/images/HanaCloudDB.png)

5. Click on + button, In the dropdown select HDI Container. Select your respective Org and Space. Select the First HDI container and Click on OK.
<br>![](/exercises/ex4/images/HDI.png)

6. Repeat the steps for the second HDI container. At the end, Your database explorer should have these.
<br>![](/exercises/ex4/images/EndResult.png)

7. Expand the tiny-cap-container and Click on Tables. Open any one table by Double clicking on it. You should see the schema value on the right. Copy it.
<br>![](/exercises/ex4/images/Tiny.png)

8. Repeat the same for user-cap-container and copy the schema value.
<br>![](/exercises/ex4/images/User.png)

## Exercise 4.2 - Run the SQL commands

The next step of the exercise is to run the SQL commands in the console to create a remote source, virtual tables and then to migrate data.

1.	First right Click on the HanaService Database and Select Open SQL Console.
<br>![](/exercises/ex2/images/SQL_HaaS.png)

2. Next is to create a Remote source user and assign the necessary privileges in the Hana Service Database. Run the below SQL script in the console.
   ```
   CREATE USER REMOTE_SOURCE_USER_TECHED_<UserID> PASSWORD Welcome1 NO FORCE_FIRST_PASSWORD_CHANGE;

   CREATE LOCAL TEMPORARY COLUMN TABLE #PRIVILEGES LIKE _SYS_DI.TT_SCHEMA_PRIVILEGES; 
   INSERT INTO #PRIVILEGES ( PRIVILEGE_NAME, PRINCIPAL_SCHEMA_NAME, PRINCIPAL_NAME ) VALUES ( 'SELECT', '', 'REMOTE_SOURCE_USER_TECHED_<UserID>' ); 
   CALL _SYS_DI.GRANT_CONTAINER_SCHEMA_PRIVILEGES('<HaaS Tinyworld schema>', #PRIVILEGES, _SYS_DI.T_NO_PARAMETERS, ?, ?, ?); 
   DROP TABLE #PRIVILEGES; 

   CREATE LOCAL TEMPORARY COLUMN TABLE #PRIVILEGES LIKE _SYS_DI.TT_SCHEMA_PRIVILEGES; 
   INSERT INTO #PRIVILEGES ( PRIVILEGE_NAME, PRINCIPAL_SCHEMA_NAME, PRINCIPAL_NAME ) VALUES ( 'SELECT', '', 'REMOTE_SOURCE_USER_TECHED_<UserID>' ); 
   CALL _SYS_DI.GRANT_CONTAINER_SCHEMA_PRIVILEGES('<HaaS user schema>', #PRIVILEGES, _SYS_DI.T_NO_PARAMETERS, ?, ?, ?); 
   DROP TABLE #PRIVILEGES; 
   ```
   Replace the placeholders < UserID > with Group number, < HaaS Tinyworld schema > with the schema of the tinyworld schema in the Hana Service Database and < HaaS user schema > with the schema of the user schema in the Hana Service Database which is available in the [Getting Started](../ex0/README.md) section.

3.	Next right Click on the HanaCloud Database and Select Open SQL Console.
<br>![](/exercises/ex2/images/SQL_HC.png)

4. Assign the privileges in the Hana Cloud Database by running the below SQL script in the second console.
   ```
   -- SELECT CONTAINER_GROUP_NAME FROM _SYS_DI.M_ALL_CONTAINERS WHERE CONTAINER_NAME = '<Hana Cloud Tinyworld schema>';

   -- SELECT CONTAINER_GROUP_NAME FROM _SYS_DI.M_ALL_CONTAINERS WHERE CONTAINER_NAME = '<Hana Cloud user schema>';

   CREATE LOCAL TEMPORARY COLUMN TABLE #PRIVILEGES LIKE _SYS_DI.TT_API_PRIVILEGES; 
   INSERT INTO #PRIVILEGES (PRINCIPAL_NAME, PRIVILEGE_NAME, OBJECT_NAME) SELECT 'DBADMINTEST', PRIVILEGE_NAME, OBJECT_NAME FROM _SYS_DI.T_DEFAULT_CONTAINER_GROUP_ADMIN_PRIVILEGES; 
   CALL _SYS_DI.GRANT_CONTAINER_GROUP_API_PRIVILEGES('BROKER_CG', #PRIVILEGES, _SYS_DI.T_NO_PARAMETERS, ?, ?, ?); 
   DROP TABLE #PRIVILEGES;  

   CREATE LOCAL TEMPORARY COLUMN TABLE #PRIVILEGES LIKE _SYS_DI.TT_API_PRIVILEGES; 
   INSERT INTO #PRIVILEGES (PRINCIPAL_NAME, PRIVILEGE_NAME, OBJECT_NAME) SELECT 'DBADMINTEST', PRIVILEGE_NAME, OBJECT_NAME FROM _SYS_DI.T_DEFAULT_CONTAINER_ADMIN_PRIVILEGES; 
   CALL _SYS_DI#BROKER_CG.GRANT_CONTAINER_API_PRIVILEGES('<Hana Cloud Tinyworld schema>', #PRIVILEGES, _SYS_DI.T_NO_PARAMETERS, ?, ?, ?); 
   DROP TABLE #PRIVILEGES; 

   CREATE LOCAL TEMPORARY COLUMN TABLE #PRIVILEGES LIKE _SYS_DI.TT_API_PRIVILEGES; 
   INSERT INTO #PRIVILEGES (PRINCIPAL_NAME, PRIVILEGE_NAME, OBJECT_NAME) SELECT 'DBADMINTEST', PRIVILEGE_NAME, OBJECT_NAME FROM _SYS_DI.T_DEFAULT_CONTAINER_ADMIN_PRIVILEGES; 
   CALL _SYS_DI#BROKER_CG.GRANT_CONTAINER_API_PRIVILEGES('<Hana Cloud user schema>', #PRIVILEGES, _SYS_DI.T_NO_PARAMETERS, ?, ?, ?); 
   DROP TABLE #PRIVILEGES;

   CREATE LOCAL TEMPORARY COLUMN TABLE #PRIVILEGES LIKE _SYS_DI.TT_SCHEMA_PRIVILEGES;
   INSERT INTO #PRIVILEGES (PRIVILEGE_NAME, PRINCIPAL_SCHEMA_NAME, PRINCIPAL_NAME) VALUES ('CREATE ANY', '', 'DBADMINTEST'); 
   INSERT INTO #PRIVILEGES (PRIVILEGE_NAME, PRINCIPAL_SCHEMA_NAME, PRINCIPAL_NAME) VALUES ('SELECT', '', 'DBADMINTEST');
   INSERT INTO #PRIVILEGES (PRIVILEGE_NAME, PRINCIPAL_SCHEMA_NAME, PRINCIPAL_NAME) VALUES ('INSERT', '', 'DBADMINTEST');
   INSERT INTO #PRIVILEGES (PRIVILEGE_NAME, PRINCIPAL_SCHEMA_NAME, PRINCIPAL_NAME) VALUES ('DELETE', '', 'DBADMINTEST');
   CALL <Hana Cloud Tinyworld schema>#DI.GRANT_CONTAINER_SCHEMA_PRIVILEGES (#PRIVILEGES, _SYS_DI.T_NO_PARAMETERS,?,?,?); 
   DROP TABLE #PRIVILEGES; 

   CREATE LOCAL TEMPORARY COLUMN TABLE #PRIVILEGES LIKE _SYS_DI.TT_SCHEMA_PRIVILEGES;
   INSERT INTO #PRIVILEGES (PRIVILEGE_NAME, PRINCIPAL_SCHEMA_NAME, PRINCIPAL_NAME) VALUES ('CREATE ANY', '', 'DBADMINTEST'); 
   INSERT INTO #PRIVILEGES (PRIVILEGE_NAME, PRINCIPAL_SCHEMA_NAME, PRINCIPAL_NAME) VALUES ('SELECT', '', 'DBADMINTEST');
   INSERT INTO #PRIVILEGES (PRIVILEGE_NAME, PRINCIPAL_SCHEMA_NAME, PRINCIPAL_NAME) VALUES ('INSERT', '', 'DBADMINTEST');
   INSERT INTO #PRIVILEGES (PRIVILEGE_NAME, PRINCIPAL_SCHEMA_NAME, PRINCIPAL_NAME) VALUES ('DELETE', '', 'DBADMINTEST');
   CALL <Hana Cloud user schema>#DI.GRANT_CONTAINER_SCHEMA_PRIVILEGES (#PRIVILEGES, _SYS_DI.T_NO_PARAMETERS,?,?,?); 
   DROP TABLE #PRIVILEGES;
   ```
   Replace the placeholders < Hana Cloud Tinyworld schema > with the value of the tinyworld schema and < Hana Cloud user schema > with the value of the user schema copied in the previous step.

5. Next, In the Hana Cloud console, run the below SQL script to create the Remote source, Virtual tables and insert the data through the virtual tables.
   ```
   CREATE REMOTE SOURCE REMOTE_SOURCE_TECHED_<UserID> ADAPTER hanaodbc
   CONFIGURATION 'ServerNode=<zeus.hana.prod.ap-southeast-1.whitney.dbaas.ondemand.com:22325- Hana Service/Source host:port>;driver=libodbcHDB.so;encrypt=yes;sslValidateCertificate=False' WITH CREDENTIAL TYPE 'PASSWORD' using 'user=REMOTE_SOURCE_USER_TECHED_<UserID>;password=Welcome1';  

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
   ```
   Make sure to Replace the placeholders with their respective values before you run the script.

## Exercise 4.3 - Add the Role collection and Test the CAP application

The last step of the exercise is to create the role collection, assign it to your user and then test the deployed cap application.

1. In the [SAP BTP Subaccount](https://emea.cockpit.btp.cloud.sap/cockpit/#/globalaccount/e2a835b0-3011-4c79-818a-d7767c4627cd/subaccount/97396e46-9113-478b-94de-3bc4a08ecb60/subaccountoverview), Click on 'Role Collections' under Security on the left side.

2. Click on the + Button, Enter name as Target_CAP_< Group Number > and any description and Click on Create.
<br>![](/exercises/ex4/images/Role1.png)

3. Click on the created role collection to navigate to the details page and click on Edit.
<br>![](/exercises/ex4/images/Role2.png)

4. Click on the value help button for the Role name under Roles section. 

5. In the pop-up, Application Identifier dropdown, select the identifier for the deployed application which starts with techedcapapp. Select all the filtered roles and click on Add.
<br>![](/exercises/ex4/images/Role3.png)

6. Now in the role collection edit page, add your user under the Users section (Select Default identifier as the IDP) and click on Save.

7. Go back to the business application studio and run the below command to fetch the application URL.
   ```
   cf a
   ```

8. Copy and Launch the Application URL in a new browser tab and Test the application.
<br>![](/exercises/ex4/images/CAPApp.png)


## Summary

You've now successfully migrated the Data from Source HDI Container to target HDI Container manually.

Continue to - [Exercise 5 - Perform the Clean Up Operations ](../ex5/README.md)
