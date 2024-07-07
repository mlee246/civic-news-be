# Civic News

Civic News is an API built for the purpose of accessing application data programatically. The API mimic's a real world backend service, which will provide the information to the front end architecture.

#### https://be-nc-news-zmuo.onrender.com/api

The above link will take you to the hosted version (the landing page will provide you with all of the currently available endpoints).

## Installation

##### \*\* Before cloning please check you have the minimum versions of Node.js (v21.6.2) and Postgres (14.11).

### 1. Clone the project

```bash
git clone https://github.com/mlee246/civic-news-be.git
```

### 2. Create two new files; .env.development & .env.test; inside here please add the database names (as per .env-example).

```bash
echo > .env.development
```

```bash
echo > .env.test
```

### 3. Install dependencies.

```bash
npm install
```

```bash
npm install jest
```

```bash
npm install --save-dev jest-sorted
```

### 4. Initial setup.

```bash
#setup database;
npm run setup-dbs
```

```bash
#seed the database;
npm run seed
```

```bash
#run test suite;
npm test app.test.js
```
