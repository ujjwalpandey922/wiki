const NftMarketButton = ({
  className,
  colorClass,
  text,
  onClick,
}: {
  className?: string
  colorClass: string
  text: string
  onClick: () => void
}) => {
  return (
    <button
      className={`flex justify-center rounded-b rounded-t border border-th-${colorClass} py-1 px-2 text-th-${colorClass} font-bold focus:outline-none md:hover:brightness-75 ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

export default NftMarketButton