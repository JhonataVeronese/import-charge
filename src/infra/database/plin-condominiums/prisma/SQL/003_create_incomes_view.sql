CREATE VIEW view_report_incomes AS 
	WITH RECURSIVE CTE AS (
  SELECT
    id,
    name,
    parent,
    CONCAT(plan_account_categories.order::text) AS order_number,
    uuid
  FROM plan_account_categories
  WHERE parent IS NULL
  
  UNION ALL
  
  SELECT
    c.id,
    c.name,
    c.parent,
    CONCAT(cte.order_number, '.', c.order) AS order_number_end,
    COALESCE(cte_first.uuid, c.uuid) AS uuid
  FROM plan_account_categories c
  INNER JOIN CTE ON c.parent = cte.id
  LEFT JOIN (SELECT id, uuid FROM plan_account_categories WHERE parent IS NULL) cte_first ON cte.id = cte_first.id
)
SELECT
	bills.id as release_id,
	'RECEITA' as release_type,
  bills.valor as release_total_value,
  'MANUAL' as release_origin,
  bills.data_vencimento as release_due_date,
  bills.data_competencia as release_competence_date,
  bill_complements.value as release_value,
  plan_account_categories.uuid as release_category_uuid,
  bills.data_do_liquidacao as release_payment_date,
  bill_complements.description as release_notes,
  bills.valor_pago as release_paid_value,
  cost_centers.name as cost_center_name,
  bankaccount.id as bank_account_id,
  bankaccount.deleted_at as bank_account_deleted_at,
  bills.condominium_id as condominium_id,
	bills.company_id as company_id,
  bills_collection_units.id as collection_unit_id,
  CASE 
    WHEN collection_CTE.order_number IS NOT NULL THEN collection_CTE.order_number 
    ELSE CTE.order_number
  END AS category_order_number,
  CASE 
    WHEN collection_categories.name IS NOT NULL THEN collection_categories.name 
    ELSE plan_account_categories.name
  END AS category_name,
  CASE 
    WHEN collection_c2.name IS NOT NULL THEN collection_c2.name 
    ELSE c2.name 
  END AS parent_category_name
FROM bills
JOIN bankaccount on bankaccount.id = bills.bankaccount_id
LEFT JOIN bill_complements on bills.id = bill_complements.bill_id
LEFT JOIN bills_collection_units on bills.id = bills_collection_units.bill_id
LEFT JOIN bills_collection on bills_collection_units.collection_id = bills_collection.id
LEFT JOIN plan_account_categories on plan_account_categories.id = bill_complements.plan_account_category_id
LEFT JOIN plan_account_categories collection_categories on collection_categories.id = bills_collection.plan_account_category_id
LEFT JOIN cost_centers on cost_centers.id = bills_collection.cost_center_id
LEFT JOIN CTE on CTE.id = plan_account_categories.id
LEFT JOIN plan_account_categories c2 ON CTE.parent = c2.id
LEFT JOIN CTE collection_CTE on collection_CTE.id = bills_collection.plan_account_category_id
LEFT JOIN plan_account_categories collection_c2 ON collection_CTE.parent = collection_c2.id;