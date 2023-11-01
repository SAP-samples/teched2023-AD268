[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/teched2023-AD268)](https://api.reuse.software/info/github.com/SAP-samples/teched2023-AD268)

# AD268 - Application Migration to SAP Cloud Application Programming Model

## Description

This repository contains the material for the SAP TechEd 2023 session called AD268 - Application Migration to SAP Cloud Application Programming Model.


## Overview

In this session we learn about the migration of apps based on SAP HANA extended application services to SAP Cloud Application Programming Model and SAP HANA Cloud as a database. Get hands-on experience on how an existing extended application services–based application can be migrated to SAP Business Technology Platform using SAP Cloud Application Programming Model. Learn in-detail about how to migrate all artifacts of extended application services–based applications to SAP Cloud Application Programming Model.

## Requirements

The requirements to follow the exercises in this repository are
- Basic knowledge of [SAP BTP Cockpit](https://help.sap.com/docs/btp?locale=en-US).
- Basic knowledge of [SAP XSA framework](https://help.sap.com/docs/SAP_HANA_PLATFORM/4505d0bdaf4948449b7f7379d24d0f0d/df19a03dc07e4ba19db4e0006c1da429.html).
- Basic knowledge of [SAP CAP framework](https://cap.cloud.sap/docs/).
- Basic knowledge of [SQL](https://help.sap.com/docs/SAP_HANA_PLATFORM/4fe29514fd584807ac9f2a04f6754767/20ff532c751910148657c32fe3431a9f.html) and [Hana Database](https://help.sap.com/docs/SAP_HANA_PLATFORM?locale=en-US).

## Exercises

- [Getting Started](exercises/ex0/)
- [Exercise 1 - Prepare Your Development Environment](exercises/ex1/)
    - [Exercise 1.1 - Launch SAP Business Application Studio and Create a Dev Space](exercises/ex1#exercise-11---launch-sap-business-application-studio-and-create-a-dev-space)
    - [Exercise 1.2 - Import the Project](exercises/ex1#exercise-12---import-the-project)
    - [Exercise 1.3 - Login to Cloud Foundry](exercises/ex1#exercise-13---login-to-cloud-foundry)
- [Exercise 2 - Run the Migration Script to setup the CAP application](exercises/ex2/)
    - [Exercise 2.1 - Prepare the migration script](exercises/ex2#exercise-21---prepare-the-migration-script)
    - [Exercise 2.2 - Run the Script and provide the parameters](exercises/ex2#exercise-22---run-the-script-and-provide-the-parameters)
- [Exercise 3 - Modifications in the CAP Application and Multicontainer Support](exercises/ex3/)
    - [Exercise 3.1 - Create and Expose Facade Entities](exercises/ex3#exercise-31---create-and-expose-facade-entities)
    - [Exercise 3.2 - Establish a link between the HDI containers](exercises/ex3#exercise-32---establish-a-link-between-the-hdi-containers)
    - [Exercise 3.3 - Prepare the CAP application for deployment](exercises/ex3#exercise-33---prepare-the-cap-application-for-deployment)
    - [Exercise 3.4 - Deploy the CAP application](exercises/ex3#exercise-34---deploy-the-cap-application)
- [Exercise 4 - Manually migrate the Data from Source HDI Container to target HDI Container](exercises/ex4/)
    - [Exercise 4.1 - Add the Databases and HDI containers in the Database Explorer](exercises/ex4#exercise-41---add-the-databases-and-hdi-containers-in-the-database-explorer)
    - [Exercise 4.2 - Run the SQL commands](exercises/ex4#exercise-42---run-the-sql-commands)
    - [Exercise 4.3 - Add the Role collection and Test the CAP application (Optional)](exercises/ex4#exercise-43---add-the-role-collection-and-test-the-cap-application-optional)
- [Exercise 5 - Perform the Clean Up Operations](exercises/ex5/)
    - [Exercise 5.1 - Clean Up in Database Explorer](exercises/ex5#exercise-51---clean-up-in-database-explorer)
    - [Exercise 5.2 - Clean Up in Business Application Studio](exercises/ex5#exercise-52---clean-up-in-business-application-studio)
    - [Exercise 5.3 - Clean Up in SAP BTP Subaccount Cockpit (Optional)](exercises/ex5#exercise-53---clean-up-in-sap-btp-subaccount-cockpit-optional)

## Contributing
Please read the [CONTRIBUTING.md](./CONTRIBUTING.md) to understand the contribution guidelines.

## Code of Conduct
Please read the [SAP Open Source Code of Conduct](https://github.com/SAP-samples/.github/blob/main/CODE_OF_CONDUCT.md).

## How to obtain support

Support for the content in this repository is available during the actual time of the online session for which this content has been designed. Otherwise, you may request support via the [Issues](../../issues) tab.

## License
Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSES/Apache-2.0.txt) file.
