# MyKoins Member Loan Application API

## Overview

Allow a member to apply for a loan. This is encapsulated in a model called `MemberLoanApplication`.

## Technical Documentation

### URL Endpoint

**`POST /api/members/loans`**

### Functional Requirements

1. Member must be active
2. Cannot apply if there is an existing loan application of the same product

#### Mandatory Fields On Creation

* `date_applied`: Date member applied for the loan
* `status`: Defaults to `pending`
* `member_id`: Reference to the member

### Required Parameters

* `loan_product_id`: Loan product
* `loan_product_type_id`: Loan product type
* `amount`: Amount to be applied
* `term`: Loan term
* `num_installments`: Number of installments
* `data`: json obj for various attributes

### Utility Endpoints

**`GET /api/client_meta/loan_products`**

Returns the manifest for loan products.
