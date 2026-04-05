/**
 * @param {object} props
 * @param {string} props.message
 */
export default function BlockedBanner({ message }) {
  return (
    <div
      className="w-full min-w-desktop border-b border-status-alert/40 bg-[#FFEBEE] px-6 py-2.5 text-body text-[#C62828]"
      role="status"
    >
      {message}
    </div>
  )
}
