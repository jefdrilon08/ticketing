EXPLAIN ANALYZE
SELECT "account_transactions"."subsidiary_id"
  FROM "account_transactions"
  WHERE (transaction_type = 'loan_payment'
    AND amount > 0
    AND status = 'approved')
    AND (DATE(transacted_at) >= '2020-08-01'
    AND DATE(transacted_at) <= '2020-08-31'
    AND subsidiary_type = 'Loan')
ORDER BY  transacted_at ASC
