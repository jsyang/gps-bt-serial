# GPS Bluetooth Serial Port Parser

Run with `yarn ; node .`

Change the `gpscom` value with the TTY file that represents your Bluetooth GPS receiver's serial data stream device file.

Then once connected and the GPS fix has been acquired you'll get data like this:

```json
{
  LATLNG: '50.42362 N 1.2477033333333334 E',
  MSG_ID: '$GPRMC',
  TIME_HHMMSS_SSSS: '020931.000',
  STATUS: 'A',
  LAT_DD_MMMMMM: '5325.4172',
  LAT_DIR: 'N',
  LON_DDD_MMMMMM: '00214.8622',
  LON_DIR: 'W',
  GROUNDSPEED_KNOTS: '0.57',
  TRACK_ANGLE_DEG: '196.45',
  TIME_DDMMYY: '060321',
  MAG_VAR_DEG: '',
  CHECKSUM: '*1B'
} 

{
  LATLNG: '50.42362 N 1.2477033333333334 E',
  MSG_ID: '$GPGGA',
  TIME_HHMMSS_SSSS: '020931.000',
  LAT_DD_MMMMMM: '5325.4172',
  LAT_DIR: 'N',
  LON_DDD_MMMMMM: '00214.8622',
  LON_DIR: 'W',
  GPS_QUALITY_INDICATOR: '1',
  NUM_SV: '08',
  HDOP: '1.1',
  ORTHOMETRIC_HEIGHT: '61.7',
  ORTHOMETRIC_HEIGHT_UNIT: 'M',
  GEOID_SEPARATION: '48.5',
  GEOID_SEPARATION_UNIT: 'M',
  UNKNOWN1: '',
  CHECKSUM: '0000*7E'
}
```
