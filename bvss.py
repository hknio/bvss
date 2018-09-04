# Critical  > 9.0
# High      7.0 - 8.9
# Medium    4.0 - 6.9
# Low       0.1 - 3.9
# None      0

"""

Base:
 - 8, if tokens, crypto can be lost, blocked etc.
 - 0, else

Vector:
 - Network - 1
 - Physical - 0.5

Complexity:
 - Low - 1
 - High - 0.8

Privileges:
 - None - 1
 - Required - 0.7

User Interaction:
 - None - 1
 - Required - 0.7

Scope:
 - Changed - 1.5
 - Unchanged - 1

Confidentiality / Integrity / Availability
 - Weight:
    - High - 1
    - Medium - 0.66
    - Low - 0.3
    - None - 0
 - Impact:
    - High - 1
    - Medium - 0.66
    - Low - 0.33

"""

import json

class Vuln():

    def __init__(self, vuln):
        self.score = 0
        self.bvss = "None"
        self.desc = vuln["desc"]
        self.base = vuln["base"]                    # if tokens can be lost - base = 8, else base = 0
        self.vector = vuln["vector"]
        self.complexity = vuln["complexity"]
        self.privileges = vuln["privileges"]
        self.ui = vuln["ui"]                        # user interaction
        self.scope = vuln["scope"]
        self.conf_impact = vuln["conf_impact"]      # conf = confidentiality
        self.conf_weight = vuln["conf_weight"]      # conf = confidentiality
        self.integ_impact = vuln["integ_impact"]    # integ = integrity
        self.integ_weight = vuln["integ_weight"]    # integ = integrity
        self.avail_impact = vuln["avail_impact"]     # avail = availability
        self.avail_weight = vuln["avail_weight"]     # avail = availability

    def calc_score(self):
        self.score = self.base + (10 - self.base) * self.vector * self.complexity * self.privileges * self.ui * self.scope * \
                    (1 - (1 - self.conf_impact * self.conf_weight) * (1 - self.integ_impact * self.integ_weight) * (1 - self.avail_impact * self.avail_weight))
        if self.score > 10:
            self.score = 10
        self.score = round(self.score, 1)
        return self.score

    def calc_bvss(self):
        if self.score >= 9:
            self.bvss = "Critical"
        elif self.score < 9 and self.score >= 7:
            self.bvss = "High"
        elif self.score < 7 and self.score >= 4:
            self.bvss = "Medium"
        elif self.score < 4 and self.score >= 0.1:
            self.bvss = "Low"
        return self.bvss

with open('tests/test_data.json') as f:
    vulns = json.load(f)

for vuln in vulns:
    item = Vuln(vuln)
    print("Desc: {}\nScore: {}\nBVSS: {}\n".format(item.desc, item.calc_score(), item.calc_bvss()))
