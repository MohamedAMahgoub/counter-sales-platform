/**
 * @param {object} props
 * @param {string} props.message
 */
export default function PendingBanner({ message }) {
  return (
    <div
      className="w-full min-w-desktop border-b border-[#2980B9]/30 bg-[#EBF5FB] px-6 py-2.5 text-body text-[#1A5276]"
      role="status"
    >
      {message}
    </div>
  )
}
