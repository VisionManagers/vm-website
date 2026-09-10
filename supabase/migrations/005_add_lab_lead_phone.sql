-- Optional phone number on lab leads (intake simplified to name + email + optional website/phone)
alter table lab_leads add column if not exists phone text;
