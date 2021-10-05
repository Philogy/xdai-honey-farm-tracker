# xDai HoneyFarm tracker

Allows you to get a summary of what share of farming pools you own and what
you're currently earning

## Purpose
Gives you the following summary for your address:
```
>> node main.js -a 0xB5d732D7D494D915BC4EdCd8B64Db756d2C91CFC

account:  0xB5d732D7D494D915BC4EdCd8B64Db756d2C91CFC
owns 3 deposits across 3 pools
total pending xCOMB: 3.080978582554970619

Pool breakdown (Pool share, daily earnings):
0x50A4867AEe9cafd6dDC84de3CE59dF027Cb29084: 0.466664% (xCOMB / day = 0.558189840975670104)
0xb3011007ebBb56C791eAEbF87Fe035190b8dbE62: 0.27153% (xCOMB / day = 0.216522881014536796)
0x9e8E5e4a0900fE4634c02AAf0f130cfB93c53fBc: 0.023071% (xCOMB / day = 0.183977746558176979)

Total daily yield (next 24h): 0.958690468548383879 xCOMB / day

```

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
