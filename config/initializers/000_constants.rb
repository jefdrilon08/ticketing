APP_HOST = ENV.fetch("APP_HOST")
APP_PIPELINE = ENV.fetch("APP_PIPELINE")
CLIP_ACCOUNTING_CODE_ID = "af83062d-628a-4fdd-acfd-bdebe2696513"
LIST_PAGE_SIZE = 30
REDIS_URL = ENV.fetch("REDIS_URL") { "redis://localhost:6379/1" }
REINSURANCE_THRESHOLD_AMOUNT = 200_000
ROLLBAR_ACCESS_TOKEN = ENV.fetch("ROLLBAR_ACCESS_TOKEN")
SIDEKIQ_WEB_PATH = "/8229991ea9a2fb6f"

MONTHS_FOR_SELECT = [
  ["January", 1],
  ["February", 2],
  ["March", 3],
  ["April", 4],
  ["May", 5],
  ["June", 6],
  ["July", 7],
  ["August", 8],
  ["September", 9],
  ["October", 10],
  ["November", 11],
  ["December", 12],
]

USER_TYPES = [
  "USER",
  "MEMBER"
]

VALID_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg"
]

SIDEBAR_TRANSACTIONS_CONTROLLERS = [
  "billings",
  "billing_for_full_payments",
  "accrued_payment_collections",
  "membership_payment_collections",
  "insurance_fund_transfer_collections",
  "deposit_collections",
  "time_deposit_collections",
  "withdrawal_collections"
]

SIDEBAR_REPORTS_CONTROLLERS = [
  "repayment_rates"
]
