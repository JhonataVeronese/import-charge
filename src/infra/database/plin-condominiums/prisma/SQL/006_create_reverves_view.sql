SELECT
	reserves.id as reserve_id,
  CASE 
    WHEN blocks.name IS NOT NULL THEN CONCAT(units.name, ' - ', blocks.name) 
    ELSE units.name
  END AS unit_full_name,
  units.condominium_id AS condominium_id,
  reserves.payment_status AS reserve_payment_status,
  reserves.status_aproove AS reserve_approve_status,
  reserves.canceled AS reserve_was_canceled,
  reserve_queues.date AS reserve_booking_time,
  COUNT(qr) as reserve_current_waiting,
  virtual_areas.name AS area_name,
  virtual_areas.use_rate AS area_use_rate,
  deleted_at AS deletedAt,
  canceled AS canceled,
  CASE 
    WHEN virtual_areas.automatic_reserve_approval THEN 'Automática' 
    ELSE 'Manual'
  END AS area_approval_type
FROM reserves
LEFT JOIN units ON reserves.unit_id = units.id
LEFT JOIN blocks ON blocks.id = units.block_id
LEFT JOIN reserve_queues ON reserve_queues.id = reserves.reserve_queue_id
LEFT JOIN virtual_areas ON virtual_areas.id = reserve_queues.virtual_area_id
LEFT OUTER JOIN reserves qr ON qr.deleted_at IS NULL 
	AND reserve_queues.id = qr.reserve_queue_id 
  AND reserves.canceled = false 
  AND reserves.status_aproove IS NULL 
  AND qr.created_at < reserves.created_at 
  AND qr.canceled = false 
  AND qr.status_aproove IS NOT FALSE
 GROUP BY reserves.id, blocks.name, units.name, units.condominium_id, reserve_queues.date, virtual_areas.name, virtual_areas.use_rate, virtual_areas.automatic_reserve_approval;