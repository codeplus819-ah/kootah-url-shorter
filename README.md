# Kootah URL Shortener

A lightweight and self-hosted URL shortening service built with **Node.js, Express, and MySQL**.

Kootah provides a simple way to convert long URLs into short, easy-to-share addresses. The project is designed to be straightforward, lightweight, and easy to deploy on your own server.

## Features

* Simple URL shortening
* Self-hosted
* MySQL database support
* Base62-based short URL generation
* Automatically reuses an existing short URL when the same address has already been registered
* Lightweight backend with Express
* Configurable server port and database connection
* No external URL-shortening service required

## How It Works

Kootah stores the original URL in a MySQL database and assigns it a unique numeric ID.

That ID is then converted into a **Base62** string containing:

* `0-9`
* `A-Z`
* `a-z`

For example, a database ID can be converted into a short identifier such as:

```text
1
A
z
10
aZ
```

When someone visits the generated short URL, Kootah decodes the Base62 identifier, retrieves the corresponding original URL from the database, and redirects the visitor to it.

### Duplicate URLs

Kootah checks whether the submitted URL already exists in the database.

If it does, a new record is not created. Instead, Kootah returns the existing short identifier.

This prevents the database from storing multiple records for the exact same URL.

## Technology Stack

| Technology              | Purpose                     |
| ----------------------- | --------------------------- |
| Node.js                 | Runtime environment         |
| Express                 | HTTP server and routing     |
| MySQL                   | Persistent URL storage      |
| mysql2                  | MySQL client for Node.js    |
| Base62                  | Short identifier generation |
| HTML / CSS / JavaScript | Frontend                    |

## Requirements

Before installing Kootah, make sure the following are installed on your server or local machine:

* **Node.js 18 or newer**
* **npm**
* **MySQL 8.x** or a compatible MySQL server

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/codeplus819-ah/kootah-url-shorter.git
cd kootah-url-shorter
```

### 2. Install dependencies

Install the required Node.js packages:

```bash
npm install
```

The project dependencies include:

* `express`
* `mysql2`

The included `package-lock.json` is provided to keep dependency installation reproducible.

### 3. Create the MySQL database

Create a database for Kootah.

For example:

```sql
CREATE DATABASE kootah;
```

You can use any database name you want, but if you choose a different name, make sure to update `config.jsonc` accordingly.

### 4. Import `kootah.sql`

After creating the database, import the provided:

```text
kootah.sql
```

file into your MySQL database.

The SQL file creates the required `urls` table used by Kootah.

For example, using the MySQL command line:

```bash
mysql -u root -p kootah < kootah.sql
```

Alternatively, you can import `kootah.sql` using a database management tool such as phpMyAdmin.

> **Important:** `kootah.sql` contains the database structure required by the application. Make sure it is imported before starting the server.

### 5. Configure `config.jsonc`

Before running the application, open:

```text
config.jsonc
```

and modify it according to your environment.

Example configuration:

```json
{
  "port": 8080,
  "database": {
    "host": "localhost",
    "username": "root",
    "password": "",
    "dbname": "kootah",
    "port": 3306
  }
}
```

You should configure at least the following values according to your MySQL installation:

| Option              | Description                                 |
| ------------------- | ------------------------------------------- |
| `port`              | Port on which the Kootah server will listen |
| `database.host`     | MySQL server hostname or IP address         |
| `database.username` | MySQL username                              |
| `database.password` | MySQL password                              |
| `database.dbname`   | Name of the Kootah database                 |
| `database.port`     | MySQL server port                           |

For example, if your MySQL database is running on another server:

```json
{
  "port": 8080,
  "database": {
    "host": "192.168.1.100",
    "username": "kootah",
    "password": "your-password",
    "dbname": "kootah",
    "port": 3306
  }
}
```

**Do not use the example credentials in a production environment.**

### 6. Start the server

Run:

```bash
npm start
```

If everything is configured correctly, the server will start and listen on the configured port.

By default:

```text
http://localhost:8080
```

The server listens on:

```text
0.0.0.0
```

so it can also accept connections from other machines when the configured port is exposed through your firewall or hosting environment.

## Project Structure

```text
kootah-url-shorter/
│
├── public/
│   ├── index.html
│   └── ...
│
├── base62.js
├── config.jsonc
├── configLoader.js
├── db.js
├── kootah.sql
├── server.js
├── package.json
├── package-lock.json
├── LICENSE
└── README.md
```

### `server.js`

The main application server.

It is responsible for:

* Serving the frontend
* Receiving URLs
* Creating short identifiers
* Looking up stored URLs
* Redirecting visitors to the original URL

### `base62.js`

Contains the Base62 encoder and decoder used to convert database IDs into short URL identifiers and decode them back.

### `db.js`

Creates the MySQL connection pool using the settings provided in `config.jsonc`.

### `configLoader.js`

Loads the application's configuration from `config.jsonc`.

### `kootah.sql`

Contains the SQL schema required by Kootah, including the `urls` table.

### `public/`

Contains the frontend files served by Express.

## API

Kootah exposes a small HTTP API for creating short URLs.

### Create a Short URL

**Endpoint:**

```http
POST /api/add-address
```

**Request body:**

```json
{
  "address": "https://example.com/some/very/long/url"
}
```

**Example response:**

```json
{
  "status": "success",
  "shortAddress": "1"
}
```

The returned `shortAddress` can be appended to the Kootah server address:

```text
https://your-domain.com/1
```

### Redirect

Short URLs are handled using:

```http
GET /:short
```

For example:

```text
https://your-domain.com/1
```

Kootah decodes `1`, finds the corresponding URL in the database, and redirects the visitor to the original address.

If the identifier does not correspond to a stored URL, Kootah displays the application's undefined-page instead.

## Database Structure

Kootah currently uses a single table:

```text
urls
```

with the following structure:

| Column         | Type   | Description                  |
| -------------- | ------ | ---------------------------- |
| `id`           | `INT`  | Auto-incrementing identifier |
| `real_address` | `TEXT` | Original URL                 |

The `id` value is used as the source for generating the Base62 short identifier.

## Production Deployment

Kootah can be deployed on a VPS or any server capable of running Node.js and MySQL.

For a production deployment, you should additionally consider:

* Running the application behind a reverse proxy such as Nginx
* Enabling HTTPS
* Using a dedicated MySQL user instead of `root`
* Using a strong database password
* Restricting access to the MySQL server
* Configuring firewall rules appropriately
* Running the Node.js process with a process manager such as PM2
* Keeping your Node.js dependencies updated

Kootah itself is intentionally lightweight and does not require a large application stack.

## Development

To start the application:

```bash
npm start
```

The project also contains the following npm script:

```bash
npm test
```

which runs the server through `nodemon` for development.

## Limitations

Kootah is a relatively small URL-shortening project and is primarily intended as a learning and self-hosting project.

The current implementation does not attempt to provide the feature set of large-scale URL-shortening platforms.

For example, advanced features such as:

* User accounts
* URL expiration
* Custom aliases
* Analytics
* Click statistics
* Rate limiting
* Authentication
* Administrative dashboards
* Abuse detection

are not currently part of the core implementation.

These features can be added in future versions if needed.

## Security Considerations

If you deploy Kootah publicly, remember that a URL shortener is an internet-facing service.

Before using it in a production environment, consider implementing additional protections such as:

* Request rate limiting
* Input validation
* Abuse prevention
* Malicious URL detection
* Access controls for administrative functionality
* HTTPS
* Proper database permissions

The project should not be assumed to be production-hardened simply because it can be deployed successfully.

## License

Kootah URL Shortener is released under the **MIT License**.

See the [`LICENSE`](LICENSE) file for the complete license text.

## Author

Developed by **codeplus**.

GitHub:

https://github.com/codeplus819-ah

## Project

Kootah URL Shortener:

https://github.com/codeplus819-ah/kootah-url-shorter

---

Kootah is a small, self-hosted URL shortening service built to keep the architecture simple while providing a practical example of a Node.js application working with a relational database.
