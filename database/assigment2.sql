-----------------------------
--  Select
-----------------------------
SELECT *
FROM public.account;
-----------------------------
--  Insert
-----------------------------
INSERT INTO public.account(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-----------------------------
--  Update
-----------------------------
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';
-----------------------------
--  Delete
-----------------------------
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';
-- *****************************************--
-- Classification Table
-----------------------------
--  Update GM Hummer
-----------------------------
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'the small interiors',
        'a huge interior'
    )
WHERE inv_id = 10;
-----------------------------
--  Inner Join
-----------------------------
SELECT i.inv_make,
    i.inv_model,
    c.classification_name
FROM public.inventory i
    INNER JOIN public.classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';
-----------------------------
--  Update Images paths
-----------------------------
UPDATE public.inventory
SET inv_image = REGEXP_REPLACE(inv_image, '[a-z]\/', '/vehicles/'),
    inv_thumbnail = REGEXP_REPLACE(inv_thumbnail, '[a-z]\/', '/vehicles/');