CREATE VIEW view_report_financial_charges AS
select
	c.id as charge_id,
	c."dueDate" as charge_due_date,
	case
		when c."dueDate" >= current_date
		and (c."amountPayable" = 0
		or c."amountPayable" is null) then 'pending'
		when c."dueDate" < current_date
		and (c."amountPayable" = 0
		or c."amountPayable" is null) then 'overdue'
		when c."amountPayable" > 0 then 'paid'
	end as charge_status,
	c."competenceDate" as charge_competence_date,
	c."createdAt" as charge_issue_date,
	c."liquidateDate" as charge_liquidate_date,
	c."creditDate" as charge_credit_date,
	c."baseValue" as charge_amount,
	c."amountPayable" as charge_amount_paid,
	c."deletedAt" as charge_deleted_at,
	c."condominiumUuid" as condominium_uuid,
	external_condominium.id as condominium_id,
	p."unitUuid" as unit_id,
	p."unitName" as unit_name,
	p."name" as unit_owner_name
from
		"Charge" c
left join "Payer" p on
	p.id = c."payerId"
left join dblink('dbname=plin_web user=postgres password=kQMeukcYGkMrj5pVxqBG',
	'select id as condominiumId, uuid from condominiums') as external_condominium(id DECIMAL,
	uuid VARCHAR)
	on
	external_condominium.uuid = c."condominiumUuid"
where
	p."unitUuid" is not null