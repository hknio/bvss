module.exports = class VulnerabilityBVSS {

  constructor(vuln) {
    this.score = 0
    this.bvss = "None"
    this.desc = vuln["desc"]
    this.base = vuln["base"]
    this.vector = vuln["vector"]
    this.complexity = vuln["complexity"]
    this.privileges = vuln["privileges"]
    this.ui = vuln["ui"]
    this.scope = vuln["scope"]
    this.conf_impact = vuln["conf_impact"]
    this.conf_weight = vuln["conf_weight"]
    this.integ_impact = vuln["integ_impact"]
    this.integ_weight = vuln["integ_weight"]
    this.avail_impact = vuln["avail_impact"]
    this.avail_weight = vuln["avail_weight"]
    this.Weight = {
      base: {
        S: 8,
        L: 6,
        N: 0
      },
      vector: {
        N: 1,
        P: 0.5,
        L: 0.55,
        A: 0.62
      },
      complexity: {
        H: 0.8,
        L: 1
      },
      privileges: {
        N: 1,
        L: 0.7,
        H: 0.3,
      },
      ui: {
        N: 1,
        R: 0.7
      },
      scope: {
        U: 1,
        C: 1.5
      },
      conf_impact: {
        N: 0,
        L: 0.3,
        M: 0.66,
        H: 1
      },
      integ_impact: {
        N: 0,
        L: 0.3,
        M: 0.66,
        H: 1
      },
      avail_impact: {
        N: 0,
        L: 0.3,
        M: 0.66,
        H: 1
      },
      conf_weight: {
        N: 0,
        L: 0.33,
        M: 0.66,
        H: 1
      },
      integ_weight: {
        N: 0,
        L: 0.33,
        M: 0.66,
        H: 1
      },
      avail_weight: {
        N: 0,
        L: 0.33,
        M: 0.66,
        H: 1
      }
    }
  }

  calcScore() {
    this.score = this.roundUp1(this.Weight.base[this.base] + (10 - this.Weight.base[this.base]) * this.Weight.vector[this.vector] * this.Weight.complexity[this.complexity] * this.Weight.privileges[this.privileges] * this.Weight.ui[this.ui] * this.Weight.scope[this.scope] * (1 - (1 - this.Weight.conf_impact[this.conf_impact] * this.Weight.conf_weight[this.conf_weight]) * (1 - this.Weight.integ_impact[this.integ_impact] * this.Weight.integ_weight[this.integ_weight]) * (1 - this.Weight.avail_impact[this.avail_impact] * this.Weight.avail_weight[this.avail_weight])));

    if (this.score > 10)
      this.score = 10

    return this.score
  }

  calcBvss() {
    if (this.score >= 9) {
      this.bvss = "Critical"
    } else if (this.score < 9 && this.score >= 7) {
      this.bvss = "High"
    } else if (this.score < 7 && this.score >= 4) {
      this.bvss = "Medium"
    } else if (this.score < 4 && this.score > 0) {
      this.bvss = "Low"
    } else {
      this.bvss = "None"
    }
    return this.bvss
  }

  roundUp1(d) {
    return Math.ceil(d * 10) / 10;
  };
}