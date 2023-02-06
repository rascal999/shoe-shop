# shoe-shop
Rusty Brown's Shoe Shop (vulnerable lab)

## Building

```
docker build . -t shoe-shop
docker run -d --rm --name shoe-shop -p 1337:3000 shoe-shop
```

## Viewing

Visit http://localhost:1337/

Valid credentials are:

```
user1@example.com / user1
user2@example.com / user2
user3@example.com / user3
user4@example.com / user4
user5@example.com / user5
```

## Exploiting

Run the following command to execute the `exploit.sh` script in the container:

```
docker exec `docker ps -aqf "name=shoe-shop"` /usr/src/app/exploit.sh
```

## Report

Visit http://localhost:1337/report for the write-up or check out the PDF.
