# customer-to-customer

## Introduction

Customer-to-customer (C2C) transactions rely on a third party to facilitate transactions between a buyer and a seller. Payments are handled online and the seller will be responsible for faciltating shipping. Some examples of C2C transaction sites are eBay, Etsy, and Craigslist.

## Notes

- Reverted the ingress and skaffold version because expiration service was not connecting to NATS.
- In Docker Desktop, my resource configuration is:
  - CPUs: 4
  - Memory: 3.00 GB (Increasing this stopped an http client connection failure)
  - Swap: 1 GB

## Prerequisites

Have the following installed:

- Node.js
- Docker Desktop
  - Make sure to enable Kubernetes
- [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/deploy/)
  - Currently using the Docker Desktop steps. If you are using something different, you will have to look up the configuration.
- Skaffold

## How to Setup

Add the following to your `/etc/hosts/` file:

```
127.0.0.1 customertocustomer.dev
```

The following secrets need to be created to run the application. Follow the instructions below with your own values:

Create a jwt secret:

```
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<ENTER_VALUE_HERE>
```

Create a stripe secret: (You must have a stripe account. For development, make sure to be using the test key.)

```
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<ENTER_STRIPE_KEY>
```

In the client folder, create a `.env.local file` and fill in your publishable stripe key. It needs to be prefixed by `NEXT_PUBLIC` so that the browser can access it.

```
NEXT_PUBLIC_PUBLISHABLE_STRIPE_KEY=<YOUR_PUBLISHABLE_STRIPE_KEY>
```

## How to Run

Once you have gone through the prerequisites and setup, you can run the application with:

```
skaffold dev
```

In case of any cleanup failures when stopping the application, try executing the following:

```
skaffold delete
```

## Services

### Auth

The auth service is responsible for creating user accounts, logging in, and getting the current logged in user.

### Items

The items service is responsible for storing the created items by a user.

### Orders

The orders service is responsible for storing orders from customers.

### Expiration

The expiration service is responsible for expiring orders after a certain amount of time.

### Payments

The payments service is responsible for handling payment transactions through Stripe.

## Improvements

- Should implement some sort of database transaction in case of failure whenever adding or updating something from the database.
  - Mongoose has this, but requires may require a separate database for testing instead of the memory-server
- The minimal amount of data is being shared across services. If we want to future proof it, we would just send everything.
- Should implement user's own Stripe accounts using oauth.
  - A percentage can go to the app, and the rest goes to the user.
- UI Improvements:
  - Display if the user sold or bought the item
  - Have an amount info to sellers
  - Add images to items
- Put expired orders back up for sale
