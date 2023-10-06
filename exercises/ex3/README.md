# Exercise 3 - Modifications in the CAP Application and Multicontainer Support

In this exercise, we will modify the files in the created CAP application to provide support for Multiple Container Access. The example will walk you through the process of creating and modifying specific files while providing codes to enhance your CAP application.


## Exercise 3.1 - Create and Expose Facade Entities

The First step of the exercise is to create facade entities in the db container.

1. To access the Calculation View, In the db/cds folder of the CAP application, create a 'myview.cds' file with the below content.
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

2.	In the same db/cds folder, create 'UserData.cds' file with the following content:
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
Here the entity UserData_User is a Facade entity for the UserData.User table in the second container.

3. Expose these facade entities by adding these two lines of code in the db/index.cds file.
```
using from './cds/myview';
using from './cds/UserData';
```

## Exercise 3.2 - Establish a link between the HDI containers

The Second step of the exercise is to create a synonym and roles to establish a link between the HDI containers and access the database artifacts.

1.	In the db folder, create a new folder with the name cfg. In this folder, create a 'USERDATA_USER.hdbsynonymconfig' file with below content.
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

2.	Now that the explicit configuration is provided, we have to create a synonym file with the synonym declaration. So in the db/src folder, create a 'user.hdbsynonym' file with the below content.
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

3. Next, we have to create a hdbgrants configuration file to assign privileges to the owner of the synonym object and the application users (consumers) of the synonym's target objects. So in the db/src folder, Create a 'user.hdbgrants' file with the below content.
```
{
    "hdi-user-service": {
      "object_owner": {
        "container_roles":["userG#"]
      },
      "application_user": {
        "container_roles":["user"]
      }
    } 
}
```

4. Next in the second container, we have to assign the privileges to the database artifacts. We can achieve this by modifying the 'user.hdbrole' in the db1/src/roles folder as below.
```
{
	"role": {
	  "name": "user",
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

5. In the same db1/src/roles folder create a new file 'userG.hdbrole' with the below content to assign the grant privileges.
```
{
  "role": {
    "name": "userG#",
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

1.	In the package.json file in the root folder, modify the db as 'hana-cloud'
```
"cds": {
  "requires": {
    "db": "hana-cloud",
    "auth": "xsuaa"
  }
}
```

2. Replace the content of the mta.yaml file in the root folder of the CAP project with this [mta.yaml](../target_cap_app/mta.yaml) file content.
Ensure to replace the placeholder < UserID > with your Group number and < Hana Cloud Database ID > with the Hana Cloud Database ID which is available in [Getting Started](../ex0/README.md) section.

3. Clear unnecessary configuration by deleting 'undeploy.json' files in the db folder.

4. Update the xs-security.json file in the root folder as below
```
{
  "scopes": [{
          "name": "$XSAPPNAME.view",
          "description": "view"
      },
      {
          "name": "$XSAPPNAME.create",
          "description": "create"
      }
  ],
  "attributes": [],
  "role-templates": [{
          "name": "TechedCAP-view",
          "description": "generated",
          "scope-references": [
              "$XSAPPNAME.view"
          ],
          "attribute-references": []
      },
      {
          "name": "TechedCAP-create",
          "description": "generated",
          "scope-references": [
              "$XSAPPNAME.create"
          ],
          "attribute-references": []
      },
      {
          "name": "Token_Exchange",
          "description": "UAA",
          "scope-references": [
            "uaa.user"
          ]
      }
  ]
}
```

5. When it comes to the srv layer, Currently we donot have an automated approach to convert the xsodata to odata v2/v4. So we have to manually write the service implementation. We have already written the CAP srv implementation for this demo application.
So delete the current srv folder and copy this [srv](../target_cap_app/srv/) folder to the root folder of the project.

6. When it comes to application layer, Major changes are not needed, we just need to update the routes according to the service defined to access the api endpoints. For example some of the changes in our case,
- `/country/country.xsjs` should be replaced by `/teched/createcountry` in app/resources/tiny-ui/Util.js file.
- `/user/xsodata/user.xsodata/Users` should be replaced by `/teched/Users` in app/resources/user-ui/view/usercrud.controller.js file.
Again we have already done the modifications for this demo application. So delete the current app folder and copy this [app](../target_cap_app/app/) folder to the root folder of the project.

7. Delete the .hdbtabledata and csv files if any in the db/src/data and db/src/data1 folders. We do not need them as it will already be deployed to the Source container and having them here might lead to duplicate entries during data migration.

## Exercise 3.4 - Deploy the CAP application
The last step of this exercise is to deploy the CAP application. This is an important steps as it creates empty tables in the HDI container which is required for the next exercise.

1. Build the Application with the below command
```
mbt build -p=cf
```

2. Navigate to the mta_archives directory
```
cd mta_archives
```

3. Deploy the CAP application
```
cf deploy <Generated MTAR>.mtar
```

## Summary

You've now successfully provided support for multiple containers and deployed the CAP application to Hana Cloud.

Continue to - [Exercise 4 - Manually migrate the Data from Source HDI Container to target HDI Container](../ex4/README.md)
