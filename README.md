# Blockchain Vulnerability Scoring System

The Blockchain Vulnerability Scoring System (BVSS) is scoring system for all blockchain and crypto projects including blockchain platforms, smart contracts, DApps, hardware wallets, and etc.

## Calculator
[Link to BVSS and CVSS calculator](https://foresterfromua.github.io/bvss-calc/src/index.html)

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

The BVSS Questionnaire was developed in order to determine the business impact for the violation of Confidentiality / Integrity / Availability properties. The Questionnaire is located in the `/docs/BVSS_Questionnaire.txt` folder. It allows you to determine maximum value for the violation of Confidentiality / Integrity / Availability.

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

## List of parameters used in BVSS:

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

## BVSS Examples

We have tested the Score only for ~20 different vulnerabilities - they can be fount in the `/test` folder. Please, contribute to tests - create a pull request to add them to the `/test/test_data.json` file.

## BVSS parameters in depth:

1. Base score - this metric measures the impact of tokens/crypto loss.

- S - if crypto/tokens could be stollen;
- L - if crypto/tokens could be lost;
- N - none

2. Attack vector - this metric reflects the context by which vulnerability exploitation is possible. The Score increases the more remote an attacker can be in order to exploit the vulnerable component.

- N - Network: A vulnerability exploitable with network access means the vulnerable component is bound to the network stack and the attacker's path is through OSI layer 3 (the network layer). Such a vulnerability is often termed "remotely exploitable" and can be thought of as an attack being exploitable one or more network hops away.
- P - Physical: A vulnerability exploitable with physical access requires the attacker to physically touch or manipulate the vulnerable component. Physical interaction may be brief or persistent.

3. Attack complexity - this metric describes the conditions beyond the attacker's control that must exist in order to exploit the vulnerability. Such conditions may require the collection of more information about the target, the presence of certain system configuration settings, or computational exceptions.

- H - High: A successful attack depends on conditions beyond the attacker's control. That is, a successful attack cannot be accomplished at will, but requires the attacker to invest in some measurable amount of effort in preparation or execution against the vulnerable component before a successful attack can be expected. For example, a successful attack may require the attacker: to perform target-specific reconnaissance; to prepare the target environment to improve exploit reliability; or to inject herself into the logical network path between the target and the resource requested by the victim in order to read and/or modify network communications.
- L - Low: Specialized access conditions or extenuating circumstances do not exist. An attacker can expect repeatable success against the vulnerable component.

4. Privileges required - this metric describes the level of privileges an attacker must possess before successfully exploiting the vulnerability. This Score increases as fewer privileges are required.

- N - None: The attacker is unauthorized prior to attack, and therefore does not require any access to settings or files to carry out an attack.
- R - Required: The attacker is authorized with (i.e. requires) privileges that provide user capabilities that could normally affect component-wide settings.

5. User Interaction required - this metric captures the requirement for a user, other than the attacker, to participate in the successful compromise the vulnerable component. This metric determines whether the vulnerability can be exploited solely at the will of the attacker, or whether a separate user (or user-initiated process) must participate in some manner. The Score is highest when no user interaction is required.

- N - None: The vulnerable system can be exploited without any interaction from any user.
- R - Required: Successful exploitation of this vulnerability requires a user to take some action before the vulnerability can be exploited.

6. Scope - this metric shows whether a successful attack impact a component other than the vulnerable component? If so, the Score increases and the Confidentiality, Integrity and Authentication metrics should be scored relative to the impacted component.

- U - Unchanged: An exploited vulnerability can only affect resources managed by the same authority. In this case the vulnerable component and the impacted component are the same.
- C - Changed: An exploited vulnerability can affect resources beyond the authorization privileges intended by the vulnerable component. In this case the vulnerable component and the impacted component are different.

7. Confidentiality Impact - this metric measures the impact to the confidentiality of the information resources managed by a software component due to a successfully exploited vulnerability. Confidentiality refers to limiting information access and disclosure to only authorized users, as well as preventing access by, or disclosure to, unauthorized ones.

- N - None: There is not any confidentiality impact on application.
- L - Low: There is some loss of confidentiality. Access to some restricted information is obtained, but the attacker does not have control over what information is obtained, or the amount or kind of loss is constrained. The information disclosure does not cause a direct, serious loss to the impacted component.
- M - Medium: Most of the confidentiality is compromised. Attacker has access to the most of the resources. The disclosed information presents impact.
- H - High: There is total loss of confidentiality, resulting in all resources within the impacted component being divulged to the attacker. Alternatively, access to only some restricted information is obtained, but the disclosed information presents a direct, serious impact.

8. Integrity Impact - this metric measures the impact to integrity of a successfully exploited vulnerability. Integrity refers to the trustworthiness and veracity of information.

- N - None: There is not any integrity impact on application.
- L - Low: Modification of data is possible, but the attacker does not have control over the consequence of a modification, or the amount of modification is constrained. The data modification does not have a direct, serious impact on the impacted component.
- M - Medium: Most of the confidentiality is compromised. Attacker has access to the most of the resources. The disclosed information presents impact.
- H - High: There is a total loss of integrity, or a complete loss of protection. For example, the attacker is able to modify any/all files protected by the impacted component.

9. Availability Impact - this metric measures the impact to the availability of the impacted component resulting from a successfully exploited vulnerability. It refers to the loss of availability of the impacted component itself, such as a networked service (e.g., web, database, email). Since availability refers to the accessibility of information resources, attacks that consume network bandwidth, processor cycles, or disk space all impact the availability of an impacted component.

- N - None: There is not any availability impact on application.
- L - Low: There is low reduced performance or interruptions in resource availability. Even if repeated exploitation of the vulnerability is possible, the attacker does not have the ability to completely deny service to legitimate users. The resources in the impacted component are either partially available all of the time, or fully available only some of the time, but overall there is no direct, serious consequence to the impacted component.
- M - Medium: There is reduced performance of resource availability.
- H - High: There is total loss of availability, resulting in the attacker being able to fully deny access to resources in the impacted component; this loss is either sustained (while the attacker continues to deliver the attack) or persistent (the condition persists even after the attack has completed). Alternatively, the attacker has the ability to deny some availability, but the loss of availability presents a direct, serious consequence to the impacted component (e.g., the attacker cannot disrupt existing connections, but can prevent new connections; the attacker can repeatedly exploit a vulnerability that, in each instance of a successful attack, leaks a only small amount of memory, but after repeated exploitation causes a service to become completely unavailable).

10. Confidentiality Value - this metric shows the value of confidentiality for specific application.

- N - None: Confidentiality doesnt have any value for this application.
- L - Low: Condfidentiality has low value for this application.
- M - Medium: Condfidentiality has medium value for this application.
- H - High: Condfidentiality has high value for this application.

11. Integrity Value - this metric shows the value of integrity for specific application.

- N - None: Integrity doesnt have any value for this application.
- L - Low: Integrity has low value for this application.
- M - Medium: Integrity has medium value for this application.
- H - High: Integrity has high value for this application.

12. Availability Value - this metric shows the value of availability for specific application.

- N - None: Availability doesnt have any value for this application.
- L - Low: Availability has low value for this application.
- M - Medium: Availability has medium value for this application.
- H - High: Availability has high value for this application.
