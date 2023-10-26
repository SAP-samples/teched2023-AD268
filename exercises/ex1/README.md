# Exercise 1 - Prepare Your Development Environment

In this exercise, we will guide you through the process of setting up a Cloud-based Full Stack application development environment using SAP's Business Application Studio and also connect to SAP BTP.

## Exercise 1.1 - Launch SAP Business Application Studio and Create a Dev Space

The First step in this exercise is to create a dev space.

1. Launch the [SAP Business Application Studio](https://ad268-b6cxf9xc.ap11cf.applicationstudio.cloud.sap/index.html).

2. Select the link `tdct3ched1.accounts.ondemand.com` which is a Custom IDP.
<br>![](/exercises/ex1/images/IDP.png)

3. Enter the User name (e.g. AD268-001@education.cloud.sap) and Password. Click on Continue.
<br>![](/exercises/ex1/images/SignIn.png)

4. Click on Create Dev Space.
<br>![](/exercises/ex1/images/CreateDev.png)

5. Enter the Dev Space name as `AD268_(Group Number)`. For the kind of application, choose `Full Stack Cloud Application` and, under Additional SAP Extensions, select `SAP HANA Tools`.
<br>![](/exercises/ex1/images/BAS_1.png)

6. Wait until the Dev Space status changes to `Running` and then click on the link to open it.
<br>![](/exercises/ex1/images/BAS_2.png)

## Exercise 1.2 - Import the Project

Next step in the exercise is to Import the Project

1. Download the [teched2023-AD268.zip](/exercises/teched2023-AD268.zip) file.

2. In the Business application studio Dev space, Once the projects folder is opened, Click on Navigation Menu -> File -> Import Project.
<br>![](/exercises/ex1/images/Import.png)

3. Select the downloaded zip file. Once the zip file is imported, It will automatically be extracted in the Dev space.

4.  Click on the Navigation Menu -> File -> Open Folder.
<br>![](/exercises/ex1/images/Folder.png)

5. Enter the path of the `projects` folder (e.g. `/home/user/projects/`) and press Enter.
<br>![](/exercises/ex1/images/Path.png)


## Exercise 1.3 - Login to Cloud Foundry

The last step of the tutorial is to Login to the Cloud Foundry Environment.

1. Click on the Navigation Menu -> Terminal -> New Terminal to open a new terminal.
<br>![](/exercises/ex1/images/New_Terminal.png)

2. Run the below command in the opened terminal
   ```
   cf login -a https://api.cf.ap11.hana.ondemand.com --origin tdct3ched1-platform
   ```

3. Enter the User Email (e.g. AD268-001@education.cloud.sap) and Password.

4. The Target Org will be automatically selected as `SAP-TechEd-2023_ad268-b6cxf9xc`. Select the Target Space created for the User.
<br>![](/exercises/ex1/images/CF_Login.png)

## Summary

You've now successfully set up your Full Stack application development environment.

Continue to - [Exercise 2 - Run the Migration Script to setup the CAP application](../ex2/README.md)

