# Exercise 3 - Modifications in the CAP Application and Multicontainer Support

In this exercise, we will modify the files in the created CAP application to provide support for Multiple Container Access. The example will walk you through the process of creating and modifying specific files while providing codes to enhance your CAP application.


## Exercise 3.1 - Create and Expose Facade Entities

The First step of the exercise is to create facade entities in the db container.

1. To access the Calculation View, In the `db/cds` folder of the CAP application, create a `myview.cds` file with the below content.
   ```
   @cds.persistence.exists 
   @cds.persistence.calcview 
   Entity TINYWORLD_TINYDB_MYVIEW {
      key     NAME: String(100)  @title: 'NAME: name';
      PARTOF_CONTINENT: String(100) @title: 'PARTOF_CONTINENT: partof_continent';
   }
   ```
   Here we are defining the Calculation view as a facade entity. We also use the below annotations here
   - `@cds.persistence.exists`: To tell CDS that this object already exists on the database and must not be generated.
   - `@cds.persistence.calcview`: To specify that the facade entity represents a calculation view

   For more information refer - [Calculated Views and User-Defined Functions](https://cap.cloud.sap/docs/advanced/hana#calculated-views-and-user-defined-functions)

2. In the same `db/cds` folder, create `UserData.cds` file with the following content:
   ```
   context UserData {
      @cds.persistence.exists
      entity User {
        key UserId: Integer;
        FirstName: String(40);
        LastName: String(40);
        Email: String(255);
      };
   };
   ```
   Here the entity UserData_User is a Facade entity for the `UserData.User` table in the second container.

   For more information refer - [@cds.persistence.exists](https://cap.cloud.sap/docs/advanced/hana#cds-persistence-exists)

3. Expose these facade entities by adding these two lines of code in the `db/index.cds` file.
   ```
   using from './cds/myview';
   using from './cds/UserData';
   ```

## Exercise 3.2 - Establish a link between the HDI containers

The Second step of the exercise is to create a synonym and roles to establish a link between the HDI containers and access the database artifacts.

For more information refer - [Add Existing SAP HANA Objects from Other HDI Containers](https://cap.cloud.sap/docs/advanced/hana#add-existing-sap-hana-objects-from-other-hdi-containers)

1. In the `db` folder, create a new folder with the name `cfg`. In this folder, create a `USERDATA_USER.hdbsynonymconfig` file with below content.
   ```
   {
    "USERDATA_USER": {
      "target": {
        "object": "USERDATA_USER",
        "schema.configure": "hdi-user-service/schema"
      }
    },
    "PROCEDURES_USERSCREATEMETHOD": {
      "target": {
        "object": "PROCEDURES_USERSCREATEMETHOD",
        "schema.configure": "hdi-user-service/schema"
      }
    },
    "USERSEQID": {
      "target": {
        "object": "USERSEQID",
        "schema.configure": "hdi-user-service/schema"
      }
    },
    "GETTABLESIZE": {
      "target": {
        "object": "GETTABLESIZE",
        "schema.configure": "hdi-user-service/schema"
      }
    }
   }
   ```
   This file is used to provide an explicit configuration of the synonym’s target. Here USERDATA_USER, PROCEDURES_USERSCREATEMETHOD, USERSEQID and GETTABLESIZE are the synonyms to access the database artifacts in the second container.

2. Now that the explicit configuration is provided, we have to create a synonym file with the synonym declaration. So in the `db/src` folder, create a `user.hdbsynonym` file with the below content.
   ```
   {
    "USERDATA_USER": {
    },
    "PROCEDURES_USERSCREATEMETHOD":{
    },
    "USERSEQID":{
    },
    "GETTABLESIZE":{
    }
   }
   ```

3. Next, we have to create a hdbgrants configuration file to assign privileges to the owner of the synonym object and the application users (consumers) of the synonym's target objects. So in the `db/src` folder, Create a `user.hdbgrants` file with the below content.
   ```
   {
    "hdi-user-service": {
      "object_owner": {
        "container_roles":["USERG#"]
      },
      "application_user": {
        "container_roles":["USER"]
      }
    } 
   }
   ```

4. Next in the second container, we have to assign the privileges to the database artifacts. We can achieve this by modifying the `user.hdbrole` in the `db1/src/roles` folder as below.
   ```
   {
	  "role": {
	    "name": "USER",
	    "schema_privileges": [
		    {
		      "privileges": [
			      "SELECT METADATA",
			      "SELECT CDS METADATA",
			      "SELECT",
			      "INSERT",
			      "UPDATE",
			      "EXECUTE",
			      "DELETE",
			      "CREATE TEMPORARY TABLE",
			      "CREATE ANY",
			      "CREATE OBJECT STRUCTURED PRIVILEGE"
		      ]
		    }
	    ],
		  "object_privileges": [
		    {
		      "name": "PROCEDURES_USERSCREATEMETHOD",
		      "type": "PROCEDURE",
		      "privileges": [
			      "EXECUTE"
		      ]
		    },
		    {
		      "name": "USERSEQID",
		      "type": "SEQUENCE",
		      "privileges": [
			      "SELECT"
		      ]
		    },
		    {
			    "name": "GETTABLESIZE",
			    "type": "FUNCTION",
			    "privileges": [
			      "EXECUTE"
			    ]
		    }
	    ]
	  }
   }
   ```

5. In the same `db1/src/roles` folder create a new file `userG.hdbrole` with the below content to assign the grant privileges.
   ```
   {
    "role": {
      "name": "USERG#",
      "schema_privileges": [
        {
          "privileges": [
            "SELECT METADATA",
            "SELECT CDS METADATA",
            "SELECT",
            "INSERT",
            "UPDATE",
            "EXECUTE",
            "DELETE",
            "CREATE TEMPORARY TABLE",
            "CREATE ANY",
            "CREATE OBJECT STRUCTURED PRIVILEGE"
          ],
          "privileges_with_grant_option": [
            "CREATE ANY",
            "EXECUTE",
            "INSERT",
            "SELECT",
            "SELECT CDS METADATA",
            "SELECT METADATA",
            "UPDATE"
          ]
        }
      ],
      "object_privileges": [
        {
          "name": "PROCEDURES_USERSCREATEMETHOD",
          "type": "PROCEDURE",
          "privileges": [
            "EXECUTE"
          ],
          "privileges_with_grant_option": [
            "EXECUTE"
          ]
        },
        {
          "name": "USERSEQID",
          "type": "SEQUENCE",
          "privileges": [
            "SELECT"
          ],
          "privileges_with_grant_option": [
            "SELECT"
          ]
        },
        {
          "name": "GETTABLESIZE",
          "type": "FUNCTION",
          "privileges": [
            "EXECUTE"
          ],
          "privileges_with_grant_option": [
            "EXECUTE"
          ]
        }
      ]
    }
   }
   ```

## Exercise 3.3 - Prepare the CAP application for deployment

The next step of the exercise is to prepare the CAP application for deployment

1. Replace the content of the `mta.yaml` file in the root folder of the CAP project with this [mta.yaml](../target_cap_app/mta.yaml) file content.
Ensure to replace the placeholder < UserID > with your Group number and ` < Hana Cloud Database ID > `with the `Hana Cloud Database ID / GUID` which is available in [Getting Started](../ex0/README.md) section.

2. Clear the unnecessary configurations by deleting `undeploy.json` files in the `db` folder.

3. Update the `xs-security.json` file in the root folder as below. Update the ` < UserID > ` with the Group Number.
   ```
   {
    "scopes": [
      {
        "name": "$XSAPPNAME.view",
        "description": "view"
      },
      {
        "name": "$XSAPPNAME.create",
        "description": "create"
      }
    ],
    "attributes": [],
    "role-templates": [
      {
        "name": "TechedCAP-view-<UserID>",
        "description": "generated",
        "scope-references": [
          "$XSAPPNAME.view"
        ],
        "attribute-references": []
      },
      {
        "name": "TechedCAP-create-<UserID>",
        "description": "generated",
        "scope-references": [
          "$XSAPPNAME.create"
        ],
        "attribute-references": []
      },
      {
        "name": "Token_Exchange-<UserID>",
        "description": "UAA",
        "scope-references": [
          "uaa.user"
        ]
      }
    ]
   }
   ```

4. Currently, with our script, we are just projecting the views/tables directly into the `srv` layer. Based on the xsodata implementation in the source, we may have to rewrite it. You have two options to modify the srv layer - either simply overwrite it with the `srv` folder from the [target_cap_app/srv](../target_cap_app/srv/) directory as it already has the CAP service implementation written for this demo application or  manually perform these steps.
   - Modify the `srv/service.cds` file with the below content. This involves updating the service definitions and data models for the srv layer, which dictates how the application's services will be exposed and interacted with.
     ```
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
     ```
   - Create a `service.js` file in the `srv` folder with the below content. Here, we are setting up the main service routes and handlers for the srv layer which allow the application to react to different types of requests (CREATE, READ, UPDATE, DELETE) on the various endpoints.
     ```
     'use strict';

     /**
     * This handles routing and passing off to specific handlers for the CAP service.
     * Each handler function executes when srv emits the corresponding event linked to the handler.
     * @param {Object} srv - The CAP service, which will emit events that these handlers react to.
     * @param {Object} srv.entities - The entities which are fired and needed within the endpoint handlers
     */

     const userVerifyHandler = require('./handlers/Usersverify');
     const userCreateHandler = require('./handlers/Userscreate');
     const createCountryHandler = require('./handlers/createCountry');

     module.exports = async (srv) => {
      srv.on('CREATE', 'Users', async (req) => {
        return userCreateHandler.createUser(req);
      });
      srv.before('CREATE', 'Users', async (req) => {
        return userVerifyHandler.verifyEmail(req);
      });
      srv.on('createcountry', async (req) => {
        return createCountryHandler.createCountry(req);
      });
     }
     ```
   - Create a new `handlers` folder in the `srv` directory.
   - Create a `Userscreate.js` file in the `srv/handlers` folder with the below content. This file houses the logic for creating a new user, essentially validating and inserting the provided user data into the database.
     ```
     'use strict';

     /**
     * This asynchronous function is responsible for creating a new user.
     * @async
     * @function createUser
     * @param {Object} req - The request object carrying all details of the incoming request.
     * @returns {Promise} - Returns a promise that resolves into the request data upon successful creation and rejects with a message on error.
     */

     async function createUser(req) {
      let usertemp;
      try {
        const values = [
          [ req.data.UserId, req.data.FirstName, req.data.LastName, req.data.Email ]
        ];
        usertemp = `#usertemp_${ cds.utils.uuid().replace(/-/g, '_') }`
        await cds.run(`create local temporary table ${ usertemp } ( UserId INT, FirstName NVARCHAR(40), LastName NVARCHAR(40), Email NVARCHAR(40))`)
        await cds.run(`insert into ${ usertemp } values (?,?,?,?)`, values)
        const query = `CALL "PROCEDURES_USERSCREATEMETHOD"(IM_ROW => ${ usertemp }, EX_ERROR => ?)`;
        await cds.run(query)
        return req.data;
      }
      catch (e) {
        return req.error(
          500,
          `Error in user creation: ${ e.message }`
        )
      }
      finally {
        if (usertemp)
          await cds.run(`DROP TABLE ${ usertemp }`)
      }
     }

     module.exports = { createUser };
     ```
   - Create a `Usersverify.js` file in the `srv/handlers` folder with the below content. This is where we include the logic to verify an email address during account creation, looking to prevent invalid or false email addresses from being registered.
     ```
     'use strict';

     /**
     * This function is responsible for verifying that an email address is valid.
     * @async
     * @function verifyEmail
     * @param {Object} req - The request object carrying all details of the incoming request.
     * @returns {Promise} - A promise which resolves with 'true' if the email is valid, or rejects with an error message if the email is invalid.
     */

     async function verifyEmail(req) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(req.data.Email))
        return req.error(400, 'E-Mail must be valid');

      return true;
     }

     module.exports = { verifyEmail };
     ```
   - Create a `createCountry.js` file in the `srv/handlers` folder with the below content. This file contains the function needed to create a new entry in the Tiny World application, specifically for adding a new country.
     ```
     'use strict';

     /**
     * This asynchronous function is responsible for creating a new entry in the tiny world application.
     * @async
     * @function createCountry
     * @param {Object} req - The request object carrying all details of the incoming request.
     * @returns {Promise} - Returns a promise that resolves into the request data upon successful creation and rejects with a message on error.
     */

     async function createCountry(req) {
      try {
        const query = `CALL "TINYWORLD_TINYDB_CREATECOUNTRY"('${req.data.ValueFields.IM_COUNTRY}', '${req.data.ValueFields.IM_CONTINENT}', ?)`;
        const output = await cds.run(query);
        if (output.EX_ERROR) {
          return req.error(
            400, 
            `Error in Data Insertion: ${output.EX_ERROR}`
          );
        }
        return  req.info({
            "code": 201,
            "message": `Data Inserted Successfully`,
            "numericSeverity": 1
        })
      }
      catch (e) {
        return req.error(
          500,
          `Error in Data Insertion: ${ e.message }`
        )
      }
     }

     module.exports = { createCountry };
     ```

5. In our current script, the application layer primarily requires updates to the routes to align with the newly defined services for accessing the API endpoints.
	You can either simplify the process by replacing the existing app folder with the prepared [target_cap_app/app](../target_cap_app/app/) folder which already houses all the required modifications for this specific demo application or you can manually make these changes as below

  	- Modify the `app/xs-app.json` file as below. The changes in this file ensure that the new service routes are recognized by the application and that authentication is properly configured.
  	  ```
  	  {
    		"welcomeFile": "launchpad/index.html",
    		"authenticationMethod": "route",
    		"routes": [{
     			"source": "^/teched/(.*)$",
     			"target": "/teched/$1",
     			"destination": "techedjs_be",
     			"authenticationType": "xsuaa"
    		},
    		{
     			"source": "^/v2/teched/(.*)$",
     			"target": "/v2/teched/$1",
     			"destination": "techedjs_be",
     			"authenticationType": "xsuaa"
    		},
    		{
     			"source": "^/(.*)$",
     			"localDir": "resources",
     			"scope": "$XSAPPNAME.view"
    		}]
  	  }
     - Modify the `serviceConfig` in `user-ui/Component.js` file as below. This update aligns the service URL to the newly defined service.

   	   ```
  	   config: {
      		resourceBundle: "i18n/messagebundle.hdbtextbundle",
      		serviceConfig: {
        		name: "Users",
        		serviceUrl: "/user"
      		}
  	   }
   	   ```
     - The route `/user/xsodata/user.xsodata/Users` should be substituted with `/teched/Users` in `app/user-ui/view/usercrud.controller.js` file. Copy the content of this [usercrud.controller.js](../target_cap_app/app/resources/user-ui/view/usercrud.controller.js) file here. This modification ensures that our User interface communicates with the correct endpoint in the service layer.
     - Similarly, the route `/country/country.xsjs` will need to be updated to `/v2/teched/createcountry` within the `app/resources/tiny-ui/Util.js` file. Copy the content of this [Util.js](../target_cap_app/app/resources/tiny-ui/Util.js) file here. The modification here ensures that the TinyUI communicates correctly with the new service endpoints.
     - Modify the routes in `tiny-ui/index.html` file. Copy the content of this [index.html](../target_cap_app/app/resources/tiny-ui/index.html) file here. This adjustment ensures that the frontend route references align with the updated service routes.

6. Delete the `.hdbtabledata` and `csv` files if any in the `db/src/data` and `db1/src/data` folders. We do not need them as it will already be deployed to the Source container and having them here might lead to duplicate entries during data migration.

    **Note: This is a very important step and cannot be skipped**

## Exercise 3.4 - Deploy the CAP application
The last step of this exercise is to deploy the CAP application. This is an important steps as it creates empty tables in the HDI container which is required for the next exercise.

1. Navigate to the root folder of the CAP Application.
2. Build the Application with the below command
   ```
   mbt build -p=cf
   ```

3. Navigate to the `mta_archives` directory
   ```
   cd mta_archives
   ```

4. Deploy the CAP application
   ```
   cf deploy <Generated MTAR>.mtar
   ```

## Summary

You've now successfully provided support for multiple containers and deployed the CAP application to Hana Cloud.

Continue to - [Exercise 4 - Manually migrate the Data from Source HDI Container to target HDI Container](../ex4/README.md)
