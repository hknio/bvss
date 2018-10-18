# Blockchain Vulnerability Scoring System

The Blockchain Vulnerability Scoring System (BVSS) is scoring system for all blockchain and crypto projects including blockchain platforms, smart contracts, DApps, hardware wallets, and etc.

## BVSS Principle

The BVSS formula was inspired by https://www.first.org/cvss/ . We introduce several changes:
1. We added a BVSS base score. If there is a chance that tokens, crypto, or fiat money can be stolen, the vulnerability is assessed as a high level threat and it's score should be more than 8 (High). If tokens, crypto, or fiat money can be blocked in contract - base score is 6.
2. We added a value parameter for violation of Confidentiality / Integrity / Availability - if the value parameter for any of them is high, it's violation can be assessed as a critical vulnerability.

List of parameters used in BVSS:
1. Base score
2. Attack vector
3. Attack complexity
4. Privileges required
5. User Interaction required
6. Scope
7. Confidentiality / Integrity / Availability Value
8. Confidentiality / Integrity / Availability Impact
Their values are evaluated as displayed on the picture below or in the `/docs/Parameter_Values.xlsx` file.
![](docs\Parameter_Values.jpg)

### The BVSS Formula

`bvss = Base – (10 - Base) * Vector * Complexity * Privileges * UI * Scope * [1 - (1 - CI * CV) * (1 - II * IV) * (1 - AI * AV)]`

where CI - Confidentiality Impact; CV - Confidentiality Value; II - Integrity Impact; IW - Integrity Value; AI - Availability Impact; AV - Availability Value
Value parameter for Confidentiality / Integrity / Availability is calculated via BVSS Questionnaire.

### The BVSS Score

The BVSS formula calculates score as integer. To transform it into a classic score use the next set of rules:
 - bvss > 9.0 => Vulnerability is Critical
 - bvss is in range 7.0 - 8.9 => Vulnerability is High
 - bvss is in range 4.0 - 6.9 => Vulnerability is Medium
 - bvss is in range 0.1 - 3.9 => Vulnerability is Low
 - bvss = 0 => Vulnerability is None (bad practice, has no impact etc.)

### The BVSS Questionnaire

The BVSS Questionnaire was developed in order to determine the business impact for the violation of Confidentiality / Integrity / Availability properties.  The Questionnaire is located in the `/docs/BVSS_Questionnaire.txt` folder. It allows you to determine maximum value for the violation of Confidentiality / Integrity / Availability.

### The BVSS Calculator

You can find the python calculator in the `bvss.py` file. A version of the BVSS calculator with UI will be released soon.

## CVSS Drawbacks

CVSS is not applicable for any non-web applications - some examples are presented below.

### Applicability for Smart Contracts

 The CVSS was designed for web applications and we have tested its applicability for smart contract vulnerabilities. We evaluated reentrancy and math overflow vulnerabilities via CVSS and both of them had the same vector string `https://www.first.org/cvss/calculator/3.0#CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:N` - High score. However, it should be assessed as Critical and the BVSS score for them is Critical.

In the CVSS the impact of violation of Confidentiality and Integrity is the same for any application. However, since a Confidentiality violation is impossible on a public blockchain, so these two properties can't possess the same value. In order to get a critical score, a vulnerability should have a high impact on at least 2 of CIA triad properties. We consider these vulnerabilities as critical so violation of any of the CIA triad properties can lead to a critical score.

### Applicability for Secondary Application

The CVSS score is not taking into account the business value of the application. If the secondary server gets hacked via RCE, it shouldn't be assessed as critical, but rather a high/medium vulnerability. There are also some bug bounty programs that limit the maximum impact to medium for some of domains. The BVSS formula takes into account value of the Confidentiality/Integrity/Availability violation.

### Applicability for Hardware Wallets

If we apply the CVSS score to any vulnerability related to extracting a private key of a hardware wallet - on average it will receive a 4.2 medium score, however, we consider it as High and the BVSS score will be High in this case.

## BVSS Examples

We have tested the Score only for ~20 different vulnerabilities - they can be fount in the `/test` folder. Please, contribute to tests - create a pull request to add them to the `/test/test_data.json` file.
