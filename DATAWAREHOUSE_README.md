## Models for Data Warehouse

### `DwBranchActiveLoanCount`

Generated From:

```
GenerateDailyReport -> ProcessRepaymentRates -> SaveDwBranchActiveLoanCount
```

### `DwBranchLoanProductActiveLoanCount`

Generated From:

```
GenerateDailyReport -> ProcessRepaymentRates -> SaveDwBranchLoanProductActiveLoanCount
```

### `DwBranchMemberCount`

```
GenerateDailyReport -> ProcessBranchMemberCounts -> SaveDwBranchMemberCountsFromDataStore
```

* `DwBranchNewMemberCount`
* `DwBranchLoanProductOutstandingLoanAmount`
* `DwBranchMonthlyLoanProductDisbursedCount`
* `DwBranchMonthlyLoanAmountCollection`
* `DwBranchMonthlyLoanAmountDue`
* `DwBranchLoanPastDue`
* `DwBranchParAmount`
