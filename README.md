# Digiteam

Digiteam is an attendance application along with daily reports for OPD workers in West Java


## Tech Stacks
- **TypeScript** - <https://www.typescriptlang.org/>
- **Node.js** - <http://nodejs.org/>
- **Nest Js** - <https://https://nestjs.com/>
- **Type ORM** - <https://typeorm.io/>
- **PostgreSQL** - <https://www.postgresql.org/>

## Quick Start

Clone the project:

```bash
$ git clone https://github.com/jabardigitalservice/groupware-whitelabel-api.git
$ cd groupware-whitelabel-api
$ cp .env.example .env
```


## Installing Dependencies

- With npm

  ```bash
  # Install node packages
  $ npm install
  ```

- With yarn

  ```bash
  # Install node packages
  $ yarn install
  ```


## Applying Migrations

Make sure there is already a PostgreSQL database created and the credetials are filled in the `.env` file


- Locally
  - With npm

    ```bash
    # apply migrations to database
    $ npm run migration:run

    # This command will execute down in the latest executed migration.
    $ npm run migration:revert
    ```
  - With yarn

    ```bash
    # apply migrations to database
    $ yarn migrate:run

    # This command will execute down in the latest executed migration.
    $ yarn migrate:revert
    ```
  - With make

    ```bash
    # apply migrations to database
    $ make migrate

    # This command will execute down in the latest executed migration.
    $ make rollback
    ```
- Locally with docker

    ```bash
    # apply migrations to database
    $ make docker-run-dev-migrate

    # This command will execute down in the latest executed migration.
    $ make docker-run-dev-rollback
    ```
 

## Applying Database Seeders

Make sure there is already a PostgreSQL database created, the credetials are filled in the `.env` file and all migrations already migrated

- Locally
  - With npm

    ```bash
    # seeding data to database
    $ npm run seed:run
    ```
  - With yarn

    ```bash
    # seeding data to database
    $ yarn seed:run
    ```
  - With make

    ```bash
    # seeding data to database
    $ make seed
    ```
 - Locally with docker

    ```bash
    # seeding data to database
    $ make docker-run-dev-seed
    ```

## How to Run

- Run locally
  - With npm

    ```bash
    $ npm run start:dev
    ```
    
  - With npm
    ```bash
    $ yarn start:dev
    ```

  - with make

    ```bash
    $ make dev
    ```

- Run locally with docker:

  ```bash
  # start
  $ make docker-run-dev

  # stop
  $ make docker-run-dev-stop
  ```

- Run on production with docker:

  ```bash
  # to start
  $ make docker-run

  # to stop
  $ make docker-stop
  ```


## How to Test

- Locally
  - with npm
    ```bash
    $ npm run test
    ```
  - with yarn
    ```bash
    $ yarn test
    ```

- Locally with docker

  ```bash
  $ make docker-run-dev-test
  ```


## Repo Structure

```
├── .github/          * all workflows github actions
  └── workflows/
├── docker/
├── src/
  └── authentication/ * authentication feature
  └── common          * extra classes/files that might commonly be used by other modules
  └── config/         * config like db, app, mail, etc.
  └── database/       * migrations, seeds, factory, etc.
  └── lang/           * messages in id, en, etc.
  └── middleware/     * request's middlewares
  └── models/         * where all the magics happen
    └── <module_name>
      └── dto/                        * folder for data to object
      └── entities/                   * entity
      └── interfaces/                 * interfaces
      └── <module_name>.controller    * handling incoming requests and returning response
      └── <module_name>.module        * organize the application structure
      └── <module_name>.repository    * communicate with database
      └── <module_name>.service       * all business logic
      └── <module_name>.service.spec  * remember to keep our code coverage high
  └── providers/      * conection between the app & the provider engine
  └── views/          * templating for email, pdf, etc
└── ...
```