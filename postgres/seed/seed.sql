BEGIN TRANSACTION;

INSERT INTO users (name, email, entries,joined) VALUES ('Alice', 'alice@mail.com', '5', '2019-01-01');
INSERT INTO login (hash, email) VALUES ('$2a$08$vg6wHCL1N.XvotZFPTtNVO3qAmJNiLPDn/lv3ZIRoH1IgvxGyC3vu', 'alice@mail.com');

COMMIT;
