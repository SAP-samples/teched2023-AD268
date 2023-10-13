# Exercise 1 - Prepare Your Development Environment

In this exercise, we will guide you through the process of setting up a Cloud-based Full Stack application development environment using SAP's Business Application Studio and also connect to SAP BTP.

## Exercise 1.1 - Launch SAP Business Application Studio and Create a Dev Space

The First step in this exercise is to create a dev space.

1. Launch the [SAP Business Application Studio](https://ad268-b6cxf9xc.ap11cf.applicationstudio.cloud.sap/index.html).

2. Click on Create Dev Space.
<br>![](/exercises/ex1/images/CreateDev.png)

3. Enter the Dev Space name as AD268_(Group Number). For the kind of application, choose 'Full Stack Cloud Application' and, under Additional SAP Extensions, select 'SAP HANA Tools'.
<br>![](/exercises/ex1/images/BAS_1.png)

4. Wait until the Dev Space status changes to 'Running' and then click on the link to open it.
<br>![](/exercises/ex1/images/BAS_2.png)

## Exercise 1.2 - Clone the GitHub repository

Next step in the exercise is to clone the GitHub repository

1. Click on the Navigation Menu -> Terminal -> New Terminal to open a terminal.
<br>![](/exercises/ex1/images/New_Terminal.png)

2. Navigate to the 'projects' directory by running the below command in the terminal.
   ```
   cd projects

   ```

3. Clone the GitHub repository using the below command.
   ```
   git clone https://github.com/SAP-samples/teched2023-AD268.git

   ```

4. A prompt will be opened at the top to enter the user credentials. Enter the Git Username and Git Password.
<br>![](/exercises/ex1/images/git_1.png)

5. Save the credentials in the dev space for the future use.
<br>![](/exercises/ex1/images/git_2.png)

6. Open the Cloned Repository by clicking on the Navigation Menu -> File -> Open Folder.
<br>![](/exercises/ex1/images/Folder.png)

7. Select the path of the newly cloned repository.
<br>![](/exercises/ex1/images/Path.png)

## Exercise 1.3 - Login to Cloud Foundry

The last step of the tutorial is to Login to the Cloud Foundry Environment.

1. Click on the Navigation Menu -> Terminal -> New Terminal to open a new terminal.
<br>![](/exercises/ex1/images/New_Terminal.png)

2. Run the below command in the opened terminal
   ```
   cf login -a https://api.cf.ap11.hana.ondemand.com --origin tdct3ched1-platform
   ```

3. Enter the User Email and Password.

4. The Target Org will be automatically selected as `SAP-TechEd-2023_ad268-b6cxf9xc`. Select the Target Space created for the User.
<br>![](/exercises/ex1/images/CF_Login.png)

## Summary

You've now successfully set up your Full Stack application development environment.

Continue to - [Exercise 2 - Run the Migration Script to setup the CAP application](../ex2/README.md)

