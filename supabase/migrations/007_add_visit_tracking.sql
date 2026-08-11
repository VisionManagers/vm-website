-- Visit tracking for consolidated lead-activity emails: one summary per
-- visit (page-close beacon / 15-min idle sweep) instead of one per action.
alter table lab_leads add column if not exists last_activity_at timestamptz;
alter table lab_leads add column if not exists visit_notified_at timestamptz;
