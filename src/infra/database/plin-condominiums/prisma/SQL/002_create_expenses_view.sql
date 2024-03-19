CREATE VIEW view_report_expenses AS 
	WITH RECURSIVE CTE AS (
    SELECT
      id,
      name,
      parent,
      CONCAT(plan_account_categories.order::text) AS order_number,
      uuid,
      name as first_subcategory_name
    FROM plan_account_categories
    WHERE parent IS NULL

    UNION ALL

    SELECT
      c.id,
      c.name,
      c.parent,
      CONCAT(cte.order_number, '.', c.order) AS order_number_end,
      COALESCE(cte_first.uuid, c.uuid) AS uuid,
      cte.first_subcategory_name
    FROM plan_account_categories c
    INNER JOIN CTE ON c.parent = cte.id
    LEFT JOIN (SELECT id, uuid FROM plan_account_categories WHERE parent IS NULL) cte_first ON cte.id = cte_first.id
  )
SELECT
	releases.id as release_id,
  CONCAT(releases.id, '-', releases.type) as release_uuid,
	'DESPESA' as release_type,
  releases.value as release_value,
  'MANUAL' as release_origin,
  releases.due_date as release_due_date,
  releases.competence_date as release_competence_date,
  plan_account_categories.uuid as release_category_uuid,
  CASE WHEN releases.paid = false THEN NULL ELSE releases.payment_date END as release_payment_date,
  releases.complement as release_notes,
  releases.paid_value as release_paid_value,
  cost_centers.name as cost_center_name,
  CTE.order_number as category_order_number,
  plan_account_categories.name as category_name,
  bankaccount.uuid as bank_account_uuid,
  bankaccount.id as bank_account_id,
  bankaccount.deleted_at as bank_account_deleted_at,
  bankaccount.condominium_id as condominium_id,
  bankaccount.company_id as company_id,
  providers_owners.fantasy_name as provider_name,
  c2.name AS parent_category_name
FROM releases
JOIN bankaccount on bankaccount.id = releases.bankaccount_id
LEFT JOIN plan_account_categories on plan_account_categories.id = releases.plan_account_category_id
LEFT JOIN cost_centers on cost_centers.id = releases.cost_center_id
LEFT JOIN CTE on CTE.id = plan_account_categories.id
LEFT JOIN providers on providers.id = releases.provider_id
LEFT JOIN providers_owners on providers_owners.id = providers.provider_owner_id
LEFT JOIN plan_account_categories c2 ON CTE.parent = c2.id
WHERE releases.type = 'a_pagar';