/**
 * Risk intelligence data. Contains risk scores, network data, and client data. Field availability depends on enabled modules.
 *
 * @summary All risk intelligence information
 * @public
 */
export interface RiskIntelligenceData {
  /**
   * Risk scores from various signals, these summarize the risk intelligence assessment.
   *
   * Available when the **Risk Scores** module is enabled.
   * `null` when the **Risk Scores** module is not enabled.
   *
   * @summary Calculated risk scores
   */
  risk_scores: RiskScoresData | null;

  /**
   * Network-related risk intelligence.
   * @summary Network and IP information
   */
  network: NetworkData;

  /**
   * Client/device risk intelligence.
   * @summary User agent and device information
   */
  client: ClientData;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
// Risk Scores
////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Risk score value ranging from 1 to 5.
 * - 0: Unknown or missing
 * - 1: Very low risk
 * - 2: Low risk
 * - 3: Medium risk
 * - 4: High risk
 * - 5: Very high risk
 *
 * @summary Risk score indicating likelihood of malicious activity
 * @public
 */
export type RiskScore =
  | typeof RISK_SCORE_UNKNOWN
  | typeof RISK_SCORE_VERY_LOW
  | typeof RISK_SCORE_LOW
  | typeof RISK_SCORE_MEDIUM
  | typeof RISK_SCORE_HIGH
  | typeof RISK_SCORE_VERY_HIGH;

/** @summary Unknown or missing risk score
 *  @public
 */
export const RISK_SCORE_UNKNOWN = 0 as const;

/** @summary Very low risk score (1/5)
 *  @public
 */
export const RISK_SCORE_VERY_LOW = 1 as const;

/** @summary Low risk score (2/5)
 *  @public
 */
export const RISK_SCORE_LOW = 2 as const;

/** @summary Medium risk score (3/5)
 *  @public
 */
export const RISK_SCORE_MEDIUM = 3 as const;

/** @summary High risk score (4/5)
 *  @public
 */
export const RISK_SCORE_HIGH = 4 as const;

/** @summary Very high risk score (5/5)
 *  @public
 */
export const RISK_SCORE_VERY_HIGH = 5 as const;
/**
 * Risk scores summarize the entire risk intelligence assessment into scores per category.
 *
 * Available when the **Risk Scores** module is enabled for your account.
 * `null` when the **Risk Scores** module is not enabled for your account.
 *
 * @summary Risk scores for different categories
 * @public
 */
export interface RiskScoresData {
  /**
   * Overall risk score combining all signals.
   *
   * @summary Overall risk score
   */
  overall: RiskScore;

  /**
   * Network-related risk score. Captures likelihood of automation/malicious activity based on
   * IP address, ASN, reputation, geolocation, past abuse from this network, and other network signals.
   *
   * @summary Risk score based on network signals
   */
  network: RiskScore;

  /**
   * Browser-related risk score. Captures likelihood of automation, malicious activity or browser spoofing based on
   * user agent consistency, automation traces, past abuse, and browser characteristics.
   *
   * @summary Risk score based on browser signals
   */
  browser: RiskScore;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
// Network
////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Autonomous System (AS) information.
 *
 * Available when the **IP Intelligence** module is enabled for your account.
 * `null` when the **IP Intelligence** module is not enabled for your account.
 *
 * @summary Information about the AS that owns the IP
 * @public
 */
export interface NetworkAutonomousSystemData {
  /**
   * Autonomous System Number (ASN) identifier.
   * @summary Autonomous System Number (ASN).
   * @example 3209 for Vodafone GmbH
   */
  number: number;

  /**
   * Name of the autonomous system. This is usually a short name or handle.
   * @summary AS name
   * @example "VODANET"
   */
  name: string;

  /**
   * Organization name that owns the ASN.
   * @summary Company that owns the AS
   * @example "Vodafone GmbH"
   */
  company: string;

  /**
   * Description of the company that owns the ASN.
   * @summary Short description of the company
   * @example "Provides mobile and fixed broadband and telecommunication services to consumers and businesses."
   */
  description: string;

  /**
   * Domain name associated with the ASN.
   * @summary Company domain
   * @example "vodafone.de"
   */
  domain: string;

  /**
   * Two-letter ISO 3166-1 alpha-2 country code where the ASN is registered.
   * @summary ASN registration country
   * @example "DE"
   */
  country: string;

  /**
   * Regional Internet Registry that allocated the ASN.
   * @summary RIR that allocated this ASN
   * @example "RIPE"
   */
  rir: string;

  /**
   * IP route associated with the ASN.
   * @summary IP route in CIDR notation
   * @example "88.64.0.0/12"
   */
  route: string;

  /**
   * Type of the autonomous system.
   * @summary AS type classification
   * @example "isp"
   */
  type: string;
}

/**
 * Country information.
 * @summary Detailed country data
 * @public
 */
export interface NetworkGeolocationCountryData {
  /**
   * Two-letter ISO 3166-1 alpha-2 country code.
   * @summary ISO 3166-1 alpha-2 code
   * @example "DE"
   */
  iso2: string;

  /**
   * Three-letter ISO 3166-1 alpha-3 country code.
   * @summary ISO 3166-1 alpha-3 code
   * @example "DEU"
   */
  iso3: string;

  /**
   * English name of the country.
   * @summary Country name in English
   * @example "Germany"
   */
  name: string;

  /**
   * Native name of the country.
   * @summary Country name in native language
   * @example "Deutschland"
   */
  name_native: string;

  /**
   * Geographic region.
   * @summary Major world region
   * @example "Europe"
   */
  region: string;

  /**
   * Geographic subregion.
   * @summary More specific world region
   * @example "Western Europe"
   */
  subregion: string;

  /**
   * Currency code.
   * @summary ISO 4217 currency code
   * @example "EUR"
   */
  currency: string;

  /**
   * Currency name.
   * @summary Full name of the currency
   * @example "Euro"
   */
  currency_name: string;

  /**
   * International dialing code.
   * @summary Country phone code
   * @example "49"
   */
  phone_code: string;

  /**
   * Capital city.
   * @summary Name of the capital city
   * @example "Berlin"
   */
  capital: string;
}

/**
 * Geolocation information for the IP address.
 *
 * Available when the **IP Intelligence** module is enabled.
 * `null` when the **IP Intelligence** module is not enabled.
 *
 * @summary Geographic location of the IP address
 * @public
 */
export interface NetworkGeolocationData {
  /**
   * Country information.
   * @summary Detailed country data
   */
  country: NetworkGeolocationCountryData;

  /**
   * City name. Empty string if unknown.
   *
   * @summary City of the IP address
   * @example "Eschborn"
   */
  city: string;

  /**
   * State, region, or province. Empty string if unknown.
   *
   * @summary State/region/province of the IP address
   * @example "Hessen"
   */
  state: string;
}

/**
 * Abuse contact information for reporting network abuse.
 *
 * Available when the **IP Intelligence** module is enabled.
 * `null` when the **IP Intelligence** module is not enabled.
 *
 * @summary Contact details for reporting abuse
 * @public
 */
export interface NetworkAbuseContactData {
  /**
   * Postal address of the abuse contact.
   * @summary Abuse contact postal address
   * @example "Vodafone GmbH, Campus Eschborn, Duesseldorfer Strasse 15, D-65760 Eschborn, Germany"
   */
  address: string;

  /**
   * Name of the abuse contact person or team.
   * @summary Abuse contact name
   * @example "Vodafone Germany IP Core Backbone"
   */
  name: string;

  /**
   * Abuse contact email address.
   * @summary Email for abuse reports
   * @example "abuse.de@vodafone.com"
   */
  email: string;

  /**
   * Abuse contact phone number.
   * @summary Phone for abuse reports
   * @example "+49 6196 52352105"
   */
  phone: string;
}

/**
 * IP anonymization and privacy information.
 *
 * Available when the **Anonymization Detection** module is enabled.
 * `null` when the **Anonymization Detection** module is not enabled.
 *
 * @summary Detection of VPNs, proxies, and anonymization services
 * @public
 */
export interface NetworkAnonymizationData {
  /**
   * Likelihood that the IP is from a VPN service.
   * @summary VPN detection score
   */
  vpn_score: RiskScore;

  /**
   * Likelihood that the IP is from a proxy service.
   * @summary Proxy detection score
   */
  proxy_score: RiskScore;

  /**
   * Whether the IP is a Tor exit node.
   * @summary Tor exit node detection
   */
  tor: boolean;

  /**
   * Whether the IP is from iCloud Private Relay.
   * @summary iCloud Private Relay detection
   * @see https://support.apple.com/en-us/102602
   */
  icloud_private_relay: boolean;
}

/**
 * Network-related risk intelligence.
 * @summary Information about the network
 * @public
 */
export interface NetworkData {
  /**
   * IP address used when requesting the challenge.
   * @summary Client IP address
   * @example "88.64.4.22"
   */
  ip: string;

  /**
   * Autonomous System information.
   *
   * Available when the **IP Intelligence** module is enabled.
   * `null` when the **IP Intelligence** module is not enabled.
   *
   * @summary AS data for the IP
   */
  as: NetworkAutonomousSystemData | null;

  /**
   * Geolocation information.
   *
   * Available when the **IP Intelligence** module is enabled.
   * `null` when the **IP Intelligence** module is not enabled.
   *
   * @summary Geographic location of the IP
   */
  geolocation: NetworkGeolocationData | null;

  /**
   * Abuse contact information.
   *
   * Available when the **IP Intelligence** module is enabled.
   * `null` when the **IP Intelligence** module is not enabled.
   *
   * @summary Contact for abuse reports
   */
  abuse_contact: NetworkAbuseContactData | null;

  /**
   * IP masking/anonymization information.
   *
   * Available when the **Anonymization Detection** module is enabled.
   * `null` when the **Anonymization Detection** module is not enabled.
   *
   * @summary VPN, proxy, and Tor detection
   */
  anonymization: NetworkAnonymizationData | null;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
// Client
////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Time zone information from the browser.
 *
 * Available when the **Browser Identification** module is enabled.
 * `null` when the **Browser Identification** module is not enabled.
 *
 * @summary IANA time zone data
 * @public
 */
export interface ClientTimeZoneData {
  /**
   * IANA time zone name reported by the browser.
   * @summary IANA time zone identifier
   * @example "America/New_York" or "Europe/Berlin"
   */
  name: string;

  /**
   * Two-letter ISO 3166-1 alpha-2 country code derived from the time zone.
   * "XU" if timezone is missing or cannot be mapped to a country (e.g., "Etc/UTC").
   *
   * @summary Country derived from time zone
   * @example "US" or "DE"
   */
  country_iso2: string;
}

/**
 * Detected browser information.
 *
 * Available when the **Browser Identification** module is enabled.
 * `null` when the **Browser Identification** module is not enabled.
 *
 * @summary Detected browser details
 * @public
 */
export interface ClientBrowserData {
  /**
   * Unique browser identifier. Empty string if browser could not be identified.
   *
   * @summary Browser ID
   * @example "firefox"
   * @example "chrome"
   * @example "chrome_android"
   * @example "edge"
   * @example "safari"
   * @example "safari_ios"
   * @example "webview_ios"
   */
  id: string;

  /**
   * Human-readable browser name. Empty string if browser could not be identified.
   *
   * @summary Browser name
   * @example "Firefox"
   * @example "Chrome"
   * @example "Edge"
   * @example "Safari"
   * @example "Safari on iOS"
   * @example "WebView on iOS"
   */
  name: string;

  /**
   * Browser version name. Assumed to be the most recent release matching the signature if exact version unknown. Empty if unknown.
   *
   * @summary Version number
   * @example "146.0"
   * @example "16.5"
   */
  version: string;

  /**
   * Release date of the browser version. In "YYYY-MM-DD" format. Empty string if unknown.
   *
   * @summary Browser version release date
   * @example "2026-01-28"
   */
  release_date: string;
}

/**
 * Browser engine (rendering engine) information.
 *
 * Available when the **Browser Identification** module is enabled.
 * `null` when the **Browser Identification** module is not enabled.
 *
 * @summary Detected rendering engine details
 * @public
 */
export interface ClientBrowserEngineData {
  /**
   * Unique rendering engine identifier. Empty string if engine could not be identified.
   *
   * @summary Engine ID
   * @example "gecko"
   * @example "blink"
   * @example "webkit"
   */
  id: string;

  /**
   * Human-readable engine name. Empty string if engine could not be identified.
   *
   * @summary Engine name
   * @example "Gecko"
   * @example "Blink"
   * @example "WebKit"
   */
  name: string;

  /**
   * Rendering engine version. Assumed to be the most recent release matching the signature if exact version unknown. Empty if unknown.
   *
   * @summary Version number
   * @example "146.0"
   * @example "16.5"
   */
  version: string;
}

/**
 * Device type and screen information.
 *
 * Available when the **Browser Identification** module is enabled.
 * `null` when the **Browser Identification** module is not enabled.
 *
 * @summary Detected device details
 * @public
 */
export interface ClientDeviceData {
  /**
   * Device type.
   * @summary Type of device
   * @example "desktop"
   * @example "mobile"
   * @example "tablet"
   */
  type: string;

  /**
   * Device brand.
   * @summary Manufacturer brand
   * @example "Apple"
   * @example "Samsung"
   * @example "Google"
   */
  brand: string;

  /**
   * Device model.
   * @summary Device model name
   * @example "iPhone 17"
   * @example "Galaxy S21 (SM-G991B)"
   * @example "Pixel 10"
   */
  model: string;
}

/**
 * Operating system information.
 *
 * Available when the Browser Identification module is enabled.
 * `null` when the Browser Identification module is not enabled.
 *
 * @summary Detected OS details
 * @public
 */
export interface ClientOSData {
  /**
   * Unique operating system identifier. "unknown" if OS could not be identified.
   *
   * @summary OS ID
   * @example "windows"
   * @example "macos"
   * @example "ios"
   * @example "android"
   * @example "linux"
   */
  id: string;

  /**
   * Human-readable operating system name. Empty string if OS could not be identified.
   *
   * @summary OS name
   * @example "Windows"
   * @example "macOS"
   * @example "iOS"
   * @example "Android"
   * @example "Linux"
   */
  name: string;

  /**
   * Operating system version.
   * @summary Version number
   * @example "10"
   * @example "11.2.3"
   * @example "14.4"
   */
  version: string;
}

/**
 * TLS/SSL signatures, sometimes also called TLS fingerprints. These are derived from the TLS handshake
 * between the client and server, specifically the Client Hello message sent by the client.
 *
 * Available when the **Bot Detection** module is enabled.
 * `null` when the **Bot Detection** module is not enabled.
 *
 * @summary TLS client hello signatures
 * @public
 */
export interface TLSSignatureData {
  /**
   * JA3 hash.
   * @summary JA3 TLS signature
   * @example "d87a30a5782a73a83c1544bb06332780"
   */
  ja3: string;

  /**
   * JA3N hash.
   * @summary JA3N TLS signature
   * @example "28ecc2d2875b345cecbb632b12d8c1e0"
   */
  ja3n: string;

  /**
   * JA4 signature.
   * @summary JA4 TLS signature
   * @example "t13d1516h2_8daaf6152771_02713d6af862"
   */
  ja4: string;
}

/**
 * Known bot information. Known bots have public documentation about their identity and purpose, they are not
 * trying to hide that they are bots. These are usually considered "good bots" depending on the use case.
 *
 * @summary Detected known bot details
 * @public
 */
export interface ClientAutomationKnownBotData {
  /**
   * Whether a known bot was detected.
   * @summary Known bot detected flag
   */
  detected: boolean;

  /**
   * Bot identifier. Empty if no bot detected.
   *
   * @summary Bot ID
   * @example "googlebot"
   * @example "bingbot"
   * @example "chatgpt"
   */
  id: string;

  /**
   * Human-readable bot name. Empty if no bot detected.
   *
   * @summary Bot name
   * @example "Googlebot"
   * @example "Bingbot"
   * @example "ChatGPT"
   */
  name: string;

  /**
   * Bot type classification. Empty if no bot detected.
   *
   * @summary Type of bot
   */
  type: string;

  /**
   * Link to bot documentation. Empty if no bot detected.
   *
   * @summary URL with bot details
   * @example "https://developers.google.com/search/docs/crawling-indexing/googlebot"
   */
  url: string;
}

/**
 * Automation tool information.
 * @summary Detected automation tool details
 * @public
 */
export interface ClientAutomationToolData {
  /**
   * Whether an automation tool was detected.
   * @summary Automation tool detected flag
   */
  detected: boolean;

  /**
   * Automation tool identifier. Empty if no tool detected.
   *
   * @summary Tool ID
   * @example "puppeteer"
   * @example "selenium"
   * @example "playwright"
   * @example "webdriver"
   */
  id: string;

  /**
   * Human-readable tool name. Empty if no tool detected.
   *
   * @summary Tool name
   * @example "Puppeteer"
   * @example "Selenium"
   * @example "Playwright"
   * @example "WebDriver"
   */
  name: string;

  /**
   * Automation tool type. Empty if no tool detected.
   *
   * @summary Type of automation tool
   */
  type: string;
}

/**
 * Automation and bot detection data.
 *
 * Available when the **Bot Detection** module is enabled.
 * `null` when the **Bot Detection** module is not enabled.
 *
 * @summary Information about detected automation
 * @public
 */
export interface ClientAutomationData {
  /**
   * Detected automation tool information.
   * @summary Automation tool detection results
   */
  automation_tool: ClientAutomationToolData;

  /**
   * Detected known bot information.
   * @summary Known bot detection results
   */
  known_bot: ClientAutomationKnownBotData;
}

/**
 * Client/device risk intelligence. Contains details about the client device, browser, operating system - in other words, the user agent.
 *
 * @summary Information about the user agent and device
 * @public
 */
export interface ClientData {
  /**
   * User-Agent HTTP header value.
   * @summary User-Agent header
   * @example "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:146.0) Gecko/20100101 Firefox/146.0"
   */
  header_user_agent: string;

  /**
   * Time zone information.
   *
   * Available when the **Browser Identification** module is enabled.
   * `null` when the **Browser Identification** module is not enabled.
   *
   * @summary Browser time zone data
   */
  time_zone: ClientTimeZoneData | null;

  /**
   * Browser information.
   *
   * Available when the **Browser Identification** module is enabled.
   * `null` when the **Browser Identification** module is not enabled.
   *
   * @summary Detected browser
   */
  browser: ClientBrowserData | null;

  /**
   * Browser engine information.
   *
   * Available when the **Browser Identification** module is enabled.
   * `null` when the **Browser Identification** module is not enabled.
   *
   * @summary Detected rendering engine
   */
  browser_engine: ClientBrowserEngineData | null;

  /**
   * Device information.
   *
   * Available when the **Browser Identification** module is enabled.
   * `null` when the **Browser Identification** module is not enabled.
   *
   * @summary Detected device
   */
  device: ClientDeviceData | null;

  /**
   * Operating system information.
   *
   * Available when the **Browser Identification** module is enabled.
   * `null` when the **Browser Identification** module is not enabled.
   *
   * @summary Detected operating system
   */
  os: ClientOSData | null;

  /**
   * TLS signatures.
   *
   * Available when the **Bot Detection** module is enabled.
   * `null` when the **Bot Detection** module is not enabled.
   *
   * @summary TLS signatures
   */
  tls_signature: TLSSignatureData | null;

  /**
   * Automation detection data. Contains information about what type of automation was recognized.
   *
   * Available when the **Bot Detection** module is enabled.
   * `null` when the **Bot Detection** module is not enabled.
   *
   * @summary Bot and automation detection
   */
  automation: ClientAutomationData | null;
}
