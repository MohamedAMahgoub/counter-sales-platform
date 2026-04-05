import AddPartRow from './AddPartRow'
import PartLineItem from './PartLineItem'

/**
 * @param {object} props
 * @param {object[]} props.parts
 * @param {number} props.discountCeiling
 * @param {string} props.discountCeilingWarningText
 * @param {object} props.columnLabels
 * @param {object} props.availabilityCopy
 * @param {(n: number) => string} props.formatEgp
 * @param {string} props.deleteLineAriaLabel
 * @param {(id: string, qty: number) => void} props.onQtyChange
 * @param {(id: string, payload: { discount: number, discountValue: number }) => void} props.onDiscountUpdate
 * @param {(id: string) => void} props.onRemoveLine
 * @param {(part: object) => number} props.getLineTotal
 * @param {string} props.addPartPlaceholder
 * @param {boolean} [props.readOnly]
 */
export default function PartsTable({
  parts,
  discountCeiling,
  discountCeilingWarningText,
  columnLabels,
  availabilityCopy,
  formatEgp,
  deleteLineAriaLabel,
  onQtyChange,
  onDiscountUpdate,
  onRemoveLine,
  getLineTotal,
  addPartPlaceholder,
  readOnly = false,
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
              {columnLabels.qty}
            </th>
            <th className="px-4 py-3 text-label font-semibold text-text-secondary">
              {columnLabels.unitPrice}
            </th>
            <th className="px-4 py-3 text-label font-semibold text-text-secondary">
              {columnLabels.availability}
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
          {parts.map((part) => (
            <PartLineItem
              key={part.id}
              part={part}
              discountCeiling={discountCeiling}
              discountCeilingWarningText={discountCeilingWarningText}
              availabilityCopy={availabilityCopy}
              formatEgp={formatEgp}
              lineTotal={getLineTotal(part)}
              deleteAriaLabel={deleteLineAriaLabel}
              onQtyChange={onQtyChange}
              onDiscountUpdate={onDiscountUpdate}
              onRemoveLine={onRemoveLine}
              readOnly={readOnly}
            />
          ))}
          {!readOnly && <AddPartRow placeholder={addPartPlaceholder} colSpan={colSpan} />}
        </tbody>
      </table>
    </div>
  )
}
