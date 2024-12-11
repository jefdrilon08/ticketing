## Testing Indices

```
DROP INDEX manual_idx_1;
CREATE INDEX manual_idx_1 ON account_transactions (subsidiary_id, transacted_at) WHERE transaction_type IN ('deposit', 'withdraw');

DROP INDEX manual_idx_2;
CREATE INDEX manual_idx_2 ON monthly_closing_collections (closing_date DESC);

DROP INDEX manual_idx_3;
CREATE INDEX manual_idx_3 ON monthly_closing_collections (branch_id, closing_date DESC);

DROP INDEX manual_idx_4;
CREATE INDEX manual_idx_4 ON activity_logs (created_at DESC);

DROP INDEX manual_idx_5;
CREATE INDEX manual_idx_5 ON data_stores (status, (meta->>'data_store_type'), (meta->>'branch_id'), (meta->>'as_of') DESC);

DROP INDEX manual_idx_6;
CREATE INDEX manual_idx_6 ON loan_products (priority ASC);

DROP INDEX manual_idx_7;
CREATE INDEX manual_idx_7 ON members (status, center_id);

DROP INDEX manual_idx_8;
CREATE INDEX manual_idx_8 ON activity_logs ((data->>'loan_id'), created_at DESC);

DROP INDEX manual_idx_9;
CREATE INDEX manual_idx_9 on accounting_entries (book, reference_number, particular);

DROP INDEX manual_idx_10;
CREATE INDEX manual_idx_10 on journal_entries (accounting_code_id, accounting_entry_id);

DROP INDEX manual_idx_11;
CREATE INDEX manual_idx_11 ON data_stores ((meta->>'data_store_type'), (meta->>'branch_id'), (meta->>'as_of') DESC);

DROP INDEX manual_idx_12;
CREATE INDEX manual_idx_12 ON member_accounts (account_type, account_subtype);

DROP INDEX manual_idx_13;
CREATE INDEX manual_idx_13 ON activity_logs ((data->>'billing_id'), created_at DESC);

DROP INDEX manual_idx_14;
CREATE INDEX manual_idx_14 ON account_transactions (subsidiary_id, transacted_at);

DROP INDEX manual_idx_15;
CREATE INDEX manual_idx_15 ON activity_logs ((data->>'member_id'), created_at DESC);

DROP INDEX manual_idx_16;
CREATE INDEX manual_idx_16 ON accounting_entries (date_prepared);

DROP INDEX manual_idx_17;
CREATE INDEX manual_idx_17 ON accounting_entries (branch_id, date_posted) WHERE status = 'approved';

DROP INDEX manual_idx_18;
CREATE INDEX manual_idx_18 ON journal_entries (accounting_entry_id, post_type, accounting_code_id);

DROP INDEX manual_idx_19;
CREATE INDEX manual_idx_19 ON accounting_codes (category);

-- Get index sizes
\di+ manual_idx_*;
```
