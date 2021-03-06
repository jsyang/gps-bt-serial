const SerialPort = require('serialport')

let lastRMC = '';
let lastGGA = '';

let RMC = {};
let GGA = {};

let dataRollingBuffer = '';

function parseRMC() {
    // https://www.trimble.com/OEM_ReceiverHelp/V4.44/en/NMEA-0183messages_RMC.html
    let [
            MSG_ID, TIME_HHMMSS_SSSS, STATUS, LAT_DD_MMMMMM, LAT_DIR, LON_DDD_MMMMMM, LON_DIR,
            GROUNDSPEED_KNOTS, TRACK_ANGLE_DEG, TIME_DDMMYY, MAG_VAR_DEG, CHECKSUM
        ] = lastRMC.split(',');

    const LAT = parseInt(LAT_DD_MMMMMM.substring(0, 2), 10) + parseFloat(LAT_DD_MMMMMM.substring(2)) / 60 + ' ' + LAT_DIR;
    const LON = parseInt(LON_DDD_MMMMMM.substring(0, 3), 10) + parseFloat(LON_DDD_MMMMMM.substring(3)) / 60 + ' ' + LON_DIR;

    return {
        LATLNG: LAT + ' ' + LON,
        MSG_ID, TIME_HHMMSS_SSSS, STATUS, LAT_DD_MMMMMM, LAT_DIR, LON_DDD_MMMMMM, LON_DIR,
        GROUNDSPEED_KNOTS, TRACK_ANGLE_DEG, TIME_DDMMYY, MAG_VAR_DEG, CHECKSUM
    };
}

function parseGGA() {
    // https://www.trimble.com/OEM_ReceiverHelp/V4.44/en/NMEA-0183messages_GGA.html
    let [
            MSG_ID, TIME_HHMMSS_SSSS, LAT_DD_MMMMMM, LAT_DIR, LON_DDD_MMMMMM, LON_DIR,
            GPS_QUALITY_INDICATOR, NUM_SV, HDOP, ORTHOMETRIC_HEIGHT, ORTHOMETRIC_HEIGHT_UNIT,
            GEOID_SEPARATION, GEOID_SEPARATION_UNIT, UNKNOWN1, CHECKSUM
        ] = lastGGA.split(',');

    const LAT = parseInt(LAT_DD_MMMMMM.substring(0, 2), 10) + parseFloat(LAT_DD_MMMMMM.substring(2)) / 60 + ' ' + LAT_DIR;
    const LON = parseInt(LON_DDD_MMMMMM.substring(0, 3), 10) + parseFloat(LON_DDD_MMMMMM.substring(3)) / 60 + ' ' + LON_DIR;

    return {
        LATLNG: LAT + ' ' + LON,
        MSG_ID, TIME_HHMMSS_SSSS, LAT_DD_MMMMMM, LAT_DIR, LON_DDD_MMMMMM, LON_DIR,
        GPS_QUALITY_INDICATOR, NUM_SV, HDOP, ORTHOMETRIC_HEIGHT, ORTHOMETRIC_HEIGHT_UNIT,
        GEOID_SEPARATION, GEOID_SEPARATION_UNIT, UNKNOWN1, CHECKSUM
    };
}

const RE_RMC  = /\$GPRMC[A-Z0-9.,*]+(\r\n)/g;
const RE_GGA  = /\$GPGGA[A-Z0-9.,*]+(\r\n)/g;
const RE_NONE = /\$(GPGSA|GPGSV)[A-Z0-9.,*]+(\r\n)/g;

SerialPort.list().then(async ports => {
    const port = ports.find(port => /gpscom/i.test(port.path));

    if (!port) {
        console.error('Bluetooth GPS Not found');
        process.exit(1);
    }


    const gpsTTY = new SerialPort(port.path);

    gpsTTY.on('open', () => {
        console.log('Opened ' + port.path);

        gpsTTY.on('data', data => {
            dataRollingBuffer += data;

            const newGGA = dataRollingBuffer.match(RE_GGA);
            if (newGGA) {
                lastGGA           = newGGA[0].trim();
                dataRollingBuffer = dataRollingBuffer.replaceAll(RE_GGA, '');
                GGA               = parseGGA();
            }

            const newRMC = dataRollingBuffer.match(RE_RMC);
            if (newRMC) {
                lastRMC           = newRMC[0].trim();
                dataRollingBuffer = dataRollingBuffer.replaceAll(RE_RMC, '');
                RMC               = parseRMC();
            }

            dataRollingBuffer = dataRollingBuffer.replaceAll(RE_NONE, '');

            console.log(RMC, GGA);
        });
    })
});
