# App Improvement Plan

## ✅ Completed

### DB Indexes
- Added indexes on `transactions` (`invoice`, `cashier_id`, `customer_id`, `created_at`, `payment_status`, `payment_method`)
- Added indexes on `transaction_details` (`transaction_id`, `product_id`)
- Added indexes on `products` (`category_id`, `title`)
- Added indexes on `profits` (`transaction_id`, `created_at`)

### Soft Deletes
- Added `deleted_at` to `transactions`, `products`, `customers`, `categories`
- Deletions now archive records instead of permanently removing them

### Audit Logs
- Created `audit_logs` table with polymorphic relation
- Created `Auditable` trait tracking `created`, `updated`, `deleted`, `force_deleted`, `restored` events
- Applied `Auditable` to `Transaction`, `Product`, `Customer`, `Category` models
- Records user name, IP address, user agent, and field-level diffs (old vs new values)
- Added `AuditLogController` and Inertia page at `/dashboard/audit-logs`
- Page includes search, action/model filters, paginated table, and color-coded action badges
- Added `audit-logs-access` permission and sidebar menu entry under Pengaturan

---

## Pending

### High Impact (Business Critical)

- [ ] **Low-stock alerts** — warn when product stock falls below a threshold
- [ ] **Stock adjustment/correction** — manual stock corrections with reason notes
- [ ] **Stock movement history** — log every stock in/out event
- [ ] **Returns/Refunds** — void/return transaction flow with approval workflow
- [ ] **Promotion management** — percentage vs fixed discounts, date-based, per-product/category conditions
- [ ] **Tax/VAT calculation** — display and report tax on receipts and reports

### Medium Impact (Operations)

- [ ] **Cashier shift management** — shift open/close with cash drawer reconciliation
- [ ] **Receipt customization** — store logo, footer text, terms via settings UI
- [ ] **Digital receipts** — email receipt to customer after transaction
- [ ] **Split payments** — pay partial in cash, rest via payment gateway

### Nice to Have (Growth)

- [ ] **Customer loyalty system** — points, tier levels, rewards
- [ ] **Advanced reports** — hourly breakdown, cashier performance, MoM/YoY comparison
- [ ] **Barcode label printing** — generate and print product barcode labels

### Technical

- [ ] **Low test coverage** — most business logic is untested; write feature tests for core flows
- [ ] **2FA for admin accounts** — two-factor authentication for users
- [ ] **Database query optimization** — review N+1 issues in history/report pages
