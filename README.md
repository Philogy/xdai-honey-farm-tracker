# xDai HoneyFarm tracker

Allows you to get a summary of what share of farming pools you own and what
you're currently earning

## Installation
Once the repo is cloned run `npm install` to install all the dependencies. You
may also specify a default address for which to query data by creating a `.env`
file and adding the following line:
```
DEFAULT_ACCOUNT="<your address here>"
```
Obviously replace "\<your address here>" with the actual address you want as a
default.

## Usage

Using the default address (if configured):
```
node main.js
```

Using another address:
```
node main.js -a [account address]
```
OR
```
node main.js --account [account address]
```
