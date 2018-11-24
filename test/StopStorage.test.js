const { StopStorage } = require('../StopStorage');
XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

test('Test StopStorage API', done => {
    jest.setTimeout(10000);
    ss = new StopStorage();
    ss.setStart(34.069872, -118.453163);
    ss.setDestination("{\"coordinates\": {\"latitude\":34.063596,\"longitude\":-118.444074}}");
    ss.addStop(["{\"coordinates\": {\"latitude\":34.069196,\"longitude\":-118.445722}}"]);
    ss.addStop(["{\"coordinates\": {\"latitude\":34.074550,\"longitude\":-118.438659}}"]);
    function callback(routes) {
        expect(routes[0].polyline).toEqual("mh}nEvi~qUoBlAGOQi@Ee@Bs@Ty@~AqD|AoBNWtBiGZi@l@k@Uy@M_A?sLAuG{B?ECkA@qCDs@AAS?A?AQSOABsC?c@]}@K[Mi@MKKKMIo@e@m@CAuA?qAM??UsA??sD?q@IMESAO?Cm@?o@aAMY?Mw@??Q?k@_@e@AgAE??S_@AA?CCEFGBKBMGGIIOEOIDWHQDe@FYBiBPWDBNv@MlBMd@Ij@Sj@k@r@{@pAi@n@Ol@Cx@@JDHML?DFhAAL@JBb@ZLTJ@LV@?PJ@TFRNRJHPDZBP@JDNHp@PvF~@n@Hz@BfFDp@PnAt@hAt@p@V~Ah@RLXX^l@Z^TL`AT`BXLBAD?Z`@lB`@jBD\\@nB@`E");
        expect(routes[1].time.text).toEqual("47 mins");
        done();
    }
    
    ss.getSuggestion(callback);
    expect(ss._start.getLatitude()).toEqual(34.069872);
    expect(ss._start.getLongitude()).toEqual(-118.453163);
    expect(ss._destination.getLatitude()).toEqual(34.063596);
    expect(ss._destination.getLongitude()).toEqual(-118.444074);
    
});
