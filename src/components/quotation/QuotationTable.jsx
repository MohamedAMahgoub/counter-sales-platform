import AddPartRow from '../counter/AddPartRow'
import QuotationLineItem from './QuotationLineItem'

/**
 * @param {object} props
 * @param {object[]} props.lines
 * @param {number} props.discountCeiling
 * @param {string} props.discountCeilingWarningText
 * @param {object} props.columnLabels
 * @param {object} props.consumptionCopy
 * @param {(n: number) => string} props.formatEgp
 * @param {string} props.deleteLineAriaLabel
 * @param {(id: string, payload: { discount: number, discountValue: number }) => void} props.onDiscountUpdate
 * @param {(id: string) => void} props.onRemoveLine
 * @param {(line: object) => number} props.getLineTotal
 * @param {string} props.addPartPlaceholder
 */
export default function QuotationTable({
  lines,
  discountCeiling,
  discountCeilingWarningText,
  columnLabels,
  consumptionCopy,
  formatEgp,
  deleteLineAriaLabel,
  onDiscountUpdate,
  onRemoveLine,
  getLineTotal,
  addPartPlaceholder,
}) {
  const colSpan = 9

  return (
    <div className="w-full overflow-x-auto border-b border-border bg-surface-card">
      <table className="w-full min-w-[1180px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-surface">
            <th className="px-4 py-3 text-label font-semibold text-text-secondary">
              {columnLabels.partNumber}
            </th>
            <th className="px-4 py-3 text-label font-semibold text-text-secondary">
              {columnLabels.description}
            </th>
            <th className="px-4 py-3 text-label font-semibold text-text-secondary">
              {columnLabels.qtyQuoted}
            </th>
            <th className="px-4 py-3 text-label font-semibold text-text-secondary">
              {columnLabels.consumption}
            </th>
            <th className="px-4 py-3 text-label font-semibold text-text-secondary">
              {columnLabels.unitPrice}
            </th>
            <th className="px-4 py-3 text-label font-semibold text-text-secondary">
              {columnLabels.discountPercent}
            </th>
            <th className="px-4 py-3 text-label font-semibold text-text-secondary">
              {columnLabels.discountValue}
            </th>
            <th className="px-4 py-3 text-label font-semibold text-text-secondary">
              {columnLabels.lineTotal}
            </th>
            <th className="w-14 px-4 py-3 text-label font-semibold text-text-secondary">
              <span className="sr-only">{columnLabels.action}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <QuotationLineItem
              key={line.id}
              line={line}
              discountCeiling={discountCeiling}
              discountCeilingWarningText={discountCeilingWarningText}
              consumptionCopy={consumptionCopy}
              formatEgp={formatEgp}
              lineTotal={getLineTotal(line)}
              deleteAriaLabel={deleteLineAriaLabel}
              onDiscountUpdate={onDiscountUpdate}
              onRemoveLine={onRemoveLine}
            />
          ))}
          <AddPartRow placeholder={addPartPlaceholder} colSpan={colSpan} />
        </tbody>
      </table>
    </div>
  )
}
