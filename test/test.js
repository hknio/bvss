const VulnerabilityBVSS = require('./VulnBVSS.js');
const VulnerabilityCVSS = require('./VulnCVSS.js');
const SCjsonData = require('./json/sc.json');
const WEBjsonData = require('./json/web.json');
const HjsonData = require('./json/hardware.json');
const BLjsonData = require('./json/blckchn.json');

const arr = [];
const ALL_TESTCASES = {
  web_key: WEBjsonData,
  sc_key: SCjsonData,
  bl_key: BLjsonData,
  hardware_key: HjsonData
};

for (let testcase in ALL_TESTCASES) {
  arr.push(ALL_TESTCASES[testcase]); // [ {web}, {sc} ]
}

arr.forEach(app_type => { // {web}
  console.log(`--------------- NEXT TYPE --------------- \n`);

  app_type.forEach(vuln => { // {vuln = 'Reflected XSS for Primary product'}
    let entityBVSS = new VulnerabilityBVSS(vuln);
    let entityCVSS = new VulnerabilityCVSS(vuln);

    console.log(`Description: ${entityBVSS.desc}\nScore: ${entityBVSS.calcScore()}\nBVSS: ${entityBVSS.calcBvss()}`);
    console.log(`Score: ${entityCVSS.calcScore()}\nCVSS: ${entityCVSS.calcCvss()}\n`);
  });
});