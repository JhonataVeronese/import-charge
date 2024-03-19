DROP VIEW view_report_units;
CREATE VIEW view_report_units AS
SELECT 
	DISTINCT ON (units.id, profiles.id, parkings.id)
	units.id as unit_id,
  CASE 
    WHEN blocks.name IS NOT NULL THEN CONCAT(units.name, ' - ', blocks.name) 
    ELSE units.name
  END AS unit_full_name,
  units.fraction as unit_fraction,
  units.area as unit_area,
  profiles.name as resident_name,
  profile_emails.email as resident_email,
  profile_phones.phone as resident_phone,
  profiles.cpf_cnpj as resident_document,
  profiles.id as profile_id,
  CASE 
    WHEN unit_owners.profile_id = profiles.id THEN true 
    ELSE false
  END AS resident_is_owner,
  units.condominium_id as condominium_id,
  units.deleted_at as deleted_at,
  CASE 
    WHEN blocks_parking.name IS NOT NULL THEN CONCAT(parkings.name, ' - ', blocks_parking.name) 
    ELSE parkings.name
  END AS parking_full_name
FROM units 
LEFT JOIN blocks ON blocks.id = units.block_id
LEFT JOIN unit_residents ON unit_residents.unit_id = units.id AND unit_residents.deleted_at is NULL
LEFT JOIN unit_owners ON unit_owners.unit_id = units.id AND unit_owners.deleted_at is NULL
LEFT JOIN unit_tenants ON unit_tenants.unit_id = units.id AND unit_tenants.deleted_at is NULL
LEFT JOIN parkings ON parkings.unit_id = units.id AND parkings.deleted_at is NULL
LEFT JOIN blocks blocks_parking ON blocks_parking.id = parkings.block_id
LEFT JOIN profiles ON profiles.id = unit_residents.profile_id OR profiles.id = unit_owners.profile_id OR profiles.id = unit_tenants.profile_id AND profiles.deleted_at is NULL
LEFT JOIN (SELECT email, profile_id, deleted_at FROM profile_emails) profile_emails 
	ON profile_emails.profile_id = profiles.id 
  AND profile_emails.deleted_at is NULL
LEFT JOIN profile_phones 
	ON profile_phones.profile_id = profiles.id 
  AND profile_emails.deleted_at is NULL;