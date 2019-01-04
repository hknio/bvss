function delegatedEvent(eventName, targetClass, callback) {
  document.addEventListener(eventName, function (e) {
    if (e.target.classList.contains(targetClass)) {
      callback(e);
    };
  })
}

function selectArr(collection, callback) {
  Array.from(collection).forEach(callback);
}

function getChildren(n, skipMe) {
  var r = [];
  for (; n; n = n.nextSibling)
    if (n.nodeType == 1 && n != skipMe)
      r.push(n);
  return r;
};

function getSiblings(n) {
  return getChildren(n.parentNode.firstChild, n);
}

function initSeverityCalculatorBVSS() {
  var sortedLabels = [
    'B',
    'AV',
    'AC',
    'PR',
    'UI',
    'S',
    'C',
    'I',
    'A',
    'CI',
    'II',
    'AI'
  ]
  const scoreContainer = document.querySelector('.js-c-score-bvss');
  const vectorInput = document.querySelector('.js-input-vector-bvss');
  const bvssVector = document.querySelector('.bvss-vector');

  function setScoreContainerClass(cssClass) {
    scoreContainer.classList.remove('none', 'low', 'medium', 'high', 'critical');
    scoreContainer.classList.add(cssClass.toLowerCase());
  }

  function calcVector() {
    var hash = {};
    document.querySelectorAll('.js-sev-block-bvss').forEach(function (el) {
      var label = el.querySelector('.js-label-bvss').dataset['label'];

      var activeBtn = el.querySelector('.js-c-btn-bvss.active');
      var value = activeBtn && activeBtn.dataset['value'];

      hash[label] = value;
    })

    return 'BVSS:1.1/' + sortedLabels.map(function (label) {
      return label + ':' + hash[label];
    }).join('/');
  }

  function outputBVSS() {
    var vector = calcVector();
    var result = BVSS.calculateCVSSFromVector(vector);
    var str;
    if (vectorInput) {
      if (result.success) {
        str = result.baseSeverity + ' (' + result.baseMetricScore + ')';
        setScoreContainerClass(result.baseSeverity);
        vectorInput.value = vector;
        bvssVector.innerHTML = vector;
      } else {
        str = 'None';
        vectorInput.value = '';
        setScoreContainerClass('none');
      }
      scoreContainer.innerHTML = str;
    }
  }

  function outputSimple(value) {
    if (scoreContainer) {
      scoreContainer.innerHTML = '';
      var marks = {
        N: 0.0,
        L: 3.9,
        M: 6.9,
        H: 8.9,
        C: 10.0
      }
      var score = marks[value].toFixed(1);
      var vector = 'SIMPLE:' + value;
      var rating = BVSS.severityRating(score);
      var str = rating + ' (' + score + ')';
      scoreContainer.innerHTML = str;
      setScoreContainerClass(rating);
      vectorInput.value = vector;
    }
  }
  delegatedEvent('click', 'js-c-btn-bvss', function (e) {
    e.preventDefault();
    var btn = e.target;
    btn.classList.add('active');
    getSiblings(btn).forEach(function (el) {
      el.classList.remove('active')
    });
    selectArr(document.querySelectorAll('.js-s-btn-bvss'), function (el) {
      el.classList.remove('active')
    });
    selectArr(document.querySelectorAll('.js-s-score'), function (el) {
      el.innerHTML = ''
    });

    outputBVSS();
  })

  delegatedEvent('click', 'js-s-btn-bvss', function (e) {
    e.preventDefault();
    var btn = e.target;
    btn.classList.add('active');
    getSiblings(btn).forEach(function (el) {
      el.classList.remove('active')
    });
    selectArr(document.querySelectorAll('.js-c-btn-bvss'), function (el) {
      el.classList.remove('active')
    });

    outputSimple(btn.dataset.label);
  })

  function parseVector() {
    var commonEl = document.querySelector('.severity-common');
    var calcEl = document.querySelector('.severity-calc');

    var vector = vectorInput.value;
    var split = vector.split('/');
    if (split[0] == 'BVSS:1.1') {
      var bvss = split.splice(1, split.length);
      var values = [];
      bvss.forEach(function (el) {
        var value = el.split(':')[1];
        values.push(value);
      });

      for (var i = 0; i < sortedLabels.length; i++) {
        label = sortedLabels[i];
        value = values[i];

        labelEl = calcEl.querySelector('[data-label=' + label + ']');
        var btnEl = labelEl.closest('.js-sev-block').querySelectorAll('.js-c-btn-bvss');

        btnEl.forEach(function (btn) {
          if (btn.dataset['value'] == value) {
            btn.classList.add('active');
          }
        });
      }

      outputBVSS();

    } else {
      var common = split[0].split(':')[1];
      btnSimpleEl = commonEl.querySelector('[data-label=' + common + ']').classList.add('active');

      outputSimple(common);
    }
  }

  if (vectorInput && vectorInput.value) {
    parseVector();
  }

  outputBVSS();
}

document.addEventListener("DOMContentLoaded", function (event) {
  initSeverityCalculatorBVSS();
});



















function initSeverityCalculator() {
  var sortedLabels = [
    'AV',
    'AC',
    'PR',
    'UI',
    'S',
    'C',
    'I',
    'A'
  ]
  const scoreContainer = document.querySelector('.js-c-score');
  const vectorInput = document.querySelector('.js-input-vector');
  const cvssVector = document.querySelector('.cvss-vector');

  function setScoreContainerClass(cssClass) {
    scoreContainer.classList.remove('none', 'low', 'medium', 'high', 'critical');
    scoreContainer.classList.add(cssClass.toLowerCase());
  }

  function calcVector() {
    var hash = {};
    document.querySelectorAll('.js-sev-block').forEach(function (el) {
      var label = el.querySelector('.js-label').dataset['label'];

      var activeBtn = el.querySelector('.js-c-btn.active');
      var value = activeBtn && activeBtn.dataset['value'];

      hash[label] = value;
    })

    return 'CVSS:3.0/' + sortedLabels.map(function (label) {
      return label + ':' + hash[label];
    }).join('/');
  }

  function outputCVSS() {
    var vector = calcVector();
    var result = CVSS.calculateCVSSFromVector(vector);

    var str;
    if (vectorInput) {
      if (result.success) {
        str = result.baseSeverity + ' (' + result.baseMetricScore + ')';
        setScoreContainerClass(result.baseSeverity);
        vectorInput.value = vector;
        cvssVector.innerHTML = vector;
      } else {
        str = 'None';
        vectorInput.value = '';
        setScoreContainerClass('none');
      }
      scoreContainer.innerHTML = str;
    }
  }

  function outputSimple(value) {
    if (scoreContainer) {
      scoreContainer.innerHTML = '';
      var marks = {
        N: 0.0,
        L: 3.9,
        M: 6.9,
        H: 8.9,
        C: 10.0
      }
      var score = marks[value].toFixed(1);
      var vector = 'SIMPLE:' + value;
      var rating = CVSS.severityRating(score);
      var str = rating + ' (' + score + ')';
      scoreContainer.innerHTML = str;
      setScoreContainerClass(rating);
      vectorInput.value = vector;
    }
  }
  delegatedEvent('click', 'js-c-btn', function (e) {
    e.preventDefault();
    var btn = e.target;
    btn.classList.add('active');
    getSiblings(btn).forEach(function (el) {
      el.classList.remove('active')
    });
    selectArr(document.querySelectorAll('.js-s-btn'), function (el) {
      el.classList.remove('active')
    });
    selectArr(document.querySelectorAll('.js-s-score'), function (el) {
      el.innerHTML = ''
    });

    outputCVSS();
  })

  delegatedEvent('click', 'js-s-btn', function (e) {
    e.preventDefault();
    var btn = e.target;
    btn.classList.add('active');
    getSiblings(btn).forEach(function (el) {
      el.classList.remove('active')
    });
    selectArr(document.querySelectorAll('.js-c-btn'), function (el) {
      el.classList.remove('active')
    });

    outputSimple(btn.dataset.label);
  })

  function parseVector() {
    var commonEl = document.querySelector('.severity-common');
    var calcEl = document.querySelector('.severity-calc');

    var vector = vectorInput.value;
    var split = vector.split('/');
    if (split[0] == 'CVSS:3.0') {
      var cvss = split.splice(1, split.length);
      var values = [];
      cvss.forEach(function (el) {
        var value = el.split(':')[1];
        values.push(value);
      });

      for (var i = 0; i < sortedLabels.length; i++) {
        label = sortedLabels[i];
        value = values[i];

        labelEl = calcEl.querySelector('[data-label=' + label + ']');
        var btnEl = labelEl.closest('.js-sev-block').querySelectorAll('.js-c-btn');

        btnEl.forEach(function (btn) {
          if (btn.dataset['value'] == value) {
            btn.classList.add('active');
          }
        });
      }

      outputCVSS();

    } else {
      var common = split[0].split(':')[1];
      btnSimpleEl = commonEl.querySelector('[data-label=' + common + ']').classList.add('active');

      outputSimple(common);
    }
  }

  if (vectorInput && vectorInput.value) {
    parseVector();
  }

  outputCVSS();
}
document.addEventListener("DOMContentLoaded", function (event) {
  initSeverityCalculator();
});