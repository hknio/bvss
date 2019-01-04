module.exports = class VulnerabilityCVSS {

  constructor(vuln) {
    this.exp_coeficient = 8.22
    this.scope_coeficient = 1.08
    this.exp_score = 0
    this.sub_score_multiplier = 0
    this.score = 0
    this.cvss = "None"
    this.desc = vuln["desc"]
    this.vector = vuln["vector"]
    this.complexity = vuln["complexity"]
    this.privileges = vuln["privileges"]
    this.ui = vuln["ui"]
    this.scope = vuln["scope"]
    this.conf_weight = vuln["conf_weight"]
    this.integ_weight = vuln["integ_weight"]
    this.avail_weight = vuln["avail_weight"]
    this.Weight = {
      vector: {
        N: 0.85,
        A: 0.62,
        L: 0.55,
        P: 0.2
      },
      complexity: {
        H: 0.44,
        L: 0.77
      },
      privileges: {
        U: {
          N: 0.85,
          L: 0.62,
          H: 0.27
        }, // These values are used if Scope is Unchanged
        C: {
          N: 0.85,
          L: 0.68,
          H: 0.5
        }
      }, // These values are used if Scope is Changed
      ui: {
        N: 0.85,
        R: 0.62
      },
      scope: {
        U: 6.42,
        C: 7.52
      }, // Note: not defined as constants in specification
      conf_weight: {
        N: 0,
        L: 0.22,
        M: 0.22, // ALERT THERE IS NOT MEDIUM VALUE FOR IT
        H: 0.56
      },
      integ_weight: {
        N: 0,
        L: 0.22,
        M: 0.22, // ALERT THERE IS NOT MEDIUM VALUE FOR IT
        H: 0.56
      },
      avail_weight: {
        N: 0,
        L: 0.22,
        M: 0.22, // ALERT THERE IS NOT MEDIUM VALUE FOR IT
        H: 0.56
      }
    }
  }

  calcScore() {
    if (this.scope === 'U') {
      this.exp_score = this.exp_coeficient * this.Weight.vector[this.vector] * this.Weight.complexity[this.complexity] * this.Weight.privileges.U[this.privileges] * this.Weight.ui[this.ui];
    } else {
      this.exp_score = this.exp_coeficient * this.Weight.vector[this.vector] * this.Weight.complexity[this.complexity] * this.Weight.privileges.C[this.privileges] * this.Weight.ui[this.ui];
    }

    this.sub_score_multiplier = (1 - ((1 - this.Weight.conf_weight[this.conf_weight]) * (1 - this.Weight.integ_weight[this.integ_weight]) * (1 - this.Weight.avail_weight[this.avail_weight])));

    if (this.scope === 'U') {
      this.score = this.roundUp1(Math.min((this.exp_score + this.sub_score_multiplier), 10));
    } else {
      this.score = this.roundUp1(Math.min((this.exp_score + this.sub_score_multiplier) * this.scope_coeficient, 10));
    }
    // if (this.score > 10)
    //   this.score = 10
    //this.score = Math.round(this.score, 1)
    return this.score
  }

  calcCvss() {
    if (this.score >= 9) {
      this.cvss = "Critical"
    } else if (this.score < 9 && this.score >= 7) {
      this.cvss = "High"
    } else if (this.score < 7 && this.score >= 4) {
      this.cvss = "Medium"
    } else if (this.score === 0) {
      this.cvss = "None"
    } else {
      this.cvss = "Low"
    }
    return this.cvss
  }

  roundUp1(d) {
    return Math.ceil(d * 10) / 10;
  };

}