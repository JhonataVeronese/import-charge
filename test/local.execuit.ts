import { generateDataItem } from '../src/functions/accountability-report-generate'

generateDataItem({
  body: Buffer.from(JSON.stringify({
    reportId: 201, 
    condominiumId: 5,
    date: '2023-08-01',
  })).toString('base64')
})