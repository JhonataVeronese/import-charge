CREATE VIEW view_report_charges AS
SELECT
	bills.id as charge_id,
  bills.data_vencimento as charge_due_date,
	case
    when  bills.data_vencimento >= current_date and (bills.valor_pago = 0 or bills.valor_pago is null) then 'pending'
    when  bills.data_vencimento < current_date and (bills.valor_pago = 0 or bills.valor_pago is null) then 'overdue'
    when  bills.valor_pago > 0 then 'paid'
  end as charge_status,
	bills.data_competencia as charge_competence_date,
  bills.created_at as charge_issue_date,
  bills.data_do_liquidacao as charge_liquidate_date,
  bills.data_credito as charge_credit_date,
  bills.valor as charge_amount,
  bills.valor_pago as charge_amount_paid,
  bills.deleted_at as charge_deleted_at,
  bills.condominium_id as condominium_id,
  units.id as unit_id,
  units.name as unit_name,
  profiles.name as unit_owner_name
  
FROM bills
LEFT JOIN units ON units.id = bills.unit_id
LEFT JOIN blocks ON blocks.id = units.block_id
LEFT JOIN unit_owners ON unit_owners.unit_id = units.id AND unit_owners.deleted_at is NULL AND unit_owners.financial_responsible = true 
LEFT JOIN profiles ON profiles.id = unit_owners.profile_id AND profiles.deleted_at is NULL;