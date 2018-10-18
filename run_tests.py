import json
from bvss import Vuln

tests = {'web': 'tests/web.json',
         'smart conract': 'tests/smart_contract.json',
         'blockchain': 'tests/blockchain.json',
         'hardware': 'tests/hardware.json'}
for key in tests:
    print('------------------------{}------------------------'.format(key))
    with open(tests[key]) as f:
        vulns = json.load(f)

    for vuln in vulns:
        item = Vuln(vuln)
        print("Desc: {}\nScore: {}\nBVSS: {}\n".format(item.desc, item.calc_score(), item.calc_bvss()))
