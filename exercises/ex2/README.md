# Exercise 2 - Run the Migration Script to setup the CAP application

In this exercise, we will create a Cloud Application Programming (CAP) application and migrate the XSA content to it for SAP Hana Cloud support. 
SAP Hana Cloud is a modern database as a service (DBaaS) powering the next generation of intelligent data applications and analytics across all enterprise data.
CAP is a framework provided by SAP for building services and applications on SAP Business Technology Platform.

## Exercise 2.1 - Prepare the migration script

The First step of the exercise is to prepare the migration script by performing the necessary installations.

1. Click on the Navigation Menu -> Terminal -> New Terminal to open a terminal.
<br>![](/exercises/ex2/images/Terminal.png)

2. Install the cds formatter globally with the command
   ```
   npm i -g @sap/cds-lsp
   ```

3. Navigate to the 'migration-script' Directory under exercises.
<br>![](/exercises/ex2/images/migration.png)

4. Now that you're in the 'migration-script' directory, run the below command to install the necessary Node modules.
   ```
   npm install
   ```

## Exercise 2.2 - Run the Script and provide the parameters

The next step of the exercise is to execute the script and pass the necessary parameters

1. From the 'migration-script' directory, run the below command to execute the script
   ```
   npm run start
   ```

2. After running the script, you should be prompted to provide parameters. These parameters will be utilized to generate the target CAP application with modified content.
<br>![](/exercises/ex2/images/parameters.png)

## Summary

You've now successfully created a CAP application and migrated the XSA content to it for SAP Hana Cloud support. 

Continue to - [Exercise 3 - Modifications in the CAP Application and Multicontainer Support](../ex3/README.md)
