# London Drugs UAT -- EPIC-05: My Account Functional Tests
Priority: P0 | MVP: Yes | Stories: 2
Source: UAT Regression Testing Master Plan (TC IDs 83243–83244)
---

## Story TC-83243: My Account — Signing in with valid credentials redirects to My Account dashboard

**Story tag:** [FE]
**Acceptance Criteria:**
- AC-01: Login page loads at /myaccount/login
- AC-02: Email and password fields accept input
- AC-03: Clicking 'Sign In' submits credentials
- AC-04: Successful login redirects the user to /myaccount dashboard

---

### FTC_05_01_01 — Valid login redirects to My Account dashboard [Positive]

```gherkin
@FE @my-account @login @authentication @P0
Scenario: TC-83243 - Signing in with valid credentials redirects to My Account dashboard
  Given the user navigates to "https://www.londondrugs.com/myaccount/login"
  And the login page loads
  When the email input field is visible
  And the user enters the registered email address from TEST environment variables
  And the user enters the correct password from TEST environment variables
  And the user clicks the "Sign In" button
  And the authentication completes
  Then the user is redirected to the My Account dashboard at "/myaccount"
```
**Traceability:** TC-83243 | AC-01, AC-02, AC-03, AC-04 | Type: positive

---

### FTC_05_01_02 — Invalid credentials show login error and do not redirect [Negative]

```gherkin
@FE @my-account @login @authentication @validation @P0
Scenario: TC-83243-N1 - Invalid email or password shows login error and does not redirect
  Given the user navigates to "https://www.londondrugs.com/myaccount/login"
  And the login page loads
  When the user enters an invalid email address or incorrect password
  And the user clicks the "Sign In" button
  Then a login error message is displayed
  And the user is NOT redirected to the My Account dashboard
  And the URL remains on "/myaccount/login"
```
**Traceability:** TC-83243 | AC-03, AC-04 | Type: negative

---

### FTC_05_01_03 — Login form with empty fields shows validation error [Negative]

```gherkin
@FE @my-account @login @validation @P1
Scenario: TC-83243-N2 - Login with empty email or password shows required field error
  Given the user navigates to the login page at "/myaccount/login"
  When the user clicks "Sign In" without entering email or password
  Then a required field or validation error is displayed
  And no authentication attempt is made
```
**Traceability:** TC-83243 | AC-02 | Type: negative

---

### FTC_05_01_04 — Email field accepts valid email format only [Boundary]

```gherkin
@FE @my-account @login @validation @boundary @P1
Scenario: TC-83243-B - Email field validates email format before submission
  Given the user is on the login page
  When the user enters a malformed email (e.g. "userexample.com") in the email field
  And the user enters any password
  And the user clicks "Sign In"
  Then a format validation error is shown for the email field
  And the Sign In request is not submitted to the server
```
**Traceability:** TC-83243 | AC-02 | Type: boundary

---

### FTC_05_01_05 — SQL injection attempt in login fields does not authenticate or break app [Negative]

```gherkin
@FE @my-account @login @security @injection @P0
Scenario: TC-83243-N3 - SQL injection in login credentials does not authenticate or crash
  Given the user is on the login page
  When the user enters "' OR '1'='1" in the email field
  And the user enters "' OR '1'='1" in the password field
  And the user clicks "Sign In"
  Then the login attempt fails with an error message
  And the user is NOT redirected to the My Account dashboard
  And no application error or crash occurs
```
**Traceability:** TC-83243 | AC-03 | Type: negative

---

## Story TC-83244: My Account — Filling address form saves new address in address book

**Story tag:** [FE]
**Acceptance Criteria:**
- AC-01: Address book page loads at /myaccount/address-book (authenticated session required)
- AC-02: Clicking 'Add New Address' shows the address form
- AC-03: Filling first name, last name, street, city, postal code fields is accepted
- AC-04: Clicking 'Save' submits the address form
- AC-05: The new address appears in the address book list

---

### FTC_05_02_01 — Authenticated user saves new address in address book [Positive]

```gherkin
@FE @my-account @address-book @authenticated @P0
Scenario: TC-83244 - Authenticated user fills address form and saves new address
  Given the user is authenticated with a valid session
  And the user navigates to "https://www.londondrugs.com/myaccount/address-book"
  And the address book page loads
  When the user clicks the "Add New Address" button
  And the user fills in the first name from TEST_FIRSTNAME environment variable
  And the user fills in the last name from TEST_LASTNAME environment variable
  And the user fills in the street address from TEST_ADDRESS environment variable
  And the user fills in the city from TEST_CITY environment variable
  And the user fills in the postal code from TEST_POSTAL environment variable
  And the user clicks "Save" to submit the address form
  And the address is processed
  Then the new address appears in the address book list
```
**Traceability:** TC-83244 | AC-01, AC-02, AC-03, AC-04, AC-05 | Type: positive

---

### FTC_05_02_02 — Saving address with missing required field shows validation error [Negative]

```gherkin
@FE @my-account @address-book @validation @P1
Scenario: TC-83244-N1 - Address form with missing required field shows validation error
  Given the authenticated user has clicked "Add New Address" on the address book page
  When the user fills in all fields except the postal code
  And the user clicks "Save"
  Then a required-field validation error is shown for the postal code
  And the address is NOT saved to the address book
```
**Traceability:** TC-83244 | AC-03, AC-04 | Type: negative

---

### FTC_05_02_03 — Address form is not accessible without authentication [Negative]

```gherkin
@FE @my-account @address-book @authentication @P1
Scenario: TC-83244-N2 - Unauthenticated user cannot access address book page
  Given the user is NOT authenticated
  When the user navigates to "https://www.londondrugs.com/myaccount/address-book"
  Then the user is redirected to the login page
  And the address book form is not accessible
```
**Traceability:** TC-83244 | AC-01 | Type: negative

---

### FTC_05_02_04 — Address with maximum-length fields is accepted [Boundary]

```gherkin
@FE @my-account @address-book @boundary @P1
Scenario: TC-83244-B - Address form accepts input at maximum field length
  Given the authenticated user has opened the Add New Address form
  When the user enters a first name at or near the maximum character limit
  And the user fills in all other required fields with valid values
  And the user clicks "Save"
  Then the address is saved successfully to the address book
  And no truncation or field overflow error occurs
```
**Traceability:** TC-83244 | AC-03, AC-05 | Type: boundary

---

### FTC_05_02_05 — Special characters in address fields are handled correctly [Negative]

```gherkin
@FE @my-account @address-book @special-characters @P2
Scenario: TC-83244-N3 - Special characters in address fields are sanitized or rejected
  Given the authenticated user has opened the Add New Address form
  When the user enters special characters (e.g. "<script>alert(1)</script>") in the first name field
  And the user fills in other required fields with valid values
  And the user clicks "Save"
  Then the address is either rejected with a validation error
  Or the special characters are safely sanitized in the stored address
  And no XSS execution or application error occurs
```
**Traceability:** TC-83244 | AC-03 | Type: negative
