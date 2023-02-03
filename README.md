# donut-shop
Rusty Brown's Ring Donuts shop (vulnerable lab)

## Building

```
docker build . -t donut-shop
docker run --rm --name donut-shop -p 1337:3000 donut-shop
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
docker exec `docker ps -aqf "name=donut-shop"` /usr/src/app/exploit.sh
```

## Report

Visit `http://localhost:1337/report` for the write-up.
